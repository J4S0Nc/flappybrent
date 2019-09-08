var cacheName = 'flappy-brent-pwa';
var filesToCache = [
  'index.html',  
  'game.js',
  'view.js',
  'assets/background0.png',
  'assets/beer0.png',
  'assets/beer1.png',
  'assets/beer2.png',
  'assets/brent0.png',
  'assets/EddieFlap0.png',
  'assets/EddieFlap1.png',
  'assets/EddieFlap2.png',
  'assets/EddieFlap3.png',
  'assets/empty0.png',
  'assets/music.mp3',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});