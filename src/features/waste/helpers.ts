declare const window: any;

export function getActiveFnbWasteSite(): string {
  const globalSel = (document.getElementById('globalBranchSelect') as HTMLSelectElement | null)?.value;
  const localSaved = localStorage.getItem('orbit_user_site');
  const win = window as any;
  const appBranch = (typeof win.App !== 'undefined' && win.App.currentBranch) ? win.App.currentBranch.toUpperCase() : null;
  const filterSel = (document.getElementById('fnbWasteFilterSite') as HTMLSelectElement | null)?.value;

  let siteCode = globalSel || localSaved || appBranch || filterSel || 'K001';
  if (siteCode === 'ALL' || siteCode === 'all') siteCode = 'K001';
  return siteCode.toUpperCase();
}

export function populateFnbWasteSiteDropdown(): void {
  const sel = document.getElementById('fnbWasteFilterSite') as HTMLSelectElement | null;
  if (!sel) return;
  const currentVal = sel.value || getActiveFnbWasteSite();
  const sites = (typeof window.getAppSitesList === 'function' ? window.getAppSitesList() : []).filter((s: any) => s.code !== 'ALL');
  if (sites && sites.length) {
    let opts = '';
    sites.forEach((s: any) => {
      opts += `<option value="${s.code}" ${s.code.toUpperCase() === currentVal.toUpperCase() ? 'selected' : ''}>${s.name}</option>`;
    });
    sel.innerHTML = opts;
    if (currentVal && Array.from(sel.options).some(o => o.value === currentVal)) {
      sel.value = currentVal;
    }
  }
}
