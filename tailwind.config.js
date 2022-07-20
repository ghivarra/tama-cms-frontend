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
        'desktop': '1200px',
      },
      width: {
        'sidebar': '280px',
        'inner': 'calc(100% - 280px)'
      },
      fontSize: {
        'sm': '14px',
        'lg': '18px'
      },
      colors: {
        'dark': '#374151',
        'gss': {
          'light': '#5C7BAD',
          DEFAULT: '#48638e',
          'dark': '#3f567c'
        },
        'success': {
          'light': '#DCFCE7',
          DEFAULT: '#16a34a',
          'calm': '#22c55e',
          'dark': '#15803d'
        },
        'warning': {
          'light': '#fef9c3',
          DEFAULT: '#facc15',
          'dark': '#EAB308'
        },
        'error': {
          'light': '#fee2e2',
          DEFAULT: '#dc2626',
          'calm': '#ef4444',
          'dark': '#dc2626'
        },
        'secondary': '#e2e8f0',
        'special': '#ff6600',
        'muted': '#9ca3af'
      },
    },
  },
  plugins: [],
}
