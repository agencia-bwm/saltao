import type {
  Artigo,
  Autor,
  Avaliacao,
  CategoriaGuia,
  CategoriaProduto,
  Conteudo,
  GuiaHome,
  Home,
  Locale,
  PaginaAtendimento,
  PaginaInstitucional,
  Produto,
  Seo,
} from "./types";
import { LOCALES } from "./types";
import { LOCALE_PREFIX, SEG, t } from "./i18n";

export const ARTIGOS_POR_PAGINA = 12;

export interface Migalha {
  nome: string;
  path: string;
}

interface RotaBase {
  /** Chave que liga as versões da mesma página em idiomas diferentes (hreflang). */
  chave: string;
  locale: Locale;
  path: string;
  alternates: Partial<Record<Locale, string>>;
  breadcrumbs: Migalha[];
  lastmod: string;
  seo: Seo;
}

export type Rota = RotaBase &
  (
    | { kind: "home"; doc: Home }
    | { kind: "categoria-produto"; doc: CategoriaProduto }
    | { kind: "produto"; doc: Produto; categoria: CategoriaProduto }
    | { kind: "guia"; guiaHome?: GuiaHome; categoria?: CategoriaGuia; artigos: Artigo[]; pagina: number; totalPaginas: number; titulo: string; respostaDireta: string }
    | { kind: "artigo"; doc: Artigo; categoria?: CategoriaGuia; autor?: Autor }
    | { kind: "institucional"; doc: PaginaInstitucional }
    | { kind: "atendimento"; doc: PaginaAtendimento }
  );

const join = (locale: Locale, ...partes: string[]) => `${LOCALE_PREFIX[locale]}/${partes.filter(Boolean).join("/")}${partes.length ? "/" : ""}`.replace(/\/+/g, "/");
export const homePath = (locale: Locale) => join(locale);
export const guiaPath = (locale: Locale) => join(locale, SEG[locale].guia);

const maisRecente = (...datas: (string | undefined)[]) =>
  datas.filter(Boolean).sort().at(-1) ?? new Date().toISOString();

/** Índice usado pelos componentes para achar conteúdo relacionado e links no mesmo idioma. */
export interface Indice {
  conteudo: Conteudo;
  rotas: Rota[];
  porPath: Map<string, Rota>;
  produto(id: string, locale: Locale): Produto | undefined;
  categoriaProduto(id: string, locale: Locale): CategoriaProduto | undefined;
  artigo(id: string, locale: Locale): Artigo | undefined;
  avaliacao(id: string): Avaliacao | undefined;
  /** Caminho da página de um documento no idioma pedido (ou undefined se não existir nesse idioma). */
  link(kind: Rota["kind"], documentId: string, locale: Locale): string | undefined;
}

