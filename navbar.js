// ==========================================
// Navbar مشترک - آکادمی شمعدون
// نسخه نهایی - ساختار کامل
// ==========================================

(function() {
    'use strict';

    // ===== آیتم‌های منو (گروه‌بندی شده) =====
    const NAV_GROUPS = [
        {
            title: 'بازار و تحلیل',
            items: [
                { href: 'index.html', icon: '🏠', label: 'صفحه اصلی' },
                { href: 'home.html', icon: '📊', label: 'نمای بازار' },
                { href: 'bourse.html', icon: '📈', label: 'بورس ایران' },
                { href: 'news.html', icon: '📰', label: 'اخبار اقتصادی' },
                { href: 'analysis.html', icon: '📉', label: 'تحلیل اقتصادی' }
            ]
        },
        {
            title: 'آموزش',
            items: [
                { href: 'dictionary.html', icon: '🎓', label: 'دانش‌نامه اقتصادی' },
                { href: 'courses.html', icon: '📚', label: 'دوره‌های آموزشی' },
                { href: 'personality-test.html', icon: '🧠', label: 'آزمون خودشناسی مالی' },
                { href: 'assistant.html', icon: '🤖', label: 'دستیار هوشمند' }
            ]
        },
        {
            title: 'ابزارهای مالی',
            items: [
                { href: 'calculator.html', icon: '🧮', label: 'ماشین‌حساب مالی' },
                { href: 'portfolio.html', icon: '💼', label: 'پرتفوی من' }
            ]
        },
        {
            title: 'آکادمی',
            items: [
                { href: 'blog.html', icon: '📝', label: 'وبلاگ' },
                { href: 'about.html', icon: '👥', label: 'درباره ما' },
                { href: 'contact.html', icon: '📞', label: 'تماس با ما' }
            ]
        }
    ];

    // ===== CSS =====
    const css = `
        .sn-navbar {
            position: fixed;
            top: 0; left: 0; right: 0;
            background: rgba(10, 10, 15, 0.92);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(212, 175, 55, 0.15);
            z-index: 9998;
            padding: 12px 0;
        }
        .sn-navbar-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
        }
        .sn-hamburger {
            width: 42px; height: 42px;
            border-radius: 12px;
            background: rgba(212, 175, 55, 0.08);
            border: 1px solid rgba(212, 175, 55, 0.25);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            cursor: pointer;
            padding: 0;
            flex-shrink: 0;
            transition: 0.25s;
        }
        .sn-hamburger:hover {
            background: rgba(212, 175, 55, 0.2);
        }
        .sn-hamburger span {
            display: block;
            width: 18px; height: 2px;
            background: #d4af37;
            border-radius: 2px;
        }
        .sn-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            justify-content: center;
        }
        .sn-brand-logo {
            width: 38px; height: 38px;
            border-radius: 50%;
            border: 2px solid #d4af37;
            object-fit: cover;
        }
        .sn-brand-text {
            color: #d4af37;
            font-size: 17px;
            font-weight: 800;
        }

        /* دکمه دانش‌نامه */
        .sn-dict-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
            border: 1px solid rgba(212, 175, 55, 0.35);
            border-radius: 12px;
            color: #d4af37;
            font-size: 13px;
            font-weight: 700;
            text-decoration: none;
            font-family: inherit;
            white-space: nowrap;
            transition: 0.3s;
            flex-shrink: 0;
        }
        .sn-dict-btn:hover {
            background: linear-gradient(135deg, #d4af37, #a8862a);
            color: #0a0a0f;
            box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
        }

        .sn-user-area {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 42px;
            justify-content: flex-end;
            flex-shrink: 0;
        }
        .sn-login-btn {
            color: #d4af37;
            text-decoration: none;
            font-size: 12px;
            font-weight: 700;
            padding: 9px 16px;
            border-radius: 10px;
            border: 1px solid rgba(212, 175, 55, 0.4);
            background: rgba(212, 175, 55, 0.08);
            transition: 0.25s;
        }
        .sn-login-btn:hover {
            background: rgba(212, 175, 55, 0.2);
        }
        .sn-user-avatar {
            width: 42px; height: 42px;
            border-radius: 50%;
            background: linear-gradient(135deg, #d4af37, #a8862a);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0a0a0f;
            font-weight: 900;
            font-size: 15px;
            border: 2px solid #d4af37;
            text-decoration: none;
        }
        .sn-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: 0.3s;
        }
        .sn-overlay.show {
            opacity: 1;
            visibility: visible;
        }
        .sn-sidebar {
            position: fixed;
            top: 0;
            right: -340px;
            width: 320px;
            height: 100vh;
            background: linear-gradient(180deg, #14141c, #0a0a0f);
            border-left: 1px solid rgba(212, 175, 55, 0.2);
            z-index: 10000;
            transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
            box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
        }
        .sn-sidebar.show {
            right: 0;
        }
        .sn-sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid rgba(212, 175, 55, 0.15);
            position: sticky;
            top: 0;
            background: #14141c;
            z-index: 2;
        }
        .sn-close {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
            width: 34px; height: 34px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-family: inherit;
            transition: 0.25s;
        }
        .sn-close:hover {
            background: rgba(239, 68, 68, 0.25);
        }
        .sn-sidebar-content {
            padding: 15px;
        }
        .sn-menu-group {
            margin-bottom: 18px;
        }
        .sn-menu-group:last-child {
            margin-bottom: 0;
        }
        .sn-menu-group-title {
            color: #64748b;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 0 14px 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .sn-menu-group-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(212, 175, 55, 0.15);
        }
        .sn-menu-section {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .sn-menu-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            border-radius: 12px;
            text-decoration: none;
            color: #cbd5e1;
            font-size: 14px;
            font-weight: 600;
            transition: 0.25s;
            border: 1px solid transparent;
        }
        .sn-menu-item:hover {
            background: rgba(212, 175, 55, 0.08);
            color: #d4af37;
            border-color: rgba(212, 175, 55, 0.2);
            transform: translateX(-4px);
        }
        .sn-menu-item.active {
            background: rgba(212, 175, 55, 0.15);
            color: #d4af37;
            border-color: rgba(212, 175, 55, 0.4);
        }
        .sn-menu-icon {
            font-size: 20px;
            width: 26px;
            text-align: center;
            flex-shrink: 0;
        }
        .sn-menu-label {
            flex: 1;
        }
        .sn-menu-divider {
            height: 1px;
            background: rgba(212, 175, 55, 0.15);
            margin: 15px 0;
        }
        .sn-logout {
            color: #f87171 !important;
        }
        .sn-logout:hover {
            background: rgba(239, 68, 68, 0.1) !important;
            color: #ef4444 !important;
        }
        @media (max-width: 700px) {
            .sn-sidebar {
                width: 290px;
                right: -310px;
            }
            .sn-sidebar.show {
                right: 0;
            }
            .sn-brand-text {
                display: none;
            }
            .sn-dict-btn {
                padding: 8px 10px;
                font-size: 12px;
            }
            .sn-dict-btn .sn-dict-text {
                display: none;
            }
        }
        @media (max-width: 500px) {
            .sn-brand-logo { width: 34px; height: 34px; }
            .sn-hamburger { width: 38px; height: 38px; }
            .sn-user-avatar { width: 38px; height: 38px; font-size: 13px; }
            .sn-navbar-container { padding: 0 12px; gap: 8px; }
        }
    `;

    // ===== ساخت Navbar =====
    function createNavbar() {
        const styleEl = document.createElement('style');
        styleEl.textContent = css;
        document.head.appendChild(styleEl);

        // گروه‌ها
        const groupsHTML = NAV_GROUPS.map(group => `
            <div class="sn-menu-group">
                <div class="sn-menu-group-title">${group.title}</div>
                <div class="sn-menu-section">
                    ${group.items.map(item => `
                        <a href="${item.href}" class="sn-menu-item">
                            <span class="sn-menu-icon">${item.icon}</span>
                            <span class="sn-menu-label">${item.label}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `).join('');

        const navbarHTML = `
            <nav class="sn-navbar">
                <div class="sn-navbar-container">
                    <button class="sn-hamburger" id="snHamburger" aria-label="منو">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <a href="index.html" class="sn-brand">
                        <img src="519.png" alt="شمعدون" class="sn-brand-logo" onerror="this.style.display='none'">
                        <span class="sn-brand-text">شمعدون</span>
                    </a>
                    <a href="dictionary.html" class="sn-dict-btn" title="دانش‌نامه اقتصادی">
                        <span>🎓</span>
                        <span class="sn-dict-text">دانش‌نامه</span>
                    </a>
                    <div class="sn-user-area" id="snUserArea">
                        <a href="login.html" class="sn-login-btn">ورود</a>
                    </div>
                </div>
            </nav>

            <div class="sn-overlay" id="snOverlay"></div>

            <aside class="sn-sidebar" id="snSidebar">
                <div class="sn-sidebar-header">
                    <a href="index.html" class="sn-brand" style="justify-content:flex-start;">
                        <img src="519.png" alt="شمعدون" class="sn-brand-logo" onerror="this.style.display='none'">
                        <span class="sn-brand-text">شمعدون</span>
                    </a>
                    <button class="sn-close" id="snClose">✕</button>
                </div>

                <div class="sn-sidebar-content">
                    ${groupsHTML}

                    <div class="sn-menu-divider"></div>

                    <div class="sn-menu-section">
                        <a href="dashboard.html" class="sn-menu-item">
                            <span class="sn-menu-icon">👤</span>
                            <span class="sn-menu-label">پنل کاربری</span>
                        </a>
                        <a href="admin.html" class="sn-menu-item sn-admin-only" style="display:none; color:#fca5a5;">
                            <span class="sn-menu-icon">🎯</span>
                            <span class="sn-menu-label">پنل ادمین</span>
                        </a>
                        <a href="#" class="sn-menu-item sn-logout" id="snLogoutBtn" style="display:none;">
                            <span class="sn-menu-icon">🚪</span>
                            <span class="sn-menu-label">خروج</span>
                        </a>
                    </div>
                </div>
            </aside>
        `;

        document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    }

    // ===== باز/بسته کردن Sidebar =====
    function setupSidebar() {
        const hamburger = document.getElementById('snHamburger');
        const sidebar = document.getElementById('snSidebar');
        const overlay = document.getElementById('snOverlay');
        const closeBtn = document.getElementById('snClose');

        function openSidebar() {
            sidebar.classList.add('show');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        function closeSidebar() {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', openSidebar);
        closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSidebar();
        });
    }

    // ===== هایلایت صفحه فعلی =====
    function highlightCurrentPage() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.sn-menu-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPath) {
                item.classList.add('active');
            }
        });
    }

    // ===== چک کردن کاربر =====
    function checkUser() {
        try {
            if (typeof supabase === 'undefined') return;

            const SUPABASE_URL = 'https://jcwwilatvstjrohvhtss.supabase.co';
            const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjd3dpbGF0dnN0anJvaHZodHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MDY4NTYsImV4cCI6MjEwNTI4Mjg1Nn0.eUC89RJy6-60nNGrSeYeDADzLxz-kWTGy4DbNGVi6MM';

            const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

            client.auth.getSession().then(({ data }) => {
                const userArea = document.getElementById('snUserArea');
                const logoutBtn = document.getElementById('snLogoutBtn');

                if (data && data.session && data.session.user) {
                    const user = data.session.user;
                    const fullName = user.user_metadata?.full_name || user.email || 'کاربر';
                    const firstLetter = fullName.charAt(0).toUpperCase();

                    userArea.innerHTML = `
                        <a href="dashboard.html" class="sn-user-avatar" title="${fullName}">
                            ${firstLetter}
                        </a>
                    `;

                    if (logoutBtn) {
                        logoutBtn.style.display = 'flex';
                        logoutBtn.addEventListener('click', async (e) => {
                            e.preventDefault();
                            if (confirm('می‌خوای خارج بشی؟')) {
                                await client.auth.signOut();
                                window.location.href = 'login.html';
                            }
                        });
                    }

                    if (user.email === 'beat.market.office@gmail.com') {
                        document.querySelectorAll('.sn-admin-only').forEach(el => {
                            el.style.display = 'flex';
                        });
                    }
                }
            }).catch(err => {
                console.log('Navbar check error:', err);
            });
        } catch (e) {
            console.log('Navbar error:', e);
        }
    }

    // ===== راه‌اندازی =====
    function init() {
        createNavbar();
        setupSidebar();
        highlightCurrentPage();
        setTimeout(checkUser, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
