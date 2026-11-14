import type { APIRoute } from "astro";
import { indice } from "../lib/cms";
import { absoluta } from "../lib/config";
import { formatPreco, t } from "../lib/i18n";

/** /llms.txt: resumo do Saltão + páginas-chave, em Markdown (padrão llmstxt.org). Gerado na build a partir do painel. */
export const GET: APIRoute = async () => {
  const idx = await indice();
  const c = idx.conteudo;
  const g = c.global.pt;
  const ui = t("pt");
  const linha = (titulo: string, path: string, desc: string) => `- [${titulo}](${absoluta(path)}): ${desc}`;

  const prods = c.produtos
    .filter((p) => p.locale === "pt")
    .map((p) => linha(p.titulo, idx.link("produto", p.documentId, "pt")!, `${p.respostaRapida} (${ui.aPartirDe} ${formatPreco(p.precoAPartirDe, "pt")} ${ui.unidade[p.unidadePreco]})`));
  const cats = c.categoriasProduto.filter((x) => x.locale === "pt").map((x) => linha(x.titulo, idx.link("categoria-produto", x.documentId, "pt")!, x.respostaDireta));
  const inst = [...c.institucionais, ...c.atendimento].filter((x) => x.locale === "pt").map((x) => linha(x.titulo, idx.link("tipo" in x ? "atendimento" : "institucional", x.documentId, "pt") ?? "/", x.respostaDireta));
  const arts = c.artigos.filter((a) => a.locale === "pt").map((a) => linha(a.titulo, idx.link("artigo", a.documentId, "pt")!, a.resumo));
  const outros = (["en", "es"] as const).filter((l) => c.home[l]).map((l) => `- [${l === "en" ? "English" : "Español"}](${absoluta(`/${l}/`)})`);

  const md = [
    `# ${g?.nomeOficial ?? "Saltão"}`,
    "",
    `> ${g?.resumoLlms ?? ""}`,
    "",
    g ? `Endereço: ${g.endereco.rua}, ${g.endereco.numero} — ${g.endereco.cidade}/${g.endereco.uf}. Telefone: ${g.telefone}. WhatsApp: +${g.whatsapp}.` : "",
    "",
    "## Experiências", ...cats, "",
    "## Ingressos, hospedagem e espaços", ...prods, "",
    "## Informações", ...inst, "",
    "## Guia da Serra do Itaqueri", ...arts, "",
    ...(outros.length ? ["## Outros idiomas", ...outros, ""] : []),
  ].join("\n");
  return new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
};
