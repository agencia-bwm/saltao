"""Gera content-types e componentes do Strapi 5 (apps/painel/src). Rodar de novo sobrescreve os schemas."""
import json, os, sys
ROOT = sys.argv[1]
L = {"pluginOptions": {"i18n": {"localized": True}}}
NL = {"pluginOptions": {"i18n": {"localized": False}}}

def loc(d, localized=True):
    d = dict(d); d.update(L if localized else NL); return d

def s(req=False, maxLength=None, **kw):
    d = {"type": "string"}
    if req: d["required"] = True
    if maxLength: d["maxLength"] = maxLength
    d.update(kw); return d
def text(req=False, maxLength=None):
    d = {"type": "text"}
    if req: d["required"] = True
    if maxLength: d["maxLength"] = maxLength
    return d
def comp(c, rep=False, req=False, **kw):
    d = {"type": "component", "repeatable": rep, "component": c}
    if req: d["required"] = True
    d.update(kw); return d
def rel(kind, target, **kw):
    d = {"type": "relation", "relation": kind, "target": target}; d.update(kw); return d
def media(multiple=False, req=False, types=("images",)):
    d = {"type": "media", "multiple": multiple, "allowedTypes": list(types)}
    if req: d["required"] = True
    return d
def enum(values, req=False, default=None):
    d = {"type": "enumeration", "enum": values}
    if req: d["required"] = True
    if default: d["default"] = default
    return d
BLOCKS = {"type": "blocks"}
def uid(target): return {"type": "uid", "targetField": target, "required": True}

PROD = "api::produto.produto"
# Ícones desenhados no site (components/Icone.astro). Adicionar aqui e lá juntos.
ICONES = ["folha", "sol", "cachoeira", "trilha", "familia", "escudo", "barraca", "cama", "talheres", "fogueira", "churrasqueira", "mapa", "coracao", "estrela", "chuveiro", "tomada", "carro", "cafe", "mensagem", "duvida"]

