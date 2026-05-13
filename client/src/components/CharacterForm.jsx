import { useState } from 'react'

const defaultForm = {
  name: '',
  role: '',
  personality: '',
  tone: '温柔、真诚',
  boundaries: '',
}

export default function CharacterForm({ onSubmit }) {
  const [form, setForm] = useState(defaultForm)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSubmit({ ...form })
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 py-12">
      <header className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
          Social emotional bot
        </p>
        <h1 className="font-sans text-2xl font-medium tracking-tight text-stone-800">
          设定你的对话角色
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          填写角色信息后提交，即可开始一段清新舒缓的对话体验。
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col gap-5 rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] backdrop-blur-md"
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-400">
            称呼 / 名称 <span className="text-rose-400">*</span>
          </span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="例如：小暖"
            required
            className="w-full rounded-2xl border border-stone-200/90 bg-white/90 px-4 py-3 text-[15px] text-stone-800 outline-none ring-rose-200/50 transition placeholder:text-stone-300 focus:border-rose-200 focus:ring-2"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-400">
            身份 / 角色
          </span>
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="例如：倾听型好友、正念陪伴者"
            className="w-full rounded-2xl border border-stone-200/90 bg-white/90 px-4 py-3 text-[15px] outline-none ring-rose-200/50 transition placeholder:text-stone-300 focus:border-rose-200 focus:ring-2"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-400">
            性格特点
          </span>
          <textarea
            name="personality"
            value={form.personality}
            onChange={handleChange}
            rows={3}
            placeholder="例如：耐心、不说教、多用短句"
            className="w-full resize-none rounded-2xl border border-stone-200/90 bg-white/90 px-4 py-3 text-[15px] outline-none ring-rose-200/50 transition placeholder:text-stone-300 focus:border-rose-200 focus:ring-2"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-400">
            对话语气
          </span>
          <input
            name="tone"
            value={form.tone}
            onChange={handleChange}
            placeholder="温柔、真诚…"
            className="w-full rounded-2xl border border-stone-200/90 bg-white/90 px-4 py-3 text-[15px] outline-none ring-rose-200/50 transition placeholder:text-stone-300 focus:border-rose-200 focus:ring-2"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-400">
            边界 / 禁忌（可选）
          </span>
          <textarea
            name="boundaries"
            value={form.boundaries}
            onChange={handleChange}
            rows={2}
            placeholder="不希望涉及的话题或表述方式"
            className="w-full resize-none rounded-2xl border border-stone-200/90 bg-white/90 px-4 py-3 text-[15px] outline-none ring-rose-200/50 transition placeholder:text-stone-300 focus:border-rose-200 focus:ring-2"
          />
        </label>

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-stone-900 py-3.5 text-sm font-medium tracking-wide text-white shadow-lg shadow-stone-900/15 transition hover:bg-stone-800 active:scale-[0.99]"
        >
          开始对话
        </button>
      </form>
    </div>
  )
}
