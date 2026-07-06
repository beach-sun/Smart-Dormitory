/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // ✅ 改用独立包
    autoprefixer: {},
  },
};
export default config;