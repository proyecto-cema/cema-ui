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
          maxEntries: 25,
        },
      },
    },
    {
      urlPattern: new RegExp('https://qa.proyecto-cema.com/bovine'),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'CemaBovine',
        expiration: {
          maxEntries: 1000,
        },
      }
    },
    {
      urlPattern: new RegExp('https://qa.proyecto-cema.com/users'),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'CemaUser',
        expiration: {
          maxEntries: 1000,
        },
      }
    },
    {
      urlPattern: new RegExp('https://qa.proyecto-cema.com/activity'),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'CemaActivity',
        expiration: {
          maxEntries: 1000,
        },
      }
    },
    {
      urlPattern: new RegExp('https://qa.proyecto-cema.com/administration'),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'CemaAdministration',
        expiration: {
          maxEntries: 1000,
        },
      }
    },
    {
      urlPattern: new RegExp('https://qa.proyecto-cema.com/economic'),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'CemaEconomic',
        expiration: {
          maxEntries: 1000,
        },
      }
    },
    {
      urlPattern: new RegExp('https://qa.proyecto-cema.com/activity'),
      handler: 'NetworkOnly',
      method: 'POST',
      options: {
        backgroundSync: {
          name: 'activity-queue',
          options: {
            maxRetentionTime: 24 * 60 * 60,
          },
        },
      },
    },
    {
      urlPattern: new RegExp('https://qa.proyecto-cema.com/bovine'),
      handler: 'NetworkOnly',
      method: 'POST',
      options: {
        backgroundSync: {
          name: 'bovine-queue',
          options: {
            maxRetentionTime: 24 * 60 * 60,
          },
        },
      },
    },
  ],
};