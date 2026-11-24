import { ALL_TAB_GROUPS, isMasterAccount } from './constants';
import { gCurrentUser } from './accounts';
import { gSystemTabVisibility, setSystemTabVisibility, applyUserSessionToUI } from './rbac-session';

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const lucide: any;

let localTabVisibility: Record<string, boolean> = {};
let currentSearchQuery = '';
let currentFilterMode: 'all' | 'hidden' | 'visible' = 'all';

/**
 * Tải trạng thái ẩn/hiện toàn hệ thống từ CSDL Cloudflare D1
 */
export async function loadSystemTabVisibility(): Promise<Record<string, boolean>> {
  try {
    const res = await fetch('/api/system/tab-visibility');
    const json = await res.json().catch(() => ({}));
    if (json.success && json.data) {
      setSystemTabVisibility(json.data);
      localTabVisibility = { ...json.data };
      return json.data;
    }
  } catch (e) {
    console.error('loadSystemTabVisibility error:', e);
  }
  localTabVisibility = { ...gSystemTabVisibility };
  return gSystemTabVisibility;
}

/**
 * Mở modal cấu hình Ẩn/Hiện Tab - DÀNH ĐỘC QUYỀN CHO trantuandai2508
 */
export async function openTabVisibilityModal(): Promise<void> {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser || gCurrentUser;

  if (!curUser || !isMasterAccount(curUser.email)) {
    if (typeof showToast === 'function') {
      showToast('Tính năng này chỉ dành riêng cho Quản trị viên tối cao (trantuandai2508)!', 'error');
    }
    return;
  }

  const modal = document.getElementById('tabVisibilityModal');
  if (!modal) return;

  modal.classList.remove('hidden');
  currentSearchQuery = '';
  currentFilterMode = 'all';

  const searchInput = document.getElementById('tabVisSearchInput') as HTMLInputElement | null;
  if (searchInput) searchInput.value = '';

  // Nạp dữ liệu mới nhất
  if (typeof showLoading === 'function') showLoading('Đang tải cấu hình hiển thị...');
  try {
    await loadSystemTabVisibility();
    renderTabVisibilityList();
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

/**
 * Đóng modal
 */
export function closeTabVisibilityModal(): void {
  const modal = document.getElementById('tabVisibilityModal');
  if (modal) modal.classList.add('hidden');
}

/**
 * Toggle trạng thái ẩn / hiện của một tab
 * @param tabId Mã tab
 * @param isHidden true = ẨN (chặn cả Admin), false = HIỂN THỊ
 */
export function toggleTabVisibilityItem(tabId: string, isHidden: boolean): void {
  localTabVisibility[tabId] = isHidden;
  renderTabVisibilityList();
}

/**
 * Bật hiển thị tất cả các tab (reset về mặc định)
 */
export function setAllTabsVisible(): void {
  ALL_TAB_GROUPS.forEach(g => {
    g.tabs.forEach(t => {
      localTabVisibility[t.id] = false;
    });
  });
  renderTabVisibilityList();
  if (typeof showToast === 'function') {
    showToast('Đã chuyển toàn bộ tabs sang trạng thái HIỂN THỊ. Nhấn Lưu để áp dụng.', 'info');
  }
}

/**
 * Đặt bộ lọc
 */
export function filterTabVisibility(mode: 'all' | 'hidden' | 'visible'): void {
  currentFilterMode = mode;
  renderTabVisibilityList();
}

/**
 * Tìm kiếm theo từ khóa
 */
export function onTabVisSearch(keyword: string): void {
  currentSearchQuery = (keyword || '').toLowerCase().trim();
  renderTabVisibilityList();
}

/**
 * Render danh sách 19 tabs chia theo 5 nhóm vào Modal
 */
export function renderTabVisibilityList(): void {
  const container = document.getElementById('tabVisibilityList');
  const countBadge = document.getElementById('tabVisHiddenCountBadge');
  if (!container) return;

  let totalTabs = 0;
  let hiddenCount = 0;

  ALL_TAB_GROUPS.forEach(g => {
    g.tabs.forEach(t => {
      totalTabs++;
      if (localTabVisibility[t.id] === true) {
        hiddenCount++;
      }
    });
  });

  if (countBadge) {
    countBadge.innerHTML = hiddenCount > 0
      ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">Đang ẩn: ${hiddenCount} / ${totalTabs} tabs (Chặn cả Admin)</span>`
      : `<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Tất cả ${totalTabs} tabs đang hiển thị bình thường</span>`;
  }

  // Cập nhật tab pills filter
  ['all', 'hidden', 'visible'].forEach(m => {
    const btn = document.getElementById(`tabVisFilterBtn_${m}`);
    if (btn) {
      if (currentFilterMode === m) {
        btn.className = 'px-3 py-1.5 rounded-xl font-bold text-xs bg-indigo-600 text-white shadow-xs';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl font-semibold text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors';
      }
    }
  });

  let html = '';

  ALL_TAB_GROUPS.forEach(group => {
    // Lọc tabs theo từ khóa và chế độ filter
    const filteredTabs = group.tabs.filter(tab => {
      const isHidden = localTabVisibility[tab.id] === true;
      if (currentFilterMode === 'hidden' && !isHidden) return false;
      if (currentFilterMode === 'visible' && isHidden) return false;

      if (currentSearchQuery) {
        const matchName = tab.name.toLowerCase().includes(currentSearchQuery);
        const matchId = tab.id.toLowerCase().includes(currentSearchQuery);
        const matchDesc = tab.desc.toLowerCase().includes(currentSearchQuery);
        return matchName || matchId || matchDesc;
      }
      return true;
    });

    if (filteredTabs.length === 0) return;

    html += `
      <div class="mb-5 rounded-2xl border border-gray-200/90 dark:border-gray-800/90 bg-white dark:bg-gray-900/60 overflow-hidden shadow-xs">
        <!-- Group Header -->
        <div class="px-4 py-2.5 bg-gray-50/90 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-xs">
              <i data-lucide="${group.icon}" class="w-3.5 h-3.5"></i>
            </span>
            <span class="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">${group.groupName}</span>
          </div>
          <span class="text-[11px] font-semibold text-gray-400 tabular-nums">${filteredTabs.length} tabs</span>
        </div>

        <!-- Group Tabs List -->
        <div class="divide-y divide-gray-100 dark:divide-gray-800/70">
          ${filteredTabs.map(tab => {
            const isHidden = localTabVisibility[tab.id] === true;
            return `
              <div class="p-3.5 sm:px-4 flex items-center justify-between gap-3 transition-colors ${
                isHidden
                  ? 'bg-rose-50/40 dark:bg-rose-950/20'
                  : 'hover:bg-gray-50/60 dark:hover:bg-gray-800/30'
              }">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isHidden
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }">
                    <i data-lucide="${tab.icon}" class="w-4 h-4"></i>
                  </div>
                  <div class="min-w-0 text-left">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">${tab.name}</span>
                      <code class="font-mono text-[10.5px] px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">${tab.id}</code>
                      ${
                        isHidden
                          ? '<span class="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase bg-rose-600 text-white shadow-xs tracking-wider">ĐÃ ẨN (CHẶN ADMIN)</span>'
                          : '<span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">HIỂN THỊ</span>'
                      }
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">${tab.desc}</p>
                  </div>
                </div>

                <!-- Toggle Switch Control -->
                <div class="flex items-center gap-2.5 shrink-0">
                  <span class="text-xs font-semibold ${isHidden ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'} hidden sm:inline">
                    ${isHidden ? 'Ẩn tab' : 'Hiện tab'}
                  </span>
                  <label class="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" class="sr-only peer" ${!isHidden ? 'checked' : ''} onchange="window.toggleTabVisibilityItem('${tab.id}', !this.checked)">
                    <div class="w-11 h-6 bg-rose-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  if (!html) {
    html = `
      <div class="p-8 text-center text-gray-400">
        <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
        <p class="text-xs font-medium">Không tìm thấy tab nào phù hợp với bộ lọc</p>
      </div>
    `;
  }

  container.innerHTML = html;
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

/**
 * Lưu cấu hình Ẩn/Hiện Tab vào CSDL Cloudflare D1
 */
export async function saveSystemTabVisibility(): Promise<void> {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser || gCurrentUser;

  if (!curUser || !isMasterAccount(curUser.email)) {
    if (typeof showToast === 'function') {
      showToast('Chỉ tài khoản trantuandai2508 mới có quyền lưu cấu hình này!', 'error');
    }
    return;
  }

  if (typeof showLoading === 'function') showLoading('Đang lưu cấu hình Ẩn/Hiện Tab vào D1...');

  try {
    const res = await fetch('/api/system/tab-visibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestorEmail: curUser.email,
        visibility: localTabVisibility,
        bulkUpdates: localTabVisibility
      })
    });

    const json = await res.json().catch(() => ({}));
    if (!json.success) {
      throw new Error(json.error || 'Lỗi khi lưu cấu hình');
    }

    // Cập nhật trạng thái client
    setSystemTabVisibility(localTabVisibility);
    applyUserSessionToUI();

    closeTabVisibilityModal();

    if (typeof showToast === 'function') {
      showToast('Đã lưu cấu hình Ẩn/Hiện Tab thành công! Có hiệu lực ngay lập tức.', 'success');
    }
  } catch (e: any) {
    console.error('saveSystemTabVisibility error:', e);
    if (typeof showToast === 'function') {
      showToast(e.message || 'Không thể lưu cấu hình', 'error');
    }
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}
