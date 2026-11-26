import { KpiRenderOptions } from './types';

export function fmtVND(n: number | string | null | undefined): string {
  const num = typeof n === 'string' ? parseFloat(n) : Number(n);
  if (!num || isNaN(num)) return '0đ';
  return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + 'đ';
}

export function fmtCompactVND(n: number | string | null | undefined): { v: string; u: string; full: string } {
  if (n === null || n === undefined || isNaN(Number(n)) || n === '') {
    return { v: '—', u: '', full: '—' };
  }
  const num = Number(n);
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  const full = num.toLocaleString('vi-VN') + ' ₫';

  if (abs >= 1e9) {
    const formatted = (abs / 1e9).toLocaleString('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    return { v: sign + formatted, u: 'tỷ ₫', full };
  } else if (abs >= 1e6) {
    const formatted = (abs / 1e6).toLocaleString('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    });
    return { v: sign + formatted, u: 'tr ₫', full };
  } else {
    const formatted = abs.toLocaleString('vi-VN');
    return { v: sign + formatted, u: '₫', full };
  }
}

export function fmtNum(n: number | string | null | undefined): string {
  if (n === null || n === undefined || isNaN(Number(n))) return '0';
  return new Intl.NumberFormat('vi-VN').format(Number(n));
}

export function renderKpi(id: string, opts: KpiRenderOptions = {}): void {
  const el = document.getElementById(id);
  if (!el) return;
  const card = el.closest('.kpi-card, .kpi-card-compact, .kpi-card-hero') || el.parentElement;

  // 1. Loading state
  if (opts.loading) {
    if (card && card.querySelector('.kpi-skeleton')) return;
    el.innerHTML = '<span class="inline-block h-6 w-24 kpi-skeleton animate-pulse rounded"></span>';
    return;
  }

  // 2. Value & Unit
  let valText = '—';
  let unitText = '';
  let titleText = '';

  if (opts.value !== undefined && opts.value !== null && !isNaN(Number(opts.value)) && opts.value !== '') {
    if (opts.isCurrency !== false && (typeof opts.value === 'number' || !isNaN(Number(opts.value)))) {
      const compact = fmtCompactVND(opts.value);
      valText = compact.v;
      unitText = opts.unit || compact.u;
      titleText = opts.rawFull || compact.full;
    } else {
      valText = String(opts.value);
      unitText = opts.unit || '';
      titleText = opts.rawFull || `${valText} ${unitText}`.trim();
    }
  } else if (typeof opts.text === 'string') {
    valText = opts.text;
    unitText = opts.unit || '';
    titleText = opts.rawFull || `${valText} ${unitText}`.trim();
  }

  // Set value
  el.textContent = valText;
  if (titleText) {
    el.title = titleText;
    el.setAttribute('aria-label', titleText);
  }

  // Set unit
  const unitEl = document.getElementById(id + 'Unit') || (card ? card.querySelector('.kpi-unit') : null);
  if (unitEl) {
    unitEl.textContent = unitText;
  } else if (unitText && !el.textContent.includes(unitText)) {
    el.textContent = `${valText} ${unitText}`.trim();
  }

  // 3. Delta badge
  if (card && (opts.delta !== undefined || opts.deltaText !== undefined)) {
    const deltaEl = document.getElementById(id + 'Delta') || card.querySelector('[class*="kpi-delta"]');
    if (deltaEl) {
      if (opts.delta === null || (opts.delta === undefined && !opts.deltaText)) {
        deltaEl.classList.add('hidden');
      } else {
        deltaEl.classList.remove('hidden');
        const dVal = typeof opts.delta === 'number' ? opts.delta : parseFloat(String(opts.delta)) || 0;
        const isGood = opts.deltaGood !== undefined ? opts.deltaGood : (dVal >= 0);

        deltaEl.className = isGood ? 'kpi-delta-good' : (dVal === 0 ? 'kpi-delta-neutral' : 'kpi-delta-bad');

        const arrowSvg = dVal >= 0
          ? '<svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg>'
          : '<svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg>';

        const srText = `<span class="sr-only">${dVal >= 0 ? 'tăng' : 'giảm'}</span>`;
        const badgeText = opts.deltaText || (dVal > 0 ? `+${dVal.toLocaleString('vi-VN')}%` : `${dVal.toLocaleString('vi-VN')}%`);
        deltaEl.innerHTML = `${arrowSvg}<span>${badgeText}</span>${srText}`;
      }
    }
  }

  // 4. Subtitle / subtext
  if (opts.sub && card) {
    const subEl = document.getElementById(id + 'Sub') || card.querySelector('.kpi-sub');
    if (subEl) subEl.textContent = opts.sub;
  }

  // 5. Progress Bar
  if (opts.progress !== undefined && card) {
    const trackEl = card.querySelector('.kpi-progress-track');
    const barEl = card.querySelector('.kpi-progress-bar, .kpi-progress-bar-error');
    if (trackEl && barEl) {
      const pct = Math.max(0, Math.min(100, opts.progress));
      (barEl as HTMLElement).style.width = pct + '%';
      if (opts.progress > 100) {
        barEl.className = 'kpi-progress-bar-error';
      } else {
        barEl.className = 'kpi-progress-bar';
      }
    }
  }
}

export function showToast(msg: string): void {
  const t = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  if (msgEl) msgEl.textContent = msg;
  if (t) {
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 3500);
  }
}

export function showLoading(msg: string = 'Đang đồng bộ dữ liệu hệ thống...'): void {
  const loadingEl = document.getElementById('loading');
  const msgEl = document.getElementById('loadingMsg');
  if (msgEl) msgEl.textContent = msg;
  if (loadingEl) loadingEl.classList.remove('hidden');
}

export function hideLoading(): void {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.classList.add('hidden');
}
