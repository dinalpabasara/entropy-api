'use client'

import { useState } from 'react'
import { createMemory } from '@/lib/api'

interface Props {
  onCreated: () => void
}

export default function CreateMemory({ onCreated }: Props) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    try {
      await createMemory(content.trim())
      setContent('')
      onCreated()
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <label className="block text-matrix text-xs mb-2">
        $ ENTER_NEW_MEMORY
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What should be remembered?"
          maxLength={500}
          className="flex-1 bg-black border border-matrix/30 rounded px-4 py-2.5
                     text-sm font-mono text-terminal-fg placeholder-gray-700
                     focus:outline-none focus:border-matrix/70 transition-colors"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="px-5 py-2.5 bg-matrix/10 border border-matrix/40 text-matrix
                     text-sm font-mono rounded hover:bg-matrix/20
                     disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? 'WRITING...' : 'COMMIT'}
        </button>
      </div>
    </form>
  )
}
