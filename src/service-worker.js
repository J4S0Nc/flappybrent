var cacheName = 'flappy-brent-pwa';
var filesToCache = [
  'index.html',  
  'game.js',
  'view.js',
  'assets/green0.png',
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
  'assets/music/music0.mp3',
  'assets/music/music1.mp3',
  'assets/music/music2.mp3',
  'assets/music/music3.mp3',
  'assets/music/music4.mp3',
  'assets/music/music5.mp3',
  'assets/music/music6.mp3',
  'assets/music/music7.mp3',
  'assets/music/music8.mp3',
  'assets/music/music9.mp3',
  'assets/music/music10.mp3',  
  'assets/sounds/die0.mp3',
  'assets/sounds/die1.mp3',
  'assets/sounds/die2.mp3',
  'assets/sounds/die3.mp3',
  'assets/sounds/die4.mp3',
  'assets/sounds/die5.mp3',
  'assets/sounds/die6.mp3',
  'assets/sounds/die7.mp3',
  'assets/sounds/die8.mp3',
  'assets/sounds/die9.mp3',
  'assets/sounds/die10.mp3',
  'assets/sounds/die11.mp3',
  'assets/sounds/die12.mp3',
  'assets/sounds/die13.mp3',
  'assets/sounds/drink0.mp3',
  'assets/sounds/drink1.mp3',
  'assets/sounds/drink2.mp3',
  'assets/sounds/drink3.mp3',
  'assets/sounds/drink4.mp3',
  'assets/sounds/drink5.mp3',
  'assets/sounds/drink6.mp3',
  'assets/sounds/drink7.mp3',
  
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