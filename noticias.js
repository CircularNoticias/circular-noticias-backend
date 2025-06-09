import Parser from 'rss-parser';
import { palavrasChave } from './filtros.js';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure']
  }
});

const fontes = [
  'https://g1.globo.com/rss/g1/rio-de-janeiro/',
  'https://feeds.folha.uol.com.br/cotidiano/rss091.xml',
  'https://feeds.folha.uol.com.br/poder/rss091.xml',
  'https://extra.globo.com/rss.xml',
  'https://odia.ig.com.br/rss.xml'
];

export async function obterNoticiasFiltradas() {
  const todasNoticias = [];

  for (const url of fontes) {
    try {
      const feed = await parser.parseURL(url);

      for (const item of feed.items) {
        const titulo = item.title || '';
        const conteudoBruto = item.contentSnippet || '';
        const conteudo = conteudoBruto.split('\n')[0].substring(0, 150);
        const link = item.link;
        const pubDate = item.pubDate;
        const dataPublicacao = new Date(pubDate);
        const agora = new Date();
        const diffHoras = (agora - dataPublicacao) / (1000 * 60 * 60);

        if (diffHoras > 24) continue;

        const textoCompleto = `${titulo} ${conteudo}`.toLowerCase();
        const contemPalavraChave = palavrasChave.some(p =>
          textoCompleto.includes(p.toLowerCase())
        );

        if (!contemPalavraChave) continue;

        // Tentativa de extrair imagem
        let imagem = null;
        if (item.enclosure?.url) {
          imagem = item.enclosure.url;
        } else if (item['media:content']?.url) {
          imagem = item['media:content'].url;
        }

        todasNoticias.push({
          titulo,
          resumo: conteudo,
          link,
          hora: dataPublicacao.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          fonte: new URL(link).hostname.replace('www.', ''),
          data_hora: dataPublicacao.toLocaleString('pt-BR'),
          imagem
        });
      }
    } catch (erro) {
      console.error('Erro na fonte:', url, erro.message);
    }
  }

  return todasNoticias;
}
