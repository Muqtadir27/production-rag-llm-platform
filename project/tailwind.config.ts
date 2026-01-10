import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neuro-dark': '#0a0a0f',
        'neuro-purple': '#8b5cf6',
        'neuro-blue': '#3b82f6',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neuro-gradient': 'linear-gradient(180deg, #1a0a2e 0%, #0a0a0f 100%)',
      },
    },
  },
  plugins: [],
}
export default config
