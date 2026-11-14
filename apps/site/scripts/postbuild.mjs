#!/usr/bin/env node
/**
 * Pós-build: gera dist/.htaccess (Hostinger/LiteSpeed) com
 *  - redirecionamento para HTTPS + host canônico,
 *  - 301 da migração (migracao/redirects.csv), sem cadeias,
 *  - headers de segurança (HSTS em etapas, frame-ancestors, nosniff, Referrer-Policy, Permissions-Policy),
 *  - cache: assets com hash imutáveis por 1 ano, HTML com cache curto.
 * A CSP de scripts/estilos (com hashes) é gerada pelo Astro em <meta> em cada página.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { lerRedirects, validarRedirects } from "./redirects.mjs";
import { indexavel } from "./indexacao.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(raiz, "dist");
const site = new URL(process.env.SITE_URL ?? "https://www.saltao.com.br");
// Decisão 4: começa com 1 dia; depois 1 ano + includeSubDomains; preload só no fim.
const HSTS = process.env.HSTS_HEADER ?? "max-age=86400";
// Fora do domínio oficial (endereço provisório, staging), o site inteiro sai com noindex.
const podeIndexar = indexavel(site.href);

const csv = join(raiz, "migracao", "redirects.csv");
const redirects = existsSync(csv) ? lerRedirects(readFileSync(csv, "utf8")) : [];
const erros = validarRedirects(redirects);
if (erros.length) {
  console.error("Erros no mapa de 301:\n" + erros.join("\n"));
  process.exit(1);
}
const escRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const htaccess = `# Gerado por scripts/postbuild.mjs — não editar à mão.
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On

  # HTTPS + host canônico (${site.host}) num único salto
  RewriteCond %{HTTPS} off [OR]
  RewriteCond %{HTTP_HOST} !^${escRegex(site.host)}$ [NC]
  RewriteRule ^(.*)$ https://${site.host}/$1 [R=301,L]

  # Barra final (URLs canônicas terminam em /)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_URI} !\\.[a-z0-9]+$ [NC]
  RewriteRule ^(.*[^/])$ /$1/ [R=301,L]

  # Migração: URLs antigas → novas (${redirects.length} regras)
${redirects.map((r) => `  RewriteRule ^${escRegex(r.de.replace(/^\//, ""))}$ ${r.para} [R=301,L,NE]`).join("\n")}
</IfModule>

<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "${HSTS}"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  Header always set Content-Security-Policy "frame-ancestors 'self'; upgrade-insecure-requests"
  Header always set Cross-Origin-Opener-Policy "same-origin"
  Header unset X-Powered-By
${podeIndexar ? "" : `
  # Fora do domínio oficial (${site.host}): não indexar
  Header always set X-Robots-Tag "noindex, nofollow"
`}
  # Assets com hash no nome: imutáveis por 1 ano
  <FilesMatch "\\.(js|css|avif|webp|jpg|jpeg|png|svg|woff2|ico)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  # HTML, XML e TXT: cache curto (o conteúdo muda a cada publicação no painel)
  <FilesMatch "\\.(html|xml|txt)$">
    Header set Cache-Control "public, max-age=300, must-revalidate"
  </FilesMatch>
</IfModule>

# favicon e arquivos sem hash não devem ficar imutáveis
<Files "favicon.svg">
  <IfModule mod_headers.c>
    Header set Cache-Control "public, max-age=86400"
  </IfModule>
</Files>
<Files "favicon.ico">
  <IfModule mod_headers.c>
    Header set Cache-Control "public, max-age=86400"
  </IfModule>
</Files>

<IfModule mod_mime.c>
  AddType image/avif .avif
  AddType image/webp .webp
  AddCharset utf-8 .html .css .js .xml .txt .json
</IfModule>

# Compressão (LiteSpeed da Hostinger aplica Brotli automaticamente quando disponível)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript text/javascript application/json application/xml text/xml text/plain text/markdown image/svg+xml
</IfModule>
`;

writeFileSync(join(dist, ".htaccess"), htaccess);

// Arquivo de verificação do IndexNow (a chave é pública por definição do protocolo).
const indexNow = process.env.INDEXNOW_KEY;
if (indexNow && /^[a-zA-Z0-9-]{8,128}$/.test(indexNow)) writeFileSync(join(dist, `${indexNow}.txt`), indexNow);
console.log(`.htaccess gerado (${redirects.length} redirects, HSTS: ${HSTS}${podeIndexar ? "" : ", noindex: host fora do domínio oficial"})`);
