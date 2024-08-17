// service-worker.js
import catDB from './js/db/cat-db.js';

const cacheName = "my-cache-v8";
const urlsToCache = ["/", "/index.html", "/app.js", "/manifest.json"];

self.addEventListener('install', (event) => {
  self.skipWaiting();

  //create the static cache
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        console.log('Cache:', cache);
        cache.add('/app.js');
        // cache.addAll([
        //   '/app.js',
        //   '/styles.css'
        // ]);
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
  // if (event.request.method === 'GET') { //only use catch when getting info
  //   event.respondWith(
  //     caches.open(cacheName)
  //       .then((cache) => {
  //         return cache.match(event.request)
  //           .then((cacheResponse) => {
  //             const fetchedResponse = fetch(event.request)
  //               .then((networkResponse) => {
  //                 cache.put(event.request, networkResponse.clone());
  //                 return networkResponse;
  //               })
  //               .catch(() => {
  //                 return cache.match('/offline.html');
  //               });
  //             return cacheResponse || fetchedResponse;
  //           }
  //           )
  //       })
  //   );
  // }

  //Cache strategy: Network with Cache Fallback
  event.respondWith(
    fetch(event.request)
      .catch(() => { //only works when request failed, so doesn't need the .then()
        return caches.open(cacheName).then((cache) => {
          return cache.match(event.request);
        })
      }
      )
  );

});

self.addEventListener('notificationclick', e => {
  const channel = new BroadcastChannel("data-save-message");
  channel.postMessage("Your data has been saved!");
})



self.addEventListener('sync', (event) => {
  console.log('[SW] bg sync:', event);

  switch (event.tag) {
    case 'add-cat':
      addCat();
      break;
    case 'send-email':
      console.log('Sending an email');
      break;
  }
});


function addCat() {
  console.log('[SW]Add cat!!!');
  console.log('[SW]Cat DB:', catDB);

  catDB.dbOffline.open()
    .then(() => {

      //Get all locally saved musics.
      catDB.dbOffline.getAll()
        .then((cats) => {
          console.log("Cats local:", cats);

          //Open the online database
          catDB.dbOnline.open()
            .then(() => {
              //Save the cats online
              cats.forEach((cat) => {
                catDB.dbOnline.firebaseWrite(cat)
                  .then(() => {
                    //Delete music from locally
                    catDB.dbOffline.delete(cat.id);
                  })
                  .catch((error) => console.log(error));
              });

              //Also display a notification
              const message = `Syncronized ${cats.length} cats!`;
              self.registration.showNotification(message);

            })
            .catch((error) => console.log(error));
        });
    })
    .catch((error) => console.log(error));
}