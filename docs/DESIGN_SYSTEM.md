🎨 سیستم طراحی شمعدون (Design System)
نسخه: 1.0
آخرین به‌روزرسانی: مهر ۱۴۰۵
مسئول: مهدی (بنیان‌گذار)

🎯 هدف
این سند، مرجع واحد طراحی برای همه‌ی صفحات شمعدونه. هر رنگی، هر فاصله‌ای، هر فونتی که استفاده می‌شه، اینجا تعریف شده.

چرا این سند؟

✅ یکنواختی در همه‌ی صفحات

✅ سرعت در توسعه (کپی-پیست)

✅ هماهنگی تیم (اگه بزرگ شد)

✅ مرجع برای بازبینی ۶ ماه بعد

🎨 ۱. پالت رنگی
🌙 حالت تاریک (Dark — پیش‌فرض شب)
css
:root {
  /* پس‌زمینه */
  --bg-primary:   #0a0a0f;   /* مشکی عمیق — پس‌زمینه کل */
  --bg-secondary: #14141c;   /* تیره — کارت‌های فرعی */
  --bg-card:      #1a1a24;   /* تیره روشن — کارت اصلی */

  /* رنگ برند — طلایی */
  --gold:         #d4af37;   /* طلایی اصلی */
  --gold-light:   #f4d47c;   /* طلایی روشن */
  --gold-dark:    #a8862a;   /* طلایی تیره */

  /* رنگ‌های معنایی */
  --green:        #10b981;   /* سود، موفقیت */
  --red:          #ef4444;   /* ضرر، خطا */
  --blue:         #3b82f6;   /* اطلاعات، آموزش */
  --purple:       #8b5cf6;   /* AI، هوشمند */
  --cyan:         #22d3ee;   /* بازار زنده */
  --orange:       #f97316;   /* هشدار ملایم */

  /* متن */
  --white:        #f8fafc;   /* متن اصلی */
  --gray:         #94a3b8;   /* متن فرعی */

  /* حاشیه */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-gold:   rgba(212, 175, 55, 0.3);

  /* Navbar */
  --navbar-bg: rgba(10, 10, 15, 0.92);
}
☀️ حالت روشن (Light — پیش‌فرض روز)
css
[data-theme="light"] {
  /* پس‌زمینه */
  --bg-primary:   #f8fafc;   /* روشن */
  --bg-secondary: #eef2f7;   /* کمی تیره‌تر */
  --bg-card:      #ffffff;   /* سفید */

  /* طلایی — تیره‌تر برای کنتراست روی سفید */
  --gold:         #b8860b;
  --gold-light:   #d4af37;
  --gold-dark:    #8b6508;

  /* رنگ‌های معنایی */
  --green:        #059669;
  --red:          #dc2626;
  --blue:         #2563eb;
  --purple:       #7c3aed;
  --cyan:         #0891b2;
  --orange:       #ea580c;

  /* متن */
  --white:        #0f172a;   /* متن تیره */
  --gray:         #64748b;

  /* حاشیه */
  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-gold:   rgba(184, 134, 11, 0.3);

  /* Navbar */
  --navbar-bg: rgba(248, 250, 252, 0.92);
}
🎯 ۲. قواعد استفاده از رنگ
✅ درست
متن اصلی: از --white استفاده کن

متن فرعی: از --gray استفاده کن

خط جداکننده: از --border-subtle یا --border-gold

دکمه CTA: از gradient طلایی (gold → gold-dark)

حالت موفق: از --green استفاده کن

خطا: از --red

AI/هوشمند: از --purple

بازار زنده: از --cyan

❌ اشتباه
❌ رنگ hardcode مثل #0a0a0f مستقیم توی استایل

❌ استفاده از چند رنگ متفاوت برای یه مفهوم

❌ رنگ‌های اضافی که توی پالت نیستن

❌ متن خاکستری روی پس‌زمینه خاکستری (کنتراست کم)

