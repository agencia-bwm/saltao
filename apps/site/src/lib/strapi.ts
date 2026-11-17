/**
 * Leitura do conteúdo no Strapi 5 (API REST) e normalização para os tipos do site.
 * Roda só na build. Os nomes de campos espelham os schema.json de apps/painel/src.
 */
import type { Block, CardFoto, Conteudo, Faq, Img, KV, LinkRotulo, Locale, RichText, Seo, Tabela } from "./types";
import { LOCALES } from "./types";

type Json = any; // resposta crua da API; validada campo a campo na normalização

const STRAPI_URL = (import.meta.env.STRAPI_URL ?? process.env.STRAPI_URL ?? "").replace(/\/$/, "");
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN ?? process.env.STRAPI_TOKEN ?? "";

/* ---------- populate (sintaxe de query do Strapi 5) ---------- */
type Populate = true | { on: Record<string, Populate> } | { [campo: string]: Populate };

/** Monta a query `populate` do Strapi 5, incluindo dynamic zones (`on`). */
function no(prefixo: string, spec: Populate, out: string[]) {
  if (spec === true) {
    out.push(`${prefixo}=true`);
    return;
  }
  if ("on" in spec && typeof spec.on === "object") {
    for (const [comp, v] of Object.entries(spec.on as Record<string, Populate>)) {
      if (v === true) out.push(`${prefixo}[on][${comp}][populate]=*`);
      else for (const [k, vv] of Object.entries(v)) no(`${prefixo}[on][${comp}][populate][${k}]`, vv as Populate, out);
    }
    return;
  }
  for (const [k, v] of Object.entries(spec)) no(`${prefixo}[populate][${k}]`, v as Populate, out);
}
export function populateQuery(spec: Record<string, Populate>): string {
  const out: string[] = [];
  for (const [k, v] of Object.entries(spec)) no(`populate[${k}]`, v, out);
  return out.map((s) => s.replace(/\[/g, "%5B").replace(/\]/g, "%5D")).join("&");
}

const seoPop = { ogImage: true } as const;
const faqPop = true as const;
const blocosPop: Populate = {
  on: {
    "blocks.hero": { imagem: { imagem: true }, cta: { produto: true }, cardProduto: true },
    "blocks.essencia": { fotos: { imagem: true }, itens: true },
    "blocks.vitrine": { atalhos: true, itens: { imagem: { imagem: true } }, linkTodos: true },
    "blocks.experiencias": { itens: { imagem: { imagem: true } }, linkTodos: true },
    "blocks.texto": true,
    "blocks.imagem": { imagem: { imagem: true } },
    "blocks.tabela": true,
    "blocks.citacao": true,
    "blocks.cta-produto": { produto: true },
    "blocks.destaques-produtos": { produtos: true },
    "blocks.fatos": { itens: true, imagem: { imagem: true } },
    "blocks.galeria": { fotos: { imagem: true } },
    "blocks.setor": { fotos: { imagem: true }, destaques: true, lista: true, cta: { produto: true }, ctaSecundario: { produto: true } },
    "blocks.chamada": { imagem: { imagem: true }, cta: { produto: true }, ctaSecundario: { produto: true } },
    "blocks.avaliacoes": { avaliacoes: true },
    "blocks.faq": { itens: true },
    "blocks.video": { poster: { imagem: true } },
    "blocks.mapa-estatico": { imagem: { imagem: true } },
  },
};

const POPULATE: Record<string, Record<string, Populate>> = {
  global: { endereco: true, geo: true, horarios: true, redesSociais: true, distancias: true, menuPrincipal: { subitens: true }, seoPadrao: seoPop },
  home: { hero: { imagem: { imagem: true }, cta: { produto: true }, cardProduto: true }, secoes: blocosPop, seo: seoPop },
  "guia-home": { seo: seoPop },
  produtos: {
    categoria: true,
    galeria: { imagem: true },
    video: { poster: { imagem: true } },
    inclui: true,
    naoInclui: true,
    capacidade: true,
    tabelaComparativa: true,
    faq: faqPop,
    relacionados: true,
    avaliacoes: true,
    destaques: true,
    seo: seoPop,
  },
  "categorias-produto": { imagemHero: { imagem: true }, ordemProdutos: true, faq: faqPop, fotosIntro: { imagem: true }, secoes: blocosPop, seo: seoPop },
  artigos: { categoria: true, autor: true, imagemDestaque: { imagem: true }, corpo: blocosPop, faq: faqPop, fontes: true, ctaProduto: true, artigosRelacionados: true, seo: seoPop },
  "categorias-guia": { seo: seoPop },
  autores: { foto: { imagem: true } },
  avaliacoes: { produto: true },
  "paginas-institucionais": { fotosIntro: { imagem: true }, secoes: blocosPop, seo: seoPop },
  "paginas-atendimento": { grupos: { itens: true }, seo: seoPop },
};

