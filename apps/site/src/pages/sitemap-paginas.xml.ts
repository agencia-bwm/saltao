import type { APIRoute } from "astro";
import { indice } from "../lib/cms";
import { absoluta } from "../lib/config";
import { HTML_LANG } from "../lib/i18n";
import type { Locale } from "../lib/types";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/** Sitemap com lastmod real (updatedAt do painel) e hreflang (xhtml:link) entre PT, EN e ES. Páginas noindex ficam de fora. */
export const GET: APIRoute = async () => {
  const idx = await indice();
  const urls = idx.rotas
    .filter((r) => !r.seo.noindex && !r.seo.canonicalOverride)
    .map((r) => {
      const alts = Object.entries(r.alternates);
      const links = alts.length > 1
        ? [...alts.map(([l, p]) => `<xhtml:link rel="alternate" hreflang="${HTML_LANG[l as Locale]}" href="${esc(absoluta(p!))}"/>`), `<xhtml:link rel="alternate" hreflang="x-default" href="${esc(absoluta(r.alternates.pt ?? r.path))}"/>`].join("")
        : "";
      return `  <url><loc>${esc(absoluta(r.path))}</loc><lastmod>${r.lastmod}</lastmod>${links}</url>`;
    });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