export function montarIndice(c: Conteudo): Indice {
  const k = (id: string, l: Locale) => `${id}:${l}`;
  const produtos = new Map(c.produtos.map((p) => [k(p.documentId, p.locale), p]));
  const cats = new Map(c.categoriasProduto.map((p) => [k(p.documentId, p.locale), p]));
  const artigos = new Map(c.artigos.map((p) => [k(p.documentId, p.locale), p]));
  const catsGuia = new Map(c.categoriasGuia.map((p) => [k(p.documentId, p.locale), p]));
  const autores = new Map(c.autores.map((a) => [a.documentId, a]));
  const avaliacoes = new Map(c.avaliacoes.map((a) => [a.documentId, a]));

  const rotas: Rota[] = [];

  for (const locale of LOCALES) {
    const ui = t(locale);
    const inicio: Migalha = { nome: ui.inicio, path: homePath(locale) };
    const home = c.home[locale];
    if (home) rotas.push({ kind: "home", chave: "home", locale, path: homePath(locale), alternates: {}, breadcrumbs: [inicio], lastmod: home.updatedAt, seo: home.seo, doc: home });

    for (const cat of c.categoriasProduto.filter((x) => x.locale === locale)) {
      const path = join(locale, cat.slug);
      const prods = cat.produtoIds.map((id) => produtos.get(k(id, locale))).filter(Boolean) as Produto[];
      rotas.push({
        kind: "categoria-produto",
        chave: `cat:${cat.documentId}`,
        locale,
        path,
        alternates: {},
        breadcrumbs: [inicio, { nome: cat.titulo, path }],
        lastmod: maisRecente(cat.updatedAt, ...prods.map((p) => p.updatedAt)),
        seo: cat.seo,
        doc: cat,
      });
    }

    for (const prod of c.produtos.filter((x) => x.locale === locale)) {
      const cat = cats.get(k(prod.categoriaId, locale));
      if (!cat) throw new Error(`Produto "${prod.titulo}" (${locale}) sem categoria publicada neste idioma.`);
      const catPath = join(locale, cat.slug);
      const path = join(locale, cat.slug, prod.slug);
      rotas.push({
        kind: "produto",
        chave: `prod:${prod.documentId}`,
        locale,
        path,
        alternates: {},
        breadcrumbs: [inicio, { nome: cat.titulo, path: catPath }, { nome: prod.titulo, path }],
        lastmod: prod.updatedAt,
        seo: prod.seo,
        doc: prod,
        categoria: cat,
      });
    }

    const artigosLoc = c.artigos.filter((a) => a.locale === locale).sort((a, b) => b.dataPublicacao.localeCompare(a.dataPublicacao));
    const guiaHome = c.guiaHome[locale];
    if (guiaHome || artigosLoc.length) {
      const base = guiaPath(locale);
      const tituloGuia = guiaHome?.titulo ?? "Guia da Serra do Itaqueri";
      const migGuia: Migalha = { nome: tituloGuia, path: base };
      const paginar = (lista: Artigo[], raiz: string, extra: { chave: string; categoria?: CategoriaGuia; titulo: string; resp: string; seo: Seo; migalhas: Migalha[] }) => {
        const total = Math.max(1, Math.ceil(lista.length / ARTIGOS_POR_PAGINA));
        for (let pagina = 1; pagina <= total; pagina++) {
          const path = pagina === 1 ? raiz : `${raiz}${SEG[locale].pagina}/${pagina}/`;
          const fatia = lista.slice((pagina - 1) * ARTIGOS_POR_PAGINA, pagina * ARTIGOS_POR_PAGINA);
          rotas.push({
            kind: "guia",
            chave: `${extra.chave}:p${pagina}`,
            locale,
            path,
            alternates: {},
            breadcrumbs: pagina === 1 ? extra.migalhas : [...extra.migalhas, { nome: `${t(locale).pagina} ${pagina}`, path }],
            lastmod: maisRecente(guiaHome?.updatedAt, ...fatia.map((a) => a.updatedAt)),
            seo: pagina === 1 ? extra.seo : { ...extra.seo, metaTitle: `${extra.seo.metaTitle} — ${t(locale).pagina} ${pagina}` },
            guiaHome,
            categoria: extra.categoria,
            artigos: fatia,
            pagina,
            totalPaginas: total,
            titulo: extra.titulo,
            respostaDireta: extra.resp,
          });
        }
      };
      paginar(artigosLoc, base, {
        chave: "guia",
        titulo: tituloGuia,
        resp: guiaHome?.respostaDireta ?? "",
        seo: guiaHome?.seo ?? { metaTitle: tituloGuia, metaDescription: "", noindex: false },
        migalhas: [inicio, migGuia],
      });
      for (const cg of c.categoriasGuia.filter((x) => x.locale === locale)) {
        const lista = artigosLoc.filter((a) => a.categoriaId === cg.documentId);
        if (!lista.length) continue; // categoria vazia não gera página (evita thin content)
        const raiz = join(locale, SEG[locale].guia, SEG[locale].categoria, cg.slug);
        paginar(lista, raiz, { chave: `cg:${cg.documentId}`, categoria: cg, titulo: cg.nome, resp: cg.descricao ?? "", seo: cg.seo, migalhas: [inicio, migGuia, { nome: cg.nome, path: raiz }] });
      }
      for (const art of artigosLoc) {
        const path = join(locale, SEG[locale].guia, art.slug);
        const cg = catsGuia.get(k(art.categoriaId, locale));
        rotas.push({
          kind: "artigo",
          chave: `art:${art.documentId}`,
          locale,
          path,
          alternates: {},
          breadcrumbs: [inicio, migGuia, { nome: art.titulo, path }],
          lastmod: maisRecente(art.updatedAt, art.dataAtualizacao),
          seo: art.seo,
          doc: art,
          categoria: cg,
          autor: autores.get(art.autorId),
        });
      }
    }

    for (const pg of c.institucionais.filter((x) => x.locale === locale)) {
      const path = join(locale, pg.slug);
      rotas.push({ kind: "institucional", chave: `inst:${pg.documentId}`, locale, path, alternates: {}, breadcrumbs: [inicio, { nome: pg.titulo, path }], lastmod: pg.updatedAt, seo: pg.seo, doc: pg });
    }
    for (const pg of c.atendimento.filter((x) => x.locale === locale)) {
      const path = join(locale, pg.slug);
      rotas.push({ kind: "atendimento", chave: `at:${pg.documentId}`, locale, path, alternates: {}, breadcrumbs: [inicio, { nome: pg.titulo, path }], lastmod: pg.updatedAt, seo: pg.seo, doc: pg });
    }
  }

  // Caminhos duplicados quebram a build (ex.: dois slugs iguais no mesmo idioma).
  const porPath = new Map<string, Rota>();
  for (const r of rotas) {
    if (porPath.has(r.path)) throw new Error(`URL duplicada: ${r.path} (${porPath.get(r.path)!.chave} e ${r.chave}). Ajuste o slug no painel.`);
    porPath.set(r.path, r);
  }

  // hreflang: liga as versões da mesma chave.
  const porChave = new Map<string, Rota[]>();
  for (const r of rotas) porChave.set(r.chave, [...(porChave.get(r.chave) ?? []), r]);
  for (const grupo of porChave.values()) {
    const alt = Object.fromEntries(grupo.map((r) => [r.locale, r.path]));
    for (const r of grupo) r.alternates = alt;
  }

  const prefixoKind: Record<Rota["kind"], string> = { home: "home", "categoria-produto": "cat", produto: "prod", guia: "guia", artigo: "art", institucional: "inst", atendimento: "at" };
  const porChaveLocale = new Map(rotas.map((r) => [`${r.chave}|${r.locale}`, r.path]));

  return {
    conteudo: c,
    rotas,
    porPath,
    produto: (id, l) => produtos.get(k(id, l)),
    categoriaProduto: (id, l) => cats.get(k(id, l)),
    artigo: (id, l) => artigos.get(k(id, l)),
    avaliacao: (id) => avaliacoes.get(id),
    link: (kind, id, l) => porChaveLocale.get(`${prefixoKind[kind]}:${id}|${l}`),
  };
}
