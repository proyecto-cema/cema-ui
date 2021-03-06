module.exports = {
  globDirectory: "public/",
  globPatterns: ["**/*.{css,ico,html,png,js,json,woff2}"],
  swDest: "./public/service-worker.js",
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'CemaImages',
        expiration: {
          maxEntries: 100,
        },
      },
    },
    {
      urlPattern: new RegExp('https://(qa.|www.)*proyecto-cema.com/(bovine|users|activity|administration|economic|health)'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'CemaCache',
      }
    },
    {
      urlPattern: new RegExp('https://(qa.|www.)*proyecto-cema.com/(activity|bovine)'),
      handler: 'NetworkOnly',
      method: 'POST',
      options: {
        backgroundSync: {
          name: 'cema-queue',
          options: {
            maxRetentionTime: 24 * 60 * 60,
          },
        },
      },
    },
    {
      urlPattern: new RegExp('https://(qa.|www.)*proyecto-cema.com/(activity|bovine)'),
      handler: 'NetworkOnly',
      method: 'PUT',
      options: {
        backgroundSync: {
          name: 'cema-edit-queue',
          options: {
            maxRetentionTime: 24 * 60 * 60,
          },
        },
      },
    },
  ],
};