async function get(path: string): Promise<Json> {
  const res = await fetch(`${STRAPI_URL}/api/${path}`, { headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {} });
  if (res.status === 404) return { data: null };
  if (!res.ok) throw new Error(`Strapi ${res.status} em /api/${path}: ${await res.text()}`);
  return res.json();
}

async function colecao(tipo: string, locale: Locale | null): Promise<Json[]> {
  const itens: Json[] = [];
  for (let page = 1; ; page++) {
    const loc = locale ? `&locale=${locale}` : "";
    const r = await get(`${tipo}?${populateQuery(POPULATE[tipo])}${loc}&status=published&pagination[pageSize]=100&pagination[page]=${page}`);
    itens.push(...(r.data ?? []));
    const pg = r.meta?.pagination;
    if (!pg || page >= pg.pageCount) break;
  }
  return itens;
}

async function single(tipo: string, locale: Locale): Promise<Json | null> {
  const r = await get(`${tipo}?${populateQuery(POPULATE[tipo])}&locale=${locale}&status=published`);
  return r.data ?? null;
}

/* ---------- normalização ---------- */
const abs = (url: string) => (url.startsWith("http") ? url : `${STRAPI_URL}${url}`);

function midia(m: Json, alt?: string): Img | undefined {
  if (!m?.url) return undefined;
  return { src: abs(m.url), alt: alt ?? m.alternativeText ?? "", width: m.width ?? undefined, height: m.height ?? undefined, caption: m.caption ?? undefined };
}
/** Componente shared.image-alt → Img (alt do componente tem prioridade sobre o da mídia). */
function imgAlt(c: Json): Img | undefined {
  if (!c) return undefined;
  const i = midia(c.imagem, c.alt);
  if (i && c.legenda) i.caption = c.legenda;
  return i;
}
const rich = (v: Json): RichText => (Array.isArray(v) ? (v as RichText) : []);
const faqs = (v: Json): Faq[] => (Array.isArray(v) ? v.map((f: Json) => ({ pergunta: f.pergunta, resposta: rich(f.resposta) })) : []);
const kvs = (v: Json): KV[] => (Array.isArray(v) ? v.map((x: Json) => ({ chave: x.chave, valor: x.valor })) : []);
const ids = (v: Json): string[] => (Array.isArray(v) ? v.map((x: Json) => x.documentId).filter(Boolean) : []);
const lista = (v: Json): string[] => (Array.isArray(v) ? v.map((x: Json) => x.texto).filter(Boolean) : []);
function tabela(v: Json): Tabela | undefined {
  if (!v || !Array.isArray(v.cabecalho)) return undefined;
  return { titulo: v.titulo ?? undefined, cabecalho: v.cabecalho, linhas: Array.isArray(v.linhas) ? v.linhas : [] };
}
function seo(v: Json): Seo {
  return {
    metaTitle: v?.metaTitle ?? "",
    metaDescription: v?.metaDescription ?? "",
    ogImage: midia(v?.ogImage),
    canonicalOverride: v?.canonicalOverride || undefined,
    noindex: Boolean(v?.noindex),
    keyword: v?.keyword ?? undefined,
  };
}
const doc = (d: Json) => ({ documentId: d.documentId as string, locale: d.locale as Locale, updatedAt: d.updatedAt as string });

