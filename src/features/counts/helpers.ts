declare const window: any;

export function getActiveFnbCountSite(): string {
  const localSaved = localStorage.getItem('orbit_user_site');
  const globalSel = (document.getElementById('globalBranchSelect') as HTMLSelectElement | null)?.value;
  const win = window as any;
  const appBranch = (typeof win.App !== 'undefined' && win.App.currentBranch) ? win.App.currentBranch.toUpperCase() : null;
  const sel = (document.getElementById('fnbCountSiteSelect') as HTMLSelectElement | null)?.value;

  let siteCode = localSaved || globalSel || appBranch || sel || 'K001';
  if (siteCode === 'ALL' || siteCode === 'all') siteCode = 'K001';
  return siteCode.toUpperCase();
}
