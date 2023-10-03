/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ['src/**/*.{js,jsx,ts,tsx}'],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        redwood: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          'base-100': 'hsl(250, 24%, 9%)',
          'base-200': 'hsl(250, 21%, 11%)',
          'base-300': 'rgb(53, 37, 32)',
          'base-content': 'hsl(0, 0%, 100%)',
          primary: 'rgb(191, 71, 34)',
          secondary: 'rgb(220, 94, 56)',
          accent: 'rgba(220, 94, 56, 0.2)',
        },
      },
    ],
  },
}
