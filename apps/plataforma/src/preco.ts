import type { Conexao } from "./db.ts";
import type { Pool } from "mysql2/promise";
import { diaSemanaIso } from "./datas.ts";

/**
 * Preço de um produto num dia, para uma faixa etária.
 * Regra: entre as tarifas válidas na data, vence a de maior prioridade
 * (convenção: feriado 40 > fim de semana 30 > temporada 20 > base 10). Tarifa específica da faixa
 * ganha da genérica (faixa NULL) na mesma prioridade.
 */
export async function precoDoDia(db: Conexao | Pool, produtoId: number, data: string, faixaId: number | null): Promise<number> {
  const [feriado] = (await db.query("SELECT 1 FROM feriado WHERE data = ?", [data])) as [unknown[], unknown];
  const ehFeriado = feriado.length > 0;
  const dia = String(diaSemanaIso(data));
  const [rows] = (await db.query(
    `SELECT tipo, valor_centavos, prioridade, faixa_etaria_id
       FROM tarifa
      WHERE produto_id = ?
        AND (faixa_etaria_id = ? OR faixa_etaria_id IS NULL)
        AND (data_inicio IS NULL OR data_inicio <= ?)
        AND (data_fim IS NULL OR data_fim >= ?)
        AND (dias_semana IS NULL OR FIND_IN_SET(?, dias_semana) > 0)
      ORDER BY prioridade DESC, faixa_etaria_id IS NULL ASC`,
    [produtoId, faixaId, data, data, dia],
  )) as [{ tipo: string; valor_centavos: number }[], unknown];
  const valida = rows.find((t) => t.tipo !== "feriado" || ehFeriado);
  if (!valida) throw new SemTarifaError(produtoId, data);
  return valida.valor_centavos;
}

export class SemTarifaError extends Error {
  constructor(produtoId: number, data: string) {
    super(`Sem tarifa para o produto ${produtoId} em ${data}`);
    this.name = "SemTarifaError";
  }
}

/** Aplica cupom e devolve o desconto em centavos (trava o cupom para contar o uso com segurança). */
export async function aplicarCupom(c: Conexao, codigo: string, subtotal: number, hoje: string): Promise<{ cupomId: number; desconto: number }> {
  const [rows] = (await c.query(
    `SELECT id, tipo, valor, limite_usos, usos FROM cupom
      WHERE codigo = ? AND ativo = TRUE
        AND (valido_de IS NULL OR valido_de <= ?) AND (valido_ate IS NULL OR valido_ate >= ?)
      FOR UPDATE`,
    [codigo.trim().toUpperCase(), hoje, hoje],
  )) as [{ id: number; tipo: "percentual" | "valor"; valor: number; limite_usos: number | null; usos: number }[], unknown];
  const cupom = rows[0];
  if (!cupom || (cupom.limite_usos !== null && cupom.usos >= cupom.limite_usos)) throw new CupomInvalidoError(codigo);
  const desconto = Math.min(subtotal, cupom.tipo === "percentual" ? Math.round((subtotal * cupom.valor) / 100) : cupom.valor);
  await c.query("UPDATE cupom SET usos = usos + 1 WHERE id = ?", [cupom.id]);
  return { cupomId: cupom.id, desconto };
}

export class CupomInvalidoError extends Error {
  constructor(codigo: string) {
    super(`Cupom inválido ou esgotado: ${codigo}`);
    this.name = "CupomInvalidoError";
  }
}
