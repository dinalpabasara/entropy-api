const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

let _apiKey: string | null = null

export function setApiKey(key: string) {
  _apiKey = key
  if (typeof window !== 'undefined') {
    localStorage.setItem('entropy_api_key', key)
  }
}

export function getApiKey(): string | null {
  if (_apiKey) return _apiKey
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('entropy_api_key')
    if (stored) _apiKey = stored
    return stored
  }
  return null
}

export function clearApiKey() {
  _apiKey = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('entropy_api_key')
  }
}

async function authFetch(path: string, options: RequestInit = {}) {
  const key = getApiKey()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (key) headers['X-API-Key'] = key

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export interface Memory {
  id: string
  content: string
  original_content: string
  health_score: number
  memory_type: string
  times_observed: number
  times_upvoted: number
  created_at: string
  last_accessed_at: string
  died_at: string | null
  is_alive: boolean
  decay_preview?: string
}

export interface ApiKeyInfo {
  key_prefix: string
  is_active: boolean
  created_at: string
  rate_limit_per_hour: number
  requests_this_hour: number
}

export async function registerKey(name?: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name || null }),
  })
  if (!res.ok) throw new Error('Failed to register')
  const data = await res.json()
  return data.api_key
}

export async function getKeyInfo(): Promise<ApiKeyInfo> {
  return authFetch('/auth/info')
}

export async function createMemory(content: string, type = 'text'): Promise<Memory> {
  return authFetch('/memories', {
    method: 'POST',
    body: JSON.stringify({ content, memory_type: type }),
  })
}

export async function getMemory(id: string): Promise<Memory> {
  return authFetch(`/memories/${id}`)
}

export async function upvoteMemory(id: string): Promise<Memory> {
  return authFetch(`/memories/${id}/upvote`, { method: 'POST' })
}

export async function exploreMemories(limit = 50, includeDead = false): Promise<Memory[]> {
  const res = await fetch(
    `${API_BASE}/explore?limit=${limit}&include_dead=${includeDead}`,
  )
  if (!res.ok) throw new Error('Failed to explore')
  return res.json()
}

export async function getCemetery(limit = 20): Promise<Memory[]> {
  const res = await fetch(`${API_BASE}/explore/cemetery?limit=${limit}`)
  if (!res.ok) throw new Error('Failed to load cemetery')
  return res.json()
}
