'use client'

import { useState } from 'react'
import type { Memory } from '@/lib/api'
import { upvoteMemory, getApiKey } from '@/lib/api'

interface Props {
  memory: Memory
  onUpdate?: (m: Memory) => void
}

export default function MemoryCard({ memory, onUpdate }: Props) {
  const [stabilizing, setStabilizing] = useState(false)
  const [error, setError] = useState('')

  const healthColor =
    memory.health_score > 60 ? 'text-matrix' :
    memory.health_score > 25 ? 'text-terminal-amber' :
    'text-decay'

  async function handleStabilize() {
    if (!getApiKey()) {
      setError('Set an API key first')
      return
    }
    setStabilizing(true)
    setError('')
    try {
      const updated = await upvoteMemory(memory.id)
      onUpdate?.(updated)
    } catch (e) {
      setError(String(e))
    }
    setStabilizing(false)
  }

  return (
    <div
      className={`
        border ${
          memory.is_alive
            ? memory.health_score > 60
              ? 'border-matrix/30'
              : memory.health_score > 25
              ? 'border-terminal-amber/30'
              : 'border-decay/30'
            : 'border-decay/10 opacity-60'
        }
        bg-terminal-bg/50 backdrop-blur-sm rounded p-4
        hover:border-matrix/50 transition-all duration-300
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-mono ${healthColor}`}>
          HEALTH: {memory.health_score}%
        </span>
        <span className="text-[10px] text-gray-600">
          {new Date(memory.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="h-1.5 bg-gray-900 rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full health-bar rounded-full ${
            memory.health_score > 60 ? 'bg-matrix' :
            memory.health_score > 25 ? 'bg-terminal-amber' :
            'bg-decay'
          }`}
          style={{ width: `${memory.health_score}%` }}
        />
      </div>

      <div className="decay-text text-sm mb-3 leading-relaxed">
        {memory.is_alive
          ? <CorruptedText text={memory.content} health={memory.health_score} />
          : <span className="text-decay italic">&lt;DATA_CORRUPTED&gt;</span>
        }
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-600">
        <span>OBSERVED: {memory.times_observed}</span>
        <span>STABILIZED: {memory.times_upvoted}</span>
      </div>

      {memory.is_alive && (
        <button
          onClick={handleStabilize}
          disabled={stabilizing || !getApiKey()}
          className="mt-3 w-full py-1.5 text-xs border border-matrix/40 text-matrix
                     hover:bg-matrix/10 transition-all rounded
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {stabilizing ? 'STABILIZING...' : '[STABILIZE]'}
        </button>
      )}
      {error && <div className="mt-1 text-[10px] text-decay">{error}</div>}
    </div>
  )
}

function CorruptedText({ text, health }: { text: string; health: number }) {
  return (
    <>
      {text.split('').map((char, i) => {
        if ('!@#$%^&*()_+~`{}|[]\\;:",./<>?'.includes(char)) {
          return (
            <span key={i} className={health > 60 ? 'text-matrix/60' : 'text-decay/80'}>
              {char}
            </span>
          )
        }
        return <span key={i}>{char}</span>
      })}
    </>
  )
}
