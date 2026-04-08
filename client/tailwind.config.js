/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#faf9f7',
        'bg-alt': '#f2f0ec',
        'bg-dark': '#1c1c1e',
        card: '#ffffff',
        ink: '#1a1a1a',
        'ink-light': '#6b6b6b',
        'ink-faint': '#a3a3a3',
        accent: '#c45d3e',
        'accent-hover': '#a84830',
        'accent-light': '#fdf0ec',
        border: '#e8e5e0',
        'border-hover': '#d1cdc6',
        success: '#2d8a56',
        'success-light': '#edf7f0',
        danger: '#c0392b',
        'danger-light': '#fdecea',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'card': '6px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'modal': '0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
