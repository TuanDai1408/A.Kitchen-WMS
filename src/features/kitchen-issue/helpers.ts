import { gFnbSitesList } from '../app-shell/navigation';
import { DEFAULT_SITES_LIST } from '../auth/constants';
export { formatVND, formatNumber } from '../../ts/utils/formatters';

export function getSiteFullLabel(siteCode?: string): string {
  if (!siteCode) return 'K001 - MN Bếp Ăn Đại Học Hùng Vương';
  const cleanCode = siteCode.trim().toUpperCase();

  const matchDef = (DEFAULT_SITES_LIST as any[]).find((s: any) => s.code && s.code.toUpperCase() === cleanCode);
  if (matchDef) {
    const rawName = (matchDef.name || matchDef.ten || '').trim();
    if (rawName.toUpperCase().startsWith(cleanCode)) {
      return rawName;
    }
    return `${cleanCode} - ${rawName}`;
  }

  const sites = (gFnbSitesList && gFnbSitesList.length > 0 ? gFnbSitesList : DEFAULT_SITES_LIST) as any[];
  const match = sites.find((s: any) => s.code && s.code.toUpperCase() === cleanCode);
  if (match) {
    const rawName = (match.name || match.ten || '').trim();
    if (rawName.toUpperCase().startsWith(cleanCode)) {
      return rawName;
    }
    return `${cleanCode} - ${rawName}`;
  }
  return cleanCode;
}

export function getActiveKitchenIssueSite(): string {
  try {
    const saved = localStorage.getItem('orbit_user_site');
    if (saved && saved.trim()) return saved.trim().toUpperCase();
  } catch (e) {}

  const w = typeof window !== 'undefined' ? (window as any) : {};
  if (w.gCurrentUser && w.gCurrentUser.assignedSite) {
    return w.gCurrentUser.assignedSite.trim().toUpperCase();
  }

  const sel = document.getElementById('kitchenIssueSiteSelect') as HTMLSelectElement | null;
  if (sel && sel.value) return sel.value.trim().toUpperCase();

  return 'K001';
}

export function updateKitchenIssueSiteDisplay(siteCode?: string): void {
  const code = (siteCode || getActiveKitchenIssueSite()).toUpperCase();
  const label = getSiteFullLabel(code);
  const badgeEl = document.getElementById('kitchenIssueCurrentSiteBadge');
  if (badgeEl) {
    badgeEl.textContent = label;
  }
  const sel = document.getElementById('kitchenIssueSiteSelect') as HTMLSelectElement | null;
  if (sel) {
    sel.innerHTML = `<option value="${code}" selected>${code}</option>`;
    sel.value = code;
  }
}

export function populateKitchenIssueSiteDropdown(): void {
  updateKitchenIssueSiteDisplay();
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
