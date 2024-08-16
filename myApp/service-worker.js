// service-worker.js

const CACHE_NAME = "my-cache-v1";
const urlsToCache = ["/", "/index.html", "/app.js", "/manifest.json"];

self.addEventListener('install', function () {
  self.skipWaiting();
});



self.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim());
});


self.addEventListener('fetch', function (event) {

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        return response;
      })
  );
});

self.addEventListener('notificationclick',e=>{
  const channel = new BroadcastChannel("data-save-message");
  channel.postMessage("Your data has been saved!");
})