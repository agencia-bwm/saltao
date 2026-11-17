/**
 * DADOS DE EXEMPLO — usados quando STRAPI_URL não está definido (dev local e Lighthouse CI).
 * Textos, preços, endereço e avaliações são PROVISÓRIOS e não devem ser publicados.
 * Em produção o conteúdo vem sempre do painel (Strapi).
 */
import type { Conteudo, Faq, Icone, Img, Locale, RichText, Seo } from "../lib/types";
import fHeroSrc from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-paredao-visitantes-poco.jpg";
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
import fPorDoSolSrc from "../assets/fotos/paisagem/por-do-sol-sol-tocando-horizonte.jpg";
import fPorDoSolArvoreSrc from "../assets/fotos/paisagem/por-do-sol-dourado-arvore.jpg";
import fQueda75Src from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-queda-75m-vertical-01.jpg";
import fPorcaoSrc from "../assets/fotos/gastronomia/porcao-linguica-pao-cerveja.jpg";
import fEscalaSrc from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-visitante-escala.jpg";
import fC2PocoSrc from "../assets/fotos/cachoeira-2/cachoeira-2-poco-vertical.jpg";
import fSlackSrc from "../assets/fotos/camping/camping-slackline-crianca.jpg";
import fPorDoSolLaranjaSrc from "../assets/fotos/paisagem/por-do-sol-laranja-horizonte.jpg";
import fPocoCeuSrc from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-poco-ceu-azul.jpg";
import fPalmeiraSrc from "../assets/fotos/paisagem/por-do-sol-palmeira-vertical.jpg";
import fQuedaLargaSrc from "../assets/fotos/cachoeira-2/cachoeira-2-queda-larga-poco.jpg";
import fAptoAzulSrc from "../assets/fotos/hospedagem/apartamento-azul-fachada-buganvilia.jpg";
import fAptoVerdeSrc from "../assets/fotos/hospedagem/apartamento-verde-fachada.jpg";
import fQuartoDuasSrc from "../assets/fotos/hospedagem/apartamento-quarto-duas-camas.jpg";
import fQuartoArSrc from "../assets/fotos/hospedagem/apartamento-quarto-ar-condicionado.jpg";
import fCampAmigosSrc from "../assets/fotos/camping/camping-barracas-quiosque-amigos.jpg";
import fCampQuiosqueVistaSrc from "../assets/fotos/camping/camping-barraca-quiosque-vista.jpg";
import fCampAzulSrc from "../assets/fotos/camping/camping-barraca-azul-quiosques.jpg";
import fCampGrandeSrc from "../assets/fotos/camping/camping-entardecer-barraca-grande.jpg";
import fCampNoiteBarracasSrc from "../assets/fotos/camping/camping-noite-barracas-quiosque.jpg";
import fFogueiraVSrc from "../assets/fotos/camping/fogueira-noite-vertical.jpg";
import fCachMataSrc from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-mata-visitantes.jpg";
import fQueda75bSrc from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-queda-75m-vertical-02.jpg";
import fCachPocoVSrc from "../assets/fotos/cachoeira-saltao/cachoeira-saltao-poco-vertical.jpg";
import fTrilhaVSrc from "../assets/fotos/cachoeira-2/cachoeira-2-trilha-bambuzal-vertical.jpg";
import fC2Poco2Src from "../assets/fotos/cachoeira-2/cachoeira-2-poco-vertical-02.jpg";
import fBifeCloseSrc from "../assets/fotos/gastronomia/prato-feito-bife-close.jpg";
import fPorcaoVSrc from "../assets/fotos/gastronomia/porcao-linguica-cerveja-vertical.jpg";
import fFrangoSrc from "../assets/fotos/gastronomia/prato-feito-frango-arroz-fritas.jpg";
import fCafeBoloSrc from "../assets/fotos/gastronomia/cafe-da-manha-bandeja-bolo-01.jpg";
import fSolarSrc from "../assets/fotos/estrutura/energia-solar-paineis.jpg";
import fKidsEscorregadorSrc from "../assets/fotos/estrutura/salao-kids-escorregador-vertical.jpg";
import fKidsPlaySrc from "../assets/fotos/estrutura/salao-kids-playground-coberto.jpg";


const T = "2026-11-13T12:00:00.000Z";
const img = (src: Img["src"], alt: string): Img => ({ src, alt });

