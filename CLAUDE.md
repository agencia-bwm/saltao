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
- Fonte: **Urbanist** variável (OFL), uma família só, `public/fonts/urbanist-latin-wght.woff2` (28 KB, subset latino; cache imutável de 1 ano — se trocar a fonte, troque o nome do arquivo), sem preload (competia com a foto LCP), `font-display: swap` e reservas com largura medida por peso (`Urbanist Fallback` 98,6% para texto, `Urbanist Fallback Leve` 97,2% para h1/h2) para CLS zero. Se mudar pesos dos títulos, meça de novo. Não adicionar outra família sem medir.
- CSS: tokens de `packages/ui/src/tokens.css`; nunca cor/medida solta nos componentes.

## Marca
Cores do logo oficial (`packages/ui/marca/saltao-logo-original.pdf`): azul Saltão `#4076b6`, azul médio `#489ed2` (só decorativo), azul claro `#a0c9e8`; azul escuro derivado `#244a75`. Contraste AA obrigatório: texto azul só com `#4076b6` ou mais escuro.

## Linguagem visual ("a queda", versão contemporânea — 16/11/2026)
- Cabeçalho **fixo por cima da foto**: transparente no alto e vidro azul-poço (`--color-vidro` + blur) ao rolar, via scroll-driven animation em CSS (sem JS; sem suporte, já nasce em vidro). Logo e menu em branco; Reservar em `.btn-claro`.
- Toda página começa escura: a home com a foto do hero; as internas com a `.faixa-topo` (`--grad-faixa-topo`), que o `Base.astro` monta a partir do slot `topo` (migalhas + H1 + resposta direta). `topoSobreposto` faz a 1ª foto (`.sobe`) subir sobre a faixa.
- Fundo das páginas em céu claro (`--color-page`); cards e painéis brancos com `--shadow-card`.
- **Home guiada pelas fotos** (16/11/2026, pedido do Fábio): o site encanta, quem vende é o motor. **Nada de preço, card de produto ou formulário de reserva na home** — isso fica para o tema de reservas/motor. Estrutura: hero em tela cheia (foto com véu leve) → capítulos (`blocks.capitulo`): Cachoeiras (imersivo, com "75 m" e fotos menores), Day Use, Apartamentos, Camping (foto sangrando até a borda, texto curto, link para a página) → frase sobre foto → avaliações → FAQ → chamada final com foto → rodapé. Fotos "assentam" ao entrar na tela (scroll-driven animation em CSS, sem JS).
- **Menu:** Cachoeiras (item próprio) · Day Use (com Quiosques) · Apartamentos · Camping · O Saltão · Guia · Atendimento.
- Véus sobre fotos sempre leves e só onde há texto (use `text-shadow` para a leitura); a foto tem que aparecer.
- **Destaque no texto:** no painel, `*palavra*` vira `<em>` com o degradê dos arcos (`lib/texto.ts` → `enfase()`; use `semEnfase()` em meta/alt). Vale no título do hero, H2 da home, citação e chamada final. Sem itálico falso.
- Blocos do painel: `blocks.capitulo` (sobretítulo, título, texto, foto, até 3 fotos extras, destaque tipo "75 m", layout imersivo/foto à esquerda/foto à direita, tema claro/escuro, âncora, CTA), `blocks.roteiro`, `blocks.chamada-final`; citação aceita foto de fundo; o CTA pode apontar para produto, categoria, página institucional, link ou WhatsApp; o hero ganhou `sobretitulo`.
- Os três arcos do logo são o único ornamento: fios d'água no hero, marca d'água na faixa do topo e no rodapé, fio `--grad-arcos` no submenu e no preço.
- Cantos: cards e fotos usam `--radius-card` (cantos iguais) recortado com `clip-path: inset(0 round …)` — o zoom no hover nunca deixa o canto quadrado. `--radius-arco` (canto grande assimétrico) fica só em faixas e painéis grandes.
- Títulos em peso leve (300/250), como o wordmark. Nada de caixa-alta em rótulos.
- Contraste: sobre o céu, texto/link azul é sempre `--color-primary-strong` (o azul Saltão fica abaixo de 4,5:1); sobre azul, texto branco ou `--color-on-deep`.

## Templates e campos
7 templates (`apps/site/src/templates`): Home, Listagem de produtos (Day Use, Hospedagem e Camping, Churrasqueiras e Quiosques — "Monte sua Experiência" saiu do projeto, decisão 17), Produto/pacote, Listagem do blog, Artigo, Institucional por blocos, FAQ/Contato. Cada campo do painel = um bloco visual. Rotas montadas em `src/lib/routes.ts` a partir do painel (slugs traduzidos). A build falha se houver URL duplicada.
- Menu: `Global.menuPrincipal`; item com `subitens` vira grupo com submenu (`<details name>` exclusivo, sem JS). Sem menu no painel, `Cabecalho.astro` monta 5 grupos: O Saltão, Experiências, Hospedagem, Guia, Atendimento.

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
