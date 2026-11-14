/**
 * Único script global do site (~1 KB). Faz duas coisas:
 * 1. Envia ao dataLayer os eventos de clique marcados com [data-dl] e os eventos da página (#dl-pagina).
 * 2. Carrega o banner de cookies só quando o navegador está ocioso (não pesa no LCP/INP).
 * Nenhuma tag de terceiro roda aqui: o GTM só entra depois da escolha no banner (consentimento.ts).
 */
type DL = Record<string, unknown>;
const w = window as unknown as { dataLayer: unknown[] };
w.dataLayer = w.dataLayer || [];

function enviar(evento: DL) {
  if (evento.ecommerce) w.dataLayer.push({ ecommerce: null }); // limpa o objeto anterior (padrão GA4)
  w.dataLayer.push(evento);
}

// Eventos da página (view_item, view_item_list) — JSON estático gerado na build.
const pagina = document.getElementById("dl-pagina");
if (pagina?.textContent) {
  try {
    for (const ev of JSON.parse(pagina.textContent) as DL[]) enviar(ev);
  } catch {
    /* JSON inválido não pode quebrar a página */
  }
}

// Cliques rastreados (delegação: um único listener).
document.addEventListener(
  "click",
  (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>("[data-dl]");
    if (!el?.dataset.dl) return;
    try {
      enviar(JSON.parse(el.dataset.dl));
    } catch {
      /* ignora */
    }
  },
  { capture: true },
);

// Banner de cookies: carrega no ocioso ou na primeira interação, o que vier antes.
let carregado = false;
function carregarConsentimento() {
  if (carregado) return;
  carregado = true;
  void import("./consentimento");
}
const ocioso = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
if (ocioso) ocioso(carregarConsentimento, { timeout: 3000 });
else setTimeout(carregarConsentimento, 1500);
for (const ev of ["pointerdown", "keydown", "scroll"]) addEventListener(ev, carregarConsentimento, { once: true, passive: true });
