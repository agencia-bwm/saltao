import type { Core } from '@strapi/strapi';

/** PT (padrão), EN e ES. Os códigos batem com o site (apps/site/src/lib/types.ts). */
const IDIOMAS = [
  { code: 'pt', name: 'Português (pt)', padrao: true },
  { code: 'en', name: 'English (en)', padrao: false },
  { code: 'es', name: 'Español (es)', padrao: false },
];

export async function garantirIdiomas(strapi: Core.Strapi) {
  const locales = strapi.plugin('i18n').service('locales');
  const existentes: { code: string }[] = await locales.find();
  for (const i of IDIOMAS) {
    if (!existentes.some((l) => l.code === i.code)) {
      await locales.create({ code: i.code, name: i.name });
      strapi.log.info(`[idiomas] criado ${i.code}`);
    }
  }
  const padrao = IDIOMAS.find((i) => i.padrao)!;
  if ((await locales.getDefaultLocale()) !== padrao.code) await locales.setDefaultLocale({ code: padrao.code });
}
