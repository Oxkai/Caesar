/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Ensures Tailwind works on index.html
    "./src/**/*.{js,ts,jsx,tsx}", // Makes sure Tailwind scans your JSX/TSX files for class names
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
