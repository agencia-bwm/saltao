# Site Saltão — Passo 1: decisões, plano, content-types e plataforma

Resposta ao passo 1 do Briefing Técnico (13/11/2026). Fonte da verdade: o briefing, com os ajustes registrados abaixo. As decisões foram tomadas pela BWM em 13/11/2026. Ainda faltam a proposta em PDF, o código do motor do SuiVerde e o export do Search Console.

---

## (a) Decisões tomadas

### Ajustes técnicos ao briefing

| # | Tema | Decisão |
|---|---|---|
| 1 | Publicar no painel → rebuild | Um lifecycle hook no Strapi (`afterPublish` / `afterUnpublish`) chama a API do GitHub (`repository_dispatch`) com token em variável de ambiente. Espera 60 s para juntar várias publicações seguidas numa build só. No Actions, `concurrency: deploy` com `cancel-in-progress`. O webhook nativo do Strapi não é usado. |
| 2 | CSP | CSP com **hash** dos scripts inline, gerado na build e gravado no `.htaccess`. Nada de nonce. |
| 3 | GTM e CSP | No GTM só templates oficiais e da galeria (GA4, Google Ads, Meta Pixel, Clarity). Tag "HTML personalizado" é proibida. A regra vai no CLAUDE.md e é repassada a quem opera o GTM. |
| 4 | HSTS | Entra em etapas: `max-age=86400` no go-live → `max-age=31536000; includeSubDomains` depois de 30 dias sem erro em nenhum subdomínio → `preload` só depois disso. Antes da segunda etapa, checar todos os subdomínios (e-mail, webmail, painel, reservas). |
| 5 | Log de auditoria e aprovação (só existem no Strapi pago) | Log próprio via lifecycle hooks numa tabela `audit_log` (quem, o quê, quando, antes/depois). Aprovação por permissão: o Autor só salva rascunho; o Editor revisa e publica. |
| 6 | 2FA do painel + proteção extra | **Cloudflare (plano gratuito)** como DNS do domínio. `painel.saltao.com.br` fica atrás do **Cloudflare Access** (login com código por e-mail, só para e-mails autorizados) — é a camada de 2FA, sem plugin para manter. `reservas.saltao.com.br` passa pelo proxy da Cloudflare, com regras de rate limit para a API e o checkout (cobre a falta de WAF da Hostinger). O site estático segue na CDN da Hostinger. Mudar os nameservers é reversível. |
| 7 | Rich results | FAQPage continua no markup (ajuda as IAs), mas o critério de aceite passa a ser "válido no Schema Validator", porque o Google não mostra mais FAQ para sites comerciais. `aggregateRating` **não** entra em Organization/LocalBusiness. Avaliações do Google e TripAdvisor aparecem no HTML com nome, data e link da fonte. `aggregateRating` só em Produto, e só com avaliações coletadas pelo próprio Saltão (e-mail pós-visita do motor), quando houver volume. |
| 8 | Build com imagens do Strapi | Cache das imagens já otimizadas no GitHub Actions (`actions/cache` na pasta de assets do Astro), para a build não reprocessar tudo a cada publicação. |
| 9 | Hostinger | Verificar no hPanel, antes da S2: duas apps Node.js simultâneas, Node 20 ou 22, headers e Brotli pelo `.htaccess`. Se o plano não rodar as duas apps, a plataforma vai para um VPS pequeno e o resto fica onde está (o briefing já prevê isso). |

### Decisões de produto e operação

