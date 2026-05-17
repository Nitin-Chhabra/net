'use client'
import { useEffect, useState, useCallback } from 'react'
import clsx from 'clsx'

type ToastType = 'default' | 'success' | 'info'

interface ToastState {
  message: string
  type: ToastType
  id: number
}

let _show: ((msg: string, type?: ToastType) => void) | null = null

export function toast(message: string, type: ToastType = 'default') {
  _show?.(message, type)
}

export default function Toast() {
  const [state, setState] = useState<ToastState | null>(null)
  const [visible, setVisible] = useState(false)

  const show = useCallback((message: string, type: ToastType = 'default') => {
    setVisible(false)
    setTimeout(() => {
      setState({ message, type, id: Date.now() })
      setVisible(true)
    }, 50)
  }, [])

  useEffect(() => { _show = show; return () => { _show = null } }, [show])

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setVisible(false), 2200)
    return () => clearTimeout(t)
  }, [visible, state?.id])

  if (!state) return null

  return (
    <div className={clsx(
      'fixed bottom-8 left-1/2 -translate-x-1/2 z-50',
      'bg-ghost-surface border border-white/10 rounded-xl px-5 py-2.5',
      'text-[13px] whitespace-nowrap shadow-2xl',
      'transition-all duration-300',
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      state.type === 'success' && 'text-[#6dfaaa] border-[#6dfaaa30]',
      state.type === 'info' && 'text-[#7c6dfa]',
      state.type === 'default' && 'text-ghost-muted',
    )}>
      {state.message}
    </div>
  )
}