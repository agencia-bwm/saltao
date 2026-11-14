interface ImportMetaEnv {
  readonly STRAPI_URL?: string;
  readonly STRAPI_TOKEN?: string;
  readonly SITE_URL?: string;
  readonly PUBLIC_RESERVAS_URL?: string;
  readonly PUBLIC_GTM_ID?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