🔤 ۳. فونت‌ها
فونت اصلی: Vazirmatn
html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
css
body {
  font-family: 'Vazirmatn', Tahoma, sans-serif;
}
وزن‌های استفاده‌شده
وزن	عدد	کاربرد
Regular	400	متن اصلی، توضیحات
Medium	500	زیرعنوان
Bold	700	دکمه‌ها، لیبل‌ها
ExtraBold	800	عنوان کارت
Black	900	H1، اعداد بزرگ
فونت جایگزین (Fallback)
text
Tahoma, sans-serif
📏 ۴. اندازه‌های فونت (Type Scale)
عنصر	دسکتاپ	موبایل	وزن	خط
H1 صفحه	36-42px	26px	900	1.3
H2 بخش	20-24px	18px	800	1.4
H3 کارت	16-18px	14-15px	800	1.5
متن اصلی	15-16px	13.5-14px	400-500	1.9
متن فرعی	13-14px	12-13px	500	1.7
کوچک (Badge)	10-12px	10px	700-800	1.4
ارتفاع خط (line-height)
نوع	مقدار
عنوان‌ها	1.3 - 1.5
متن اصلی	1.8 - 2.0
متن فشرده	1.6 - 1.7
📐 ۵. سیستم فاصله (Spacing System)
فاصله‌ها بر اساس مضرب‌های ۴px تعریف می‌شن:

css
--space-xs:  4px;    /* داخل badge */
--space-sm:  8px;    /* بین آیکون و متن */
--space-md:  12px;   /* بین عناصر هم‌رده */
--space-lg:  16px;   /* padding کارت کوچک */
--space-xl:  24px;   /* padding کارت اصلی */
--space-2xl: 32px;   /* بین بخش‌ها */
--space-3xl: 48px;   /* بین بخش‌های اصلی */
--space-4xl: 64px;   /* header به content */
کاربرد در عمل
موقعیت	مقدار
فاصله‌ی آیکون تا متن	--space-sm (8px)
gap بین کارت‌ها	--space-lg یا --space-xl
padding کارت معمولی	--space-xl (24px)
padding کارت اصلی	25-35px
فاصله بین بخش‌های صفحه	--space-2xl (32px)
فاصله header از navbar	100px
🔘 ۶. شعاع گوشه‌ها (Border Radius)
عنصر	شعاع
دکمه کوچک	8px
دکمه اصلی	12px
input/textarea	10-12px
کارت کوچک	15px
کارت اصلی	18-20px
Modal	20-25px
Badge	20px (قرصی)
آواتار	50% (دایره)
tooltip	8px
🎭 ۷. سایه‌ها (Shadows)
css
--shadow-sm:  0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-md:  0 5px 20px rgba(212, 175, 55, 0.15);
--shadow-lg:  0 15px 40px rgba(212, 175, 55, 0.2);
--shadow-xl:  0 25px 70px rgba(0, 0, 0, 0.6);
--shadow-gold: 0 10px 30px rgba(212, 175, 55, 0.3);
کاربرد
موقعیت	سایه
کارت معمولی	--shadow-md
کارت hover	--shadow-lg
Modal	--shadow-xl
دکمه CTA	--shadow-gold
Dropdown	--shadow-lg
🎬 ۸. انیمیشن‌ها
انیمیشن‌های موجود
نام	مدت	کاربرد	تعریف
fadeInUp	0.6s	ورود کارت‌ها	translateY(30px) → 0
fadeIn	0.3s	ظاهر شدن ساده	opacity 0 → 1
float	3s	لوگو، آیکون	translateY ±10px
pulse	1.5s	نقطه زنده	scale + opacity
spin	1s	Loading	rotate 360°
slideDown	0.4s	باز شدن FAQ	max-height
gradientShift	4s	دکمه CTA	background-position
shine	3s	درخشش دکمه	left -100% → 100%
typing	1.4s	Typing indicator	translateY + opacity
Transition استاندارد
css
transition: 0.3s ease;
قواعد
مدت: بین 0.2s تا 0.6s برای UI

مدت: بین 2s تا 4s برای loop ها

Easing: ease یا ease-out برای ورود، ease-in برای خروج

هرگز: انیمیشن طولانی‌تر از ۱ ثانیه برای تعامل کاربر

