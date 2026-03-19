/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#fffdfb',
        foreground: '#352a2f',
        primary: { DEFAULT: '#b77d8c', foreground: '#fff7f8' },
        secondary: '#f8edf0',
        accent: '#f4dfe3',
        border: '#eadfe2',
        muted: '#8d7e84',
        rosegold: '#c89b93',
        nude: '#f7ebe7',
        success: '#3f8f6b',
        warning: '#e5a73a',
        danger: '#d35d6e'
      },
      boxShadow: { soft: '0 18px 50px rgba(183, 125, 140, 0.12)' },
      borderRadius: { xl2: '1.5rem' },
      backgroundImage: { 'hero-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(247,235,231,0.95) 40%, rgba(244,223,227,0.95))' }
    }
  },
  plugins: []
};
