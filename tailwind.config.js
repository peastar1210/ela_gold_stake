/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,css,scss}',
  ],
  darkMode: 'class', // 'media' is the default, change to 'class' if you want to use dark mode in with class names
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--primary-color)',
        'secondary-color': 'var(--secondary-color)',
      },
    },
    screens: {
      desktop: '1280px',
      mobile: '640px',
    },
  },

  plugins: [require('@tailwindcss/typography')],
}
