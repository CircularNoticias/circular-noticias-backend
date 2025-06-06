import Parser from 'rss-parser'
import { palavrasChave } from './filtros.js'

const parser = new Parser()

const fontes = [
  'https://g1.globo.com/rss/g1/rio-de-janeiro/',
  'https://feeds.folha.uol.com.br/cotidiano/rss091.xml',
  'https://feeds.folha.uol.com.br/poder/rss091.xml'
]

export async function obterNoticiasFiltradas() {
  const todasNoticias = []

  for (const url of fontes) {
    try {
      const feed = await parser.parseURL(url)
      for (const item of feed.items) {
        const titulo = item.title || ''
        const conteudo = item.contentSnippet || ''
        const link = item.link
        const pubDate = item.pubDate

        const textoCompleto = `${titulo} ${conteudo}`.toLowerCase()

        if (palavrasChave.some(palavra => textoCompleto.includes(palavra.toLowerCase()))) {
          todasNoticias.push({
            titulo,
            resumo: conteudo,
            link,
            hora: new Date(pubDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            fonte: new URL(link).hostname.replace('www.', '')
          })
        }
      }
    } catch (erro) {
      console.error('Erro na fonte:', url, erro.message)
    }
  }

  return todasNoticias
}