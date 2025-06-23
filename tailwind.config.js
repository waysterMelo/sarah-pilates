/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0efff',
          100: '#e4e1ff',
          500: '#6C5CE7',
          600: '#5a47d1',
          700: '#4c3bbd',
        },
        accent: {
          500: '#FF7675',
          600: '#e5575a',
        },
        dark: '#2D2D3A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #6C5CE7 0%, #FF7675 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #00B4D8 0%, #80FFDB 100%)',
        'glass': 'rgba(255, 255, 255, 0.95)',
        'animated-gradient': 'linear-gradient(135deg, #6C5CE7, #FF7675, #6C5CE7)',
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'hologram': 'hologram 8s infinite linear',
        'float': 'float 1.5s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        hologram: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        '3d': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'neon': '0 0 15px rgba(255, 118, 117, 0.5)',
      },
    },
  },
  plugins: [],
};