/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        custombg : "#A4DCAA",
        "custom-green": "#A4DCAA",
        "custom-blue": "#22b3b8",
      },
      fontFamily: {
        ibm: ['"IBM Plex Sans"', "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        urbanist: ["Urbanist", "sans-serif"],
        readex: ["Readex Pro", "sans-serif"],
        sans: [...require("tailwindcss/defaultTheme").fontFamily.sans],
        serif: [...require("tailwindcss/defaultTheme").fontFamily.serif],
        mono: [...require("tailwindcss/defaultTheme").fontFamily.mono],
      },
      fontFamily: {
        ibm: ['"IBM Plex Sans"', "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        urbanist: ["Urbanist", "sans-serif"],
        readex: ["Readex Pro", "sans-serif"],
        sans: [...require("tailwindcss/defaultTheme").fontFamily.sans],
        serif: [...require("tailwindcss/defaultTheme").fontFamily.serif],
        mono: [...require("tailwindcss/defaultTheme").fontFamily.mono],
      },
      typography: {
        DEFAULT: {
          css: {
            'ol li, ul li': {
              color: 'black',  // Override color for list items' identifiers
            },
          },
        },
      },
      
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".btnbutton": {
          display: "inline-block",
          textAlign: "center",
          alignSelf: "start",
          padding: "0.5rem 1rem",
          paddingInlineEnd: "1.25rem", // xl:px-5 equivalent
          backgroundColor: "#000", // bg-black equivalent
          borderColor: "#fff", // border-white equivalent
          borderWidth: "2px",
          borderRadius: "0.5rem", // rounded-lg equivalent
          color: "#f8fafc", // text-slate-50 equivalent
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // shadow-md equivalent
          transition: "all 0.5s", // duration-500 equivalent
          fontSize: "0.75rem", // text-[12px] equivalent for small screens
          "@media (min-width: 768px)": {
            fontSize: "0.875rem", // text-[14px] for medium screens
          },
          "@media (min-width: 1024px)": {
            fontSize: "1rem", // text-[16px] for large screens
          },
          "@media (min-width: 1280px)": {
            fontSize: "1.125rem", // text-[18px] for xl screens
          },
          "@media (min-width: 1536px)": {
            fontSize: "1.25rem", // text-[20px] for 2xl screens
          },
          "&:hover": {
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)", // Increased shadow on hover
            color: "#ffffff", // hover:text-white equivalent
          },
        },
      });
    },
    require("tailwind-scrollbar-hide"), 
    require('@tailwindcss/typography')
  ],
};
