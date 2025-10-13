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
        // Notion-inspired sophisticated palette
        // Light Mode: Warm grays with subtle warmth
        // Dark Mode: Deep charcoal with blue undertones
        
        // Primary accent - Vibrant blue (Notion-style)
        primary: {
          50: '#EFF6FF',   // Ultra light blue
          100: '#DBEAFE',  // Very light blue
          200: '#BFDBFE',  // Light blue
          300: '#93C5FD',  // Soft blue
          400: '#60A5FA',  // Medium blue
          500: '#2563EB',  // Notion blue (main)
          600: '#1D4ED8',  // Deep blue
          700: '#1E40AF',  // Darker blue
          800: '#1E3A8A',  // Very dark blue
          900: '#1E293B',  // Almost black blue
          950: '#0F172A',  // Deepest blue-black
        },
        
        // Secondary accent - Sophisticated purple
        secondary: {
          50: '#FAF5FF',   // Ultra light purple
          100: '#F3E8FF',  // Very light purple
          200: '#E9D5FF',  // Light purple
          300: '#D8B4FE',  // Soft purple
          400: '#C084FC',  // Medium purple
          500: '#A855F7',  // Notion purple
          600: '#9333EA',  // Deep purple
          700: '#7E22CE',  // Darker purple
          800: '#6B21A8',  // Very dark purple
          900: '#581C87',  // Almost black purple
          950: '#3B0764',  // Deepest purple
        },
        
        // Neutral grays - Warm undertones (Notion-style)
        neutral: {
          50: '#FAFAF9',   // Off-white (warm)
          100: '#F5F5F4',  // Very light gray (warm)
          200: '#E7E5E4',  // Light gray (warm)
          300: '#D6D3D1',  // Soft gray
          400: '#A8A29E',  // Medium gray
          500: '#78716C',  // True gray
          600: '#57534E',  // Dark gray
          700: '#44403C',  // Darker gray
          800: '#292524',  // Very dark gray (warm)
          900: '#1C1917',  // Almost black (warm)
          950: '#0C0A09',  // Deepest black (warm)
        },
        
        // Accent colors for variety
        accent: {
          teal: '#14B8A6',    // Notion teal
          orange: '#F97316',  // Notion orange
          pink: '#EC4899',    // Notion pink
          green: '#10B981',   // Notion green
          yellow: '#F59E0B',  // Notion yellow
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
