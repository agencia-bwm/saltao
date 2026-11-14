# Briefing Técnico — Site Saltão Parque de Ecoturismo

Nov 13, 2026 · @Sandro Rogério Fraga

## 1. Contexto e objetivo

O novo saltao.com.br precisa ser um site estático muito rápido, editável por painel e pensado para atrair tráfego orgânico do Google e das IAs (LLMs). Ele também é o canal de venda direta do Saltão. Leia este briefing junto com a proposta aprovada em 09/11/2026 (plano Profissional + Motor de Reservas BWM).

**Escopo aprovado (plano Profissional)**

- Cerca de 15 páginas, em 8 itens de menu, com UX e design autoral.

- Blog gerenciável (Guia da Serra do Itaqueri), com 4 artigos no lançamento.

- Versões em PT, EN e ES.

- SEO técnico + GEO/AEO, com dados estruturados.

- GA4, GTM e eventos de conversão.

- Otimização de Core Web Vitals.

- Avaliações em destaque.

- Integração com o Motor de Reservas BWM.

**Também desenvolvidos pela BWM, com Claude:** o Motor de Reservas, adaptado do motor do SuiVerde, e o Sistema de Gestão de Operações (indicadores, relatórios, controle de entradas e estoque). Os dois formam uma única plataforma, detalhada na seção 9.

**Metas para os primeiros 12 meses**

- +30% em vendas e reservas diretas pelos canais digitais.

- 70% das reservas concluídas online.

- −50% nos atendimentos que existem só para consultar preço e disponibilidade.

- 100% das vendas mensuradas, da origem do visitante até a reserva.

**Regra de ouro:** velocidade e SEO vêm antes de efeito visual. Se um recurso piora o Core Web Vitals, ele não entra ou é carregado depois.

## 2. Stack e arquitetura

A stack é **Astro** no front, com saída 100% estática, e **Strapi 5** como painel, com tudo rodando no plano **Hostinger Unlimited** (Node.js + MySQL). O código fica num monorepo no GitHub da BWM.

| Camada                          | Tecnologia                                                                   | Papel                                                                                                                                 |
|---------------------------------|------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| Site público                    | Astro (output static) + TypeScript                                           | Gera HTML puro na build, com zero JS por padrão. Partes dinâmicas entram como ilhas (client:visible).                                 |
| Painel / CMS                    | Strapi 5 (Node.js web app no hPanel)                                         | Login e senha, um content-type por template, rascunho e publicação, papéis de usuário e i18n PT/EN/ES nativo.                         |
| Plataforma de reservas + gestão | Node + MySQL, a partir do motor do SuiVerde                                  | Motor, checkout, voucher e sistema interno num só backend, em reservas.saltao.com.br. Expõe uma API de leitura para o site (seção 9). |
| Banco de dados                  | MySQL/MariaDB da Hostinger                                                   | Um banco para o Strapi e outro para a plataforma. O plano permite até 75 conexões; configurar pool pequeno em cada app.               |
| Mídia                           | Upload no Strapi (disco da hospedagem), otimizada pelo astro:assets na build | Gera AVIF/WebP, srcset e dimensões fixas.                                                                                             |
| Build e deploy                  | GitHub Actions                                                               | Builda o Astro e publica via SSH/rsync no public_html.                                                                                |
| Hospedagem                      | Hostinger Unlimited: 2 vCPU, 3 GB RAM, 50 GB, sem root                       | Site estático + 2 apps Node (Strapi e plataforma). Inclui CDN, proteção DDoS e backup diário.                                         |

**Fluxo de publicação**

1.  O editor preenche os campos no painel e clica em Publicar.

2.  Um webhook do Strapi (evento entry.publish) dispara um repository_dispatch no GitHub.

3.  O GitHub Actions roda a build do Astro, que busca o conteúdo na API do Strapi e gera as páginas no padrão de cada template.

4.  O deploy na Hostinger leva de 1 a 3 minutos e o site fica no ar com a mudança.

**O que pode ser dinâmico (ilha)**

Preço atualizado, calendário de disponibilidade e botão Reservar, sempre consumindo a API do motor. O restante da página continua estático. Nada de React no site inteiro: a ilha usa Preact ou JS puro.

**Limites do plano Unlimited a respeitar**

- Sem root nem compiladores: nada de dependências nativas que precisem compilar no servidor. O sharp vem pré-compilado e funciona. Builds pesadas (Astro e o admin do Strapi) rodam no GitHub Actions, e o servidor só recebe o resultado pronto.

