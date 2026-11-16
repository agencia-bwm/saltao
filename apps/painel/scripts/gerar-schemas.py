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
    "cta": ("Chamada (CTA)", "cursor", {"rotulo": s(True, 40), "tipo": enum(["produto", "categoria", "pagina", "link", "whatsapp"], True, "link"), "produto": rel("oneToOne", PROD),
            "categoria": rel("oneToOne", "api::categoria-produto.categoria-produto"), "pagina": rel("oneToOne", "api::pagina-institucional.pagina-institucional"), "url": s(maxLength=500)}),
    "endereco": ("Endereço", "pinMap", {"rua": s(True), "numero": s(True, 20), "bairro": s(), "cidade": s(True), "uf": s(True, 2), "cep": s(True, 9)}),
    "geo": ("Coordenadas", "pinMap", {"latitude": {"type": "decimal", "required": True}, "longitude": {"type": "decimal", "required": True}}),
    "horario": ("Horário", "clock", {"dias": s(True, 30, regex="^(Mo|Tu|We|Th|Fr|Sa|Su)([-,](Mo|Tu|We|Th|Fr|Sa|Su))*$"), "abre": s(True, 5, regex="^\\d{2}:\\d{2}$"), "fecha": s(True, 5, regex="^\\d{2}:\\d{2}$")}),
    "rede-social": ("Rede social", "earth", {"rede": enum(["instagram", "facebook", "youtube", "tiktok", "tripadvisor", "google"], True), "url": s(True, 500, regex="^https://")}),
    # Item do menu principal. Com subitens vira grupo (submenu); o link do grupo é opcional.
    "menu-item": ("Item de menu", "bulletList", {"rotulo": s(True, 40), "link": s(maxLength=300), "subitens": comp("shared.menu-subitem", True, max=8)}),
    "menu-subitem": ("Subitem de menu", "bulletList", {"rotulo": s(True, 60), "link": s(True, 300)}),
    # Momento do bloco "Roteiro" (um dia no parque).
    "roteiro-item": ("Momento do roteiro", "clock", {"hora": s(True, 20), "titulo": s(True, 80), "texto": s(maxLength=160), "imagem": comp("shared.image-alt", req=True)}),
    "grupo-faq": ("Grupo de perguntas", "question", {"tituloGrupo": s(True, 100), "itens": comp("shared.faq-item", True)}),
  },
  "blocks": {
    # No título, *palavra* vira destaque (degradê dos arcos). Ex.: "Uma cachoeira de *75 metros* na Serra do Itaqueri".
    "hero": ("Hero", "landscape", {"sobretitulo": s(maxLength=60), "titulo": s(True, 90), "respostaDireta": text(True, 300), "imagem": comp("shared.image-alt", req=True), "cta": comp("shared.cta")}),
    "texto": ("Texto", "feather", {"conteudo": dict(BLOCKS, required=True)}),
    "imagem": ("Imagem", "picture", {"imagem": comp("shared.image-alt", req=True)}),
    "tabela": ("Tabela", "grid", {"titulo": s(maxLength=120), "cabecalho": {"type": "json", "required": True}, "linhas": {"type": "json", "required": True}}),
    "citacao": ("Citação", "quote", {"texto": text(True, 500), "autor": s(maxLength=120), "imagem": comp("shared.image-alt")}),
    "cta-produto": ("CTA de produto", "shoppingCart", {"produto": rel("oneToOne", PROD), "textoChamada": s(maxLength=160)}),
    "destaques-produtos": ("Destaques de produtos", "apps", {"titulo": s(maxLength=90), "produtos": rel("oneToMany", PROD)}),
    "fatos": ("Fatos (números)", "chartBubble", {"titulo": s(maxLength=90), "itens": comp("shared.key-value", True)}),
    "avaliacoes": ("Avaliações em destaque", "star", {"titulo": s(maxLength=90), "avaliacoes": rel("oneToMany", "api::avaliacao.avaliacao")}),
    "faq": ("Perguntas frequentes", "question", {"titulo": s(maxLength=90), "itens": comp("shared.faq-item", True)}),
    "video": ("Vídeo (fachada)", "play", {"url": s(True, 300, regex="^https://(www\\.)?(youtube\\.com|youtu\\.be)/"), "poster": comp("shared.image-alt", req=True), "titulo": s(maxLength=120)}),
    "mapa-estatico": ("Mapa estático", "pinMap", {"imagem": comp("shared.image-alt", req=True), "linkMaps": s(True, 500, regex="^https://")}),
    # Capítulo da home: seção de revista com foto grande. layout: imersivo (foto de ponta a ponta) ou foto à esquerda/direita.
    "capitulo": ("Capítulo (seção com foto grande)", "landscape", {
      "ancora": s(maxLength=40, regex="^[a-z0-9-]+$"), "sobretitulo": s(maxLength=40), "titulo": s(True, 90), "texto": text(False, 400),
      "imagem": comp("shared.image-alt", req=True), "galeria": comp("shared.image-alt", True, max=3),
      "destaque": s(maxLength=12), "destaqueLegenda": s(maxLength=60),
      "layout": enum(["imersivo", "foto_esquerda", "foto_direita"], True, "foto_esquerda"), "tema": enum(["claro", "escuro", "profundo"], True, "claro"),
      "cta": comp("shared.cta")}),
    "roteiro": ("Roteiro (um dia no parque)", "calendar", {"titulo": s(maxLength=90), "itens": comp("shared.roteiro-item", True, max=6)}),
    "chamada-final": ("Chamada final", "message", {"titulo": s(True, 90), "texto": text(False, 300), "imagem": comp("shared.image-alt", req=True), "cta": comp("shared.cta")}),
  },
}