components = {
  "shared": {
    "seo": ("SEO", "search", {
      "metaTitle": s(True, 60), "metaDescription": text(True, 155), "ogImage": media(),
      "canonicalOverride": s(), "noindex": {"type": "boolean", "default": False}, "keyword": s()}),
    "faq-item": ("Pergunta frequente", "question", {"pergunta": s(True, 200), "resposta": dict(BLOCKS, required=True)}),
    "key-value": ("Chave e valor", "bulletList", {"chave": s(True, 80), "valor": s(True, 120)}),
    "list-item": ("Item de lista", "bulletList", {"texto": s(True, 200)}),
    "source-link": ("Fonte", "link", {"titulo": s(True, 200), "url": s(True, 500, regex="^https?://")}),
    "url": ("URL", "link", {"url": s(True, 500, regex="^https?://")}),
    "image-alt": ("Imagem com alt", "picture", {"imagem": media(req=True), "alt": s(True, 125), "legenda": s(maxLength=200)}),
    "cta": ("Chamada (CTA)", "cursor", {"rotulo": s(True, 40), "tipo": enum(["produto", "link", "whatsapp"], True, "link"), "produto": rel("oneToOne", PROD), "url": s(maxLength=500)}),
    "endereco": ("Endereço", "pinMap", {"rua": s(True), "numero": s(True, 20), "bairro": s(), "cidade": s(True), "uf": s(True, 2), "cep": s(True, 9)}),
    "geo": ("Coordenadas", "pinMap", {"latitude": {"type": "decimal", "required": True}, "longitude": {"type": "decimal", "required": True}}),
    "horario": ("Horário", "clock", {"dias": s(True, 30, regex="^(Mo|Tu|We|Th|Fr|Sa|Su)([-,](Mo|Tu|We|Th|Fr|Sa|Su))*$"), "abre": s(True, 5, regex="^\\d{2}:\\d{2}$"), "fecha": s(True, 5, regex="^\\d{2}:\\d{2}$")}),
    "rede-social": ("Rede social", "earth", {"rede": enum(["instagram", "facebook", "youtube", "tiktok", "tripadvisor", "google"], True), "url": s(True, 500, regex="^https://")}),
    # Item do menu principal. Com subitens vira grupo (submenu); o link do grupo é opcional.
    "menu-item": ("Item de menu", "bulletList", {"rotulo": s(True, 40), "link": s(maxLength=300), "subitens": comp("shared.menu-subitem", True, max=8)}),
    "menu-subitem": ("Subitem de menu", "bulletList", {"rotulo": s(True, 60), "link": s(True, 300)}),
    "grupo-faq": ("Grupo de perguntas", "question", {"tituloGrupo": s(True, 100), "itens": comp("shared.faq-item", True)}),
    # Home (layout nov/2026): link com rótulo, ícone + rótulo e card com foto.
    "link": ("Link com rótulo", "link", {"rotulo": s(True, 40), "link": s(True, 300)}),
    "icone-rotulo": ("Ícone com rótulo", "star", {"icone": enum(ICONES, True), "rotulo": s(True, 40)}),
    "card-foto": ("Card com foto", "picture", {"imagem": comp("shared.image-alt", req=True), "local": s(maxLength=40), "titulo": s(True, 60), "texto": s(maxLength=140), "link": s(True, 300), "icone": enum(ICONES)}),
  },
  "blocks": {
    # tituloDestaque = fim do H1, em azul claro. cardProduto = card flutuante sobre a foto (desktop).
    "hero": ("Hero", "landscape", {"sobretitulo": s(maxLength=60), "titulo": s(True, 90), "tituloDestaque": s(maxLength=60), "respostaDireta": text(True, 300), "imagem": comp("shared.image-alt", req=True), "cta": comp("shared.cta"), "selo": s(maxLength=120), "cardRotulo": s(maxLength=40), "cardProduto": rel("oneToOne", PROD)}),
    "essencia": ("Essência (mosaico + ícones)", "layer", {"sobretitulo": s(maxLength=60), "titulo": s(True, 90), "tituloDestaque": s(maxLength=40), "texto": text(True, 600), "fotos": comp("shared.image-alt", True, req=True, min=1, max=3), "itens": comp("shared.icone-rotulo", True, max=4)}),
    "vitrine": ("Vitrine (1 card grande + 2)", "apps", {"sobretitulo": s(maxLength=60), "titulo": s(True, 90), "texto": text(False, 300), "atalhos": comp("shared.link", True, max=5), "itens": comp("shared.card-foto", True, req=True, min=1, max=3), "linkTodos": comp("shared.link")}),
    "experiencias": ("Experiências (4 cards)", "grid", {"sobretitulo": s(maxLength=60), "titulo": s(True, 90), "linkTodos": comp("shared.link"), "itens": comp("shared.card-foto", True, req=True, min=1, max=4)}),
    "texto": ("Texto", "feather", {"conteudo": dict(BLOCKS, required=True)}),
    "imagem": ("Imagem", "picture", {"imagem": comp("shared.image-alt", req=True)}),
    "tabela": ("Tabela", "grid", {"titulo": s(maxLength=120), "cabecalho": {"type": "json", "required": True}, "linhas": {"type": "json", "required": True}}),
    "citacao": ("Citação", "quote", {"texto": text(True, 500), "autor": s(maxLength=120)}),
    "cta-produto": ("CTA de produto", "shoppingCart", {"produto": rel("oneToOne", PROD), "textoChamada": s(maxLength=160)}),
    "destaques-produtos": ("Destaques de produtos", "apps", {"titulo": s(maxLength=90), "produtos": rel("oneToMany", PROD)}),
    # Na home, com imagem: régua dos 75 m ao lado da foto e o 1º número em destaque.
    "fatos": ("Fatos (números)", "chartBubble", {"sobretitulo": s(maxLength=60), "titulo": s(maxLength=90), "texto": text(False, 300), "imagem": comp("shared.image-alt"), "itens": comp("shared.key-value", True)}),
    # Setor de landing (ex.: Restaurante, Quiosques, A queda de 75 m): fotos (3 no mosaico + carrossel), texto, ícones, lista e botões.
    "setor": ("Setor (landing)", "layout", {"sobretitulo": s(maxLength=60), "titulo": s(True, 90), "icone": enum(ICONES), "texto": text(True, 600), "fotos": comp("shared.image-alt", True, max=12), "linkMapa": s(maxLength=500), "destaques": comp("shared.icone-rotulo", True, max=6), "listaTitulo": s(maxLength=60), "lista": comp("shared.list-item", True), "cta": comp("shared.cta"), "ctaSecundario": comp("shared.cta")}),
    "galeria": ("Galeria (mosaico de fotos)", "picture", {"sobretitulo": s(maxLength=60), "titulo": s(True, 90), "fotos": comp("shared.image-alt", True, req=True, min=3, max=6)}),
    "chamada": ("Chamada final (foto de fundo)", "bell", {"sobretitulo": s(maxLength=60), "titulo": s(True, 90), "tituloDestaque": s(maxLength=60), "texto": text(False, 300), "imagem": comp("shared.image-alt", req=True), "cta": comp("shared.cta", req=True), "ctaSecundario": comp("shared.cta")}),
    "avaliacoes": ("Avaliações em destaque", "star", {"titulo": s(maxLength=90), "avaliacoes": rel("oneToMany", "api::avaliacao.avaliacao")}),
    "faq": ("Perguntas frequentes", "question", {"titulo": s(maxLength=90), "itens": comp("shared.faq-item", True)}),
    "video": ("Vídeo (fachada)", "play", {"url": s(True, 300, regex="^https://(www\\.)?(youtube\\.com|youtu\\.be)/"), "poster": comp("shared.image-alt", req=True), "titulo": s(maxLength=120)}),
    "mapa-estatico": ("Mapa estático", "pinMap", {"imagem": comp("shared.image-alt", req=True), "linkMaps": s(True, 500, regex="^https://")}),
  },
}

