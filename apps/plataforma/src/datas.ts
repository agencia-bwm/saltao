/** Datas como "AAAA-MM-DD" (sem fuso). */
const RE = /^\d{4}-\d{2}-\d{2}$/;

export function validarData(d: string): string {
  if (!RE.test(d) || Number.isNaN(Date.parse(`${d}T00:00:00Z`))) throw new Error(`Data inválida: ${d}`);
  return d;
}

export function somarDias(d: string, n: number): string {
  const t = new Date(`${d}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
}

/** Dias de `inicio` (inclusivo) até `fim` (exclusivo). */
export function diasEntre(inicio: string, fim: string): string[] {
  const out: string[] = [];
  for (let d = inicio; d < fim; d = somarDias(d, 1)) out.push(d);
  return out;
}

/** Dia da semana ISO: 1 = segunda ... 7 = domingo. */
export function diaSemanaIso(d: string): number {
  const w = new Date(`${d}T00:00:00Z`).getUTCDay();
  return w === 0 ? 7 : w;
}
