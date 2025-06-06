import express from 'express'
import cors from 'cors'
import { obterNoticiasFiltradas } from './noticias.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

app.get('/noticias', async (req, res) => {
  try {
    const noticias = await obterNoticiasFiltradas()
    res.json(noticias)
  } catch (error) {
    console.error('Erro ao obter notícias:', error)
    res.status(500).json({ erro: 'Erro ao buscar notícias' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})