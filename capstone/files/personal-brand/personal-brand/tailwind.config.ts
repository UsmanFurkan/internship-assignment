import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1420',
        panel: '#131B29',
        line: '#233047',
        paper: '#E8E6DE',
        muted: '#8B93A7',
        amber: '#FFB454',
        amberDim: '#B9803E',
        cyan: '#6FD8E8',
        live: '#5FD98A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      maxWidth: {
        content: '1180px',
      },
    },
  },
  plugins: [],
};

export default config;
