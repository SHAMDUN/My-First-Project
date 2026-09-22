// ==========================================
// Service Worker - آکادمی شمعدون
// ==========================================

const CACHE_NAME = 'shamdun-v67'; // ← این عدد رو بعد از هر آپدیت عوض کن

const urlsToCache = [
    '/My-First-Project/',
    '/My-First-Project/index.html',
    '/My-First-Project/login.html',
    '/My-First-Project/dashboard.html',
    '/My-First-Project/courses.html',
    '/My-First-Project/course-detail.html',
    '/My-First-Project/lesson.html',
    '/My-First-Project/admin.html',
    '/My-First-Project/assistant.html',
    '/My-First-Project/manifest.json',
    '/My-First-Project/supabase-config.js',
    '/My-First-Project/jalali-datepicker.js',
    '/My-First-Project/jalali-datepicker.css',
    '/My-First-Project/519.png'
];

// نصب
self.addEventListener('install', (event) => {
    self.skipWaiting(); // ← نسخه جدید فوری فعال بشه
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// فعال‌سازی: پاک کردن کش‌های قدیمی
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(
                names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
            )
        ).then(() => self.clients.claim())
    );
});

// fetch
self.addEventListener('fetch', (event) => {
    // برای درخواست‌های Supabase، کش نمی‌کنیم
    if (event.request.url.includes('supabase.co')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
