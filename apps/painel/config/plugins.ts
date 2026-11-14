import type { Core } from '@strapi/strapi';

/** Upload só de imagem e PDF, com limite de tamanho (briefing seção 7). SVG bloqueado (pode carregar script). */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: { httpOnly: true },
    },
  },
  upload: {
    config: {
      sizeLimit: env.int('UPLOAD_MAX_BYTES', 15 * 1024 * 1024),
      security: {
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],
        deniedTypes: ['image/svg+xml'],
      },
      // Formatos responsivos são gerados pelo astro:assets na build do site; não duplicar no servidor.
      breakpoints: {},
      responsiveDimensions: false,
    },
  },
  i18n: {
    config: { defaultLocale: 'pt' },
  },
});

export default config;
