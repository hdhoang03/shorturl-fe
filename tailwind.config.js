/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '6px',
      },
    },
  },
  plugins: [],
}