BLOCOS_HOME = ["blocks.capitulo", "blocks.destaques-produtos", "blocks.roteiro", "blocks.citacao", "blocks.imagem", "blocks.fatos", "blocks.avaliacoes", "blocks.texto", "blocks.faq", "blocks.cta-produto", "blocks.mapa-estatico", "blocks.chamada-final"]
BLOCOS_INST = ["blocks.texto", "blocks.imagem", "blocks.tabela", "blocks.fatos", "blocks.faq", "blocks.mapa-estatico", "blocks.video", "blocks.cta-produto"]
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
  ct("singleType", "guia-home", "guia-homes", "Guia — página inicial", {"titulo": s(True, 90), "respostaDireta": text(True, 300), "seo": comp("shared.seo", req=True)}),
  ct("collectionType", "produto", "produtos", "Produto / pacote", {
    "titulo": s(True, 90), "slug": uid("titulo"), "categoria": rel("manyToOne", "api::categoria-produto.categoria-produto"),
    "respostaRapida": text(True, 300), "galeria": comp("shared.image-alt", True, req=True, min=1, max=12), "video": comp("blocks.video"),
    "precoAPartirDe": nloc({"type": "decimal", "required": True, "min": 0}),
    "unidadePreco": nloc(enum(["por_pessoa", "por_noite", "por_espaco_dia", "por_pessoa_noite"], True)),
    "motorProdutoId": nloc(s(True, 60, regex="^[a-z0-9-]+$")), "setorMotorId": nloc(s(maxLength=60, regex="^[a-z0-9-]*$")),
    "inclui": comp("shared.list-item", True), "naoInclui": comp("shared.list-item", True), "regras": BLOCKS,
    "capacidade": comp("shared.key-value", True), "tabelaComparativa": comp("blocks.tabela"), "faq": comp("shared.faq-item", True),
    "relacionados": rel("manyToMany", PROD), "avaliacoes": rel("manyToMany", "api::avaliacao.avaliacao"),
    "tipoSchema": nloc(enum(["Product", "TouristTrip", "LodgingBusiness", "Campground"], True, "Product")), "seo": comp("shared.seo", req=True)},
    desc="Template Produto/pacote: ingresso, acomodação, espaço, combo ou campanha."),
  ct("collectionType", "categoria-produto", "categorias-produto", "Listagem de produtos", {
    "titulo": s(True, 90), "slug": uid("titulo"), "respostaDireta": text(True, 300), "introducao": BLOCKS, "imagemHero": comp("shared.image-alt", req=True),
    "ordemProdutos": rel("manyToMany", PROD),
    "faq": comp("shared.faq-item", True), "ordemMenu": nloc({"type": "integer", "default": 10, "min": 0}), "seo": comp("shared.seo", req=True)},
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
    "titulo": s(True, 90), "slug": uid("titulo"), "respostaDireta": text(True, 300), "secoes": {"type": "dynamiczone", "components": BLOCOS_INST, "required": True}, "seo": comp("shared.seo", req=True)},
    desc="Conheça o Saltão, Segurança, Como chegar, Políticas."),
  ct("collectionType", "pagina-atendimento", "paginas-atendimento", "Página FAQ / Contato", {
    "titulo": s(True, 90), "slug": uid("titulo"), "respostaDireta": text(True, 300), "tipo": nloc(enum(["faq_contato", "minha_reserva"], True)),
    "grupos": comp("shared.grupo-faq", True), "mostrarFormulario": nloc({"type": "boolean", "default": False}), "textoConsentimento": BLOCKS, "seo": comp("shared.seo", req=True)},
    desc="Dúvidas e Contato, Minha reserva."),
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
