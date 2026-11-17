/**
 * Lighthouse CI — roda em todo PR nas URLs-modelo dos 7 templates (dados de exemplo).
 * PR abaixo da meta não é mesclado (briefing seção 4).
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: [
        "http://localhost/", // Home
        "http://localhost/churrasqueiras-e-quiosques/", // Listagem de produtos
        "http://localhost/churrasqueiras-e-quiosques/quiosque-com-churrasqueira/", // Produto / pacote
        "http://localhost/day-use/", // Landing de categoria (página única)
        "http://localhost/cachoeira-saltao/", // Landing institucional
        "http://localhost/guia/", // Listagem do blog
        "http://localhost/guia/cachoeiras-perto-de-brotas/", // Artigo
        "http://localhost/seguranca/", // Institucional por blocos
        "http://localhost/duvidas-e-contato/", // FAQ / Contato
      ],
      numberOfRuns: 3,
      settings: { chromeFlags: "--no-sandbox --headless=new" }, // preset mobile (padrão)
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 1800, aggregationMethod: "median" }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05, aggregationMethod: "median" }],
        "total-blocking-time": ["error", { maxNumericValue: 150, aggregationMethod: "median" }],
      },
    },
    upload: { target: "temporary-public-storage" },
  },
};
