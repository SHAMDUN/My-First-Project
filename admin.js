// ==========================================
// منطق پنل ادمین شمعدون
// ==========================================

let currentUser = null;
let coursesCache = [];
let usersCache = [];
let scoresChart = null;

// ============ ورود ادمین ============
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
    document.getElementById('tab-' + tabName).classList.add('active');
    btn.classList.add('active');
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

// ============ داشبورد ============
async function loadDashboard() {
    try {
        // کاربران
        const { count: userCount, error: e1 } = await db.from('profiles').select('*', { count: 'exact', head: true });
        document.getElementById('statUsers').textContent = e1 ? 'خطا' : (userCount || 0);

        // دوره‌ها
        const { count: courseCount, error: e2 } = await db.from('courses').select('*', { count: 'exact', head: true });
        document.getElementById('statCourses').textContent = e2 ? 'خطا' : (courseCount || 0);

        // دروس
        const { count: lessonCount, error: e3 } = await db.from('lessons').select('*', { count: 'exact', head: true });
        document.getElementById('statLessons').textContent = e3 ? 'خطا' : (lessonCount || 0);

        // میانگین امتیازات ستاره‌ای
        const { data: ratings, error: e4 } = await db.from('course_ratings').select('rating');
        if (e4 || !ratings || ratings.length === 0) {
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

        // تعداد نظرات
        const { count: commentCount, error: e5 } = await db.from('course_ratings').select('*', { count: 'exact', head: true });
        document.getElementById('statComments').textContent = e5 ? 'خطا' : (commentCount || 0);

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

    if (error) {
        console.log('Chart error:', error);
        return;
    }

    // گروه‌بندی بر اساس تاریخ و محاسبه میانگین امتیاز هر روز
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
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#f59e0b',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: '#cbd5e1' } } },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { 
                    ticks: { color: '#94a3b8' }, 
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });
}

// ============ نظرات ============
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

// ============ دوره‌ها ============
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
                        <td style="font-size:22px;">${c.icon || '📚'}</td>
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
}

// ============ دروس ============
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
        course_id, 
        title, 
        content, 
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

async function deleteLesson(id) {
    if (!confirm('مطمئنی؟')) return;
    const { error } = await db.from('lessons').delete().eq('id', id);
    if (error) return showToast('خطا: ' + error.message, 'error');
    showToast('درس حذف شد');
    loadLessons();
    loadDashboard();
}

// ============ کاربران ============
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
                        <td>${u.role === 'admin' ? '<span style="color:#f59e0b;">👑 ادمین</span>' : 'کاربر'}</td>
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
    const filtered = usersCache.filter(u => (u.email || '').toLowerCase().includes(q));
    renderUsers(filtered);
}

// ============ ابزارها ============
function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
}

function formatDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}
