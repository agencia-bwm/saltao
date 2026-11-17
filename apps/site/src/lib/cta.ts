/** Destino de um botão (Cta do painel): WhatsApp, página de produto ou link (padrão: plataforma de reservas). */
import type { Cta, Locale } from "./types";
import type { Indice } from "./routes";
import { RESERVAS_URL, linkReserva, linkWhatsApp } from "./config";

export interface Destino {
  href: string;
  dl: string;
  externo: boolean;
}

export function destinoCta(c: Cta, indice: Indice, locale: Locale, origem: string): Destino {
  const g = indice.conteudo.global[locale] ?? indice.conteudo.global.pt;
  if (c.tipo === "whatsapp") return { href: g ? linkWhatsApp(g.whatsapp, g.whatsappMensagemPadrao) : "#", dl: JSON.stringify({ event: "generate_lead", method: `whatsapp_${origem}` }), externo: true };
  const href = c.tipo === "produto" && c.produtoId ? (indice.link("produto", c.produtoId, locale) ?? linkReserva({ lang: locale })) : (c.url ?? linkReserva({ lang: locale }));
  const reserva = href.startsWith(RESERVAS_URL);
  return { href, dl: reserva ? JSON.stringify({ event: "click_reservar", method: origem }) : "", externo: false };
}

/** Âncora a partir de um título: "A queda de 75 m" → "a-queda-de-75-m". */
export function ancora(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
