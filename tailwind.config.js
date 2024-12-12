/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D9BF0',
        secondary: '#8B98A5',
        darkGray: '#536471',
        lightGray: '#EFF3F4',
        success: '#00BA7C',
        error: '#F4212E',
      },
      spacing: {
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
}
