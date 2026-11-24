import { canAccessTab } from './rbac-session';

export function filterGlobalQuickSearch(query: string): void {
  const sidebarSearch = document.getElementById('sidebarMenuSearch') as HTMLInputElement | null;
  if (sidebarSearch && sidebarSearch.value !== query) {
    sidebarSearch.value = query;
  }
  filterSidebarMenu(query);
}

export function filterSidebarMenu(query: string): void {
  const q = (query || '').toLowerCase().trim();
  document.querySelectorAll('#sidebar .sidebar-category').forEach(cat => {
    let catHasVisible = false;
    cat.querySelectorAll('.nav-btn').forEach(btn => {
      const tabId = btn.getAttribute('data-tab');
      if (!tabId) return;
      const allowed = canAccessTab(tabId);
      const li = btn.closest('li');

      // Nếu không có quyền truy cập -> luôn ẩn hoàn toàn khỏi kết quả tìm kiếm
      if (!allowed) {
        btn.classList.add('hidden');
        (btn as HTMLElement).style.display = 'none';
        if (li) {
          li.classList.add('hidden');
          li.style.display = 'none';
        }
        return;
      }

      const text = btn.textContent?.toLowerCase() || '';
      if (!q || text.includes(q)) {
        btn.classList.remove('hidden');
        (btn as HTMLElement).style.display = '';
        if (li) {
          li.classList.remove('hidden');
          li.style.display = '';
        }
        catHasVisible = true;
      } else {
        btn.classList.add('hidden');
        (btn as HTMLElement).style.display = 'none';
        if (li) {
          li.classList.add('hidden');
          li.style.display = 'none';
        }
      }
    });

    if (catHasVisible) {
      cat.classList.remove('hidden');
      (cat as HTMLElement).style.display = '';
    } else {
      cat.classList.add('hidden');
      (cat as HTMLElement).style.display = 'none';
    }
  });
}
