/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'apple-blue': '#007aff',
        'apple-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      animation: {
        'shimmer': 'shimmer 1.5s ease-out infinite',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
        fadeInUp: {
          'from': { 
            opacity: '0', 
            transform: 'translateY(30px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        slideInRight: {
          'from': { 
            opacity: '0', 
            transform: 'translateX(50px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        scaleIn: {
          'from': { 
            opacity: '0', 
            transform: 'scale(0.9)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'scale(1)' 
          },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' 
          },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}