- 3 GB de RAM compartilhados entre painel, motor e gestão: rodar o Strapi em modo produção e monitorar o consumo.

- 100 mil visitas/mês: o site estático com CDN quase não consome recursos, então o limite pesa mais no tráfego da API do motor.

- Se o motor e a gestão crescerem, migrar só a API para um plano Cloud ou VPS, mantendo o site onde está.

## 3. Mapa do site e templates do painel

O mapa segue a arquitetura da proposta: 8 itens de menu e o botão Reservar sempre em destaque. Cada página nasce de um destes 7 templates, e todo campo do painel corresponde a um bloco visual no Figma.

| Template                   | Onde é usado                                                                     | Editável no painel    |
|----------------------------|----------------------------------------------------------------------------------|-----------------------|
| Home                       | Início                                                                           | Sim, por blocos fixos |
| Listagem de produtos       | Day Use, Hospedagem e Camping, Churrasqueiras e Quiosques, Monte sua Experiência | Sim                   |
| Produto / pacote (interna) | Cada ingresso, acomodação, espaço, combo ou página de campanha                   | Sim                   |
| Listagem do blog           | Guia da Serra do Itaqueri + páginas de categoria                                 | Automática            |
| Artigo                     | Posts do Guia                                                                    | Sim                   |
| Institucional por blocos   | Conheça o Saltão, Segurança, Como chegar, Políticas                              | Sim                   |
| FAQ / Contato              | Dúvidas e Contato, Minha reserva                                                 | Sim                   |

**Campos do template Produto / pacote**

| Campo                                | Tipo                            | Observação                                                   |
|--------------------------------------|---------------------------------|--------------------------------------------------------------|
| Título e slug                        | texto                           | Slug editável e único por idioma                             |
| Categoria                            | seleção                         | Day Use, Hospedagem, Camping, Churrasqueira, Combo           |
| Resposta-rápida                      | texto (máx. 300 caracteres)     | Primeiro parágrafo, respondendo "o que é, para quem, quanto" |
| Galeria                              | mídia (máx. 12)                 | Primeira imagem = hero, com alt obrigatório                  |
| Vídeo                                | URL                             | Carrega só no clique (fachada)                               |
| Preço "a partir de"                  | número                          | Fallback se a API do motor cair                              |
| ID do produto no motor               | texto                           | Liga a página à disponibilidade real                         |
| O que inclui / não inclui            | listas                          |                                                              |
| Horários, regras, crianças e animais | rich text curto                 |                                                              |
| Capacidade e estrutura               | lista chave-valor               | Ex.: "Quiosque: até 30 pessoas"                              |
| FAQ                                  | repetidor (pergunta + resposta) | Vira FAQPage no schema                                       |
| Produtos relacionados                | relação                         | Venda combinada                                              |
| Avaliações em destaque               | relação                         | Só avaliações reais, com fonte                               |
| Bloco SEO                            | grupo                           | Ver seção 5                                                  |

**Campos do template Artigo (Guia da Serra do Itaqueri)**

| Campo                               | Tipo                        | Observação                                                       |
|-------------------------------------|-----------------------------|------------------------------------------------------------------|
| Título, slug e categoria            | texto / seleção             | Categorias: O que fazer, Cachoeiras, Quando ir, Família, Camping |
| Autor                               | relação                     | Nome, foto, minibio e link (sinal de E-E-A-T)                    |
| Data de publicação e de atualização | data                        | As duas aparecem na página                                       |
| Resumo / resposta direta            | texto (máx. 300 caracteres) | Topo do artigo                                                   |
| Corpo                               | rich text com blocos        | H2/H3, tabela, imagem, citação, CTA de produto                   |
| FAQ                                 | repetidor                   |                                                                  |
| Fontes                              | repetidor de links          |                                                                  |
| CTA de produto                      | relação                     | Leva do conteúdo para a reserva                                  |
| Bloco SEO                           | grupo                       | Ver seção 5                                                      |

**Papéis no painel:** Admin (BWM), Editor (Saltão: conteúdo e preços) e Autor (só blog, publicação com aprovação).

## 4. Performance e Core Web Vitals

A meta é Lighthouse acima de 95 nas 4 categorias, no mobile, em todos os templates, e CWV aprovado com dados reais (CrUX) em até 60 dias após o lançamento.