🧩 ۹. کامپوننت‌های پایه
۹.۱ دکمه‌ها
دکمه اصلی (Primary)
css
.btn-primary {
  padding: 14px 30px;
  background: linear-gradient(135deg, var(--gold), var(--gold-dark));
  color: #ffffff;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: var(--shadow-gold);
  border: none;
  font-family: inherit;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(212, 175, 55, 0.5);
}
دکمه ثانویه (Secondary)
css
.btn-secondary {
  padding: 12px 24px;
  background: rgba(20, 20, 28, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--white);
  border-radius: 12px;
  font-family: inherit;
}
.btn-secondary:hover {
  border-color: var(--gold);
  color: var(--gold);
}
دکمه موفق (Success)
css
.btn-success {
  background: linear-gradient(135deg, var(--green), #059669);
  color: #ffffff;
}
دکمه خطر (Danger)
css
.btn-danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--red);
  border: 1px solid rgba(239, 68, 68, 0.3);
}
۹.۲ کارت‌ها
کارت اصلی (Card)
css
.card {
  background: linear-gradient(135deg, var(--bg-card), var(--bg-secondary));
  border: 1px solid var(--border-gold);
  border-radius: 20px;
  padding: 25px;
  transition: 0.3s;
}
.card:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: var(--shadow-lg);
}
۹.۳ Input ها
css
.input {
  width: 100%;
  padding: 13px 16px;
  background: rgba(10, 10, 15, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: var(--white);
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: 0.3s;
}
.input:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
}
۹.۴ Badge ها
css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 800;
  background: rgba(212, 175, 55, 0.15);
  color: var(--gold);
  border: 1px solid rgba(212, 175, 55, 0.3);
}
📱 ۱۰. Breakpoint ها
css
/* موبایل کوچک */
@media (max-width: 500px) { ... }

/* موبایل */
@media (max-width: 600px) { ... }

/* تبلت کوچک */
@media (max-width: 700px) { ... }

/* تبلت */
@media (max-width: 900px) { ... }

/* دسکتاپ کوچک */
@media (max-width: 1000px) { ... }

/* دسکتاپ */
/* بدون media query */
استراتژی Mobile First
اول موبایل طراحی می‌کنیم

بعد با min-width اضافه می‌کنیم

یا با max-width تخصصی می‌کنیم

سایز فونت‌های Responsive
عنصر	دسکتاپ	تبلت	موبایل
H1	42px	32px	26px
H2	24px	20px	18px
متن	16px	15px	14px
🎨 ۱۱. تم پویا بر اساس ساعت
منطق
javascript
function getAutoTheme() {
  const hour = new Date().getHours();
  // ۶ صبح تا ۶ عصر → روشن
  // ۶ عصر تا ۶ صبح → تاریک
  return (hour >= 6 && hour < 18) ? 'light' : 'dark';
}

function applyTheme() {
  const saved = localStorage.getItem('shamdun-theme');
  const auto = localStorage.getItem('shamdun-theme-auto');
  
  let theme;
  if (auto === 'true' || !saved) {
    theme = getAutoTheme();
  } else {
    theme = saved;
  }
  
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('snThemeIcon');
  if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
}
حالت‌های تم
حالت	آیکون	توضیح
تاریک	🌙	دستی توسط کاربر
روشن	☀️	دستی توسط کاربر
خودکار	🔄	بر اساس ساعت
✅ ۱۲. چک‌لیست استفاده
قبل از اینکه هر صفحه رو تموم کنی:

□ همه‌ی رنگ‌ها از var(--...) استفاده می‌کنن
□ هیچ رنگ hardcode توی استایل نیست
□ فونت Vazirmatn لود شده
□ تم روشن/تاریک کار می‌کنه
□ تم پویا فعاله (۶صبح/۶عصر)
□ Breakpoint ها چک شدن (500/600/700/900px)
□ انیمیشن‌ها زیر ۱ ثانیه هستن
□ سایه‌ها از --shadow-* استفاده می‌کنن
□ دکمه‌ها از .btn-* استفاده می‌کنن
□ کارت‌ها از .card استفاده می‌کنن
🔗 لینک‌های مرتبط
MASTER_PLAN.md — نقشه راه

FINANCIAL_SCORE.md — امتیاز مالی

COMPONENTS.md — کامپوننت‌ها

نگهدارنده: مهدی
نسخه بعدی: 1.1

