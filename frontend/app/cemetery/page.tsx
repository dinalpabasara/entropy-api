'use client'

import { useEffect, useState } from 'react'
import { getCemetery } from '@/lib/api'
import type { Memory } from '@/lib/api'

export default function Cemetery() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCemetery(30)
      .then(setMemories)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-decay">~CEMETERY</h1>
        <p className="text-xs text-gray-600 mt-1">
          These memories were lost to entropy. Unobserved. Unloved. Forgotten.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <span className="text-gray-600 text-sm animate-pulse">
            / EXHUMING DEAD DATA ...
          </span>
        </div>
      ) : memories.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-800 rounded">
          <p className="text-gray-700 text-sm italic">
            No deaths yet. The cemetery waits.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {memories.map((m) => (
            <div
              key={m.id}
              className="border border-decay/10 bg-terminal-bg/30 rounded p-4
                         opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-decay/60">
                  DIED: {m.died_at ? new Date(m.died_at).toLocaleString() : 'UNKNOWN'}
                </span>
                <div className="text-[10px] text-gray-700 space-x-3">
                  <span>OBSERVED: {m.times_observed}</span>
                  <span>STABILIZED: {m.times_upvoted}</span>
                </div>
              </div>
              <div className="decay-text text-sm font-mono text-gray-800 line-through">
                {m.original_content.substring(0, 120)}
                {m.original_content.length > 120 ? '...' : ''}
              </div>
              <div className="mt-2 text-[10px] text-decay/40 italic">
                &lt;DATA_IRRECOVERABLE&gt;
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-[10px] text-gray-800 animate-pulse">
          ALL DATA RETURNS TO ENTROPY.
        </p>
      </div>
    </div>
  )
}
