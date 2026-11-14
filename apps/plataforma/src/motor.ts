/**
 * Núcleo do motor de reservas (refeito para os produtos do Saltão — briefing seção 9).
 *
 * Garantias:
 * - Duas compras simultâneas do mesmo espaço nunca confirmam: cada recurso/dia é uma linha em
 *   `estoque_dia`, travada com SELECT ... FOR UPDATE dentro da transação, sempre em ordem crescente
 *   de (recurso, data) para não haver deadlock. O CHECK (usado <= capacidade) é a última barreira.
 * - Hold de 15 minutos: a vaga é ocupada já no hold; `expirarHolds` devolve o estoque das reservas vencidas.
 * - Reserva só é confirmada pelo webhook do gateway, de forma idempotente (`webhook_evento`).
 */
import { randomBytes, randomInt } from "node:crypto";
import type { Pool } from "mysql2/promise";
import { transacao, type Conexao } from "./db.ts";
import { diasEntre, somarDias, validarData } from "./datas.ts";
import { aplicarCupom, precoDoDia } from "./preco.ts";

export const HOLD_MINUTOS = 15;

export interface ItemPedido {
  produto: string; // slug (= motorProdutoId do painel)
  setor?: string; // slug do setor (quiosques/churrasqueiras)
  faixa?: string; // slug da faixa etária (Day Use / camping)
  dataInicio: string;
  /** Exclusivo. Obrigatório para cobrança por noite; ignorado para cobrança por dia. */
  dataFim?: string;
  quantidade: number;
}

export interface Pedido {
  itens: ItemPedido[];
  cliente?: { nome: string; email: string; telefone?: string; consentimentoLgpd: boolean };
  cupom?: string;
  utm?: Record<string, string>;
  gaClientId?: string;
  canal?: "online" | "balcao";
}

export interface ReservaCriada {
  id: number;
  codigo: string;
  expiraEm: string;
  totalCentavos: number;
  ocupacao: { produto: string; recurso: string; data: string; quantidade: number }[];
}

export class IndisponivelError extends Error {
  readonly produto: string;
  readonly data: string;
  constructor(produto: string, data: string) {
    super(`Sem disponibilidade para ${produto} em ${data}`);
    this.name = "IndisponivelError";
    this.produto = produto;
    this.data = data;
  }
}

type Produto = { id: number; slug: string; cobranca: "dia" | "noite"; unidade: "pessoa" | "espaco" | "unidade"; combo: number };
type Rows<T> = [T[], unknown];

const CODIGO_ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem 0/O/1/I
const novoCodigo = () => Array.from({ length: 8 }, () => CODIGO_ALFABETO[randomInt(CODIGO_ALFABETO.length)]).join("");

async function produtoPorSlug(c: Conexao, slug: string): Promise<Produto> {
  const [r] = (await c.query("SELECT id, slug, cobranca, unidade, combo FROM produto WHERE slug = ? AND ativo = TRUE", [slug])) as Rows<Produto>;
  if (!r[0]) throw new Error(`Produto inexistente ou inativo: ${slug}`);
  return r[0];
}

/**
 * Reserva `quantidade` no estoque de um produto para os dias dados e grava a ocupação do item.
 * - pessoa: soma na lotação de um recurso (Day Use, área de camping), o mesmo em todos os dias;
 * - espaco/unidade: ocupa `quantidade` recursos distintos, livres em todos os dias (aloca automaticamente).
 */
