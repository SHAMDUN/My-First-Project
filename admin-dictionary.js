// ==========================================
// 🎓 مدیریت دانش‌نامه در پنل ادمین
// ==========================================

const DICT_CATEGORIES = {
    economy: { name: 'اقتصاد کلان', icon: '🏦' },
    bourse: { name: 'بورس ایران', icon: '📈' },
    currency: { name: 'ارز و طلا', icon: '💵' },
    crypto: { name: 'کریپتوکارنسی', icon: '🪙' },
    forex: { name: 'فارکس و جهانی', icon: '🌍' },
    federal: { name: 'فدرال رزرو', icon: '🇺🇸' },
    technical: { name: 'تحلیل تکنیکال', icon: '📊' },
    fundamental: { name: 'تحلیل بنیادی', icon: '🔬' }
};

let dictionaryCache = [];

// ==========================================
// 📋 بارگذاری لیست
// ==========================================
async function loadDictionary() {
    const container = document.getElementById('dictionaryList');
    if (!container) return;

    container.innerHTML = '<div class="loading"><div class="spinner"></div>در حال بارگذاری...</div>';

    try {
        const { data, error } = await db
            .from('dictionary')
            .select('*')
            .order('category', { ascending: true })
            .order('term', { ascending: true });

        if (error) throw error;

        dictionaryCache = data || [];

        // آمار
        const total = dictionaryCache.length;
        const categories = new Set(dictionaryCache.map(d => d.category)).size;
        
        document.getElementById('dictTotal').textContent = toFa(total);
        document.getElementById('dictCategories').textContent = toFa(categories);

        // پر کردن فیلتر دسته‌بندی (یک بار)
        const filterSelect = document.getElementById('dictCategoryFilter');
        if (filterSelect && filterSelect.options.length <= 1) {
            Object.keys(DICT_CATEGORIES).forEach(key => {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = `${DICT_CATEGORIES[key].icon} ${DICT_CATEGORIES[key].name}`;
                filterSelect.appendChild(opt);
            });
        }

        renderDictionaryList();
    } catch (e) {
        console.error('Load dictionary error:', e);
        container.innerHTML = '<div class="loading">❌ خطا در بارگذاری: ' + e.message + '</div>';
    }
}

// ==========================================
// 📋 رندر لیست
// ==========================================
function renderDictionaryList() {
    const container = document.getElementById('dictionaryList');
    if (!container) return;

    const searchTerm = document.getElementById('dictSearch')?.value.trim().toLowerCase() || '';
    const categoryFilter = document.getElementById('dictCategoryFilter')?.value || '';

    let filtered = dictionaryCache;

    if (searchTerm) {
        filtered = filtered.filter(item =>
            item.term.toLowerCase().includes(searchTerm) ||
            (item.definition || '').toLowerCase().includes(searchTerm)
        );
    }

    if (categoryFilter) {
        filtered = filtered.filter(item => item.category === categoryFilter);
    }

    document.getElementById('dictFiltered').textContent = toFa(filtered.length);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="loading">
                📭 ${searchTerm || categoryFilter ? 'نتیجه‌ای یافت نشد' : 'هنوز اصطلاحی اضافه نشده'}
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>اصطلاح</th>
                    <th>دسته</th>
                    <th>تعریف</th>
                    <th>تاریخ</th>
                    <th>عملیات</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.map(item => {
                    const cat = DICT_CATEGORIES[item.category] || { name: item.category, icon: '📁' };
                    const defPreview = (item.definition || '').substring(0, 80);
                    return `
                        <tr>
                            <td style="font-weight:800; color:var(--gold);">${escapeHtml(item.term)}</td>
                            <td><span class="tag">${cat.icon} ${cat.name}</span></td>
                            <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis;">
                                ${escapeHtml(defPreview)}${item.definition && item.definition.length > 80 ? '...' : ''}
                            </td>
                            <td style="font-size:11px; color:var(--gray);">${formatDate(item.created_at)}</td>
                            <td style="white-space:nowrap;">
                                <button class="btn btn-small btn-primary" onclick="editDictionaryItem(${item.id})">✏️</button>
                                <button class="btn btn-small btn-danger" onclick="deleteDictionaryItem(${item.id})">🗑️</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function filterDictionary() {
    renderDictionaryList();
}

// ==========================================
// ➕ Modal
// ==========================================
function openDictModal() {
    document.getElementById('dictModalTitle').textContent = '➕ اصطلاح جدید';
    document.getElementById('dictId').value = '';
    document.getElementById('dictTerm').value = '';
    document.getElementById('dictDefinition').value = '';
    document.getElementById('dictExample').value = '';
    document.getElementById('dictCategorySelect').value = 'economy';
    document.getElementById('dictModal').classList.add('show');
}

function editDictionaryItem(id) {
    const item = dictionaryCache.find(d => d.id === id);
    if (!item) return;

    document.getElementById('dictModalTitle').textContent = '✏️ ویرایش اصطلاح';
    document.getElementById('dictId').value = item.id;
    document.getElementById('dictTerm').value = item.term || '';
    document.getElementById('dictDefinition').value = item.definition || '';
    document.getElementById('dictExample').value = item.example || '';
    document.getElementById('dictCategorySelect').value = item.category || 'economy';
    document.getElementById('dictModal').classList.add('show');
}

// ==========================================
// 💾 ذخیره
// ==========================================
async function saveDictionaryItem() {
    const id = document.getElementById('dictId').value;
    const term = document.getElementById('dictTerm').value.trim();
    const definition = document.getElementById('dictDefinition').value.trim();
    const example = document.getElementById('dictExample').value.trim();
    const category = document.getElementById('dictCategorySelect').value;

    if (!term) {
        showToast('❌ اصطلاح الزامی است', 'error');
        return;
    }
    if (!definition) {
        showToast('❌ تعریف الزامی است', 'error');
        return;
    }

    const payload = {
        term,
        definition,
        example: example || null,
        category,
        updated_at: new Date().toISOString()
    };

    try {
        let error;
        if (id) {
            ({ error } = await db.from('dictionary').update(payload).eq('id', id));
        } else {
            ({ error } = await db.from('dictionary').insert(payload));
        }

        if (error) throw error;

        showToast(id ? '✅ اصطلاح ویرایش شد' : '✅ اصطلاح اضافه شد');
        closeModal('dictModal');
        await loadDictionary();
    } catch (e) {
        console.error('Save dictionary error:', e);
        showToast('❌ خطا: ' + e.message, 'error');
    }
}

// ==========================================
// 🗑️ حذف
// ==========================================
async function deleteDictionaryItem(id) {
    if (!confirm('مطمئنی می‌خوای این اصطلاح رو حذف کنی؟')) return;

    try {
        const { error } = await db.from('dictionary').delete().eq('id', id);
        if (error) throw error;

        showToast('🗑️ اصطلاح حذف شد');
        await loadDictionary();
    } catch (e) {
        console.error('Delete dictionary error:', e);
        showToast('❌ خطا: ' + e.message, 'error');
    }
}

// ==========================================
// 🔄 بارگذاری خودکار وقتی تب باز شد
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const dictTab = document.getElementById('tab-dictionary');
    if (dictTab) {
        const observer = new MutationObserver(() => {
            if (dictTab.classList.contains('active')) {
                loadDictionary();
            }
        });
        observer.observe(dictTab, { attributes: true, attributeFilter: ['class'] });
    }
});
