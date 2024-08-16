// service-worker.js

const cacheName = "my-cache-v2";
const urlsToCache = ["/", "/index.html", "/app.js", "/manifest.json"];

self.addEventListener('install', (event) => {
  self.skipWaiting();

  //create the static cache
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        console.log('Cache:', cache);
        cache.addAll([
          '/',
          '/index.html',
          '/app.js',
          '/styles.css'
        ]);
      })
      .catch((error) => {
        console.log('Cache failed:', error);
      })
  );
});



self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());

  // Remove caches that are no longer necessary
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('Cache names:', cacheNames);
      cacheNames.forEach((item) => {
        if (item !== cacheName) {
          caches.delete(item);
        }
      })
    })
  );
});


self.addEventListener('fetch', (event) => {
  //Cache strategy: Stale while Revalidate
  if (event.request.method === 'GET') { //only use catch when getting info
    event.respondWith(
      caches.open(cacheName)
        .then((cache) => {
          return cache.match(event.request)
            .then((cacheResponse) => {
              const fetchedResponse = fetch(event.request)
                .then((networkResponse) => {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
                })
                .catch(() => {
                  return cache.match('/offline.html');
                });
              return cacheResponse || fetchedResponse;
            }
            )
        })
    );
  }


});

self.addEventListener('notificationclick', e => {
  const channel = new BroadcastChannel("data-save-message");
  channel.postMessage("Your data has been saved!");
})