async function alocar(pool: Pool, c: Conexao, itemId: number, p: Produto, setorId: number | null, dias: string[], quantidade: number, contaLotacao: boolean) {
  if (!contaLotacao) return []; // ex.: bebê de colo — não consome lotação
  const filtroSetor = setorId ? "AND r.setor_id = ?" : "";
  const params = setorId ? [p.id, setorId] : [p.id];
  // Candidatos (sem trava) — só para ordenar a tentativa; a decisão é feita sob trava.
  const [candidatos] = (await c.query(
    `SELECT r.id, r.codigo, r.capacidade FROM recurso r WHERE r.produto_id = ? ${filtroSetor} AND r.ativo = TRUE ORDER BY r.id`,
    params,
  )) as Rows<{ id: number; codigo: string; capacidade: number }>;

  const porUnidade = p.unidade === "pessoa" ? quantidade : 1;
  let faltam = p.unidade === "pessoa" ? 1 : quantidade; // quantos recursos ainda precisamos
  const usados: { recurso: string; data: string; quantidade: number }[] = [];

  // As linhas de estoque são criadas FORA da transação (autocommit): INSERT concorrente de linhas novas
  // gera travas de intervalo e deadlock. Dentro da transação só travamos linhas que já existem.
  // Só as que faltam: inserir (mesmo com IGNORE) uma linha que esta transação já trava causaria espera circular.
  if (candidatos.length) {
    const [existentes] = (await c.query("SELECT recurso_id, data FROM estoque_dia WHERE recurso_id IN (?) AND data IN (?)", [candidatos.map((r) => r.id), dias])) as Rows<{ recurso_id: number; data: string }>;
    const tem = new Set(existentes.map((e) => `${e.recurso_id}|${e.data}`));
    const faltando = candidatos.flatMap((r) => dias.filter((d) => !tem.has(`${r.id}|${d}`)).map((d) => [r.id, d, r.capacidade]));
    if (faltando.length) await pool.query("INSERT IGNORE INTO estoque_dia (recurso_id, data, capacidade) VALUES ?", [faltando]);
  }

  for (const r of candidatos) {
    if (faltam === 0) break;
    // Trava em ordem (recurso, data).
    const [linhas] = (await c.query(
      `SELECT data, capacidade, usado, bloqueado FROM estoque_dia WHERE recurso_id = ? AND data IN (?) ORDER BY data FOR UPDATE`,
      [r.id, dias],
    )) as Rows<{ data: string; capacidade: number; usado: number; bloqueado: number }>;
    const cabe = linhas.length === dias.length && linhas.every((l) => !l.bloqueado && l.usado + porUnidade <= l.capacidade);
    if (!cabe) continue;
    await c.query("UPDATE estoque_dia SET usado = usado + ? WHERE recurso_id = ? AND data IN (?)", [porUnidade, r.id, dias]);
    await c.query("INSERT INTO ocupacao (reserva_item_id, recurso_id, data, quantidade) VALUES ?", [dias.map((d) => [itemId, r.id, d, porUnidade])]);
    for (const d of dias) usados.push({ recurso: r.codigo, data: d, quantidade: porUnidade });
    faltam--;
  }
  if (faltam > 0) throw new IndisponivelError(p.slug, dias[0]);
  return usados;
}

/** Devolve ao estoque tudo o que a reserva ocupa (travando em ordem) e apaga a ocupação. */
async function liberar(c: Conexao, reservaId: number) {
  const [ocup] = (await c.query(
    `SELECT o.recurso_id, o.data, SUM(o.quantidade) AS q
       FROM ocupacao o JOIN reserva_item i ON i.id = o.reserva_item_id
      WHERE i.reserva_id = ? GROUP BY o.recurso_id, o.data ORDER BY o.recurso_id, o.data`,
    [reservaId],
  )) as Rows<{ recurso_id: number; data: string; q: number }>;
  for (const o of ocup) {
    await c.query("SELECT usado FROM estoque_dia WHERE recurso_id = ? AND data = ? FOR UPDATE", [o.recurso_id, o.data]);
    await c.query("UPDATE estoque_dia SET usado = usado - ? WHERE recurso_id = ? AND data = ?", [Number(o.q), o.recurso_id, o.data]);
  }
  await c.query("DELETE o FROM ocupacao o JOIN reserva_item i ON i.id = o.reserva_item_id WHERE i.reserva_id = ?", [reservaId]);
}

function diasDoItem(p: Produto, it: { dataInicio: string; dataFim?: string }): string[] {
  validarData(it.dataInicio);
  if (p.cobranca === "dia") return [it.dataInicio];
  if (!it.dataFim) throw new Error(`${p.slug}: informe dataFim (cobrança por noite)`);
  validarData(it.dataFim);
  const dias = diasEntre(it.dataInicio, it.dataFim);
  if (!dias.length || dias.length > 30) throw new Error(`${p.slug}: período inválido`);
  return dias;
}