function blocos(v: Json): Block[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((b: Json): Block | null => {
      switch (b.__component) {
        case "blocks.hero":
          return hero(b);
        case "blocks.essencia":
          return {
            __component: b.__component,
            sobretitulo: b.sobretitulo || undefined,
            titulo: b.titulo,
            tituloDestaque: b.tituloDestaque || undefined,
            texto: b.texto ?? "",
            fotos: (b.fotos ?? []).map(imgAlt).filter(Boolean) as Img[],
            itens: (b.itens ?? []).map((x: Json) => ({ icone: x.icone, rotulo: x.rotulo })),
          };
        case "blocks.vitrine":
          return { __component: b.__component, sobretitulo: b.sobretitulo || undefined, titulo: b.titulo, texto: b.texto || undefined, atalhos: links(b.atalhos), itens: cards(b.itens), linkTodos: link(b.linkTodos) };
        case "blocks.experiencias":
          return { __component: b.__component, sobretitulo: b.sobretitulo || undefined, titulo: b.titulo, linkTodos: link(b.linkTodos), itens: cards(b.itens) };
        case "blocks.texto":
          return { __component: b.__component, conteudo: rich(b.conteudo) };
        case "blocks.imagem":
          return { __component: b.__component, imagem: imgAlt(b.imagem)! };
        case "blocks.tabela":
          return { __component: b.__component, ...tabela(b)! };
        case "blocks.citacao":
          return { __component: b.__component, texto: b.texto, autor: b.autor ?? undefined };
        case "blocks.cta-produto":
          return b.produto ? { __component: b.__component, produtoId: b.produto.documentId, textoChamada: b.textoChamada ?? undefined } : null;
        case "blocks.destaques-produtos":
          return { __component: b.__component, titulo: b.titulo ?? undefined, produtoIds: ids(b.produtos) };
        case "blocks.fatos":
          return { __component: b.__component, sobretitulo: b.sobretitulo || undefined, titulo: b.titulo ?? undefined, texto: b.texto || undefined, imagem: imgAlt(b.imagem), itens: kvs(b.itens) };
        case "blocks.setor":
          return {
            __component: b.__component,
            sobretitulo: b.sobretitulo || undefined,
            titulo: b.titulo,
            icone: b.icone || undefined,
            texto: b.texto ?? "",
            fotos: (b.fotos ?? []).map(imgAlt).filter(Boolean) as Img[],
            destaques: (b.destaques ?? []).map((x: Json) => ({ icone: x.icone, rotulo: x.rotulo })),
            listaTitulo: b.listaTitulo || undefined,
            lista: lista(b.lista),
            cta: cta(b.cta),
            ctaSecundario: cta(b.ctaSecundario),
          };
        case "blocks.galeria":
          return { __component: b.__component, sobretitulo: b.sobretitulo || undefined, titulo: b.titulo, fotos: (b.fotos ?? []).map(imgAlt).filter(Boolean) as Img[] };
        case "blocks.chamada":
          return { __component: b.__component, sobretitulo: b.sobretitulo || undefined, titulo: b.titulo, tituloDestaque: b.tituloDestaque || undefined, texto: b.texto || undefined, imagem: imgAlt(b.imagem)!, cta: cta(b.cta)!, ctaSecundario: cta(b.ctaSecundario) };
        case "blocks.avaliacoes":
          return { __component: b.__component, titulo: b.titulo ?? undefined, avaliacaoIds: ids(b.avaliacoes) };
        case "blocks.faq":
          return { __component: b.__component, titulo: b.titulo ?? undefined, itens: faqs(b.itens) };
        case "blocks.video":
          return { __component: b.__component, url: b.url, poster: imgAlt(b.poster)!, titulo: b.titulo ?? undefined };
        case "blocks.mapa-estatico":
          return { __component: b.__component, imagem: imgAlt(b.imagem)!, linkMaps: b.linkMaps };
        default:
          return null;
      }
    })
    .filter((b): b is Block => b !== null);
}
const link = (v: Json): LinkRotulo | undefined => (v?.rotulo && v?.link ? { rotulo: v.rotulo, link: v.link } : undefined);
const links = (v: Json): LinkRotulo[] => (Array.isArray(v) ? (v.map(link).filter(Boolean) as LinkRotulo[]) : []);
const cards = (v: Json): CardFoto[] =>
  Array.isArray(v)
    ? v
        .map((x: Json) => ({ imagem: imgAlt(x.imagem)!, local: x.local || undefined, titulo: x.titulo, texto: x.texto || undefined, link: x.link, icone: x.icone || undefined }))
        .filter((x) => x.imagem && x.titulo && x.link)
    : [];
