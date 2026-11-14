// @ts-check
import { defineConfig } from "astro/config";

const STRAPI_URL = process.env.STRAPI_URL;
const RESERVAS_URL = process.env.PUBLIC_RESERVAS_URL ?? "https://reservas.saltao.com.br";

/** Domínios liberados na CSP: só GTM/GA4/Ads, Meta, Clarity, YouTube (fachada) e o motor de reservas. */
const GOOGLE = ["https://www.googletagmanager.com", "https://www.google-analytics.com", "https://*.google-analytics.com", "https://www.googleadservices.com", "https://googleads.g.doubleclick.net", "https://www.google.com"];
const META = ["https://connect.facebook.net", "https://www.facebook.com"];
const CLARITY = ["https://www.clarity.ms", "https://*.clarity.ms"];

export default defineConfig({
  site: process.env.SITE_URL ?? "https://www.saltao.com.br",
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  markdown: { syntaxHighlight: false },
  build: {
    format: "directory",
    // CSS crítico inline: zero CSS bloqueante (as folhas por página são pequenas).
    inlineStylesheets: "always",
  },
  // Prefetch ao passar o mouse/tocar (navegação quase instantânea, sem custo no carregamento).
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  image: {
    remotePatterns: STRAPI_URL ? [{ protocol: new URL(STRAPI_URL).protocol.replace(":", ""), hostname: new URL(STRAPI_URL).hostname }] : [],
  },
  security: {
    csp: {
      algorithm: "SHA-256",
      directives: [
        "default-src 'self'",
        `img-src 'self' data: ${[...GOOGLE, ...META, ...CLARITY, "https://i.ytimg.com"].join(" ")}`,
        `connect-src 'self' ${RESERVAS_URL} ${[...GOOGLE, ...META, ...CLARITY].join(" ")}`,
        "frame-src https://www.youtube-nocookie.com https://www.googletagmanager.com https://td.doubleclick.net",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        `form-action 'self' ${RESERVAS_URL}`,
      ],
      scriptDirective: {
        resources: ["'self'", ...GOOGLE, ...META, ...CLARITY],
      },
    },
  },
});
