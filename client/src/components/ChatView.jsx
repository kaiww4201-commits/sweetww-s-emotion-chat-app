import { useCallback, useEffect, useRef, useState } from 'react'

function buildSystemPrompt(character) {
  const parts = [
    '你是一位社交情感陪伴机器人，根据用户设定的角色进行回应。',
    `你的称呼：${character.name}`,
    character.role && `身份设定：${character.role}`,
    character.personality && `性格：${character.personality}`,
    `语气风格：${character.tone}`,
    character.boundaries && `请避免：${character.boundaries}`,
    '回复简洁有温度，适当换行，避免长篇说教。若用户情绪低落，先共情再轻柔引导。',
  ].filter(Boolean)
  return parts.join('\n')
}

export default function ChatView({ character, onBack }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const nextThread = [...messages, userMsg]
    setInput('')
    setError(null)
    setMessages(nextThread)
    setLoading(true)

    try {
      const apiMessages = nextThread.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('https://heartfelt-fascination-production-61a3.up.railway.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: buildSystemPrompt(character),
          messages: apiMessages,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || `请求失败 (${res.status})`)
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message },
      ])
    } catch (e) {
      setError(e.message || '发送失败')
      setMessages((prev) => prev.slice(0, -1))
      setInput(text)
    } finally {
      setLoading(false)
    }
  }, [character, input, loading, messages])

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-6">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-stone-200/60 bg-gradient-to-br from-stone-50/95 via-rose-50/50 to-amber-50/40 py-4 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200/80 bg-white/80 text-stone-600 shadow-sm transition hover:bg-white"
          aria-label="返回设定"
        >
          ←
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-medium text-stone-800">{character.name}</h1>
          <p className="truncate text-xs text-stone-400">
            {character.role || '陪伴对话'} · {character.tone}
          </p>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto py-6">
        {messages.length === 0 && (
          <p className="mx-auto max-w-[85%] rounded-3xl border border-dashed border-stone-200/80 bg-white/50 px-5 py-8 text-center text-sm leading-relaxed text-stone-400">
            打个招呼吧，我会按你的角色设定来回应 ✦
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                m.role === 'user'
                  ? 'rounded-br-md bg-stone-900 text-white'
                  : 'rounded-bl-md border border-stone-100 bg-white/90 text-stone-700'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-3xl rounded-bl-md border border-stone-100 bg-white/90 px-4 py-3 text-sm text-stone-400">
              …
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="mb-2 text-center text-xs text-rose-500">{error}</p>
      )}

      <div className="sticky bottom-0 border-t border-stone-200/50 bg-gradient-to-t from-stone-50/95 to-transparent pb-4 pt-3">
        <div className="flex gap-2 rounded-[28px] border border-stone-200/80 bg-white/90 p-1.5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="输入消息…"
            disabled={loading}
            className="min-h-11 flex-1 rounded-full bg-transparent px-4 text-[15px] outline-none placeholder:text-stone-300 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition enabled:hover:bg-stone-800 disabled:opacity-40"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}