BLOCOS_HOME = ["blocks.setor", "blocks.essencia", "blocks.vitrine", "blocks.experiencias", "blocks.destaques-produtos", "blocks.fatos", "blocks.avaliacoes", "blocks.galeria", "blocks.texto", "blocks.faq", "blocks.chamada", "blocks.cta-produto", "blocks.mapa-estatico"]
BLOCOS_INST = ["blocks.setor", "blocks.experiencias", "blocks.galeria", "blocks.chamada", "blocks.avaliacoes", "blocks.texto", "blocks.imagem", "blocks.tabela", "blocks.fatos", "blocks.faq", "blocks.mapa-estatico", "blocks.video", "blocks.cta-produto"]
BLOCOS_ART = ["blocks.texto", "blocks.imagem", "blocks.tabela", "blocks.citacao", "blocks.cta-produto"]

def ct(kind, singular, plural, display, attrs, i18n=True, draft=True, desc=""):
    return {"kind": kind, "collectionName": plural.replace("-", "_"),
            "info": {"singularName": singular, "pluralName": plural, "displayName": display, "description": desc},
            "options": {"draftAndPublish": draft},
            "pluginOptions": {"i18n": {"localized": True}} if i18n else {},
            "attributes": {k: (loc(v) if i18n else v) for k, v in attrs.items()}}

def nloc(v):  # campo não traduzido dentro de tipo traduzido
    v = dict(v); v["pluginOptions"] = {"i18n": {"localized": False}}; return v

