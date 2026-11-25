import { ALL_TAB_GROUPS, isMasterAccount, loadPersistedUser } from './constants';
import { gCurrentUser } from './accounts';
import {
  gSystemTabVisibility,
  setSystemTabVisibility,
  gSystemTabOrder,
  setSystemTabOrder,
  applyCustomTabOrderToUI,
  syncCurrentUserPermissions,
  CustomTabGroupOrder
} from './rbac-session';

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const lucide: any;

export interface EditableTab {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export interface EditableTabGroup {
  groupId: string;
  groupName: string;
  icon: string;
  color: string;
  tabs: EditableTab[];
}

let localTabVisibility: Record<string, boolean> = {};
let localTabGroups: EditableTabGroup[] = [];
let currentSearchQuery = '';
let currentFilterMode: 'all' | 'hidden' | 'visible' = 'all';

/**
 * Khởi tạo cấu trúc các nhóm và tab cho modal (kết hợp thứ tự tùy biến đã lưu với danh mục hệ thống)
 */
export function initLocalTabGroups(): void {
  // 1. Sắp xếp thứ tự các nhóm theo gSystemTabOrder (nếu có)
  let orderedGroups = [...ALL_TAB_GROUPS];
  if (gSystemTabOrder && Array.isArray(gSystemTabOrder) && gSystemTabOrder.length > 0) {
    const groupOrderMap = new Map<string, number>();
    gSystemTabOrder.forEach((go, i) => groupOrderMap.set(go.groupId, i));
    orderedGroups.sort((a, b) => {
      const ordA = groupOrderMap.has(a.groupId) ? groupOrderMap.get(a.groupId)! : 999;
      const ordB = groupOrderMap.has(b.groupId) ? groupOrderMap.get(b.groupId)! : 999;
      return ordA - ordB;
    });
  }

  // 2. Với mỗi nhóm, sắp xếp các tab theo thứ tự trong gSystemTabOrder (nếu có)
  localTabGroups = orderedGroups.map(g => {
    const savedGroup = gSystemTabOrder?.find(x => x.groupId === g.groupId);
    let sortedTabs = [...g.tabs];
    if (savedGroup && Array.isArray(savedGroup.tabs)) {
      const tabOrderMap = new Map<string, number>();
      savedGroup.tabs.forEach((tId, i) => tabOrderMap.set(tId, i));
      sortedTabs.sort((a, b) => {
        const ordA = tabOrderMap.has(a.id) ? tabOrderMap.get(a.id)! : 999;
        const ordB = tabOrderMap.has(b.id) ? tabOrderMap.get(b.id)! : 999;
        return ordA - ordB;
      });
    }
    return {
      groupId: g.groupId,
      groupName: g.groupName,
      icon: g.icon,
      color: g.color,
      tabs: sortedTabs.map(t => ({ ...t }))
    };
  });
}

/**
 * Tải trạng thái ẩn/hiện và thứ tự vị trí các tab toàn hệ thống từ CSDL Cloudflare D1
 */
export async function loadSystemTabVisibility(): Promise<Record<string, boolean>> {
  try {
    const res = await fetch('/api/system/tab-visibility');
    const json = await res.json().catch(() => ({}));
    if (json.success) {
      if (json.data) {
        setSystemTabVisibility(json.data);
        localTabVisibility = { ...json.data };
      }
      if (json.tabOrder && Array.isArray(json.tabOrder)) {
        setSystemTabOrder(json.tabOrder);
      }
      return json.data || gSystemTabVisibility;
    }
  } catch (e) {
    console.error('loadSystemTabVisibility error:', e);
  }
  localTabVisibility = { ...gSystemTabVisibility };
  return gSystemTabVisibility;
}

/**
 * Mở modal cấu hình Ẩn/Hiện Tab & Đổi Vị Trí - DÀNH ĐỘC QUYỀN CHO trantuandai2508
 */
export async function openTabVisibilityModal(): Promise<void> {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser || gCurrentUser || loadPersistedUser();
  const masterEmail = (curUser && (curUser.email || (curUser as any).username)) || '';

  if (!curUser || !isMasterAccount(masterEmail)) {
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
  if (typeof showLoading === 'function') showLoading('Đang tải cấu hình hiển thị & vị trí tabs...');
  try {
    await loadSystemTabVisibility();
    initLocalTabGroups();
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
 * Bật hiển thị tất cả các tab (giữ nguyên thứ tự)
 */
export function setAllTabsVisible(): void {
  localTabGroups.forEach(g => {
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
 * Di chuyển thứ tự của một tab trong nhóm (Lên = -1, Xuống = 1)
 */
export function moveTabItem(tabId: string, direction: -1 | 1): void {
  for (let gIdx = 0; gIdx < localTabGroups.length; gIdx++) {
    const tIdx = localTabGroups[gIdx].tabs.findIndex(t => t.id === tabId);
    if (tIdx !== -1) {
      const currentGroup = localTabGroups[gIdx];
      const targetTabIdx = tIdx + direction;
      if (targetTabIdx >= 0 && targetTabIdx < currentGroup.tabs.length) {
        const temp = currentGroup.tabs[tIdx];
        currentGroup.tabs[tIdx] = currentGroup.tabs[targetTabIdx];
        currentGroup.tabs[targetTabIdx] = temp;
        renderTabVisibilityList();
      }
      return;
    }
  }
}

/**
 * Di chuyển thứ tự của cả nhóm danh mục (Lên = -1, Xuống = 1)
 */
export function moveTabGroup(groupId: string, direction: -1 | 1): void {
  const idx = localTabGroups.findIndex(g => g.groupId === groupId);
  if (idx === -1) return;
  const targetIdx = idx + direction;
  if (targetIdx >= 0 && targetIdx < localTabGroups.length) {
    const temp = localTabGroups[idx];
    localTabGroups[idx] = localTabGroups[targetIdx];
    localTabGroups[targetIdx] = temp;
    renderTabVisibilityList();
  }
}

/**
 * Khôi phục thứ tự vị trí các tab và nhóm về mặc định ban đầu
 */
export function resetTabOrderToDefault(): void {
  localTabGroups = ALL_TAB_GROUPS.map(g => ({
    groupId: g.groupId,
    groupName: g.groupName,
    icon: g.icon,
    color: g.color,
    tabs: g.tabs.map(t => ({ ...t }))
  }));
  renderTabVisibilityList();
  if (typeof showToast === 'function') {
    showToast('Đã khôi phục thứ tự các tab về mặc định ban đầu. Nhấn Lưu Cấu Hình để áp dụng.', 'info');
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
 * Render danh sách tabs chia theo nhóm kèm chức năng Đổi vị trí (Up/Down) vào Modal
 */
export function renderTabVisibilityList(): void {
  const container = document.getElementById('tabVisibilityList');
  const countBadge = document.getElementById('tabVisHiddenCountBadge');
  if (!container) return;

  if (localTabGroups.length === 0) {
    initLocalTabGroups();
  }

  let totalTabs = 0;
  let hiddenCount = 0;

  localTabGroups.forEach(g => {
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

  localTabGroups.forEach((group, gIdx) => {
    const isFirstGroup = gIdx === 0;
    const isLastGroup = gIdx === localTabGroups.length - 1;

    // Lọc tabs theo từ khóa và chế độ filter
    const filteredTabsWithIndex = group.tabs
      .map((tab, originalIdx) => ({ tab, originalIdx }))
      .filter(({ tab }) => {
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

    if (filteredTabsWithIndex.length === 0 && (currentSearchQuery || currentFilterMode !== 'all')) return;

    html += `
      <div class="mb-5 rounded-2xl border border-gray-200/90 dark:border-gray-800/90 bg-white dark:bg-gray-900/60 overflow-hidden shadow-xs">
        <!-- Group Header với nút Đổi vị trí nhóm (Up/Down) -->
        <div class="p-3 sm:px-4 bg-gray-50/90 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              group.color === 'rose' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
              group.color === 'emerald' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
              group.color === 'amber' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
              group.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
              'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
            }">
              <i data-lucide="${group.icon}" class="w-3.5 h-3.5"></i>
            </span>
            <span class="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white truncate">${group.groupName}</span>
            <span class="text-[11px] font-semibold text-gray-400">(${group.tabs.length} tabs)</span>
          </div>

          <!-- Nút đổi thứ tự nhóm -->
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-[11px] font-medium text-gray-400 hidden sm:inline mr-1">Vị trí nhóm:</span>
            <button onclick="window.moveTabGroup('${group.groupId}', -1)" type="button" ${isFirstGroup ? 'disabled' : ''} title="${isFirstGroup ? 'Đang ở đầu danh sách nhóm' : 'Chuyển cả nhóm lên trên'}" class="w-6 h-6 rounded-md flex items-center justify-center transition-colors shadow-2xs select-none ${isFirstGroup ? 'opacity-25 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-gray-600 dark:text-gray-300 cursor-pointer'}">
              <i data-lucide="arrow-up" class="w-3.5 h-3.5 pointer-events-none"></i>
            </button>
            <button onclick="window.moveTabGroup('${group.groupId}', 1)" type="button" ${isLastGroup ? 'disabled' : ''} title="${isLastGroup ? 'Đang ở cuối danh sách nhóm' : 'Chuyển cả nhóm xuống dưới'}" class="w-6 h-6 rounded-md flex items-center justify-center transition-colors shadow-2xs select-none ${isLastGroup ? 'opacity-25 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-gray-600 dark:text-gray-300 cursor-pointer'}">
              <i data-lucide="arrow-down" class="w-3.5 h-3.5 pointer-events-none"></i>
            </button>
          </div>
        </div>

        <!-- Group Tabs List với nút Đổi vị trí từng tab (Up/Down) -->
        <div class="divide-y divide-gray-100 dark:divide-gray-800/70">
          ${filteredTabsWithIndex.map(({ tab, originalIdx }) => {
            const isHidden = localTabVisibility[tab.id] === true;
            const isFirst = originalIdx === 0;
            const isLast = originalIdx === group.tabs.length - 1;

            return `
              <div class="p-3 sm:px-4 flex items-center justify-between gap-3 transition-colors ${
                isHidden
                  ? 'bg-rose-50/40 dark:bg-rose-950/20'
                  : 'hover:bg-gray-50/60 dark:hover:bg-gray-800/30'
              }">
                <div class="flex items-center gap-3 min-w-0">
                  <!-- Nút di chuyển tab lên / xuống -->
                  <div class="flex flex-col gap-0.5 shrink-0">
                    <button onclick="window.moveTabItem('${tab.id}', -1)" type="button" ${isFirst ? 'disabled' : ''} title="${isFirst ? 'Đang ở đầu nhóm' : 'Di chuyển tab lên trên'}" class="w-6 h-6 rounded-md flex items-center justify-center transition-colors select-none ${isFirst ? 'opacity-25 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-gray-100 hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:hover:bg-indigo-600 text-gray-500 dark:text-gray-400 cursor-pointer'}">
                      <i data-lucide="chevron-up" class="w-3.5 h-3.5 pointer-events-none"></i>
                    </button>
                    <button onclick="window.moveTabItem('${tab.id}', 1)" type="button" ${isLast ? 'disabled' : ''} title="${isLast ? 'Đang ở cuối nhóm' : 'Di chuyển tab xuống dưới'}" class="w-6 h-6 rounded-md flex items-center justify-center transition-colors select-none ${isLast ? 'opacity-25 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-gray-100 hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:hover:bg-indigo-600 text-gray-500 dark:text-gray-400 cursor-pointer'}">
                      <i data-lucide="chevron-down" class="w-3.5 h-3.5 pointer-events-none"></i>
                    </button>
                  </div>

                  <!-- Thứ tự tab trong nhóm -->
                  <span class="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shrink-0 select-none">
                    #${originalIdx + 1}
                  </span>

                  <!-- Icon Tab -->
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isHidden
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }">
                    <i data-lucide="${tab.icon}" class="w-4 h-4"></i>
                  </div>

                  <!-- Tên & Mô tả tab -->
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

  const prevScrollTop = container.scrollTop;
  container.innerHTML = html;
  container.scrollTop = prevScrollTop;
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

/**
 * Lưu cấu hình Ẩn/Hiện Tab và Thứ tự vị trí các Tab vào CSDL Cloudflare D1
 */
export async function saveSystemTabVisibility(): Promise<void> {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const curUser = w.gCurrentUser || gCurrentUser || loadPersistedUser();
  const requestorEmail = (curUser && (curUser.email || (curUser as any).username)) || 'trantuandai2508@gmail.com';

  if (!curUser || !isMasterAccount(curUser || requestorEmail)) {
    if (typeof showToast === 'function') {
      showToast('Chỉ tài khoản trantuandai2508 mới có quyền lưu cấu hình này!', 'error');
    }
    return;
  }

  if (typeof showLoading === 'function') showLoading('Đang lưu cấu hình Ẩn/Hiện Tab & Vị trí vào CSDL...');

  try {
    // Chuẩn bị mảng cấu trúc thứ tự tab
    const tabOrder: CustomTabGroupOrder[] = localTabGroups.map(g => ({
      groupId: g.groupId,
      tabs: g.tabs.map(t => t.id)
    }));

    const res = await fetch('/api/system/tab-visibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestorEmail,
        visibility: localTabVisibility,
        bulkUpdates: localTabVisibility,
        tabOrder
      })
    });

    const json = await res.json().catch(() => ({}));
    if (!json.success) {
      throw new Error(json.error || 'Lỗi khi lưu cấu hình');
    }

    // Cập nhật trạng thái client và vị trí ngay lập tức
    setSystemTabVisibility(localTabVisibility);
    setSystemTabOrder(tabOrder);
    applyCustomTabOrderToUI(tabOrder);

    // Đồng bộ lại quyền từ CSDL
    if (typeof syncCurrentUserPermissions === 'function') {
      await syncCurrentUserPermissions();
    }

    closeTabVisibilityModal();

    if (typeof showToast === 'function') {
      showToast('Đã lưu cấu hình và vị trí các tab thành công! Giao diện Sidebar đã được cập nhật.', 'success');
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
