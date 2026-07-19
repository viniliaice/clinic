module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          light: '#f0fdfa',
          DEFAULT: '#0f766e', // Medical teal-700
          dark: '#115e59',
        }
      }
    },
  },
  plugins: [],
}
