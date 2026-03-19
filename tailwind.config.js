/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: { 50: '#faf8f5', 100: '#f5f0e8', 200: '#ede5d6', 300: '#e0d3be' },
        teal: { 500: '#5a9e9e', 600: '#4a8a8a', 700: '#3a7575' },
        coral: { 500: '#d4594e', 600: '#c04840' },
        sage: { 500: '#7db07d', 600: '#6a9a6a' },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
