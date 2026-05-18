export interface Ghost {
  id: string
  text: string
  ts: number
  searched: boolean
  userId?: string
}

const LOCAL_KEY = 'net_v1'

export function localGet(): Ghost[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
  } catch {
    return []
  }
}

export function localSet(ghosts: Ghost[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCAL_KEY, JSON.stringify(ghosts))
}

export function localAdd(text: string): Ghost[] {
  const ghost: Ghost = { id: crypto.randomUUID(), text, ts: Date.now(), searched: false }
  const ghosts = [ghost, ...localGet()]
  localSet(ghosts)
  return ghosts
}

export function localMarkSearched(id: string): Ghost[] {
  const ghosts = localGet().map(g => g.id === id ? { ...g, searched: true } : g)
  localSet(ghosts)
  return ghosts
}

export function localDelete(id: string): Ghost[] {
  const ghosts = localGet().filter(g => g.id !== id)
  localSet(ghosts)
  return ghosts
}

export function localClear(): Ghost[] {
  localSet([])
  return []
}

import { createClient } from './supabase'

export async function dbFetch(): Promise<Ghost[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ghosts')
    .select('*')
    .order('ts', { ascending: false })
  if (error) throw error
  return (data ?? []) as Ghost[]
}

export async function dbAdd(text: string): Promise<Ghost> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')
  const ghost = { id: crypto.randomUUID(), text, ts: Date.now(), searched: false, user_id: user.id }
  const { data, error } = await supabase.from('ghosts').insert(ghost).select().single()
  if (error) throw error
  return data as Ghost
}
export async function dbMarkSearched(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('ghosts').update({ searched: true }).eq('id', id)
  if (error) throw error
}

export async function dbDelete(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('ghosts').delete().eq('id', id)
  if (error) throw error
}

export async function dbClear(): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await createClient().auth.getUser()
  if (!user) return
  const { error } = await supabase.from('ghosts').delete().eq('user_id', user.id)
  if (error) throw error
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

export function isOld(ts: number): boolean {
  return Date.now() - ts > 24 * 60 * 60 * 1000
}

export function isToday(ts: number): boolean {
  return new Date(ts).toDateString() === new Date().toDateString()
}