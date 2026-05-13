export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  
    const { systemPrompt, messages } = req.body
  
    try {
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'glm-4',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
        }),
      })
  
      const data = await response.json()
  
      return res.status(200).json({
        message: data.choices?.[0]?.message?.content || '',
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: '请求失败' })
    }
  }