| Métrica                      | Meta                         | Limite do Google |
|------------------------------|------------------------------|------------------|
| LCP (maior elemento visível) | ≤ 1,8 s                      | 2,5 s            |
| INP (resposta ao toque)      | ≤ 150 ms                     | 200 ms           |
| CLS (estabilidade do layout) | ≤ 0,05                       | 0,1              |
| JS inicial por página        | ≤ 50 KB gzip, sem contar GTM | —                |
| Peso total da home           | ≤ 1 MB no mobile             | —                |

**Regras de implementação**

- **Imagens:** sempre via astro:assets (AVIF + WebP, srcset, width/height). O hero tem fetchpriority="high" e sem lazy; todo o resto é lazy.

- **Hero:** foto, não vídeo de fundo. Se houver vídeo, é fachada com play, carregando só no clique.

- **Fontes:** hospedadas no site, em WOFF2 com subset latino, no máximo 2 famílias e 4 pesos. Usar font-display: swap e preload da principal.

- **CSS:** crítico inline e sem frameworks pesados. Tailwind é permitido, com purge.

- **JS:** nada de jQuery, sliders pesados ou animações em JS. Animações só em CSS, respeitando prefers-reduced-motion.

- **Scripts de terceiros:** GTM, Pixel, widget de WhatsApp, mapas e avaliações externas só carregam após consentimento ou primeira interação. Mapa sempre como imagem estática com link.

- **WhatsApp:** link wa.me com botão próprio em HTML/CSS, sem widget de terceiros.

- **Cache:** assets com hash e Cache-Control: max-age=31536000, immutable; HTML com cache curto. Ativar CDN, HTTP/2 ou 3 e Brotli.

- **Navegação:** prefetch de links ao passar o mouse ou no viewport (recurso nativo do Astro).

**Controle contínuo:** Lighthouse CI no GitHub Actions, rodando em cada PR para as URLs-modelo de cada template. PR que baixar a nota abaixo da meta não é mesclado.

## 5. SEO, GEO e AEO

Todo template já sai com SEO técnico e dados estruturados automáticos. O editor só preenche o conteúdo, e nenhuma página publica sem os campos obrigatórios.

**Bloco SEO (em todo documento do painel)**

- Meta title (até 60 caracteres) e meta description (até 155), com contador no campo.

- Imagem OG; se ficar vazia, usa o hero.

- Canonical: automático, com opção de sobrescrever.

- Flag noindex.

- Palavra-chave principal (uso interno, para conferir título, H1 e slug).

**SEO técnico (no código)**

- Um H1 por página e hierarquia H2/H3 correta. HTML semântico: header, main, article, nav, footer.

- URLs curtas, em minúsculas e sem data: /day-use/, /hospedagem/apartamentos/, /guia/cachoeiras-perto-de-brotas/. Idiomas em /en/ e /es/.

- hreflang entre PT, EN e ES, com x-default.

- sitemap-index.xml automático, com lastmod real.

- robots.txt apontando para o sitemap.

- Breadcrumbs visíveis + BreadcrumbList.

- Página 404 útil, com links para os produtos.

- Paginação do blog rastreável e links internos automáticos: produtos relacionados, artigos relacionados e CTA do artigo para o produto.

**Dados estruturados (JSON-LD gerado pelo template)**

| Template                        | Schema                                                                                                                          |
|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Global (todas as páginas)       | Organization + TouristAttraction + LocalBusiness com endereço, geo, horários, telefone, sameAs das redes e aggregateRating real |
| Produto Day Use / Churrasqueira | Product ou TouristTrip + Offer (preço, moeda, disponibilidade)                                                                  |
| Hospedagem / Camping            | LodgingBusiness ou Campground + Accommodation + Offer                                                                           |
| Artigo                          | Article com author (Person), datePublished, dateModified e image                                                                |
| Qualquer página com FAQ         | FAQPage                                                                                                                         |
| Todas                           | BreadcrumbList e WebSite                                                                                                        |

Validar no Rich Results Test e no Schema Validator antes de entregar.

**GEO / AEO (para ser citado por ChatGPT, Gemini, Perplexity e AI Overviews)**

- Toda página abre com uma resposta direta de 1 a 2 frases: o que é, onde fica, para quem e quanto custa.

- Fatos objetivos e citáveis em texto, nunca só dentro de imagem: altura da cachoeira (75 m), distâncias (Brotas, São Carlos, São Paulo), horários, capacidade, regras e preços "a partir de".

