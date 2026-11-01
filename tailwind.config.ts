import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#121212',
        'surface-elevated': '#1A1A1A',
        border: '#272727',
        accent: {
          DEFAULT: '#C9FF00',
          hover: '#B5E600',
          glow: 'rgba(201, 255, 0, 0.25)',
        },
        foreground: '#F7F7F2',
        muted: '#8E8E89',
        danger: '#FF3B30',
        success: '#34C759',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
