const BASE = 'https://entropy-api-production-81ba.up.railway.app'

interface Memory {
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

interface ApiKeyInfo {
  key_prefix: string
  is_active: boolean
  created_at: string
  rate_limit_per_hour: number
  requests_this_hour: number
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as Record<string, unknown>).detail as string || `HTTP ${res.status}`)
  }
  return res.json()
}

export class EntropyClient {
  private base: string

  constructor(baseUrl?: string) {
    this.base = baseUrl || BASE
  }

  /** Get a free API key. No authentication required. */
  async register(name?: string): Promise<string> {
    const res = await fetch(`${this.base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name || null }),
    })
    const data = await handleResponse(res) as { api_key: string }
    return data.api_key
  }

  /** Check your API key status and rate limit. */
  async keyInfo(apiKey: string): Promise<ApiKeyInfo> {
    const res = await fetch(`${this.base}/auth/info`, {
      headers: { 'X-API-Key': apiKey },
    })
    return handleResponse(res) as Promise<ApiKeyInfo>
  }

  /** Create a memory. Requires an API key. */
  async createMemory(content: string, apiKey: string, type = 'text'): Promise<Memory> {
    const res = await fetch(`${this.base}/memories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
      body: JSON.stringify({ content, memory_type: type }),
    })
    return handleResponse(res) as Promise<Memory>
  }

  /** Observe a memory — restores +5 health. Requires an API key. */
  async observe(id: string, apiKey: string): Promise<Memory> {
    const res = await fetch(`${this.base}/memories/${id}`, {
      headers: { 'X-API-Key': apiKey },
    })
    return handleResponse(res) as Promise<Memory>
  }

  /** Stabilize a memory — restores +15 health. Requires an API key. */
  async upvote(id: string, apiKey: string): Promise<Memory> {
    const res = await fetch(`${this.base}/memories/${id}/upvote`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey },
    })
    return handleResponse(res) as Promise<Memory>
  }

  /** Browse the decaying memory feed. Public — no key needed. */
  async explore(limit = 50, includeDead = false): Promise<Memory[]> {
    const res = await fetch(
      `${this.base}/explore?limit=${limit}&include_dead=${includeDead}`,
    )
    return handleResponse(res) as Promise<Memory[]>
  }

  /** View dead memories. Public — no key needed. */
  async cemetery(limit = 20): Promise<Memory[]> {
    const res = await fetch(`${this.base}/explore/cemetery?limit=${limit}`)
    return handleResponse(res) as Promise<Memory[]>
  }
}
