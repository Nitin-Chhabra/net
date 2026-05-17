import { Ghost, isToday } from '@/lib/ghosts'

export default function StatsBar({ ghosts }: { ghosts: Ghost[] }) {
  const total    = ghosts.length
  const searched = ghosts.filter(g => g.searched).length
  const today    = ghosts.filter(g => isToday(g.ts)).length

  return (
    <div className="flex justify-center gap-8 mt-10 pt-5 border-t border-white/5 animate-fade-in">
      {[
        { label: 'caught',    value: total },
        { label: 'searched',  value: searched },
        { label: 'today',     value: today },
      ].map(s => (
        <div key={s.label} className="text-center">
          <div className="font-serif italic text-2xl text-[#7c6dfa]">{s.value}</div>
          <div className="text-[10px] text-ghost-dim uppercase tracking-widest mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}