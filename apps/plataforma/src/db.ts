import mysql from "mysql2/promise";
import type { Pool, PoolConnection } from "mysql2/promise";

/**
 * Pool pequeno: a Hostinger permite 75 conexões no total, divididas entre painel e plataforma.
 * dateStrings evita conversão de fuso nas colunas DATE/DATETIME (todas em UTC no banco).
 */
export function criarPool(url = process.env.DATABASE_URL): Pool {
  if (!url) throw new Error("DATABASE_URL não definida (ex.: mysql://usuario:senha@localhost:3306/plataforma)");
  return mysql.createPool({
    uri: url,
    connectionLimit: Number(process.env.DATABASE_POOL_MAX ?? 8),
    dateStrings: true,
    timezone: "Z",
    multipleStatements: false,
    namedPlaceholders: false,
    supportBigNumbers: true,
  });
}

export type Conexao = PoolConnection;

const ERROS_TRANSITORIOS = new Set(["ER_LOCK_DEADLOCK", "ER_LOCK_WAIT_TIMEOUT"]);

/** Executa `fn` numa transação; repete em deadlock/timeout de trava (até 5 vezes, com espera aleatória). */
export async function transacao<T>(pool: Pool, fn: (c: Conexao) => Promise<T>): Promise<T> {
  for (let tentativa = 1; ; tentativa++) {
    const c = await pool.getConnection();
    try {
      await c.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
      await c.beginTransaction();
      const r = await fn(c);
      await c.commit();
      return r;
    } catch (e) {
      await c.rollback().catch(() => {});
      const code = (e as { code?: string }).code;
      if (code && ERROS_TRANSITORIOS.has(code) && tentativa < 5) {
        await new Promise((r) => setTimeout(r, 20 * tentativa + Math.random() * 30));
        continue;
      }
      throw e;
    } finally {
      c.release();
    }
  }
}
