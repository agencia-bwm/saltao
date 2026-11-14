import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET')!,
    // Sessão do painel: cookie HttpOnly/Secure, expira em 8 h de inatividade e 7 dias no máximo.
    sessions: {
      accessTokenLifespan: env.int('ADMIN_ACCESS_TTL', 30 * 60),
      maxRefreshTokenLifespan: env.int('ADMIN_REFRESH_MAX_TTL', 7 * 24 * 60 * 60),
      idleRefreshTokenLifespan: env.int('ADMIN_REFRESH_IDLE_TTL', 8 * 60 * 60),
    },
    cookie: { secure: env.bool('ADMIN_COOKIE_SECURE', env('NODE_ENV') === 'production'), sameSite: 'strict' },
  },
  // Limite de tentativas de login no painel.
  rateLimit: { enabled: true, interval: 5 * 60 * 1000, max: 5 },
  apiToken: { salt: env('API_TOKEN_SALT')! },
  transfer: { token: { salt: env('TRANSFER_TOKEN_SALT')! } },
  secrets: { encryptionKey: env('ENCRYPTION_KEY')! },
  url: env('ADMIN_URL', '/admin'),
  flags: { nps: false, promoteEE: false, docLinks: false },
});

export default config;
