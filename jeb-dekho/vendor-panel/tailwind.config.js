/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transport: {
          primary: '#374151',
          secondary: '#3B82F6',
          accent: '#10B981',
        },
        food: {
          primary: '#92400E',
          secondary: '#84CC16',
          accent: '#FEF3C7',
        },
        mart: {
          primary: '#0D9488',
          secondary: '#F97316',
          accent: '#F0FDF4',
        },
      },
    },
  },
  plugins: [],
}