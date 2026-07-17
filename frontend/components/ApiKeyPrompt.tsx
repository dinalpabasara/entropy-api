'use client'

import { useState, useEffect } from 'react'
import { getApiKey, setApiKey, clearApiKey, registerKey, getKeyInfo } from '@/lib/api'

interface Props {
  onReady: () => void
}

export default function ApiKeyPrompt({ onReady }: Props) {
  const [hasKey, setHasKey] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [mode, setMode] = useState<'check' | 'enter' | 'register' | 'ready'>('check')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newKey, setNewKey] = useState('')

  useEffect(() => {
    const existing = getApiKey()
    if (existing) {
      setMode('ready')
      setHasKey(true)
      onReady()
    } else {
      setMode('enter')
    }
  }, [onReady])

  async function handleRegister() {
    setLoading(true)
    setError('')
    try {
      const key = await registerKey()
      setApiKey(key)
      setNewKey(key)
      setMode('ready')
      setHasKey(true)
      onReady()
    } catch {
      setError('Failed to register. Is the backend running?')
    }
    setLoading(false)
  }

  async function handleUseKey() {
    if (!keyInput.trim()) return
    setApiKey(keyInput.trim())
    setMode('ready')
    setHasKey(true)
    onReady()
  }

  function handleClear() {
    clearApiKey()
    setNewKey('')
    setHasKey(false)
    setMode('enter')
  }

  if (mode === 'ready' && hasKey) {
    return (
      <div className="mb-6 p-3 border border-matrix/20 rounded bg-terminal-bg/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-matrix">
            $ API_KEY_ACTIVE
            <span className="text-gray-600 ml-2">(key stored locally)</span>
          </span>
          <button onClick={handleClear} className="text-decay hover:text-decay/70 transition-colors">
            [CLEAR]
          </button>
        </div>
        {newKey && (
          <div className="mt-2 p-2 border border-terminal-amber/30 rounded text-[11px] text-terminal-amber break-all">
            Save your key: <span className="text-matrix">{newKey}</span>
            <div className="text-gray-600 mt-1">It won&apos;t be shown again.</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mb-6 p-4 border border-terminal-amber/30 rounded bg-terminal-bg/50">
      <div className="text-xs text-terminal-amber mb-3">
        $ AUTHENTICATION_REQUIRED
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode('enter')}
          className={`px-3 py-1.5 text-[11px] border rounded transition-all ${
            mode === 'enter'
              ? 'border-matrix text-matrix bg-matrix/10'
              : 'border-gray-800 text-gray-600 hover:border-gray-600'
          }`}
        >
          USE KEY
        </button>
        <button
          onClick={() => setMode('register')}
          className={`px-3 py-1.5 text-[11px] border rounded transition-all ${
            mode === 'register'
              ? 'border-matrix text-matrix bg-matrix/10'
              : 'border-gray-800 text-gray-600 hover:border-gray-600'
          }`}
        >
          GET FREE KEY
        </button>
      </div>

      {mode === 'enter' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="ent_..."
            className="flex-1 bg-black border border-matrix/30 rounded px-3 py-1.5 text-xs font-mono
                       text-terminal-fg placeholder-gray-700 focus:outline-none focus:border-matrix/70"
          />
          <button
            onClick={handleUseKey}
            disabled={!keyInput.trim()}
            className="px-3 py-1.5 bg-matrix/10 border border-matrix/40 text-matrix text-xs
                       rounded hover:bg-matrix/20 disabled:opacity-40"
          >
            SET
          </button>
        </div>
      )}

      {mode === 'register' && (
        <div>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-2 bg-matrix/10 border border-matrix/40 text-matrix text-xs
                       rounded hover:bg-matrix/20 disabled:opacity-40 transition-all"
          >
            {loading ? 'GENERATING...' : '[ GENERATE API KEY ]'}
          </button>
        </div>
      )}

      {error && <div className="mt-2 text-[11px] text-decay">{error}</div>}
    </div>
  )
}
