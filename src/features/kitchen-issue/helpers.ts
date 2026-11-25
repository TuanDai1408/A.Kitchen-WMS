import { gFnbSitesList } from '../app-shell/navigation';

export function getActiveKitchenIssueSite(): string {
  const sel = document.getElementById('kitchenIssueSiteSelect') as HTMLSelectElement | null;
  if (sel && sel.value) return sel.value;

  try {
    const saved = localStorage.getItem('orbit_user_site');
    if (saved) return saved.toUpperCase();
  } catch (e) {}

  return 'K001';
}

export function populateKitchenIssueSiteDropdown(): void {
  const sel = document.getElementById('kitchenIssueSiteSelect') as HTMLSelectElement | null;
  if (!sel) return;

  const currentVal = getActiveKitchenIssueSite();
  const sites = gFnbSitesList || [];

  let html = '';
  sites.forEach((s: any) => {
    const isSel = s.code.toUpperCase() === currentVal.toUpperCase() ? 'selected' : '';
    html += `<option value="${s.code}" ${isSel}>${s.code} - ${s.name || s.ten} (${s.region || 'Miền Nam'})</option>`;
  });

  sel.innerHTML = html;
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount || 0)) + ' ₫';
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(val || 0);
}