| # | Tema | Decisão |
|---|---|---|
| 10 | Gateway | Reaproveitar o gateway que o SuiVerde já usa. Se ele não tiver integração reaproveitável: **Mercado Pago** — Checkout Bricks (cartão tokenizado no navegador, nunca passa pelo servidor), Pix nativo e webhook assinado (`x-signature`). |
| 11 | Voucher por WhatsApp | **WhatsApp Cloud API oficial da Meta**, com um modelo de mensagem "utilidade" (voucher + link do QR Code). Sem provedor não oficial, para não correr risco de bloqueio do número. Se a aprovação da Meta atrasar, o lançamento sai com voucher por e-mail e o WhatsApp entra logo depois, sem mudar o fluxo. |
| 12 | E-mail transacional | **Brevo** (painel em português, plano gratuito de 300 e-mails/dia, que dá para o início). Domínio autenticado com SPF, DKIM e DMARC. |
| 13 | Traduções EN/ES | Tudo sai em 3 idiomas no lançamento, incluindo os 4 artigos. O Claude traduz no painel, adaptando termos locais (não tradução literal), e o Saltão revisa por amostragem. Slugs traduzidos (`/en/day-use/`, `/es/dia-de-campo/`). |
| 14 | Faixas etárias do Day Use | Configuráveis no admin da plataforma. Valores iniciais de trabalho (o Saltão confirma): 0–5 anos grátis, 6–11 meia, 12+ inteira, 60+ meia. |
| 15 | Camping | O motor aceita as duas formas. Padrão no lançamento: **por pessoa, por noite**, limitado pela capacidade de cada área. |
| 16 | Quiosques (80) e churrasqueiras (102) | Sem mapa no lançamento. O cliente escolhe o **tipo/setor** (ex.: "Quiosque à beira do rio, até 30 pessoas") e a data; o motor aloca automaticamente um espaço livre desse setor na reserva e grava o número no voucher. A portaria pode trocar o espaço no sistema interno. Isso já garante "cada espaço" e a trava contra venda dupla. Mapa clicável fica para a fase 2. |
| 17 | "Monte sua Experiência" | **Retirado do projeto** (16/11/2026, pedido do Fábio): sem seção, página ou item de menu de combos no site. O motor continua aceitando combos (modelo genérico), caso voltem no futuro. As URLs antigas de pacotes (`/pacotes/…`) fazem 301 para `/hospedagem/`. |
| 18 | "Minha reserva" | Página estática do site com explicação + formulário (código da reserva + e-mail) que envia para `reservas.saltao.com.br/minha-reserva`. Lá o cliente vê, baixa o voucher e pede alteração ou cancelamento, conforme a política. Sem login com senha. |
| 19 | Domínio canônico | Manter a versão que o site atual usa (com ou sem www), confirmada no crawl, para não mexer em sinal de ranqueamento. A outra versão faz 301. |
| 20 | Clarity/Hotjar | **Microsoft Clarity** (gratuito), pelo GTM, só com a categoria "análise" aceita. Hotjar não entra. |
| 21 | Prazo | Mantidas as 4 semanas. O go-live com venda online fica condicionado aos testes obrigatórios do motor (seção 9 do briefing). Se algum falhar, o site entra no ar no prazo com o botão Reservar apontando para o WhatsApp até o motor passar nos testes. |

### O que ainda depende do Saltão / da BWM (não dá para decidir por eles)

- Proposta aprovada em PDF (mapa do site com os 8 itens de menu e as ~15 páginas).
- Código ou acesso ao repositório do motor do SuiVerde.
- Export do Search Console (16 meses) e acesso para o crawl.
- Tabela de preços atual, faixas etárias, lotação diária do Day Use, quantidade e capacidade das áreas de camping, setores dos quiosques e churrasqueiras.
- Acessos: GitHub da BWM, Hostinger, registro do domínio (para apontar o DNS à Cloudflare), GTM/GA4, Meta Business (WhatsApp e Pixel), sandbox do gateway.

---

## (b) Plano de implementação em fases

