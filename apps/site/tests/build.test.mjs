/**
 * Testes do site gerado (rodam depois do `astro build`). São a "validação de schema" do CI:
 * H1 único, meta tags, canonical, hreflang recíproco, JSON-LD válido por template, sitemap, robots e llms.txt.
 * Uso: pnpm --filter @saltao/site build && pnpm --filter @saltao/site test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { lerRedirects, validarRedirects } from "../scripts/redirects.mjs";

const dist = fileURLToPath(new URL("../dist", import.meta.url));
const SITE = (process.env.SITE_URL ?? "https://www.saltao.com.br").replace(/\/$/, "");

function htmls(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? htmls(p) : f.endsWith(".html") ? [p] : [];
  });
}
const paginas = htmls(dist)
  .filter((f) => !f.endsWith("404.html"))
  .map((f) => {
    const html = readFileSync(f, "utf8");
    const path = "/" + relative(dist, f).replace(/index\.html$/, "");
    return { f, path, html };
  });

const attr = (html, re) => [...html.matchAll(re)].map((m) => m[1]);
const jsonld = (html) => attr(html, /<script type="application\/ld\+json">(.*?)<\/script>/gs).map((s) => JSON.parse(s));
const nos = (html) => jsonld(html).flatMap((j) => j["@graph"] ?? [j]);
const tipos = (n) => [].concat(n["@type"] ?? []);

test("há páginas geradas", () => assert.ok(paginas.length > 10));

for (const { path, html } of paginas) {
  test(`SEO básico ${path}`, () => {
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, "exatamente um H1");
    const title = attr(html, /<title>(.*?)<\/title>/g)[0];
    assert.ok(title, "title");
    const desc = attr(html, /<meta name="description" content="([^"]*)"/g)[0];
    assert.ok(desc && desc.length > 20, "meta description");
    assert.ok(desc.length <= 160, `meta description com ${desc.length} caracteres`);
    const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/g)[0];
    assert.equal(canonical, SITE + path, "canonical aponta para a própria URL");
    assert.match(html, /<html lang="(pt-BR|en|es)"/);
    assert.match(html, /http-equiv="content-security-policy"/i, "CSP presente");
    assert.match(html, /gtag\("consent", "default"/, "Consent Mode default antes das tags");
  });

  test(`JSON-LD ${path}`, () => {
    const lista = nos(html);
    const temTipo = (t) => lista.some((n) => tipos(n).includes(t));
    assert.ok(temTipo("LocalBusiness") && temTipo("TouristAttraction"), "nó global");
    assert.ok(temTipo("WebSite"), "WebSite");
    for (const n of lista) {
      const t = tipos(n);
      assert.ok(!("aggregateRating" in n) || t.includes("Product"), "aggregateRating só em Product (decisão 7)");
      if (t.includes("Product") || t.includes("TouristTrip")) {
        assert.ok(n.offers?.price && n.offers.priceCurrency === "BRL", "Product/TouristTrip com Offer em BRL");
        assert.ok(Array.isArray(n.image) && n.image.length > 0, "imagem do produto");
      }
      if (t.includes("LodgingBusiness") || t.includes("Campground")) {
        assert.ok(n.address && n.makesOffer?.price, "hospedagem com endereço e oferta");
      }
      if (t.includes("BlogPosting") || t.includes("Article")) {
        for (const k of ["headline", "datePublished", "dateModified", "image", "author"]) assert.ok(n[k], `Article.${k}`);
      }
      if (t.includes("FAQPage")) {
        assert.ok(n.mainEntity.length > 0);
        for (const q of n.mainEntity) assert.ok(q.name && q.acceptedAnswer?.text, "pergunta e resposta");
      }
      if (t.includes("BreadcrumbList")) {
        n.itemListElement.forEach((it, i) => assert.equal(it.position, i + 1));
        assert.equal(n.itemListElement.at(-1).item, SITE + path, "última migalha = página atual");
      }
    }
  });
}

test("hreflang recíproco e com x-default", () => {
  const porUrl = new Map(paginas.map((p) => [SITE + p.path, p]));
  for (const p of paginas) {
    const alts = [...p.html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ lang: m[1], href: m[2] }));
    if (!alts.length) continue;
    assert.ok(alts.some((a) => a.lang === "x-default"), `${p.path}: x-default`);
    assert.ok(alts.some((a) => a.href === SITE + p.path), `${p.path}: inclui a si mesma`);
    for (const a of alts.filter((a) => a.lang !== "x-default")) {
      const outra = porUrl.get(a.href);
      assert.ok(outra, `${p.path}: alternate ${a.href} existe`);
      assert.ok(outra.html.includes(`href="${SITE + p.path}"`), `${a.href} aponta de volta para ${p.path}`);
    }
  }
});

test("sitemap lista só URLs existentes, com lastmod", () => {
  const xml = readFileSync(join(dist, "sitemap-paginas.xml"), "utf8");
  const locs = attr(xml, /<loc>([^<]+)<\/loc>/g);
  assert.ok(locs.length >= paginas.length - 1);
  for (const loc of locs) {
    const arq = join(dist, loc.replace(SITE, ""), "index.html");
    assert.ok(existsSync(arq), `sitemap: ${loc} existe`);
  }
  assert.equal((xml.match(/<lastmod>/g) ?? []).length, locs.length);
  assert.match(readFileSync(join(dist, "sitemap-index.xml"), "utf8"), /sitemap-paginas\.xml/);
});

test("robots.txt libera crawlers de IA e aponta o sitemap", () => {
  const r = readFileSync(join(dist, "robots.txt"), "utf8");
  for (const bot of ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended"]) assert.match(r, new RegExp(`User-agent: ${bot}\\nAllow: /`));
  assert.match(r, /Sitemap: https:\/\/.+\/sitemap-index\.xml/);
});

test("llms.txt gerado", () => {
  const t = readFileSync(join(dist, "llms.txt"), "utf8");
  assert.match(t, /^# /);
  assert.match(t, /\n> /);
  assert.match(t, /## Ingressos, hospedagem e espaços/);
});

test(".htaccess com headers de segurança e cache", () => {
  const h = readFileSync(join(dist, ".htaccess"), "utf8");
  for (const s of ["Strict-Transport-Security", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "frame-ancestors 'self'", "immutable", "ErrorDocument 404"]) assert.ok(h.includes(s), s);
});

test("JS inicial por página ≤ 50 KB (gzip, sem GTM)", async () => {
  const { gzipSync } = await import("node:zlib");
  for (const p of paginas) {
    const srcs = attr(p.html, /<script type="module" src="([^"]+)"/g);
    const total = srcs.reduce((s, src) => s + gzipSync(readFileSync(join(dist, src))).length, 0);
    assert.ok(total <= 50 * 1024, `${p.path}: ${total} bytes`);
  }
});

test("validação do mapa de 301", () => {
  assert.deepEqual(validarRedirects(lerRedirects("de,para\n/a.html,/a/\n/b.html,/b/")), []);
  assert.equal(validarRedirects(lerRedirects("de,para\n/a.html,/b.html\n/b.html,/c/")).length, 1, "detecta cadeia");
  assert.equal(validarRedirects(lerRedirects("de,para\n/a/,/a/")).length, 1, "detecta loop");
  assert.equal(validarRedirects(lerRedirects("de,para\n/a,/x/\n/a,/y/")).length, 1, "detecta duplicata");
});
