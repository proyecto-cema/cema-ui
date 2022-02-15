module.exports = {
  globDirectory: "public/",
  globPatterns: ["**/*.{css,ico,html,png,js,json,woff2}"],
  swDest: "./public/service-worker.js",
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [{
    urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'CemaImages',
      expiration: {
        maxEntries: 5,
      },
    },
  }],
};