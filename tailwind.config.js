/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js}",
  ],
  theme: {
    extend: {
      screens: {
        'smartphone': '450px',
        'tablet': '640px',
        'laptop': '1024px',
        'desktop': '1280px',
      },
      width: {
        'sidebar': '280px',
        'inner': 'calc(100% - 280px)'
      },
      fontSize: {
        'xs': '14px'
      },
      colors: {
        'gss': {
          'light': '#2f405d',
          DEFAULT: '#1e293b',
          'dark': '#161e2b'
        },
        'success': {
          'light': '#DCFCE7',
          DEFAULT: '#22C55E',
          'dark': '#16a34a'
        },
        'warning': {
          'light': '#fef9c3',
          DEFAULT: '#facc15',
          'dark': '#EAB308'
        },
        'error': {
          'light': '#fee2e2',
          DEFAULT: '#ef4444',
          'dark': '#dc2626'
        },
        'secondary': '#e2e8f0',
        'special': '#ff6600'
      },
    },
  },
  plugins: [],
}