/** Ocupa o estoque de um item (expandindo combos nos itens que herdam o estoque). */
async function ocuparItem(pool: Pool, c: Conexao, itemId: number, p: Produto, setorId: number | null, faixa: { id: number; conta: boolean } | null, it: ItemPedido) {
  if (!p.combo) return (await alocar(pool, c, itemId, p, setorId, diasDoItem(p, it), it.quantidade, faixa?.conta ?? true)).map((u) => ({ produto: p.slug, ...u }));
  const [comps] = (await c.query("SELECT produto_id, quantidade, dia_offset FROM combo_item WHERE combo_id = ? ORDER BY produto_id, dia_offset", [p.id])) as Rows<{ produto_id: number; quantidade: number; dia_offset: number }>;
  const out = [];
  for (const comp of comps) {
    const [pr] = (await c.query("SELECT id, slug, cobranca, unidade, combo FROM produto WHERE id = ?", [comp.produto_id])) as Rows<Produto>;
    const inicio = somarDias(it.dataInicio, comp.dia_offset);
    const fim = pr[0].cobranca === "noite" ? somarDias(inicio, 1) : undefined;
    const usados = await alocar(pool, c, itemId, pr[0], null, diasDoItem(pr[0], { dataInicio: inicio, dataFim: fim }), comp.quantidade * it.quantidade, true);
    out.push(...usados.map((u) => ({ produto: pr[0].slug, ...u })));
  }
  return out;
}

/** Cria a reserva em "hold" por 15 minutos, já ocupando o estoque. Lança IndisponivelError se não couber. */
export async function criarHold(pool: Pool, pedido: Pedido, agora = new Date()): Promise<ReservaCriada> {
  if (!pedido.itens.length) throw new Error("Pedido sem itens");
  for (const it of pedido.itens) if (!Number.isInteger(it.quantidade) || it.quantidade < 1 || it.quantidade > 200) throw new Error("Quantidade inválida");
  if (pedido.cliente && !pedido.cliente.consentimentoLgpd) throw new Error("Consentimento LGPD obrigatório");

  return transacao(pool, async (c) => {
    let clienteId: number | null = null;
    if (pedido.cliente) {
      const [r] = (await c.query("INSERT INTO cliente (nome, email, telefone, consentimento_lgpd_em) VALUES (?, ?, ?, UTC_TIMESTAMP())", [
        pedido.cliente.nome.slice(0, 120),
        pedido.cliente.email.slice(0, 160).toLowerCase(),
        pedido.cliente.telefone?.slice(0, 30) ?? null,
      ])) as [{ insertId: number }, unknown];
      clienteId = r.insertId;
    }
    const expira = new Date(agora.getTime() + HOLD_MINUTOS * 60_000).toISOString().slice(0, 19).replace("T", " ");
    const codigo = novoCodigo();
    const [res] = (await c.query(
      "INSERT INTO reserva (codigo, cliente_id, status, canal, expira_em, utm, ga_client_id) VALUES (?, ?, 'hold', ?, ?, ?, ?)",
      [codigo, clienteId, pedido.canal ?? "online", expira, pedido.utm ? JSON.stringify(pedido.utm) : null, pedido.gaClientId ?? null],
    )) as [{ insertId: number }, unknown];
    const reservaId = res.insertId;

    // Ordem estável dos itens (produto, setor, data) = ordem estável das travas entre transações.
    const itens = [...pedido.itens].sort((a, b) => `${a.produto}|${a.setor ?? ""}|${a.dataInicio}`.localeCompare(`${b.produto}|${b.setor ?? ""}|${b.dataInicio}`));
    let subtotal = 0;
    const ocupacao: ReservaCriada["ocupacao"] = [];
    for (const it of itens) {
      const p = await produtoPorSlug(c, it.produto);
      let setorId: number | null = null;
      if (it.setor) {
        const [s] = (await c.query("SELECT id FROM setor WHERE slug = ? AND produto_id = ?", [it.setor, p.id])) as Rows<{ id: number }>;
        if (!s[0]) throw new Error(`Setor inexistente: ${it.setor}`);
        setorId = s[0].id;
      }
      let faixa: { id: number; conta: boolean } | null = null;
      if (it.faixa) {
        const [f] = (await c.query("SELECT id, conta_lotacao FROM faixa_etaria WHERE slug = ?", [it.faixa])) as Rows<{ id: number; conta_lotacao: number }>;
        if (!f[0]) throw new Error(`Faixa etária inexistente: ${it.faixa}`);
        faixa = { id: f[0].id, conta: Boolean(f[0].conta_lotacao) };
      }
      const dias = p.combo ? [validarData(it.dataInicio)] : diasDoItem(p, it);
      let valor = 0;
      for (const d of dias) valor += (await precoDoDia(c, p.id, d, faixa?.id ?? null)) * it.quantidade;
      const fim = it.dataFim ?? somarDias(it.dataInicio, 1);
      const [ri] = (await c.query(
        "INSERT INTO reserva_item (reserva_id, produto_id, setor_id, faixa_etaria_id, data_inicio, data_fim, quantidade, valor_centavos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [reservaId, p.id, setorId, faixa?.id ?? null, it.dataInicio, fim, it.quantidade, valor],
      )) as [{ insertId: number }, unknown];
      ocupacao.push(...(await ocuparItem(pool, c, ri.insertId, p, setorId, faixa, it)));
      subtotal += valor;
    }

    let desconto = 0;
    let cupomId: number | null = null;
    if (pedido.cupom) ({ cupomId, desconto } = await aplicarCupom(c, pedido.cupom, subtotal, agora.toISOString().slice(0, 10)));
    const total = subtotal - desconto;
    await c.query("UPDATE reserva SET subtotal_centavos = ?, desconto_centavos = ?, total_centavos = ?, cupom_id = ? WHERE id = ?", [subtotal, desconto, total, cupomId, reservaId]);
    return { id: reservaId, codigo, expiraEm: expira, totalCentavos: total, ocupacao };
  });
}

