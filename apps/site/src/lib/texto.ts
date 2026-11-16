/**
 * Destaque no texto do painel: *palavra* vira <em> (estilizado com o degradê dos arcos).
 * Usado em títulos editoriais (hero, H2 da home, citação, chamada final). Sempre escapa o HTML.
 */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function enfase(texto: string): string {
  return esc(texto)
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\r?\n/g, "<br />");
}

/** Mesmo texto sem os asteriscos (meta tags, alt, JSON-LD). */
export function semEnfase(texto: string): string {
  return texto.replace(/\*([^*]+)\*/g, "$1");
}
