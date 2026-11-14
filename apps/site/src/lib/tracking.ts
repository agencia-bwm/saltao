import type { CategoriaProduto, Produto } from "./types";

/** Item no padrão GA4 e-commerce. O item_id é o ID do produto no motor (o mesmo usado no purchase). */
export function itemGa4(p: Produto, cat?: CategoriaProduto, index?: number) {
  return {
    item_id: p.motorProdutoId,
    item_name: p.titulo,
    item_category: cat?.titulo,
    price: p.precoAPartirDe,
    index,
  };
}

/** Atributo data-dl: evento enviado ao dataLayer no clique (lido por scripts/rastreamento.ts). */
export const dl = (evento: Record<string, unknown>) => JSON.stringify(evento);
