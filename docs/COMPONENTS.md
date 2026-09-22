🧩 کامپوننت‌های شمعدون (Components Library)
نسخه: 1.0
آخرین به‌روزرسانی: مهر ۱۴۰۵
مسئول: مهدی (بنیان‌گذار)

🎯 هدف
این سند، کتابخانه کامپوننت‌های قابل استفاده مجدد شمعدونه. هر کامپوننتی که توی چند صفحه استفاده می‌شه، اینجا تعریف شده.

چرا این سند؟

✅ سرعت در توسعه (کپی-پیست)

✅ یکنواختی بصری

✅ کاهش باگ

✅ راحتی تغییر (یه جا تغییر، همه‌جا اعمال)

📋 فهرست کامپوننت‌ها
#	کامپوننت	کاربرد	صفحه‌ها
۱	Navbar	نوار بالا	همه
۲	Sidebar	منوی کناری	همه
۳	Theme Button	دکمه تم	همه
۴	Market Ticker	قیمت زنده	calculator-v2
۵	Score Card	امتیاز مالی	calculator-v2, dashboard
۶	Tool Card	کارت ابزار	calculator-v2
۷	Scenario Card	کارت سناریو	calculator-v2
۸	Info Card	توضیح آموزشی	calculator, courses
۹	Edu Card	«این چیه؟»	calculator
۱۰	Result Card	نتیجه محاسبه	calculator
۱۱	Toast	پیام موقت	همه
۱۲	Modal	پنجره بازشو	dashboard, calculator
۱۳	CTA Box	فراخوان	about, faq, calculator
۱۴	Loading Spinner	در حال بارگذاری	همه
۱. 📌 Navbar
کاربرد
نوار بالای همه صفحات با لوگو، hamburger، دکمه تم، و آواتار کاربر.

HTML
html
<nav class="sn-navbar">
  <div class="sn-navbar-container">
    <button class="sn-hamburger" id="snHamburger" aria-label="منو">
      <span></span><span></span><span></span>
    </button>
    
    <a href="index.html" class="sn-brand">
      <img src="519.png" alt="شمعدون" class="sn-brand-logo" onerror="this.style.display='none'">
      <span class="sn-brand-text">شمعدون</span>
    </a>
    
    <button class="sn-theme-btn" id="snThemeBtn" aria-label="تغییر تم">
      <span id="snThemeIcon">🌙</span>
    </button>
    
    <div class="sn-user-area" id="snUserArea"></div>
  </div>
</nav>
CSS (خلاصه)
css
.sn-navbar {
  position: fixed; top: 0; left: 0; right: 0;
  background: var(--navbar-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-gold);
  z-index: 9998;
  padding: 12px 0;
}
.sn-navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}
JS مورد نیاز
navbar.js (اگر مشترک)

یا addThemeButtonToNavbar() (اگر محلی)

۲. 📌 Sidebar (منوی کناری)
کاربرد
منوی کشویی که با کلیک روی hamburger باز می‌شه.

HTML
html
<div class="sn-overlay" id="snOverlay"></div>
<aside class="sn-sidebar" id="snSidebar">
  <div class="sn-sidebar-header">
    <a href="index.html" class="sn-brand">
      <img src="519.png" alt="شمعدون" class="sn-brand-logo">
      <span class="sn-brand-text">شمعدون</span>
    </a>
    <button class="sn-close" id="snClose">✕</button>
  </div>
  <div class="sn-sidebar-content">
    <div class="sn-menu-section">
      <a href="index.html" class="sn-menu-item">
        <span class="sn-menu-icon">🏠</span>
        <span class="sn-menu-label">صفحه اصلی</span>
      </a>
      <!-- بقیه آیتم‌ها -->
    </div>
  </div>
</aside>
JS
javascript
function setupNavbar() {
  const hamburger = document.getElementById('snHamburger');
  const sidebar = document.getElementById('snSidebar');
  const overlay = document.getElementById('snOverlay');
  const closeBtn = document.getElementById('snClose');

  hamburger.addEventListener('click', () => {
    sidebar.classList.add('show');
    overlay.classList.add('show');
  });
  closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
  });
}
۳. 📌 دکمه تغییر تم (Theme Button)
کاربرد
تغییر بین تم روشن/تاریک + پشتیبانی از تم خودکار.

HTML
html
<button class="sn-theme-btn" id="snThemeBtn" aria-label="تغییر تم">
  <span id="snThemeIcon">🌙</span>
</button>
CSS
css
.sn-theme-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.25);
  color: var(--gold);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}
