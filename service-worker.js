const CACHE_NAME = 'shamdun-academy-v1';
const urlsToCache = [
    '/My-First-Project/',
    '/My-First-Project/index.html',
    '/My-First-Project/login.html',
    '/My-First-Project/dashboard.html',
    '/My-First-Project/courses.html',
    '/My-First-Project/icon-192.png',
    '/My-First-Project/icon-512.png',
    '/My-First-Project/me.png',
    '/My-First-Project/BG.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache opened');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
            .catch(() => {
                if (event.request.destination === 'document') {
                    return caches.match('/My-First-Project/index.html');
                }
            })
    );
});
