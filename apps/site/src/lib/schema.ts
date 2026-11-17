/** Geradores de JSON-LD (schema.org). Cada template monta o seu @graph a partir daqui. */
import type { Artigo, Autor, Faq, Global, Locale, Produto, RichText } from "./types";
import type { Migalha } from "./routes";
import { absoluta, linkReserva, SITE_URL } from "./config";
import { HTML_LANG } from "./i18n";

type Node = Record<string, unknown>;
export const ID_ORG = `${SITE_URL}/#saltao`;
export const ID_SITE = `${SITE_URL}/#website`;

/** Texto puro de um rich text (para resposta do FAQ no schema). */
export function textoPuro(rt: RichText): string {
  const inline = (c: any): string => (c.type === "link" ? c.children.map(inline).join("") : (c.text ?? ""));
  return rt
    .map((b: any) => {
      if (b.type === "list") return b.children.map((li: any) => li.children.map(inline).join("")).join("; ");
      if (b.type === "image") return "";
      return (b.children ?? []).map(inline).join("");
    })
    .filter(Boolean)
    .join("\n");
}

const DIAS: Record<string, string[]> = {
  Mo: ["Monday"], Tu: ["Tuesday"], We: ["Wednesday"], Th: ["Thursday"], Fr: ["Friday"], Sa: ["Saturday"], Su: ["Sunday"],
};
const ORDEM = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
/** "Mo-Fr" ou "Sa,Su" → nomes schema.org. */
function dias(spec: string): string[] {
  return spec.split(",").flatMap((parte) => {
    const [a, b] = parte.trim().split("-");
    if (!b) return DIAS[a] ?? [];
    const i = ORDEM.indexOf(a), j = ORDEM.indexOf(b);
    return ORDEM.slice(i, j + 1).flatMap((d) => DIAS[d]);
  });
}

export function endereco(g: Global): Node {
  return {
    "@type": "PostalAddress",
    streetAddress: `${g.endereco.rua}, ${g.endereco.numero}`,
    addressLocality: g.endereco.cidade,
    addressRegion: g.endereco.uf,
    postalCode: g.endereco.cep,
    addressCountry: "BR",
  };
}

/** Nó global: Organization + TouristAttraction + LocalBusiness (sem aggregateRating — decisão 7). */
export function noGlobal(g: Global, logoUrl: string, imagemUrl: string): Node[] {
  return [
    {
      "@type": ["TouristAttraction", "LocalBusiness"],
      "@id": ID_ORG,
      name: g.nomeOficial,
      url: `${SITE_URL}/`,
      logo: logoUrl,
      image: imagemUrl,
      telephone: g.telefone,
      email: g.email,
      address: endereco(g),
      geo: { "@type": "GeoCoordinates", latitude: g.geo.latitude, longitude: g.geo.longitude },
      openingHoursSpecification: g.horarios.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dias(h.dias), opens: h.abre, closes: h.fecha })),
      sameAs: g.redesSociais.map((r) => r.url),
      isAccessibleForFree: false,
      publicAccess: true,
    },
    { "@type": "WebSite", "@id": ID_SITE, url: `${SITE_URL}/`, name: g.nomeOficial, publisher: { "@id": ID_ORG }, inLanguage: ["pt-BR", "en", "es"] },
  ];
}

export function noWebPage(path: string, nome: string, descricao: string, locale: Locale, tipo = "WebPage"): Node {
  return { "@type": tipo, "@id": `${absoluta(path)}#pagina`, url: absoluta(path), name: nome, description: descricao, inLanguage: HTML_LANG[locale], isPartOf: { "@id": ID_SITE }, about: { "@id": ID_ORG } };
}

export function noBreadcrumbs(migalhas: Migalha[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: migalhas.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.nome, item: absoluta(m.path) })),
  };
}

export function noFaq(faqs: Faq[], path: string): Node | null {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    "@id": `${absoluta(path)}#faq`,
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.pergunta, acceptedAnswer: { "@type": "Answer", text: textoPuro(f.resposta) } })),
  };
}

