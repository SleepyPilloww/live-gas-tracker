/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        backdropBlur: {
          xs: '2px',
        },
        colors: {
          ethereum: '#627eea',
          polygon: '#8247e5',
          arbitrum: '#28a0f0',
        }
      },
    },
    plugins: [],
  }