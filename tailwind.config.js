/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        // Sans-only across the platform — serif aliased to Geist.
        serif: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: {
          DEFAULT: '#F6F4EF',
          soft: '#FAF8F3',
          deep: '#EEEAE1',
        },
        ink: {
          900: '#1A1A17',
          700: '#3C3C38',
          500: '#6B6B65',
          300: '#A8A8A1',
          200: '#CFCEC7',
          100: '#E7E5DE',
        },
        sage: {
          50: '#F1F4EF',
          100: '#E2E8DC',
          200: '#C6D2BB',
          300: '#9AAE8C',
          400: '#738A63',
          500: '#4F6942',
          600: '#3D5333',
          700: '#2F4027',
        },
        ember: {
          50: '#FBF3EA',
          100: '#F5E4CE',
          200: '#EBC89B',
          300: '#D9A461',
          400: '#B98132',
          500: '#8E601E',
        },
        sky2026: {
          50: '#EEF3F5',
          100: '#D9E4E9',
          300: '#8FAAB3',
          500: '#4E6F7A',
          700: '#2E4850',
        },
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.04)',
        'card': '0 1px 2px rgba(20, 24, 28, 0.04), 0 8px 24px -12px rgba(20, 24, 28, 0.08)',
        'glow': '0 0 0 1px rgba(79, 105, 66, 0.06), 0 20px 60px -20px rgba(79, 105, 66, 0.20)',
        'inset-soft': 'inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.03)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.45, transform: 'scale(0.9)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.8s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