/** Oferta só com o link de reserva (o valor fica na plataforma). */
function ofertaSemPreco(p: Produto, path: string, locale: Locale, ancora?: string): Node {
  return {
    "@type": "Offer",
    "@id": `${absoluta(path)}#oferta${ancora ? `-${ancora}` : ""}`,
    url: linkReserva({ produto: p.motorProdutoId, setor: p.setorMotorId, lang: locale }),
    availability: "https://schema.org/InStock",
    seller: { "@id": ID_ORG },
  };
}

function oferta(p: Produto, path: string, locale: Locale, ancora?: string): Node {
  return {
    "@type": "Offer",
    price: p.precoAPartirDe.toFixed(2),
    priceCurrency: "BRL",
    availability: "https://schema.org/InStock",
    url: linkReserva({ produto: p.motorProdutoId, setor: p.setorMotorId, lang: locale }),
    seller: { "@id": ID_ORG },
    // "a partir de": o preço exibido é o mínimo
    priceSpecification: { "@type": "UnitPriceSpecification", price: p.precoAPartirDe.toFixed(2), priceCurrency: "BRL", valueAddedTaxIncluded: true },
    "@id": `${absoluta(path)}#oferta${ancora ? `-${ancora}` : ""}`,
  };
}

/**
 * Produto conforme tipoSchema: Product, TouristTrip, LodgingBusiness ou Campground.
 * `ancora`: produto exibido como seção de uma landing (url = página#ancora, ids sem colisão).
 */
export function noProduto(p: Produto, path: string, imagens: string[], g: Global, locale: Locale, ancora?: string, opcoes: { semPreco?: boolean } = {}): Node {
  const sufixo = ancora ? `-${ancora}` : "";
  const base = { "@id": `${absoluta(path)}#produto${sufixo}`, name: p.titulo, description: p.respostaRapida, image: imagens, url: absoluta(path) + (ancora ? `#${ancora}` : "") };
  switch (p.tipoSchema) {
    case "LodgingBusiness":
    case "Campground":
      return {
        ...base,
        "@type": p.tipoSchema,
        address: endereco(g),
        geo: { "@type": "GeoCoordinates", latitude: g.geo.latitude, longitude: g.geo.longitude },
        telephone: g.telefone,
        parentOrganization: { "@id": ID_ORG },
        // Página sem valores visíveis (landing): sem preço no schema também — dado estruturado só do que está na página.
        priceRange: opcoes.semPreco ? undefined : `a partir de R$ ${p.precoAPartirDe}`,
        containsPlace: { "@type": "Accommodation", name: p.titulo, occupancy: undefined },
        makesOffer: opcoes.semPreco ? ofertaSemPreco(p, path, locale, ancora) : oferta(p, path, locale, ancora),
      };
    case "TouristTrip":
      return { ...base, "@type": "TouristTrip", provider: { "@id": ID_ORG }, offers: oferta(p, path, locale, ancora) };
    default:
      return { ...base, "@type": "Product", brand: { "@type": "Brand", name: g.nomeOficial }, offers: oferta(p, path, locale, ancora) };
  }
}

export function noArtigo(a: Artigo, autor: Autor | undefined, path: string, imagem: string, fotoAutor?: string): Node {
  return {
    "@type": "BlogPosting",
    "@id": `${absoluta(path)}#artigo`,
    headline: a.titulo,
    description: a.resumo,
    image: [imagem],
    datePublished: a.dataPublicacao,
    dateModified: a.dataAtualizacao,
    mainEntityOfPage: { "@id": `${absoluta(path)}#pagina` },
    publisher: { "@id": ID_ORG },
    author: autor
      ? { "@type": "Person", name: autor.nome, description: autor.minibio, url: autor.link, image: fotoAutor, sameAs: autor.sameAs.length ? autor.sameAs : undefined }
      : { "@id": ID_ORG },
    citation: a.fontes.length ? a.fontes.map((f) => f.url) : undefined,
  };
}

export function grafo(nos: (Node | null | undefined)[]): string {
  // JSON.stringify remove chaves undefined; "<" escapado evita fechar a tag <script>.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nos.filter(Boolean) }).replace(/</g, "\\u003c");
}