/* Fotos reais (lote 1, 14/11/2026) — alt vem de docs/fotos-catalogo.csv */
const fHero = img(fHeroSrc, "Cachoeira do Saltão caindo 75 metros pelo paredão de rocha alaranjada, com mata nos dois lados e visitantes no poço");
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
const fPorDoSol = img(fPorDoSolSrc, "Sol tocando o horizonte com palmeira e eucaliptos em silhueta");
const fPorDoSolArvore = img(fPorDoSolArvoreSrc, "Pôr do sol dourado sobre campos e árvore isolada");
const fQueda75 = img(fQueda75Src, "Cachoeira do Saltão, queda d'água de 75 metros sobre paredão de rocha avermelhada");
const fPorcao = img(fPorcaoSrc, "Porção de linguiça com pão de alho, salada, limão e copo de cerveja");
const fEscala = img(fEscalaSrc, "Visitante pequeno diante do paredão da cachoeira do Saltão, mostrando a escala dos 75 metros");
const fC2Poco = img(fC2PocoSrc, "Poço de água escura ao pé da segunda cachoeira, cercado de mata");
const fSlack = img(fSlackSrc, "Criança na slackline entre árvores na área de camping");
const fPorDoSolLaranja = img(fPorDoSolLaranjaSrc, "Céu laranja no pôr do sol sobre o horizonte da serra");
const fPocoCeu = img(fPocoCeuSrc, "Poço da cachoeira do Saltão sob céu azul");
const fPalmeira = img(fPalmeiraSrc, "Palmeira em silhueta contra o céu do entardecer");
const fQuedaLarga = img(fQuedaLargaSrc, "Queda d'água larga caindo em poço cercado de rochas e mata");
const fAptoAzul = img(fAptoAzulSrc, "Fachada de apartamento azul com buganvília florida em primeiro plano");
const fAptoVerde = img(fAptoVerdeSrc, "Fachada de apartamento verde com varanda, ao lado de apartamento amarelo");
const fQuartoDuas = img(fQuartoDuasSrc, "Quarto de apartamento com cama de casal e cama de solteiro");
const fQuartoAr = img(fQuartoArSrc, "Quarto do apartamento com cama de casal, ar-condicionado e janela");
const fCampAmigos = img(fCampAmigosSrc, "Grupo de amigos junto a barracas e quiosque com churrasqueira na área de camping");
const fCampQuiosqueVista = img(fCampQuiosqueVistaSrc, "Barraca sob quiosque de madeira com vista para a mata");
const fCampAzul = img(fCampAzulSrc, "Barraca azul em primeiro plano com quiosques de telhado de barro ao fundo");
const fCampGrande = img(fCampGrandeSrc, "Barraca grande montada no gramado ao entardecer, com palmeiras ao fundo");
const fCampNoiteBarracas = img(fCampNoiteBarracasSrc, "Barracas montadas à noite ao lado de quiosque com churrasqueira");
const fFogueiraV = img(fFogueiraVSrc, "Fogueira acesa à noite no parque");
const fCachMata = img(fCachMataSrc, "Cachoeira do Saltão vista de longe, cercada de mata nativa, com visitantes na base");
const fQueda75b = img(fQueda75bSrc, "Queda de 75 metros da Cachoeira do Saltão vista de baixo, com o paredão de rocha");
const fCachPocoV = img(fCachPocoVSrc, "Poço ao pé da Cachoeira do Saltão, com a queda ao fundo");
const fTrilhaV = img(fTrilhaVSrc, "Trilha entre bambus altos a caminho da segunda cachoeira");
const fC2Poco2 = img(fC2Poco2Src, "Poço da segunda cachoeira cercado de rochas e mata");
const fBifeClose = img(fBifeCloseSrc, "Prato feito com bife, arroz, feijão e batata frita visto de perto");
const fPorcaoV = img(fPorcaoVSrc, "Porção de linguiça com copo de cerveja gelada");
const fFrango = img(fFrangoSrc, "Prato feito com frango, arroz, batata frita e salada");
const fCafeBolo = img(fCafeBoloSrc, "Bandeja de café da manhã com bolo, pães e frutas");
const fSolar = img(fSolarSrc, "Painéis de energia solar instalados no parque");
const fKidsEscorregador = img(fKidsEscorregadorSrc, "Escorregador no salão kids coberto");
const fKidsPlay = img(fKidsPlaySrc, "Playground coberto do salão kids");
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
    hero: "Saltão — Parque de Ecoturismo na Serra do Itaqueri",
    heroResp: "O Saltão é um parque de ecoturismo com cachoeira de 75 m, day use, hospedagem, camping e quiosques com churrasqueira. Reserve online e garanta sua data.",
    reservar: "Reservar",
    cats: {
      dayuse: ["Day Use", "day-use", "Passe o dia no Saltão com acesso à cachoeira, trilhas e áreas de lazer. Ingresso por pessoa, com reserva online."],
      hosp: ["Hospedagem e Camping", "hospedagem", "Durma no parque: apartamentos com café da manhã e áreas de camping com estrutura."],
      quiosques: ["Churrasqueiras e Quiosques", "churrasqueiras-e-quiosques", "Reserve um quiosque ou churrasqueira para o seu grupo, com mesas e ponto de apoio. A partir de R$ 120 por dia (valor de exemplo)."],
      combos: ["Monte sua Experiência", "monte-sua-experiencia", "Combos prontos que juntam day use, hospedagem e quiosque com preço especial."],
    },
  },
  en: {
    hero: "Saltão — Ecotourism Park in Serra do Itaqueri, Brazil",
    heroResp: "Saltão is an ecotourism park with a 75 m waterfall, day passes, lodging, camping and barbecue kiosks. Book online and secure your date.",
    reservar: "Book now",
    cats: {
      dayuse: ["Day Pass", "day-pass", "Spend the day at Saltão with access to the waterfall, trails and leisure areas. Tickets per person, booked online."],
      hosp: ["Lodging and Camping", "lodging", "Stay in the park: rooms with breakfast and equipped camping areas."],
      quiosques: ["Barbecue Kiosks", "barbecue-kiosks", "Book a kiosk or barbecue area for your group, with tables and support point. From R$ 120 per day (sample price)."],
      combos: ["Build Your Experience", "build-your-experience", "Ready-made packages combining day pass, lodging and kiosk at a special price."],
    },
  },
  es: {
    hero: "Saltão — Parque de Ecoturismo en la Serra do Itaqueri, Brasil",
    heroResp: "Saltão es un parque de ecoturismo con una cascada de 75 m, pase de día, hospedaje, camping y quinchos con parrilla. Reserva en línea y asegura tu fecha.",
    reservar: "Reservar",
    cats: {
      dayuse: ["Pase de Día", "pase-de-dia", "Pasa el día en Saltão con acceso a la cascada, senderos y áreas de ocio. Entradas por persona, con reserva online."],
      hosp: ["Hospedaje y Camping", "hospedaje", "Duerme en el parque: habitaciones con desayuno y áreas de camping equipadas."],
      quiosques: ["Quinchos y Parrillas", "quinchos-y-parrillas", "Reserva un quincho o parrilla para tu grupo, con mesas y punto de apoyo. Desde R$ 120 por día (precio de ejemplo)."],
      combos: ["Arma tu Experiencia", "arma-tu-experiencia", "Combos listos que reúnen pase de día, hospedaje y quincho con precio especial."],
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
    imgs: [fEscala, fTrilha, fCach2, fPocoCeu, fCach2Pan, fPorcao, fQuiosque, fPorDoSolArvore],
    t: {
      pt: ["Ingresso Day Use", "ingresso-day-use", "Ingresso para passar o dia no Saltão, com acesso à cachoeira de 75 m, trilhas e áreas de lazer. Ideal para famílias e grupos."],
      en: ["Day Pass Ticket", "day-pass-ticket", "Ticket to spend the day at Saltão, with access to the 75 m waterfall, trails and leisure areas. Great for families and groups."],
      es: ["Entrada Pase de Día", "entrada-pase-de-dia", "Entrada para pasar el día en Saltão, con acceso a la cascada de 75 m, senderos y áreas de ocio. Ideal para familias y grupos."],
    },
  },
  {
    id: "prod-apto",
    cat: "cat-hosp",
    motor: "apartamento",
    preco: 280,
    unidade: "por-noite" as const,
    schema: "LodgingBusiness" as const,
    imgs: [fAptos, fQuarto, fBanheiro, fCafe, fAptoAzul, fQuartoDuas, fAptoVerde, fQuartoAr],
    t: {
      pt: ["Apartamentos", "apartamentos", "Suítes dentro do parque para até 4 pessoas, com TV, frigobar e ventilador de teto, e acesso às áreas do day use durante a estadia."],
      en: ["Rooms", "rooms", "Rooms inside the park, with breakfast and free access to the day-pass areas during your stay."],
      es: ["Habitaciones", "habitaciones", "Habitaciones dentro del parque, con desayuno y acceso libre a las áreas del pase de día durante la estadía."],
    },
  },
  {
    id: "prod-camping",
    cat: "cat-hosp",
    motor: "camping",
    preco: 70,
    unidade: "por-pessoa-noite" as const,
    schema: "Campground" as const,
    imgs: [fCampFamilia, fCampNoite, fFogueira, fCampVale, fCampAmigos, fCampGrande, fCampQuiosqueVista, fCampNoiteBarracas, fCampAzul, fFogueiraV],
    t: {
      pt: ["Camping", "camping", "Área de camping com banheiros, pontos de energia e acesso à cachoeira."],
      en: ["Camping", "camping", "Camping area with restrooms, power points and waterfall access."],
      es: ["Camping", "camping", "Área de camping con baños, puntos de energía y acceso a la cascada."],
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
  {
    id: "prod-combo-familia",
    cat: "cat-combos",
    motor: "combo-familia",
    preco: 390,
    unidade: "por-noite" as const,
    schema: "Product" as const,
    imgs: [fAptosVA, fCach2Pan, fKids],
    t: {
      pt: ["Combo Família: hospedagem + day use", "combo-familia", "Uma noite em apartamento com day use para toda a família no dia seguinte, com preço especial. A partir de R$ 390 (valor de exemplo)."],
      en: ["Family Package: lodging + day pass", "family-package", "One night in a room plus a day pass for the whole family the next day, at a special price. From R$ 390 (sample price)."],
      es: ["Combo Familia: hospedaje + pase de día", "combo-familia", "Una noche en habitación más pase de día para toda la familia al día siguiente, con precio especial. Desde R$ 390 (precio de ejemplo)."],
    },
  },
];

type Destaque = { icone: Icone; rotulo: string };
const d3 = (icone: Icone, pt: string, en: string, es: string) => ({ pt: { icone, rotulo: pt }, en: { icone, rotulo: en }, es: { icone, rotulo: es } });
const juntar = (...xs: Record<Locale, Destaque>[]) => ({ pt: xs.map((x) => x.pt), en: xs.map((x) => x.en), es: xs.map((x) => x.es) });
const DESTAQUES: Record<string, Record<Locale, Destaque[]>> = {
  "prod-dayuse": juntar(
    d3("cachoeira", "Cachoeira de 75 m", "75 m waterfall", "Cascada de 75 m"),
    d3("trilha", "Trilhas na mata", "Forest trails", "Senderos en el bosque"),
    d3("talheres", "Restaurante no parque", "Restaurant in the park", "Restaurante en el parque"),
    d3("carro", "Estacionamento", "Parking", "Estacionamiento"),
  ),
  "prod-apto": juntar(
    d3("familia", "Até 4 pessoas", "Up to 4 guests", "Hasta 4 personas"),
    d3("cama", "Suíte com banheiro", "En-suite room", "Suite con baño"),
    d3("cafe", "Café da manhã", "Breakfast", "Desayuno"),
    d3("cachoeira", "Day use incluso", "Day pass included", "Pase de día incluido"),
  ),
  "prod-camping": juntar(
    d3("barraca", "Traga sua barraca", "Bring your tent", "Trae tu carpa"),
    d3("chuveiro", "Banheiros", "Restrooms", "Baños"),
    d3("tomada", "Pontos de energia", "Power points", "Puntos de energía"),
    d3("cachoeira", "Acesso à cachoeira", "Waterfall access", "Acceso a la cascada"),
  ),
};

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
      destaques: DESTAQUES[b.id]?.[loc],
      seo: seo(`${titulo} | Saltão`, resp.slice(0, 150)),
    };
  }),
);

