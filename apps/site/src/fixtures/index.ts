/**
 * DADOS DE EXEMPLO — usados quando STRAPI_URL não está definido (dev local e Lighthouse CI).
 * Textos, preços, endereço e avaliações são PROVISÓRIOS e não devem ser publicados.
 * Em produção o conteúdo vem sempre do painel (Strapi).
 */
import type { Conteudo, Faq, Img, Locale, RichText, Seo } from "../lib/types";
import fHeroSrc from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-mata-visitantes.jpg";
import fCachMolduraSrc from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-moldura-arvores.jpg";
import fCach2Src from "../assets/fotos/cachoeira-2/cachoeira-2-queda-larga-poco.jpg";
import fCach2PanSrc from "../assets/fotos/cachoeira-2/cachoeira-2-poco-panoramica.jpg";
import fTrilhaSrc from "../assets/fotos/cachoeira-2/cachoeira-2-trilha-bambuzal.jpg";
import fPratoSrc from "../assets/fotos/gastronomia/prato-feito-bife-arroz-fritas.jpg";
import fCafeSrc from "../assets/fotos/gastronomia/cafe-da-manha-bandeja-mamao-01.jpg";
import fAptosSrc from "../assets/fotos/hospedagem/apartamentos-chales-coloridos-gramado.jpg";
import fAptosVASrc from "../assets/fotos/hospedagem/apartamentos-verde-amarelo.jpg";
import fQuartoSrc from "../assets/fotos/hospedagem/apartamento-quarto-tv.jpg";
import fBanheiroSrc from "../assets/fotos/hospedagem/apartamento-banheiro-vertical.jpg";
import fCampFamiliaSrc from "../assets/fotos/camping/camping-familia-barraca-verde.jpg";
import fCampNoiteSrc from "../assets/fotos/camping/camping-noite-quiosque-iluminado.jpg";
import fFogueiraSrc from "../assets/fotos/camping/fogueira-roda-noite.jpg";
import fCampValeSrc from "../assets/fotos/camping/camping-barraca-vista-vale.jpg";
import fCampEntardecerSrc from "../assets/fotos/camping/camping-entardecer-barracas.jpg";
import fQuiosqueSrc from "../assets/fotos/camping/camping-barracas-quiosque-amigos.jpg";
import fQuiosqueNoiteSrc from "../assets/fotos/camping/camping-noite-barracas-quiosque.jpg";
import fKidsSrc from "../assets/fotos/estrutura/salao-kids-brinquedos-bambu.jpg";
import fValeSrc from "../assets/fotos/paisagem/paisagem-vale-ceu-azul.jpg";
import fPorDoSolArvoreSrc from "../assets/fotos/paisagem/por-do-sol-dourado-arvore.jpg";
import fPanoramicaSrc from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-paredao-panoramica.jpg";
import fRotTrilhaSrc from "../assets/fotos/cachoeira-2/cachoeira-2-trilha-bambuzal-vertical.jpg";
import fRotPocoSrc from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-poco-vertical.jpg";
import fRotPorcaoSrc from "../assets/fotos/gastronomia/porcao-linguica-cerveja-vertical.jpg";
import fRotPorDoSolSrc from "../assets/fotos/paisagem/por-do-sol-palmeira-vertical.jpg";
import fRotFogueiraSrc from "../assets/fotos/camping/fogueira-noite-vertical.jpg";
import fCapCachSrc from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-mata-visitantes.jpg";
import fCapQuedaSrc from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-queda-75m-vertical-01.jpg";
import fCapCach2Src from "../assets/fotos/cachoeira-2/cachoeira-2-poco-vertical.jpg";
import fCapDayUseSrc from "../assets/fotos/cachoeira-2/cachoeira-2-queda-larga-poco.jpg";
import fCapDayUse1Src from "../assets/fotos/camping/camping-barracas-quiosque-amigos.jpg";
import fCapDayUse2Src from "../assets/fotos/gastronomia/porcao-linguica-cerveja-vertical.jpg";
import fCapAptoSrc from "../assets/fotos/hospedagem/apartamento-azul-fachada-buganvilia.jpg";
import fCapApto1Src from "../assets/fotos/hospedagem/apartamento-quarto-duas-camas.jpg";
import fCapApto2Src from "../assets/fotos/gastronomia/cafe-da-manha-bandeja-bolo-01.jpg";
import fCapCampSrc from "../assets/fotos/camping/camping-entardecer-barraca-grande.jpg";
import fCapCamp1Src from "../assets/fotos/camping/fogueira-noite-vertical.jpg";
import fCapCamp2Src from "../assets/fotos/camping/camping-familia-retrato-vertical.jpg";
import fFraseSrc from "../assets/fotos/cachoeira-2/cachoeira-2-poco-panoramica.jpg";
import mapaProvisorio from "../assets/placeholder/trilha.jpg";


const T = "2026-11-13T12:00:00.000Z";
const img = (src: Img["src"], alt: string): Img => ({ src, alt });

