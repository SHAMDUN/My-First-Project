// ==========================================
// Service Worker - آکادمی شمعدون
// نسخه‌بندی خودکار + پاک کردن کش قدیمی
// ==========================================

// نسخه خودکار: هر بار که فایل تغییر کنه، نسخه جدید میاد
const VERSION = 'v2.2.8';
const CACHE_NAME = `shamdun-${VERSION}`;

const urlsToCache = [
    // صفحات اصلی
    '/My-First-Project/',
    '/My-First-Project/index.html',
    '/My-First-Project/login.html',
    '/My-First-Project/dashboard.html',

    // صفحات بازار
    '/My-First-Project/home.html',
    '/My-First-Project/bourse.html',
    '/My-First-Project/news.html',
    '/My-First-Project/dictionary.html',

    // صفحات دوره‌ها
    '/My-First-Project/courses.html',
    '/My-First-Project/course-detail.html',
    '/My-First-Project/lesson.html',

    // صفحات وبلاگ
    '/My-First-Project/blog.html',
    '/My-First-Project/blog-post.html',

    // صفحات دیگه
    '/My-First-Project/about.html',
    '/My-First-Project/contact.html',
    '/My-First-Project/faq.html',
    '/My-First-Project/portfolio.html',
    '/My-First-Project/personality-test.html',
    '/My-First-Project/assistant.html',
    '/My-First-Project/calculator.html',
    '/My-First-Project/calculator-v2.html',

    // فایل‌های سیستمی
    '/My-First-Project/manifest.json',
    '/My-First-Project/supabase-config.js',
    '/My-First-Project/navbar.js',
    '/My-First-Project/jalali-datepicker.js',
    '/My-First-Project/jalali-datepicker.css',

    // آیکون‌ها و تصاویر
    '/My-First-Project/519.png',
    '/My-First-Project/icon-192.png',
    '/My-First-Project/icon-512.png'
];

// ==========================================
// نصب: ذخیره فایل‌ها در کش
// ==========================================
self.addEventListener('install', (event) => {
    self.skipWaiting(); // فعال‌سازی فوری SW جدید
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 Caching files for version:', VERSION);
            // از addAll استفاده نکن چون اگه یه فایل ۴۰۴ بده، همه fail می‌شن
            return Promise.allSettled(
                urlsToCache.map(url =>
                    cache.add(url).catch(err => {
                        console.warn('⚠️ Failed to cache:', url, err.message);
                    })
                )
            );
        })
    );
});

// ==========================================
// فعال‌سازی: پاک کردن کش‌های قدیمی
// ==========================================
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(
                names
                    .filter(n => n !== CACHE_NAME)
                    .map(n => {
                        console.log('🗑️ Deleting old cache:', n);
                        return caches.delete(n);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// ==========================================
// Fetch: استراتژی Network First برای HTML، Cache First برای بقیه
// ==========================================
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // درخواست‌های Supabase رو کش نکن
    if (url.includes('supabase.co')) return;

    // درخواست‌های API خارجی رو کش نکن
    if (url.includes('api.coingecko.com') ||
        url.includes('api.brsapi.ir') ||
        url.includes('tsetmc.com') ||
        url.includes('avalai.ir') ||
        url.includes('tradingview.com')) {
        return;
    }

    // فقط GET رو کش کن
    if (event.request.method !== 'GET') return;

    // ===== استراتژی =====
    const isHTML = event.request.headers.get('accept')?.includes('text/html');
    const isSameOrigin = url.startsWith(self.location.origin);

    if (isHTML && isSameOrigin) {
        // HTML: Network First (همیشه نسخه تازه رو بگیر)
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // نسخه جدید رو توی کش هم بروز کن
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // اگه آفلاین بود، از کش بده
                    return caches.match(event.request);
                })
        );
    } else {
        // بقیه فایل‌ها: Cache First
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;

                return fetch(event.request).then((response) => {
                    // فقط پاسخ‌های موفق رو کش کن
                    if (!response || response.status !== 200) return response;

                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                });
            })
        );
    }
});

// ==========================================
// پیام از سمت کلاینت (مثلاً برای پاک کردن کش)
// ==========================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
        });
    }
});
