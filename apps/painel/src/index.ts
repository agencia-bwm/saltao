import type { Core } from '@strapi/strapi';
import { registrarAuditoria } from './lib/auditoria';
import { registrarRebuild } from './lib/rebuild';
import { garantirIdiomas } from './lib/idiomas';
import { configurarPapeis } from './lib/papeis';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Middlewares do Document Service: rodam em toda criação/edição/publicação, do painel ou da API.
    registrarAuditoria(strapi);
    registrarRebuild(strapi);
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await garantirIdiomas(strapi);
    await configurarPapeis(strapi);
  },
};
