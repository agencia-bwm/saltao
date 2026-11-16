import type { ImageMetadata } from "astro";
import type { Img } from "./types";

/** Medidas usadas pelo <Picture> de Foto.astro — compartilhadas com o preload do hero para gerar as mesmas URLs. */
export function medidas(img: Img, larguras: number[], proporcao?: number) {
  const remota = typeof img.src === "string";
  const larguraOriginal = remota ? (img.width ?? 1600) : (img.src as ImageMetadata).width;
  const alturaOriginal = remota ? (img.height ?? 1000) : (img.src as ImageMetadata).height;
  const width = Math.min(1600, larguraOriginal);
  const height = proporcao ? Math.round(width / proporcao) : Math.round((alturaOriginal / larguraOriginal) * width);
  const ws = larguras.filter((w) => w <= larguraOriginal);
  return { width, height, widths: ws.length ? ws : [width] };
}

/** Qualidade: a imagem LCP (hero) sai mais leve; o resto é lazy. */
export const QUALIDADE = { prioridade: 35, normal: 50 } as const;
