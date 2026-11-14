/**
 * Trava de indexação: só o domínio oficial pode ser indexado.
 * Qualquer outro host (endereço provisório da Hostinger, staging, preview) sai com
 * "X-Robots-Tag: noindex, nofollow" no .htaccess e não envia ping ao IndexNow.
 */
export const HOSTS_OFICIAIS = ["www.saltao.com.br", "saltao.com.br"];

/** true se o SITE_URL (ou host) informado pode ser indexado pelos buscadores. */
export function indexavel(siteUrl) {
  const host = new URL(siteUrl).host.toLowerCase();
  return HOSTS_OFICIAIS.includes(host);
}
