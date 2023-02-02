/* eslint-disable global-require */
/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      'business',
      'cupcake',
      'light',
      'dark',
      {
        halloween: {
          ...require('daisyui/src/colors/themes')['[data-theme=halloween]'],
          secondary: '#a81311',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
