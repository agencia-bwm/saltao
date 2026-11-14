/** Cron da Hostinger (a cada minuto): node scripts/expirar-holds.ts */
import { criarPool } from "../src/db.ts";
import { expirarHolds } from "../src/motor.ts";

const pool = criarPool();
try {
  const n = await expirarHolds(pool);
  if (n) console.log(`${new Date().toISOString()} holds expirados: ${n}`);
} finally {
  await pool.end();
}
