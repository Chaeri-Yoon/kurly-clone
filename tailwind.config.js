module.exports = {

  content: [
    "./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        kurly: {
          purple: '#5F0080',
          black: '#4e4f4f'
        }
      },
      textColor: {
        kurly: {
          purple: '#5F0080',
          black: '#4e4f4f'
        }
      },
      borderColor: {
        kurly: {
          purple: '#5F0080'
        }
      }
    }
  },
  plugins: [],
  mode: 'jit'
}
