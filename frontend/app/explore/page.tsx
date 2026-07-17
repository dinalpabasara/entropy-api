'use client'

import { useEffect, useState, useCallback } from 'react'
import MemoryCard from '@/components/MemoryCard'
import { exploreMemories } from '@/lib/api'
import type { Memory } from '@/lib/api'

export default function Explore() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [includeDead, setIncludeDead] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await exploreMemories(50, includeDead)
      setMemories(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [includeDead])

  useEffect(() => { load() }, [load])

  function handleUpdate(updated: Memory) {
    setMemories((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-matrix">~EXPLORE</h1>
          <p className="text-xs text-gray-600 mt-1">
            Browsing the entropy feed — memories at all stages of decay.
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={includeDead}
            onChange={(e) => setIncludeDead(e.target.checked)}
            className="accent-matrix"
          />
          INCLUDE_DEAD
        </label>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <span className="text-matrix text-sm animate-pulse">
            / DECRYPTING DATA STREAM ...
          </span>
        </div>
      ) : memories.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-800 rounded">
          <p className="text-gray-700 text-sm italic">No memories found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {memories.map((m) => (
            <MemoryCard key={m.id} memory={m} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}