- Tabelas comparativas (por exemplo, comparar acomodações) e FAQs com perguntas reais de WhatsApp e Search Console.

- Autoria, data de atualização e fontes visíveis em todo artigo.

- Arquivo /llms.txt gerado na build: resumo do Saltão + links das páginas-chave.

- No robots.txt, liberar Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot e Google-Extended.

- Bing Webmaster Tools + IndexNow (ping a cada publicação), porque o Bing alimenta a busca do ChatGPT e do Copilot.

- Conteúdo renderizado em HTML. Nada essencial pode depender de JavaScript para aparecer.

**Migração sem perder ranqueamento**

1.  Exportar do Search Console as páginas com clique e impressão dos últimos 16 meses e fazer um crawl completo do site atual (Screaming Frog).

2.  Montar uma planilha de URL antiga → URL nova. Manter as URLs fortes iguais sempre que possível.

3.  Implementar 301 no servidor (.htaccess ou config) para 100% das URLs antigas indexadas, sem cadeias de redirecionamento.

4.  Preservar o conteúdo que já ranqueia: reescrever melhorando, nunca encurtando.

5.  No lançamento: enviar o sitemap no Search Console e no Bing e monitorar a cobertura e os erros 404 diariamente por 30 dias.

## 6. Tracking, LGPD e consentimento

O GTM é o único container de tags do site, e nenhuma tag de marketing dispara sem consentimento.

**Banner de cookies**

- Biblioteca leve e open source: vanilla-cookieconsent (orestbida), com cerca de 10 KB, estilizada no design do site. Sem CMP pesado de terceiros.

- Categorias: necessários (sempre ativos), análise e marketing.

- Botões Aceitar, Recusar e Personalizar, com o mesmo destaque.

- Link permanente "Preferências de cookies" no rodapé.

- Política de Privacidade e de Cookies como páginas editáveis no painel.

**Google Consent Mode v2**

- O gtag('consent','default', …) roda antes do GTM, com ad_storage, analytics_storage, ad_user_data e ad_personalization como denied.

- Quando o visitante escolhe, o banner chama consent update e envia um evento consent_update no dataLayer.

**Dentro do GTM**

- GA4 (Consent Mode avançado), Meta Pixel (só com marketing aceito) e Google Ads com conversão avançada.

- Se houver Clarity ou Hotjar, só com análise aceita.

**Eventos no dataLayer (padrão GA4 e-commerce)**

| Evento                            | Quando dispara                                        |
|-----------------------------------|-------------------------------------------------------|
| view_item_list / view_item        | Listagem e página de produto                          |
| select_item                       | Clique em um produto na listagem                      |
| check_availability                | Consulta de datas no motor                            |
| begin_checkout / add_payment_info | Etapas do checkout no motor                           |
| purchase                          | Reserva confirmada, com transaction_id, valor e itens |
| generate_lead                     | Formulário enviado ou clique no WhatsApp, com method  |
| click_phone / click_directions    | Telefone e Como chegar                                |

Com isso, a origem da venda, o produto, o ticket médio e a taxa de conversão ficam medidos de ponta a ponta, como a proposta prometeu.

**Server-side (recomendado na fase 2):** Meta Conversions API e envio do purchase pelo backend do motor, com event_id para deduplicar o Pixel.

**Search Console e Bing Webmaster:** verificados por registro DNS (propriedade de domínio), nunca por tag no HTML.

## 7. Segurança

Como o site público é estático, ele tem pouca superfície de ataque; o esforço de segurança se concentra no painel, na API e no checkout.

**Site público (headers obrigatórios)**

- HTTPS em tudo, com HSTS (max-age=31536000; includeSubDomains; preload) e redirecionamento de http e www para a versão canônica.

- Content-Security-Policy restritiva, liberando só os domínios de GTM, GA4, Meta e do motor. Usar nonce ou hash para os scripts inline.

- X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy mínima e frame-ancestors 'self'.

- Meta: nota A+ em securityheaders.com e A+ no SSL Labs.

**Painel e API**

- Painel em subdomínio separado (ex.: painel.saltao.com.br), fora do sitemap e com noindex.

- 2FA obrigatório para Admin e Editor (o Strapi gratuito não tem 2FA nativo: usar plugin de 2FA ou proteger o subdomínio com Cloudflare Access), senha forte e limite de tentativas de login.