/* Fotos reais (lote 1, 14/11/2026) — alt vem de docs/fotos-catalogo.csv */
const fHero = img(fHeroSrc, "Cachoeira do Saltão vista de longe, cercada de mata nativa, com visitantes na base");
const fCachMoldura = img(fCachMolduraSrc, "Cachoeira do Saltão emoldurada por árvores, com céu azul");
const fCach2 = img(fCach2Src, "Segunda cachoeira do parque, queda larga sobre rochas com poço amplo");
const fCach2Pan = img(fCach2PanSrc, "Vista frontal da segunda cachoeira do parque e seu poço");
const fTrilha = img(fTrilhaSrc, "Caminho de terra entre bambuzal levando à segunda cachoeira do parque");
const fPrato = img(fPratoSrc, "Prato com bife, arroz, farofa, batata frita, salada e feijão em cumbuca de barro");
const fCafe = img(fCafeSrc, "Café da manhã servido em bandeja de madeira: mamão, misto de queijo e presunto, leite e café");
const fAptos = img(fAptosSrc, "Apartamentos coloridos (amarelo, verde e azul) em gramado amplo do parque");
const fAptosVA = img(fAptosVASrc, "Apartamentos verde e amarelo com gramado e céu azul");
const fQuarto = img(fQuartoSrc, "Quarto do apartamento com TV de tela plana, ar-condicionado e cama de casal");
const fBanheiro = img(fBanheiroSrc, "Banheiro do apartamento com box, pia de granito e janela");
const fCampFamilia = img(fCampFamiliaSrc, "Família com criança pequena brincando em frente à barraca verde");
const fCampNoite = img(fCampNoiteSrc, "Área de camping à noite com quiosque iluminado e barracas");
const fFogueira = img(fFogueiraSrc, "Pessoas reunidas ao redor da fogueira à noite no campo");
const fCampVale = img(fCampValeSrc, "Barraca montada ao lado de quiosque com vista para o vale e eucaliptos");
const fCampEntardecer = img(fCampEntardecerSrc, "Barracas na área de camping ao entardecer, com céu rosado");
const fQuiosque = img(fQuiosqueSrc, "Grupo de amigos junto a barracas e quiosque com churrasqueira na área de camping");
const fQuiosqueNoite = img(fQuiosqueNoiteSrc, "Barracas montadas à noite ao lado de quiosque com churrasqueira");
const fKids = img(fKidsSrc, "Brinquedos de bambu e rede de proteção no salão coberto");
const fVale = img(fValeSrc, "Vista panorâmica do vale com lago e céu azul limpo");
const fPorDoSolArvore = img(fPorDoSolArvoreSrc, "Pôr do sol dourado sobre campos e árvore isolada");
/* Roteiro "um dia no Saltão" (fotos verticais) */
const fRot = {
  trilha: (alt: string) => img(fRotTrilhaSrc, alt),
  poco: (alt: string) => img(fRotPocoSrc, alt),
  porcao: (alt: string) => img(fRotPorcaoSrc, alt),
  porDoSol: (alt: string) => img(fRotPorDoSolSrc, alt),
  fogueira: (alt: string) => img(fRotFogueiraSrc, alt),
};
const p = (...textos: string[]): RichText => textos.map((text) => ({ type: "paragraph", children: [{ type: "text", text }] }));
const h2 = (text: string): RichText[number] => ({ type: "heading", level: 2, children: [{ type: "text", text }] });
const ul = (...itens: string[]): RichText[number] => ({
  type: "list",
  format: "unordered",
  children: itens.map((text) => ({ type: "list-item", children: [{ type: "text", text }] })),
});
const faq = (pergunta: string, resposta: string): Faq => ({ pergunta, resposta: p(resposta) });
const seo = (metaTitle: string, metaDescription: string): Seo => ({ metaTitle, metaDescription, noindex: false });

/* ---------------- Textos por idioma (só o que muda) ---------------- */
const L = {
  pt: {
    sobre: "Itirapina · Serra do Itaqueri · SP",
    hero: "Uma cachoeira de *75 metros* no coração da Serra do Itaqueri",
    heroResp: "O Saltão é um parque de ecoturismo com cachoeira de 75 m, day use, hospedagem, camping e quiosques com churrasqueira. Reserve online e garanta sua data.",
    reservar: "Reservar",
    cats: {
      dayuse: ["Day Use", "day-use", "Passe o dia no Saltão com acesso à cachoeira, trilhas e áreas de lazer. Ingressos por pessoa, a partir de R$ 60 (valor de exemplo)."],
      hosp: ["Hospedagem e Camping", "hospedagem", "Durma no parque: apartamentos com café da manhã e áreas de camping com estrutura. Diárias a partir de R$ 280 (valor de exemplo)."],
      quiosques: ["Churrasqueiras e Quiosques", "churrasqueiras-e-quiosques", "Reserve um quiosque ou churrasqueira para o seu grupo, com mesas e ponto de apoio. A partir de R$ 120 por dia (valor de exemplo)."],
    },
  },
  en: {
    sobre: "Itirapina · Serra do Itaqueri · Brazil",
    hero: "A *75-metre* waterfall in Serra do Itaqueri",
    heroResp: "Saltão is an ecotourism park with a 75 m waterfall, day passes, lodging, camping and barbecue kiosks. Book online and secure your date.",
    reservar: "Book now",
    cats: {
      dayuse: ["Day Pass", "day-pass", "Spend the day at Saltão with access to the waterfall, trails and leisure areas. Tickets per person from R$ 60 (sample price)."],
      hosp: ["Lodging and Camping", "lodging", "Stay in the park: rooms with breakfast and equipped camping areas. Nightly rates from R$ 280 (sample price)."],
      quiosques: ["Barbecue Kiosks", "barbecue-kiosks", "Book a kiosk or barbecue area for your group, with tables and support point. From R$ 120 per day (sample price)."],
    },
  },
  es: {
    sobre: "Itirapina · Serra do Itaqueri · Brasil",
    hero: "Una cascada de *75 metros* en el corazón de la Serra do Itaqueri",
    heroResp: "Saltão es un parque de ecoturismo con una cascada de 75 m, pase de día, hospedaje, camping y quinchos con parrilla. Reserva en línea y asegura tu fecha.",
    reservar: "Reservar",
    cats: {
      dayuse: ["Pase de Día", "pase-de-dia", "Pasa el día en Saltão con acceso a la cascada, senderos y áreas de ocio. Entradas por persona desde R$ 60 (precio de ejemplo)."],
      hosp: ["Hospedaje y Camping", "hospedaje", "Duerme en el parque: habitaciones con desayuno y áreas de camping equipadas. Noches desde R$ 280 (precio de ejemplo)."],
      quiosques: ["Quinchos y Parrillas", "quinchos-y-parrillas", "Reserva un quincho o parrilla para tu grupo, con mesas y punto de apoyo. Desde R$ 120 por día (precio de ejemplo)."],
    },
  },
} as const;

