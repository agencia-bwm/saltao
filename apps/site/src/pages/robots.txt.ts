import type { APIRoute } from "astro";
import { SITE_URL } from "../lib/config";

/** Libera buscadores e crawlers de IA (GEO). O painel e a plataforma ficam em subdomínios próprios, com robots próprio. */
const BOTS = ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended"];

export const GET: APIRoute = () => {
  const corpo = [
    ...BOTS.flatMap((b) => [`User-agent: ${b}`, "Allow: /", ""]),
    "User-agent: *",
    "Allow: /",
    "Disallow: /404/",
    "",
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    "",
  ].join("\n");
  return new Response(corpo, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
