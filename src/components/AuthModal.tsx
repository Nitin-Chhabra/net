'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from './Toast'

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)

  const signIn = async () => {
    if (!email.trim()) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    })
    setLoading(false)
    if (error) { toast('Something went wrong. Try again.'); return }
    setSent(true)
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-ghost-surface border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 animate-fade-up"
        onClick={e => e.stopPropagation()}
      >
        {!sent ? (
          <>
            <h2 className="font-serif text-2xl mb-1">Save your catches</h2>
            <p className="text-[13px] text-ghost-muted mb-6">
              Sign in to sync across devices. No password — we email you a magic link.
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && signIn()}
              placeholder="you@example.com"
              className="w-full bg-ghost-surface2 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-ghost-text placeholder:text-ghost-dim outline-none focus:border-[#7c6dfa] transition mb-3"
              autoFocus
            />
            <button
              onClick={signIn}
              disabled={loading}
              className="w-full bg-[#7c6dfa] text-white rounded-xl py-3 text-[13px] font-mono shadow-[0_0_20px_rgba(124,109,250,0.3)] hover:bg-[#8d7ffb] transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'sending…' : 'send magic link →'}
            </button>
            <p className="text-[11px] text-ghost-dim text-center mt-4">
              No account needed · just enter your email
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">📬</div>
            <h2 className="font-serif text-2xl mb-2">Check your inbox</h2>
            <p className="text-[13px] text-ghost-muted">
              We sent a magic link to <strong className="text-ghost-text">{email}</strong>. Click it to sign in and your catches will sync automatically.
            </p>
            <button onClick={onClose} className="mt-6 text-[12px] text-ghost-dim hover:text-ghost-muted transition">
              close
            </button>
          </>
        )}
      </div>
    </div>
  )
}