const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          50: '#f2faf7',
          100: '#e6f5ef',
          200: '#bfe7d7',
          300: '#99d8bf',
          400: '#4dbb90',
          500: '#009E60',
          600: '#008e56',
          700: '#007748',
          800: '#005f3a',
          900: '#004d2f',
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          ...defaultTheme.fontFamily.sans,
        ],
      }
    },
  },
  plugins: [],
}
