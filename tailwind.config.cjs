/* eslint-disable global-require */
/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      'wireframe',
      'dark',
    ],
  },
  plugins: [require('daisyui')],
};
