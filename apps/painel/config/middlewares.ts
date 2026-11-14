import type { Core } from '@strapi/strapi';

/** CORS só para os domínios do site; o resto segue o padrão seguro do Strapi. */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: env.array('CORS_ORIGINS', ['https://www.saltao.com.br', 'https://painel.saltao.com.br', 'http://localhost:4321', 'http://localhost:1337']),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::noindex',
];

export default config;