export interface EventoPagamento {
  gateway: string;
  /** ID único do evento/notificação no gateway (idempotência). */
  eventoId: string;
  gatewayPagamentoId: string;
  reservaCodigo: string;
  status: "aprovado" | "recusado" | "expirado" | "estornado" | "pendente";
  metodo: "pix" | "cartao";
  valorCentavos: number;
}

export type ResultadoPagamento = "duplicado" | "confirmada" | "ja_confirmada" | "estorno_pendente" | "valor_divergente" | "registrado" | "reserva_inexistente";

/**
 * Processa um evento de pagamento JÁ COM ASSINATURA VERIFICADA pelo adaptador do gateway.
 * Idempotente: o mesmo eventoId nunca é processado duas vezes.
 */
export async function processarPagamento(pool: Pool, ev: EventoPagamento): Promise<ResultadoPagamento> {
  return transacao(pool, async (c) => {
    const [ins] = (await c.query("INSERT IGNORE INTO webhook_evento (gateway, evento_id) VALUES (?, ?)", [ev.gateway, ev.eventoId])) as [{ affectedRows: number }, unknown];
    if (ins.affectedRows === 0) return "duplicado";
    const resultado = await aplicarEvento(pool, c, ev);
    await c.query("UPDATE webhook_evento SET resultado = ? WHERE gateway = ? AND evento_id = ?", [resultado, ev.gateway, ev.eventoId]);
    return resultado;
  });
}

