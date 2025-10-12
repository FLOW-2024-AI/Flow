import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern blue palette - replacing black with deep blues
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0f9ff',  // Very light blue
          100: '#e0f2fe', // Light blue
          200: '#bae6fd', // Soft blue
          300: '#7dd3fc', // Medium blue
          400: '#38bdf8', // Bright blue
          500: '#0ea5e9', // Sky blue
          600: '#0284c7', // Deep sky
          700: '#0369a1', // Ocean blue
          800: '#075985', // Dark ocean
          900: '#0c4a6e', // Deep ocean (replaces black)
          950: '#082f49', // Deepest blue (replaces darkest black)
        },
        accent: {
          blue: '#3b82f6',
          lightBlue: '#60a5fa',
          darkBlue: '#1e40af',
          deepBlue: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['"Myriad Pro"', 'Myriad', '"Liberation Sans"', '"Nimbus Sans L"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