| Fase | Semana | Branch / PR | Entregas | Depende de |
|---|---|---|---|---|
| 0 | S1 | `setup/monorepo` | Monorepo (pnpm workspaces), CLAUDE.md, README.md, ESLint/Prettier, TypeScript, Dependabot, branch `main` protegida | Acesso ao GitHub da BWM |
| 1 | S1 | `feat/painel-modelagem` | Strapi 5 + MySQL local, todos os content-types e componentes abaixo, i18n PT/EN/ES, papéis Admin/Editor/Autor, audit log, hook de rebuild com debounce | Aprovação do item (c) |
| 2 | S1 | `chore/migracao-301` | Crawl + export do GSC → planilha URL antiga → nova → regras 301 no `.htaccess`, com teste automatizado | Export do GSC e crawl |
| 3 | S1–S2 | `feat/plataforma-modelo` | Análise do SuiVerde, modelo de dados novo, motor de disponibilidade genérico com trava transacional e hold de 15 min, testes de concorrência | Código do SuiVerde |
| 4 | S2 | `feat/site-base` | Astro static, layout base com placeholders, i18n/rotas, componentes de SEO (meta, canonical, hreflang, breadcrumbs, JSON-LD), sitemap, robots.txt, llms.txt, 404 | Fase 1 |
| 5 | S2 | `ci/pipeline` | GitHub Actions: build, Lighthouse CI bloqueante nas URLs-modelo, validação de schema, npm audit, deploy SSH/rsync na Hostinger | Acesso à Hostinger |
| 6 | S2–S3 | `feat/design-tokens` + `feat/templates` | Tokens do Figma em `packages/ui`, os 7 templates finais, fontes WOFF2 com subset, imagens otimizadas | Figma aprovado |
| 7 | S3 | `feat/plataforma-checkout` | Checkout (reaproveitado do SuiVerde), gateway Pix + cartão com webhook assinado e idempotente, voucher QR, e-mails, eventos no dataLayer | Sandbox do gateway |
| 8 | S3 | `feat/tracking-lgpd` | vanilla-cookieconsent, Consent Mode v2, GTM, eventos do funil, páginas de política | Acesso ao GTM/GA4 |
| 9 | S3 | `feat/ilhas-motor` | Ilhas de preço, calendário e botão Reservar (Preact ou JS puro) com fallback estático | Fases 6 e 7 |
| 10 | S3 | `content/lancamento` | Conteúdo das páginas, 4 artigos do Guia, traduções | Textos e traduções |
| 11 | S4 | `chore/seguranca` | Headers (HSTS em etapas, CSP por hash etc.), Cloudflare (DNS, Access no painel, rate limit na plataforma), CORS, backup e teste de restauração | Acesso ao registro do domínio |
| 12 | S4 | — | Homologação com o Fernando, testes obrigatórios do motor, piloto com reservas da equipe, go-live, envio dos sitemaps, treinamento do painel | Tudo acima |
| 13 | S4+ | `feat/sistema-interno` | Indicadores, relatórios Excel/PDF, controle de entradas com leitura de QR, venda de balcão, estoque da lanchonete | Fase 7 |
| — | +30 dias | — | Monitoramento do GSC, CWV (CrUX), 404s; ajustes finos; reunião de resultados | Go-live |

Cada fase termina com PR, CI verde e um resumo de "o que foi feito e como testar".

---

## (c) Esquema dos content-types do Strapi

Convenções: todo tipo com i18n ativado (PT padrão, EN, ES), rascunho e publicação ativados. Campos marcados com **\*** são obrigatórios (a página não publica sem eles). Validações de tamanho no próprio Strapi; contador de caracteres via plugin de campo personalizado.

### Componentes compartilhados (`shared.*`)

| Componente | Campos |
|---|---|
| `shared.seo` | metaTitle\* (texto, máx. 60) · metaDescription\* (texto, máx. 155) · ogImage (mídia, imagem; vazio = hero) · canonicalOverride (texto, URL) · noindex (booleano, padrão falso) · keyword (texto, uso interno, não localizado) |
| `shared.faq-item` | pergunta\* (texto) · resposta\* (rich text curto) |
| `shared.key-value` | chave\* (texto) · valor\* (texto) |
| `shared.list-item` | texto\* (texto) |
| `shared.source-link` | titulo\* (texto) · url\* (texto, URL) |
| `shared.image-alt` | imagem\* (mídia) · alt\* (texto, máx. 125) · legenda (texto) |
| `shared.cta` | rotulo\* (texto) · tipo\* (enum: produto, link, whatsapp) · produto (relação → Produto) · url (texto) |

### Blocos de conteúdo (`blocks.*`) — usados em Home, Institucional e corpo do Artigo

| Bloco | Campos |
|---|---|
| `blocks.hero` | titulo\* (H1) · respostaDireta\* (texto, máx. 300) · imagem\* (`shared.image-alt`) · cta (`shared.cta`) |
| `blocks.texto` | conteudo\* (rich text: H2/H3, listas, links) |
| `blocks.imagem` | imagem\* (`shared.image-alt`) |
| `blocks.tabela` | titulo (texto) · cabecalho\* (JSON: array de strings) · linhas\* (JSON: array de arrays) |
| `blocks.citacao` | texto\* · autor (texto) |
| `blocks.cta-produto` | produto\* (relação → Produto) · textoChamada (texto) |
| `blocks.destaques-produtos` | titulo · produtos (relação → Produto, máx. 6) |
| `blocks.fatos` | itens (repetível `shared.key-value`) — ex.: "Altura da cachoeira: 75 m" |
| `blocks.avaliacoes` | titulo · avaliacoes (relação → Avaliação, máx. 6) |
| `blocks.faq` | titulo · itens (repetível `shared.faq-item`) |
| `blocks.video` | url\* (texto, URL) · poster\* (`shared.image-alt`) |
| `blocks.mapa-estatico` | imagem\* (`shared.image-alt`) · linkMaps\* (texto, URL) |

