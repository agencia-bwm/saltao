/** Resolve o destino de uma chamada (CTA) do painel para o idioma da página. */
import type { Cta, Locale } from "./types";
import type { Indice } from "./routes";
import { linkReserva, linkWhatsApp } from "./config";

export function hrefCta(cta: Cta | undefined, indice: Indice, locale: Locale): string {
  const g = indice.conteudo.global[locale] ?? indice.conteudo.global.pt;
  if (!cta) return linkReserva({ lang: locale });
  switch (cta.tipo) {
    case "produto":
      return (cta.produtoId && indice.link("produto", cta.produtoId, locale)) || linkReserva({ lang: locale });
    case "categoria":
      return (cta.categoriaId && (indice.link("categoria-produto", cta.categoriaId, locale) ?? indice.link("categoria-produto", cta.categoriaId, "pt"))) || "/";
    case "pagina":
      return (cta.paginaId && (indice.link("institucional", cta.paginaId, locale) ?? indice.link("institucional", cta.paginaId, "pt"))) || "/";
    case "whatsapp":
      return g ? linkWhatsApp(g.whatsapp, g.whatsappMensagemPadrao) : "/";
    default:
      return cta.url ?? linkReserva({ lang: locale });
  }
}
