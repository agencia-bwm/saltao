/** Aplica as migrações SQL pendentes (db/migracoes/*.sql), em ordem, registrando em `migracao`. */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import mysql from "mysql2/promise";

const pasta = join(import.meta.dirname, "..", "db", "migracoes");

export async function migrar(url = process.env.DATABASE_URL!) {
  const c = await mysql.createConnection({ uri: url, multipleStatements: true });
  try {
    await c.query("CREATE TABLE IF NOT EXISTS migracao (nome VARCHAR(120) PRIMARY KEY, aplicada_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB");
    const [feitas] = (await c.query("SELECT nome FROM migracao")) as [{ nome: string }[], unknown];
    const ja = new Set(feitas.map((f) => f.nome));
    for (const arq of readdirSync(pasta).filter((f) => f.endsWith(".sql")).sort()) {
      if (ja.has(arq)) continue;
      const sql = readFileSync(join(pasta, arq), "utf8");
      await c.query(sql);
      await c.query("INSERT INTO migracao (nome) VALUES (?)", [arq]);
      console.log(`migração aplicada: ${arq}`);
    }
  } finally {
    await c.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  migrar().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
