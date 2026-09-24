// ==========================================
// پنل ادمین شمعدون - نسخه ۴.۰
// شامل: مقالات، تحلیل‌ها، دستیار AI، صندوق پیام
// ==========================================

let currentUser = null;
let coursesCache = [];
let usersCache = [];
let blogPostsCache = [];
let analysesCache = [];
let messagesCache = [];
let currentAnalysisFilter = 'all';
let currentMessageFilter = 'all';
let selectedAIType = 'daily-gold';
let currentAIOutput = '';
let scoresChart = null;

// ==========================================
// API Configuration
// ==========================================
const BRS_API_KEY = 'B4xp2gWXASUmB3n6WPHtJxhjyJkgcBJz';
const AVALAI_API_KEY = 'aa-B6ef1JQ4HnDNBMRw4598qRGOKr7z3TttiznZubQXfD2A1iMf';
const AVALAI_API_URL = 'https://api.avalai.ir/v1/chat/completions';

// ==========================================
// 📢 ارسال به کانال تلگرام
// ==========================================
const TELEGRAM_FUNCTION_URL = 'https://wyytevpnwhiynyrumlko.supabase.co/functions/v1/publish-to-telegram';

async function publishToTelegram(type, data) {
  try {
    console.log('📤 ارسال به تلگرام:', type, data.title);
    
    const res = await fetch(TELEGRAM_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    });
    
    const result = await res.json();
    
    if (result.success) {
      console.log('✅ به تلگرام ارسال شد. message_id:', result.message_id);
      return true;
    } else {
      console.error('❌ خطا در ارسال به تلگرام:', result.error);
      return false;
    }
  } catch (e) {
    console.error('❌ خطای شبکه:', e);
    return false;
  }
}

// ==========================================
// ورود ادمین
// ==========================================
async function loginAdmin() {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');

    if (!email || !password) {
        errorEl.textContent = 'ایمیل و رمز عبور رو وارد کن';
        return;
    }

    if (email !== ADMIN_EMAIL) {
        errorEl.textContent = '⛔ این ایمیل دسترسی ادمین نداره';
        return;
    }

    const { data, error } = await db.auth.signInWithPassword({ email, password });

    if (error) {
        errorEl.textContent = '❌ ' + error.message;
        return;
    }

    currentUser = data.user;
    showPanel();
}

async function logoutAdmin() {
    await db.auth.signOut();
    location.reload();
}

function showPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('adminEmailShow').textContent = currentUser.email;

    loadDashboard();
    loadComments();
    loadCourses();
    loadLessons();
    loadUsers();
    loadBlogPosts();
    loadAnalyses();
    loadMessages();
    initAIData();
}

window.addEventListener('load', async () => {
    const { data } = await db.auth.getSession();
    if (data.session && data.session.user.email === ADMIN_EMAIL) {
        currentUser = data.session.user;
        showPanel();
    }
});

function switchTab(tabName, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById('tab-' + tabName);
    if (target) target.classList.add('active');
    if (btn) btn.classList.add('active');
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast show ' + type;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function closeModal(id) {
    document.getElementById(id).classList.remove('show');
}

// ==========================================
// ابزارها
// ==========================================
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[m]));
}

function formatDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function formatFullDate(iso) {
    if (!iso) return '-';
    try {
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(new Date(iso));
    } catch (e) {
        return '-';
    }
}

function timeAgo(iso) {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000 / 60);

        if (diff < 1) return 'همین الان';
        if (diff < 60) return `${toFa(diff)} دقیقه پیش`;
        if (diff < 1440) return `${toFa(Math.floor(diff / 60))} ساعت پیش`;
        if (diff < 10080) return `${toFa(Math.floor(diff / 1440))} روز پیش`;

        return formatFullDate(iso);
    } catch (e) {
        return '';
    }
}

function toFa(num) {
    if (num === null || num === undefined) return '۰';
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, d => persianDigits[d]);
}

function parseNum(str) {
    if (!str) return 0;
    const cleaned = String(str).replace(/[^\d]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
}

// ==========================================
// داشبورد
// ==========================================
async function loadDashboard() {
    try {
        const { count: userCount, error: e1 } = await db
            .from('profiles')
            .select('*', { count: 'exact', head: true });
        document.getElementById('statUsers').textContent = e1 ? 'خطا' : (userCount || 0);

        const { count: courseCount, error: e2 } = await db
            .from('courses')
            .select('*', { count: 'exact', head: true });
        document.getElementById('statCourses').textContent = e2 ? 'خطا' : (courseCount || 0);

        const { count: lessonCount, error: e3 } = await db
            .from('lessons')
            .select('*', { count: 'exact', head: true });
        document.getElementById('statLessons').textContent = e3 ? 'خطا' : (lessonCount || 0);

        const { count: postCount, error: e4 } = await db
            .from('blog_posts')
            .select('*', { count: 'exact', head: true });
        document.getElementById('statPosts').textContent = e4 ? 'خطا' : (postCount || 0);

        const { count: analysisCount, error: e5 } = await db
            .from('daily_analysis')
            .select('*', { count: 'exact', head: true });
        const statAnalysesEl = document.getElementById('statAnalyses');
        if (statAnalysesEl) {
            statAnalysesEl.textContent = e5 ? 'خطا' : (analysisCount || 0);
        }

        const { count: messageCount, error: e6 } = await db
            .from('contact_messages')
            .select('*', { count: 'exact', head: true });
        const statMessagesEl = document.getElementById('statMessages');
        if (statMessagesEl) {
            statMessagesEl.textContent = e6 ? 'خطا' : (messageCount || 0);
        }

        const { data: ratings, error: e7 } = await db
            .from('course_ratings')
            .select('rating');

        if (e7 || !ratings || ratings.length === 0) {
            document.getElementById('statScores').textContent = '0';
        } else {
            const validRatings = ratings.filter(r => r.rating != null);
            if (validRatings.length === 0) {
                document.getElementById('statScores').textContent = '0';
            } else {
                const avg = validRatings.reduce((sum, r) => sum + r.rating, 0) / validRatings.length;
                document.getElementById('statScores').textContent = avg.toFixed(1);
            }
        }

        const { count: commentCount, error: e8 } = await db
            .from('course_ratings')
            .select('*', { count: 'exact', head: true });
        document.getElementById('statComments').textContent = e8 ? 'خطا' : (commentCount || 0);

        await loadScoresChart();
    } catch (err) {
        console.error('Dashboard catch:', err);
    }
}

async function loadScoresChart() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await db
        .from('course_ratings')
        .select('created_at, rating')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at');

    if (error) return;

    const days = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        days[key] = { sum: 0, count: 0 };
    }

    (data || []).forEach(item => {
        const key = item.created_at.split('T')[0];
        if (days[key] !== undefined && item.rating != null) {
            days[key].sum += item.rating;
            days[key].count += 1;
        }
    });

    const labels = Object.keys(days).map(k => {
        const d = new Date(k);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    const values = Object.values(days).map(d =>
        d.count > 0 ? (d.sum / d.count).toFixed(1) : 0
    );

    const ctx = document.getElementById('scoresChart').getContext('2d');
    if (scoresChart) scoresChart.destroy();

    scoresChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'میانگین امتیاز روزانه',
                data: values,
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#d4af37',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#cbd5e1', font: { family: 'Vazirmatn' } } }
            },
            scales: {
                x: {
                    ticks: { color: '#94a3b8', font: { family: 'Vazirmatn' } },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                y: {
                    ticks: { color: '#94a3b8', font: { family: 'Vazirmatn' } },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });
}

// ==========================================
// ============ صندوق پیام ============
// ==========================================

async function loadMessages() {
    const container = document.getElementById('messagesList');
    if (!container) return;

    try {
        const { data, error } = await db
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Messages load error:', error);
            container.innerHTML = '<p style="color:#ef4444; padding:20px; text-align:center;">❌ خطا: ' + error.message + '</p>';
            return;
        }

        messagesCache = data || [];

        updateMessagesBadge();

        if (messagesCache.length === 0) {
            container.innerHTML = `
                <div class="loading" style="padding: 60px 20px;">
                    📭 هنوز پیامی دریافت نشده
                </div>
            `;
            return;
        }

        renderMessages();
    } catch (e) {
        console.error('Messages error:', e);
        container.innerHTML = '<p style="color:#ef4444; padding:20px; text-align:center;">❌ خطا در بارگذاری پیام‌ها</p>';
    }
}

