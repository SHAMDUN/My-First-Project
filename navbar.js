// ==========================================
// Navbar مشترک - آکادمی شمعدون
// نسخه نهایی - با Theme Toggle و Search
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
            top: 0;
            left: 0;
            right: 0;
            background: var(--navbar-bg, rgba(10, 10, 15, 0.92));
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(212, 175, 55, 0.15);
            z-index: 9998;
            padding: 12px 0;
            transition: background 0.3s;
        }
            [data-theme="light"] .sn-navbar {
            background: rgba(248, 250, 252, 0.95);
            border-bottom-color: rgba(184, 134, 11, 0.2);
        }
        [data-theme="light"] .sn-action-btn,
        [data-theme="light"] .sn-hamburger {
            background: rgba(184, 134, 11, 0.1);
            border-color: rgba(184, 134, 11, 0.3);
        }
        [data-theme="light"] .sn-brand-text,
        [data-theme="light"] .sn-action-btn {
            color: #b8860b;
        }
        [data-theme="light"] .sn-action-btn svg {
            stroke: #b8860b;
        }
        [data-theme="light"] .sn-hamburger span {
            background: #b8860b;
        }
        [data-theme="light"] .sn-dict-btn {
            color: #b8860b;
            border-color: rgba(184, 134, 11, 0.4);
        }
        [data-theme="light"] .sn-login-btn {
            color: #b8860b;
            border-color: rgba(184, 134, 11, 0.4);
        }
        [data-theme="light"] .sn-sidebar {
            background: linear-gradient(180deg, #f1f5f9, #f8fafc);
        }
        [data-theme="light"] .sn-sidebar-header {
            background: #f1f5f9;
        }
        [data-theme="light"] .sn-menu-item {
            color: #334155;
        }
        [data-theme="light"] .sn-menu-item:hover {
            background: rgba(184, 134, 11, 0.1);
            color: #b8860b;
        }
        [data-theme="light"] .sn-search-box {
            background: #ffffff;
        }
        [data-theme="light"] .sn-search-input {
            color: #0f172a;
        }
        [data-theme="light"] .sn-search-result {
            color: #0f172a;
        }
        [data-theme="light"] .sn-menu-group-title {
            color: #64748b;
        }
        .sn-navbar-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }
        .sn-hamburger {
            width: 42px;
            height: 42px;
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
            width: 18px;
            height: 2px;
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
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: 2px solid #d4af37;
            object-fit: cover;
        }
        .sn-brand-text {
            color: #d4af37;
            font-size: 17px;
            font-weight: 800;
        }
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
        .sn-action-btn {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: rgba(212, 175, 55, 0.08);
            border: 1px solid rgba(212, 175, 55, 0.25);
            color: #d4af37;
            font-size: 18px;
            cursor: pointer;
            transition: 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            flex-shrink: 0;
            font-family: inherit;
        }
        .sn-action-btn:hover {
            background: rgba(212, 175, 55, 0.2);
            transform: scale(1.05);
        }
        .sn-action-btn svg {
            stroke: #d4af37;
        }
        .sn-user-area {
            display: flex;
            align-items: center;
            gap: 8px;
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
            white-space: nowrap;
        }
        .sn-login-btn:hover {
            background: rgba(212, 175, 55, 0.2);
        }
        .sn-user-avatar {
            width: 42px;
            height: 42px;
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
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
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
            width: 34px;
            height: 34px;
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
        .sn-search-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 20000;
            opacity: 0;
            visibility: hidden;
            transition: 0.3s;
            padding: 20px;
            overflow-y: auto;
        }
        .sn-search-overlay.show {
            opacity: 1;
            visibility: visible;
        }
        .sn-search-box {
            max-width: 700px;
            margin: 60px auto;
            background: #1a1a24;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .sn-search-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 18px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .sn-search-icon {
            font-size: 22px;
            color: #d4af37;
        }
        .sn-search-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #f8fafc;
            font-size: 16px;
            font-family: 'Vazirmatn', Tahoma, sans-serif;
            padding: 8px 0;
        }
        .sn-search-input::placeholder {
            color: #94a3b8;
        }
        .sn-search-close {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
            width: 34px;
            height: 34px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-family: inherit;
            flex-shrink: 0;
        }
        .sn-search-results {
            max-height: 60vh;
            overflow-y: auto;
            padding: 10px;
        }
        .sn-search-empty {
            text-align: center;
            padding: 40px 20px;
            color: #94a3b8;
            font-size: 14px;
            font-family: 'Vazirmatn', Tahoma, sans-serif;
        }
        .sn-search-result {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px;
            border-radius: 12px;
            text-decoration: none;
            color: #f8fafc;
            transition: 0.2s;
            font-family: 'Vazirmatn', Tahoma, sans-serif;
        }
        .sn-search-result:hover {
            background: rgba(212, 175, 55, 0.1);
        }
        .sn-search-result-icon {
            width: 42px;
            height: 42px;
            border-radius: 10px;
            background: rgba(212, 175, 55, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }
        .sn-search-result-info {
            flex: 1;
            min-width: 0;
        }
        .sn-search-result-title {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .sn-search-result-type {
            font-size: 11px;
            color: #94a3b8;
        }
        .sn-search-section {
            padding: 8px 14px 4px;
            font-size: 11px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
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
            .sn-brand-logo {
                width: 34px;
                height: 34px;
            }
            .sn-hamburger {
                width: 38px;
                height: 38px;
            }
            .sn-action-btn {
                width: 38px;
                height: 38px;
                font-size: 16px;
            }
            .sn-user-avatar {
                width: 38px;
                height: 38px;
                font-size: 13px;
            }
            .sn-navbar-container {
                padding: 0 12px;
                gap: 6px;
            }
            .sn-login-btn {
                padding: 8px 12px;
                font-size: 11px;
            }
            .sn-search-box {
                margin: 20px auto;
            }
        }
    `;

    // ===== Theme System =====
    function initTheme() {
        const savedTheme = localStorage.getItem('shamdun-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('shamdun-theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        const icon = document.getElementById('snThemeIcon');
        if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

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
                    <button class="sn-action-btn" id="snSearchBtn" aria-label="جستجو" title="جستجو">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                            <circle cx="11" cy="11" r="7"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                    <button class="sn-action-btn" id="snThemeBtn" aria-label="تغییر تم" title="تغییر تم">
                        <span id="snThemeIcon">🌙</span>
                    </button>
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
            <!-- Search Modal -->
            <div class="sn-search-overlay" id="snSearchOverlay">
                <div class="sn-search-box">
                    <div class="sn-search-header">
                        <span class="sn-search-icon">🔍</span>
                        <input type="text" id="snSearchInput" class="sn-search-input" placeholder="جستجو در مقالات، دوره‌ها، دانش‌نامه...">
                        <button class="sn-search-close" id="snSearchClose">✕</button>
                    </div>
                    <div class="sn-search-results" id="snSearchResults">
                        <div class="sn-search-empty">
                            <p>🔍 جستجو کن توی مقالات، دوره‌ها، دانش‌نامه</p>
                            <p style="font-size:12px; margin-top:10px; opacity:0.7;">حداقل ۲ حرف بنویس</p>
                        </div>
                    </div>
                </div>
            </div>
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

    // ===== Search System =====
    const SEARCH_DATA = {
        articles: [
            { title: 'کریپتوکارنسی در ۱۴۰۵', url: 'blog-post.html?slug=crypto-1405-professional-strategies', icon: '📝', type: 'مقاله' },
            { title: 'الگوریتمی شدن بازار', url: 'blog-post.html?slug=algorithmic-markets-hidden-reality', icon: '📝', type: 'مقاله' },
            { title: 'Dark Pools و OTC', url: 'blog-post.html?slug=dark-pools-otc-invisible-markets', icon: '📝', type: 'مقاله' },
            { title: 'On-Chain Analytics', url: 'blog-post.html?slug=on-chain-analytics-blockchain-signals', icon: '📝', type: 'مقاله' },
            { title: 'مشتقات و Funding Rate', url: 'blog-post.html?slug=derivatives-funding-rate-market-mechanics', icon: '📝', type: 'مقاله' },
            { title: 'اقتصاد ایران ۱۴۰۵', url: 'blog-post.html?slug=iran-economy-1405-stagflation-recovery', icon: '📝', type: 'مقاله' },
            { title: 'AI در معاملات', url: 'blog-post.html?slug=ai-trading-reality-vs-hype', icon: '📝', type: 'مقاله' }
        ],
        courses: [
            { title: 'اقتصاد کلان و خرد', url: 'courses.html', icon: '📚', type: 'دوره' },
            { title: 'آشنایی با بازارهای مالی', url: 'courses.html', icon: '📚', type: 'دوره' },
            { title: 'مبانی تحلیل تکنیکال', url: 'courses.html', icon: '📚', type: 'دوره' },
            { title: 'تحلیل بنیادی', url: 'courses.html', icon: '📚', type: 'دوره' },
            { title: 'مدیریت ریسک', url: 'courses.html', icon: '📚', type: 'دوره' },
            { title: 'روانشناسی بازار', url: 'courses.html', icon: '📚', type: 'دوره' }
        ],
        pages: [
            { title: 'نمای بازار', url: 'home.html', icon: '📊', type: 'صفحه' },
            { title: 'بورس ایران', url: 'bourse.html', icon: '📈', type: 'صفحه' },
            { title: 'اخبار اقتصادی', url: 'news.html', icon: '📰', type: 'صفحه' },
            { title: 'دانش‌نامه اقتصادی', url: 'dictionary.html', icon: '🎓', type: 'صفحه' },
            { title: 'دستیار هوشمند', url: 'assistant.html', icon: '🤖', type: 'صفحه' },
            { title: 'پرتفوی من', url: 'portfolio.html', icon: '💼', type: 'صفحه' },
            { title: 'تست شخصیت مالی', url: 'personality-test.html', icon: '🧠', type: 'صفحه' }
        ]
    };

    function setupSearch() {
        const searchBtn = document.getElementById('snSearchBtn');
        const searchOverlay = document.getElementById('snSearchOverlay');
        const searchClose = document.getElementById('snSearchClose');
        const searchInput = document.getElementById('snSearchInput');
        const searchResults = document.getElementById('snSearchResults');

        function openSearch() {
            searchOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            setTimeout(() => searchInput.focus(), 100);
        }
        function closeSearch() {
            searchOverlay.classList.remove('show');
            document.body.style.overflow = '';
            searchInput.value = '';
            searchResults.innerHTML = `
                <div class="sn-search-empty">
                    <p>🔍 جستجو کن توی مقالات، دوره‌ها، دانش‌نامه</p>
                    <p style="font-size:12px; margin-top:10px; opacity:0.7;">حداقل ۲ حرف بنویس</p>
                </div>
            `;
        }

        function performSearch(query) {
            if (!query || query.length < 2) {
                searchResults.innerHTML = `
                    <div class="sn-search-empty">
                        <p>🔍 جستجو کن توی مقالات، دوره‌ها، دانش‌نامه</p>
                        <p style="font-size:12px; margin-top:10px; opacity:0.7;">حداقل ۲ حرف بنویس</p>
                    </div>
                `;
                return;
            }
            const q = query.toLowerCase();
            const results = [];
            SEARCH_DATA.articles.forEach(item => {
                if (item.title.toLowerCase().includes(q)) results.push(item);
            });
            SEARCH_DATA.courses.forEach(item => {
                if (item.title.toLowerCase().includes(q)) results.push(item);
            });
            SEARCH_DATA.pages.forEach(item => {
                if (item.title.toLowerCase().includes(q)) results.push(item);
            });

            if (results.length === 0) {
                searchResults.innerHTML = `
                    <div class="sn-search-empty">
                        <p>❌ نتیجه‌ای پیدا نشد برای: <strong>${query}</strong></p>
                        <p style="font-size:12px; margin-top:10px; opacity:0.7;">یه کلمه دیگه امتحان کن</p>
                    </div>
                `;
                return;
            }

            searchResults.innerHTML = results.map(r => `
                <a href="${r.url}" class="sn-search-result">
                    <div class="sn-search-result-icon">${r.icon}</div>
                    <div class="sn-search-result-info">
                        <div class="sn-search-result-title">${r.title}</div>
                        <div class="sn-search-result-type">${r.type}</div>
                    </div>
                </a>
            `).join('');
        }

        searchBtn.addEventListener('click', openSearch);
        searchClose.addEventListener('click', closeSearch);
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) closeSearch();
        });
        searchInput.addEventListener('input', (e) => performSearch(e.target.value));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('show')) closeSearch();
        });
    }

    // ===== Theme Button =====
    function setupTheme() {
        const themeBtn = document.getElementById('snThemeBtn');
        if (!themeBtn) return;
        
        // ✅ Clone برای حذف listenerهای قبلی
        const newBtn = themeBtn.cloneNode(true);
        themeBtn.parentNode.replaceChild(newBtn, themeBtn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = current === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('shamdun-theme', newTheme);
            
            const icon = document.getElementById('snThemeIcon');
            if (icon) icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
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
        initTheme();
        createNavbar();
        setupSidebar();
        setupSearch();
        highlightCurrentPage();
        setTimeout(checkUser, 200);
        
        // ✅ دکمه تم بعد از ساخته شدن navbar (با تأخیر بیشتر)
        setTimeout(() => {
            setupTheme();
            // ✅ آیکون رو هم آپدیت کن
            const saved = localStorage.getItem('shamdun-theme') || 'dark';
            const icon = document.getElementById('snThemeIcon');
            if (icon) icon.textContent = saved === 'dark' ? '🌙' : '☀️';
        }, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
