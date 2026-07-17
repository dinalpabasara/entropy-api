import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        matrix: '#00ff41',
        decay: '#ff0040',
        terminal: {
          bg: '#0a0a0a',
          fg: '#c0c0c0',
          green: '#00ff41',
          red: '#ff0040',
          amber: '#ffb000',
        },
      },
      animation: {
        flicker: 'flicker 0.15s infinite',
        scanline: 'scanline 8s linear infinite',
        pulse: 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
