import type { Core } from '@strapi/strapi';

/**
 * Log de auditoria próprio (o do Strapi é Enterprise — decisão 5).
 * Grava quem fez o quê, quando, em qual documento e idioma, na coleção "Log de auditoria".
 */
const ACOES = new Set(['create', 'update', 'delete', 'publish', 'unpublish', 'discardDraft']);
const UID_LOG = 'api::audit-log.audit-log';

export function registrarAuditoria(strapi: Core.Strapi) {
  strapi.documents.use(async (ctx, next) => {
    const resultado = await next();
    if (!ACOES.has(ctx.action) || !ctx.uid.startsWith('api::') || ctx.uid === UID_LOG) return resultado;

    try {
      const req = strapi.requestContext.get();
      const usuario = req?.state?.user as { id?: number; email?: string; firstname?: string; lastname?: string } | undefined;
      const params = ctx.params as { documentId?: string; locale?: string; data?: Record<string, unknown> };
      const doc = (resultado as { documentId?: string } | undefined) ?? {};
      await strapi.documents(UID_LOG).create({
        data: {
          acao: ctx.action,
          uid: ctx.uid,
          documentoId: params.documentId ?? doc.documentId ?? undefined,
          idioma: params.locale ?? undefined,
          usuario: usuario ? [usuario.firstname, usuario.lastname].filter(Boolean).join(' ') + (usuario.email ? ` <${usuario.email}>` : '') : 'sistema/API',
          usuarioId: usuario?.id ?? undefined,
          // Só os nomes dos campos alterados (não o conteúdo), para o log não crescer demais.
          resumo: params.data ? { campos: Object.keys(params.data) } : undefined,
        },
      });
    } catch (erro) {
      strapi.log.warn(`[auditoria] falha ao registrar ${ctx.action} em ${ctx.uid}: ${(erro as Error).message}`);
    }
    return resultado;
  });
}