### Single types

**Configurações globais** (`global`)
- nomeOficial\* · telefone\* · whatsapp\* (número E.164) · whatsappMensagemPadrao · email\*
- endereco\* (componente: rua, número, bairro, cidade, UF, CEP)
- geo\* (latitude, longitude)
- horarios\* (repetível: dias, abre, fecha)
- redesSociais (repetível: rede enum, url) → `sameAs`
- distancias (repetível `shared.key-value`) — Brotas, São Carlos, São Paulo
- menuPrincipal (repetível: rótulo, link) · rodape (rich text)
- resumoLlms\* (texto longo) → base do `/llms.txt`
- seoPadrao (`shared.seo`)

**Home** (`home`)
- hero\* (`blocks.hero`)
- secoes (Dynamic Zone limitada: destaques-produtos, fatos, avaliacoes, texto, faq, cta-produto, mapa-estatico) — ordem livre, mas só esses blocos ("blocos fixos")
- seo\* (`shared.seo`)

**Guia — página de listagem** (`guia-home`)
- titulo\* · respostaDireta\* (máx. 300) · seo\* — o resto é automático

### Collection types

**Produto** (`produto`)
| Campo | Tipo | Notas |
|---|---|---|
| titulo\* | texto | H1 |
| slug\* | UID (de `titulo`) | único por idioma |
| categoria\* | relação → Categoria de produto | Day Use, Hospedagem, Camping, Churrasqueira, Combo |
| respostaRapida\* | texto, máx. 300 | primeiro parágrafo |
| galeria\* | repetível `shared.image-alt`, máx. 12 | primeira = hero |
| video | `blocks.video` | fachada |
| precoAPartirDe\* | decimal | fallback |
| setorMotorId | texto, não localizado | quiosques e churrasqueiras: setor no motor |
| unidadePreco\* | enum: por pessoa, por noite, por espaço/dia, por pessoa/noite | aparece ao lado do preço |
| motorProdutoId\* | texto, não localizado | liga à plataforma |
| inclui | repetível `shared.list-item` | |
| naoInclui | repetível `shared.list-item` | |
| regras | rich text curto | horários, crianças, animais |
| capacidade | repetível `shared.key-value` | |
| tabelaComparativa | `blocks.tabela` | opcional (ex.: acomodações) |
| faq | repetível `shared.faq-item` | → FAQPage |
| relacionados | relação N:N → Produto | |
| avaliacoes | relação N:N → Avaliação | |
| tipoSchema\* | enum: Product, TouristTrip, LodgingBusiness, Campground | define o JSON-LD |
| seo\* | `shared.seo` | |

**Categoria de produto** (`categoria-produto`) — é a página de **Listagem de produtos**
- titulo\* · slug\* · respostaDireta\* (máx. 300) · introducao (rich text) · imagemHero\* (`shared.image-alt`) · ordemProdutos (relação → Produto, ordenável) · faq (repetível) · seo\*

**Artigo** (`artigo`)
| Campo | Tipo | Notas |
|---|---|---|
| titulo\* | texto | H1 |
| slug\* | UID | |
| categoria\* | relação → Categoria do Guia | |
| autor\* | relação → Autor | |
| dataPublicacao\* | data | visível |
| dataAtualizacao\* | data | visível; `dateModified` |
| resumo\* | texto, máx. 300 | resposta direta |
| imagemDestaque\* | `shared.image-alt` | `image` do schema |
| corpo\* | Dynamic Zone: texto, imagem, tabela, citacao, cta-produto | |
| faq | repetível `shared.faq-item` | |
| fontes | repetível `shared.source-link` | |
| ctaProduto | relação → Produto | CTA final |
| artigosRelacionados | relação N:N → Artigo | se vazio, automático pela categoria |
| seo\* | `shared.seo` | |

**Categoria do Guia** (`categoria-guia`) — O que fazer, Cachoeiras, Quando ir, Família, Camping
- nome\* · slug\* · descricao (texto) · seo\*

**Autor** (`autor`)
- nome\* · slug\* · foto\* (`shared.image-alt`) · minibio\* (texto, máx. 300) · link (URL) · sameAs (repetível URL)

**Avaliação** (`avaliacao`) — não localizado
- nomeAutor\* · nota\* (inteiro 1–5) · texto\* · data\* · fonte\* (enum: Google, TripAdvisor, Booking, Pós-visita Saltão) · urlFonte (URL) · produto (relação → Produto, opcional)

