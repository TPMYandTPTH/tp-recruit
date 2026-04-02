import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tp: {
          'dark-slate': '#4B4C6A',
          'pink': '#FF0082',
          'slate': '#848DAD',
          'muted-violet': '#706398',
          'dark-sand': '#918E81',
          'sand': '#D4D2CA',
          'pastel-sand': '#ECE9E7',
          'pastel-slate': '#C2C7CD',
          'pastel-violet': '#E2DFE8',
          'dark-gray': '#414141',
          'gray': '#676767',
          'light-gray': '#CCCCCC',
          'pastel-gray': '#E6E6E5',
          'dark-indigo': '#3E2666',
          'blue': '#3047B0',
          'turquoise': '#00AF9B',
          'green-flash': '#00D769',
          'orange': '#FF5C00',
          'purple': '#780096',
          'violet': '#8042CF',
        },
        black: '#000000',
        white: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"TP Sans"', 'Calibri', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