- Sessão com cookie HttpOnly, Secure e SameSite, com expiração.

- Permissões por papel e log de auditoria de quem alterou o quê.

- CORS da API liberado só para os domínios do site.

- Validação de entrada no servidor, upload só de imagem e PDF com limite de tamanho, e sanitização do rich text.

- Rate limit na API pública do motor (disponibilidade e checkout).

**Pagamentos**

- Checkout com gateway que tokeniza o cartão (Pix e cartão, via Mercado Pago, Asaas ou Pagar.me). Dados de cartão nunca passam pelo servidor da BWM nem ficam salvos nele.

- Webhooks do gateway com assinatura verificada e idempotência.

**Operação**

- Segredos só em variáveis de ambiente (Hostinger e GitHub Secrets), nunca no repositório.

- Dependabot e npm audit no CI, com dependências fixadas no lockfile.

- Branch main protegida: PR obrigatório e CI verde para mesclar.

- Backup diário do banco e da mídia, com retenção de 30 dias. Testar uma restauração antes do lançamento.

- Proteção DDoS e CDN da Hostinger ativas (o plano não tem WAF dedicado: compensar com rate limit na API e, se necessário, Cloudflare na frente), mais um monitor de uptime com alerta.

**LGPD nos formulários:** coletar só o necessário, com checkbox de consentimento não pré-marcado, link para a Política de Privacidade e um canal para o titular pedir exclusão dos dados.

## 8. Fluxo GitHub/Claude, entregáveis e aceite

O conteúdo do dia a dia é editado no painel. Mudanças de layout, novas funcionalidades e ajustes esporádicos são feitos no código, via GitHub e Claude, sempre por PR.

**Estrutura do repositório (GitHub da BWM)**

saltao/  
apps/site/ → Astro (páginas, templates, componentes)  
apps/painel/ → Strapi 5 (content-types, papéis, webhooks)  
apps/plataforma/ → motor de reservas + sistema interno (API, checkout, admin)  
packages/ui/ → tokens de design e componentes compartilhados  
.github/ → CI: build, Lighthouse CI, deploy  
CLAUDE.md → regras do projeto para o Claude  
README.md → como rodar, publicar e restaurar backup

O CLAUDE.md registra: a stack, a regra de ouro de performance, a lista de templates e campos, os padrões de schema, os nomes dos eventos do dataLayer e a regra de nunca mesclar sem o CI verde.

**Fluxo de mudança**

1.  Abrir uma branch e pedir a mudança ao Claude.

2.  Abrir um PR. O CI roda a build, o Lighthouse e a validação de schema.

3.  Conferir o preview e mesclar na main.

4.  O deploy na Hostinger é automático.

**Cronograma (4 semanas após o kickoff, conforme a proposta)**

| Semana   | Entregas                                                                                               |
|----------|--------------------------------------------------------------------------------------------------------|
| S1       | Kickoff, crawl e mapa de 301, wireframes e modelagem dos campos dos templates                          |
| S2       | Design no Figma (desktop + mobile) aprovado, design tokens, repositório e painel configurados          |
| S3       | Templates em Astro, integração com a API do motor, schema, tracking, banner LGPD, conteúdo e 4 artigos |
| S4       | Testes, homologação com o Fernando, 301, go-live e treinamento do painel                               |
| +30 dias | Monitoramento do Search Console e do CWV, ajustes finos e reunião de resultados                        |

**Critérios de aceite (checklist de entrega)**

- [ ] Lighthouse mobile acima de 95 em Performance, SEO, Acessibilidade e Boas Práticas nas URLs-modelo dos 7 templates

- [ ] LCP ≤ 1,8 s, CLS ≤ 0,05 e INP ≤ 150 ms no teste de laboratório

- [ ] Rich Results Test sem erros em produto, hospedagem, artigo e FAQ

- [ ] hreflang, canonical, sitemap, robots.txt e llms.txt publicados e corretos

- [ ] 100% das URLs antigas indexadas com 301 testado

- [ ] GTM com Consent Mode v2 validado no Tag Assistant; Pixel não dispara antes do aceite

- [ ] Eventos do funil (view_item até purchase) chegando no GA4 DebugView

- [ ] securityheaders.com e SSL Labs com nota A+

- [ ] 2FA ativo no painel; backup e restauração testados

- [ ] Editor do Saltão treinado, criando um pacote e um artigo sozinho

- [ ] Search Console e Bing Webmaster verificados, com o sitemap enviado