const locales: Locale[] = ["pt", "en", "es"];

/* ---------------- Produtos (PT/EN/ES) ---------------- */
const produtosBase = [
  {
    id: "prod-dayuse",
    cat: "cat-dayuse",
    motor: "day-use",
    preco: 60,
    unidade: "por-pessoa" as const,
    schema: "Product" as const,
    imgs: [fTrilha, fHero, fCach2, fPrato],
    t: {
      pt: ["Ingresso Day Use", "ingresso-day-use", "Ingresso para passar o dia no Saltão, com acesso à cachoeira de 75 m, trilhas e áreas de lazer. Ideal para famílias e grupos. A partir de R$ 60 por pessoa (valor de exemplo)."],
      en: ["Day Pass Ticket", "day-pass-ticket", "Ticket to spend the day at Saltão, with access to the 75 m waterfall, trails and leisure areas. Great for families and groups. From R$ 60 per person (sample price)."],
      es: ["Entrada Pase de Día", "entrada-pase-de-dia", "Entrada para pasar el día en Saltão, con acceso a la cascada de 75 m, senderos y áreas de ocio. Ideal para familias y grupos. Desde R$ 60 por persona (precio de ejemplo)."],
    },
  },
  {
    id: "prod-apto",
    cat: "cat-hosp",
    motor: "apartamento",
    preco: 280,
    unidade: "por-noite" as const,
    schema: "LodgingBusiness" as const,
    imgs: [fAptos, fQuarto, fBanheiro, fCafe],
    t: {
      pt: ["Apartamentos", "apartamentos", "Suítes dentro do parque para até 4 pessoas, com TV, frigobar e ventilador de teto, e acesso às áreas do day use durante a estadia. A partir de R$ 280 por noite (valor de exemplo)."],
      en: ["Rooms", "rooms", "Rooms inside the park, with breakfast and free access to the day-pass areas during your stay. From R$ 280 per night (sample price)."],
      es: ["Habitaciones", "habitaciones", "Habitaciones dentro del parque, con desayuno y acceso libre a las áreas del pase de día durante la estadía. Desde R$ 280 por noche (precio de ejemplo)."],
    },
  },
  {
    id: "prod-camping",
    cat: "cat-hosp",
    motor: "camping",
    preco: 70,
    unidade: "por-pessoa-noite" as const,
    schema: "Campground" as const,
    imgs: [fCampFamilia, fCampNoite, fFogueira, fCampVale],
    t: {
      pt: ["Camping", "camping", "Área de camping com banheiros, pontos de energia e acesso à cachoeira. Cobrança por pessoa, por noite, a partir de R$ 70 (valor de exemplo)."],
      en: ["Camping", "camping", "Camping area with restrooms, power points and waterfall access. Priced per person, per night, from R$ 70 (sample price)."],
      es: ["Camping", "camping", "Área de camping con baños, puntos de energía y acceso a la cascada. Precio por persona, por noche, desde R$ 70 (precio de ejemplo)."],
    },
  },
  {
    id: "prod-quiosque",
    cat: "cat-quiosques",
    motor: "quiosque",
    setor: "quiosques-beira-rio",
    preco: 120,
    unidade: "por-espaco-dia" as const,
    schema: "Product" as const,
    imgs: [fQuiosque, fQuiosqueNoite],
    t: {
      pt: ["Quiosque com churrasqueira", "quiosque-com-churrasqueira", "Quiosque coberto com churrasqueira, mesas e pia, para grupos de até 30 pessoas. Valor por espaço, por dia, a partir de R$ 120 (valor de exemplo)."],
      en: ["Kiosk with barbecue", "kiosk-with-barbecue", "Covered kiosk with barbecue grill, tables and sink, for groups of up to 30 people. Price per space, per day, from R$ 120 (sample price)."],
      es: ["Quincho con parrilla", "quincho-con-parrilla", "Quincho techado con parrilla, mesas y fregadero, para grupos de hasta 30 personas. Precio por espacio, por día, desde R$ 120 (precio de ejemplo)."],
    },
  },
];

const incluiPt = ["Acesso à cachoeira e às trilhas sinalizadas", "Estacionamento", "Banheiros e vestiários"];
const incluiEn = ["Access to the waterfall and marked trails", "Parking", "Restrooms and changing rooms"];
const incluiEs = ["Acceso a la cascada y senderos señalizados", "Estacionamiento", "Baños y vestuarios"];

