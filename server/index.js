// 后端服务器 - Express
// 同时提供API接口和静态文件服务
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { chat, matchJob } from './aiService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json({ limit: '1mb' }))

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// API: 聊天接口（支持流式）
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, stream } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages' })
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      const fullContent = await chat(messages, true, (chunk) => {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
      })

      res.write(`data: ${JSON.stringify({ done: true, content: '' })}\n\n`)
      res.end()
    } else {
      const content = await chat(messages, false)
      res.json({ content })
    }
  } catch (error) {
    console.error('Chat API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API: 岗位匹配接口
app.post('/api/match', async (req, res) => {
  try {
    const { jd, position } = req.body

    if (!jd || !position) {
      return res.status(400).json({ error: 'Missing jd or position' })
    }

    const result = await matchJob(jd, position)
    res.json(result)
  } catch (error) {
    console.error('Match API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasAIKey: !!(process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY),
    mode: process.env.DEEPSEEK_API_KEY ? 'deepseek' : (process.env.OPENAI_API_KEY ? 'openai' : 'mock'),
  })
})

// 生产环境：提供静态文件
const distPath = path.resolve(__dirname, '../dist')
app.use(express.static(distPath))

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   Jiajia AI Server is running!          ║
  ║   🚀 http://localhost:${PORT}               ║
  ║                                          ║
  ║   API endpoints:                         ║
  ║   POST /api/chat      - AI聊天          ║
  ║   POST /api/match     - 岗位匹配        ║
  ║   GET  /api/health    - 健康检查        ║
  ╚══════════════════════════════════════════╝
  `)
})
