/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: { 50: '#f4f1ec', 100: '#faf8f5', 200: '#ede5d6', 300: '#e0ddd6' },
        green: { 500: '#2e7d32', 600: '#1b5e20', 700: '#145214' },
        navy: { 500: '#1b3a5c', 600: '#14304d', 700: '#0d2238' },
      },
    },
  },
  plugins: [],
};
