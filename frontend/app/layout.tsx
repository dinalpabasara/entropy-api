import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Observatory — Entropy API',
  description: 'Watch digital memories decay in real-time. Observe to restore. Neglect to destroy.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="crt">
        <div className="scanline" />
        <nav className="fixed top-0 left-0 right-0 z-50 bg-terminal-bg/80 backdrop-blur-sm border-b border-matrix/20">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-matrix font-bold text-lg tracking-widest">
              [ENTROPY_OBSERVATORY]
            </a>
            <div className="flex gap-6 text-sm">
              <a href="/" className="hover:text-matrix transition-colors">~feed</a>
              <a href="/explore" className="hover:text-matrix transition-colors">~explore</a>
              <a href="/cemetery" className="hover:text-decay transition-colors">~cemetery</a>
            </div>
          </div>
        </nav>
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
