#!/usr/bin/env node
/**
 * IndexNow: avisa Bing (e quem participa do protocolo) que as URLs mudaram — o Bing alimenta a busca do
 * ChatGPT e do Copilot. Roda no deploy, depois que o site está no ar. Precisa de INDEXNOW_KEY.
 * O arquivo de verificação /<chave>.txt é gerado pelo postbuild.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const key = process.env.INDEXNOW_KEY;
const site = new URL(process.env.SITE_URL ?? "https://www.saltao.com.br");
if (!key) {
  console.log("INDEXNOW_KEY ausente — ping não enviado");
  process.exit(0);
}
const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const urls = [...readFileSync(join(dist, "sitemap-paginas.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).slice(0, 10000);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: site.host, key, keyLocation: `${site.origin}/${key}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} (${urls.length} URLs)`);
if (res.status >= 400 && res.status !== 429) process.exit(1);
