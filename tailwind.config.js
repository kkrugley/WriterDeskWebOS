/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F5F5F5',
        ink: '#111111',
        accent: '#000000'
      },
      fontFamily: {
        mono: ['"Courier Prime"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace']
      },
      boxShadow: {
        crt: '0 0 0 2px #111111'
      }
    }
  },
  plugins: []
};