function hero(b: Json): Extract<Block, { __component: "blocks.hero" }> {
  return {
    __component: "blocks.hero",
    sobretitulo: b?.sobretitulo || undefined,
    titulo: b?.titulo,
    tituloDestaque: b?.tituloDestaque || undefined,
    respostaDireta: b?.respostaDireta,
    imagem: imgAlt(b?.imagem)!,
    cta: cta(b?.cta),
    selo: b?.selo || undefined,
    cardRotulo: b?.cardRotulo || undefined,
    cardProdutoId: b?.cardProduto?.documentId,
  };
}
function cta(c: Json) {
  if (!c) return undefined;
  return { rotulo: c.rotulo, tipo: c.tipo, produtoId: c.produto?.documentId, url: c.url ?? undefined };
}

export async function carregarDoStrapi(): Promise<Conteudo> {
  const porLocale = async (tipo: string) => (await Promise.all(LOCALES.map((l) => colecao(tipo, l)))).flat();
  const singles = async (tipo: string) =>
    Object.fromEntries((await Promise.all(LOCALES.map(async (l) => [l, await single(tipo, l)] as const))).filter(([, v]) => v));

  const [g, h, gh, produtos, cats, artigos, catsGuia, autores, avaliacoes, inst, atend] = await Promise.all([
    singles("global"),
    singles("home"),
    singles("guia-home"),
    porLocale("produtos"),
    porLocale("categorias-produto"),
    porLocale("artigos"),
    porLocale("categorias-guia"),
    colecao("autores", null),
    colecao("avaliacoes", null),
    porLocale("paginas-institucionais"),
    porLocale("paginas-atendimento"),
  ]);

  const mapObj = <T,>(o: Record<string, Json>, f: (d: Json) => T) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, f(v)]));

  return {
    global: mapObj(g, (d) => ({
      ...doc(d),
      nomeOficial: d.nomeOficial,
      telefone: d.telefone,
      whatsapp: d.whatsapp,
      whatsappMensagemPadrao: d.whatsappMensagemPadrao ?? undefined,
      email: d.email,
      endereco: d.endereco,
      geo: d.geo,
      horarios: d.horarios ?? [],
      redesSociais: d.redesSociais ?? [],
      distancias: kvs(d.distancias),
      menuPrincipal: (d.menuPrincipal ?? []).map((m: Json) => ({ rotulo: m.rotulo, link: m.link || undefined, subitens: (m.subitens ?? []).map((x: Json) => ({ rotulo: x.rotulo, link: x.link })) })),
      rodape: rich(d.rodape),
      resumoLlms: d.resumoLlms ?? "",
      seoPadrao: seo(d.seoPadrao),
    })),
    home: mapObj(h, (d) => ({
      ...doc(d),
      hero: hero(d.hero),
      secoes: blocos(d.secoes),
      seo: seo(d.seo),
    })),
    guiaHome: mapObj(gh, (d) => ({ ...doc(d), titulo: d.titulo, respostaDireta: d.respostaDireta, seo: seo(d.seo) })),
    produtos: produtos.map((d) => ({
      ...doc(d),
      titulo: d.titulo,
      slug: d.slug,
      categoriaId: d.categoria?.documentId,
      respostaRapida: d.respostaRapida,
      galeria: (d.galeria ?? []).map(imgAlt).filter(Boolean) as Img[],
      video: d.video?.url ? { url: d.video.url, poster: imgAlt(d.video.poster)! } : undefined,
      precoAPartirDe: Number(d.precoAPartirDe),
      unidadePreco: String(d.unidadePreco ?? '').replace(/_/g, '-'),
      motorProdutoId: d.motorProdutoId,
      setorMotorId: d.setorMotorId ?? undefined,
      inclui: lista(d.inclui),
      naoInclui: lista(d.naoInclui),
      regras: rich(d.regras),
      capacidade: kvs(d.capacidade),
      tabelaComparativa: tabela(d.tabelaComparativa),
      faq: faqs(d.faq),
      relacionadosIds: ids(d.relacionados),
      avaliacaoIds: ids(d.avaliacoes),
      tipoSchema: d.tipoSchema,
      destaques: (d.destaques ?? []).map((x: Json) => ({ icone: x.icone, rotulo: x.rotulo })),
      seo: seo(d.seo),
    })),
    categoriasProduto: cats.map((d) => ({
      ...doc(d),
      titulo: d.titulo,
      slug: d.slug,
      respostaDireta: d.respostaDireta,
      introducao: rich(d.introducao),
      imagemHero: imgAlt(d.imagemHero)!,
      produtoIds: ids(d.ordemProdutos),
      faq: faqs(d.faq),
      ordemMenu: d.ordemMenu ?? 99,
      paginaUnica: !!d.paginaUnica,
      sobretitulo: d.sobretitulo || undefined,
      tituloDestaque: d.tituloDestaque || undefined,
      fotosIntro: (d.fotosIntro ?? []).map(imgAlt).filter(Boolean) as Img[],
      secoes: blocos(d.secoes),
      seo: seo(d.seo),
    })),
    artigos: artigos.map((d) => ({
      ...doc(d),
      titulo: d.titulo,
      slug: d.slug,
      categoriaId: d.categoria?.documentId,
      autorId: d.autor?.documentId,
      dataPublicacao: d.dataPublicacao,
      dataAtualizacao: d.dataAtualizacao ?? d.dataPublicacao,
      resumo: d.resumo,
      imagemDestaque: imgAlt(d.imagemDestaque)!,
      corpo: blocos(d.corpo),
      faq: faqs(d.faq),
      fontes: (d.fontes ?? []).map((f: Json) => ({ titulo: f.titulo, url: f.url })),
      ctaProdutoId: d.ctaProduto?.documentId,
      relacionadosIds: ids(d.artigosRelacionados),
      seo: seo(d.seo),
    })),
    categoriasGuia: catsGuia.map((d) => ({ ...doc(d), nome: d.nome, slug: d.slug, descricao: d.descricao ?? undefined, seo: seo(d.seo) })),
    autores: autores.map((d) => ({ ...doc(d), locale: "pt" as Locale, nome: d.nome, slug: d.slug, foto: imgAlt(d.foto)!, minibio: d.minibio, link: d.link ?? undefined, sameAs: (d.sameAs ?? []).map((s: Json) => s.url ?? s) })),
    avaliacoes: avaliacoes.map((d) => ({ documentId: d.documentId, nomeAutor: d.nomeAutor, nota: d.nota, texto: d.texto, data: d.data, fonte: d.fonte === 'Pos_visita' ? 'Pós-visita Saltão' : d.fonte, urlFonte: d.urlFonte ?? undefined, produtoId: d.produto?.documentId })),
    institucionais: inst.map((d) => ({
      ...doc(d),
      titulo: d.titulo,
      slug: d.slug,
      respostaDireta: d.respostaDireta,
      landing: !!d.landing,
      sobretitulo: d.sobretitulo || undefined,
      tituloDestaque: d.tituloDestaque || undefined,
      fotosIntro: (d.fotosIntro ?? []).map(imgAlt).filter(Boolean) as Img[],
      secoes: blocos(d.secoes),
      seo: seo(d.seo),
    })),
    atendimento: atend.map((d) => ({
      ...doc(d),
      titulo: d.titulo,
      slug: d.slug,
      respostaDireta: d.respostaDireta,
      tipo: String(d.tipo ?? '').replace(/_/g, '-'),
      grupos: (d.grupos ?? []).map((g: Json) => ({ tituloGrupo: g.tituloGrupo, itens: faqs(g.itens) })),
      mostrarFormulario: Boolean(d.mostrarFormulario),
      textoConsentimento: rich(d.textoConsentimento),
      seo: seo(d.seo),
    })),
  } as Conteudo;
}

export const usaStrapi = () => Boolean(STRAPI_URL);
