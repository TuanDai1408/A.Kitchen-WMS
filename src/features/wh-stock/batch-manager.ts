import { escapeHtml } from '@/ts/utils/formatters';
import { canUserCreate, canUserEdit, canUserDelete, assertPermission } from '@/features/auth';
import { getAppSitesList } from '@/features/auth/sites-modal';

declare const window: any;
declare const App: { currentBranch?: string; [key: string]: any };
declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const lucide: any;

export interface BatchRecord {
  id: string;
  sku: string;
  branch_id: string;
  branch_code: string;
  branch_name: string;
  batch_code: string;
  mfg_date: string | null;
  exp_date: string | null;
  qty: number;
  storage_loc: string;
  item_name: string;
  unit: string;
  category: string;
  unit_price: number;
}

export interface GroupedBatch {
  batch_code: string;
  items: BatchRecord[];
  total_qty: number;
  earliest_exp: string | null;
  sites: string[];
  locations: string[];
}

let gBatchesList: BatchRecord[] = [];
let gBatchCatalogItems: Array<{ code: string; name: string; unit: string }> = [];
let _editingBatchId: string | null = null;
let _pendingDeleteBatch: { id: string; code: string } | null = null;
let _activeDetailBatchCode: string | null = null;

export function switchWhStockSubView(mode: 'fefo' | 'batches'): void {
  const fefoView = document.getElementById('whStockSubViewFefo');
  const batchesView = document.getElementById('whStockSubViewBatches');
  const btnFefo = document.getElementById('btnSubTabWhFefo');
  const btnBatches = document.getElementById('btnSubTabWhBatches');
  const fefoActions = document.getElementById('whStockFefoHeaderActions');

  if (mode === 'batches') {
    fefoView?.classList.add('hidden');
    batchesView?.classList.remove('hidden');
    fefoActions?.classList.add('hidden');
    if (btnFefo) btnFefo.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-white/5 flex items-center gap-1.5';
    if (btnBatches) btnBatches.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs bg-brand-500 text-white flex items-center gap-1.5';
    loadBatchManager();
  } else {
    fefoView?.classList.remove('hidden');
    batchesView?.classList.add('hidden');
    fefoActions?.classList.remove('hidden');
    if (btnFefo) btnFefo.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs bg-brand-500 text-white flex items-center gap-1.5';
    if (btnBatches) btnBatches.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-white/5 flex items-center gap-1.5';
  }
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

function populateBatchSiteSelectors(): void {
  const sites = getAppSitesList();
  const modalSel = document.getElementById('batchModalSiteSelect') as HTMLSelectElement | null;
  if (modalSel) {
    const siteOnly = sites.filter(s => s.code !== 'ALL');
    modalSel.innerHTML = siteOnly.map(s => `<option value="${escapeHtml(s.code)}">${escapeHtml(s.name)}</option>`).join('');
  }
}

export async function loadBatchManager(): Promise<void> {
  populateBatchSiteSelectors();

  const addBtn = document.getElementById('btnOpenAddBatchModal') as HTMLButtonElement | null;
  if (addBtn) {
    const canCreate = canUserCreate('wh-stock');
    addBtn.classList.toggle('hidden', !canCreate);
  }

  const tbody = document.getElementById('batchManageTableBody');
  const mob = document.getElementById('batchManageMobileCards');

  if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-400 text-xs">Đang tải danh sách lô hàng...</td></tr>`;

  try {
    const res = await fetch(`/api/wh/batches?branch=ALL&nocache=1`);
    const json = await res.json();
    gBatchesList = json.success && Array.isArray(json.data) ? json.data : [];
    renderBatchManagerTable();
    if (_activeDetailBatchCode) {
      const modal = document.getElementById('modalBatchItemsDetail');
      if (modal && !modal.classList.contains('hidden')) {
        renderBatchItemsDetailContent(_activeDetailBatchCode);
      }
    }
  } catch (err: any) {
    console.error('loadBatchManager error:', err);
    if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-rose-500 text-xs">Lỗi tải dữ liệu lô hàng!</td></tr>`;
    if (mob) mob.innerHTML = `<div class="p-6 text-center text-rose-500 text-xs">Lỗi tải dữ liệu lô hàng!</div>`;
  }
}

function getDaysRemaining(expDateStr: string | null): number | null {
  if (!expDateStr) return null;
  const exp = new Date(String(expDateStr).slice(0, 10));
  if (isNaN(exp.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((exp.getTime() - today.getTime()) / 86400000);
}

function groupBatches(records: BatchRecord[]): GroupedBatch[] {
  const map = new Map<string, GroupedBatch>();
  for (const r of records) {
    const code = (r.batch_code || 'KHONG-MA-LO').trim();
    let g = map.get(code);
    if (!g) {
      g = {
        batch_code: code,
        items: [],
        total_qty: 0,
        earliest_exp: null,
        sites: [],
        locations: []
      };
      map.set(code, g);
    }
    g.items.push(r);
    g.total_qty += Number(r.qty) || 0;

    const exp = r.exp_date ? String(r.exp_date).slice(0, 10) : null;
    if (exp && (!g.earliest_exp || exp < g.earliest_exp)) {
      g.earliest_exp = exp;
    }
    if (r.branch_code && !g.sites.includes(r.branch_code)) {
      g.sites.push(r.branch_code);
    }
    if (r.storage_loc && !g.locations.includes(r.storage_loc)) {
      g.locations.push(r.storage_loc);
    }
  }
  return Array.from(map.values()).sort((a, b) => {
    if (!a.earliest_exp && !b.earliest_exp) return a.batch_code.localeCompare(b.batch_code);
    if (!a.earliest_exp) return 1;
    if (!b.earliest_exp) return -1;
    return a.earliest_exp.localeCompare(b.earliest_exp);
  });
}

function getStatusBadgeHtml(days: number | null): string {
  if (days === null) {
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">Chưa có HSD</span>`;
  }
  if (days <= 0) {
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">Hết hạn (${days}d)</span>`;
  }
  if (days <= 7) {
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">Còn ${days} ngày</span>`;
  }
  if (days <= 15) {
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">Còn ${days} ngày</span>`;
  }
  return `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Còn ${days} ngày</span>`;
}

export function renderBatchManagerTable(): void {
  const tbody = document.getElementById('batchManageTableBody');
  const mob = document.getElementById('batchManageMobileCards');
  if (!tbody && !mob) return;

  const q = ((document.getElementById('batchManageSearchInput') as HTMLInputElement | null)?.value || '').trim().toLowerCase();
  const statusFilter = (document.getElementById('batchManageStatusFilter') as HTMLSelectElement | null)?.value || '';

  const grouped = groupBatches(gBatchesList).filter(g => {
    const matchSearch = !q ||
      g.batch_code.toLowerCase().includes(q) ||
      g.items.some(b =>
        (b.sku || '').toLowerCase().includes(q) ||
        (b.item_name || '').toLowerCase().includes(q)
      );
    if (!matchSearch) return false;

    const days = getDaysRemaining(g.earliest_exp);
    if (statusFilter === 'red') return days !== null && days <= 7;
    if (statusFilter === 'yellow') return days !== null && days > 7 && days <= 15;
    if (statusFilter === 'safe') return days === null || days > 15;
    return true;
  });

  if (tbody) {
    if (!grouped.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-400 text-xs">Chưa có lô hàng nào phù hợp bộ lọc.</td></tr>`;
    } else {
      tbody.innerHTML = grouped.map((g, idx) => {
        const days = getDaysRemaining(g.earliest_exp);
        const expStr = g.earliest_exp || '—';
        const statusBadge = getStatusBadgeHtml(days);
        const safeCode = escapeHtml(g.batch_code);

        return `
          <tr onclick="openBatchItemsDetailModal('${safeCode}')" class="hover:bg-brand-50/40 dark:hover:bg-white/[0.03] transition-colors cursor-pointer">
            <td class="p-3 text-center font-mono text-xs text-gray-400">${idx + 1}</td>
            <td class="p-3">
              <div class="font-mono font-bold text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                <span>${safeCode}</span>
              </div>
              <div class="text-[11px] text-gray-400 mt-0.5">${escapeHtml(g.locations.join(', ') || 'Kệ Bếp')}</div>
            </td>
            <td class="p-3 text-center">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-mono">
                ${g.items.length} mặt hàng
              </span>
            </td>
            <td class="p-3 text-right font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">${Number(g.total_qty || 0).toLocaleString('vi-VN')}</td>
            <td class="p-3 text-center font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">${escapeHtml(expStr)}</td>
            <td class="p-3 text-center">${statusBadge}</td>
            <td class="p-3 text-center whitespace-nowrap" onclick="event.stopPropagation()">
              <button type="button" onclick="openBatchItemsDetailModal('${safeCode}')" class="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs inline-flex items-center gap-1.5 transition-colors">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                <span>Xem mặt hàng</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  if (mob) {
    if (!grouped.length) {
      mob.innerHTML = `<div class="p-6 text-center text-gray-400 text-xs">Chưa có lô hàng nào phù hợp.</div>`;
    } else {
      mob.innerHTML = grouped.map(g => {
        const days = getDaysRemaining(g.earliest_exp);
        const expStr = g.earliest_exp || '—';
        const safeCode = escapeHtml(g.batch_code);
        return `
          <div onclick="openBatchItemsDetailModal('${safeCode}')" class="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-2.5 cursor-pointer active:scale-[0.99] transition-all">
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono font-bold text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                <i data-lucide="layers" class="w-3.5 h-3.5"></i> ${safeCode}
              </span>
              ${getStatusBadgeHtml(days)}
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold font-mono text-[11px]">${g.items.length} mặt hàng</span>
              <span class="font-mono text-gray-500 text-[11px]">HSD sớm nhất: <b>${escapeHtml(expStr)}</b></span>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
              <span class="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">Tổng SL: ${Number(g.total_qty || 0).toLocaleString('vi-VN')}</span>
              <span class="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">Xem chi tiết <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i></span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function openBatchItemsDetailModal(batchCode: string): void {
  _activeDetailBatchCode = batchCode;
  renderBatchItemsDetailContent(batchCode);
  document.getElementById('modalBatchItemsDetail')?.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeBatchItemsDetailModal(): void {
  _activeDetailBatchCode = null;
  document.getElementById('modalBatchItemsDetail')?.classList.add('hidden');
}

function renderBatchItemsDetailContent(batchCode: string): void {
  const items = gBatchesList.filter(b => (b.batch_code || 'KHONG-MA-LO').trim() === batchCode);
  const titleEl = document.getElementById('batchDetailModalTitle');
  const subEl = document.getElementById('batchDetailModalSub');
  const addBtn = document.getElementById('btnAddItemToBatchDetail') as HTMLButtonElement | null;
  const tbody = document.getElementById('batchDetailItemsBody');
  const mob = document.getElementById('batchDetailItemsMobile');

  const canCreate = canUserCreate('wh-stock');
  const canEdit = canUserEdit('wh-stock');
  const canDelete = canUserDelete('wh-stock');

  const totalQty = items.reduce((sum, x) => sum + (Number(x.qty) || 0), 0);
  if (titleEl) titleEl.textContent = `Chi tiết lô hàng: ${batchCode}`;
  if (subEl) subEl.textContent = `${items.length} mặt hàng trong lô • Tổng tồn: ${totalQty.toLocaleString('vi-VN')}`;

  if (addBtn) {
    addBtn.classList.toggle('hidden', !canCreate);
    addBtn.setAttribute('onclick', `openCreateBatchModal('${escapeHtml(batchCode)}')`);
  }

  if (tbody) {
    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-gray-400 text-xs">Lô hàng này hiện không còn mặt hàng nào.</td></tr>`;
    } else {
      tbody.innerHTML = items.map((b, idx) => {
        const mfgStr = b.mfg_date ? String(b.mfg_date).slice(0, 10) : '—';
        const expStr = b.exp_date ? String(b.exp_date).slice(0, 10) : '—';
        return `
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40">
            <td class="p-2.5 text-center font-mono text-xs text-gray-400">${idx + 1}</td>
            <td class="p-2.5">
              <div class="font-bold text-xs text-gray-900 dark:text-white">${escapeHtml(b.item_name || b.sku)}</div>
              <div class="text-[11px] font-mono text-gray-400">${escapeHtml(b.sku)} • ${escapeHtml(b.unit || 'Phần')}</div>
            </td>
            <td class="p-2.5 text-center font-mono text-xs font-semibold">${escapeHtml(b.branch_code)}</td>
            <td class="p-2.5 text-center font-mono text-xs text-gray-500">${escapeHtml(mfgStr)}<div class="text-[11px] text-gray-800 dark:text-gray-200 font-semibold">HSD: ${escapeHtml(expStr)}</div></td>
            <td class="p-2.5 text-right font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">${Number(b.qty || 0).toLocaleString('vi-VN')}</td>
            <td class="p-2.5 text-xs text-gray-500">${escapeHtml(b.storage_loc || 'Kệ Bếp')}</td>
            <td class="p-2.5 text-center whitespace-nowrap">
              <div class="inline-flex items-center gap-1 justify-center">
                ${canEdit ? `
                  <button type="button" onclick="openEditBatchModal('${escapeHtml(b.id)}')" class="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 transition-colors" title="Sửa mặt hàng trong lô">
                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                  </button>
                ` : ''}
                ${canDelete ? `
                  <button type="button" onclick="confirmDeleteBatch('${escapeHtml(b.id)}', '${escapeHtml(b.batch_code)}')" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 transition-colors" title="Xóa mặt hàng khỏi lô">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  if (mob) {
    if (!items.length) {
      mob.innerHTML = `<div class="p-4 text-center text-gray-400 text-xs">Không còn mặt hàng nào trong lô.</div>`;
    } else {
      mob.innerHTML = items.map(b => {
        const expStr = b.exp_date ? String(b.exp_date).slice(0, 10) : '—';
        return `
          <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 space-y-1.5 text-xs">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-gray-900 dark:text-white">${escapeHtml(b.item_name || b.sku)}</span>
              <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">${Number(b.qty || 0).toLocaleString('vi-VN')} ${escapeHtml(b.unit || '')}</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <span>${escapeHtml(b.sku)} • ${escapeHtml(b.branch_code)}</span>
              <span>HSD: ${escapeHtml(expStr)}</span>
            </div>
            <div class="flex items-center justify-end gap-1.5 pt-1.5 border-t border-gray-200/70 dark:border-gray-700/70">
              ${canEdit ? `<button type="button" onclick="openEditBatchModal('${escapeHtml(b.id)}')" class="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">Sửa</button>` : ''}
              ${canDelete ? `<button type="button" onclick="confirmDeleteBatch('${escapeHtml(b.id)}', '${escapeHtml(b.batch_code)}')" class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs">Xóa</button>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

async function ensureBatchCatalogLoaded(siteCode: string): Promise<void> {
  if (gBatchCatalogItems.length > 0) return;
  try {
    const res = await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(siteCode)}&no-cache=1`);
    const json = await res.json();
    if (json.success && json.data && Array.isArray(json.data.items)) {
      const seen = new Set<string>();
      gBatchCatalogItems = json.data.items
        .filter((i: any) => {
          const c = String(i.code || '').trim();
          if (!c || seen.has(c)) return false;
          seen.add(c);
          return true;
        })
        .map((i: any) => ({ code: i.code, name: i.name || i.code, unit: i.unit || 'Phần' }));
    }
  } catch (e) {}
}

export async function openCreateBatchModal(preselectedBatchCode?: string): Promise<void> {
  if (!assertPermission('wh-stock', 'create', 'thêm lô hàng mới')) return;
  populateBatchSiteSelectors();
  _editingBatchId = null;

  const siteSel = document.getElementById('batchModalSiteSelect') as HTMLSelectElement | null;
  const activeBranch = (typeof App !== 'undefined' && App.currentBranch && App.currentBranch !== 'ALL')
    ? App.currentBranch
    : (localStorage.getItem('orbit_user_site') || 'K001');
  if (siteSel) {
    siteSel.disabled = false;
    siteSel.value = activeBranch;
  }

  await ensureBatchCatalogLoaded(activeBranch);
  const skuSel = document.getElementById('batchModalSkuSelect') as HTMLSelectElement | null;
  if (skuSel) {
    skuSel.disabled = false;
    skuSel.innerHTML = `<option value="">-- Chọn mã hàng --</option>` +
      gBatchCatalogItems.map(i => `<option value="${escapeHtml(i.code)}">${escapeHtml(i.code)} - ${escapeHtml(i.name)} (${escapeHtml(i.unit)})</option>`).join('');
  }

  const titleEl = document.getElementById('batchModalTitle');
  if (titleEl) titleEl.textContent = preselectedBatchCode ? `Thêm mặt hàng vào lô ${preselectedBatchCode}` : 'Thêm Lô Hàng Mới';

  const codeEl = document.getElementById('batchModalCode') as HTMLInputElement | null;
  const mfgEl = document.getElementById('batchModalMfgDate') as HTMLInputElement | null;
  const expEl = document.getElementById('batchModalExpDate') as HTMLInputElement | null;
  const qtyEl = document.getElementById('batchModalQty') as HTMLInputElement | null;
  const locEl = document.getElementById('batchModalStorageLoc') as HTMLInputElement | null;
  const noteEl = document.getElementById('batchModalNote') as HTMLInputElement | null;

  const today = new Date().toISOString().slice(0, 10);
  if (codeEl) codeEl.value = preselectedBatchCode || `LO-${today.replace(/-/g, '').slice(2)}-${Math.floor(100 + Math.random() * 900)}`;
  if (mfgEl) mfgEl.value = today;
  if (expEl) expEl.value = '';
  if (qtyEl) qtyEl.value = '';
  if (locEl) locEl.value = 'Kệ Bếp';
  if (noteEl) noteEl.value = '';

  document.getElementById('modalBatchManage')?.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export async function openEditBatchModal(batchId: string): Promise<void> {
  if (!assertPermission('wh-stock', 'edit', 'chỉnh sửa lô hàng')) return;
  const b = gBatchesList.find(x => String(x.id) === String(batchId));
  if (!b) return;

  populateBatchSiteSelectors();
  _editingBatchId = b.id;

  const siteSel = document.getElementById('batchModalSiteSelect') as HTMLSelectElement | null;
  if (siteSel) {
    siteSel.value = b.branch_code || 'K001';
    siteSel.disabled = true;
  }

  const skuSel = document.getElementById('batchModalSkuSelect') as HTMLSelectElement | null;
  if (skuSel) {
    skuSel.innerHTML = `<option value="${escapeHtml(b.sku)}">${escapeHtml(b.sku)} - ${escapeHtml(b.item_name || b.sku)}</option>`;
    skuSel.value = b.sku;
    skuSel.disabled = true;
  }

  const titleEl = document.getElementById('batchModalTitle');
  if (titleEl) titleEl.textContent = `Chỉnh Sửa Lô ${b.batch_code}`;

  const codeEl = document.getElementById('batchModalCode') as HTMLInputElement | null;
  const mfgEl = document.getElementById('batchModalMfgDate') as HTMLInputElement | null;
  const expEl = document.getElementById('batchModalExpDate') as HTMLInputElement | null;
  const qtyEl = document.getElementById('batchModalQty') as HTMLInputElement | null;
  const locEl = document.getElementById('batchModalStorageLoc') as HTMLInputElement | null;
  const noteEl = document.getElementById('batchModalNote') as HTMLInputElement | null;

  if (codeEl) codeEl.value = b.batch_code || '';
  if (mfgEl) mfgEl.value = b.mfg_date ? String(b.mfg_date).slice(0, 10) : '';
  if (expEl) expEl.value = b.exp_date ? String(b.exp_date).slice(0, 10) : '';
  if (qtyEl) qtyEl.value = String(b.qty ?? 0);
  if (locEl) locEl.value = b.storage_loc || 'Kệ Bếp';
  if (noteEl) noteEl.value = '';

  document.getElementById('modalBatchManage')?.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeBatchManageModal(): void {
  _editingBatchId = null;
  document.getElementById('modalBatchManage')?.classList.add('hidden');
}

function syncAllInventoryViews(): void {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  if (typeof w.loadStockFEFO === 'function') w.loadStockFEFO();
  if (typeof w.loadWhInventory === 'function') w.loadWhInventory();
  if (typeof w.loadFnbStock === 'function') w.loadFnbStock();
  if (typeof w.loadFnbCounts === 'function') w.loadFnbCounts();
  if (typeof w.loadFnbWaste === 'function') w.loadFnbWaste();
  if (typeof w.loadFnbKitchenIssue === 'function') w.loadFnbKitchenIssue();
}

export async function saveBatchManage(): Promise<void> {
  const isEdit = Boolean(_editingBatchId);
  if (!assertPermission('wh-stock', isEdit ? 'edit' : 'create', isEdit ? 'chỉnh sửa lô hàng' : 'thêm lô hàng mới')) return;

  const branchCode = (document.getElementById('batchModalSiteSelect') as HTMLSelectElement | null)?.value || 'K001';
  const sku = (document.getElementById('batchModalSkuSelect') as HTMLSelectElement | null)?.value || '';
  const batchCode = (document.getElementById('batchModalCode') as HTMLInputElement | null)?.value?.trim() || '';
  const mfgDate = (document.getElementById('batchModalMfgDate') as HTMLInputElement | null)?.value || '';
  const expDate = (document.getElementById('batchModalExpDate') as HTMLInputElement | null)?.value || '';
  const qty = parseFloat((document.getElementById('batchModalQty') as HTMLInputElement | null)?.value || '0') || 0;
  const storageLoc = (document.getElementById('batchModalStorageLoc') as HTMLInputElement | null)?.value?.trim() || 'Kệ Bếp';
  const note = (document.getElementById('batchModalNote') as HTMLInputElement | null)?.value?.trim() || '';

  if (!sku || !batchCode || (!isEdit && qty <= 0)) {
    if (typeof showToast === 'function') showToast('Vui lòng nhập đầy đủ Mã hàng, Mã lô và Số lượng!', 'warning');
    return;
  }

  const btn = document.getElementById('btnSaveBatchManage') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    if (typeof showLoading === 'function') showLoading('Đang lưu lô hàng & đồng bộ tồn kho...');
    const res = await fetch('/api/wh/batches', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        isEdit
          ? { id: _editingBatchId, batch_code: batchCode, mfg_date: mfgDate || null, exp_date: expDate || null, qty, storage_loc: storageLoc, note }
          : { branch_code: branchCode, sku, batch_code: batchCode, mfg_date: mfgDate || null, exp_date: expDate || null, qty, storage_loc: storageLoc, note }
      )
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Lưu lô hàng thất bại');

    if (typeof showToast === 'function') showToast(json.message || 'Lưu lô hàng thành công!', 'success');
    closeBatchManageModal();
    await loadBatchManager();
    syncAllInventoryViews();
  } catch (err: any) {
    if (typeof showToast === 'function') showToast('Lỗi: ' + err.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export function confirmDeleteBatch(batchId: string, batchCode: string): void {
  if (!assertPermission('wh-stock', 'delete', 'xóa lô hàng')) return;
  _pendingDeleteBatch = { id: batchId, code: batchCode || batchId };
  const codeEl = document.getElementById('confirmDeleteBatchCode');
  if (codeEl) codeEl.textContent = _pendingDeleteBatch.code;
  document.getElementById('modalConfirmDeleteBatch')?.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeDeleteBatchModal(): void {
  _pendingDeleteBatch = null;
  document.getElementById('modalConfirmDeleteBatch')?.classList.add('hidden');
}

export async function executeDeleteBatch(): Promise<void> {
  if (!assertPermission('wh-stock', 'delete', 'xóa lô hàng')) return;
  if (!_pendingDeleteBatch) return;

  const { id } = _pendingDeleteBatch;
  const btn = document.getElementById('btnExecuteDeleteBatch') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    if (typeof showLoading === 'function') showLoading('Đang xóa lô hàng & đồng bộ tồn kho...');
    const res = await fetch(`/api/wh/batches?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xóa lô thất bại');

    if (typeof showToast === 'function') showToast(json.message || 'Đã xóa lô hàng!', 'success');
    closeDeleteBatchModal();
    await loadBatchManager();
    syncAllInventoryViews();
  } catch (err: any) {
    if (typeof showToast === 'function') showToast('Lỗi xóa lô: ' + err.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
    if (typeof hideLoading === 'function') hideLoading();
  }
}