const produtos: Conteudo["produtos"] = produtosBase.flatMap((b) =>
  locales.map((loc) => {
    const [titulo, slug, resp] = b.t[loc];
    return {
      documentId: b.id,
      locale: loc,
      updatedAt: T,
      titulo,
      slug,
      categoriaId: b.cat,
      respostaRapida: resp,
      galeria: b.imgs,
      precoAPartirDe: b.preco,
      unidadePreco: b.unidade,
      motorProdutoId: b.motor,
      setorMotorId: "setor" in b ? b.setor : undefined,
      inclui: loc === "pt" ? incluiPt : loc === "en" ? incluiEn : incluiEs,
      naoInclui: loc === "pt" ? ["Alimentação"] : loc === "en" ? ["Meals"] : ["Comidas"],
      regras: p(
        loc === "pt"
          ? "Horário de exemplo: das 8h às 17h. Crianças acompanhadas de responsável. Regras sobre animais a confirmar."
          : loc === "en"
            ? "Sample hours: 8 am to 5 pm. Children must be accompanied by an adult. Pet policy to be confirmed."
            : "Horario de ejemplo: de 8 h a 17 h. Niños acompañados por un adulto. Normas sobre mascotas a confirmar.",
      ),
      capacidade: [{ chave: loc === "pt" ? "Capacidade" : loc === "en" ? "Capacity" : "Capacidad", valor: loc === "pt" ? "A confirmar" : loc === "en" ? "To be confirmed" : "A confirmar" }],
      tabelaComparativa:
        b.id === "prod-apto" && loc === "pt"
          ? { titulo: "Compare as acomodações", cabecalho: ["Acomodação", "Capacidade", "Café da manhã", "A partir de"], linhas: [["Apartamento", "até 4 pessoas", "Sim", "R$ 280"], ["Camping", "por pessoa", "Não", "R$ 70"]] }
          : undefined,
      faq:
        loc === "pt"
          ? [faq("Preciso reservar com antecedência?", "Recomendamos reservar online, principalmente em feriados e fins de semana, para garantir a vaga."), faq("Posso cancelar?", "Sim, conforme a política de cancelamento exibida no checkout.")]
          : loc === "en"
            ? [faq("Do I need to book in advance?", "We recommend booking online, especially on holidays and weekends, to secure your spot.")]
            : [faq("¿Necesito reservar con anticipación?", "Recomendamos reservar en línea, sobre todo en feriados y fines de semana, para asegurar tu lugar.")],
      relacionadosIds: produtosBase.filter((o) => o.id !== b.id).slice(0, 3).map((o) => o.id),
      avaliacaoIds: ["av-1", "av-2"],
      tipoSchema: b.schema,
      seo: seo(`${titulo} | Saltão`, resp.slice(0, 150)),
    };
  }),
);

/* ---------------- Categorias de produto ---------------- */
const catDefs = [
  ["cat-dayuse", "dayuse", fCachMoldura, ["prod-dayuse"], 1],
  ["cat-hosp", "hosp", fCampVale, ["prod-apto", "prod-camping"], 2],
  ["cat-quiosques", "quiosques", fQuiosqueNoite, ["prod-quiosque"], 3],
] as const;

const categoriasProduto: Conteudo["categoriasProduto"] = catDefs.flatMap(([id, key, im, prods, ordem]) =>
  locales.map((loc) => {
    const [titulo, slug, resp] = L[loc].cats[key];
    return {
      documentId: id,
      locale: loc,
      updatedAt: T,
      titulo,
      slug,
      respostaDireta: resp,
      imagemHero: im,
      produtoIds: [...prods],
      faq: [],
      ordemMenu: ordem,
      seo: seo(`${titulo} | Saltão Parque de Ecoturismo`, resp.slice(0, 150)),
    };
  }),
);

/* ---------------- Guia (blog) — 4 artigos de lançamento, só em PT nos dados de exemplo ---------------- */
const categoriasGuia: Conteudo["categoriasGuia"] = [
  ["cg-oque", "O que fazer", "o-que-fazer"],
  ["cg-cachoeiras", "Cachoeiras", "cachoeiras"],
  ["cg-quando", "Quando ir", "quando-ir"],
  ["cg-familia", "Família", "familia"],
  ["cg-camping", "Camping", "camping"],
].map(([documentId, nome, slug]) => ({
  documentId,
  locale: "pt" as const,
  updatedAt: T,
  nome,
  slug,
  descricao: `Artigos do Guia da Serra do Itaqueri sobre ${nome.toLowerCase()}.`,
  seo: seo(`${nome} — Guia da Serra do Itaqueri`, `Dicas e roteiros sobre ${nome.toLowerCase()} na Serra do Itaqueri, escritas pela equipe do Saltão.`),
}));

const autores: Conteudo["autores"] = [
  {
    documentId: "autor-equipe",
    locale: "pt",
    updatedAt: T,
    nome: "Equipe Saltão",
    slug: "equipe-saltao",
    foto: img(fValeSrc, "Equipe do Saltão (imagem provisória)"),
    minibio: "Guias e monitores que trabalham no parque e conhecem as trilhas e cachoeiras da Serra do Itaqueri.",
    sameAs: [],
  },
];

const artigo = (id: string, titulo: string, slug: string, cat: string, resumo: string, im: Img, cta: string) => ({
  documentId: id,
  locale: "pt" as const,
  updatedAt: T,
  titulo,
  slug,
  categoriaId: cat,
  autorId: "autor-equipe",
  dataPublicacao: "2026-11-10",
  dataAtualizacao: "2026-11-13",
  resumo,
  imagemDestaque: im,
  corpo: [
    { __component: "blocks.texto" as const, conteudo: [h2("Resumo rápido"), ...p(resumo), h2("O que saber antes de ir"), ul("Texto de exemplo — item 1", "Texto de exemplo — item 2", "Texto de exemplo — item 3"), ...p("Conteúdo provisório. O texto final será escrito com base nas perguntas reais do WhatsApp e do Search Console.")] },
    { __component: "blocks.tabela" as const, titulo: "Distâncias (a confirmar)", cabecalho: ["Saindo de", "Distância", "Tempo de carro"], linhas: [["Brotas", "a confirmar", "a confirmar"], ["São Carlos", "a confirmar", "a confirmar"], ["São Paulo", "a confirmar", "a confirmar"]] },
    { __component: "blocks.cta-produto" as const, produtoId: cta, textoChamada: "Garanta sua data com reserva online." },
  ],
  faq: [faq("Este conteúdo é definitivo?", "Não. É um texto de exemplo para testar o template.")],
  fontes: [{ titulo: "Fonte de exemplo", url: "https://www.saltao.com.br/" }],
  ctaProdutoId: cta,
  relacionadosIds: [],
  seo: seo(`${titulo} | Guia da Serra do Itaqueri`, resumo.slice(0, 150)),
});

