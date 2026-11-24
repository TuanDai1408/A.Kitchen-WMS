export function getActiveFnbReceiptSite(): string {
  const saved = localStorage.getItem('orbit_user_site');
  if (saved) return saved.toUpperCase();
  const win = window as any;
  const branch = (typeof win.App !== 'undefined' && win.App.currentBranch) ? win.App.currentBranch.toUpperCase() : 'K001';
  return (branch === 'ALL' || !branch) ? 'K001' : branch;
}

export function formatReceiptDateYMD(val?: string | null): string {
  if (!val || val === '—') return '—';
  const str = String(val).trim();
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      return `${y}-${mo}-${da}`;
    }
  } catch {
    // fallback below
  }
  return str.slice(0, 10);
}

export function getReceiptExpWarningHtml(dateStr?: string | null): string {
  if (!dateStr) {
    return `<span class="text-gray-400 text-xs italic">Chưa đặt EXP</span>`;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> Hết hạn (${Math.abs(diffDays)} ngày)</span>`;
  } else if (diffDays === 0) {
    return `<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> Hết hạn hôm nay</span>`;
  } else if (diffDays <= 7) {
    return `<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> Cận date (${diffDays} ngày)</span>`;
  } else if (diffDays <= 30) {
    return `<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> Còn ${diffDays} ngày</span>`;
  } else {
    return `<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> Còn ${diffDays} ngày</span>`;
  }
}
