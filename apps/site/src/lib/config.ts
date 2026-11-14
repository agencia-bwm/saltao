/** Configuração vinda de variáveis de ambiente (definidas no GitHub Actions; nunca no código). */
const env = (k: string, padrao = "") => (import.meta.env[k] as string | undefined) ?? process.env[k] ?? padrao;

/** Domínio canônico. Confirmar com/sem www no crawl do site atual (decisão 19). */
export const SITE_URL = env("SITE_URL", "https://www.saltao.com.br").replace(/\/$/, "");
/** Plataforma de reservas (motor). */
export const RESERVAS_URL = env("PUBLIC_RESERVAS_URL", "https://reservas.saltao.com.br").replace(/\/$/, "");
/** Container do GTM. Sem ID, nenhuma tag é carregada (dev e CI). */
export const GTM_ID = env("PUBLIC_GTM_ID");

export const absoluta = (path: string) => `${SITE_URL}${path}`;

/** Link de reserva com fallback estático (funciona mesmo se a API do motor estiver fora). */
export function linkReserva(params: { produto?: string; setor?: string; data?: string; lang?: string } = {}) {
  const u = new URL(`${RESERVAS_URL}/reservar`);
  for (const [k, v] of Object.entries(params)) if (v) u.searchParams.set(k, v);
  return u.toString();
}

export function linkWhatsApp(numero: string, mensagem?: string) {
  const u = new URL(`https://wa.me/${numero.replace(/\D/g, "")}`);
  if (mensagem) u.searchParams.set("text", mensagem);
  return u.toString();
}
