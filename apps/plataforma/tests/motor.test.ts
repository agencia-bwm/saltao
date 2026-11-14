/**
 * Testes obrigatórios antes de vender (briefing seção 9), contra um MySQL/MariaDB real.
 * Uso: DATABASE_URL_TEST=mysql://saltao:saltao@localhost:3306/saltao_plataforma_test npm test
 * (no CI, um serviço MariaDB sobe só para isso). O banco de teste é APAGADO a cada execução.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import { criarPool } from "../src/db.ts";
import { criarHold, processarPagamento, expirarHolds, disponibilidade, registrarEntrada, cancelar, IndisponivelError } from "../src/motor.ts";
import { precoDoDia } from "../src/preco.ts";
import { migrar } from "../scripts/migrar.ts";

const URL = process.env.DATABASE_URL_TEST;
const pular = !URL;
let pool: Pool;
const DIA = "2026-12-19"; // sábado
const FERIADO = "2026-12-25";

before(async () => {
  if (pular) return;
  const u = new globalThis.URL(URL!);
  const nome = u.pathname.slice(1);
  if (!nome.endsWith("_test")) throw new Error("Por segurança, o banco de teste precisa terminar em _test");
  const c = await mysql.createConnection({ uri: URL, multipleStatements: true });
  const [tabelas] = (await c.query("SELECT table_name AS t FROM information_schema.tables WHERE table_schema = ?", [nome])) as [{ t: string }[], unknown];
  await c.query("SET FOREIGN_KEY_CHECKS = 0");
  for (const { t } of tabelas) await c.query(`DROP TABLE \`${t}\``);
  await c.query("SET FOREIGN_KEY_CHECKS = 1");
  await c.end();
  await migrar(URL);
  pool = criarPool(URL);
  pool.pool.config.connectionLimit = 25;

  const q = (sql: string, p: unknown[] = []) => pool.query(sql, p);
  await q("INSERT INTO faixa_etaria (slug, nome, idade_min, idade_max, conta_lotacao) VALUES ('inteira','Inteira',12,59,1),('meia','Meia',6,11,1),('colo','Colo',0,5,0)");
  await q(`INSERT INTO produto (id, slug, nome, cobranca, unidade, combo) VALUES
    (1,'day-use','Day Use','dia','pessoa',0),
    (2,'quiosque','Quiosque','dia','espaco',0),
    (3,'apartamento','Apartamento','noite','unidade',0),
    (4,'combo-familia','Combo Família','noite','unidade',1)`);
  await q("INSERT INTO setor (id, produto_id, slug, nome) VALUES (1,2,'beira-rio','Beira-rio'),(2,2,'unico','Setor de 1 quiosque')");
  await q("INSERT INTO recurso (produto_id, setor_id, codigo, capacidade) VALUES (1,NULL,'DAYUSE',10),(2,1,'Q-1',1),(2,1,'Q-2',1),(2,1,'Q-3',1),(2,2,'Q-99',1),(3,NULL,'APTO-1',1)");
  await q("INSERT INTO combo_item (combo_id, produto_id, quantidade, dia_offset) VALUES (4,3,1,0),(4,1,2,1)");
  await q(`INSERT INTO tarifa (produto_id, faixa_etaria_id, tipo, dias_semana, valor_centavos, prioridade) VALUES
    (1,1,'base',NULL,6000,10),(1,2,'base',NULL,3000,10),(1,3,'base',NULL,0,10),
    (1,1,'fim_de_semana','6,7',8000,30),
    (1,1,'feriado',NULL,10000,40),
    (2,NULL,'base',NULL,12000,10),(3,NULL,'base',NULL,28000,10),(4,NULL,'base',NULL,39000,10)`);
  await q("INSERT INTO feriado (data, nome) VALUES (?, 'Natal')", [FERIADO]);
  await q("INSERT INTO cupom (codigo, tipo, valor, limite_usos) VALUES ('VERAO10','percentual',10,1)");
  await q("INSERT INTO usuario (id, nome, email, senha_hash, papel) VALUES (1,'Portaria','portaria@teste','x','portaria')");
});

after(async () => {
  if (!pular) await pool.end();
});

const t = (nome: string, fn: () => Promise<void>) => test(nome, { skip: pular && "defina DATABASE_URL_TEST" }, fn);
const resultados = async <T,>(ps: Promise<T>[]) => Promise.allSettled(ps);

t("duas compras simultâneas do mesmo quiosque: só uma confirma", async () => {
  const r = await resultados(Array.from({ length: 20 }, () => criarHold(pool, { itens: [{ produto: "quiosque", setor: "unico", dataInicio: DIA, quantidade: 1 }] })));
  assert.equal(r.filter((x) => x.status === "fulfilled").length, 1);
  assert.ok(r.filter((x) => x.status === "rejected").every((x) => (x as PromiseRejectedResult).reason instanceof IndisponivelError));
});

t("setor com 3 quiosques: 3 reservas, cada uma num espaço diferente", async () => {
  const r = await resultados(Array.from({ length: 10 }, () => criarHold(pool, { itens: [{ produto: "quiosque", setor: "beira-rio", dataInicio: DIA, quantidade: 1 }] })));
  const ok = r.filter((x) => x.status === "fulfilled").map((x) => (x as PromiseFulfilledResult<Awaited<ReturnType<typeof criarHold>>>).value);
  assert.equal(ok.length, 3);
  assert.deepEqual(new Set(ok.map((o) => o.ocupacao[0].recurso)), new Set(["Q-1", "Q-2", "Q-3"]));
  const disp = await disponibilidade(pool, "quiosque", DIA, DIA, "beira-rio");
  assert.equal(disp[0].vagas, 0);
});

t("lotação do Day Use: 15 compras simultâneas para 10 vagas → 10 passam", async () => {
  const dia = "2026-12-21";
  const r = await resultados(Array.from({ length: 15 }, () => criarHold(pool, { itens: [{ produto: "day-use", faixa: "inteira", dataInicio: dia, quantidade: 1 }] })));
  assert.equal(r.filter((x) => x.status === "fulfilled").length, 10);
  // criança de colo não conta lotação
  await criarHold(pool, { itens: [{ produto: "day-use", faixa: "colo", dataInicio: dia, quantidade: 2 }] });
  assert.equal((await disponibilidade(pool, "day-use", dia, dia))[0].vagas, 0);
});

t("apartamento: estadias sobrepostas não convivem; períodos encostados sim", async () => {
  await criarHold(pool, { itens: [{ produto: "apartamento", dataInicio: "2027-01-10", dataFim: "2027-01-13", quantidade: 1 }] });
  await assert.rejects(criarHold(pool, { itens: [{ produto: "apartamento", dataInicio: "2027-01-12", dataFim: "2027-01-14", quantidade: 1 }] }), IndisponivelError);
  await criarHold(pool, { itens: [{ produto: "apartamento", dataInicio: "2027-01-13", dataFim: "2027-01-15", quantidade: 1 }] });
});

t("preço por data: feriado > fim de semana > base, por faixa etária", async () => {
  assert.equal(await precoDoDia(pool, 1, "2026-12-16", 1), 6000); // quarta
  assert.equal(await precoDoDia(pool, 1, DIA, 1), 8000); // sábado
  assert.equal(await precoDoDia(pool, 1, FERIADO, 1), 10000); // feriado (sexta)
  assert.equal(await precoDoDia(pool, 1, DIA, 2), 3000); // meia não tem tarifa de fim de semana
  const r = await criarHold(pool, { itens: [{ produto: "day-use", faixa: "inteira", dataInicio: "2026-12-16", quantidade: 2 }, { produto: "day-use", faixa: "meia", dataInicio: "2026-12-16", quantidade: 1 }], cupom: "verao10" });
  assert.equal(r.totalCentavos, Math.round((6000 * 2 + 3000) * 0.9));
  await assert.rejects(criarHold(pool, { itens: [{ produto: "day-use", faixa: "inteira", dataInicio: "2026-12-16", quantidade: 1 }], cupom: "VERAO10" }), /Cupom/);
});

t("combo herda o estoque dos itens (apartamento + 2 day use no dia seguinte)", async () => {
  const r = await criarHold(pool, { itens: [{ produto: "combo-familia", dataInicio: "2027-02-01", quantidade: 1 }] });
  assert.deepEqual(r.ocupacao.map((o) => `${o.produto}:${o.data}:${o.quantidade}`).sort(), ["apartamento:2027-02-01:1", "day-use:2027-02-02:2"]);
  assert.equal(r.totalCentavos, 39000);
  await assert.rejects(criarHold(pool, { itens: [{ produto: "apartamento", dataInicio: "2027-02-01", dataFim: "2027-02-02", quantidade: 1 }] }), IndisponivelError);
});

t("webhook repetido não duplica; voucher criado uma vez; portaria marca a entrada uma vez", async () => {
  const r = await criarHold(pool, { itens: [{ produto: "quiosque", setor: "beira-rio", dataInicio: "2027-03-06", quantidade: 1 }] });
  const ev = { gateway: "mercadopago", eventoId: "evt-1", gatewayPagamentoId: "pay-1", reservaCodigo: r.codigo, status: "aprovado" as const, metodo: "pix" as const, valorCentavos: r.totalCentavos };
  const em = await Promise.all([processarPagamento(pool, ev), processarPagamento(pool, ev), processarPagamento(pool, ev)]);
  assert.deepEqual(em.sort(), ["confirmada", "duplicado", "duplicado"]);
  assert.equal(await processarPagamento(pool, { ...ev, eventoId: "evt-2" }), "ja_confirmada");
  const [v] = (await pool.query("SELECT qr_token FROM voucher v JOIN reserva r ON r.id = v.reserva_id WHERE r.codigo = ?", [r.codigo])) as [{ qr_token: string }[], unknown];
  assert.equal(v.length, 1);
  assert.deepEqual(await registrarEntrada(pool, v[0].qr_token, 1), { ok: true, codigo: r.codigo });
  assert.equal((await registrarEntrada(pool, v[0].qr_token, 1)).motivo, "ja_utilizado");
});

t("valor divergente não confirma", async () => {
  const r = await criarHold(pool, { itens: [{ produto: "quiosque", setor: "beira-rio", dataInicio: "2027-03-07", quantidade: 1 }] });
  assert.equal(await processarPagamento(pool, { gateway: "mercadopago", eventoId: "evt-div", gatewayPagamentoId: "pay-div", reservaCodigo: r.codigo, status: "aprovado", metodo: "cartao", valorCentavos: 1 }), "valor_divergente");
});

t("reserva não paga libera a vaga após 15 minutos", async () => {
  const dia = "2027-04-03";
  const antigo = new Date(Date.now() - 16 * 60_000);
  const r = await criarHold(pool, { itens: [{ produto: "quiosque", setor: "unico", dataInicio: dia, quantidade: 1 }] }, antigo);
  await assert.rejects(criarHold(pool, { itens: [{ produto: "quiosque", setor: "unico", dataInicio: dia, quantidade: 1 }] }), IndisponivelError);
  assert.ok((await expirarHolds(pool)) >= 1);
  const [s] = (await pool.query("SELECT status FROM reserva WHERE codigo = ?", [r.codigo])) as [{ status: string }[], unknown];
  assert.equal(s[0].status, "expirada");
  const nova = await criarHold(pool, { itens: [{ produto: "quiosque", setor: "unico", dataInicio: dia, quantidade: 1 }] });
  assert.equal(nova.ocupacao[0].recurso, "Q-99");
  // Pagamento da reserva expirada chega depois que outra pessoa pegou a vaga → estorno
  assert.equal(await processarPagamento(pool, { gateway: "mercadopago", eventoId: "evt-tarde", gatewayPagamentoId: "pay-tarde", reservaCodigo: r.codigo, status: "aprovado", metodo: "pix", valorCentavos: r.totalCentavos }), "estorno_pendente");
});

t("pagamento após expirar, com vaga ainda livre → confirma", async () => {
  const dia = "2027-04-10";
  const r = await criarHold(pool, { itens: [{ produto: "quiosque", setor: "unico", dataInicio: dia, quantidade: 1 }] }, new Date(Date.now() - 20 * 60_000));
  await expirarHolds(pool);
  assert.equal(await processarPagamento(pool, { gateway: "mercadopago", eventoId: "evt-ok-tarde", gatewayPagamentoId: "pay-ok-tarde", reservaCodigo: r.codigo, status: "aprovado", metodo: "pix", valorCentavos: r.totalCentavos }), "confirmada");
  assert.equal((await disponibilidade(pool, "quiosque", dia, dia, "unico"))[0].vagas, 0);
});

t("cancelar devolve a vaga", async () => {
  const dia = "2027-05-01";
  const r = await criarHold(pool, { itens: [{ produto: "quiosque", setor: "unico", dataInicio: dia, quantidade: 1 }] });
  await cancelar(pool, r.codigo);
  assert.equal((await disponibilidade(pool, "quiosque", dia, dia, "unico"))[0].vagas, 1);
});

t("estoque nunca fica inconsistente (usado = soma das ocupações)", async () => {
  const [dif] = (await pool.query(`
    SELECT e.recurso_id, e.data, e.usado, COALESCE(SUM(o.quantidade),0) AS ocup
      FROM estoque_dia e LEFT JOIN ocupacao o ON o.recurso_id = e.recurso_id AND o.data = e.data
     GROUP BY e.recurso_id, e.data, e.usado HAVING e.usado <> ocup`)) as [unknown[], unknown];
  assert.deepEqual(dif, []);
});