/* ---------------- Categorias de produto ---------------- */
const catDefs = [
  ["cat-dayuse", "dayuse", fTrilha, ["prod-dayuse"], 1],
  ["cat-hosp", "hosp", fAptos, ["prod-apto", "prod-camping"], 2],
  ["cat-quiosques", "quiosques", fQuiosque, ["prod-quiosque"], 3],
  ["cat-combos", "combos", fPorDoSol, ["prod-combo-familia"], 4],
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
  artigo("art-2", "O que fazer na Serra do Itaqueri em um fim de semana", "o-que-fazer-na-serra-do-itaqueri", "cg-oque", "Roteiro de exemplo para dois dias na Serra do Itaqueri, combinando trilhas, cachoeira e descanso. Texto de exemplo.", fPorDoSolArvore, "prod-combo-familia"),
  artigo("art-3", "Quando ir ao Saltão: melhor época para cachoeira", "quando-ir-ao-saltao", "cg-quando", "Como o volume da cachoeira muda ao longo do ano e qual época combina com cada tipo de passeio. Texto de exemplo.", fCach2, "prod-dayuse"),
  artigo("art-4", "Camping na Serra do Itaqueri: guia para iniciantes", "camping-na-serra-do-itaqueri", "cg-camping", "O que levar, como escolher o lugar da barraca e cuidados para acampar com conforto e segurança. Texto de exemplo.", fCampEntardecer, "prod-camping"),
];
artigos[0].relacionadosIds = ["art-3", "art-2"];

/* ---------------- Avaliações (exemplo — em produção só avaliações reais, com fonte) ---------------- */
const avaliacoes: Conteudo["avaliacoes"] = [
  { documentId: "av-1", nomeAutor: "Visitante de exemplo", nota: 5, texto: "Avaliação de exemplo para testar o layout. Será substituída por avaliações reais com link da fonte.", data: "2026-10-01", fonte: "Google", urlFonte: "https://www.google.com/maps" },
  { documentId: "av-2", nomeAutor: "Outro visitante de exemplo", nota: 4, texto: "Segundo texto de exemplo para o bloco de avaliações em destaque.", data: "2026-09-15", fonte: "TripAdvisor", urlFonte: "https://www.tripadvisor.com.br/" },
  { documentId: "av-3", nomeAutor: "Terceiro visitante de exemplo", nota: 5, texto: "Terceiro texto de exemplo, no lugar de uma avaliação real sobre a cachoeira e o day use.", data: "2026-08-30", fonte: "Google", urlFonte: "https://www.google.com/maps" },
  { documentId: "av-4", nomeAutor: "Quarto visitante de exemplo", nota: 5, texto: "Quarto texto de exemplo, no lugar de uma avaliação real sobre o camping e os quiosques.", data: "2026-08-12", fonte: "Google", urlFonte: "https://www.google.com/maps" },
];

