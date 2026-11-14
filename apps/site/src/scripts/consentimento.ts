/**
 * Banner LGPD (vanilla-cookieconsent) + Google Consent Mode v2.
 * O "consent default = denied" já rodou inline no <head> (ConsentDefault.astro), antes de qualquer tag.
 * Aqui: mostra o banner, aplica o "consent update" e carrega o GTM só depois da escolha do visitante.
 */
import * as CookieConsent from "vanilla-cookieconsent";
// CSS do banner carregado só junto com ele (não entra no CSS inline das páginas).
import cssBanner from "vanilla-cookieconsent/dist/cookieconsent.css?url";
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = cssBanner;
document.head.appendChild(link);

type Gtag = (...args: unknown[]) => void;
const w = window as unknown as { dataLayer: unknown[]; gtag?: Gtag };
w.dataLayer = w.dataLayer || [];
const gtag: Gtag = w.gtag ?? ((...args: unknown[]) => w.dataLayer.push(args));

const html = document.documentElement;
const GTM_ID = html.dataset.gtm ?? "";
const PRIVACIDADE = html.dataset.privacidade ?? "/politica-de-privacidade/";
const idioma = (html.lang || "pt").slice(0, 2) as "pt" | "en" | "es";

let gtmCarregado = false;
function carregarGtm() {
  if (gtmCarregado || !/^GTM-[A-Z0-9]+$/.test(GTM_ID)) return;
  gtmCarregado = true;
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

function aplicar() {
  const analise = CookieConsent.acceptedCategory("analytics");
  const marketing = CookieConsent.acceptedCategory("marketing");
  gtag("consent", "update", {
    analytics_storage: analise ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });
  w.dataLayer.push({ event: "consent_update", consent_analytics: analise, consent_marketing: marketing });
  // Consent Mode avançado: o GTM entra após qualquer escolha. Tags de marketing (Pixel, Clarity)
  // têm gatilho próprio no GTM e só disparam com a categoria aceita.
  carregarGtm();
}

const textos = {
  pt: {
    titulo: "Cookies e privacidade",
    desc: `Usamos cookies necessários para o site funcionar e, com sua permissão, cookies de análise e de marketing para medir visitas e melhorar anúncios. <a href="${PRIVACIDADE}">Política de Privacidade</a>.`,
    aceitar: "Aceitar todos",
    recusar: "Recusar",
    personalizar: "Personalizar",
    salvar: "Salvar preferências",
    fechar: "Fechar",
    prefs: "Preferências de cookies",
    nec: ["Necessários", "Essenciais para o site e a reserva funcionarem. Sempre ativos."],
    ana: ["Análise", "Medem visitas e o uso do site (Google Analytics, Microsoft Clarity)."],
    mkt: ["Marketing", "Medem resultados de anúncios e permitem anúncios relevantes (Google Ads, Meta)."],
  },
  en: {
    titulo: "Cookies and privacy",
    desc: `We use necessary cookies to run the site and, with your permission, analytics and marketing cookies to measure visits and improve ads. <a href="${PRIVACIDADE}">Privacy Policy</a>.`,
    aceitar: "Accept all",
    recusar: "Reject",
    personalizar: "Customize",
    salvar: "Save preferences",
    fechar: "Close",
    prefs: "Cookie preferences",
    nec: ["Necessary", "Required for the site and bookings to work. Always on."],
    ana: ["Analytics", "Measure visits and site usage (Google Analytics, Microsoft Clarity)."],
    mkt: ["Marketing", "Measure ad results and allow relevant ads (Google Ads, Meta)."],
  },
  es: {
    titulo: "Cookies y privacidad",
    desc: `Usamos cookies necesarias para que el sitio funcione y, con tu permiso, cookies de análisis y marketing para medir visitas y mejorar anuncios. <a href="${PRIVACIDADE}">Política de Privacidad</a>.`,
    aceitar: "Aceptar todas",
    recusar: "Rechazar",
    personalizar: "Personalizar",
    salvar: "Guardar preferencias",
    fechar: "Cerrar",
    prefs: "Preferencias de cookies",
    nec: ["Necesarias", "Imprescindibles para que el sitio y las reservas funcionen. Siempre activas."],
    ana: ["Análisis", "Miden visitas y el uso del sitio (Google Analytics, Microsoft Clarity)."],
    mkt: ["Marketing", "Miden resultados de anuncios y permiten anuncios relevantes (Google Ads, Meta)."],
  },
};
const tr = (l: keyof typeof textos) => {
  const x = textos[l];
  return {
    consentModal: { title: x.titulo, description: x.desc, acceptAllBtn: x.aceitar, acceptNecessaryBtn: x.recusar, showPreferencesBtn: x.personalizar },
    preferencesModal: {
      title: x.prefs,
      acceptAllBtn: x.aceitar,
      acceptNecessaryBtn: x.recusar,
      savePreferencesBtn: x.salvar,
      closeIconLabel: x.fechar,
      sections: [
        { title: x.nec[0], description: x.nec[1], linkedCategory: "necessary" },
        { title: x.ana[0], description: x.ana[1], linkedCategory: "analytics" },
        { title: x.mkt[0], description: x.mkt[1], linkedCategory: "marketing" },
      ],
    },
  };
};

void CookieConsent.run({
  revision: 1,
  cookie: { name: "saltao_consent", expiresAfterDays: 182, sameSite: "Lax" },
  guiOptions: {
    // Aceitar, Recusar e Personalizar com o mesmo destaque (exigência do briefing/LGPD)
    consentModal: { layout: "box", position: "bottom left", equalWeightButtons: true, flipButtons: false },
    preferencesModal: { layout: "box", equalWeightButtons: true },
  },
  categories: {
    necessary: { enabled: true, readOnly: true },
    analytics: {},
    marketing: {},
  },
  language: { default: idioma, translations: { pt: tr("pt"), en: tr("en"), es: tr("es") } },
  onConsent: aplicar,
  onChange: aplicar,
});
