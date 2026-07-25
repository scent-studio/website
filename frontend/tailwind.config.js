/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        luxury: {
          cream: 'rgb(var(--lux-cream) / <alpha-value>)',
          ivory: 'rgb(var(--lux-ivory) / <alpha-value>)',
          white: 'rgb(var(--lux-white) / <alpha-value>)',
          warm: 'rgb(var(--lux-warm) / <alpha-value>)',
          charcoal: 'rgb(var(--lux-charcoal) / <alpha-value>)',
          ink: 'rgb(var(--lux-ink) / <alpha-value>)',
          'on-ink': 'rgb(var(--lux-on-ink) / <alpha-value>)',
          steel: 'rgb(var(--lux-steel) / <alpha-value>)',
          gold: 'rgb(var(--lux-gold) / <alpha-value>)',
          'gold-light': 'rgb(var(--lux-gold-light) / <alpha-value>)',
          'gold-dark': 'rgb(var(--lux-gold-dark) / <alpha-value>)',
          border: 'rgb(var(--lux-border) / <alpha-value>)',
          green: 'rgb(var(--lux-green) / <alpha-value>)',
          red: 'rgb(var(--lux-red) / <alpha-value>)',
          black: 'rgb(var(--lux-black) / <alpha-value>)',
          dark: 'rgb(var(--lux-dark) / <alpha-value>)',
          champagne: 'rgb(var(--lux-champagne) / <alpha-value>)',
          silver: 'rgb(var(--lux-steel) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--lux-ink) / <alpha-value>)',
          foreground: 'rgb(var(--lux-on-ink) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--lux-gold) / <alpha-value>)',
          foreground: 'rgb(var(--lux-charcoal) / <alpha-value>)',
        },
      },
      fontFamily: {
        serif: ['"Libre Baskerville"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Libre Baskerville"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        elegant: 'var(--shadow-elegant)',
        nav: 'var(--shadow-nav)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        shimmer: 'shimmer 2s infinite',
        float: 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      transitionDuration: {
        theme: '250ms',
      },
    },
  },
  plugins: [],
};
