/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0eeff',
          100: '#e4dbff',
          200: '#cdbfff',
          300: '#b49aff',
          400: '#9a76ff',
          500: '#7c4fff',
          600: '#6C47FF',
          700: '#5a38e0',
          800: '#4A2FCC',
          900: '#3a22a6',
          950: '#261680',
        },
        accent: {
          50:  '#ecfdf8',
          100: '#d1faf0',
          400: '#34d9a5',
          500: '#00D9A3',
          600: '#00A87E',
        },
      },
    },
  },
  plugins: [],
}
