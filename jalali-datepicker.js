/**
 * Jalali (Shamsi) DatePicker
 * سبک، بدون jQuery، هماهنگ با تم طلایی
 * input.value  = میلادی ISO (YYYY-MM-DD)  ← برای Supabase
 * input.display = شمسی فارسی (۱۴۰۵/۰۷/۳۱) ← برای کاربر
 */
(function () {
  'use strict';

  const FA_MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  const FA_WEEK   = ['ش','ی','د','س','چ','پ','ج'];
  const FA_DIGITS = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];

  const toFa = (v) => String(v).replace(/\d/g, d => FA_DIGITS[d]);
  const pad2 = (n) => String(n).padStart(2, '0');

  function gregToJalali(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    const j = jalaali.toJalaali(y, m, d);
    return [j.jy, j.jm, j.jd];
  }

  function jalaliToGregIso(jy, jm, jd) {
    const g = jalaali.toGregorian(jy, jm, jd);
    return `${g.gy}-${pad2(g.gm)}-${pad2(g.gd)}`;
  }

  function todayJalali() {
    const now = new Date();
    const j = jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    return [j.jy, j.jm, j.jd];
  }

  function daysInJalaliMonth(jy, jm) {
    return jalaali.jalaaliMonthLength(jy, jm);
  }

  class JalaliDatePicker {
    constructor(input) {
      this.input = input;
      this.isOpen = false;
      this.viewYear = 0;
      this.viewMonth = 0;
      this.selected = null;

      input.readOnly = true;
      input.setAttribute('autocomplete', 'off');
      input.classList.add('jdp-input');
      input.style.cursor = 'pointer';

      const iso = input.value;
      if (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso)) {
        this.selected = iso;
        this.renderDisplay();
      } else {
        this.input.value = '';
        this.input.placeholder = 'انتخاب تاریخ';
      }

      this.panel = document.createElement('div');
      this.panel.className = 'jdp-panel';
      this.panel.style.display = 'none';
      document.body.appendChild(this.panel);

      input.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      this._onDocClick = (e) => {
        if (!this.panel.contains(e.target) && e.target !== this.input) {
          this.close();
        }
      };
      document.addEventListener('click', this._onDocClick);

      this._onResize = () => { if (this.isOpen) this.position(); };
      window.addEventListener('resize', this._onResize);
      window.addEventListener('scroll', this._onResize, true);
    }

    renderDisplay() {
      if (!this.selected) {
        this.input.value = '';
        this.input.dataset.iso = '';
        return;
      }
      const [jy, jm, jd] = gregToJalali(this.selected);
      this.input.value = toFa(`${jy}/${pad2(jm)}/${pad2(jd)}`);
      this.input.dataset.iso = this.selected;
    }

    toggle() {
      if (this.isOpen) this.close();
      else this.open();
    }

    open() {
      if (this.isOpen) return;
      const base = this.selected ? gregToJalali(this.selected) : todayJalali();
      this.viewYear = base[0];
      this.viewMonth = base[1];
      this.render();
      this.panel.style.display = 'block';
      this.isOpen = true;
      this.position();
      document.querySelectorAll('.jdp-panel').forEach(p => {
        if (p !== this.panel) p.style.display = 'none';
      });
    }

    close() {
      this.panel.style.display = 'none';
      this.isOpen = false;
    }

    position() {
      const rect = this.input.getBoundingClientRect();
      const panelH = 340;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow < panelH + 20
        ? rect.top + window.scrollY - panelH - 8
        : rect.bottom + window.scrollY + 8;
      this.panel.style.top = top + 'px';
      this.panel.style.left = rect.left + 'px';
      this.panel.style.minWidth = Math.max(rect.width, 280) + 'px';
    }

    render() {
      const jy = this.viewYear, jm = this.viewMonth;
      const daysCount = daysInJalaliMonth(jy, jm);
      const firstGreg = jalaliToGregIso(jy, jm, 1);
      const [gy, gm, gd] = firstGreg.split('-').map(Number);
      const firstDate = new Date(gy, gm - 1, gd);
      const jsDay = firstDate.getDay();
      const offset = (jsDay + 1) % 7;

      const today = todayJalali();
      const isToday = (d) => jy === today[0] && jm === today[1] && d === today[2];
      const selectedJ = this.selected ? gregToJalali(this.selected) : null;
      const isSelected = (d) => selectedJ && selectedJ[0] === jy && selectedJ[1] === jm && selectedJ[2] === d;

      let cells = '';
      for (let i = 0; i < offset; i++) {
        cells += `<div class="jdp-day jdp-empty"></div>`;
      }
      for (let d = 1; d <= daysCount; d++) {
        const cls = ['jdp-day'];
        if (isToday(d)) cls.push('jdp-today');
        if (isSelected(d)) cls.push('jdp-selected');
        cells += `<div class="${cls.join(' ')}" data-day="${d}">${toFa(d)}</div>`;
      }

      const yearOpts = [];
      for (let y = jy - 60; y <= jy + 20; y++) {
        yearOpts.push(`<option value="${y}" ${y === jy ? 'selected' : ''}>${toFa(y)}</option>`);
      }

      this.panel.innerHTML = `
        <div class="jdp-header">
          <button type="button" class="jdp-nav" data-nav="prev-year">«</button>
          <button type="button" class="jdp-nav" data-nav="prev-month">‹</button>
          <div class="jdp-title">
            <select class="jdp-select jdp-month-select">
              ${FA_MONTHS.map((m, i) => `<option value="${i + 1}" ${i + 1 === jm ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
            <select class="jdp-select jdp-year-select">
              ${yearOpts.join('')}
            </select>
          </div>
          <button type="button" class="jdp-nav" data-nav="next-month">›</button>
          <button type="button" class="jdp-nav" data-nav="next-year">»</button>
        </div>
        <div class="jdp-weekdays">
          ${FA_WEEK.map(w => `<div class="jdp-weekday">${w}</div>`).join('')}
        </div>
        <div class="jdp-grid">
          ${cells}
        </div>
        <div class="jdp-footer">
          <button type="button" class="jdp-btn jdp-btn-today">امروز</button>
          <button type="button" class="jdp-btn jdp-btn-clear">پاک کردن</button>
        </div>
      `;

      this.bindPanelEvents();
    }

    bindPanelEvents() {
      this.panel.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const nav = btn.dataset.nav;
          if (nav === 'prev-month') {
            this.viewMonth--;
            if (this.viewMonth < 1) { this.viewMonth = 12; this.viewYear--; }
          } else if (nav === 'next-month') {
            this.viewMonth++;
            if (this.viewMonth > 12) { this.viewMonth = 1; this.viewYear++; }
          } else if (nav === 'prev-year') {
            this.viewYear--;
          } else if (nav === 'next-year') {
            this.viewYear++;
          }
          this.render();
        });
      });

      const monthSelect = this.panel.querySelector('.jdp-month-select');
      const yearSelect = this.panel.querySelector('.jdp-year-select');
      monthSelect.addEventListener('change', (e) => {
        e.stopPropagation();
        this.viewMonth = Number(monthSelect.value);
        this.render();
      });
      yearSelect.addEventListener('change', (e) => {
        e.stopPropagation();
        this.viewYear = Number(yearSelect.value);
        this.render();
      });

      this.panel.querySelectorAll('.jdp-day:not(.jdp-empty)').forEach(cell => {
        cell.addEventListener('click', (e) => {
          e.stopPropagation();
          const d = Number(cell.dataset.day);
          this.selected = jalaliToGregIso(this.viewYear, this.viewMonth, d);
          this.renderDisplay();
          this.close();
          this.input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });

      this.panel.querySelector('.jdp-btn-today').addEventListener('click', (e) => {
        e.stopPropagation();
        const [y, m, d] = todayJalali();
        this.viewYear = y; this.viewMonth = m;
        this.selected = jalaliToGregIso(y, m, d);
        this.renderDisplay();
        this.close();
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      this.panel.querySelector('.jdp-btn-clear').addEventListener('click', (e) => {
        e.stopPropagation();
        this.selected = null;
        this.renderDisplay();
        this.close();
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

    setValue(iso) {
      if (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso)) {
        this.selected = iso;
      } else {
        this.selected = null;
      }
      this.renderDisplay();
    }

    getIsoValue() {
      return this.selected || '';
    }
  }

  const instances = new WeakMap();

  window.JalaliDatePicker = {
    attach(input) {
      if (typeof input === 'string') input = document.getElementById(input);
      if (!input) return null;
      if (instances.has(input)) return instances.get(input);
      const inst = new JalaliDatePicker(input);
      instances.set(input, inst);
      return inst;
    },
    get(input) {
      if (typeof input === 'string') input = document.getElementById(input);
      return instances.get(input) || null;
    },
    initAll() {
      document.querySelectorAll('input[data-jalali-picker]').forEach(el => {
        this.attach(el);
      });
    }
  };

  window.jalaliHelpers = {
    gregToJalaliStr(iso) {
      if (!iso) return '';
      const [y, m, d] = iso.split('-').map(Number);
      const j = jalaali.toJalaali(y, m, d);
      return toFa(`${j.jy}/${pad2(j.jm)}/${pad2(j.jd)}`);
    },
    jalaliToGregIso
  };
})();