async function aplicarEvento(pool: Pool, c: Conexao, ev: EventoPagamento): Promise<ResultadoPagamento> {
  const [rs] = (await c.query("SELECT id, status, total_centavos, expira_em < UTC_TIMESTAMP() AS vencida FROM reserva WHERE codigo = ? FOR UPDATE", [ev.reservaCodigo])) as Rows<{
    id: number;
    status: string;
    total_centavos: number;
    vencida: number;
  }>;
  const r = rs[0];
  if (!r) return "reserva_inexistente";

  await c.query(
    `INSERT INTO pagamento (reserva_id, gateway, gateway_pagamento_id, metodo, status, valor_centavos) VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE status = VALUES(status), valor_centavos = VALUES(valor_centavos)`,
    [r.id, ev.gateway, ev.gatewayPagamentoId, ev.metodo, ev.status, ev.valorCentavos],
  );
  if (ev.status !== "aprovado") return "registrado";
  if (r.status === "confirmada" || r.status === "utilizada") return "ja_confirmada";
  if (ev.valorCentavos !== r.total_centavos) {
    await c.query("UPDATE reserva SET status = 'estorno_pendente' WHERE id = ?", [r.id]);
    return "valor_divergente";
  }

  // Pagou depois do hold vencer (ou já expirado pelo job): tenta ocupar de novo.
  if (r.status === "expirada" || r.vencida) {
    if (r.status !== "expirada") await liberar(c, r.id);
    try {
      await c.query("SAVEPOINT reocupar");
      await reocupar(pool, c, r.id);
    } catch (e) {
      if (!(e instanceof IndisponivelError)) throw e;
      await c.query("ROLLBACK TO SAVEPOINT reocupar");
      await c.query("UPDATE reserva SET status = 'estorno_pendente' WHERE id = ?", [r.id]);
      return "estorno_pendente";
    }
  } else if (r.status !== "hold" && r.status !== "pendente_pagamento") {
    await c.query("UPDATE reserva SET status = 'estorno_pendente' WHERE id = ?", [r.id]);
    return "estorno_pendente";
  }

  await c.query("UPDATE reserva SET status = 'confirmada', confirmado_em = UTC_TIMESTAMP(), expira_em = NULL WHERE id = ?", [r.id]);
  await c.query("INSERT IGNORE INTO voucher (reserva_id, qr_token) VALUES (?, ?)", [r.id, randomBytes(32).toString("base64url")]);
  return "confirmada";
}

async function reocupar(pool: Pool, c: Conexao, reservaId: number) {
  const [itens] = (await c.query(
    `SELECT i.id, p.slug, i.setor_id, i.faixa_etaria_id, f.conta_lotacao, i.data_inicio, i.data_fim, i.quantidade
       FROM reserva_item i JOIN produto p ON p.id = i.produto_id LEFT JOIN faixa_etaria f ON f.id = i.faixa_etaria_id
      WHERE i.reserva_id = ? ORDER BY p.slug, i.setor_id, i.data_inicio`,
    [reservaId],
  )) as Rows<{ id: number; slug: string; setor_id: number | null; faixa_etaria_id: number | null; conta_lotacao: number | null; data_inicio: string; data_fim: string; quantidade: number }>;
  for (const i of itens) {
    const p = await produtoPorSlug(c, i.slug);
    await ocuparItem(pool, c, i.id, p, i.setor_id, i.faixa_etaria_id ? { id: i.faixa_etaria_id, conta: Boolean(i.conta_lotacao) } : null, {
      produto: i.slug,
      dataInicio: i.data_inicio,
      dataFim: i.data_fim,
      quantidade: i.quantidade,
    });
  }
}

/** Job (a cada minuto): expira holds vencidos e devolve as vagas. SKIP LOCKED: não espera reservas em pagamento. */
export async function expirarHolds(pool: Pool, limite = 200): Promise<number> {
  return transacao(pool, async (c) => {
    const [rs] = (await c.query(
      `SELECT id FROM reserva WHERE status IN ('hold','pendente_pagamento') AND expira_em < UTC_TIMESTAMP() ORDER BY id LIMIT ? FOR UPDATE SKIP LOCKED`,
      [limite],
    )) as Rows<{ id: number }>;
    for (const r of rs) {
      await liberar(c, r.id);
      await c.query("UPDATE reserva SET status = 'expirada' WHERE id = ?", [r.id]);
    }
    return rs.length;
  });
}

