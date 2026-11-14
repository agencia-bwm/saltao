import type { Core } from '@strapi/strapi';

/** O painel nunca é indexado: X-Robots-Tag em todas as respostas e /robots.txt bloqueando tudo. */
export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  void strapi;
  return async (ctx: any, next: () => Promise<void>) => {
    if (ctx.path === '/robots.txt') {
      ctx.type = 'text/plain';
      ctx.body = 'User-agent: *\nDisallow: /\n';
      return;
    }
    await next();
    ctx.set('X-Robots-Tag', 'noindex, nofollow');
  };
};
