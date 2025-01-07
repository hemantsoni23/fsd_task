/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        background: {
          DEFAULT: "var(--background-light)", 
          light: "var(--background-light)",
          dark: "var(--background-dark)",
        },
        text: {
          DEFAULT: "var(--text-light)",
          light: "var(--text-light)",
          dark: "var(--text-dark)",
        },
        border: {
          DEFAULT: "var(--border-light)",
          light: "var(--border-light)",
          dark: "var(--border-dark)",
        },
        muted: {
          DEFAULT: "var(--muted-light)",
          light: "var(--muted-light)",
          dark: "var(--muted-dark)",
        },
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [],
};