- [ ] README.md e CLAUDE.md entregues no repositório

## 9. Motor de reservas e sistema interno

O motor e o sistema interno são uma única plataforma Node + MySQL, em reservas.saltao.com.br, com um banco e um login só. A base é o motor do SuiVerde: a interface e o fluxo são reaproveitados, e o núcleo de disponibilidade é refeito para os produtos do Saltão.

**Reaproveitar do SuiVerde:** calendário, fluxo de checkout, telas de admin e base visual (convertida para a identidade do Saltão).

**Refazer:** o modelo de produto e o cálculo de disponibilidade. No SuiVerde, eles foram feitos para 2 suítes vendidas por noite.

| Produto                               | Cobrança                               | Estoque                      |
|---------------------------------------|----------------------------------------|------------------------------|
| Apartamentos                          | por noite                              | unidade                      |
| Camping                               | por noite, por pessoa ou barraca       | capacidade da área           |
| Day Use                               | por dia, por pessoa (adulto e criança) | lotação diária               |
| Quiosques (80) e churrasqueiras (102) | por dia, por espaço                    | cada espaço                  |
| Combos                                | soma dos itens                         | herda o estoque de cada item |

**Requisitos do motor**

- Preço por data (temporada, fim de semana, feriado), por faixa etária e com cupons.

- Bloqueio temporário da vaga por 15 minutos durante o checkout, com trava transacional no banco. Duas compras simultâneas do mesmo espaço nunca podem confirmar.

- Pagamento por Pix e cartão via gateway (Mercado Pago, Asaas ou Pagar.me). A reserva só é confirmada pelo webhook do gateway, com assinatura verificada e idempotência.

- Voucher com QR Code enviado por e-mail e WhatsApp.

- Políticas de cancelamento, reembolso e alteração de data configuráveis no admin.

- E-mails automáticos: confirmação, lembrete na véspera e pós-visita pedindo avaliação.

- Eventos begin_checkout, add_payment_info e purchase no dataLayer, com o mesmo GTM do site. Por ser subdomínio do mesmo domínio, o GA4 mantém a sessão sem configuração extra de cross-domain.

**API de leitura para o site**

| Endpoint                                       | Retorna                                 |
|------------------------------------------------|-----------------------------------------|
| GET /api/produtos                              | Produtos ativos com preço "a partir de" |
| GET /api/produtos/:id/disponibilidade?de=&ate= | Dias livres e vagas restantes           |

O site sempre tem um fallback: link com parâmetros (/reservar?produto=day-use&data=2026-12-20) e preço vindo do painel. Se a API estiver fora, a página continua vendendo.

**Sistema interno (mesma plataforma, conforme a proposta)**

- Painel de indicadores: vendas, ocupação e ticket médio por produto, em tempo real.

- Relatórios por período, equipe ou cliente, com exportação para Excel e PDF.

- Controle de entradas: lista do dia, check-in pela leitura do QR Code no celular e venda de balcão (Day Use, camping, churrasqueira e apartamentos).

- Controle de estoque da lanchonete: entradas e saídas.

- Papéis: Admin, Gerente, Portaria e Lanchonete.

**Testes obrigatórios antes de vender**

- [ ] Duas compras simultâneas do mesmo quiosque: só uma confirma

- [ ] Pix e cartão em sandbox: aprovado, recusado, expirado e estorno

- [ ] Webhook repetido não duplica a reserva

- [ ] Reserva não paga libera a vaga após 15 minutos

- [ ] Voucher lido na portaria marca a entrada

- [ ] Piloto com reservas reais da equipe antes de abrir ao público

**Ordem de entrega:** site + motor com venda online no lançamento (S4); API de disponibilidade nas páginas e sistema interno logo em seguida, no prazo de 4 semanas previsto na proposta da gestão.

## 10. Prompt para o Claude

Copie o bloco abaixo e cole no Claude (de preferência no Claude Code, conectado ao repositório), anexando a proposta em PDF e este briefing exportado.

Você é um desenvolvedor web sênior especialista em Astro, performance (Core Web Vitals), SEO técnico, GEO/AEO e segurança. Vai construir comigo o novo site do Saltão – Parque de Ecoturismo (saltao.com.br) para a Agência BWM.  
  
