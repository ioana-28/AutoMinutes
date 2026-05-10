import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#cad2c5',
        surface: '#efebe2',
        'surface-alt': '#e6e0da',
        'surface-muted': '#edf3ea',
        'border-muted': '#7f9d86',
        'border-strong': '#c7e8cd',
        'text-primary': '#1f2937',
        'text-heading': '#0f1a0f',
        'danger-bg': '#f4c7c7',
        'danger-border': '#b33a3a',
        'danger-text': '#6b1f1f',
      },
    },
  },
  plugins: [],
};

export default config;
