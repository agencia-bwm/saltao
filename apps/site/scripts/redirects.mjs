/**
 * Mapa de 301 da migração (migracao/redirects.csv, colunas: de,para).
 * "de" = caminho antigo (ex.: /pacotes/day-use.html); "para" = caminho novo (ex.: /day-use/).
 */
export function lerRedirects(csv) {
  return csv
    .split(/\r?\n/)
    .slice(1)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l, i) => {
      const [de, para] = l.split(",").map((s) => s.trim());
      return { de, para, linha: i + 2 };
    });
}

/** Regras: caminhos começam com "/", sem duplicatas, sem cadeia (destino que também é origem), sem loop. */
export function validarRedirects(lista) {
  const erros = [];
  const origens = new Map();
  for (const r of lista) {
    if (!r.de?.startsWith("/")) erros.push(`linha ${r.linha}: "de" deve começar com / (${r.de})`);
    if (!r.para || !(r.para.startsWith("/") || r.para.startsWith("https://"))) erros.push(`linha ${r.linha}: "para" inválido (${r.para})`);
    if (r.de === r.para) erros.push(`linha ${r.linha}: redireciona para si mesmo (${r.de})`);
    if (origens.has(r.de)) erros.push(`linha ${r.linha}: origem duplicada (${r.de}, já na linha ${origens.get(r.de)})`);
    origens.set(r.de, r.linha);
  }
  for (const r of lista) {
    if (r.de !== r.para && origens.has(r.para)) erros.push(`linha ${r.linha}: cadeia de redirecionamento (${r.de} → ${r.para} → ...). Aponte direto para o destino final.`);
  }
  return erros;
}