const artigos: Conteudo["artigos"] = [
  artigo("art-1", "Cachoeiras perto de Brotas: o que saber antes de ir", "cachoeiras-perto-de-brotas", "cg-cachoeiras", "Um guia prático sobre as cachoeiras da região de Brotas e da Serra do Itaqueri: como chegar, melhor época e o que levar. Texto de exemplo.", fCachMoldura, "prod-dayuse"),
  artigo("art-2", "O que fazer na Serra do Itaqueri em um fim de semana", "o-que-fazer-na-serra-do-itaqueri", "cg-oque", "Roteiro de exemplo para dois dias na Serra do Itaqueri, combinando trilhas, cachoeira e descanso. Texto de exemplo.", fPorDoSolArvore, "prod-apto"),
  artigo("art-3", "Quando ir ao Saltão: melhor época para cachoeira", "quando-ir-ao-saltao", "cg-quando", "Como o volume da cachoeira muda ao longo do ano e qual época combina com cada tipo de passeio. Texto de exemplo.", fCach2, "prod-dayuse"),
  artigo("art-4", "Camping na Serra do Itaqueri: guia para iniciantes", "camping-na-serra-do-itaqueri", "cg-camping", "O que levar, como escolher o lugar da barraca e cuidados para acampar com conforto e segurança. Texto de exemplo.", fCampEntardecer, "prod-camping"),
];
artigos[0].relacionadosIds = ["art-3", "art-2"];

/* ---------------- Avaliações (exemplo — em produção só avaliações reais, com fonte) ---------------- */
const avaliacoes: Conteudo["avaliacoes"] = [
  { documentId: "av-1", nomeAutor: "Visitante de exemplo", nota: 5, texto: "Avaliação de exemplo para testar o layout. Será substituída por avaliações reais com link da fonte.", data: "2026-10-01", fonte: "Google", urlFonte: "https://www.google.com/maps" },
  { documentId: "av-2", nomeAutor: "Outro visitante de exemplo", nota: 4, texto: "Segundo texto de exemplo para o bloco de avaliações em destaque.", data: "2026-09-15", fonte: "TripAdvisor", urlFonte: "https://www.tripadvisor.com.br/" },
];

/* ---------------- Páginas institucionais ---------------- */
const institucionais: Conteudo["institucionais"] = [
  {
    documentId: "inst-conheca",
    locale: "pt",
    updatedAt: T,
    titulo: "Conheça o Saltão",
    slug: "conheca-o-saltao",
    respostaDireta: "O Saltão é um parque de ecoturismo na Serra do Itaqueri, com cachoeira de 75 m, trilhas, day use, hospedagem e camping.",
    secoes: [
      { __component: "blocks.fatos", titulo: "O parque em números", itens: [{ chave: "Altura da cachoeira", valor: "75 m" }, { chave: "Quiosques", valor: "80" }, { chave: "Churrasqueiras", valor: "102" }] },
      { __component: "blocks.texto", conteudo: [h2("Nossa história"), ...p("Texto provisório sobre a história do parque.")] },
      { __component: "blocks.imagem", imagem: fVale },
    ],
    seo: seo("Conheça o Saltão | Parque de Ecoturismo", "Cachoeira de 75 m, trilhas, day use, hospedagem e camping na Serra do Itaqueri."),
  },
  {
    documentId: "inst-cachoeira",
    locale: "pt",
    updatedAt: T,
    titulo: "Cachoeira do Saltão",
    slug: "cachoeira-saltao", // mesma URL do site atual (preserva ranqueamento)
    respostaDireta: "A Cachoeira do Saltão tem 75 m de altura e fica em Itirapina (SP), na Serra do Itaqueri. Do Mirante das Águas é possível ver três cachoeiras.",
    secoes: [
      { __component: "blocks.fatos", titulo: "A cachoeira em números", itens: [{ chave: "Altura", valor: "75 m" }, { chave: "Cachoeiras vistas do Mirante das Águas", valor: "3" }] },
      { __component: "blocks.imagem", imagem: fHero },
      { __component: "blocks.texto", conteudo: [h2("Como visitar"), ...p("A cachoeira faz parte do Day Use do parque. Texto provisório — será reescrito a partir do conteúdo atual do site, sem encurtar.")] },
      { __component: "blocks.cta-produto", produtoId: "prod-dayuse", textoChamada: "Garanta seu ingresso para conhecer a cachoeira." },
    ],
    seo: seo("Cachoeira do Saltão (75 m) em Itirapina-SP | Saltão", "Cachoeira de 75 m em Itirapina, na Serra do Itaqueri, com Mirante das Águas e vista para três cachoeiras."),
  },
  {
    documentId: "inst-restaurante",
    locale: "pt",
    updatedAt: T,
    titulo: "Restaurante Saltão",
    slug: "restaurante-saltao", // mesma URL do site atual
    respostaDireta: "O Restaurante Saltão funciona dentro do parque e atende visitantes do day use, hóspedes e campistas. Horários e cardápio a confirmar.",
    secoes: [{ __component: "blocks.texto", conteudo: [h2("Cardápio"), ...p("Texto provisório.")] }],
    seo: seo("Restaurante Saltão | Itirapina-SP", "Restaurante dentro do Parque Saltão, para visitantes, hóspedes e campistas."),
  },
  {
    documentId: "inst-seguranca",
    locale: "pt",
    updatedAt: T,
    titulo: "Segurança",
    slug: "seguranca",
    respostaDireta: "Regras e cuidados para aproveitar o Saltão com segurança: trilhas sinalizadas, orientações da equipe e áreas de banho indicadas.",
    secoes: [{ __component: "blocks.texto", conteudo: [h2("Regras do parque"), ul("Texto de exemplo — regra 1", "Texto de exemplo — regra 2")] }],
    seo: seo("Segurança | Saltão", "Regras e cuidados para visitar o Saltão com segurança."),
  },
  {
    documentId: "inst-como-chegar",
    locale: "pt",
    updatedAt: T,
    titulo: "Como chegar",
    slug: "como-chegar",
    respostaDireta: "Como chegar ao Saltão de carro saindo de Brotas, São Carlos e São Paulo. Distâncias e rotas a confirmar.",
    secoes: [
      { __component: "blocks.mapa-estatico", imagem: img(mapaProvisorio, "Mapa de localização do Saltão (imagem provisória)"), linkMaps: "https://maps.google.com/" },
      { __component: "blocks.tabela", titulo: "Distâncias", cabecalho: ["Saindo de", "Distância"], linhas: [["Brotas", "a confirmar"], ["São Carlos", "a confirmar"], ["São Paulo", "a confirmar"]] },
    ],
    seo: seo("Como chegar ao Saltão", "Rotas e distâncias para chegar ao Saltão saindo de Brotas, São Carlos e São Paulo."),
  },
  {
    documentId: "inst-privacidade",
    locale: "pt",
    updatedAt: T,
    titulo: "Política de Privacidade e de Cookies",
    slug: "politica-de-privacidade",
    respostaDireta: "Como o Saltão coleta, usa e protege seus dados pessoais, e como gerenciar suas preferências de cookies.",
    secoes: [{ __component: "blocks.texto", conteudo: [h2("Dados coletados"), ...p("Texto jurídico provisório — será fornecido pelo Saltão.")] }],
    seo: { ...seo("Política de Privacidade | Saltão", "Política de privacidade e de cookies do Saltão."), noindex: false },
  },
];

