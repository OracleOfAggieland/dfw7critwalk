/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from DFW7 RME logo
        brand: {
          blue: '#003F87',      // Texas flag blue
          red: '#BF0A30',       // Texas flag red
          gear: '#808080',      // Gear gray
          'blue-light': '#1E5BA8',
          'red-light': '#D93A3A',
        },
        // Status colors for crit walks
        status: {
          green: '#10B981',     // Good status
          yellow: '#F59E0B',    // Warning status
          red: '#EF4444',       // Critical status
          gray: '#6B7280',      // Never completed
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
