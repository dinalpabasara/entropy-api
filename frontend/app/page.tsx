'use client'

import { useEffect, useState, useCallback } from 'react'
import MemoryCard from '@/components/MemoryCard'
import CreateMemory from '@/components/CreateMemory'
import ApiKeyPrompt from '@/components/ApiKeyPrompt'
import { exploreMemories, getApiKey } from '@/lib/api'
import type { Memory } from '@/lib/api'

export default function Home() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(!!getApiKey())

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await exploreMemories(30, false)
      setMemories(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function handleUpdate(updated: Memory) {
    setMemories((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-matrix mb-2 glitch" data-text="THE OBSERVATORY">
          THE OBSERVATORY
        </h1>
        <p className="text-xs text-gray-600 max-w-xl mx-auto leading-relaxed">
          Data decays. Memories fade. Each unobserved memory drifts toward
          digital oblivion. Observe to restore. Neglect to destroy.
        </p>
      </div>

      <ApiKeyPrompt onReady={() => setAuthed(true)} />

      {authed && <CreateMemory onCreated={load} />}

      {loading ? (
        <div className="text-center py-20">
          <span className="text-matrix text-sm animate-pulse">
            / DECAYING DATA STREAM ...
          </span>
        </div>
      ) : memories.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-800 rounded">
          <p className="text-gray-700 text-sm italic">
            No living memories. The void stares back.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {memories.map((m) => (
            <MemoryCard key={m.id} memory={m} onUpdate={handleUpdate} />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-[10px] text-gray-800">
          ENTROPY API — ALL MEMORIES FADE. OBSERVE TO PRESERVE.
        </p>
      </div>
    </div>
  )
}