JS
javascript
function initThemeButton() {
  const btn = document.getElementById('snThemeBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('shamdun-theme', newTheme);
    localStorage.setItem('shamdun-theme-auto', 'false');
    const icon = document.getElementById('snThemeIcon');
    if (icon) icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
  });
}
۴. 📌 Market Ticker (قیمت زنده بازار)
کاربرد
نوار افقی که قیمت‌های زنده‌ی طلا، دلار، بیت‌کوین رو نشون می‌ده.

HTML
html
<div class="market-ticker">
  <div class="label">
    <span class="live"></span>
    <span>بازار زنده</span>
  </div>
  <div class="market-prices" id="marketPrices">
    <!-- پر می‌شه با JS -->
  </div>
</div>
CSS
css
.market-ticker {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(212, 175, 55, 0.02));
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 18px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.market-ticker .live {
  width: 6px; height: 6px;
  background: var(--green);
  border-radius: 50%;
  animation: pulse 1.2s infinite;
}
JS
javascript
async function loadMarketPrices() {
  try {
    const data = await fetch('https://Api.BrsApi.ir/Market/Gold_Currency.php?key=...');
    const json = await data.json();
    // رندر قیمت‌ها
  } catch (e) {
    console.warn('Market data failed:', e);
  }
}
۵. 📌 Score Card (امتیاز مالی)
کاربرد
نمایش امتیاز مالی کاربر با دایره‌ی SVG.

HTML
html
<div class="score-card">
  <div class="score-circle">
    <svg viewBox="0 0 100 100">
      <circle class="bg-circle" cx="50" cy="50" r="45"/>
      <circle class="progress-circle" cx="50" cy="50" r="45"/>
    </svg>
    <div class="score-value">۷۸</div>
  </div>
  <div class="score-info">
    <h3>🏆 امتیاز مالی شما: <span class="gold">۷۸ از ۱۰۰</span></h3>
    <p>توضیحات...</p>
    <div class="score-badges">
      <span class="score-badge">✓ تنوع خوب</span>
    </div>
  </div>
</div>
CSS (خلاصه)
css
.score-card {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(212, 175, 55, 0.03));
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 22px;
  padding: 25px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 25px;
  align-items: center;
}
.score-circle {
  width: 110px;
  height: 110px;
  position: relative;
}
JS
javascript
function renderScoreCard(score) {
  const value = document.querySelector('.score-value');
  value.textContent = toFa(score);
  
  const circle = document.querySelector('.progress-circle');
  const dasharray = 2 * Math.PI * 45;
  const offset = dasharray * (1 - score / 100);
  circle.style.strokeDashoffset = offset;
}
۶. 📌 Tool Card (کارت ابزار)
کاربرد
نمایش هر ابزار مالی به شکل یه کارت Visual (جایگزین تب).

HTML
html
<div class="tool-card" onclick="openTool('dca')">
  <div class="tool-icon">💰</div>
  <h3>
    سرمایه‌گذاری ماهانه
    <span class="popular">🔥 محبوب</span>
  </h3>
  <p>هر ماه یه مبلغ ثابت سرمایه‌گذاری کن...</p>
  <div class="tool-footer">
    <span class="tool-stats">👥 <strong>۱۲۴۸</strong> کاربر امروز</span>
    <span class="tool-arrow">←</span>
  </div>
</div>
CSS
css
.tool-card {
  background: linear-gradient(135deg, var(--bg-card), var(--bg-secondary));
  border: 1px solid var(--border-gold);
  border-radius: 20px;
  padding: 22px;
  cursor: pointer;
  transition: 0.35s;
}
.tool-card:hover {
  transform: translateY(-6px);
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: var(--shadow-lg);
}
انواع Badge
.popular — 🔥 محبوب

.trending — 📈 ترند

.new — ✨ جدید

۷. 📌 Scenario Card (کارت سناریو)
کاربرد
نمایش یه سناریو در شبیه‌ساز با نمودار میل.

HTML
html
<div class="scenario-card winner">
  <div class="scenario-header">
    <span class="scenario-name">🥇 فقط طلا</span>
    <span class="scenario-tag best">🏆 بهترین</span>
  </div>
  <div class="scenario-value">۱.۸ میلیارد</div>
  <div class="scenario-return up">+۳۲.۵٪</div>
  <div class="scenario-bar">
    <div class="scenario-bar-fill" style="width: 85%"></div>
  </div>
</div>
CSS
css
.scenario-card {
  background: rgba(10, 10, 15, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 15px;
  padding: 16px;
}
.scenario-card.winner {
  border-color: rgba(16, 185, 129, 0.5);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.03));
}
.scenario-card.you {
  border-color: rgba(212, 175, 55, 0.5);
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(212, 175, 55, 0.03));
}
۸. 📌 Info Card (توضیح آموزشی)
کاربرد
کارت آبی‌رنگ برای توضیح یه مفهوم.

