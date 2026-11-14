import type { Conteudo } from "./types";
import { carregarDoStrapi, usaStrapi } from "./strapi";
import { montarIndice, type Indice } from "./routes";
import { fixtures } from "../fixtures";

let cache: Promise<Indice> | null = null;

/** Conteúdo + rotas do site. Strapi quando STRAPI_URL existe; senão, dados de exemplo. Calculado uma vez por build. */
export function indice(): Promise<Indice> {
  if (!cache) {
    const dados: Promise<Conteudo> = usaStrapi() ? carregarDoStrapi() : Promise.resolve(fixtures);
    cache = dados.then(montarIndice);
  }
  return cache;
}
