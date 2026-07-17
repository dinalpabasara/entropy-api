const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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

export async function createMemory(content: string, type = 'text'): Promise<Memory> {
  const res = await fetch(`${API_BASE}/memories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, memory_type: type }),
  })
  if (!res.ok) throw new Error('Failed to create memory')
  return res.json()
}

export async function getMemory(id: string): Promise<Memory> {
  const res = await fetch(`${API_BASE}/memories/${id}`)
  if (!res.ok) throw new Error('Memory not found')
  return res.json()
}

export async function upvoteMemory(id: string): Promise<Memory> {
  const res = await fetch(`${API_BASE}/memories/${id}/upvote`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to upvote')
  return res.json()
}

export async function exploreMemories(limit = 50, includeDead = false): Promise<Memory[]> {
  const res = await fetch(`${API_BASE}/explore?limit=${limit}&include_dead=${includeDead}`)
  if (!res.ok) throw new Error('Failed to explore')
  return res.json()
}

export async function getCemetery(limit = 20): Promise<Memory[]> {
  const res = await fetch(`${API_BASE}/explore/cemetery?limit=${limit}`)
  if (!res.ok) throw new Error('Failed to load cemetery')
  return res.json()
}
