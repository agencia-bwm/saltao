import type { Core } from '@strapi/strapi';

/**
 * Publicar no painel → rebuild do site (decisão 1).
 * O webhook nativo do Strapi não serve: o repository_dispatch do GitHub exige o corpo {"event_type": ...}.
 * Aqui chamamos a API do GitHub direto, esperando REBUILD_DEBOUNCE_MS (padrão 60 s) para juntar
 * várias publicações seguidas numa build só.
 *
 * Variáveis de ambiente: GITHUB_REPO (ex.: agencia-bwm/saltao), GITHUB_DISPATCH_TOKEN (fine-grained,
 * permissão "Contents: read & write" só nesse repositório), REBUILD_DEBOUNCE_MS (opcional).
 */
const ACOES = new Set(['publish', 'unpublish', 'delete']);
const IGNORAR = new Set(['api::audit-log.audit-log']);

export function registrarRebuild(strapi: Core.Strapi) {
  let timer: NodeJS.Timeout | null = null;
  const pendentes = new Set<string>();

  async function disparar() {
    timer = null;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_DISPATCH_TOKEN;
    const motivos = [...pendentes];
    pendentes.clear();
    if (!repo || !token) {
      strapi.log.info(`[rebuild] GITHUB_REPO/GITHUB_DISPATCH_TOKEN ausentes — rebuild não disparado (${motivos.join(', ')})`);
      return;
    }
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_type: 'strapi_publish', client_payload: { motivos: motivos.slice(0, 20) } }),
      });
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      strapi.log.info(`[rebuild] disparado no GitHub (${motivos.length} alterações)`);
    } catch (erro) {
      strapi.log.error(`[rebuild] falhou: ${(erro as Error).message}`);
    }
  }

  strapi.documents.use(async (ctx, next) => {
    const resultado = await next();
    if (ACOES.has(ctx.action) && ctx.uid.startsWith('api::') && !IGNORAR.has(ctx.uid)) {
      pendentes.add(`${ctx.action}:${ctx.uid}`);
      if (timer) clearTimeout(timer);
      timer = setTimeout(disparar, Number(process.env.REBUILD_DEBOUNCE_MS ?? 60_000));
    }
    return resultado;
  });
}
