module.exports = {
  globDirectory: "public/",
  globPatterns: ["**/*.{css,ico,html,png,js,json,woff2}"],
  swDest: "./public/service-worker.js",
  skipWaiting: true,
  clientsClaim: true
};