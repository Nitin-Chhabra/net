'use client'
import { Ghost, timeAgo, isOld } from '@/lib/ghosts'
import clsx from 'clsx'

interface Props {
  ghost: Ghost
  onSearch: (id: string) => void
  onCopy: (id: string) => void
  onDelete: (id: string) => void
  highlight?: string
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-[#7c6dfa33] text-[#7c6dfa] rounded-sm">{part}</mark>
          : part
      )}
    </>
  )
}

export default function GhostCard({ ghost, onSearch, onCopy, onDelete, highlight: q = '' }: Props) {
  return (
    <div
      className={clsx(
        'group relative bg-ghost-surface border border-white/7 rounded-xl px-4 py-3.5',
        'flex items-start gap-3 cursor-pointer',
        'hover:border-white/12 transition-all duration-200',
        'animate-slide-in',
        isOld(ghost.ts) && 'opacity-55 hover:opacity-100'
      )}
      onClick={() => onSearch(ghost.id)}
      title="Click to search"
    >
      <div className="absolute inset-0 rounded-xl bg-[#7c6dfa08] opacity-0 group-hover:opacity-100 transition-opacity" />

      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7c6dfa] shadow-[0_0_6px_#7c6dfa] flex-shrink-0 animate-pulse2" />

      <div className="flex-1 min-w-0 relative">
        <p className="font-serif text-[17px] leading-snug text-ghost-text mb-1 break-words">
          <Highlight text={ghost.text} query={q} />
        </p>
        <div className="flex items-center gap-2.5 text-[11px] text-ghost-dim">
          <span>{timeAgo(ghost.ts)}</span>
          {ghost.searched && (
            <span className="inline-flex items-center gap-1 bg-[#6dfaaa18] text-[#6dfaaa] border border-[#6dfaaa30] rounded px-1.5 py-0.5 text-[10px]">
              ✓ searched
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 relative">
        <ActionBtn title="Search" onClick={e => { e.stopPropagation(); onSearch(ghost.id) }} accent>↗</ActionBtn>
        <ActionBtn title="Copy" onClick={e => { e.stopPropagation(); onCopy(ghost.id) }}>⎘</ActionBtn>
        <ActionBtn title="Delete" onClick={e => { e.stopPropagation(); onDelete(ghost.id) }} danger>✕</ActionBtn>
      </div>
    </div>
  )
}

function ActionBtn({ children, onClick, title, accent, danger }: {
  children: React.ReactNode
  onClick: (e: React.MouseEvent) => void
  title: string
  accent?: boolean
  danger?: boolean
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={clsx(
        'w-7 h-7 flex items-center justify-center rounded-md text-[13px]',
        'bg-ghost-surface2 border border-white/7 text-ghost-muted',
        'hover:border-white/12 transition-all active:scale-95',
        accent && 'hover:text-[#7c6dfa] hover:border-[#7c6dfa44]',
        danger && 'hover:text-[#fa6d6d] hover:border-[#fa6d6d44]',
      )}
    >
      {children}
    </button>
  )
}