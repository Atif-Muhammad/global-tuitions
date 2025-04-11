/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false, // Disables Tailwind's reset
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Corrected the quotation marks
        urbanist: ['Urbanist', 'sans-serif'],
      },
    },
    plugins: [require('@tailwindcss/typography')],
  },
}