// install service worker
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('my-cache-name-03')
            .then(function (cache) {
                cache.addAll([
                    '/',
                    '/index.html',
                    '/styles.css',
                    'https://unpkg.com/dexie/dist/dexie.js',
                    '/db.js',
                    '/script.js',
                    '/favicon.ico',
                    '/manifest.json',
                    '/To-do-list.png'
                ])
            })
    );
    return self.clients.claim();
});

// activat service worker
self.addEventListener('activate', function (event) {
    console.log('Service worker activated', event);
})

// return cached response
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (res) {
                return res;
            })
    );
});
