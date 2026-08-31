/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#1a1a1a',
          blue: '#2563eb',
          'blue-hover': '#1d4ed8',
        },
        surface: '#ffffff',
        border: '#e5e7eb',
        muted: '#6b7280',
        'muted-light': '#f9fafb',
        danger: '#dc2626',
        success: '#16a34a',
        warning: '#d97706',
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '6px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
