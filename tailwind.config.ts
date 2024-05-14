/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        barlow: ["Barlow", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "19.5px"],
        lg: ["18px", "21.94px"],
        xl: ["20px", "24.38px"],
        "2xl": ["24px", "29.26px"],
        "3xl": ["28px", "50px"],
        "4xl": ["48px", "58px"],
        "8xl": ["96px", "106px"],
      },
      colors: {
        "primary-white": "#FFFFFF",
        "primary-blue": "#1A3960",
        "secondary-blue:": "#0A1623",
        "secondary-yellow": "#FCD32E",
        "secondary-gray": "#9B9B9B",
      },
      screens: {
        wide: "1440px",
      },
    },
  },
  plugins: [],
};
