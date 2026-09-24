// ==========================================
// 📥 لود اطلاعات از pdfmaker_data
// ==========================================
function loadFromParams() {
    try {
        const savedData = localStorage.getItem('pdfmaker_data');
        
        if (!savedData) {
            return false;
        }
        
        const data = JSON.parse(savedData);
        
        // چک کن داده قدیمی نباشه (۲ ساعت)
        const twoHours = 2 * 60 * 60 * 1000;
        if (data.timestamp && (Date.now() - data.timestamp) > twoHours) {
            localStorage.removeItem('pdfmaker_data');
            return false;
        }
        
        // پر کردن فیلدها
        if (data.title) document.getElementById('lessonTitle').value = data.title;
        if (data.course) document.getElementById('lessonCourse').value = data.course;
        if (data.number) document.getElementById('lessonNumber').value = data.number;
        if (data.level) document.getElementById('lessonLevel').value = data.level;
        if (data.time) document.getElementById('lessonTime').value = data.time;
        if (data.content) document.getElementById('lessonContent').value = data.content;
        
        return true;
        
    } catch (e) {
        console.error('❌ خطا در خواندن pdfmaker_data:', e);
        return false;
    }
}

// ==========================================
// 🚀 اجرای اصلی
// ==========================================
const FIELDS = ['lessonTitle', 'lessonCourse', 'lessonNumber', 'lessonLevel', 'lessonTime', 'lessonTeacher', 'lessonContent'];

// ۱. اول از pdfmaker_data لود کن
const loadedFromData = loadFromParams();

// ۲. اگه pdfmaker_data نبود، از مقادیر قبلی لود کن
if (!loadedFromData) {
    FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        
        const saved = localStorage.getItem('pdfmaker_' + id);
        if (saved && !el.value) {
            el.value = saved;
        }
    });
}

// ۳. ذخیره خودکار هنگام تایپ
FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    
    el.addEventListener('input', () => {
        localStorage.setItem('pdfmaker_' + id, el.value);
    });
});

// ۴. به‌روزرسانی پیش‌نمایش
updatePreview();

// ==========================================
// 📌 پاک کردن فرم
// ==========================================
function clearForm() {
    if (!confirm('مطمئنی می‌خوای فرم رو پاک کنی؟')) return;
    FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.value = '';
            localStorage.removeItem('pdfmaker_' + id);
        }
    });
    localStorage.removeItem('pdfmaker_data');
    updatePreview();
    showToast('🗑️ فرم پاک شد');
}

// ==========================================
// 📌 کلیدهای میانبر
// ==========================================
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        generatePDF();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearForm();
    }
});
