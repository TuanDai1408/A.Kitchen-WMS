import { AuditItem, AuditMeta } from './types';
import { cellCode } from './helpers';
import { escapeHtml } from '@/ts/utils/formatters';

export let auditRawItems: AuditItem[] = [];
export let auditItems: AuditItem[] = [];

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const exportStyledExcel: (fileName: string, sheetName: string, headers: string[], dataRows: any[][], numCols?: number[], codeCols?: number[]) => void;
declare const updateAuditKpisAndChart: (items: any[]) => void;
declare const extractSiteCode: (site: string) => string;
declare const lucide: any;
declare const App: any;

function syncAppAudit(): void {
  if (typeof App !== 'undefined') {
    App.auditRawItems = auditRawItems;
    App.auditItems = auditItems;
  }
  if (typeof window !== 'undefined') {
    (window as any).auditRawItems = auditRawItems;
    (window as any).auditItems = auditItems;
  }
}

export async function loadAudit(): Promise<void> {
  const site = (document.getElementById('kkSite') as HTMLSelectElement | null)?.value || '';
  if (typeof showLoading === 'function') showLoading('Tải danh mục kiểm kê theo site...');

  try {
    const res = await fetch(`/api/inventory-audit?site=${encodeURIComponent(site)}&no-cache=1`);
    const json = await res.json();
    const tbody = document.getElementById('kkBody');
    const mob = document.getElementById('kkMobileCards');

    if (json.success && json.data && json.data.length) {
      auditRawItems = json.data;
      auditItems = json.data;
      syncAppAudit();

      populateAuditFilters(json.meta || {});
      filterAuditItems();
    } else {
      auditRawItems = [];
      auditItems = [];
      syncAppAudit();

      if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">Điểm bán này chưa có danh mục mặt hàng nào trong dim_article_stock.</td></tr>';
      if (mob) mob.innerHTML = '<div class="p-6 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs">Điểm bán này chưa có mặt hàng nào.</div>';
      updateAuditCounts(0, 0);
      if (typeof updateAuditKpisAndChart === 'function') updateAuditKpisAndChart([]);
    }
  } catch (e: any) {
    console.error('loadAudit error:', e);
    if (typeof showToast === 'function') showToast('Lỗi tải bảng kiểm kê: ' + e.message);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
}

export function populateAuditFilters(meta?: AuditMeta): void {
  const nganhSel = document.getElementById('kkNganhSelect') as HTMLSelectElement | null;
  const nhomSel = document.getElementById('kkNhomSelect') as HTMLSelectElement | null;
  if (!nganhSel || !nhomSel) return;

  const currentNganh = nganhSel.value;

  const nganhs = (meta && meta.nganh_hang && meta.nganh_hang.length) ? meta.nganh_hang :
    Array.from(new Set(auditRawItems.map((i) => i.nganh_hang).filter(Boolean) as string[])).sort();

  nganhSel.innerHTML = '<option value="">-- Tất cả ngành hàng --</option>' +
    nganhs.map((ng) => `<option value="${escapeHtml(ng)}">${escapeHtml(ng)}</option>`).join('');
  if (nganhs.includes(currentNganh)) nganhSel.value = currentNganh;

  onAuditNganhChange();
}

export function onAuditNganhChange(): void {
  const nganhSel = document.getElementById('kkNganhSelect') as HTMLSelectElement | null;
  const nhomSel = document.getElementById('kkNhomSelect') as HTMLSelectElement | null;
  if (!nhomSel) return;

  const selectedNganh = nganhSel ? nganhSel.value : '';
  let nhoms: string[] = [];
  if (selectedNganh) {
    nhoms = Array.from(new Set(auditRawItems.filter((i) => i.nganh_hang === selectedNganh).map((i) => i.nhom_hang).filter(Boolean) as string[])).sort();
  } else {
    nhoms = Array.from(new Set(auditRawItems.map((i) => i.nhom_hang).filter(Boolean) as string[])).sort();
  }

  nhomSel.innerHTML = '<option value="">-- Tất cả nhóm hàng --</option>' +
    nhoms.map((nh) => `<option value="${escapeHtml(nh)}">${escapeHtml(nh)}</option>`).join('');

  filterAuditItems();
}

export function filterAuditItems(): void {
  const searchInput = document.getElementById('kkSearchInput') as HTMLInputElement | null;
  const search = (searchInput?.value || '').trim().toLowerCase();
  const nganhSel = document.getElementById('kkNganhSelect') as HTMLSelectElement | null;
  const nganh = nganhSel?.value || '';
  const nhomSel = document.getElementById('kkNhomSelect') as HTMLSelectElement | null;
  const nhom = nhomSel?.value || '';
  const priceSel = document.getElementById('kkPriceSelect') as HTMLSelectElement | null;
  const priceStatus = priceSel?.value || 'ALL';
  const statusSel = document.getElementById('kkStatusSelect') as HTMLSelectElement | null;
  const status = statusSel?.value || 'ALL';

  const isFiltering = !!(search || nganh || nhom || priceStatus !== 'ALL' || status !== 'ALL');
  const badge = document.getElementById('kkActiveFilterBadge');
  if (badge) badge.classList.toggle('hidden', !isFiltering);

  const filtered = auditRawItems.filter((it) => {
    // 1. Text search
    if (search) {
      const matchCode = (it.item_code || '').toLowerCase().includes(search);
      const matchName = (it.item_name || '').toLowerCase().includes(search);
      const matchNganh = (it.nganh_hang || '').toLowerCase().includes(search);
      const matchNhom = (it.nhom_hang || '').toLowerCase().includes(search);
      if (!matchCode && !matchName && !matchNganh && !matchNhom) return false;
    }

    // 2. Filter ngành
    if (nganh && it.nganh_hang !== nganh) return false;

    // 3. Filter nhóm
    if (nhom && it.nhom_hang !== nhom) return false;

    // 4. Filter đơn giá
    const price = parseFloat(String(it.price || 0)) || 0;
    if (priceStatus === 'WITH_PRICE' && price <= 0) return false;
    if (priceStatus === 'NO_PRICE' && price > 0) return false;

    // 5. Filter trạng thái kiểm kê
    const tonTruoc = it.closing_t10 || it.closing_t9 || 0;
    const suDung = it.usage_t11;
    const isCounted = suDung !== null && suDung !== undefined;
    if (status === 'COUNTED' && !isCounted) return false;
    if (status === 'UNCOUNTED' && isCounted) return false;
    if (status === 'DIFF') {
      const tonCuoi = tonTruoc - (suDung || 0);
      if (Math.abs(tonCuoi - tonTruoc) < 0.0001 && (!suDung || suDung === 0)) return false;
    }

    return true;
  });

  auditItems = filtered;
  syncAppAudit();
  renderAuditList(filtered);
  updateAuditCounts(filtered.length, auditRawItems.length);
  if (typeof updateAuditKpisAndChart === 'function') updateAuditKpisAndChart(filtered);
}

export function onKkDiscrepancyFilterChange(val: string): void {
  const statusSel = document.getElementById('kkStatusSelect') as HTMLSelectElement | null;
  if (statusSel) {
    statusSel.value = val;
  }
  filterAuditItems();
}

export function resetAuditFilters(): void {
  const searchInput = document.getElementById('kkSearchInput') as HTMLInputElement | null;
  const nganhSel = document.getElementById('kkNganhSelect') as HTMLSelectElement | null;
  const nhomSel = document.getElementById('kkNhomSelect') as HTMLSelectElement | null;
  const priceSel = document.getElementById('kkPriceSelect') as HTMLSelectElement | null;
  const statusSel = document.getElementById('kkStatusSelect') as HTMLSelectElement | null;
  const topFocusSel = document.getElementById('kkDiscrepancyFilter') as HTMLSelectElement | null;

  if (searchInput) searchInput.value = '';
  if (nganhSel) nganhSel.value = '';
  if (nhomSel) nhomSel.value = '';
  if (priceSel) priceSel.value = 'ALL';
  if (statusSel) statusSel.value = 'ALL';
  if (topFocusSel) topFocusSel.value = 'ALL';

  onAuditNganhChange();
}

export function updateAuditCounts(filteredCount: number, totalCount: number): void {
  const fEl = document.getElementById('kkFilteredCount');
  const tEl = document.getElementById('kkTotalCount');
  if (fEl) fEl.textContent = Math.round(filteredCount).toLocaleString('vi-VN');
  if (tEl) tEl.textContent = Math.round(totalCount).toLocaleString('vi-VN');
}

export function renderAuditList(items?: AuditItem[]): void {
  const tbody = document.getElementById('kkBody');
  const mob = document.getElementById('kkMobileCards');
  const list = items || auditItems;

  if (!list || !list.length) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">Không tìm thấy sản phẩm nào khớp với bộ lọc / từ khóa.</td></tr>';
    if (mob) mob.innerHTML = '<div class="p-6 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs">Không tìm thấy sản phẩm nào khớp với bộ lọc.</div>';
    return;
  }

  // Desktop Table
  if (tbody) {
    tbody.innerHTML = list.map((it) => {
      const tonTruoc = it.closing_t10 || it.closing_t9 || 0;
      const suDung = it.usage_t11 !== null && it.usage_t11 !== undefined ? it.usage_t11 : 0;
      const tonCuoi = tonTruoc - suDung;
      const price = parseFloat(String(it.price || 0)) || 0;
      const thanhTien = tonCuoi * price;
      const catLabel = (it.nhom_hang && it.nhom_hang !== 'Chưa phân loại') ? it.nhom_hang : (it.nganh_hang || 'Vật tư');

      return `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="col-code">${cellCode(it.item_code)}</td>
          <td>
            <div class="font-medium text-gray-900 dark:text-white text-xs">${escapeHtml(it.item_name)}</div>
            <div class="code text-gray-400 dark:text-gray-500 text-[10px] font-mono">${escapeHtml(it.warehouse_code || 'Kho')}</div>
          </td>
          <td>
            <span class="badge badge-neutral max-w-[160px] truncate text-xs" title="${escapeHtml(catLabel)}">
              ${escapeHtml(catLabel)}
            </span>
          </td>
          <td class="text-center text-gray-600 dark:text-gray-300 font-medium text-xs">${escapeHtml(it.unit || '')}</td>
          <td class="col-num text-right num font-mono text-xs">${price > 0 ? Math.round(price).toLocaleString('vi-VN') + ' ₫' : '<span class="text-gray-400">0 ₫</span>'}</td>
          <td class="col-num text-right num font-medium text-gray-900 dark:text-white font-mono text-xs">${Math.round(tonTruoc).toLocaleString('vi-VN')}</td>
          <td class="text-right">
            <input type="number" min="0" step="any" value="${suDung}"
              class="input num text-right h-8 py-1 w-24 text-xs font-mono"
              oninput="onAuditChange(${it.id}, this.value, ${tonTruoc}, ${price})">
          </td>
          <td class="col-num text-right num font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs" id="aud-close-${it.id}">${Math.round(tonCuoi).toLocaleString('vi-VN')}</td>
          <td class="col-num text-right num font-semibold text-gray-900 dark:text-white font-mono text-xs" id="aud-value-${it.id}">${Math.round(thanhTien).toLocaleString('vi-VN')} ₫</td>
        </tr>
      `;
    }).join('');
  }

  // Mobile Cards
  if (mob) {
    mob.innerHTML = list.map((it) => {
      const tonTruoc = it.closing_t10 || it.closing_t9 || 0;
      const suDung = it.usage_t11 !== null && it.usage_t11 !== undefined ? it.usage_t11 : 0;
      const tonCuoi = tonTruoc - suDung;
      const price = parseFloat(String(it.price || 0)) || 0;
      const thanhTien = tonCuoi * price;
      const catLabel = (it.nhom_hang && it.nhom_hang !== 'Chưa phân loại') ? it.nhom_hang : (it.nganh_hang || 'Vật tư');

      return `
        <div class="data-card space-y-2.5">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-medium text-sm text-gray-900 dark:text-white">${escapeHtml(it.item_name)}</div>
              <div class="code text-gray-400 mt-0.5 text-xs font-mono">Mã: ${escapeHtml(it.item_code)} • ĐVT: ${escapeHtml(it.unit || '')} • Giá: <span class="num">${Math.round(price).toLocaleString('vi-VN')} ₫</span></div>
            </div>
            <span class="badge badge-neutral shrink-0 max-w-[120px] truncate text-xs">${escapeHtml(catLabel)}</span>
          </div>
          <div class="grid grid-cols-3 gap-2 text-xs p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div class="text-center">
              <div class="text-[10px] text-gray-500 dark:text-gray-400">Tồn đầu kỳ</div>
              <div class="num font-semibold text-gray-900 dark:text-white font-mono">${Math.round(tonTruoc).toLocaleString('vi-VN')}</div>
            </div>
            <div class="text-center">
              <div class="text-[10px] text-gray-500 dark:text-gray-400">Sử dụng kỳ</div>
              <input type="number" min="0" step="any" value="${suDung}"
                class="input num text-center h-8 py-1 w-full text-xs font-mono"
                oninput="onAuditChange(${it.id}, this.value, ${tonTruoc}, ${price}); const c = document.getElementById('aud-mob-close-${it.id}'); if(c) c.innerText = Math.round(${tonTruoc} - (parseFloat(this.value)||0)).toLocaleString('vi-VN'); const v = document.getElementById('aud-mob-value-${it.id}'); if(v) v.innerText = Math.round((${tonTruoc} - (parseFloat(this.value)||0)) * ${price}).toLocaleString('vi-VN') + ' ₫';">
            </div>
            <div class="text-center">
              <div class="text-[10px] text-gray-500 dark:text-gray-400">Tồn cuối kỳ</div>
              <div class="num font-semibold text-brand-600 dark:text-brand-400 font-mono" id="aud-mob-close-${it.id}">${Math.round(tonCuoi).toLocaleString('vi-VN')}</div>
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1 px-1">
            <span class="text-gray-500 dark:text-gray-400">Thành tiền tồn:</span>
            <span class="num font-semibold text-gray-900 dark:text-white font-mono" id="aud-mob-value-${it.id}">${Math.round(thanhTien).toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
      `;
    }).join('');
  }
}

