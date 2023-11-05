/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Proxima Nova"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("daisyui"),
            require("@tailwindcss/typography"),
            require("daisyui")
          ],
  daisyui: {
    themes: ["light", "night"],
  },
}
