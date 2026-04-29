module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a' },
        slate: { 850:'#1e2433' }
      },
      fontFamily: { sans: ['DM Sans', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
};