types = [
  ct("singleType", "global", "globals", "Configurações globais", {
    "nomeOficial": s(True, 120), "telefone": s(True, 30), "whatsapp": s(True, 15, regex="^\\d{12,13}$"), "whatsappMensagemPadrao": s(maxLength=200),
    "email": {"type": "email", "required": True}, "endereco": comp("shared.endereco", req=True), "geo": comp("shared.geo", req=True),
    "horarios": comp("shared.horario", True, req=True), "redesSociais": comp("shared.rede-social", True), "distancias": comp("shared.key-value", True),
    "menuPrincipal": comp("shared.menu-item", True, max=8), "rodape": BLOCKS, "resumoLlms": text(True, 1000), "seoPadrao": comp("shared.seo", req=True)},
    desc="Dados do Saltão usados em todas as páginas (NAP, horários, redes, llms.txt)."),
  ct("singleType", "home", "homes", "Home", {"hero": comp("blocks.hero", req=True), "secoes": {"type": "dynamiczone", "components": BLOCOS_HOME}, "seo": comp("shared.seo", req=True)}),
  ct("singleType", "guia-home", "guia-homes", "Guia — página inicial", {"titulo": s(True, 90), "respostaDireta": text(True, 300),
    # Abertura no padrão das landings (hero mais baixo): sobretítulo, destaque do título e até 2 fotos (sem fotos, usa as dos artigos).
    "sobretitulo": s(maxLength=60), "tituloDestaque": s(maxLength=60), "fotosIntro": comp("shared.image-alt", True, max=2), "seo": comp("shared.seo", req=True)}),
  ct("collectionType", "produto", "produtos", "Produto / pacote", {
    "titulo": s(True, 90), "slug": uid("titulo"), "categoria": rel("manyToOne", "api::categoria-produto.categoria-produto"),
    "respostaRapida": text(True, 300), "galeria": comp("shared.image-alt", True, req=True, min=1, max=12), "video": comp("blocks.video"),
    "precoAPartirDe": nloc({"type": "decimal", "required": True, "min": 0}),
    "unidadePreco": nloc(enum(["por_pessoa", "por_noite", "por_espaco_dia", "por_pessoa_noite"], True)),
    "motorProdutoId": nloc(s(True, 60, regex="^[a-z0-9-]+$")), "setorMotorId": nloc(s(maxLength=60, regex="^[a-z0-9-]*$")),
    "inclui": comp("shared.list-item", True), "naoInclui": comp("shared.list-item", True), "regras": BLOCKS,
    "capacidade": comp("shared.key-value", True), "tabelaComparativa": comp("blocks.tabela"), "faq": comp("shared.faq-item", True),
    "relacionados": rel("manyToMany", PROD), "avaliacoes": rel("manyToMany", "api::avaliacao.avaliacao"),
    "tipoSchema": nloc(enum(["Product", "TouristTrip", "LodgingBusiness", "Campground"], True, "Product")),
    "destaques": comp("shared.icone-rotulo", True, max=6), "seo": comp("shared.seo", req=True)},
    desc="Template Produto/pacote: ingresso, acomodação, espaço, combo ou campanha."),
  ct("collectionType", "categoria-produto", "categorias-produto", "Listagem de produtos", {
    "titulo": s(True, 90), "slug": uid("titulo"), "respostaDireta": text(True, 300), "introducao": BLOCKS, "imagemHero": comp("shared.image-alt", req=True),
    "ordemProdutos": rel("manyToMany", PROD),
    "faq": comp("shared.faq-item", True), "ordemMenu": nloc({"type": "integer", "default": 10, "min": 0}),
    # Página única (landing): os produtos viram seções da própria página (sem página própria) e o menu vira link direto.
    "paginaUnica": nloc({"type": "boolean", "default": False}), "sobretitulo": s(maxLength=60), "tituloDestaque": s(maxLength=60),
    "fotosIntro": comp("shared.image-alt", True, max=2), "secoes": {"type": "dynamiczone", "components": BLOCOS_HOME},
    "seo": comp("shared.seo", req=True)},
    desc="Day Use, Hospedagem e Camping, Churrasqueiras e Quiosques, Monte sua Experiência."),
  ct("collectionType", "artigo", "artigos", "Artigo do Guia", {
    "titulo": s(True, 110), "slug": uid("titulo"), "categoria": rel("manyToOne", "api::categoria-guia.categoria-guia"), "autor": rel("manyToOne", "api::autor.autor"),
    "dataPublicacao": nloc({"type": "date", "required": True}), "dataAtualizacao": nloc({"type": "date", "required": True}),
    "resumo": text(True, 300), "imagemDestaque": comp("shared.image-alt", req=True), "corpo": {"type": "dynamiczone", "components": BLOCOS_ART, "required": True},
    "faq": comp("shared.faq-item", True), "fontes": comp("shared.source-link", True), "ctaProduto": rel("oneToOne", PROD),
    "artigosRelacionados": rel("manyToMany", "api::artigo.artigo"), "seo": comp("shared.seo", req=True)},
    desc="Guia da Serra do Itaqueri."),
  ct("collectionType", "categoria-guia", "categorias-guia", "Categoria do Guia", {"nome": s(True, 60), "slug": uid("nome"), "descricao": text(False, 300), "seo": comp("shared.seo", req=True)}),
  ct("collectionType", "autor", "autores", "Autor", {"nome": s(True, 80), "slug": uid("nome"), "foto": comp("shared.image-alt", req=True), "minibio": text(True, 300), "link": s(maxLength=300), "sameAs": comp("shared.url", True)}, i18n=False),
  ct("collectionType", "avaliacao", "avaliacoes", "Avaliação", {
    "nomeAutor": s(True, 80), "nota": {"type": "integer", "required": True, "min": 1, "max": 5}, "texto": text(True, 1000), "data": {"type": "date", "required": True},
    "fonte": enum(["Google", "TripAdvisor", "Booking", "Pos_visita"], True), "urlFonte": s(maxLength=500), "produto": rel("manyToOne", PROD)}, i18n=False,
    desc="Só avaliações reais, com fonte. Exibidas no HTML; sem aggregateRating no schema global."),
  ct("collectionType", "pagina-institucional", "paginas-institucionais", "Página institucional", {
    "titulo": s(True, 90), "slug": uid("titulo"), "respostaDireta": text(True, 300),
    # Landing: abertura no estilo do hero da home (foto larga + 2ª foto), menu âncora automático pelos setores.
    "landing": nloc({"type": "boolean", "default": False}), "sobretitulo": s(maxLength=60), "tituloDestaque": s(maxLength=60), "fotosIntro": comp("shared.image-alt", True, max=2),
    "secoes": {"type": "dynamiczone", "components": BLOCOS_INST, "required": True}, "seo": comp("shared.seo", req=True)},
    desc="Conheça o Saltão, Segurança, Como chegar, Políticas."),
  ct("collectionType", "pagina-atendimento", "paginas-atendimento", "Página FAQ / Contato", {
    "titulo": s(True, 90), "slug": uid("titulo"), "respostaDireta": text(True, 300), "tipo": nloc(enum(["faq_contato", "minha_reserva", "central"], True)),
    "grupos": comp("shared.grupo-faq", True), "mostrarFormulario": nloc({"type": "boolean", "default": False}), "textoConsentimento": BLOCKS,
    # tipo "central" = landing de Atendimento (Fale conosco + Dúvidas + Minha reserva + seções, ex.: Como chegar).
    "sobretitulo": s(maxLength=60), "tituloDestaque": s(maxLength=60), "fotosIntro": comp("shared.image-alt", True, max=2), "secoes": {"type": "dynamiczone", "components": BLOCOS_INST},
    "seo": comp("shared.seo", req=True)},
    desc="Dúvidas e Contato, Minha reserva, ou a central de Atendimento (landing)."),
  ct("collectionType", "audit-log", "audit-logs", "Log de auditoria", {
    "acao": s(True, 30), "uid": s(True, 120), "documentoId": s(maxLength=60), "idioma": s(maxLength=10), "usuario": s(maxLength=200), "usuarioId": {"type": "integer"},
    "resumo": {"type": "json"}}, i18n=False, draft=False, desc="Gerado automaticamente: quem alterou o quê e quando. Somente leitura."),
]

for cat, comps in components.items():
    os.makedirs(f"{ROOT}/src/components/{cat}", exist_ok=True)
    for name, (display, icon, attrs) in comps.items():
        json.dump({"collectionName": f"components_{cat}_{name.replace('-', '_')}", "info": {"displayName": display, "icon": icon}, "options": {}, "attributes": attrs},
                  open(f"{ROOT}/src/components/{cat}/{name}.json", "w"), indent=2, ensure_ascii=False)

for t in types:
    n = t["info"]["singularName"]
    base = f"{ROOT}/src/api/{n}"
    for d in ("content-types/" + n, "controllers", "routes", "services"):
        os.makedirs(f"{base}/{d}", exist_ok=True)
    json.dump(t, open(f"{base}/content-types/{n}/schema.json", "w"), indent=2, ensure_ascii=False)
    for kind, fac in (("controllers", "createCoreController"), ("routes", "createCoreRouter"), ("services", "createCoreService")):
        open(f"{base}/{kind}/{n}.ts", "w").write(f"import {{ factories }} from '@strapi/strapi';\n\nexport default factories.{fac}('api::{n}.{n}');\n")
print("ok", len(types), sum(len(c) for c in components.values()))