/** Cancela (cliente ou admin) e devolve as vagas. A regra de reembolso fica na política do produto. */
export async function cancelar(pool: Pool, codigo: string): Promise<void> {
  await transacao(pool, async (c) => {
    const [rs] = (await c.query("SELECT id, status FROM reserva WHERE codigo = ? FOR UPDATE", [codigo])) as Rows<{ id: number; status: string }>;
    if (!rs[0] || !["hold", "pendente_pagamento", "confirmada"].includes(rs[0].status)) throw new Error("Reserva não pode ser cancelada");
    await liberar(c, rs[0].id);
    await c.query("UPDATE reserva SET status = 'cancelada' WHERE id = ?", [rs[0].id]);
  });
}

/** Portaria: lê o QR do voucher e marca a entrada (uma vez só). */
export async function registrarEntrada(pool: Pool, qrToken: string, usuarioId: number): Promise<{ ok: boolean; motivo?: string; codigo?: string }> {
  return transacao(pool, async (c) => {
    const [vs] = (await c.query(
      "SELECT v.reserva_id, v.usado_em, r.codigo, r.status FROM voucher v JOIN reserva r ON r.id = v.reserva_id WHERE v.qr_token = ? FOR UPDATE",
      [qrToken],
    )) as Rows<{ reserva_id: number; usado_em: string | null; codigo: string; status: string }>;
    const v = vs[0];
    if (!v) return { ok: false, motivo: "voucher_invalido" };
    if (v.usado_em) return { ok: false, motivo: "ja_utilizado", codigo: v.codigo };
    if (v.status !== "confirmada") return { ok: false, motivo: `reserva_${v.status}`, codigo: v.codigo };
    await c.query("UPDATE voucher SET usado_em = UTC_TIMESTAMP(), usado_por = ? WHERE reserva_id = ?", [usuarioId, v.reserva_id]);
    await c.query("UPDATE reserva SET status = 'utilizada' WHERE id = ?", [v.reserva_id]);
    await c.query("INSERT INTO checkin (reserva_id, usuario_id) VALUES (?, ?)", [v.reserva_id, usuarioId]);
    return { ok: true, codigo: v.codigo };
  });
}

/** API de leitura para o site: vagas por dia (GET /api/produtos/:id/disponibilidade?de=&ate=). */
export async function disponibilidade(pool: Pool, produtoSlug: string, de: string, ate: string, setorSlug?: string) {
  validarData(de);
  validarData(ate);
  const dias = diasEntre(de, somarDias(ate, 1));
  if (dias.length > 120) throw new Error("Intervalo máximo: 120 dias");
  const [ps] = (await pool.query("SELECT id, unidade FROM produto WHERE slug = ? AND ativo = TRUE", [produtoSlug])) as Rows<{ id: number; unidade: string }>;
  if (!ps[0]) throw new Error("Produto inexistente");
  const params: unknown[] = [ps[0].id];
  let filtro = "";
  if (setorSlug) {
    filtro = "AND r.setor_id = (SELECT id FROM setor WHERE slug = ?)";
    params.push(setorSlug);
  }
  const [recs] = (await pool.query(`SELECT r.id, r.capacidade FROM recurso r WHERE r.produto_id = ? AND r.ativo = TRUE ${filtro}`, params)) as Rows<{ id: number; capacidade: number }>;
  if (!recs.length) return dias.map((data) => ({ data, vagas: 0 }));
  const [est] = (await pool.query("SELECT recurso_id, data, capacidade, usado, bloqueado FROM estoque_dia WHERE recurso_id IN (?) AND data BETWEEN ? AND ?", [recs.map((r) => r.id), de, ate])) as Rows<{
    recurso_id: number;
    data: string;
    capacidade: number;
    usado: number;
    bloqueado: number;
  }>;
  const mapa = new Map(est.map((e) => [`${e.recurso_id}|${e.data}`, e]));
  return dias.map((data) => {
    let vagas = 0;
    for (const r of recs) {
      const e = mapa.get(`${r.id}|${data}`);
      const livre = e ? (e.bloqueado ? 0 : e.capacidade - e.usado) : r.capacidade;
      vagas += ps[0].unidade === "pessoa" ? livre : livre > 0 ? 1 : 0;
    }
    return { data, vagas };
  });
}
