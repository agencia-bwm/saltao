import type { APIRoute } from "astro";
import { indice } from "../lib/cms";
import { SITE_URL } from "../lib/config";

export const GET: APIRoute = async () => {
  const idx = await indice();
  const lastmod = idx.rotas.map((r) => r.lastmod).sort().at(-1);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE_URL}/sitemap-paginas.xml</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</sitemap>
</sitemapindex>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
