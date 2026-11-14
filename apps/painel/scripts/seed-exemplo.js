/**
 * Popula um painel LOCAL vazio com conteúdo de exemplo (o mesmo dos dados de exemplo do site)
 * e cria um token de API somente leitura para a build do site.
 * Uso (com o Strapi parado):  npm run build && node scripts/seed-exemplo.js
 * NUNCA rodar em produção: os textos e preços são provisórios.
 */
const path = require('node:path');
const fs = require('node:fs');
const { createStrapi } = require('@strapi/strapi');

const IMGS = path.join(__dirname, '..', '..', 'site', 'src', 'assets', 'placeholder');
const p = (...t) => t.map((text) => ({ type: 'paragraph', children: [{ type: 'text', text }] }));
const h2 = (text) => ({ type: 'heading', level: 2, children: [{ type: 'text', text }] });
const seo = (metaTitle, metaDescription) => ({ metaTitle, metaDescription: metaDescription.slice(0, 155), noindex: false });
const faq = (pergunta, resposta) => ({ pergunta, resposta: p(resposta) });

async function main() {
  if (process.env.NODE_ENV === 'production') throw new Error('seed-exemplo não roda em produção');
  const app = await createStrapi({ appDir: path.join(__dirname, '..'), distDir: path.join(__dirname, '..', 'dist') }).load();
  const docs = (uid) => app.documents(uid);

  const midia = {};
  for (const nome of ['cachoeira', 'day-use', 'hospedagem', 'camping', 'quiosque', 'trilha']) {
    const arq = path.join(IMGS, `${nome}.jpg`);
    const [f] = await app.plugin('upload').service('upload').upload({
      data: { fileInfo: { alternativeText: nome } },
      files: { filepath: arq, originalFilename: `${nome}.jpg`, mimetype: 'image/jpeg', size: fs.statSync(arq).size },
    });
    midia[nome] = f.id;
  }
  const img = (nome, alt) => ({ imagem: midia[nome], alt });

  const pub = async (uid, data, locale = 'pt', documentId) => {
    const d = documentId
      ? await docs(uid).update({ documentId, locale, data })
      : await docs(uid).create({ data, locale });
    await docs(uid).publish({ documentId: d.documentId, locale });
    return d.documentId;
  };

  await pub('api::global.global', {
    nomeOficial: 'Saltão — Parque de Ecoturismo', telefone: '+55 19 99815-0123', whatsapp: '5519998150123', email: 'cachoeira@saltao.com.br',
    endereco: { rua: 'Rodovia Ulisses Guimarães', numero: 'Km 23', cidade: 'Itirapina', uf: 'SP', cep: '13530-000' },
    geo: { latitude: -22.25, longitude: -47.82 }, horarios: [{ dias: 'Mo-Su', abre: '08:00', fecha: '17:00' }],
    redesSociais: [{ rede: 'instagram', url: 'https://www.instagram.com/cachoeiradosaltao/' }],
    resumoLlms: 'Saltão — Parque de Ecoturismo em Itirapina (SP). Cachoeira de 75 m. (Exemplo.)',
    seoPadrao: seo('Saltão — Parque de Ecoturismo', 'Cachoeira de 75 m, day use, hospedagem e camping em Itirapina-SP.'),
  });

  const avaliacao = await docs('api::avaliacao.avaliacao').create({ data: { nomeAutor: 'Visitante de exemplo', nota: 5, texto: 'Avaliação de exemplo.', data: '2026-10-01', fonte: 'Pos_visita' } });
  await docs('api::avaliacao.avaliacao').publish({ documentId: avaliacao.documentId });

  const cat = await pub('api::categoria-produto.categoria-produto', { titulo: 'Day Use', slug: 'day-use', respostaDireta: 'Passe o dia no Saltão. A partir de R$ 60 (exemplo).', imagemHero: img('day-use', 'Day use no Saltão'), ordemMenu: 1, seo: seo('Day Use | Saltão', 'Passe o dia no Saltão com acesso à cachoeira de 75 m.') });
  await pub('api::categoria-produto.categoria-produto', { titulo: 'Day Pass', slug: 'day-pass', respostaDireta: 'Spend the day at Saltão. From R$ 60 (sample).', imagemHero: img('day-use', 'Day pass at Saltão'), ordemMenu: 1, seo: seo('Day Pass | Saltão', 'Spend the day at Saltão with access to the 75 m waterfall.') }, 'en', cat);

  const prod = await pub('api::produto.produto', {
    titulo: 'Ingresso Day Use', slug: 'ingresso-day-use', categoria: cat, respostaRapida: 'Ingresso para o dia, com acesso à cachoeira de 75 m. A partir de R$ 60 (exemplo).',
    galeria: [img('day-use', 'Day use'), img('cachoeira', 'Cachoeira')], precoAPartirDe: 60, unidadePreco: 'por_pessoa', motorProdutoId: 'day-use',
    inclui: [{ texto: 'Acesso à cachoeira' }], naoInclui: [{ texto: 'Alimentação' }], regras: p('Horário de exemplo.'), capacidade: [{ chave: 'Lotação', valor: 'a confirmar' }],
    faq: [faq('Preciso reservar?', 'Recomendamos reservar online.')], avaliacoes: [avaliacao.documentId], tipoSchema: 'Product',
    video: { url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', poster: img('cachoeira', 'Vídeo da cachoeira') },
    seo: seo('Ingresso Day Use | Saltão', 'Ingresso para passar o dia no Saltão, com acesso à cachoeira de 75 m.'),
  });
  await pub('api::produto.produto', { titulo: 'Day Pass Ticket', slug: 'day-pass-ticket', categoria: cat, respostaRapida: 'Day ticket with access to the 75 m waterfall. From R$ 60 (sample).', galeria: [img('day-use', 'Day pass')], faq: [], precoAPartirDe: 60, unidadePreco: 'por_pessoa', motorProdutoId: 'day-use', tipoSchema: 'Product', seo: seo('Day Pass Ticket | Saltão', 'Ticket to spend the day at Saltão with access to the 75 m waterfall.') }, 'en', prod);
  await pub('api::categoria-produto.categoria-produto', { ordemProdutos: [prod] }, 'pt', cat);
  await pub('api::categoria-produto.categoria-produto', { ordemProdutos: [prod] }, 'en', cat);

  await pub('api::home.home', {
    hero: { titulo: 'Saltão — Parque de Ecoturismo', respostaDireta: 'Cachoeira de 75 m, day use, hospedagem e camping em Itirapina-SP.', imagem: img('cachoeira', 'Cachoeira do Saltão'), cta: { rotulo: 'Reservar', tipo: 'produto', produto: prod } },
    secoes: [
      { __component: 'blocks.destaques-produtos', titulo: 'Experiências', produtos: [prod] },
      { __component: 'blocks.fatos', titulo: 'Em números', itens: [{ chave: 'Cachoeira', valor: '75 m' }] },
      { __component: 'blocks.avaliacoes', titulo: 'Avaliações', avaliacoes: [avaliacao.documentId] },
      { __component: 'blocks.faq', titulo: 'Perguntas', itens: [faq('Onde fica?', 'Em Itirapina-SP.')] },
    ],
    seo: seo('Saltão — Parque de Ecoturismo', 'Cachoeira de 75 m, day use, hospedagem e camping em Itirapina-SP.'),
  });
  await pub('api::home.home', { hero: { titulo: 'Saltão Ecotourism Park', respostaDireta: '75 m waterfall, day pass, lodging and camping in Itirapina, Brazil.', imagem: img('cachoeira', 'Saltão waterfall') }, secoes: [], seo: seo('Saltão Ecotourism Park', '75 m waterfall, day pass, lodging and camping in Itirapina, Brazil.') }, 'en', undefined).catch(async () => {
    const h = await docs('api::home.home').findFirst({ locale: 'pt' });
    await pub('api::home.home', { hero: { titulo: 'Saltão Ecotourism Park', respostaDireta: '75 m waterfall, day pass, lodging and camping in Itirapina, Brazil.', imagem: img('cachoeira', 'Saltão waterfall') }, secoes: [], seo: seo('Saltão Ecotourism Park', '75 m waterfall, day pass, lodging and camping in Itirapina, Brazil.') }, 'en', h.documentId);
  });

  const autor = await docs('api::autor.autor').create({ data: { nome: 'Equipe Saltão', slug: 'equipe-saltao', foto: img('trilha', 'Equipe'), minibio: 'Guias do parque.' } });
  await docs('api::autor.autor').publish({ documentId: autor.documentId });
  const cg = await pub('api::categoria-guia.categoria-guia', { nome: 'Cachoeiras', slug: 'cachoeiras', seo: seo('Cachoeiras — Guia', 'Artigos sobre cachoeiras na Serra do Itaqueri.') });
  await pub('api::guia-home.guia-home', { titulo: 'Guia da Serra do Itaqueri', respostaDireta: 'Dicas e roteiros da equipe do Saltão.', seo: seo('Guia da Serra do Itaqueri', 'Dicas e roteiros sobre a Serra do Itaqueri.') });
  await pub('api::artigo.artigo', {
    titulo: 'Cachoeiras perto de Brotas', slug: 'cachoeiras-perto-de-brotas', categoria: cg, autor: autor.documentId, dataPublicacao: '2026-11-10', dataAtualizacao: '2026-11-13',
    resumo: 'Guia prático das cachoeiras da região (exemplo).', imagemDestaque: img('cachoeira', 'Cachoeira'),
    corpo: [
      { __component: 'blocks.texto', conteudo: [h2('Resumo'), ...p('Texto de exemplo.')] },
      { __component: 'blocks.tabela', titulo: 'Distâncias', cabecalho: ['Saindo de', 'Distância'], linhas: [['Brotas', 'a confirmar']] },
      { __component: 'blocks.cta-produto', produto: prod, textoChamada: 'Reserve online.' },
    ],
    faq: [faq('É exemplo?', 'Sim.')], fontes: [{ titulo: 'Fonte', url: 'https://www.saltao.com.br/' }], ctaProduto: prod,
    seo: seo('Cachoeiras perto de Brotas | Guia', 'Guia prático das cachoeiras perto de Brotas e da Serra do Itaqueri.'),
  });

  await pub('api::pagina-institucional.pagina-institucional', {
    titulo: 'Cachoeira do Saltão', slug: 'cachoeira-saltao', respostaDireta: 'Cachoeira de 75 m em Itirapina-SP.',
    secoes: [{ __component: 'blocks.fatos', itens: [{ chave: 'Altura', valor: '75 m' }] }, { __component: 'blocks.imagem', imagem: img('cachoeira', 'Cachoeira') }, { __component: 'blocks.mapa-estatico', imagem: img('trilha', 'Mapa'), linkMaps: 'https://maps.google.com/' }],
    seo: seo('Cachoeira do Saltão | Itirapina-SP', 'Cachoeira de 75 m em Itirapina, na Serra do Itaqueri.'),
  });
  await pub('api::pagina-atendimento.pagina-atendimento', {
    titulo: 'Dúvidas e Contato', slug: 'duvidas-e-contato', respostaDireta: 'Perguntas frequentes e canais de atendimento do Saltão.', tipo: 'faq_contato',
    grupos: [{ tituloGrupo: 'Reservas', itens: [faq('Como reservo?', 'Pelo botão Reservar.')] }], mostrarFormulario: true, textoConsentimento: p('Li e concordo com a Política de Privacidade.'),
    seo: seo('Dúvidas e Contato | Saltão', 'Perguntas frequentes e canais de atendimento do Saltão.'),
  });

  // Token só leitura para a build do site (STRAPI_TOKEN).
  const tokenService = app.service('admin::api-token');
  const existente = await tokenService.getByName('build-site-local');
  if (existente) await tokenService.revoke(existente.id);
  const token = await tokenService.create({ name: 'build-site-local', type: 'read-only', lifespan: null, description: 'Build local do site (exemplo)' });
  fs.writeFileSync(path.join(__dirname, '..', '.tmp', 'token-build.txt'), token.accessKey);
  console.log('Seed concluído. Token salvo em .tmp/token-build.txt');
  await app.destroy();
}

main().catch((e) => {
  console.error(e, JSON.stringify(e.details, null, 1));
  process.exit(1);
});
