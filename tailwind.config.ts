import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Official Atlanta Braves palette (minor-league tracker).
        braves: {
          navy: '#13274F',
          red: '#CE1141',
          sand: '#EAAA00',
        },
        // Ballpark palette for the 162-0 game: grass, dirt, chalk.
        field: '#1f7a43',
        grass: '#2e9e5b',
        dirt: '#b07a4a',
        chalk: '#f4f1e8',
        night: '#0a0f1c',
        panel: '#121a2b',
        seam: '#d4453b',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        pop: 'pop 0.25s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
