# Saltão — Parque de Ecoturismo · site, painel e plataforma de reservas

Monorepo da Agência BWM para o novo saltao.com.br. Especificação: [`docs/briefing-tecnico.md`](docs/briefing-tecnico.md) · decisões: [`docs/passo-1-decisoes.md`](docs/passo-1-decisoes.md) · regras para o Claude: [`CLAUDE.md`](CLAUDE.md).

| Pasta | O que é | Onde roda |
|---|---|---|
| `apps/site` | Site público (Astro 7, estático) | `public_html` da Hostinger (+ CDN) |
| `apps/painel` | Painel de conteúdo (Strapi 5) | App Node.js `painel.saltao.com.br` |
| `apps/plataforma` | Motor de reservas + sistema interno | App Node.js `reservas.saltao.com.br` |
| `packages/ui` | Tokens de design e marca | — |

## Rodar localmente

Requisitos: Node 22.18+, pnpm 10, (opcional) MariaDB/MySQL para a plataforma.

```bash
pnpm install

# Site com dados de exemplo
pnpm dev:site                                  # http://localhost:4321
pnpm build:site && pnpm --filter @saltao/site test

# Painel (SQLite local)
cd apps/painel && cp .env.example .env         # troque DATABASE_CLIENT=sqlite e gere os segredos
npm install && npm run develop                 # http://localhost:1337/admin
npm run build && node scripts/seed-exemplo.js  # (opcional, com o painel parado) conteúdo de exemplo + token

# Site lendo do painel local
STRAPI_URL=http://localhost:1337 STRAPI_TOKEN=$(cat apps/painel/.tmp/token-build.txt) pnpm build:site

# Plataforma
cd apps/plataforma && cp .env.example .env
DATABASE_URL=… npm run migrar
DATABASE_URL_TEST=mysql://…/saltao_plataforma_test npm test
```

## Publicar conteúdo
1. O editor salva e clica em **Publicar** no painel.
2. O painel espera 60 s (junta várias publicações) e dispara `repository_dispatch` no GitHub.
3. O workflow **Deploy do site** builda, testa, publica por rsync e avisa o IndexNow. Leva de 1 a 3 minutos.

## Mudar código
Branch → PR → CI verde (build, testes, Lighthouse CI ≥ 95, validação de schema, npm audit) → merge na `main` → deploy automático.

## Configuração do GitHub (ambiente `producao`)
| Tipo | Nome | Valor |
|---|---|---|
| var | `SITE_URL` | `https://www.saltao.com.br` (confirmar com/sem www no crawl) |
| var | `STRAPI_URL` | `https://painel.saltao.com.br` |
| var | `RESERVAS_URL` | `https://reservas.saltao.com.br` |
| var | `GTM_ID` | `GTM-…` |
| var | `HSTS_HEADER` | `max-age=86400` → depois `max-age=31536000; includeSubDomains` |
| var | `INDEXNOW_KEY` | chave gerada no Bing Webmaster |
| var | `HOSTINGER_PUBLIC_HTML` | caminho do `public_html` |
| secret | `STRAPI_TOKEN` | token read-only do painel |
| secret | `HOSTINGER_SSH_KEY`, `HOSTINGER_SSH_HOST`, `HOSTINGER_SSH_PORT`, `HOSTINGER_SSH_USER` | acesso SSH |

No painel (variáveis da app Node): `GITHUB_REPO` e `GITHUB_DISPATCH_TOKEN` (token fine-grained com "Contents: read & write" só neste repositório).

## Backup e restauração
- A Hostinger faz backup diário dos bancos e arquivos. Além disso, manter export semanal por 30 dias:
  - Painel: `mysqldump --single-transaction <banco_painel> | gzip > painel-AAAA-MM-DD.sql.gz` + cópia de `apps/painel/public/uploads/`.
  - Plataforma: `mysqldump --single-transaction <banco_plataforma> | gzip > plataforma-AAAA-MM-DD.sql.gz`.
- Restaurar (testar antes do go-live — item do aceite):
  1. Criar banco vazio no hPanel; `gunzip -c arquivo.sql.gz | mysql <banco_novo>`.
  2. Apontar `DATABASE_NAME` da app para o banco novo e reiniciar a app no hPanel.
  3. Painel: devolver `public/uploads/`; rodar o workflow **Deploy do site** manualmente.
  4. Conferir: login no painel, uma página de produto no site, uma consulta de disponibilidade.

## Testes obrigatórios do motor (antes de vender)
`apps/plataforma/tests/motor.test.ts`: compra simultânea do mesmo quiosque (só uma confirma), lotação do Day Use, hold de 15 min, webhook repetido, valor divergente, pagamento após expirar, voucher lido uma vez na portaria. Pix/cartão em sandbox e o piloto com a equipe ficam para a fase do checkout.
