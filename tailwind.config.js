/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#05070b',
          panel: '#090d14',
          'panel-border': '#152232',
          'panel-glow': '#102a36',
          green: '#00ff66',
          'green-dim': '#00cc52',
          'green-dark': '#003816',
          cyan: '#00f0ff',
          'cyan-dim': '#0891b2',
          amber: '#ffaa00',
          danger: '#ff2a5f',
          muted: '#475569',
          faint: '#1e293b',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Share Tech Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['"Share Tech Mono"', '"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'cursor-blink': 'blink 1s step-start infinite',
        'flicker': 'crtFlicker 0.15s infinite',
        'pulse-slow': 'pulseGlow 3s ease-in-out infinite',
        'scanlines': 'scanlineScroll 8s linear infinite',
        'glitch-shake': 'glitchShake 0.25s ease-in-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        crtFlicker: {
          '0%': { opacity: '0.985' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.99' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.75', filter: 'drop-shadow(0 0 6px rgba(0,255,102,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 14px rgba(0,255,102,0.8))' },
        },
        scanlineScroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitchShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px) translateY(1px)' },
          '40%': { transform: 'translateX(4px) translateY(-1px)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
        }
      },
      boxShadow: {
        'neon-green': '0 0 10px rgba(0, 255, 102, 0.4), inset 0 0 10px rgba(0, 255, 102, 0.1)',
        'neon-green-strong': '0 0 20px rgba(0, 255, 102, 0.6), inset 0 0 15px rgba(0, 255, 102, 0.2)',
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.4), inset 0 0 10px rgba(0, 240, 255, 0.1)',
        'neon-amber': '0 0 10px rgba(255, 170, 0, 0.4), inset 0 0 10px rgba(255, 170, 0, 0.1)',
        'neon-danger': '0 0 12px rgba(255, 42, 95, 0.6), inset 0 0 8px rgba(255, 42, 95, 0.2)',
      }
    },
  },
  plugins: [],
}
