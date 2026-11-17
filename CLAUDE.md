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
- Nada de jQuery, slider, animação em JS, widget de terceiro. Vídeo = fachada (`VideoFachada.astro`). Mapa = imagem estática ou `MapaCartao` (link, sem iframe).
- Home tem rota própria (`pages/index.astro`, `pages/[idioma]/index.astro`) para o CSS dela não entrar inline nas outras páginas. O CSS dos blocos abaixo da dobra fica em `styles/home-abaixo.css` (carregado por `<link>` no corpo, seletores prefixados pela seção) — o HTML comprimido da home precisa caber perto de 14 KB, senão o LCP simulado passa da meta. Hero da home tem preload AVIF no `<head>` (`Base` prop `preload`, mesmas medidas de `lib/foto.ts`).
- Fonte: **Urbanist** variável (OFL), uma família só, `public/fonts/urbanist-latin-wght.woff2` (28 KB, subset latino; cache imutável de 1 ano — se trocar a fonte, troque o nome do arquivo), sem preload (competia com a foto LCP), `font-display: swap` e reservas com largura medida por peso (`Urbanist Fallback` 98,6% para texto, `Urbanist Fallback Leve` 97,2% para h1/h2) para CLS zero. Se mudar pesos dos títulos, meça de novo. Não adicionar outra família sem medir.
- CSS: tokens de `packages/ui/src/tokens.css`; nunca cor/medida solta nos componentes.

## Marca
Cores do logo oficial (`packages/ui/marca/saltao-logo-original.pdf`): azul Saltão `#4076b6`, azul médio `#489ed2` (só decorativo), azul claro `#a0c9e8`; azul escuro derivado `#244a75`. Contraste AA obrigatório: texto azul só com `#4076b6` ou mais escuro.

## Linguagem visual ("a queda")
- A página desce como os 75 m da cachoeira: topo em céu (`--grad-ceu` no body), faixas fundas no meio (`--grad-profundo`), rodapé no poço (`--grad-poco`).
- Os três arcos do logo são o único ornamento: fio `--grad-arcos` (sobretítulos `.sobretitulo`, topo das páginas, submenu, preço), selo do hero, mosaico da home e marca d'água no rodapé.
- Layout da home (nov/2026, referência enviada pelo Fábio): cabeçalho branco com Reservar em pílula azul-poço; hero em painel com borda de baixo em onda e card flutuante de produto; blocos `essencia` (mosaico + ícones), `vitrine` (1 card grande + 2) e `experiencias` (4 cards), `fatos` com régua dos 75 m (FatosHome), `galeria` (mosaico) e `chamada` (foto de fundo + Reservar) acima do rodapé com topo em onda. Menu: barra branca flutuante com cantos côncavos (margem lateral = raio, senão gera rolagem horizontal). Ícones só via `components/Icone.astro` (lista em `ICONES`, igual no gerador do painel).
- Canto do arco: fotos e painéis usam `--radius-arco` só no canto superior direito.
- Títulos em peso leve (300/250), como o wordmark. Nada de caixa-alta em rótulos.
- Texto azul sobre o fundo céu: usar `--color-primary-strong` (o azul Saltão fica em 4,2:1).

## Templates e campos
7 templates (`apps/site/src/templates`): Home, Listagem de produtos, Produto/pacote, Listagem do blog, Artigo, Institucional por blocos, FAQ/Contato. Cada campo do painel = um bloco visual. Rotas montadas em `src/lib/routes.ts` a partir do painel (slugs traduzidos). A build falha se houver URL duplicada.
- **Landing de categoria (página única):** categoria com `paginaUnica` (ex.: Hospedagem) vira uma landing (`LandingTpl`, rota própria em `pages/[categoria]/` e `pages/[idioma]/[categoria]/`): abertura no estilo do hero da home, mais baixa (foto na largura toda sob o menu, borda em onda, migalhas claras dentro do hero via `Base migalhasNoTopo={false}`, H1 + destaque, 2ª foto como cartão inclinado no desktop) e menu âncora em cartões sobre a onda; uma seção por produto (âncora = slug, fotos, `destaques` com ícone, o que inclui, Reservar direto na plataforma e carrossel "Mais fotos" com a galeria a partir da 4ª foto). **Sem valores na landing nem no card da home** (decisão do Fábio, nov/2026): o preço aparece só na plataforma de reservas; o schema dessas acomodações leva oferta só com o link de reserva, e o llms.txt também omite o valor; depois `secoes` (mesmos blocos visuais da home, via `components/Secoes.astro`) e FAQ. Produtos dessa categoria não têm página própria: `indice.link("produto")` devolve `/categoria/#slug` e o schema de cada produto fica na landing. CSS: abertura no template; seções em `styles/landing.css` + `styles/home-abaixo.css`, no corpo.
- **Landing institucional:** página institucional com `landing` (ex.: Cachoeira Saltão, Estrutura) usa `LandingPaginaTpl` na mesma rota própria das landings: mesmo `HeroLanding`, menu âncora automático pelos blocos `blocks.setor` (âncora = título sem acento) e as seções do painel. `blocks.setor` (fotos, ícones, lista, até 2 botões, carrossel) é renderizado por `SecaoSetor.astro` — o mesmo componente das acomodações da landing de categoria.
- **Landing de atendimento:** página de atendimento com `tipo: "central"` (`/atendimento/`) usa `LandingAtendimentoTpl` na rota das landings: Fale conosco (canais + `FormContato`), Dúvidas (grupos de FAQ), setores das `secoes` (ex.: Como chegar), Minha reserva (`FormReserva`) e chamada final. Substitui Dúvidas e Contato, Como chegar e Minha reserva (redirecionadas para `/atendimento/`).
- **Mapa:** setor com `linkMapa` mostra `MapaCartao.astro` (azul-poço com curvas de nível, pino, nome/cidade do Global) no lugar das fotos. É link para o Google Maps em nova aba — nunca iframe (CSP e cookies).
- **Guia:** `GuiaTpl` no padrão das landings (HeroLanding com as categorias como cartões, artigo em destaque + grade). Rota própria por idioma (`pages/guia/`, `pages/en/guide/`, `pages/es/guia/`, também para os artigos) e CSS em `styles/guia.css`, no corpo; o catch-all exclui `ehGuia`.
- Menu: `Global.menuPrincipal`; item com `subitens` vira grupo com submenu (`<details name>` exclusivo, sem JS). Sem menu no painel, `Cabecalho.astro` monta (nov/2026): Cachoeira Saltão, Day Use, Hospedagem, Estrutura, Guia e Atendimento, todos links diretos para as landings. "O Saltão" e "Experiências" saíram do menu; Quiosques ficam na Estrutura (botão Reservar direto na plataforma).

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
- Exceções do `pnpm audit` (aprovadas pelo Fábio) ficam em `package.json` → `pnpm.auditConfig.ignoreGhsas`, uma por alerta, só para dependência de build sem correção publicada. Hoje: GHSA-fc5q-39xc-vjpf (picomatch via astro, 17/11/2026) — remover quando sair a versão corrigida.

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