export function onAuditChange(id: any, val: any, tonTruoc: number, price: number = 0): void {
  const it = auditRawItems.find((i) => i.id == id);
  if (it) {
    it.usage_t11 = val === '' ? null : (parseFloat(val) || 0);
    const tonCuoi = tonTruoc - (it.usage_t11 || 0);
    const el = document.getElementById(`aud-close-${id}`);
    if (el) el.textContent = Math.round(tonCuoi).toLocaleString('vi-VN');
    const valEl = document.getElementById(`aud-value-${id}`);
    if (valEl) valEl.textContent = Math.round(tonCuoi * (parseFloat(String(it.price)) || price || 0)).toLocaleString('vi-VN') + ' ₫';
  }
}

export async function saveAudit(): Promise<void> {
  if (!auditRawItems || !auditRawItems.length) {
    if (typeof showToast === 'function') showToast('Không có dữ liệu mặt hàng để lưu!');
    return;
  }
  if (typeof showLoading === 'function') showLoading('Lưu kết quả kiểm kê...');

  try {
    const payload = {
      items: auditRawItems.map((it) => {
        const tonTruoc = it.closing_t10 || it.closing_t9 || 0;
        const suDung = it.usage_t11 !== null && it.usage_t11 !== undefined ? it.usage_t11 : 0;
        return {
          id: it.id,
          site_code: it.site_code,
          item_code: it.item_code,
          item_name: it.item_name,
          unit: it.unit,
          usage: suDung,
          closing: tonTruoc - suDung
        };
      })
    };
    const res = await fetch('/api/inventory-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      if (typeof showToast === 'function') showToast('Lưu kết quả kiểm kê thành công!');
    } else {
      if (typeof showToast === 'function') showToast('Lỗi lưu kiểm kê: ' + (json.error || 'Thất bại'));
    }
  } catch (e: any) {
    if (typeof showToast === 'function') showToast('Lỗi: ' + e.message);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export function exportAuditExcel(): void {
  if (!auditItems || !auditItems.length) {
    if (typeof showToast === 'function') showToast('Không có dữ liệu để xuất Excel!');
    return;
  }

  const headers = ['Mã Hàng', 'Tên Hàng Hóa', 'Ngành Hàng', 'Nhóm Hàng', 'Kho', 'ĐVT', 'Đơn Giá (₫)', 'Tồn Kỳ Trước', 'Sử Dụng Kỳ', 'Tồn Cuối Kỳ', 'Thành Tiền Tồn (₫)'];
  const rows = auditItems.map((it) => {
    const tonTruoc = it.closing_t10 || it.closing_t9 || 0;
    const suDung = it.usage_t11 !== null && it.usage_t11 !== undefined ? it.usage_t11 : 0;
    const tonCuoi = tonTruoc - suDung;
    const price = parseFloat(String(it.price || 0)) || 0;
    return [
      it.item_code,
      it.item_name,
      it.nganh_hang || '',
      it.nhom_hang || '',
      it.warehouse_code || 'Kho',
      it.unit || '',
      price,
      tonTruoc,
      suDung,
      tonCuoi,
      tonCuoi * price
    ];
  });

  const site = (document.getElementById('kkSite') as HTMLSelectElement | null)?.value || 'Site';
  const siteCode = (typeof extractSiteCode === 'function' ? extractSiteCode(site) : site) || 'Site';

  if (typeof exportStyledExcel === 'function') {
    exportStyledExcel(`Kiem_Ke_Ton_Kho_${siteCode}.xlsx`, 'KiemKe', headers, rows, [6, 7, 8, 9, 10], [0, 4, 5]);
    if (typeof showToast === 'function') showToast(`Đã xuất báo cáo kiểm kê ${siteCode} thành công!`);
  }
}