/* ---------------- Páginas institucionais ---------------- */
const institucionais: Conteudo["institucionais"] = [
  {
    documentId: "inst-cachoeira",
    locale: "pt",
    updatedAt: T,
    titulo: "Cachoeira Saltão",
    slug: "cachoeira-saltao", // mesma URL do site atual (preserva ranqueamento)
    respostaDireta: "A Cachoeira Saltão tem 75 m de queda livre e fica em Itirapina (SP), na Serra do Itaqueri. Do Mirante das Águas é possível ver três cachoeiras.",
    landing: true,
    sobretitulo: "Itirapina (SP) · Serra do Itaqueri",
    tituloDestaque: "75 metros de queda livre.",
    fotosIntro: [fCachMata, fC2Poco],
    secoes: [
      {
        __component: "blocks.setor",
        sobretitulo: "A cachoeira",
        icone: "cachoeira",
        titulo: "A queda de 75 metros",
        texto: "A água desce em queda livre por um paredão de rocha alaranjada até o poço, cercada de mata nativa dos dois lados. É o cartão-postal do parque e o ponto alto do day use.",
        fotos: [fQueda75, fCachPocoV, fPocoCeu, fQueda75b, fHero, fCachMoldura],
        destaques: [
          { icone: "cachoeira", rotulo: "75 m de queda livre" },
          { icone: "trilha", rotulo: "Trilha até o poço" },
          { icone: "folha", rotulo: "Mata nativa" },
          { icone: "mapa", rotulo: "Mirante das Águas" },
        ],
        listaTitulo: "Para aproveitar melhor",
        lista: ["Calçado com boa aderência", "Protetor solar e água", "Siga as orientações da equipe"],
        cta: { rotulo: "Reservar Day Use", tipo: "link", url: "https://reservas.saltao.com.br/reservar?produto=day-use" },
        ctaSecundario: { rotulo: "Como chegar", tipo: "link", url: "/atendimento/#como-chegar" },
      },
      {
        __component: "blocks.fatos",
        sobretitulo: "A queda",
        titulo: "Uma cachoeira do tamanho de um prédio de 25 andares",
        texto: "São 75 metros de queda livre sobre o paredão de rocha da Serra do Itaqueri. Do mirante, dá para ver três cachoeiras de uma vez.",
        imagem: fEscala,
        itens: [
          { chave: "de queda livre", valor: "75 m" },
          { chave: "cachoeiras vistas do Mirante das Águas", valor: "3" },
        ],
      },
      {
        __component: "blocks.setor",
        sobretitulo: "Mais cachoeiras",
        icone: "trilha",
        titulo: "Segunda cachoeira e trilha do bambuzal",
        texto: "Uma trilha entre bambus altos leva até a segunda cachoeira do parque, com queda larga e um poço amplo cercado de rochas. Um passeio tranquilo para fazer no mesmo dia.",
        fotos: [fTrilha, fC2Poco2, fCach2, fCach2Pan, fTrilhaV, fQuedaLarga],
        destaques: [
          { icone: "trilha", rotulo: "Trilha do bambuzal" },
          { icone: "cachoeira", rotulo: "Queda larga" },
          { icone: "familia", rotulo: "Para toda a família" },
        ],
        cta: { rotulo: "Reservar Day Use", tipo: "link", url: "https://reservas.saltao.com.br/reservar?produto=day-use" },
      },
      {
        __component: "blocks.experiencias",
        sobretitulo: "Combine com",
        titulo: "Para completar o passeio",
        itens: [
          { imagem: fPrato, icone: "talheres", titulo: "Restaurante", texto: "Almoço caseiro depois da cachoeira.", link: "/restaurante-saltao/" },
          { imagem: fQuiosque, icone: "churrasqueira", titulo: "Quiosques", texto: "Churrasco com a turma.", link: "/estrutura/#quiosques-e-churrasqueiras" },
          { imagem: fCampEntardecer, icone: "barraca", titulo: "Fique para dormir", texto: "Apartamentos e camping no parque.", link: "/hospedagem/" },
          { imagem: fPorDoSol, icone: "sol", titulo: "Pôr do sol", texto: "O fim de tarde mais bonito da serra.", link: "/day-use/" },
        ],
      },
      {
        __component: "blocks.faq",
        titulo: "Perguntas sobre a cachoeira",
        itens: [
          faq("Onde fica a Cachoeira Saltão?", "Na Rodovia Ulisses Guimarães, km 23, em Itirapina (SP), na Serra do Itaqueri."),
          faq("Como visitar a cachoeira?", "O acesso à cachoeira faz parte do Day Use do parque, com reserva online."),
          faq("Pode entrar no poço?", "Regras de banho a confirmar com o parque (texto de exemplo)."),
        ],
      },
      {
        __component: "blocks.chamada",
        sobretitulo: "Venha ver de perto",
        titulo: "75 metros de água",
        tituloDestaque: "te esperando.",
        texto: "Garanta seu Day Use e passe o dia na cachoeira.",
        imagem: fPocoCeu,
        cta: { rotulo: "Reservar", tipo: "link", url: "https://reservas.saltao.com.br/reservar?produto=day-use" },
        ctaSecundario: { rotulo: "Falar no WhatsApp", tipo: "whatsapp" },
      },
    ],
    seo: seo("Cachoeira Saltão (75 m) em Itirapina-SP | Saltão", "Cachoeira de 75 m em Itirapina, na Serra do Itaqueri, com Mirante das Águas e vista para três cachoeiras."),
  },
  {
    documentId: "inst-estrutura",
    locale: "pt",
    updatedAt: T,
    titulo: "Estrutura",
    slug: "estrutura",
    respostaDireta: "O Saltão tem restaurante, 80 quiosques e 102 churrasqueiras, salão kids, energia solar, hospedagem e camping, tudo dentro do parque, na Serra do Itaqueri.",
    landing: true,
    sobretitulo: "Tudo dentro do parque",
    tituloDestaque: "para o dia inteiro.",
    fotosIntro: [fVale, fKidsPlay],
    secoes: [
      {
        __component: "blocks.setor",
        sobretitulo: "Gastronomia",
        icone: "talheres",
        titulo: "Restaurante",
        texto: "Comida caseira, porções e bebida gelada para quem passa o dia, se hospeda ou acampa no parque. Cardápio e horários a confirmar.",
        fotos: [fPrato, fPorcaoV, fFrango, fBifeClose, fPorcao, fCafeBolo],
        destaques: [
          { icone: "talheres", rotulo: "Comida caseira" },
          { icone: "cafe", rotulo: "Café da manhã para hóspedes" },
          { icone: "familia", rotulo: "Para toda a família" },
        ],
        cta: { rotulo: "Conhecer o restaurante", tipo: "link", url: "/restaurante-saltao/" },
      },
      {
        __component: "blocks.setor",
        sobretitulo: "Para grupos",
        icone: "churrasqueira",
        titulo: "Quiosques e churrasqueiras",
        texto: "São 80 quiosques e 102 churrasqueiras espalhados pelo parque, para o churrasco da família ou da turma. Reserve o seu espaço online.",
        fotos: [fQuiosque, fQuiosqueNoite, fCampQuiosqueVista, fCampNoiteBarracas, fCampAmigos],
        destaques: [
          { icone: "churrasqueira", rotulo: "102 churrasqueiras" },
          { icone: "estrela", rotulo: "80 quiosques" },
          { icone: "familia", rotulo: "Para grupos" },
        ],
        cta: { rotulo: "Reservar quiosque", tipo: "link", url: "https://reservas.saltao.com.br/reservar?produto=quiosque" },
        ctaSecundario: { rotulo: "Falar no WhatsApp", tipo: "whatsapp" },
      },
      {
        __component: "blocks.setor",
        sobretitulo: "Para as crianças",
        icone: "familia",
        titulo: "Salão kids",
        texto: "Um espaço coberto com brinquedos de bambu, escorregador e playground para as crianças brincarem com segurança.",
        fotos: [fKids, fKidsEscorregador, fKidsPlay],
        destaques: [
          { icone: "familia", rotulo: "Brinquedos de bambu" },
          { icone: "escudo", rotulo: "Área coberta" },
        ],
      },
      {
        __component: "blocks.setor",
        sobretitulo: "Sustentabilidade",
        icone: "sol",
        titulo: "Energia solar",
        texto: "Parte da energia usada no parque vem de painéis solares instalados no próprio Saltão. Texto de exemplo, a confirmar com o parque.",
        fotos: [fSolar],
        destaques: [{ icone: "sol", rotulo: "Painéis solares" }, { icone: "folha", rotulo: "Natureza preservada" }],
      },
      {
        __component: "blocks.experiencias",
        sobretitulo: "Antes de vir",
        titulo: "Planeje sua visita",
        itens: [
          { imagem: fEscala, icone: "cachoeira", titulo: "Cachoeira Saltão", texto: "A queda de 75 m e as trilhas.", link: "/cachoeira-saltao/" },
          { imagem: fCampEntardecer, icone: "cama", titulo: "Hospedagem", texto: "Apartamentos e camping.", link: "/hospedagem/" },
          { imagem: fTrilha, icone: "escudo", titulo: "Segurança", texto: "Regras e cuidados no parque.", link: "/seguranca/" },
          { imagem: fVale, icone: "mapa", titulo: "Como chegar", texto: "Rotas e distâncias.", link: "/atendimento/#como-chegar" },
        ],
      },
      {
        __component: "blocks.chamada",
        sobretitulo: "Seu dia no parque",
        titulo: "Tudo pronto para",
        tituloDestaque: "você só aproveitar.",
        texto: "Day use, quiosques e hospedagem com reserva online.",
        imagem: fQuedaLarga,
        cta: { rotulo: "Reservar", tipo: "link", url: "https://reservas.saltao.com.br/reservar" },
        ctaSecundario: { rotulo: "Falar no WhatsApp", tipo: "whatsapp" },
      },
    ],
    seo: seo("Estrutura do Saltão: restaurante, quiosques e salão kids", "Restaurante, 80 quiosques, 102 churrasqueiras, salão kids, energia solar, hospedagem e camping no Parque Saltão."),
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
    documentId: "at-central",
    locale: "pt",
    updatedAt: T,
    titulo: "Atendimento",
    slug: "atendimento",
    respostaDireta: "Fale com o Saltão pelo WhatsApp, telefone ou e-mail, veja as dúvidas mais comuns, como chegar ao parque e consulte sua reserva — tudo nesta página.",
    tipo: "central",
    sobretitulo: "Estamos por aqui",
    tituloDestaque: "a gente te ajuda a chegar.",
    fotosIntro: [fVale, fCampFamilia],
    grupos: [
      { tituloGrupo: "Ingressos e reservas", itens: [faq("Como compro o ingresso?", "Pelo botão Reservar, com pagamento por Pix ou cartão."), faq("Recebo um voucher?", "Sim, por e-mail, com QR Code para apresentar na portaria."), faq("Onde encontro o código da reserva?", "No e-mail de confirmação, logo abaixo do QR Code.")] },
      { tituloGrupo: "No parque", itens: [faq("Posso levar comida?", "Regra a confirmar com o Saltão."), faq("Tem estacionamento?", "Sim, dentro do parque (detalhes a confirmar).")] },
    ],
    secoes: [
      {
        __component: "blocks.setor",
        sobretitulo: "Localização",
        icone: "mapa",
        titulo: "Como chegar",
        texto: "O Saltão fica na Rodovia Ulisses Guimarães, km 23, em Itirapina (SP), na Serra do Itaqueri. O acesso é de carro, por estrada asfaltada até a entrada do parque.",
        fotos: [],
        linkMapa: "https://maps.google.com/?q=Saltão+Parque+de+Ecoturismo+Itirapina",
        destaques: [
          { icone: "carro", rotulo: "Acesso de carro" },
          { icone: "mapa", rotulo: "Rod. Ulisses Guimarães, km 23" },
        ],
        listaTitulo: "Distâncias (a confirmar)",
        lista: ["Brotas — a confirmar", "São Carlos — a confirmar", "São Paulo — a confirmar"],
        cta: { rotulo: "Falar com a equipe", tipo: "whatsapp" },
      },
      {
        __component: "blocks.chamada",
        sobretitulo: "Tudo certo?",
        titulo: "Agora é só escolher",
        tituloDestaque: "o seu dia no Saltão.",
        texto: "Reserve o Day Use, a hospedagem ou um quiosque direto na plataforma.",
        imagem: fPocoCeu,
        cta: { rotulo: "Reservar", tipo: "link", url: "https://reservas.saltao.com.br/" },
        ctaSecundario: { rotulo: "Falar no WhatsApp", tipo: "whatsapp" },
      },
    ],
    mostrarFormulario: true,
    textoConsentimento: p("Li e concordo com a Política de Privacidade e autorizo o uso dos meus dados para responder a este contato."),
    seo: seo("Atendimento | Saltão — contato, dúvidas e como chegar", "WhatsApp, telefone, e-mail, perguntas frequentes, como chegar e consulta de reserva do Saltão."),
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

/* ---------------- Home (layout nov/2026: hero em painel, essência, vitrine, experiências) ---------------- */
const tr = <T,>(loc: Locale, pt: T, en: T, es: T): T => (loc === "pt" ? pt : loc === "en" ? en : es);
const HERO = {
  pt: { sobre: "Itirapina (SP) · Serra do Itaqueri", titulo: "Saltão: 75 metros de cachoeira e", destaque: "natureza para desacelerar.", selo: "Cachoeira de 75 m · 3 cachoeiras vistas do Mirante das Águas", card: "Fique para dormir" },
  en: { sobre: "Itirapina, Brazil · Serra do Itaqueri", titulo: "Saltão: a 75-metre waterfall and", destaque: "nature to slow down.", selo: "75 m waterfall · 3 waterfalls seen from the Mirante das Águas", card: "Stay the night" },
  es: { sobre: "Itirapina (Brasil) · Serra do Itaqueri", titulo: "Saltão: 75 metros de cascada y", destaque: "naturaleza para bajar el ritmo.", selo: "Cascada de 75 m · 3 cascadas vistas desde el Mirante das Águas", card: "Quédate a dormir" },
};
const LINKS = {
  pt: { dayuse: "/day-use/", hosp: "/hospedagem/", aptos: "/hospedagem/#apartamentos", camping: "/hospedagem/#camping", quiosques: "/churrasqueiras-e-quiosques/", cachoeira: "/cachoeira-saltao/", restaurante: "/restaurante-saltao/", conheca: "/estrutura/", estrutura: "/estrutura/", guia: "/guia/" },
  en: { dayuse: "/en/day-pass/", hosp: "/en/lodging/", aptos: "/en/lodging/#rooms", camping: "/en/lodging/#camping", quiosques: "/en/barbecue-kiosks/", cachoeira: "/en/day-pass/", restaurante: "/en/day-pass/", conheca: "/en/day-pass/", estrutura: "/en/day-pass/", guia: "/en/lodging/" },
  es: { dayuse: "/es/pase-de-dia/", hosp: "/es/hospedaje/", aptos: "/es/hospedaje/#habitaciones", camping: "/es/hospedaje/#camping", quiosques: "/es/quinchos-y-parrillas/", cachoeira: "/es/pase-de-dia/", restaurante: "/es/pase-de-dia/", conheca: "/es/pase-de-dia/", estrutura: "/es/pase-de-dia/", guia: "/es/hospedaje/" },
};

const home = Object.fromEntries(
  locales.map((loc) => {
    const h = HERO[loc];
    const l = LINKS[loc];
    return [
      loc,
      {
        documentId: "home",
        locale: loc,
        updatedAt: T,
        hero: {
          __component: "blocks.hero" as const,
          sobretitulo: h.sobre,
          titulo: h.titulo,
          tituloDestaque: h.destaque,
          respostaDireta: L[loc].heroResp,
          imagem: img(fHeroSrc, tr(loc, fHero.alt, "Saltão's 75 m waterfall dropping down an orange rock wall, with forest on both sides and visitors at the pool", "Cascada de 75 m de Saltão cayendo por la pared de roca anaranjada, con bosque a los lados y visitantes en la poza")),
          cta: { rotulo: L[loc].reservar, tipo: "link" as const, url: "https://reservas.saltao.com.br/reservar" },
          selo: h.selo,
          cardRotulo: h.card,
          cardProdutoId: "prod-camping",
        },
        secoes: [
          {
            __component: "blocks.essencia" as const,
            sobretitulo: tr(loc, "O Saltão", "About Saltão", "El Saltão"),
            titulo: tr(loc, "Natureza de verdade para quem quer", "Real nature for those who want to", "Naturaleza de verdad para quien quiere"),
            tituloDestaque: tr(loc, "desacelerar.", "slow down.", "bajar el ritmo."),
            texto: tr(
              loc,
              "Um parque de ecoturismo na Serra do Itaqueri, com mata nativa, trilhas, poços de água limpa e energia solar. O programa é simples: cachoeira de manhã, almoço caseiro, churrasco com a turma e o pôr do sol no fim da tarde.",
              "An ecotourism park in Serra do Itaqueri, with native forest, trails, clear pools and solar power. The plan is simple: waterfall in the morning, home-style lunch, a barbecue with friends and the sunset to close the day.",
              "Un parque de ecoturismo en la Serra do Itaqueri, con bosque nativo, senderos, pozas de agua limpia y energía solar. El plan es simple: cascada por la mañana, almuerzo casero, asado con amigos y el atardecer para cerrar el día.",
            ),
            fotos: [fCachMoldura, fPorDoSolArvore, fCampVale],
            itens: [
              { icone: "sol" as const, rotulo: tr(loc, "Energia solar", "Solar power", "Energía solar") },
              { icone: "trilha" as const, rotulo: tr(loc, "Trilhas na mata", "Forest trails", "Senderos en el bosque") },
              { icone: "familia" as const, rotulo: tr(loc, "Para toda a família", "For the whole family", "Para toda la familia") },
              { icone: "escudo" as const, rotulo: tr(loc, "Segurança", "Safety", "Seguridad") },
            ],
          },
          {
            __component: "blocks.vitrine" as const,
            sobretitulo: tr(loc, "Escolha seu jeito", "Pick your way", "Elige tu forma"),
            titulo: tr(loc, "Day use, apartamentos e camping", "Day pass, rooms and camping", "Pase de día, habitaciones y camping"),
            texto: tr(
              loc,
              "Venha passar o dia ou fique para dormir no parque e aproveite a cachoeira sem pressa.",
              "Come for the day or stay the night in the park and enjoy the waterfall at your own pace.",
              "Ven a pasar el día o quédate a dormir en el parque y disfruta la cascada sin prisa.",
            ),
            atalhos: [
              { rotulo: tr(loc, "Day Use", "Day Pass", "Pase de Día"), link: l.dayuse },
              { rotulo: tr(loc, "Apartamentos", "Rooms", "Habitaciones"), link: l.aptos },
              { rotulo: "Camping", link: l.camping },
              { rotulo: tr(loc, "Churrasqueiras", "Barbecue kiosks", "Parrillas"), link: l.quiosques },
            ],
            itens: [
              { imagem: fQueda75, local: tr(loc, "Day Use", "Day Pass", "Pase de Día"), titulo: tr(loc, "Um dia inteiro na cachoeira", "A whole day at the waterfall", "Un día entero en la cascada"), texto: tr(loc, "Poço, trilhas e área de lazer. Ingresso por pessoa.", "Pools, trails and leisure areas. Tickets per person.", "Pozas, senderos y áreas de ocio. Entrada por persona."), link: l.dayuse },
              { imagem: fAptos, local: tr(loc, "Apartamentos", "Rooms", "Habitaciones"), titulo: tr(loc, "Acorde no meio da mata", "Wake up in the forest", "Despierta en el bosque"), texto: tr(loc, "Café da manhã incluso.", "Breakfast included.", "Desayuno incluido."), link: l.aptos },
              { imagem: fQuiosque, local: tr(loc, "Quiosques", "Kiosks", "Quinchos"), titulo: tr(loc, "Churrasco com a turma", "Barbecue with friends", "Asado con amigos"), texto: tr(loc, "Quiosques com churrasqueira para grupos.", "Kiosks with barbecue grills for groups.", "Quinchos con parrilla para grupos."), link: l.quiosques },
            ],
            linkTodos: { rotulo: tr(loc, "Conheça a estrutura", "Plan your day", "Planea tu día"), link: l.conheca },
          },
          {
            __component: "blocks.experiencias" as const,
            sobretitulo: tr(loc, "Além da cachoeira", "Beyond the waterfall", "Más allá de la cascada"),
            titulo: tr(loc, "Experiências para o dia todo", "Experiences for the whole day", "Experiencias para todo el día"),
            linkTodos: { rotulo: tr(loc, "Guia da Serra do Itaqueri", "See lodging", "Ver hospedaje"), link: l.guia },
            itens: [
              { imagem: fTrilha, icone: "trilha" as const, titulo: tr(loc, "Cachoeiras e trilhas", "Waterfalls and trails", "Cascadas y senderos"), texto: tr(loc, "Bambuzal, mata nativa e três quedas no Mirante das Águas.", "Bamboo groves, native forest and three falls from the Mirante das Águas.", "Bambús, bosque nativo y tres caídas desde el Mirante das Águas."), link: l.cachoeira },
              { imagem: fPorcao, icone: "talheres" as const, titulo: tr(loc, "Restaurante", "Restaurant", "Restaurante"), texto: tr(loc, "Comida caseira, porções e cerveja gelada.", "Home-style food, snacks and cold beer.", "Comida casera, porciones y cerveza fría."), link: l.restaurante },
              { imagem: fFogueira, icone: "fogueira" as const, titulo: tr(loc, "Noites de camping", "Camping nights", "Noches de camping"), texto: tr(loc, "Barraca, fogueira e céu estrelado.", "Tents, campfire and starry skies.", "Carpa, fogata y cielo estrellado."), link: l.camping },
              { imagem: fPorDoSol, icone: "sol" as const, titulo: tr(loc, "Pôr do sol", "Sunset", "Atardecer"), texto: tr(loc, "O fim de tarde mais bonito da serra.", "The most beautiful evening in the hills.", "El atardecer más lindo de la sierra."), link: l.conheca },
            ],
          },
          {
            __component: "blocks.fatos" as const,
            sobretitulo: tr(loc, "A queda", "The fall", "La caída"),
            titulo: tr(loc, "Uma cachoeira do tamanho de um prédio de 25 andares", "A waterfall as tall as a 25-storey building", "Una cascada del tamaño de un edificio de 25 pisos"),
            texto: tr(
              loc,
              "São 75 metros de queda livre sobre o paredão de rocha da Serra do Itaqueri. Do mirante, dá para ver três cachoeiras de uma vez.",
              "75 metres of free fall over the rock wall of Serra do Itaqueri. From the viewpoint you can see three waterfalls at once.",
              "75 metros de caída libre sobre la pared de roca de la Serra do Itaqueri. Desde el mirador se ven tres cascadas a la vez.",
            ),
            imagem: fEscala,
            itens: [
              { chave: tr(loc, "de queda livre", "of free fall", "de caída libre"), valor: "75 m" },
              { chave: tr(loc, "cachoeiras vistas do Mirante das Águas", "waterfalls seen from the Mirante das Águas", "cascadas vistas desde el Mirante das Águas"), valor: "3" },
              { chave: tr(loc, "quiosques", "kiosks", "quinchos"), valor: "80" },
              { chave: tr(loc, "churrasqueiras", "barbecue grills", "parrillas"), valor: "102" },
            ],
          },
          { __component: "blocks.avaliacoes" as const, titulo: tr(loc, "Quem visitou recomenda", "What visitors say", "Lo que dicen los visitantes"), avaliacaoIds: ["av-1", "av-2", "av-3", "av-4"] },
          {
            __component: "blocks.galeria" as const,
            sobretitulo: tr(loc, "Por dentro do parque", "Inside the park", "Dentro del parque"),
            titulo: tr(loc, "Água, mata e fim de tarde", "Water, forest and golden hour", "Agua, bosque y atardecer"),
            fotos: [fC2Poco, fSlack, fPocoCeu, fPalmeira, fPorDoSolLaranja],
          },
          { __component: "blocks.faq" as const, titulo: tr(loc, "Perguntas frequentes", "FAQ", "Preguntas frecuentes"), itens: [tr(loc, faq("Onde fica o Saltão?", "Na Rodovia Ulisses Guimarães, km 23, em Itirapina (SP), na Serra do Itaqueri."), faq("Where is Saltão?", "At Rodovia Ulisses Guimarães, km 23, Itirapina (São Paulo state), in Serra do Itaqueri."), faq("¿Dónde queda Saltão?", "En la Rodovia Ulisses Guimarães, km 23, Itirapina (estado de São Paulo), en la Serra do Itaqueri."))] },
          {
            __component: "blocks.chamada" as const,
            sobretitulo: tr(loc, "Sua próxima pausa", "Your next break", "Tu próxima pausa"),
            titulo: tr(loc, "A cachoeira está te esperando.", "The waterfall is waiting.", "La cascada te espera."),
            tituloDestaque: tr(loc, "Garanta sua data.", "Book your date.", "Reserva tu fecha."),
            texto: tr(
              loc,
              "Day use, apartamentos, camping e quiosques com reserva online. Escolha o dia e chegue só para aproveitar.",
              "Day pass, rooms, camping and kiosks booked online. Pick your day and just show up to enjoy it.",
              "Pase de día, habitaciones, camping y quinchos con reserva online. Elige el día y llega solo a disfrutar.",
            ),
            imagem: fQuedaLarga,
            cta: { rotulo: L[loc].reservar, tipo: "link" as const, url: "https://reservas.saltao.com.br/reservar" },
            ctaSecundario: { rotulo: tr(loc, "Falar no WhatsApp", "Chat on WhatsApp", "Hablar por WhatsApp"), tipo: "whatsapp" as const },
          },
        ],
        seo: seo(tr(loc, "Saltão — Parque de Ecoturismo | Cachoeira, Day Use e Hospedagem", "Saltão Ecotourism Park | Waterfall, Day Pass and Lodging", "Saltão Parque de Ecoturismo | Cascada, Pase de Día y Hospedaje"), L[loc].heroResp.slice(0, 150)),
      },
    ];
  }),
) as Conteudo["home"];

const guiaHome: Conteudo["guiaHome"] = {
  pt: { documentId: "guia-home", locale: "pt", updatedAt: T, titulo: "Guia da Serra do Itaqueri", sobretitulo: "Dicas da equipe", tituloDestaque: "para aproveitar a serra.", fotosIntro: [fTrilha, fCach2], respostaDireta: "Dicas, roteiros e respostas sobre cachoeiras, trilhas, camping e passeios na Serra do Itaqueri, escritos pela equipe do Saltão.", seo: seo("Guia da Serra do Itaqueri | Saltão", "Dicas e roteiros sobre cachoeiras, trilhas e camping na Serra do Itaqueri.") },
};

/* ---------------- Hospedagem em página única (landing) ---------------- */
for (const c of categoriasProduto) {
  if (c.documentId !== "cat-hosp") continue;
  const loc = c.locale;
  Object.assign(c, {
    paginaUnica: true,
    sobretitulo: tr(loc, "Durma no parque", "Stay in the park", "Duerme en el parque"),
    tituloDestaque: tr(loc, "acorde no meio da mata.", "wake up in the forest.", "despierta en el bosque."),
    fotosIntro: [fCampEntardecer, fAptosVA],
    faq: tr(
      loc,
      [faq("Preciso reservar com antecedência?", "Recomendamos reservar online, principalmente em feriados e fins de semana, para garantir a vaga."), faq("A hospedagem inclui o day use?", "Sim, quem se hospeda aproveita as áreas do day use durante a estadia (texto de exemplo)."), faq("Posso levar meu animal de estimação?", "Regras sobre animais a confirmar (texto de exemplo).")],
      [faq("Do I need to book in advance?", "We recommend booking online, especially on holidays and weekends, to secure your spot.")],
      [faq("¿Necesito reservar con anticipación?", "Recomendamos reservar en línea, sobre todo en feriados y fines de semana, para asegurar tu lugar.")],
    ),
    secoes: [
      {
        __component: "blocks.experiencias" as const,
        sobretitulo: tr(loc, "Durante a estadia", "During your stay", "Durante la estadía"),
        titulo: tr(loc, "O parque inteiro para você", "The whole park for you", "Todo el parque para ti"),
        itens: [
          { imagem: fTrilha, icone: "trilha" as const, titulo: tr(loc, "Cachoeiras e trilhas", "Waterfalls and trails", "Cascadas y senderos"), texto: tr(loc, "Comece o dia no poço da cachoeira de 75 m.", "Start the day at the 75 m waterfall pool.", "Empieza el día en la poza de la cascada de 75 m."), link: LINKS[loc].cachoeira },
          { imagem: fPorcao, icone: "talheres" as const, titulo: tr(loc, "Restaurante", "Restaurant", "Restaurante"), texto: tr(loc, "Comida caseira sem precisar sair do parque.", "Home-style food without leaving the park.", "Comida casera sin salir del parque."), link: LINKS[loc].restaurante },
          { imagem: fFogueira, icone: "fogueira" as const, titulo: tr(loc, "Noites de fogueira", "Campfire nights", "Noches de fogata"), texto: tr(loc, "Roda de conversa e céu estrelado.", "Good company under starry skies.", "Charla y cielo estrellado."), link: LINKS[loc].camping },
          { imagem: fPorDoSol, icone: "sol" as const, titulo: tr(loc, "Pôr do sol", "Sunset", "Atardecer"), texto: tr(loc, "O fim de tarde mais bonito da serra.", "The most beautiful evening in the hills.", "El atardecer más lindo de la sierra."), link: LINKS[loc].conheca },
        ],
      },
      { __component: "blocks.avaliacoes" as const, titulo: tr(loc, "Quem dormiu no parque recomenda", "What guests say", "Lo que dicen los huéspedes"), avaliacaoIds: ["av-1", "av-2", "av-3", "av-4"] },
      {
        __component: "blocks.galeria" as const,
        sobretitulo: tr(loc, "Da manhã à noite", "From morning to night", "De la mañana a la noche"),
        titulo: tr(loc, "Como é ficar no Saltão", "What staying at Saltão feels like", "Cómo es quedarse en Saltão"),
        fotos: [fCampNoite, fPocoCeu, fQuarto, fSlack, fPorDoSolLaranja],
      },
      {
        __component: "blocks.chamada" as const,
        sobretitulo: tr(loc, "Sua noite no parque", "Your night in the park", "Tu noche en el parque"),
        titulo: tr(loc, "Escolha a data e venha dormir", "Pick a date and come stay", "Elige la fecha y ven a dormir"),
        tituloDestaque: tr(loc, "perto da cachoeira.", "near the waterfall.", "cerca de la cascada."),
        texto: tr(loc, "Apartamentos e camping com reserva online.", "Rooms and camping booked online.", "Habitaciones y camping con reserva online."),
        imagem: fQuedaLarga,
        cta: { rotulo: L[loc].reservar, tipo: "link" as const, url: "https://reservas.saltao.com.br/reservar" },
        ctaSecundario: { rotulo: tr(loc, "Falar no WhatsApp", "Chat on WhatsApp", "Hablar por WhatsApp"), tipo: "whatsapp" as const },
      },
    ],
  });
}

/* ---------------- Day Use em página única (landing) ---------------- */
for (const c of categoriasProduto) {
  if (c.documentId !== "cat-dayuse") continue;
  const loc = c.locale;
  Object.assign(c, {
    paginaUnica: true,
    sobretitulo: tr(loc, "Um dia inteiro no parque", "A whole day in the park", "Un día entero en el parque"),
    tituloDestaque: tr(loc, "da cachoeira ao pôr do sol.", "from waterfall to sunset.", "de la cascada al atardecer."),
    fotosIntro: [fCach2Pan, fPorcao],
    faq: tr(
      loc,
      [faq("O que está incluso no day use?", "Acesso à cachoeira, às trilhas sinalizadas e às áreas de lazer do parque (texto de exemplo)."), faq("Preciso reservar com antecedência?", "Recomendamos reservar online, principalmente em feriados e fins de semana."), faq("Posso levar comida?", "Regras sobre alimentos e bebidas a confirmar (texto de exemplo).")],
      [faq("What is included in the day pass?", "Access to the waterfall, marked trails and the park's leisure areas (sample text).")],
      [faq("¿Qué incluye el pase de día?", "Acceso a la cascada, senderos señalizados y áreas de ocio del parque (texto de ejemplo).")],
    ),
    secoes: [
      {
        __component: "blocks.experiencias" as const,
        sobretitulo: tr(loc, "No seu dia", "During your day", "En tu día"),
        titulo: tr(loc, "O que fazer no day use", "What to do on your day pass", "Qué hacer en el pase de día"),
        itens: [
          { imagem: fEscala, icone: "cachoeira" as const, titulo: tr(loc, "Cachoeira Saltão", "Saltão Waterfall", "Cascada Saltão"), texto: tr(loc, "75 metros de queda livre sobre o paredão.", "75 metres of free fall down the rock wall.", "75 metros de caída libre sobre la pared."), link: LINKS[loc].cachoeira },
          { imagem: fTrilhaV, icone: "trilha" as const, titulo: tr(loc, "Trilha do bambuzal", "Bamboo trail", "Sendero del bambú"), texto: tr(loc, "Caminho na mata até a segunda cachoeira.", "A forest path to the second waterfall.", "Un camino en el bosque hasta la segunda cascada."), link: LINKS[loc].cachoeira },
          { imagem: fPrato, icone: "talheres" as const, titulo: tr(loc, "Almoço no restaurante", "Lunch at the restaurant", "Almuerzo en el restaurante"), texto: tr(loc, "Comida caseira sem sair do parque.", "Home-style food without leaving the park.", "Comida casera sin salir del parque."), link: LINKS[loc].restaurante },
          { imagem: fQuiosqueNoite, icone: "churrasqueira" as const, titulo: tr(loc, "Churrasco no quiosque", "Barbecue at a kiosk", "Asado en el quincho"), texto: tr(loc, "Reserve um quiosque para a turma.", "Book a kiosk for your group.", "Reserva un quincho para tu grupo."), link: LINKS[loc].estrutura },
        ],
      },
      { __component: "blocks.avaliacoes" as const, titulo: tr(loc, "Quem passou o dia recomenda", "What visitors say", "Lo que dicen los visitantes"), avaliacaoIds: ["av-1", "av-2", "av-3", "av-4"] },
      {
        __component: "blocks.galeria" as const,
        sobretitulo: tr(loc, "Seu dia no Saltão", "Your day at Saltão", "Tu día en Saltão"),
        titulo: tr(loc, "Água, mata e boa comida", "Water, forest and good food", "Agua, bosque y buena comida"),
        fotos: [fC2Poco, fQueda75, fBifeClose, fSlack, fPorDoSolLaranja],
      },
      {
        __component: "blocks.chamada" as const,
        sobretitulo: tr(loc, "Seu dia no parque", "Your day in the park", "Tu día en el parque"),
        titulo: tr(loc, "Escolha a data e garanta", "Pick your date and book", "Elige la fecha y reserva"),
        tituloDestaque: tr(loc, "seu ingresso online.", "your ticket online.", "tu entrada online."),
        texto: tr(loc, "Datas disponíveis e valores na reserva online.", "Available dates and rates when you book online.", "Fechas disponibles y precios en la reserva online."),
        imagem: fHero,
        cta: { rotulo: L[loc].reservar, tipo: "link" as const, url: "https://reservas.saltao.com.br/reservar?produto=day-use" },
        ctaSecundario: { rotulo: tr(loc, "Falar no WhatsApp", "Chat on WhatsApp", "Hablar por WhatsApp"), tipo: "whatsapp" as const },
      },
    ],
  });
}

export const fixtures: Conteudo = { global, home, guiaHome, produtos, categoriasProduto, artigos, categoriasGuia, autores, avaliacoes, institucionais, atendimento };