ANEXOS  
1. Proposta aprovada (PDF): escopo, mapa do site, posicionamento e metas.  
2. Briefing Técnico: stack, templates e campos, metas de performance, SEO/GEO/AEO, tracking/LGPD, segurança e critérios de aceite.  
O Briefing Técnico é a fonte da verdade. Se algo na proposta conflitar com ele, siga o briefing e me avise.  
  
OBJETIVO  
Um site estático extremamente rápido (Lighthouse mobile \> 95 em todas as categorias), editável por painel com login, otimizado para tráfego orgânico do Google e para ser citado por LLMs, e que vende Day Use, hospedagem, camping e churrasqueiras via o Motor de Reservas BWM.  
  
STACK OBRIGATÓRIA  
- Monorepo: apps/site (Astro, output static, TypeScript), apps/painel (Strapi 5 + MySQL), apps/plataforma (motor de reservas + sistema interno, Node + MySQL, a partir do código do motor do SuiVerde que vou fornecer), packages/ui.  
- Hospedagem: Hostinger Unlimited (Node.js web apps + MySQL, 2 vCPU, 3 GB RAM, sem root nem compiladores; builds pesadas rodam no CI).  
- Deploy: GitHub Actions → build → SSH/rsync para a Hostinger. Publicar no painel dispara repository_dispatch e rebuild.  
- Partes dinâmicas (preço, disponibilidade, botão Reservar) só como ilhas leves (Preact ou JS puro) consumindo a API do motor, com fallback estático.  
- Idiomas PT (padrão), /en/ e /es/, com i18n do Strapi e hreflang.  
  
REGRAS INEGOCIÁVEIS  
- Performance antes de efeito visual. Zero JS por padrão; imagens só via astro:assets; fontes hospedadas no site; sem jQuery, sliders pesados ou widgets de terceiros.  
- GTM, Pixel e qualquer script de terceiro só após consentimento (vanilla-cookieconsent + Google Consent Mode v2 com default denied).  
- Todo template gera automaticamente: meta tags, canonical, hreflang, breadcrumbs e JSON-LD conforme a tabela do briefing.  
- Toda página abre com uma resposta direta de 1–2 frases; FAQs viram FAQPage.  
- Gerar sitemap, robots.txt (liberando os crawlers de IA listados) e llms.txt na build.  
- Headers de segurança (HSTS, CSP com nonce/hash, nosniff, Referrer-Policy, Permissions-Policy).  
- Painel em subdomínio, com 2FA, rate limit e papéis Admin, Editor e Autor.  
- Nunca guardar ou trafegar dados de cartão; checkout pelo gateway com tokenização.  
- Plataforma: modelo de produto genérico (noite ou dia, pessoa ou espaço, estoque), bloqueio temporário da vaga no checkout com trava transacional, Pix + cartão via gateway com webhook assinado e idempotente, voucher com QR Code, e reserva paga alimentando o controle de entradas e os relatórios. Siga a seção 9 do briefing.  
- Segredos só em variáveis de ambiente.  
- Código limpo, componentizado, acessível (WCAG AA) e com HTML semântico.  
  
COMO VAMOS TRABALHAR  
1. Antes de escrever código, leia os anexos e me devolva: (a) as dúvidas e as decisões em aberto; (b) o plano de implementação em fases, alinhado ao cronograma de 4 semanas; (c) o esquema dos content-types do Strapi com todos os campos; (d) a análise do código do motor do SuiVerde: o que reaproveitar, o que refazer e o modelo de dados da plataforma.  
2. Espere minha aprovação. Depois execute uma fase por vez, sempre em branch própria com PR, e no fim de cada fase diga o que foi feito e como testar.  
3. Crie e mantenha atualizado um CLAUDE.md na raiz com as regras deste projeto e um README.md com setup, deploy e restauração de backup.  
4. Configure no CI: build, Lighthouse CI (bloqueando PR abaixo da meta), validação de schema e npm audit.  
5. Os componentes visuais seguem o layout do Figma que vou enviar. Antes disso, use placeholders neutros e extraia os design tokens assim que o Figma chegar.  
6. Na migração, gere o mapa de 301 a partir do crawl e do export do Search Console que vou fornecer.  
7. Se uma decisão afetar performance, SEO ou segurança, me pergunte em vez de supor.  
  
Comece pelo passo 1.

**Antes de colar:** tenha em mãos o acesso ao GitHub da BWM, à Hostinger, ao GTM/GA4, ao Search Console e ao repositório do motor do SuiVerde, além das credenciais de sandbox do gateway de pagamento.
