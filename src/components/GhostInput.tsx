'use client'
import { useRef, useState } from 'react'
import clsx from 'clsx'

interface Props {
  onSave: (text: string) => void
  loading?: boolean
}

export default function GhostInput({ onSave, loading }: Props) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  const save = () => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    onSave(trimmed)
    setText('')
    ref.current?.focus()
  }

  const onKey = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); save() }
    if (e.key === 'Escape') { setText(''); ref.current?.focus() }
  }

  return (
    <div className="relative bg-ghost-surface border border-white/10 rounded-2xl p-6 mb-4 animate-fade-up">
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#7c6dfa44] to-transparent" />

      <p className="text-[10px] tracking-[0.14em] uppercase text-ghost-dim mb-3 flex items-center gap-2">
        new catch
        <span className="flex-1 h-px bg-white/5" />
      </p>

      <textarea
        ref={ref}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={onKey}
        placeholder="What were you about to look up…"
        maxLength={280}
        rows={2}
        autoFocus
        className={clsx(
          'w-full bg-transparent border-none outline-none',
          'font-serif text-2xl text-ghost-text leading-snug',
          'placeholder:text-ghost-dim placeholder:italic',
          'caret-[#7c6dfa]'
        )}
      />

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <span className="text-[11px] text-ghost-dim">{text.length} / 280</span>
        <div className="flex gap-2">
          {text && (
            <button
              onClick={() => setText('')}
              className="text-xs px-4 py-2 rounded-lg border border-white/10 text-ghost-muted hover:bg-ghost-surface2 hover:text-ghost-text transition-all"
            >
              clear
            </button>
          )}
          <button
            onClick={save}
            disabled={!text.trim() || loading}
            className={clsx(
              'text-xs px-4 py-2 rounded-lg font-mono transition-all',
              text.trim() && !loading
                ? 'bg-[#7c6dfa] text-white shadow-[0_0_20px_rgba(124,109,250,0.35)] hover:bg-[#8d7ffb] hover:shadow-[0_0_28px_rgba(124,109,250,0.45)] active:scale-95'
                : 'bg-ghost-surface2 text-ghost-dim cursor-not-allowed border border-white/5'
            )}
          >
            {loading ? 'catching…' : 'cast net ↵'}
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] text-ghost-dim mt-3">
        <kbd className="bg-ghost-surface2 border border-white/10 rounded px-1.5 py-0.5 text-ghost-muted text-[10px]">⌘ Enter</kbd>
        {' '}to catch · {' '}
        <kbd className="bg-ghost-surface2 border border-white/10 rounded px-1.5 py-0.5 text-ghost-muted text-[10px]">Esc</kbd>
        {' '}to clear
      </p>
    </div>
  )
}