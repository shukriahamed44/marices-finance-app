import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        apple: {
          blue:       '#0071E3',
          'blue-light': '#E8F1FB',
          green:      '#34C759',
          'green-light': '#E8F8ED',
          red:        '#FF3B30',
          'red-light':  '#FFF0EF',
          orange:     '#FF9500',
          'orange-light': '#FFF3E0',
          purple:     '#AF52DE',
          'purple-light': '#F5EDFB',
          bg:         '#F5F5F7',
          surface:    '#FFFFFF',
          'surface-2': '#F5F5F7',
          'surface-3': '#EBEBED',
          label:      '#1D1D1F',
          'label-2':  '#6E6E73',
          'label-3':  '#86868B',
          separator:  'rgba(0,0,0,0.08)',
          'sep-dark': 'rgba(0,0,0,0.14)',
        },
      },
      borderRadius: {
        apple: '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
      boxShadow: {
        apple: '0 2px 8px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.04)',
        'apple-md': '0 4px 16px rgba(0,0,0,0.10), 0 0 1px rgba(0,0,0,0.04)',
        'apple-lg': '0 8px 32px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.04)',
      },
      backdropBlur: {
        apple: '20px',
      },
    },
  },
  plugins: [],
} satisfies Config