const atendimento: Conteudo["atendimento"] = [
  {
    documentId: "at-faq",
    locale: "pt",
    updatedAt: T,
    titulo: "Dúvidas e Contato",
    slug: "duvidas-e-contato",
    respostaDireta: "Respostas para as perguntas mais comuns sobre ingressos, hospedagem, horários e regras do Saltão, e os canais de atendimento.",
    tipo: "faq-contato",
    grupos: [
      { tituloGrupo: "Ingressos e reservas", itens: [faq("Como compro o ingresso?", "Pelo botão Reservar, com pagamento por Pix ou cartão."), faq("Recebo um voucher?", "Sim, por e-mail, com QR Code para apresentar na portaria.")] },
      { tituloGrupo: "No parque", itens: [faq("Posso levar comida?", "Regra a confirmar com o Saltão.")] },
    ],
    mostrarFormulario: true,
    textoConsentimento: p("Li e concordo com a Política de Privacidade e autorizo o uso dos meus dados para responder a este contato."),
    seo: seo("Dúvidas e Contato | Saltão", "Perguntas frequentes e canais de atendimento do Saltão."),
  },
  {
    documentId: "at-minha-reserva",
    locale: "pt",
    updatedAt: T,
    titulo: "Minha reserva",
    slug: "minha-reserva",
    respostaDireta: "Consulte sua reserva, baixe o voucher ou peça alteração informando o código da reserva e o e-mail usado na compra.",
    tipo: "minha-reserva",
    grupos: [{ tituloGrupo: "Sobre sua reserva", itens: [faq("Onde encontro o código?", "No e-mail de confirmação, logo abaixo do QR Code.")] }],
    mostrarFormulario: false,
    textoConsentimento: [],
    seo: seo("Minha reserva | Saltão", "Consulte sua reserva e baixe o voucher do Saltão."),
  },
];

/* ---------------- Singles por idioma ---------------- */
const global = Object.fromEntries(
  locales.map((loc) => [
    loc,
    {
      documentId: "global",
      locale: loc,
      updatedAt: T,
      nomeOficial: "Saltão — Parque de Ecoturismo",
      telefone: "+55 19 99815-0123",
      whatsapp: "5519998150123", // a confirmar qual número atende no WhatsApp
      whatsappMensagemPadrao: loc === "pt" ? "Olá! Vim pelo site e quero saber mais sobre o Saltão." : loc === "en" ? "Hi! I found you on the website and would like more information." : "¡Hola! Vengo del sitio web y quiero más información.",
      email: "cachoeira@saltao.com.br",
      endereco: { rua: "Rodovia Ulisses Guimarães", numero: "Km 23", cidade: "Itirapina", uf: "SP", cep: "13530-000" }, // CEP e coordenadas a confirmar
      geo: { latitude: -22.25, longitude: -47.82 },
      horarios: [{ dias: "Mo-Su", abre: "08:00", fecha: "17:00" }],
      redesSociais: [
        { rede: "instagram", url: "https://www.instagram.com/cachoeiradosaltao/" },
        { rede: "facebook", url: "https://www.facebook.com/cachoeirasaltao" },
        { rede: "youtube", url: "https://www.youtube.com/c/CampingPousadaeCachoeiraSaltaoItirapina" },
        { rede: "tripadvisor", url: "https://www.tripadvisor.com.br/Attraction_Review-g793338-d2427005-Reviews-Saltao_Waterfall-Brotas_State_of_Sao_Paulo.html" },
      ],
      distancias: [],
      menuPrincipal: [],
      resumoLlms:
        "Saltão — Parque de Ecoturismo em Itirapina (SP), na Serra do Itaqueri, Rodovia Ulisses Guimarães, km 23. Cachoeira de 75 m, Mirante das Águas com vista para três cachoeiras, day use, apartamentos para até 4 pessoas, camping, restaurante, 80 quiosques e 102 churrasqueiras. Reservas online com Pix e cartão. (Resumo de exemplo.)",
      seoPadrao: seo("Saltão — Parque de Ecoturismo", L[loc].heroResp.slice(0, 150)),
    },
  ]),
) as Conteudo["global"];

