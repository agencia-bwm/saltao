# CLAUDE.md — Site Saltão (Agência BWM)

Regras do projeto para o Claude. Fonte da verdade: `docs/briefing-tecnico.md` + decisões em `docs/passo-1-decisoes.md`.
Se algo aqui conflitar com o briefing, siga o briefing e avise.

## Stack
- `apps/site` — Astro 7, saída 100% estática, TypeScript. Conteúdo vem do Strapi na build (`STRAPI_URL`); sem ela, usa `src/fixtures` (dados de EXEMPLO — nunca publicar).
- `apps/painel` — Strapi 5 (npm, fora do workspace pnpm). Content-types gerados por `scripts/gerar-schemas.py` — **edite o gerador, não os schema.json à mão**, e rode `npm run gerar-schemas`.
- `apps/plataforma` — núcleo do motor de reservas + sistema interno (Node 22 com TS nativo, MySQL/MariaDB). Telas e checkout virão do SuiVerde.
- `packages/ui` — tokens de design (`src/tokens.css`) e marca (`marca/`).
- Hospedagem: Hostinger Unlimited (sem root, 3 GB RAM). Builds pesadas só no GitHub Actions.

## Regra de ouro
Velocidade e SEO antes de efeito visual. Se piora o Core Web Vitals, não entra (ou carrega depois).
- Metas: Lighthouse mobile ≥ 95 nas 4 categorias, LCP ≤ 1,8 s, CLS ≤ 0,05, INP ≤ 150 ms, JS inicial ≤ 50 KB gzip (sem GTM), home ≤ 1 MB.
- Zero JS por padrão. Ilhas só para preço/disponibilidade/Reservar (Preact ou JS puro), sempre com fallback estático.
- Imagens só via `components/Foto.astro` (astro:assets, AVIF+WebP, srcset, width/height). Hero: `prioridade`; o resto é lazy.
- Nada de jQuery, slider, animação em JS, widget de terceiro. Vídeo = fachada (`VideoFachada.astro`). Mapa = imagem estática.
- Fontes: no máximo 2 famílias/4 pesos, WOFF2 subset latino, hospedadas no site (definir com o Figma).
- CSS: tokens de `packages/ui/src/tokens.css`; nunca cor/medida solta nos componentes.

## Marca
Cores do logo oficial (`packages/ui/marca/saltao-logo-original.pdf`): azul Saltão `#4076b6`, azul médio `#489ed2` (só decorativo), azul claro `#a0c9e8`; azul escuro derivado `#244a75`. Contraste AA obrigatório: texto azul só com `#4076b6` ou mais escuro.

## Templates e campos
7 templates (`apps/site/src/templates`): Home, Listagem de produtos, Produto/pacote, Listagem do blog, Artigo, Institucional por blocos, FAQ/Contato. Cada campo do painel = um bloco visual. Rotas montadas em `src/lib/routes.ts` a partir do painel (slugs traduzidos). A build falha se houver URL duplicada.

## SEO / GEO / AEO
- Toda página: 1 H1, resposta direta de 1–2 frases no topo, canonical, hreflang PT/EN/ES + x-default, breadcrumbs + BreadcrumbList, OG.
- JSON-LD em `src/lib/schema.ts`: global (TouristAttraction + LocalBusiness + WebSite), Product/TouristTrip + Offer, LodgingBusiness/Campground + Offer, BlogPosting, FAQPage, BreadcrumbList.
- **Sem aggregateRating** em Organization/LocalBusiness (decisão 7). Avaliações só reais, com fonte visível.
- Fatos citáveis sempre em texto (75 m, distâncias, preços "a partir de"), nunca só em imagem.
- `robots.txt` libera Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended. `llms.txt` e sitemaps gerados na build.
- Migração: `apps/site/migracao/redirects.csv` (de,para). Sem cadeias — o teste e o postbuild barram. URLs fortes do site atual ficam iguais (`/cachoeira-saltao/`, `/restaurante-saltao/`).

## Tracking e LGPD
- GTM é o único container. `gtag('consent','default', denied…)` inline no `<head>` antes de tudo; GTM só carrega depois da escolha no banner (`src/scripts/consentimento.ts`).
- No GTM só templates oficiais/galeria — **proibido "HTML personalizado"** (quebra a CSP).
- Eventos (padrão GA4 e-commerce): `view_item_list`, `view_item`, `select_item`, `check_availability`, `begin_checkout`, `add_payment_info`, `purchase`, `generate_lead` (com `method`), `click_phone`, `click_directions`, `consent_update`. Auxiliar: `click_reservar`. Cliques usam o atributo `data-dl` (JSON); eventos de página usam `#dl-pagina`.

## Segurança
- CSP com hash (Astro `security.csp`, em `<meta>`) + headers no `.htaccess` gerado por `scripts/postbuild.mjs`. HSTS em etapas via `HSTS_HEADER` (decisão 4).
- Painel em subdomínio, atrás do Cloudflare Access (2FA), noindex, CORS restrito, upload só imagem/PDF.
- Cartão nunca passa pelo servidor. Webhook do gateway: assinatura verificada no adaptador + idempotência (`webhook_evento`).
- Segredos só em variáveis de ambiente (Hostinger e GitHub Secrets). Nunca commitar `.env`.

## Plataforma (motor)
- Estoque por recurso/dia em `estoque_dia`, travado com `SELECT … FOR UPDATE` em ordem (recurso, data). Linhas novas são criadas fora da transação (evita deadlock).
- Hold de 15 min ocupa a vaga; `scripts/expirar-holds.ts` (cron a cada minuto) devolve.
- Valores em centavos. Datas `AAAA-MM-DD`; DATETIME em UTC.
- Os testes de `tests/motor.test.ts` são os "testes obrigatórios antes de vender" — nunca remover nem afrouxar.

## Fluxo de trabalho
1. Branch própria por mudança → PR → CI verde (build, testes, Lighthouse CI, schema, audit) → merge. **Nunca mesclar sem CI verde.**
2. Mudança que afete performance, SEO ou segurança: perguntar antes.
3. Atualizar este arquivo e o README quando uma regra mudar.

## Comandos
```bash
pnpm install
pnpm dev:site                     # http://localhost:4321 (dados de exemplo)
pnpm build:site && pnpm --filter @saltao/site test
npm --prefix apps/painel install && npm --prefix apps/painel run develop
DATABASE_URL_TEST=mysql://…/x_test pnpm --filter @saltao/plataforma test
```
