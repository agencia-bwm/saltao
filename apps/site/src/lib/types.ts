import type { ImageMetadata } from "astro";

export type Locale = "pt" | "en" | "es";
export const LOCALES: Locale[] = ["pt", "en", "es"];
export const DEFAULT_LOCALE: Locale = "pt";

/** Imagem normalizada: local (ImageMetadata, dados de exemplo) ou remota (upload do Strapi). */
export interface Img {
  src: ImageMetadata | string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}

/* ---------- Rich text (formato "blocks" do Strapi 5 — JSON, sem HTML cru) ---------- */
export interface RtText {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}
export interface RtLink {
  type: "link";
  url: string;
  children: RtText[];
}
export type RtInline = RtText | RtLink;
export type RtBlock =
  | { type: "paragraph"; children: RtInline[] }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: RtInline[] }
  | { type: "list"; format: "ordered" | "unordered"; children: { type: "list-item"; children: RtInline[] }[] }
  | { type: "quote"; children: RtInline[] }
  | { type: "code"; children: RtText[] }
  | { type: "image"; image: { url: string; alternativeText?: string | null; width?: number; height?: number } };
export type RichText = RtBlock[];

export interface Seo {
  metaTitle: string;
  metaDescription: string;
  ogImage?: Img;
  canonicalOverride?: string;
  noindex: boolean;
  keyword?: string;
}

export interface Faq {
  pergunta: string;
  resposta: RichText;
}
export interface KV {
  chave: string;
  valor: string;
}
export interface Cta {
  rotulo: string;
  tipo: "produto" | "link" | "whatsapp";
  produtoId?: string;
  url?: string;
}
export interface Tabela {
  titulo?: string;
  cabecalho: string[];
  linhas: string[][];
}

/* ---------- Blocos (dynamic zones) ---------- */
export type Block =
  | { __component: "blocks.hero"; sobretitulo?: string; titulo: string; respostaDireta: string; imagem: Img; cta?: Cta }
  | { __component: "blocks.texto"; conteudo: RichText }
  | { __component: "blocks.imagem"; imagem: Img }
  | ({ __component: "blocks.tabela" } & Tabela)
  | { __component: "blocks.citacao"; texto: string; autor?: string }
  | { __component: "blocks.cta-produto"; produtoId: string; textoChamada?: string }
  | { __component: "blocks.destaques-produtos"; titulo?: string; produtoIds: string[] }
  | { __component: "blocks.fatos"; titulo?: string; itens: KV[] }
  | { __component: "blocks.avaliacoes"; titulo?: string; avaliacaoIds: string[] }
  | { __component: "blocks.faq"; titulo?: string; itens: Faq[] }
  | { __component: "blocks.video"; url: string; poster: Img; titulo?: string }
  | { __component: "blocks.mapa-estatico"; imagem: Img; linkMaps: string }
  | { __component: "blocks.roteiro"; titulo?: string; itens: MomentoRoteiro[] }
  | { __component: "blocks.chamada-final"; titulo: string; texto?: string; imagem: Img; cta?: Cta };

/** Um momento do bloco "Roteiro" (um dia no parque): hora, título curto e foto. */
export type MomentoRoteiro = { hora: string; titulo: string; texto?: string; imagem: Img };

/* ---------- Content types ---------- */
interface Doc {
  documentId: string;
  locale: Locale;
  updatedAt: string;
}

export type UnidadePreco = "por-pessoa" | "por-noite" | "por-espaco-dia" | "por-pessoa-noite";
export type TipoSchema = "Product" | "TouristTrip" | "LodgingBusiness" | "Campground";

export interface Produto extends Doc {
  titulo: string;
  slug: string;
  categoriaId: string;
  respostaRapida: string;
  galeria: Img[];
  video?: { url: string; poster: Img };
  precoAPartirDe: number;
  unidadePreco: UnidadePreco;
  motorProdutoId: string;
  setorMotorId?: string;
  inclui: string[];
  naoInclui: string[];
  regras?: RichText;
  capacidade: KV[];
  tabelaComparativa?: Tabela;
  faq: Faq[];
  relacionadosIds: string[];
  avaliacaoIds: string[];
  tipoSchema: TipoSchema;
  seo: Seo;
}

export interface CategoriaProduto extends Doc {
  titulo: string;
  slug: string;
  respostaDireta: string;
  introducao?: RichText;
  imagemHero: Img;
  produtoIds: string[];
  faq: Faq[];
  ordemMenu: number;
  seo: Seo;
}

export interface CategoriaGuia extends Doc {
  nome: string;
  slug: string;
  descricao?: string;
  seo: Seo;
}

export interface Autor extends Doc {
  nome: string;
  slug: string;
  foto: Img;
  minibio: string;
  link?: string;
  sameAs: string[];
}

export interface Artigo extends Doc {
  titulo: string;
  slug: string;
  categoriaId: string;
  autorId: string;
  dataPublicacao: string;
  dataAtualizacao: string;
  resumo: string;
  imagemDestaque: Img;
  corpo: Block[];
  faq: Faq[];
  fontes: { titulo: string; url: string }[];
  ctaProdutoId?: string;
  relacionadosIds: string[];
  seo: Seo;
}

export interface Avaliacao {
  documentId: string;
  nomeAutor: string;
  nota: number;
  texto: string;
  data: string;
  fonte: "Google" | "TripAdvisor" | "Booking" | "Pós-visita Saltão";
  urlFonte?: string;
  produtoId?: string;
}

export interface PaginaInstitucional extends Doc {
  titulo: string;
  slug: string;
  respostaDireta: string;
  secoes: Block[];
  seo: Seo;
}

export interface PaginaAtendimento extends Doc {
  titulo: string;
  slug: string;
  respostaDireta: string;
  tipo: "faq-contato" | "minha-reserva";
  grupos: { tituloGrupo: string; itens: Faq[] }[];
  mostrarFormulario: boolean;
  textoConsentimento: RichText;
  seo: Seo;
}

export interface Home extends Doc {
  hero: Extract<Block, { __component: "blocks.hero" }>;
  secoes: Block[];
  seo: Seo;
}

export interface GuiaHome extends Doc {
  titulo: string;
  respostaDireta: string;
  seo: Seo;
}

export interface Horario {
  dias: string;
  abre: string;
  fecha: string;
}

export interface Global extends Doc {
  nomeOficial: string;
  telefone: string;
  whatsapp: string;
  whatsappMensagemPadrao?: string;
  email: string;
  endereco: { rua: string; numero: string; bairro?: string; cidade: string; uf: string; cep: string };
  geo: { latitude: number; longitude: number };
  horarios: Horario[];
  redesSociais: { rede: string; url: string }[];
  distancias: KV[];
  /** Item com `subitens` vira grupo com submenu; `link` do grupo é opcional. */
  menuPrincipal: { rotulo: string; link?: string; subitens?: { rotulo: string; link: string }[] }[];
  rodape?: RichText;
  resumoLlms: string;
  seoPadrao: Seo;
}

/** Todo o conteúdo, já normalizado, de todos os idiomas. */
export interface Conteudo {
  global: Partial<Record<Locale, Global>>;
  home: Partial<Record<Locale, Home>>;
  guiaHome: Partial<Record<Locale, GuiaHome>>;
  produtos: Produto[];
  categoriasProduto: CategoriaProduto[];
  artigos: Artigo[];
  categoriasGuia: CategoriaGuia[];
  autores: Autor[];
  avaliacoes: Avaliacao[];
  institucionais: PaginaInstitucional[];
  atendimento: PaginaAtendimento[];
}
