'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import {
  Ghost,
  localGet, localAdd, localMarkSearched, localDelete, localClear,
  dbFetch, dbAdd, dbMarkSearched, dbDelete, dbClear,
} from '@/lib/ghosts'
import GhostInput from '@/components/GhostInput'
import GhostCard  from '@/components/GhostCard'
import StatsBar   from '@/components/StatsBar'
import AuthModal  from '@/components/AuthModal'
import Toast, { toast } from '@/components/Toast'

export default function Home() {
  const [ghosts,  setGhosts]  = useState<Ghost[]>([])
  const [user,    setUser]    = useState<User | null>(null)
  const [query,   setQuery]   = useState('')
  const [saving,  setSaving]  = useState(false)
  const [auth,    setAuth]    = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setGhosts(localGet())
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) dbFetch().then(setGhosts).catch(console.error)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) dbFetch().then(setGhosts).catch(console.error)
      else setGhosts(localGet())
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const t = setInterval(() => setGhosts(g => [...g]), 60000)
    return () => clearInterval(t)
  }, [])

  const addGhost = useCallback(async (text: string) => {
    setSaving(true)
    try {
      if (user) {
        const ghost = await dbAdd(text)
        setGhosts(g => [ghost, ...g])
      } else {
        setGhosts(localAdd(text))
      }
      toast('Caught ✦', 'info')
    } catch { toast('Could not save. Try again.') }
    finally { setSaving(false) }
  }, [user])

  const searchGhost = useCallback(async (id: string) => {
    const ghost = ghosts.find(g => g.id === id)
    if (!ghost) return
    window.open('https://www.google.com/search?q=' + encodeURIComponent(ghost.text), '_blank')
    try {
      if (user) { await dbMarkSearched(id); setGhosts(await dbFetch()) }
      else { setGhosts(localMarkSearched(id)) }
      toast('Searching… marked ✓', 'success')
    } catch { console.error('mark searched failed') }
  }, [ghosts, user])

  const copyGhost = useCallback(async (id: string) => {
    const ghost = ghosts.find(g => g.id === id)
    if (!ghost) return
    await navigator.clipboard.writeText(ghost.text)
    toast('Copied to clipboard', 'success')
  }, [ghosts])

  const deleteGhost = useCallback(async (id: string) => {
    try {
      if (user) { await dbDelete(id); setGhosts(g => g.filter(x => x.id !== id)) }
      else { setGhosts(localDelete(id)) }
      toast('Released')
    } catch { toast('Could not delete.') }
  }, [user, ghosts])

  const clearAll = useCallback(async () => {
    if (!confirm('Clear all catches? Cannot be undone.')) return
    try {
      if (user) { await dbClear(); setGhosts([]) }
      else { setGhosts(localClear()) }
      toast('All cleared')
    } catch { toast('Could not clear.') }
  }, [user])

  const signOut = async () => {
    await createClient().auth.signOut()
    setGhosts(localGet())
    toast('Signed out')
  }

  const filtered = query
    ? ghosts.filter(g => g.text.toLowerCase().includes(query.toLowerCase()))
    : ghosts

  if (!mounted) return null

  return (
    <div className="grain glow-top min-h-screen">
      <div className="relative z-10 max-w-xl mx-auto px-4 pt-20 pb-16">

        <header className="text-center mb-14 animate-fade-up">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <NetSVG />
            <span className="font-serif text-[26px] tracking-tight">
              <em className="text-[#7c6dfa] not-italic">Net</em>
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-ghost-dim">
            catch thoughts before they slip away
          </p>
        </header>

        <div className="flex justify-end mb-3 text-[12px] text-ghost-dim animate-fade-in">
          {user ? (
            <span className="flex items-center gap-3">
              <span className="text-[#6dfaaa]">● syncing</span>
              <button onClick={signOut} className="hover:text-ghost-muted transition">sign out</button>
            </span>
          ) : (
            <button
              onClick={() => setAuth(true)}
              className="hover:text-ghost-muted transition flex items-center gap-1"
            >
              <span className="text-[#7c6dfa]">↑</span> sign in to sync
            </button>
          )}
        </div>

        <GhostInput onSave={addGhost} loading={saving} />

        {ghosts.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3 mt-6 animate-fade-in">
              <span className="text-[10px] uppercase tracking-[0.14em] text-ghost-dim">
                {query ? `${filtered.length} of ${ghosts.length} catches` : 'your catches'}
              </span>
              <button
                onClick={clearAll}
                className="text-[11px] text-ghost-dim hover:text-[#fa6d6d] transition px-1"
              >
                clear all
              </button>
            </div>

            {ghosts.length >= 4 && (
              <div className="relative mb-3 animate-fade-in">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost-dim text-[15px]">⌕</span>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="filter catches…"
                  className="w-full bg-ghost-surface border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-ghost-text placeholder:text-ghost-dim outline-none focus:border-[#7c6dfa] transition"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              {filtered.length === 0 ? (
                <p className="text-center text-ghost-dim text-[13px] py-6">no catches match that search</p>
              ) : (
                filtered.map(g => (
                  <GhostCard
                    key={g.id}
                    ghost={g}
                    onSearch={searchGhost}
                    onCopy={copyGhost}
                    onDelete={deleteGhost}
                    highlight={query}
                  />
                ))
              )}
            </div>

            <StatsBar ghosts={ghosts} />
          </>
        )}

        {ghosts.length === 0 && (
          <div className="text-center py-12 text-ghost-dim animate-fade-in">
            <div className="text-4xl mb-3 opacity-40 grayscale">🕸️</div>
            <p className="text-[13px] leading-relaxed">
              Nothing caught yet.<br />
              Type what you were about to search and cast your net.
            </p>
          </div>
        )}

        <footer className="text-center mt-12 text-[11px] text-ghost-dim space-y-1 animate-fade-in">
          <p>Everything stays in your browser · no tracking · no ads</p>
          <p className="text-[10px] opacity-60">Browser extension coming soon</p>
          <p className="text-[10px] opacity-40 mt-3">© 2026 Nitin Chhabra · All rights reserved</p>
        </footer>
      </div>

      {auth && <AuthModal onClose={() => setAuth(false)} />}
      <Toast />
    </div>
  )
}

function NetSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none" className="drop-shadow-[0_0_8px_rgba(124,109,250,0.5)]">
      <ellipse cx="18" cy="18" rx="13" ry="13" stroke="#7c6dfa" strokeWidth="1.2" fill="rgba(124,109,250,0.08)"/>
      <line x1="5" y1="18" x2="31" y2="18" stroke="#7c6dfa" strokeWidth="0.8" opacity="0.6"/>
      <line x1="18" y1="5" x2="18" y2="31" stroke="#7c6dfa" strokeWidth="0.8" opacity="0.6"/>
      <line x1="8" y1="10" x2="28" y2="26" stroke="#7c6dfa" strokeWidth="0.6" opacity="0.4"/>
      <line x1="8" y1="26" x2="28" y2="10" stroke="#7c6dfa" strokeWidth="0.6" opacity="0.4"/>
      <circle cx="18" cy="18" r="2.5" fill="#7c6dfa" opacity="0.9"/>
    </svg>
  )
}