const CACHE_NAME = "weather-app-v1";
const BASE_PATH = "/weather";
const urlsToCache = [
  BASE_PATH + "/",
  BASE_PATH + "/manifest.json",
  BASE_PATH + "/favicon.svg",
  BASE_PATH + "/raindrop-fx-master/bundle/index.js",
  BASE_PATH + "/rain.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Возвращаем кэшированный ответ или делаем сетевой запрос
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
