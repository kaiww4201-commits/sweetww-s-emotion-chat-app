import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import OpenAI from 'openai'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(cors({ origin: true }))
app.use(express.json({ limit: '1mb' }))

const apiKey = process.env.OPENAI_API_KEY
const openai = apiKey ? new OpenAI({ 
  apiKey,
  baseURL: "https://open.bigmodel.cn/api/paas/v4/"
}) : null

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: Boolean(apiKey) })
})

app.post('/api/chat', async (req, res) => {
  if (!openai) {
    res.status(503).json({
      error:
        '未配置 OPENAI_API_KEY。请在 server/.env 中设置（可参考 server/env.example）。',
    })
    return
  }

  const { systemPrompt, messages } = req.body || {}

  if (!systemPrompt || typeof systemPrompt !== 'string') {
    res.status(400).json({ error: '缺少 systemPrompt' })
    return
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages 须为非空数组' })
    return
  }

  const model = "glm-4"

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    })

    const text = completion.choices[0]?.message?.content ?? ''
    res.json({ message: text })
  } catch (err) {
    console.error("🔥 AI报错:", err)
    const msg =
      err instanceof Error ? err.message : 'OpenAI 请求失败'
    res.status(500).json({ error: msg })
  }
})

app.listen(port, () => {
  console.log(`API http://localhost:${port}`)
})