function updateMessagesBadge() {
    const newCount = messagesCache.filter(m => m.status === 'new').length;
    const badge = document.getElementById('messagesBadge');

    if (!badge) return;

    if (newCount > 0) {
        badge.textContent = toFa(newCount);
        badge.classList.add('show');
    } else {
        badge.classList.remove('show');
    }
}

function renderMessages() {
    const container = document.getElementById('messagesList');
    if (!container) return;

    let filtered = messagesCache;

    if (currentMessageFilter === 'new') {
        filtered = messagesCache.filter(m => m.status === 'new');
    } else if (currentMessageFilter === 'read') {
        filtered = messagesCache.filter(m => m.status === 'read');
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="loading" style="padding: 60px 20px;">
                📭 پیامی در این دسته یافت نشد
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(m => {
        const isNew = m.status === 'new';
        const subject = m.subject || 'بدون موضوع';
        const messagePreview = (m.message || '').substring(0, 150);

        return `
            <div class="message-card ${isNew ? 'new' : ''}" onclick="viewMessage('${m.id}')">
                <div class="message-card-header">
                    <div class="message-card-name">
                        👤 ${escapeHtml(m.name || 'ناشناس')}
                        ${isNew ? '<span class="new-badge">جدید</span>' : ''}
                    </div>
                    <div class="message-card-date">⏰ ${timeAgo(m.created_at)}</div>
                </div>
                <div class="message-card-subject">📌 ${escapeHtml(subject)}</div>
                <div class="message-card-text">${escapeHtml(messagePreview)}${m.message && m.message.length > 150 ? '...' : ''}</div>
                <div class="message-card-footer">
                    <button class="btn btn-small btn-primary" onclick="event.stopPropagation(); viewMessage('${m.id}')">👁️ مشاهده</button>
                    <button class="btn btn-small btn-danger" onclick="event.stopPropagation(); deleteMessage('${m.id}')">🗑️ حذف</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterMessages(filter, btn) {
    currentMessageFilter = filter;
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderMessages();
}

async function viewMessage(id) {
    const msg = messagesCache.find(m => m.id === id);
    if (!msg) return;

    if (msg.status === 'new') {
        await markMessageAsRead(id);
    }

    document.getElementById('messageModalTitle').textContent = '📬 مشاهده پیام';
    document.getElementById('viewMessageId').value = id;

    const content = document.getElementById('messageDetailContent');

    content.innerHTML = `
        <div class="message-detail-box">
            <div class="message-detail-row">
                <span class="label">👤 نام:</span>
                <span class="value">${escapeHtml(msg.name || 'ناشناس')}</span>
            </div>
            <div class="message-detail-row">
                <span class="label">📧 ایمیل:</span>
                <span class="value">
                    <a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a>
                </span>
            </div>
            <div class="message-detail-row">
                <span class="label">📌 موضوع:</span>
                <span class="value">${escapeHtml(msg.subject || 'بدون موضوع')}</span>
            </div>
            <div class="message-detail-row">
                <span class="label">📅 تاریخ:</span>
                <span class="value">${formatFullDate(msg.created_at)}</span>
            </div>
            <div class="message-detail-row">
                <span class="label">📊 وضعیت:</span>
                <span class="value">
                    <span class="status-badge ${msg.status === 'new' ? 'status-draft' : 'status-published'}">
                        ${msg.status === 'new' ? '🆕 جدید' : '✅ خوانده‌شده'}
                    </span>
                </span>
            </div>
        </div>

        <div style="color:var(--gray); font-size:12px; margin-bottom:8px;">💬 متن پیام:</div>
        <div class="message-body">${escapeHtml(msg.message || '')}</div>
    `;

    document.getElementById('messageModal').classList.add('show');
}

async function markMessageAsRead(id) {
    const { error } = await db
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', id);

    if (error) {
        console.error('Mark as read error:', error);
        return;
    }

    const msg = messagesCache.find(m => m.id === id);
    if (msg) msg.status = 'read';

    updateMessagesBadge();
    renderMessages();
}

async function deleteMessage(id) {
    if (!confirm('مطمئنی می‌خوای این پیام رو حذف کنی؟')) return;

    const { error } = await db
        .from('contact_messages')
        .delete()
        .eq('id', id);

    if (error) {
        showToast('❌ خطا: ' + error.message, 'error');
        return;
    }

    showToast('🗑️ پیام حذف شد');
    messagesCache = messagesCache.filter(m => m.id !== id);
    updateMessagesBadge();
    renderMessages();
    loadDashboard();
}

async function deleteCurrentMessage() {
    const id = document.getElementById('viewMessageId').value;
    if (!id) return;

    if (!confirm('مطمئنی می‌خوای این پیام رو حذف کنی؟')) return;

    const { error } = await db
        .from('contact_messages')
        .delete()
        .eq('id', id);

    if (error) {
        showToast('❌ خطا: ' + error.message, 'error');
        return;
    }

    showToast('🗑️ پیام حذف شد');
    closeModal('messageModal');
    messagesCache = messagesCache.filter(m => m.id !== id);
    updateMessagesBadge();
    renderMessages();
    loadDashboard();
}

// ==========================================
// ============ نظرات ============
// ==========================================

async function loadComments() {
    const container = document.getElementById('commentsList');
    const { data, error } = await db
        .from('course_ratings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = '<p style="color:#ef4444; padding:20px; text-align:center;">❌ خطا:<br>' + error.message + '</p>';
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:30px;">هنوز نظری ثبت نشده</p>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>نظر</th>
                    <th>امتیاز</th>
                    <th>موضوع پیشنهادی</th>
                    <th>نیاز به دوره پیشرفته</th>
                    <th>تاریخ</th>
                    <th>عملیات</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(c => `
                    <tr>
                        <td>${escapeHtml(c.comment || '')}</td>
                        <td>${getStars(c.rating)}</td>
                        <td>${escapeHtml(c.suggested_topic || '-')}</td>
                        <td>${c.needs_advanced_course === true ? '✅ بله' : '❌ خیر'}</td>
                        <td>${formatDate(c.created_at)}</td>
                        <td>
                            <button class="btn btn-small btn-danger" onclick="deleteComment(${c.id})">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function getStars(rating) {
    if (rating == null) return '-';
    const r = Math.round(rating);
    return '⭐'.repeat(r) + ' (' + rating + ')';
}

async function deleteComment(id) {
    if (!confirm('مطمئنی می‌خوای این نظر رو حذف کنی؟')) return;
    const { error } = await db.from('course_ratings').delete().eq('id', id);
    if (error) return showToast('خطا: ' + error.message, 'error');
    showToast('نظر حذف شد');
    loadComments();
    loadDashboard();
}

// ==========================================
// دوره‌ها
// ==========================================
async function loadCourses() {
    const container = document.getElementById('coursesList');
    const { data, error } = await db
        .from('courses')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        container.innerHTML = '<p style="color:#ef4444; padding:20px;">❌ خطا: ' + error.message + '</p>';
        return;
    }

    coursesCache = data || [];

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:30px;">هنوز دوره‌ای اضافه نشده</p>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>آیکون</th>
                    <th>عنوان</th>
                    <th>سطح</th>
                    <th>عملیات</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(c => `
                    <tr>
                        <td>${renderCourseIcon(c.icon)}</td>
                        <td>${escapeHtml(c.title || '')}</td>
                        <td>${c.level || '-'}</td>
                        <td>
                            <button class="btn btn-small btn-primary" onclick="editCourse(${c.id})">✏️</button>
                            <button class="btn btn-small btn-danger" onclick="deleteCourse(${c.id})">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function openCourseModal() {
    document.getElementById('courseModalTitle').textContent = '➕ دوره جدید';
    document.getElementById('courseId').value = '';
    document.getElementById('courseTitle').value = '';
    document.getElementById('courseDesc').value = '';
    document.getElementById('courseIcon').value = '';
    document.getElementById('courseLevel').value = 'مبتدی';
    document.getElementById('courseModal').classList.add('show');
}

function editCourse(id) {
    const c = coursesCache.find(x => x.id === id);
    if (!c) return;
    document.getElementById('courseModalTitle').textContent = '✏️ ویرایش دوره';
    document.getElementById('courseId').value = c.id;
    document.getElementById('courseTitle').value = c.title || '';
    document.getElementById('courseDesc').value = c.description || '';
    document.getElementById('courseIcon').value = c.icon || '';
    document.getElementById('courseLevel').value = c.level || 'مبتدی';
    document.getElementById('courseModal').classList.add('show');
}

async function saveCourse() {
    const id = document.getElementById('courseId').value;
    const title = document.getElementById('courseTitle').value.trim();
    const description = document.getElementById('courseDesc').value.trim();
    const icon = document.getElementById('courseIcon').value.trim();
    const level = document.getElementById('courseLevel').value;

    if (!title) return showToast('عنوان الزامی است', 'error');

    const payload = { title, description, icon, level };
    let error;

    if (id) {
        ({ error } = await db.from('courses').update(payload).eq('id', id));
    } else {
        ({ error } = await db.from('courses').insert(payload));
    }

    if (error) return showToast('خطا: ' + error.message, 'error');

    showToast(id ? 'دوره ویرایش شد' : 'دوره اضافه شد');
    closeModal('courseModal');
    loadCourses();
    loadDashboard();
}

async function deleteCourse(id) {
    if (!confirm('مطمئنی؟')) return;
    const { error } = await db.from('courses').delete().eq('id', id);
    if (error) return showToast('خطا: ' + error.message, 'error');
    showToast('دوره حذف شد');
    loadCourses();
    loadDashboard();
}

// ==========================================
// دروس
// ==========================================
async function loadLessons() {
    const container = document.getElementById('lessonsList');
    const { data, error } = await db
        .from('lessons')
        .select('*')
        .order('order_num', { ascending: true });

    if (error) {
        container.innerHTML = '<p style="color:#ef4444; padding:20px;">❌ خطا: ' + error.message + '</p>';
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:30px;">هنوز درسی اضافه نشده</p>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>عنوان درس</th>
                    <th>ترتیب</th>
                    <th>عملیات</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(l => `
                    <tr>
                        <td>${escapeHtml(l.title || '')}</td>
                        <td>${l.order_num || '-'}</td>
                        <td>
                            <button class="btn btn-small btn-primary" onclick="editLesson(${l.id})">✏️</button>
                            <button class="btn btn-small btn-danger" onclick="deleteLesson(${l.id})">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function openLessonModal() {
    document.getElementById('lessonModalTitle').textContent = '➕ درس جدید';
    document.getElementById('lessonId').value = '';
    document.getElementById('lessonTitle').value = '';
    document.getElementById('lessonContent').value = '';
    document.getElementById('lessonVideo').value = '';
    document.getElementById('lessonImage').value = '';
    document.getElementById('lessonPdf').value = '';
    document.getElementById('lessonWord').value = '';
    document.getElementById('lessonPowerpoint').value = '';
    document.getElementById('lessonNotes').value = '';
    document.getElementById('lessonOrder').value = '1';

    const select = document.getElementById('lessonCourse');
    const { data } = await db.from('courses').select('id, title').order('title');

    if (!data || data.length === 0) {
        showToast('اول یه دوره بساز', 'error');
        return;
    }

    select.innerHTML = data.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
    document.getElementById('lessonModal').classList.add('show');
}

async function editLesson(id) {
    const { data: lesson } = await db.from('lessons').select('*').eq('id', id).single();
    if (!lesson) return;

    document.getElementById('lessonModalTitle').textContent = '✏️ ویرایش درس';
    document.getElementById('lessonId').value = lesson.id;
    document.getElementById('lessonTitle').value = lesson.title || '';
    document.getElementById('lessonContent').value = lesson.content || '';
    document.getElementById('lessonVideo').value = lesson.video_url || '';
    document.getElementById('lessonImage').value = lesson.image_url || '';
    document.getElementById('lessonPdf').value = lesson.pdf_url || '';
    document.getElementById('lessonWord').value = lesson.word_url || '';
    document.getElementById('lessonPowerpoint').value = lesson.powerpoint_url || '';
    document.getElementById('lessonNotes').value = lesson.notes_url || '';
    document.getElementById('lessonOrder').value = lesson.order_num || 1;

    const select = document.getElementById('lessonCourse');
    const { data: courses } = await db.from('courses').select('id, title').order('title');
    select.innerHTML = (courses || []).map(c =>
        `<option value="${c.id}" ${c.id === lesson.course_id ? 'selected' : ''}>${c.title}</option>`
    ).join('');

    document.getElementById('lessonModal').classList.add('show');
}

async function saveLesson() {
    const id = document.getElementById('lessonId').value;
    const course_id = document.getElementById('lessonCourse').value;
    const title = document.getElementById('lessonTitle').value.trim();
    const content = document.getElementById('lessonContent').value.trim();
    const video_url = document.getElementById('lessonVideo').value.trim();
    const image_url = document.getElementById('lessonImage').value.trim();
    const pdf_url = document.getElementById('lessonPdf').value.trim();
    const word_url = document.getElementById('lessonWord').value.trim();
    const powerpoint_url = document.getElementById('lessonPowerpoint').value.trim();
    const notes_url = document.getElementById('lessonNotes').value.trim();
    const order_num = parseInt(document.getElementById('lessonOrder').value) || 1;

    if (!title || !course_id) return showToast('عنوان و دوره الزامی است', 'error');

    const payload = {
        course_id, title, content,
        video_url: video_url || null,
        image_url: image_url || null,
        pdf_url: pdf_url || null,
        word_url: word_url || null,
        powerpoint_url: powerpoint_url || null,
        notes_url: notes_url || null,
        order_num
    };

    let error;
    if (id) {
        ({ error } = await db.from('lessons').update(payload).eq('id', id));
    } else {
        ({ error } = await db.from('lessons').insert(payload));
    }

    if (error) return showToast('خطا: ' + error.message, 'error');

    showToast(id ? 'درس ویرایش شد' : 'درس اضافه شد');
    closeModal('lessonModal');
    loadLessons();
    loadDashboard();
}

// ==========================================
// 📄 ساخت PDF درس
// ==========================================
function generateLessonPDF() {
    // گرفتن اطلاعات از فرم
    const title = document.getElementById('lessonTitle').value.trim();
    const content = document.getElementById('lessonContent').value.trim();
    
    // اعتبارسنجی
    if (!title) {
        showToast('❌ اول عنوان درس را وارد کن', 'error');
        return;
    }
    if (!content) {
        showToast('❌ اول محتوای درس را وارد کن', 'error');
        return;
    }
    
    // گرفتن اسم دوره از select
    const courseSelect = document.getElementById('lessonCourse');
    let courseTitle = '';
    if (courseSelect && courseSelect.selectedIndex >= 0) {
        courseTitle = courseSelect.options[courseSelect.selectedIndex]?.text || '';
    }
    
    // شماره ترتیب
    const orderNum = document.getElementById('lessonOrder').value || '1';
    
    // محاسبه زمان مطالعه تقریبی
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const wordCount = plainText.split(/\s+/).filter(w => w.length > 0).length;
    const readTime = Math.max(5, Math.round(wordCount / 200));
    
    // 🔑 ذخیره اطلاعات توی sessionStorage (به‌جای URL)
    const pdfData = {
        title: title,
        course: courseTitle,
        number: orderNum,
        level: 'متوسط',
        time: readTime.toString(),
        content: content,
        timestamp: Date.now()
    };
    
    localStorage.setItem('pdfmaker_data', JSON.stringify(pdfData));
    console.log('✅ اطلاعات در localStorage ذخیره شد:', pdfData.title);
    // باز کردن PDF ساز در تب جدید
    window.open('pdf-maker.html', '_blank');
    
    showToast('✅ PDF ساز در تب جدید باز شد', 'success');
}
async function deleteLesson(id) {
    if (!confirm('مطمئنی؟')) return;
    const { error } = await db.from('lessons').delete().eq('id', id);
    if (error) return showToast('خطا: ' + error.message, 'error');
    showToast('درس حذف شد');
    loadLessons();
    loadDashboard();
}

// ==========================================
// مقالات وبلاگ
// ==========================================
async function loadBlogPosts() {
    const container = document.getElementById('blogList');
    if (!container) return;

    const { data, error } = await db
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = '<p style="color:#ef4444; padding:20px; text-align:center;">❌ خطا: ' + error.message + '</p>';
        return;
    }

    blogPostsCache = data || [];

    if (!data || data.length === 0) {
        container.innerHTML = `
            <p style="color:#94a3b8; text-align:center; padding:50px;">
                📭 هنوز مقاله‌ای ثبت نشده
            </p>
        `;
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>عنوان</th>
                    <th>دسته</th>
                    <th>وضعیت</th>
                    <th>ویژه</th>
                    <th>تاریخ</th>
                    <th>عملیات</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(p => `
                    <tr>
                        <td style="max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                            ${escapeHtml(p.title || '')}
                        </td>
                        <td><span class="tag">${escapeHtml(p.category || '-')}</span></td>
                        <td>
                            <span class="status-badge ${p.status === 'published' ? 'status-published' : 'status-draft'}">
                                ${p.status === 'published' ? '✅ منتشرشده' : '📝 پیش‌نویس'}
                            </span>
                        </td>
                        <td>${p.featured ? '<span class="featured-badge">⭐ ویژه</span>' : '-'}</td>
                        <td>${formatDate(p.created_at)}</td>
                        <td style="white-space:nowrap;">
                            <button class="btn btn-small btn-success" onclick="togglePublishStatus('${p.id}')">
                                ${p.status === 'published' ? '↩️' : '🚀'}
                            </button>
                            <button class="btn btn-small btn-primary" onclick="editBlogPost('${p.id}')">✏️</button>
                            <button class="btn btn-small btn-danger" onclick="deleteBlogPost('${p.id}')">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function openBlogModal() {
    document.getElementById('blogModalTitle').textContent = '➕ مقاله جدید';
    document.getElementById('blogId').value = '';
    document.getElementById('blogTitle').value = '';
    document.getElementById('blogSlug').value = '';
    document.getElementById('blogSlug').dataset.userEdited = '';
    document.getElementById('blogExcerpt').value = '';
    document.getElementById('blogCategory').value = 'آموزش';
    document.getElementById('blogReadTime').value = '5';
    document.getElementById('blogTags').value = '';
    document.getElementById('blogCoverImage').value = '';
    document.getElementById('blogFeatured').checked = false;
    document.getElementById('blogContent').value = '';
    document.getElementById('blogPreview').innerHTML = '<p style="color:var(--gray); text-align:center; padding-top:150px;">👁️ پیش‌نمایش اینجا نمایش داده می‌شود</p>';
    document.getElementById('blogModal').classList.add('show');
}

async function editBlogPost(id) {
    const post = blogPostsCache.find(p => p.id === id);
    if (!post) return;

    document.getElementById('blogModalTitle').textContent = '✏️ ویرایش مقاله';
    document.getElementById('blogId').value = post.id;
    document.getElementById('blogTitle').value = post.title || '';
    document.getElementById('blogSlug').value = post.slug || '';
    document.getElementById('blogSlug').dataset.userEdited = 'true';
    document.getElementById('blogExcerpt').value = post.excerpt || '';
    document.getElementById('blogCategory').value = post.category || 'آموزش';
    document.getElementById('blogReadTime').value = post.read_time || 5;
    document.getElementById('blogTags').value = (post.tags || []).join(', ');
    document.getElementById('blogCoverImage').value = post.cover_image || '';
    document.getElementById('blogFeatured').checked = post.featured || false;
    document.getElementById('blogContent').value = post.content || '';

    updatePreview();
    document.getElementById('blogModal').classList.add('show');
}

function autoSlug() {
    const title = document.getElementById('blogTitle').value;
    const slugInput = document.getElementById('blogSlug');

    if (slugInput.dataset.userEdited === 'true') return;

    const slug = title
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 60);

    if (!slug || slug.length < 2) {
        slugInput.value = 'post-' + Date.now();
    } else {
        slugInput.value = slug;
    }
}

document.addEventListener('input', (e) => {
    if (e.target.id === 'blogSlug') {
        e.target.dataset.userEdited = 'true';
    }
});

function updatePreview() {
    const content = document.getElementById('blogContent').value;
    const preview = document.getElementById('blogPreview');

    if (!content.trim()) {
        preview.innerHTML = '<p style="color:var(--gray); text-align:center; padding-top:150px;">👁️ پیش‌نمایش اینجا نمایش داده می‌شود</p>';
        return;
    }

    try {
        const html = marked.parse(content);
        const cleanHtml = DOMPurify.sanitize(html);
        preview.innerHTML = cleanHtml;
    } catch (e) {
        preview.innerHTML = '<p style="color:var(--red);">❌ خطا در پیش‌نمایش</p>';
    }
}

async function saveBlogPost(status = 'draft') {
    const id = document.getElementById('blogId').value;
    const title = document.getElementById('blogTitle').value.trim();
    const slug = document.getElementById('blogSlug').value.trim();
    const excerpt = document.getElementById('blogExcerpt').value.trim();
    const category = document.getElementById('blogCategory').value;
    const readTime = parseInt(document.getElementById('blogReadTime').value) || 5;
    const tagsStr = document.getElementById('blogTags').value.trim();
    const coverImage = document.getElementById('blogCoverImage').value.trim();
    const featured = document.getElementById('blogFeatured').checked;
    const content = document.getElementById('blogContent').value.trim();

    if (!title) return showToast('عنوان مقاله الزامی است', 'error');
    if (!slug) return showToast('Slug الزامی است', 'error');
    if (!excerpt) return showToast('خلاصه مقاله الزامی است', 'error');
    if (!content) return showToast('متن مقاله الزامی است', 'error');

    const tags = tagsStr
        ? tagsStr.split(',').map(t => t.trim()).filter(t => t)
        : [];

    const payload = {
        title, slug, excerpt, content, category,
        read_time: readTime, tags,
        cover_image: coverImage || null,
        featured, status,
        author_name: 'مهدی',
        author_email: currentUser?.email || ADMIN_EMAIL
    };

    if (status === 'published') {
        payload.published_at = new Date().toISOString();
    }

    let error;
    if (id) {
        ({ error } = await db.from('blog_posts').update(payload).eq('id', id));
    } else {
        ({ error } = await db.from('blog_posts').insert(payload));
    }

    if (error) {
        console.error('Save error:', error);
        return showToast('خطا: ' + error.message, 'error');
    }

    // 📢 ارسال به تلگرام فقط اگه منتشر شده
    if (status === 'published') {
        await publishToTelegram('article', {
            title: title,
            slug: slug,
            summary: excerpt,
            category: category,
            read_time: readTime
        });
    }

    showToast(status === 'published' ? '🚀 مقاله منتشر شد!' : '💾 پیش‌نویس ذخیره شد');
    closeModal('blogModal');
    loadBlogPosts();
    loadDashboard();
}

async function togglePublishStatus(id) {
    const post = blogPostsCache.find(p => p.id === id);
    if (!post) return;

    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const updates = { status: newStatus };

    if (newStatus === 'published' && !post.published_at) {
        updates.published_at = new Date().toISOString();
    }

    const { error } = await db.from('blog_posts').update(updates).eq('id', id);

    if (error) return showToast('خطا: ' + error.message, 'error');

    // 📢 اگه منتشر شد، به تلگرام بفرست
    if (newStatus === 'published') {
        await publishToTelegram('article', {
            title: post.title,
            slug: post.slug,
            summary: post.excerpt,
            category: post.category,
            read_time: post.read_time
        });
    }

    showToast(newStatus === 'published' ? '🚀 منتشر شد' : '↩️ به پیش‌نویس منتقل شد');
    loadBlogPosts();
}

async function deleteBlogPost(id) {
    if (!confirm('مطمئنی می‌خوای این مقاله رو حذف کنی؟\n\nاین عملیات قابل بازگشت نیست!')) return;

    const { error } = await db.from('blog_posts').delete().eq('id', id);

    if (error) return showToast('خطا: ' + error.message, 'error');

    showToast('🗑️ مقاله حذف شد');
    loadBlogPosts();
    loadDashboard();
}

// ==========================================
// ============ تحلیل‌ها ============
// ==========================================

async function loadAnalyses() {
    const container = document.getElementById('analysisList');
    if (!container) return;

    const { data, error } = await db
        .from('daily_analysis')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = '<p style="color:#ef4444; padding:20px; text-align:center;">❌ خطا: ' + error.message + '</p>';
        return;
    }

    analysesCache = data || [];

    if (!data || data.length === 0) {
        container.innerHTML = `
            <p style="color:#94a3b8; text-align:center; padding:50px;">
                📭 هنوز تحلیلی ثبت نشده<br>
                <span style="font-size:12px;">روی «➕ تحلیل جدید» بزن یا از دستیار AI استفاده کن</span>
            </p>
        `;
        return;
    }

    renderAnalysesList();
}

function renderAnalysesList() {
    const container = document.getElementById('analysisList');

    let filtered = analysesCache;
    if (currentAnalysisFilter !== 'all') {
        filtered = analysesCache.filter(a => a.analysis_type === currentAnalysisFilter);
    }

    if (filtered.length === 0) {
        container.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:30px;">تحلیلی در این دسته یافت نشد</p>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>عنوان</th>
                    <th>نوع</th>
                    <th>سیگنال</th>
                    <th>وضعیت</th>
                    <th>تاریخ</th>
                    <th>عملیات</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.map(a => {
                    const typeBadge = a.analysis_type === 'weekly'
                        ? '<span class="type-badge weekly">📈 هفتگی</span>'
                        : '<span class="type-badge daily">🔥 روزانه</span>';

                    let signalBadge = '-';
                    if (a.signal === 'up') signalBadge = '🟢 صعودی';
                    else if (a.signal === 'down') signalBadge = '🔴 نزولی';
                    else if (a.signal === 'neutral') signalBadge = '⚪ خنثی';

                    return `
                        <tr>
                            <td style="max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                                ${escapeHtml(a.title || '')}
                            </td>
                            <td>${typeBadge}</td>
                            <td>${signalBadge}</td>
                            <td>
                                <span class="status-badge ${a.status === 'published' ? 'status-published' : 'status-draft'}">
                                    ${a.status === 'published' ? '✅ منتشرشده' : '📝 پیش‌نویس'}
                                </span>
                            </td>
                            <td>${formatDate(a.created_at)}</td>
                            <td style="white-space:nowrap;">
                                <button class="btn btn-small btn-success" onclick="toggleAnalysisPublish('${a.id}')">
                                    ${a.status === 'published' ? '↩️' : '🚀'}
                                </button>
                                <button class="btn btn-small btn-primary" onclick="editAnalysis('${a.id}')">✏️</button>
                                <button class="btn btn-small btn-danger" onclick="deleteAnalysis('${a.id}')">🗑️</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function filterAnalyses(type, btn) {
    currentAnalysisFilter = type;
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderAnalysesList();
}

function openAnalysisModal() {
    document.getElementById('analysisModalTitle').textContent = '➕ تحلیل جدید';
    document.getElementById('analysisId').value = '';
    document.getElementById('analysisType').value = 'daily';

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('analysisDate').value = `${yyyy}-${mm}-${dd}`;

    const hh = String(today.getHours()).padStart(2, '0');
    const min = String(today.getMinutes()).padStart(2, '0');
    document.getElementById('analysisTime').value = `${hh}:${min}`;

    document.getElementById('analysisValidity').value = 'تا پایان امروز';
    document.getElementById('analysisTitle').value = '';
    document.getElementById('analysisSlug').value = '';
    document.getElementById('analysisSlug').dataset.userEdited = '';
    document.getElementById('analysisExcerpt').value = '';
    document.getElementById('analysisSignal').value = '';
    document.getElementById('analysisCoverImage').value = '';
    document.getElementById('analysisSupport').value = '';
    document.getElementById('analysisResistance').value = '';
    document.getElementById('analysisTags').value = '';
    document.getElementById('analysisContent').value = '';
    document.getElementById('analysisPreview').innerHTML = '<p style="color:var(--gray); text-align:center; padding-top:150px;">👁️ پیش‌نمایش اینجا نمایش داده می‌شود</p>';

    document.getElementById('analysisModal').classList.add('show');
}

async function editAnalysis(id) {
    const a = analysesCache.find(x => x.id === id);
    if (!a) return;

    document.getElementById('analysisModalTitle').textContent = '✏️ ویرایش تحلیل';
    document.getElementById('analysisId').value = a.id;
    document.getElementById('analysisType').value = a.analysis_type || 'daily';
    document.getElementById('analysisDate').value = a.date || '';
    document.getElementById('analysisTime').value = a.time || '';
    document.getElementById('analysisValidity').value = a.validity || '';
    document.getElementById('analysisTitle').value = a.title || '';
    document.getElementById('analysisSlug').value = a.slug || '';
    document.getElementById('analysisSlug').dataset.userEdited = 'true';
    document.getElementById('analysisExcerpt').value = a.excerpt || '';
    document.getElementById('analysisSignal').value = a.signal || '';
    document.getElementById('analysisCoverImage').value = a.cover_image || '';
    document.getElementById('analysisSupport').value = a.support || '';
    document.getElementById('analysisResistance').value = a.resistance || '';
    document.getElementById('analysisTags').value = (a.tags || []).join(', ');
    document.getElementById('analysisContent').value = a.content || '';

    updateAnalysisPreview();
    document.getElementById('analysisModal').classList.add('show');
}

function autoAnalysisSlug() {
    const title = document.getElementById('analysisTitle').value;
    const slugInput = document.getElementById('analysisSlug');

    if (slugInput.dataset.userEdited === 'true') return;

    const slug = title
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 60);

    if (!slug || slug.length < 2) {
        slugInput.value = 'analysis-' + Date.now();
    } else {
        slugInput.value = slug;
    }
}

document.addEventListener('input', (e) => {
    if (e.target.id === 'analysisSlug') {
        e.target.dataset.userEdited = 'true';
    }
});

function updateAnalysisPreview() {
    const content = document.getElementById('analysisContent').value;
    const preview = document.getElementById('analysisPreview');

    if (!content.trim()) {
        preview.innerHTML = '<p style="color:var(--gray); text-align:center; padding-top:150px;">👁️ پیش‌نمایش اینجا نمایش داده می‌شود</p>';
        return;
    }

    try {
        const html = marked.parse(content);
        const cleanHtml = DOMPurify.sanitize(html);
        preview.innerHTML = cleanHtml;
    } catch (e) {
        preview.innerHTML = '<p style="color:var(--red);">❌ خطا در پیش‌نمایش</p>';
    }
}

async function saveAnalysis(status = 'draft') {
    const id = document.getElementById('analysisId').value;
    const analysis_type = document.getElementById('analysisType').value;
    const date = document.getElementById('analysisDate').value;
    const time = document.getElementById('analysisTime').value;
    const validity = document.getElementById('analysisValidity').value.trim();
    const title = document.getElementById('analysisTitle').value.trim();
    const slug = document.getElementById('analysisSlug').value.trim();
    const excerpt = document.getElementById('analysisExcerpt').value.trim();
    const signal = document.getElementById('analysisSignal').value;
    const cover_image = document.getElementById('analysisCoverImage').value.trim();
    const support = parseNum(document.getElementById('analysisSupport').value) || null;
    const resistance = parseNum(document.getElementById('analysisResistance').value) || null;
    const tagsStr = document.getElementById('analysisTags').value.trim();
    const content = document.getElementById('analysisContent').value.trim();

    if (!title) return showToast('عنوان الزامی است', 'error');
    if (!slug) return showToast('Slug الزامی است', 'error');
    if (!excerpt) return showToast('خلاصه الزامی است', 'error');
    if (!validity) return showToast('مدت اعتبار الزامی است', 'error');
    if (!content) return showToast('متن تحلیل الزامی است', 'error');

    const tags = tagsStr
        ? tagsStr.split(',').map(t => t.trim()).filter(t => t)
        : [];

    const payload = {
        analysis_type, date, time, validity,
        title, slug, excerpt, content,
        signal: signal || null,
        cover_image: cover_image || null,
        support, resistance,
        tags,
        status,
        author_name: 'مهدی',
        author_email: currentUser?.email || ADMIN_EMAIL
    };

    if (status === 'published') {
        payload.published_at = new Date().toISOString();
    }

    let error;
    if (id) {
        ({ error } = await db.from('daily_analysis').update(payload).eq('id', id));
    } else {
        ({ error } = await db.from('daily_analysis').insert(payload));
    }

    if (error) {
        console.error('Save error:', error);
        return showToast('خطا: ' + error.message, 'error');
    }

    // 📢 ارسال به تلگرام فقط اگه منتشر شده
    if (status === 'published') {
        await publishToTelegram('analysis', {
            title: title,
            slug: slug,
            summary: excerpt,
            category: analysis_type === 'weekly' ? 'تحلیل هفتگی' : 'تحلیل روزانه',
            analysis_type: analysis_type === 'weekly' ? 'هفتگی' : 'روزانه',
            signal: signal === 'up' ? 'صعودی 🟢' : signal === 'down' ? 'نزولی 🔴' : 'خنثی ⚪'
        });
    }

    showToast(status === 'published' ? '🚀 تحلیل منتشر شد!' : '💾 پیش‌نویس ذخیره شد');
    closeModal('analysisModal');
    loadAnalyses();
    loadDashboard();
}

async function toggleAnalysisPublish(id) {
    const a = analysesCache.find(x => x.id === id);
    if (!a) return;

    const newStatus = a.status === 'published' ? 'draft' : 'published';
    const updates = { status: newStatus };

    if (newStatus === 'published' && !a.published_at) {
        updates.published_at = new Date().toISOString();
    }

    const { error } = await db.from('daily_analysis').update(updates).eq('id', id);

    if (error) return showToast('خطا: ' + error.message, 'error');

    // 📢 اگه منتشر شد، به تلگرام بفرست
    if (newStatus === 'published') {
        await publishToTelegram('analysis', {
            title: a.title,
            slug: a.slug,
            summary: a.excerpt,
            category: a.analysis_type === 'weekly' ? 'تحلیل هفتگی' : 'تحلیل روزانه',
            analysis_type: a.analysis_type === 'weekly' ? 'هفتگی' : 'روزانه',
            signal: a.signal === 'up' ? 'صعودی 🟢' : a.signal === 'down' ? 'نزولی 🔴' : 'خنثی ⚪'
        });
    }

    showToast(newStatus === 'published' ? '🚀 منتشر شد' : '↩️ به پیش‌نویس منتقل شد');
    loadAnalyses();
}

async function deleteAnalysis(id) {
    if (!confirm('مطمئنی می‌خوای این تحلیل رو حذف کنی؟')) return;

    const { error } = await db.from('daily_analysis').delete().eq('id', id);

    if (error) return showToast('خطا: ' + error.message, 'error');

    showToast('🗑️ تحلیل حذف شد');
    loadAnalyses();
    loadDashboard();
}

// ==========================================
// ============ دستیار AI ============
// ==========================================

function selectAnalysisType(type, card) {
    selectedAIType = type;
    document.querySelectorAll('.analysis-type-card').forEach(c => c.classList.remove('active'));
    if (card) card.classList.add('active');
    initAIData();
}

async function initAIData() {
    const box = document.getElementById('aiDataBox');
    if (!box) return;

    box.textContent = '⏳ در حال لود داده‌ها...';

    try {
        let dataText = '';

        if (selectedAIType === 'daily-gold' || selectedAIType === 'daily-global') {
            dataText = await buildMarketDataText();
        } else if (selectedAIType === 'weekly-iran') {
            dataText = buildManualIranData();
        } else if (selectedAIType === 'weekly-usa') {
            dataText = buildManualUSAData();
        }

        box.textContent = dataText || 'داده‌ای موجود نیست';
    } catch (e) {
        console.error('AI data error:', e);
        box.textContent = '⚠️ خطا در لود داده‌ها';
    }
}

async function buildMarketDataText() {
    let lines = [];
    lines.push('=== داده‌های بازار (BrsApi) ===');
    lines.push('منبع: Api.BrsApi.ir');
    lines.push('');

    try {
        const res = await fetch(`https://Api.BrsApi.ir/Market/Gold_Currency.php?key=${BRS_API_KEY}`);
        const data = await res.json();

        if (data.gold && Array.isArray(data.gold)) {
            data.gold.forEach(g => {
                if (g.symbol === 'IR_GOLD_18K') {
                    lines.push(`🥇 طلا ۱۸ عیار: ${g.price} تومان (${g.change_percent > 0 ? '+' : ''}${g.change_percent}%)`);
                }
                if (g.symbol === 'IR_COIN_EMAMI') {
                    lines.push(`🪙 سکه امامی: ${g.price} تومان (${g.change_percent > 0 ? '+' : ''}${g.change_percent}%)`);
                }
            });
        }

        if (data.currency && Array.isArray(data.currency)) {
            data.currency.forEach(c => {
                if (c.symbol === 'USD') {
                    lines.push(`💵 دلار آزاد: ${c.price} تومان (${c.change_percent > 0 ? '+' : ''}${c.change_percent}%)`);
                }
                if (c.symbol === 'EUR') {
                    lines.push(`💶 یورو: ${c.price} تومان (${c.change_percent > 0 ? '+' : ''}${c.change_percent}%)`);
                }
            });
        }
    } catch (e) {
        lines.push('⚠️ خطا در دریافت BrsApi');
    }

    lines.push('');
    lines.push('=== کالا و فلزات (BrsApi Commodity) ===');

    try {
        const res = await fetch(`https://Api.BrsApi.ir/Market/Commodity.php?key=${BRS_API_KEY}`);
        const data = await res.json();

        if (data.metal_precious && Array.isArray(data.metal_precious)) {
            data.metal_precious.forEach(m => {
                if (m.symbol === 'XAUUSD') {
                    lines.push(`🏅 انس طلا: ${m.price} دلار (${m.change_percent > 0 ? '+' : ''}${m.change_percent}%)`);
                }
                if (m.symbol === 'XAGUSD') {
                    lines.push(`🥈 انس نقره: ${m.price} دلار (${m.change_percent > 0 ? '+' : ''}${m.change_percent}%)`);
                }
            });
        }
    } catch (e) {
        lines.push('⚠️ خطا در Commodity');
    }

    lines.push('');
    lines.push('=== کریپتو (CoinGecko) ===');

    try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
        const data = await res.json();

        if (data.bitcoin) {
            lines.push(`₿ بیت‌کوین: $${data.bitcoin.usd} (${data.bitcoin.usd_24h_change > 0 ? '+' : ''}${data.bitcoin.usd_24h_change.toFixed(2)}%)`);
        }
        if (data.ethereum) {
            lines.push(`⟠ اتریوم: $${data.ethereum.usd} (${data.ethereum.usd_24h_change > 0 ? '+' : ''}${data.ethereum.usd_24h_change.toFixed(2)}%)`);
        }
    } catch (e) {
        lines.push('⚠️ خطا در CoinGecko');
    }

    lines.push('');
    lines.push(`⏰ زمان: ${new Date().toLocaleString('fa-IR')}`);

    return lines.join('\n');
}

function buildManualIranData() {
    return `=== داده‌های اقتصاد ایران (ورود دستی) ===
منبع پیشنهادی: CBI.ir (بانک مرکزی)

📊 لطفاً داده‌های زیر را در پرامپت جایگزین کنید:
- نرخ تورم سالانه: [٪]
- نرخ تورم ماهانه: [٪]
- نرخ تورم نقطه‌به‌نقطه: [٪]
- حجم نقدینگی: [هزار میلیارد ریال]
- رشد دوازده‌ماهه نقدینگی: [٪]
- پایه پولی: [هزار میلیارد ریال]
- رشد پایه پولی: [٪]
- ضریب فزاینده نقدینگی: [عدد]
- نرخ بهره بین‌بانکی: [٪]
- نرخ سود سپرده: [٪]

⏰ زمان: ${new Date().toLocaleString('fa-IR')}`;
}

function buildManualUSAData() {
    return `=== داده‌های اقتصاد آمریکا (ورود دستی) ===
منابع: CME FedWatch, BLS.gov, BEA.gov

📊 لطفاً داده‌های زیر را در پرامپت جایگزین کنید:
- نرخ بهره فدرال: [٪]
- تورم CPI: [٪]
- تورم PCE: [٪]
- نرخ بیکاری: [٪]
- NFP (اشتغال): [هزار نفر]
- GDP: [٪]
- شاخص دلار (DXY): [مقدار]

⏰ زمان: ${new Date().toLocaleString('fa-IR')}`;
}

async function reloadAIData() {
    await initAIData();
    showToast('✅ داده‌ها بروزرسانی شد');
}

// ==========================================
// پرامپت‌های ثابت
// ==========================================
function getPromptForType(type, dataText) {
    const prompts = {
        'daily-gold': `شما یک تحلیلگر ارشد بازار طلا و نقره ایران هستید. با توجه به داده‌های زیر، یک تحلیل حرفه‌ای، دقیق و کاربردی به زبان فارسی ارائه دهید.

📌 داده‌های ورودی (منبع: BrsApi):
${dataText}

🎯 ساختار خروجی (دقیقاً به این ترتیب):

## 📊 خلاصه وضعیت
یک پاراگراف ۲-۳ خطی از وضعیت کلی بازار طلا و نقره امروز.

## 💰 تحلیل قیمت طلا ۱۸ عیار
- قیمت فعلی
- تغییرات
- سطوح کلیدی: حمایت اول/دوم، مقاومت اول/دوم
- وضعیت مومنتوم (RSI تقریبی): مقدار و تفسیر

## 🥈 تحلیل نقره ۹۹۹
- قیمت فعلی
- تغییرات
- سطوح کلیدی
- نسبت طلا به نقره

## 📈 تحلیل تکنیکال
- روند فعلی: صعودی/نزولی/خنثی
- RSI: مقدار تقریبی
- MACD: وضعیت
- الگوی کندلی مهم

## 🎯 نقاط ورود و خروج پله‌ای
- 🟢 ورود اول: قیمت - درصد سرمایه
- 🟢 ورود دوم: قیمت - درصد
- 🟡 حد ضرر: قیمت
- 🔴 خروج اول: قیمت
- 🔴 خروج دوم: قیمت

## ⚠️ هشدارهای مهم
۲-۳ نکته درباره ریسک‌های فعلی

## 📌 سیگنال نهایی
- سیگنال: صعودی 🟢 / نزولی 🔴 / خنثی ⚪
- اطمینان: درصد
- مدت اعتبار: مثلاً تا پایان امروز

⚠️ نکته: این تحلیل صرفاً جنبه آموزشی دارد و به معنی سیگنال قطعی خرید یا فروش نیست.`,

        'daily-global': `شما یک تحلیلگر ارشد بازارهای جهانی هستید. با توجه به داده‌های زیر، یک تحلیل حرفه‌ای، دقیق و کاربردی به زبان فارسی ارائه دهید.

📌 داده‌های ورودی (منبع: BrsApi + CoinGecko):
${dataText}

🎯 ساختار خروجی (دقیقاً به این ترتیب):

## 🌍 خلاصه بازارهای جهانی
یک پاراگراف ۲-۳ خطی از وضعیت کلی بازارهای بین‌المللی.

## 🥇 تحلیل انس طلا
- قیمت فعلی
- تغییرات
- سطوح کلیدی: حمایت، مقاومت
- RSI و MACD

## 🥈 تحلیل انس نقره
- قیمت فعلی
- تغییرات
- سطوح کلیدی
- نسبت طلا به نقره

## ₿ تحلیل بیت‌کوین
- قیمت فعلی
- تغییرات
- سطوح کلیدی
- وضعیت مومنتوم
- نقاط ورود و خروج پله‌ای

## ⟠ تحلیل اتریوم
- قیمت فعلی
- تغییرات
- سطوح کلیدی

## 📊 عوامل کلان مؤثر
- شاخص دلار (DXY): وضعیت
- انتظارات فدرال رزرو
- جریان ETF طلا

## 🎯 نقاط ورود و خروج (طلا و BTC)
- ورود، حد ضرر، خروج

## 📌 سیگنال نهایی
- سیگنال: صعودی/نزولی/خنثی
- اطمینان: درصد

⚠️ نکته: این تحلیل صرفاً جنبه آموزشی دارد.`,

        'weekly-iran': `شما یک تحلیلگر ارشد اقتصاد کلان ایران هستید. با توجه به داده‌های زیر، یک تحلیل حرفه‌ای، دقیق و کاربردی به زبان فارسی ارائه دهید.

📌 داده‌های ورودی (منبع: CBI.ir - بانک مرکزی):
${dataText}

🎯 ساختار خروجی (دقیقاً به این ترتیب):

## 📊 خلاصه وضعیت اقتصاد ایران
یک پاراگراف ۳-۴ خطی از وضعیت کلی اقتصاد.

## 📈 تحلیل تورم
- نرخ تورم سالانه، ماهانه، نقطه‌به‌نقطه
- تفسیر روند تورم

## 💰 تحلیل نقدینگی و پایه پولی
- حجم نقدینگی و رشد
- پایه پولی و رشد
- ضریب فزاینده
- تفسیر رابطه پول و تورم

## 🏦 تحلیل نرخ بهره
- نرخ بین‌بانکی، سود سپرده، تسهیلات
- نرخ بهره حقیقی
- تفسیر سیاست پولی

## ⚖️ چالش‌ها و ریسک‌ها
۳-۴ چالش اصلی

## 🎯 چشم‌انداز
- کوتاه‌مدت (۱-۳ ماه)
- میان‌مدت (۳-۱۲ ماه)

## 📌 جمع‌بندی
- وضعیت کلی: بهبود/تشدید/ثبات
- سیگنال برای بازارها

⚠️ نکته: این تحلیل صرفاً جنبه آموزشی دارد.`,

        'weekly-usa': `شما یک تحلیلگر ارشد اقتصاد آمریکا هستید. با توجه به داده‌های زیر، یک تحلیل حرفه‌ای، دقیق و کاربردی به زبان فارسی ارائه دهید.

📌 داده‌های ورودی (منابع: CME FedWatch, BLS.gov, BEA.gov):
${dataText}

🎯 ساختار خروجی (دقیقاً به این ترتیب):

## 🇺🇸 خلاصه وضعیت اقتصاد آمریکا
یک پاراگراف ۳-۴ خطی از وضعیت کلی.

## 📈 تحلیل تورم
- CPI و PCE
- تفسیر روند تورم

## 💼 تحلیل بازار کار
- نرخ بیکاری
- NFP
- تفسیر وضعیت اشتغال

## 🏦 سیاست پولی فدرال رزرو
- نرخ بهره فعلی
- انتظارات بازار
- نشست بعدی FOMC
- تفسیر سیاست پولی

## 📊 رشد اقتصادی
- GDP
- تفسیر رشد

## 🌍 تأثیر بر بازارهای جهانی
- طلا، دلار، کریپتو، بورس

## 📌 جمع‌بندی
- وضعیت کلی: بهبود/تشدید/ثبات
- سیگنال: تحلیل

⚠️ نکته: این تحلیل صرفاً جنبه آموزشی دارد.`
    };

    return prompts[type] || prompts['daily-gold'];
}

async function generateAIAnalysis() {
    const btn = document.getElementById('generateBtn');
    const output = document.getElementById('aiOutput');
    const actions = document.getElementById('aiActions');
    const dataBox = document.getElementById('aiDataBox');
    const model = document.getElementById('aiModelSelect').value;

    const dataText = dataBox.textContent;

    if (!dataText || dataText.includes('در حال لود')) {
        showToast('اول داده‌ها رو بروزرسانی کن', 'error');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '⏳ در حال تولید تحلیل...';
    output.innerHTML = '<div class="loading"><div class="spinner"></div>در حال تولید تحلیل با AI...</div>';
    actions.style.display = 'none';

    try {
        const prompt = getPromptForType(selectedAIType, dataText);

        const response = await fetch(AVALAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AVALAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: 'شما یک تحلیلگر حرفه‌ای بازارهای مالی هستید.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('AI Error:', errorText);
            throw new Error(`خطا در ارتباط با AI (کد: ${response.status})`);
        }

        const data = await response.json();
        const aiText = data.choices[0].message.content;

        currentAIOutput = aiText;

        try {
            const rawHtml = marked.parse(aiText);
            output.innerHTML = DOMPurify.sanitize(rawHtml);
        } catch (e) {
            output.textContent = aiText;
        }

        actions.style.display = 'flex';
        showToast('✅ تحلیل تولید شد');

    } catch (e) {
        console.error('Generate error:', e);
        output.innerHTML = `<p style="color:var(--red); text-align:center; padding:40px 0;">❌ ${e.message}</p>`;
        showToast('خطا در تولید تحلیل', 'error');
    }

    btn.disabled = false;
    btn.innerHTML = '🚀 تولید تحلیل با AI';
}

function copyAIOutput() {
    if (!currentAIOutput) return;
    navigator.clipboard.writeText(currentAIOutput).then(() => {
        showToast('📋 متن کپی شد');
    }).catch(() => {
        showToast('❌ خطا در کپی', 'error');
    });
}

function sendToAnalysisForm() {
    if (!currentAIOutput) return;

    openAnalysisModal();

    const typeMap = {
        'daily-gold': 'daily',
        'daily-global': 'daily',
        'weekly-iran': 'weekly',
        'weekly-usa': 'weekly'
    };

    document.getElementById('analysisType').value = typeMap[selectedAIType] || 'daily';
    document.getElementById('analysisContent').value = currentAIOutput;

    const titles = {
        'daily-gold': 'تحلیل روزانه طلا و نقره',
        'daily-global': 'تحلیل روزانه انس و کریپتو',
        'weekly-iran': 'تحلیل هفتگی اقتصاد ایران',
        'weekly-usa': 'تحلیل هفتگی اقتصاد آمریکا'
    };
    document.getElementById('analysisTitle').value = titles[selectedAIType] || 'تحلیل بازار';

    if (typeMap[selectedAIType] === 'weekly') {
        document.getElementById('analysisValidity').value = 'تا شنبه بعد';
    } else {
        document.getElementById('analysisValidity').value = 'تا پایان امروز';
    }

    updateAnalysisPreview();
    showToast('✅ محتوا به فرم تحلیل منتقل شد');
}

// ==========================================
// کاربران
// ==========================================
async function loadUsers() {
    const container = document.getElementById('usersList');
    const { data, error } = await db
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = '<p style="color:#ef4444; padding:20px;">❌ خطا: ' + error.message + '</p>';
        return;
    }

    usersCache = data || [];
    renderUsers(data || []);
}

function renderUsers(users) {
    const container = document.getElementById('usersList');

    if (!users || users.length === 0) {
        container.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:30px;">کاربری یافت نشد</p>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ایمیل</th>
                    <th>نقش</th>
                    <th>تاریخ عضویت</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(u => `
                    <tr>
                        <td>${escapeHtml(u.email || '-')}</td>
                        <td>${u.role === 'admin' ? '<span style="color:#d4af37;">👑 ادمین</span>' : 'کاربر'}</td>
                        <td>${formatDate(u.created_at)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function filterUsers() {
    const q = document.getElementById('userSearch').value.trim().toLowerCase();
    if (!q) return renderUsers(usersCache);

    const filtered = usersCache.filter(u =>
        (u.email || '').toLowerCase().includes(q)
    );
    renderUsers(filtered);
}
// ==========================================
// 🖼️ نمایش آیکون یا تصویر دوره
// ==========================================
function isImageUrl(str) {
  if (!str) return false;
  const s = String(str).trim().toLowerCase();
  return s.endsWith('.jpg') || 
         s.endsWith('.jpeg') || 
         s.endsWith('.png') || 
         s.endsWith('.gif') || 
         s.endsWith('.webp') || 
         s.endsWith('.svg') || 
         s.startsWith('http://') || 
         s.startsWith('https://') ||
         s.startsWith('files/');
}

function renderCourseIcon(icon) {
  if (!icon) return '<span style="font-size:22px;">📚</span>';
  
  if (isImageUrl(icon)) {
    let src = icon;
    if (!icon.startsWith('http')) {
      src = icon.startsWith('files/') ? icon : 'files/' + icon;
    }
    return `
      <img 
        src="${src}" 
        alt="تصویر دوره" 
        style="width:44px; height:44px; object-fit:cover; border-radius:10px; border:1px solid rgba(212,175,55,0.3);"
        onerror="this.outerHTML='<span style=\\'font-size:22px;\\'>📚</span>'"
      >
    `;
  }
  
  return `<span style="font-size:22px;">${icon}</span>`;
}
