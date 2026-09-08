/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flux: {
          sage: '#5F927B',
          'sage-light': '#EBF1EA',
          terracotta: '#E87A52',
          'terracotta-light': '#FDF4F0',
          sand: '#FBF9F5',
          gold: '#E5B25D',
          dark: '#1A1A1A',
        }
      }
    },
  },
  plugins: [],
};