HTML
html
<div class="info-card">
  <div class="icon">📖</div>
  <div class="info-content">
    <div class="info-title">این صفحه چیه؟</div>
    <div class="info-text">توضیحات کامل...</div>
  </div>
</div>
CSS
css
.info-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.02));
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 20px;
  padding: 20px 25px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
}
۹. 📌 Edu Card (کارت «این چیه؟»)
کاربرد
کارت کوچک بالای هر ابزار که توضیح می‌ده چیکار می‌کنه.

HTML
html
<div class="edu-card">
  <div class="edu-icon">📖</div>
  <div class="edu-content">
    <div class="edu-title">این ابزار چیکار می‌کنه؟</div>
    <div class="edu-text">توضیح کوتاه...</div>
    <div class="edu-usage">
      <strong>💡 کاربرد:</strong> برنامه‌ریزی پس‌انداز ماهانه
    </div>
  </div>
</div>
۱۰. 📌 Result Card (نتیجه محاسبه)
کاربرد
کارت سبز که نتیجه‌ی محاسبه رو نشون می‌ده.

HTML
html
<div class="result-card show" id="result-dca">
  <h3>✅ نتیجه محاسبه</h3>
  <div class="result-grid">
    <div class="result-highlight">
      <div class="label">💎 سرمایه نهایی شما</div>
      <div class="value">۱۲۵ میلیون</div>
    </div>
    <div class="result-item gold">
      <div class="label">📊 سود کل</div>
      <div class="value green">۲۵ میلیون</div>
    </div>
  </div>
</div>
CSS
css
.result-card {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.03));
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 20px;
  padding: 25px;
  display: none;
}
.result-card.show { display: block; }
۱۱. 📌 Toast (پیام موقت)
کاربرد
پیام کوتاه که از پایین صفحه ظاهر می‌شه.

HTML
html
<div id="toast" class="toast"></div>
CSS
css
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: var(--bg-card);
  color: var(--white);
  padding: 14px 24px;
  border-radius: 12px;
  border-right: 4px solid var(--gold);
  box-shadow: var(--shadow-xl);
  z-index: 2000;
  transition: 0.4s;
  font-weight: 700;
}
.toast.show {
  transform: translateX(-50%) translateY(0);
}
.toast.success { border-right-color: var(--green); }
.toast.error { border-right-color: var(--red); }
JS
javascript
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.classList.remove('show'), 3000);
}
۱۲. 📌 Modal (پنجره بازشو)
کاربرد
پنجره‌ای که روی صفحه ظاهر می‌شه.

HTML
html
<div class="modal-overlay" id="myModal">
  <div class="modal-box">
    <div class="modal-header">
      <div class="modal-title">عنوان</div>
      <button class="modal-close" onclick="closeModal('myModal')">✕</button>
    </div>
    <div class="modal-body">
      محتوا
    </div>
  </div>
</div>
CSS
css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 99999;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-overlay.show { display: flex; }
JS
javascript
function openModal(id) {
  document.getElementById(id).classList.add('show');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}
۱۳. 📌 CTA Box (فراخوان)
کاربرد
کارت پایانی که کاربر رو به اقدام تشویق می‌کنه.

HTML
html
<div class="cta-box">
  <h3>💬 سوال دیگه‌ای داری؟</h3>
  <p>توضیحات...</p>
  <a href="contact.html" class="btn">📞 تماس با ما</a>
</div>
۱۴. 📌 Loading Spinner
کاربرد
نمایش در حال بارگذاری.

HTML
html
<div class="loading">
  <div class="spinner"></div>
  در حال بارگذاری...
</div>
CSS
css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(212, 175, 55, 0.2);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
✅ چک‌لیست استفاده از کامپوننت
قبل از استفاده از هر کامپوننت:

□ HTML رو کپی کردی
□ CSS رو از Design System گرفتی
□ JS رو اضافه کردی
□ توی تم روشن چک کردی
□ توی تم تاریک چک کردی
□ توی موبایل چک کردی
□ با داده‌ی خالی چک کردی
□ با داده‌ی پر چک کردی
□ کنسول خطا نداره
□ Accessible هست (aria-label, role)
🔗 لینک‌های مرتبط
MASTER_PLAN.md — نقشه راه

FINANCIAL_SCORE.md — امتیاز مالی

DESIGN_SYSTEM.md — سیستم طراحی

نگهدارنده: مهدی
نسخه بعدی: 1.1

