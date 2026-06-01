import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette is driven by CSS variables set per selected team
        // (see globals.css defaults + <body> theme vars in layout.tsx), so
        // every `braves-*` class recolors to the active club.
        braves: {
          navy: 'rgb(var(--brand-navy) / <alpha-value>)',
          red: 'rgb(var(--brand-red) / <alpha-value>)',
          gold: 'rgb(var(--brand-gold) / <alpha-value>)',
        },
        ink: {
          950: '#070b16',
          900: '#0a0f1e',
          850: '#0e1426',
          800: '#131a30',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(206,17,65,0.5), 0 0 24px -4px rgba(206,17,65,0.45)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
