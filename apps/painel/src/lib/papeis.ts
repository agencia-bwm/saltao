import type { Core } from '@strapi/strapi';

/**
 * Papéis do painel (briefing seção 3 + decisão 5). Roda uma vez (marcado no store do Strapi);
 * depois disso o Admin pode ajustar permissões pela interface sem que o boot as sobrescreva.
 *
 * - Admin (BWM): Super Admin do Strapi.
 * - Editor (Saltão): todo o conteúdo e preços, com publicação. Log de auditoria só leitura.
 * - Autor (blog): só artigos, sem publicar (o Editor revisa e publica). Lê produtos/categorias/autores
 *   para poder escolher as relações (CTA, categoria, autor).
 */
const VERSAO = 'papeis-v2';
const LOG = 'api::audit-log.audit-log';
const ARTIGO = 'api::artigo.artigo';
const LEITURA_AUTOR = ['api::produto.produto', 'api::categoria-guia.categoria-guia', 'api::autor.autor'];
const IDIOMAS = ['pt', 'en', 'es'];
const CM = 'plugin::content-manager.explorer';
type Acao = 'create' | 'read' | 'update' | 'delete' | 'publish';

type Perm = { action: string; subject?: string | null; properties?: Record<string, unknown>; conditions?: string[] };

export async function configurarPapeis(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'saltao' });
  if (await store.get({ key: VERSAO })) return;

  const roleService = strapi.service('admin::role');
  const permService = strapi.service('admin::permission');
  const limpar = (p: Perm & Record<string, unknown>): Perm => ({ action: p.action, subject: p.subject ?? null, properties: p.properties ?? {}, conditions: p.conditions ?? [] });

  const editor = await roleService.findOne({ code: 'strapi-editor' });
  const autor = await roleService.findOne({ code: 'strapi-author' });
  const superAdmin = await roleService.getSuperAdmin();
  if (!editor || !autor || !superAdmin) {
    strapi.log.warn('[papeis] papéis padrão do Strapi não encontrados; nada feito');
    return;
  }

  // Campos de cada tipo, tirados das permissões completas do Super Admin (inclui campos aninhados).
  const permsSuper: Perm[] = (await permService.findMany({ where: { role: { id: superAdmin.id } } })).map(limpar);
  const campos = (uid: string) => (permsSuper.find((p) => p.subject === uid && p.action === `${CM}.read`)?.properties?.fields as string[] | undefined) ?? Object.keys(strapi.contentType(uid as any).attributes);

  /** Monta permissões do Content Manager com todos os idiomas (tipos traduzidos) e campos. */
  function perms(uid: string, acoes: Acao[], conditions: string[] = []): Perm[] {
    const ct = strapi.contentType(uid as any) as any;
    const traduzido = Boolean(ct.pluginOptions?.i18n?.localized);
    const rascunho = Boolean(ct.options?.draftAndPublish);
    return acoes
      .filter((a) => a !== 'publish' || rascunho)
      .map((a) => ({
        action: `${CM}.${a}`,
        subject: uid,
        properties: { ...(['create', 'read', 'update'].includes(a) ? { fields: campos(uid) } : {}), ...(traduzido ? { locales: IDIOMAS } : {}) },
        conditions,
      }));
  }

  const tipos = Object.keys(strapi.contentTypes).filter((uid) => uid.startsWith('api::'));
  const pluginsDe = async (roleId: number) => ((await permService.findMany({ where: { role: { id: roleId } } })) as Perm[]).map(limpar).filter((p) => !p.action.startsWith(CM));

  // Editor: todo o conteúdo e preços, com publicação. Log de auditoria só leitura.
  const permsEditor = [
    ...tipos.filter((uid) => uid !== LOG).flatMap((uid) => perms(uid, ['create', 'read', 'update', 'delete', 'publish'])),
    ...perms(LOG, ['read']),
    ...(await pluginsDe(editor.id)),
  ];
  await roleService.assignPermissions(editor.id, permsEditor);
  await roleService.update({ id: editor.id }, { name: 'Editor (Saltão)', description: 'Conteúdo, preços e publicação. Sem acesso a configurações técnicas.' });

  // Autor: só os próprios artigos, sem publicar; leitura das coleções usadas nas relações.
  const permsAutor = [
    ...perms(ARTIGO, ['create', 'read', 'update', 'delete'], ['admin::is-creator']),
    ...LEITURA_AUTOR.flatMap((uid) => perms(uid, ['read'])),
    ...(await pluginsDe(autor.id)),
  ];
  await roleService.assignPermissions(autor.id, permsAutor);
  await roleService.update({ id: autor.id }, { name: 'Autor (Guia)', description: 'Escreve artigos do Guia em rascunho. O Editor revisa e publica.' });

  await store.set({ key: VERSAO, value: { em: new Date().toISOString() } });
  strapi.log.info('[papeis] Editor (Saltão) e Autor (Guia) configurados');
}
