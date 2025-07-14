/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        'sillage-gold': {
          DEFAULT: 'hsl(var(--sillage-gold))',
          50: '#FFFAF0',
          100: '#FEF3C7', 
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#DAA520', // goldenrod principal
          600: 'hsl(var(--sillage-gold-dark))', // #c4965a
          700: '#b8864f', // dorado profundo
          800: '#92400E',
          900: '#78350F',
          'warm': 'hsl(var(--sillage-gold-warm))', // #daaf60
          'dark': 'hsl(var(--sillage-gold-dark))', // #c4965a
          'deep': '#b8864f',
          'bright': 'hsl(var(--sillage-gold-bright))', // #f0c674
          'warm-bright': '#e6b960',
        },
        'sillage-cream': {
          DEFAULT: 'rgba(252, 248, 237, 0.95)',
          warm: 'rgba(254, 252, 237, 0.95)',
          light: 'rgba(253, 250, 243, 0.9)',
          subtle: 'rgba(245, 241, 232, 0.9)',
        },
        'sillage-dark': {
          DEFAULT: 'hsl(var(--sillage-dark))',
          light: '#2D1810',
          lighter: 'hsl(var(--sillage-dark-lighter))', // #3C2415
          900: 'hsl(var(--sillage-dark-900))', // equivalente a slate-900
        },
        'sillage-gray': {
          light: 'hsl(var(--sillage-gray-light))',
          medium: 'hsl(var(--sillage-gray-medium))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