const home = Object.fromEntries(
  locales.map((loc) => [
    loc,
    {
      documentId: "home",
      locale: loc,
      updatedAt: T,
      hero: { __component: "blocks.hero" as const, sobretitulo: L[loc].sobre, titulo: L[loc].hero, respostaDireta: L[loc].heroResp, imagem: img(fPanoramicaSrc, loc === "pt" ? "Cachoeira de 75 m do Saltão caindo pelo paredão de rocha alaranjada, com mata dos dois lados e visitantes no poço" : loc === "en" ? "Saltão's 75 m waterfall falling down the orange rock face, with forest on both sides and visitors at the pool" : "Cascada de 75 m de Saltão cayendo por la pared de roca anaranjada, con bosque a ambos lados y visitantes en la poza"), cta: { rotulo: L[loc].reservar, tipo: "link" as const, url: "https://reservas.saltao.com.br/reservar" } },
      secoes: (() => {
        const x = (pt: string, en: string, es: string) => (loc === "pt" ? pt : loc === "en" ? en : es);
        return [
          {
            __component: "blocks.citacao" as const,
            texto: x(
              "A água cai *75 metros*\nno meio da mata da serra.\nO dia passa devagar,\ne a noite acende o céu.",
              "The water falls *75 metres*\nthrough the forest of the hills.\nThe day goes by slowly,\nand the night lights up the sky.",
              "El agua cae *75 metros*\nen medio del bosque de la sierra.\nEl día pasa despacio,\ny la noche enciende el cielo.",
            ),
          },
          { __component: "blocks.indice-capitulos" as const, sobretitulo: x("O parque", "The park", "El parque"), titulo: x("Quatro caminhos", "Four journeys", "Cuatro caminos") },
          {
            __component: "blocks.capitulo" as const,
            ancora: "cachoeiras",
            sobretitulo: x("Cachoeiras", "Waterfalls", "Cascadas"),
            titulo: x("Onde a água despenca de *75 metros*", "Where the water drops *75 metres*", "Donde el agua cae *75 metros*"),
            texto: x(
              "A Cachoeira do Saltão cai livre de um paredão de rocha no meio da mata da Serra do Itaqueri. Pela trilha do bambuzal, uma segunda cachoeira forma um poço amplo para o banho.",
              "Saltão waterfall falls freely from a rock wall in the middle of the Serra do Itaqueri forest. Along the bamboo trail, a second waterfall forms a wide pool for swimming.",
              "La cascada de Saltão cae libre desde una pared de roca en medio del bosque de la Serra do Itaqueri. Por el sendero del bambú, una segunda cascada forma una poza amplia para bañarse.",
            ),
            imagem: img(fCapCachSrc, x("Cachoeira do Saltão vista de longe, cercada de mata nativa, com visitantes na base", "Saltão waterfall seen from afar, surrounded by native forest, with visitors at its base", "Cascada de Saltão vista de lejos, rodeada de bosque nativo, con visitantes en la base")),
            galeria: [
              { ...img(fCapQuedaSrc, x("A queda de 75 m da Cachoeira do Saltão, em foto vertical", "Saltão's 75 m drop, vertical photo", "La caída de 75 m de Saltão, foto vertical")), caption: x("A queda de 75 m vista do poço", "The 75 m drop seen from the pool", "La caída de 75 m vista desde la poza") },
              { ...img(fCapCach2Src, x("Poço da segunda cachoeira do parque", "Pool of the park's second waterfall", "Poza de la segunda cascada del parque")), caption: x("A segunda cachoeira, no fim da trilha", "The second waterfall, at the end of the trail", "La segunda cascada, al final del sendero") },
            ],
            destaque: "75 m",
            destaqueLegenda: x("de queda livre", "free fall", "de caída libre"),
            layout: "narrativa" as const,
            tema: "escuro" as const,
            cta: { rotulo: x("Conheça as cachoeiras", "Discover the waterfalls", "Conoce las cascadas"), tipo: "pagina" as const, paginaId: "inst-cachoeira" },
          },
          {
            __component: "blocks.capitulo" as const,
            ancora: "day-use",
            sobretitulo: "Day Use",
            titulo: x("Um dia inteiro *com os pés na água*", "A whole day *with your feet in the water*", "Un día entero *con los pies en el agua*"),
            texto: x(
              "Trilha, banho de cachoeira, churrasco no quiosque à beira do rio e a tarde inteira para não fazer nada. Chegue cedo e fique até o sol baixar.",
              "Trails, a waterfall swim, a riverside barbecue and the whole afternoon to do nothing. Arrive early and stay until the sun goes down.",
              "Sendero, baño de cascada, asado en el quincho junto al río y toda la tarde para no hacer nada. Llega temprano y quédate hasta que baje el sol.",
            ),
            imagem: img(fCapDayUseSrc, x("Segunda cachoeira do parque, queda larga sobre rochas com poço amplo", "The park's second waterfall, a wide drop over rocks into a large pool", "Segunda cascada del parque, caída ancha sobre rocas con poza amplia")),
            galeria: [
              { ...img(fCapDayUse1Src, x("Amigos no quiosque com churrasqueira", "Friends at a barbecue kiosk", "Amigos en el quincho con parrilla")), caption: x("Quiosques com churrasqueira à beira do rio", "Barbecue kiosks by the river", "Quinchos con parrilla junto al río") },
              { ...img(fCapDayUse2Src, x("Porção de linguiça com cerveja gelada", "Sausage snack with a cold beer", "Picada de chorizo con cerveza fría")), caption: x("Porção e cerveja gelada no fim da tarde", "Snacks and a cold beer in the late afternoon", "Picada y cerveza fría al final de la tarde") },
            ],
            layout: "narrativa" as const,
            tema: "claro" as const,
            cta: { rotulo: x("Conheça o Day Use", "Discover the Day Pass", "Conoce el Pase de Día"), tipo: "categoria" as const, categoriaId: "cat-dayuse" },
          },
          {
            __component: "blocks.capitulo" as const,
            ancora: "apartamentos",
            sobretitulo: x("Apartamentos", "Rooms", "Habitaciones"),
            titulo: x("Dormir *dentro do parque*", "Sleep *inside the park*", "Dormir *dentro del parque*"),
            texto: x(
              "Acordar com o som da mata, tomar café sem pressa e estar a poucos passos da cachoeira antes de todo mundo chegar.",
              "Wake up to the sound of the forest, have a slow breakfast and be steps from the waterfall before anyone else arrives.",
              "Despertar con el sonido del bosque, desayunar sin prisa y estar a pocos pasos de la cascada antes que nadie.",
            ),
            imagem: img(fCapAptoSrc, x("Apartamento azul com buganvília florida na fachada", "Blue guest room with blooming bougainvillea on the façade", "Habitación azul con buganvilla florida en la fachada")),
            galeria: [
              { ...img(fCapApto1Src, x("Quarto do apartamento com duas camas", "Guest room with two beds", "Habitación con dos camas")), caption: x("Quartos para até 4 pessoas", "Rooms for up to 4 people", "Habitaciones para hasta 4 personas") },
              { ...img(fCapApto2Src, x("Café da manhã servido em bandeja de madeira", "Breakfast served on a wooden tray", "Desayuno servido en bandeja de madera")), caption: x("Café da manhã sem pressa", "A slow breakfast", "Desayuno sin prisa") },
            ],
            layout: "narrativa" as const,
            tema: "escuro" as const,
            cta: { rotulo: x("Conheça os apartamentos", "See the rooms", "Conoce las habitaciones"), tipo: "produto" as const, produtoId: "prod-apto" },
          },
          {
            __component: "blocks.capitulo" as const,
            ancora: "camping",
            sobretitulo: "Camping",
            titulo: x("Barraca, fogueira *e céu estrelado*", "A tent, a campfire *and a starry sky*", "Carpa, fogata *y cielo estrellado*"),
            texto: x(
              "Áreas de camping com estrutura no meio do verde, para montar a barraca, acender a fogueira e dormir ouvindo a água.",
              "Equipped camping areas surrounded by green, to pitch your tent, light a campfire and fall asleep to the sound of water.",
              "Áreas de camping equipadas en medio del verde, para armar la carpa, encender la fogata y dormir escuchando el agua.",
            ),
            imagem: img(fCapCampSrc, x("Barraca grande na área de camping ao entardecer", "Large tent in the camping area at dusk", "Carpa grande en el camping al atardecer")),
            galeria: [
              { ...img(fCapCamp1Src, x("Fogueira acesa à noite", "Campfire at night", "Fogata encendida de noche")), caption: x("Fogueira depois do jantar", "A campfire after dinner", "Fogata después de la cena") },
              { ...img(fCapCamp2Src, x("Família em frente à barraca", "Family in front of their tent", "Familia frente a su carpa")), caption: x("Camping em família", "Family camping", "Camping en familia") },
            ],
            layout: "narrativa" as const,
            tema: "profundo" as const,
            cta: { rotulo: x("Conheça o camping", "See the camping", "Conoce el camping"), tipo: "produto" as const, produtoId: "prod-camping" },
          },
          {
            __component: "blocks.citacao" as const,
            texto: x("Aqui o barulho que fica é o da *água caindo*.", "Here, the only noise left is the *falling water*.", "Aquí el único ruido que queda es el del *agua cayendo*."),
            imagem: img(fFraseSrc, x("Vista frontal da segunda cachoeira do parque e seu poço", "Front view of the park's second waterfall and its pool", "Vista frontal de la segunda cascada del parque y su poza")),
          },
        ];
      })(),
      seo: seo(loc === "pt" ? "Saltão — Parque de Ecoturismo | Cachoeira, Day Use e Hospedagem" : loc === "en" ? "Saltão Ecotourism Park | Waterfall, Day Pass and Lodging" : "Saltão Parque de Ecoturismo | Cascada, Pase de Día y Hospedaje", L[loc].heroResp.slice(0, 150)),
    },
  ]),
) as Conteudo["home"];

const guiaHome: Conteudo["guiaHome"] = {
  pt: { documentId: "guia-home", locale: "pt", updatedAt: T, titulo: "Guia da Serra do Itaqueri", respostaDireta: "Dicas, roteiros e respostas sobre cachoeiras, trilhas, camping e passeios na Serra do Itaqueri, escritos pela equipe do Saltão.", seo: seo("Guia da Serra do Itaqueri | Saltão", "Dicas e roteiros sobre cachoeiras, trilhas e camping na Serra do Itaqueri.") },
};

export const fixtures: Conteudo = { global, home, guiaHome, produtos, categoriasProduto, artigos, categoriasGuia, autores, avaliacoes, institucionais, atendimento };