**Página institucional** (`pagina-institucional`) — Conheça o Saltão, Segurança, Como chegar, Políticas
- titulo\* · slug\* · respostaDireta\* (máx. 300) · secoes\* (Dynamic Zone: texto, imagem, tabela, fatos, faq, mapa-estatico, video, cta-produto) · seo\*

**Página FAQ / Contato** (`pagina-atendimento`) — Dúvidas e Contato, Minha reserva
- titulo\* · slug\* · respostaDireta\* · tipo\* (enum: faq-contato, minha-reserva) · grupos (repetível: tituloGrupo, itens `shared.faq-item`) · mostrarFormulario (booleano) · textoConsentimento\* (rich text curto, LGPD) · seo\*

**Página legal** — Política de Privacidade e de Cookies entram como `pagina-institucional` com `noindex` opcional.

### Papéis
- **Admin (BWM):** tudo, incluindo configurações e tipos.
- **Editor (Saltão):** cria, edita e publica todos os tipos de conteúdo, incluindo preços; não altera Configurações técnicas nem papéis.
- **Autor:** cria e edita Artigo apenas em rascunho, sem permissão de publicar; o Editor revisa e publica.

---

## (d) Plataforma (motor + sistema interno) — esboço até receber o código do SuiVerde

**O que preciso:** acesso ao repositório do SuiVerde (ou um .zip), stack exata (framework, ORM, gateway em uso) e o schema do banco.

**Modelo de dados proposto (MySQL), independente do SuiVerde:**

- `produto` (id, slug, tipo_cobranca enum[noite, dia], unidade enum[pessoa, espaco, unidade], ativo, politica_id)
- `setor` (id, produto_id, nome, capacidade_pessoas) — ex.: "Quiosques beira-rio"; é o que o cliente escolhe
- `recurso` — o que tem estoque: cada apartamento, cada quiosque (80), cada churrasqueira (102), cada área de camping, "lotação Day Use" (id, produto_id, setor_id, codigo, capacidade). Nos quiosques e churrasqueiras, o motor aloca automaticamente um recurso livre do setor escolhido
- `combo_item` (combo_id → produto, produto_id, quantidade) — combos herdam o estoque dos itens
- `faixa_etaria` (id, nome, idade_min, idade_max)
- `tarifa` (produto_id, faixa_etaria_id nulo, data_inicio, data_fim, dias_semana, tipo enum[base, temporada, fim_de_semana, feriado], valor, prioridade)
- `feriado` (data, nome)
- `cupom` (codigo, tipo, valor, validade, limite_uso, usos)
- `reserva` (id, codigo, cliente_id, status enum[hold, pendente_pagamento, confirmada, cancelada, expirada, utilizada], expira_em, total, origem/utm, created_at)
- `reserva_item` (reserva_id, produto_id, recurso_id nulo, data_inicio, data_fim, quantidade, faixa_etaria_id, valor)
- `ocupacao` (recurso_id, data, reserva_item_id, quantidade) — **uma linha por recurso por dia**, com índice único (recurso_id, data) nos espaços e soma controlada na lotação; é o que garante que duas compras simultâneas não confirmem o mesmo espaço (`SELECT … FOR UPDATE` + índice único dentro de transação)
- `pagamento` (reserva_id, gateway, gateway_id, metodo, status, valor, payload) + `webhook_evento` (gateway_event_id único → idempotência)
- `voucher` (reserva_id, qr_token único, usado_em, usado_por)
- `cliente` (nome, email, telefone, consentimento_lgpd_em)
- `politica` (cancelamento, reembolso, alteração de data — regras configuráveis)
- Sistema interno: `usuario` e `papel` (Admin, Gerente, Portaria, Lanchonete), `checkin`, `venda_balcao`, `estoque_item`, `estoque_movimento`, `audit_log`

**Hold de 15 minutos:** a reserva nasce em `hold` com `expira_em = agora + 15 min` e já grava as linhas de `ocupacao` dentro da transação. Um job a cada minuto expira holds vencidos e libera a ocupação. O webhook do gateway confirma (`hold/pendente → confirmada`) só se a reserva ainda não expirou; se expirou e o pagamento entrou, a ocupação é retentada e, se não houver vaga, gera estorno automático e alerta.

**Reaproveitar (a confirmar no código):** calendário, fluxo e telas do checkout, telas do admin, base visual. **Refazer:** modelo de produto, cálculo de disponibilidade e de preço.
