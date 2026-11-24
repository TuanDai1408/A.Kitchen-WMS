import type { WhTransactionHistoryItem, WhBatchItem } from './types';
import { gWhInventoryData } from './inventory-table';
import { formatNumber, formatVND } from '@/ts/utils/formatters';

export let gWhActiveHistory: any = null;
export let gWhActiveBatches: any = null;

export function getWhActiveHistory(): any {
  return gWhActiveHistory;
}

export function getWhActiveBatches(): any {
  return gWhActiveBatches;
}

export async function openWhItemHistoryModal(sku: string): Promise<void> {
  const item = (gWhInventoryData || []).find(i => i.sku === sku) || { sku, name: sku, unit: 'Phần' };
  const siteSelect = document.getElementById('whInvSiteSelect') as HTMLSelectElement | null;
  const site = siteSelect ? siteSelect.value : 'ALL';

  const skuEl = document.getElementById('histItemSku');
  if (skuEl) skuEl.textContent = item.sku;

  const nameEl = document.getElementById('histItemName');
  if (nameEl) nameEl.textContent = item.name || item.sku;

  const unitEl = document.getElementById('histItemUnit');
  if (unitEl) unitEl.textContent = item.unit || 'Phần';

  const siteEl = document.getElementById('histItemSite');
  if (siteEl) siteEl.textContent = site === 'ALL' ? 'Toàn Hệ Thống' : site;

  const modal = document.getElementById('modalWhItemHistory');
  if (modal) modal.classList.remove('hidden');

  const tbody = document.getElementById('whHistTableBody');
  const mob = document.getElementById('whHistMobileCards');
  if (tbody) tbody.innerHTML = '<tr><td colspan="10" class="p-8 text-center text-gray-400">Đang truy xuất thẻ kho từ hệ thống...</td></tr>';
  if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">Đang truy xuất thẻ kho...</div>';

  try {
    const res = await fetch(`/api/wh/item-history?sku=${encodeURIComponent(sku)}&site=${encodeURIComponent(site)}&nocache=1`);
    const json = await res.json();
    if (json.success) {
      gWhActiveHistory = json.data;
      if (typeof window !== 'undefined') {
        (window as any).gWhActiveHistory = gWhActiveHistory;
      }
      const hist: WhTransactionHistoryItem[] = json.data.history || [];

      const inEl = document.getElementById('histTotalIn');
      if (inEl) inEl.textContent = formatNumber(json.data.total_in || 0, 1);

      const outEl = document.getElementById('histTotalOut');
      if (outEl) outEl.textContent = formatNumber(json.data.total_out || 0, 1);

      const countEl = document.getElementById('histRowCount');
      if (countEl) countEl.textContent = formatNumber(hist.length, 0);

      if (!hist.length) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="10" class="p-8 text-center text-gray-400">Chưa ghi nhận giao dịch xuất nhập nào cho mã hàng này tại điểm đã chọn.</td></tr>';
        if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">Chưa ghi nhận giao dịch xuất nhập nào.</div>';
        return;
      }

      if (tbody) {
        tbody.innerHTML = hist.map(h => {
          const qtyIn = parseFloat(String(h.qty_in || 0));
          const qtyOut = parseFloat(String(h.qty_out || 0));

          let badgeColor = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
          if (h.trans_type === 'NHAP_KHO') badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200';
          else if (h.trans_type === 'XUAT_HUY') badgeColor = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200';
          else if (h.trans_type === 'DIEU_CHUYEN') badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200';
          else if (h.trans_type === 'XUAT_KHO') badgeColor = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200';

          const docDateDisp = h.doc_date ? String(h.doc_date).split('T')[0] : '—';

          return `
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="p-2.5 text-center whitespace-nowrap font-mono tabular-nums text-gray-600 dark:text-gray-300">${docDateDisp}</td>
              <td class="p-2.5 whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white">${h.doc_no || '—'}</td>
              <td class="p-2.5 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${badgeColor}">${h.trans_name || h.trans_type}</span>
              </td>
              <td class="p-2.5 whitespace-nowrap font-mono text-xs text-gray-600 dark:text-gray-300">
                ${h.batch_code ? `<b class="text-purple-600 dark:text-purple-400">${h.batch_code}</b>` : '—'}
                ${h.exp_date ? `<span class="text-gray-400 block text-xs">HSD: ${String(h.exp_date).split('T')[0]}</span>` : ''}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${qtyIn > 0 ? `+${formatNumber(qtyIn, 1)}` : '—'}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                ${qtyOut > 0 ? `-${formatNumber(qtyOut, 1)}` : '—'}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
                ${formatVND(Number(h.unit_price) || 0)}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white tabular-nums">
                ${formatVND(Number(h.amount) || 0)}
              </td>
              <td class="p-2.5 whitespace-nowrap text-gray-700 dark:text-gray-300 max-w-[150px] truncate" title="${h.partner_name || ''}">
                ${h.partner_name || '—'}
              </td>
              <td class="p-2.5 text-gray-500 dark:text-gray-400 max-w-[200px] truncate" title="${h.notes || ''}">
                ${h.notes || '—'}
              </td>
            </tr>
          `;
        }).join('');
      }

      if (mob) {
        mob.innerHTML = hist.map(h => {
          const qtyIn = parseFloat(String(h.qty_in || 0));
          const qtyOut = parseFloat(String(h.qty_out || 0));
          const docDateDisp = h.doc_date ? String(h.doc_date).split('T')[0] : '—';

          return `
            <div class="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <div class="font-mono font-bold text-gray-900 dark:text-white">${h.doc_no || '—'}</div>
                <span class="text-xs text-gray-400 font-mono">${docDateDisp}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700 dark:text-gray-300">${h.trans_name || h.trans_type}</span>
                <span class="font-mono font-bold ${qtyIn > 0 ? 'text-emerald-600' : 'text-rose-600'}">
                  ${qtyIn > 0 ? `+${formatNumber(qtyIn, 1)}` : `-${formatNumber(qtyOut, 1)}`} ${item.unit || ''}
                </span>
              </div>
              ${h.batch_code ? `<div class="text-xs text-purple-600 dark:text-purple-400 font-mono">Lô: <b>${h.batch_code}</b> ${h.exp_date ? '• HSD: ' + String(h.exp_date).split('T')[0] : ''}</div>` : ''}
              ${h.partner_name ? `<div class="text-xs text-gray-500">Đối tác: ${h.partner_name}</div>` : ''}
              ${h.notes ? `<div class="text-xs text-gray-400 italic">${h.notes}</div>` : ''}
            </div>
          `;
        }).join('');
      }
    } else {
      if (tbody) tbody.innerHTML = `<tr><td colspan="10" class="p-8 text-center text-rose-500">Lỗi: ${json.error}</td></tr>`;
    }
  } catch (err: any) {
    console.error('openWhItemHistoryModal error:', err);
    if (tbody) tbody.innerHTML = `<tr><td colspan="10" class="p-8 text-center text-rose-500">Lỗi kết nối: ${err.message}</td></tr>`;
  }
}

export async function openWhItemBatchesModal(sku: string): Promise<void> {
  const item = (gWhInventoryData || []).find(i => i.sku === sku) || { sku, name: sku, unit: 'Phần' };
  const siteSelect = document.getElementById('whInvSiteSelect') as HTMLSelectElement | null;
  const site = siteSelect ? siteSelect.value : 'ALL';

  const skuEl = document.getElementById('batchItemSku');
  if (skuEl) skuEl.textContent = item.sku;

  const nameEl = document.getElementById('batchItemName');
  if (nameEl) nameEl.textContent = item.name || item.sku;

  const unitEl = document.getElementById('batchItemUnit');
  if (unitEl) unitEl.textContent = item.unit || 'Phần';

  const siteEl = document.getElementById('batchItemSite');
  if (siteEl) siteEl.textContent = site === 'ALL' ? 'Toàn Hệ Thống' : site;

  const modal = document.getElementById('modalWhItemBatches');
  if (modal) modal.classList.remove('hidden');

  const tbody = document.getElementById('whBatchesTableBody');
  const mob = document.getElementById('whBatchesMobileCards');
  if (tbody) tbody.innerHTML = '<tr><td colspan="8" class="p-8 text-center text-gray-400">Đang truy vấn danh sách lô date FEFO...</td></tr>';
  if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">Đang truy vấn lô date...</div>';

  try {
    const res = await fetch(`/api/wh/item-batches?sku=${encodeURIComponent(sku)}&site=${encodeURIComponent(site)}&nocache=1`);
    const json = await res.json();
    if (json.success) {
      gWhActiveBatches = json.data;
      if (typeof window !== 'undefined') {
        (window as any).gWhActiveBatches = gWhActiveBatches;
      }
      const batches: WhBatchItem[] = json.data.batches || [];

      let safeCount = 0;
      let warnCount = 0;
      batches.forEach(b => {
        if (b.status === 'GOOD') safeCount++;
        else warnCount++;
      });

      const totalEl = document.getElementById('batchTotalCount');
      if (totalEl) totalEl.textContent = formatNumber(batches.length, 0);

      const safeEl = document.getElementById('batchSafeCount');
      if (safeEl) safeEl.textContent = formatNumber(safeCount, 0);

      const warnEl = document.getElementById('batchWarnCount');
      if (warnEl) warnEl.textContent = formatNumber(warnCount, 0);

      if (!batches.length) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="8" class="p-8 text-center text-gray-400">Chưa có lô hàng date riêng biệt nào được ghi nhận cho mã này (đang quản lý tồn gộp theo site).</td></tr>';
        if (mob) mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">Chưa có lô hàng date riêng biệt.</div>';
        return;
      }

      if (tbody) {
        tbody.innerHTML = batches.map(b => {
          let badgeStatus = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200';
          let statusText = 'Còn hạn an toàn';
          if (b.status === 'EXPIRED') {
            badgeStatus = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200';
            statusText = 'Đã hết hạn';
          } else if (b.status === 'NEAR_EXPIRY') {
            badgeStatus = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200';
            statusText = 'Cận date (≤ 30 ngày)';
          }

          const expDisp = b.exp_date ? String(b.exp_date).split('T')[0] : '—';
          const daysLeftDisp = b.days_left !== 999 ? `${b.days_left} ngày` : '—';

          return `
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="p-2.5 whitespace-nowrap font-mono font-bold text-purple-700 dark:text-purple-400">${b.batch_code || 'LÔ-CHUNG'}</td>
              <td class="p-2.5 whitespace-nowrap text-gray-700 dark:text-gray-300">
                <span>${b.site_code || ''}</span> • <span class="text-gray-400">${b.storage_loc || 'Kệ Bếp'}</span>
              </td>
              <td class="p-2.5 text-center whitespace-nowrap font-mono font-semibold text-gray-800 dark:text-gray-200 tabular-nums">${expDisp}</td>
              <td class="p-2.5 text-center whitespace-nowrap font-mono tabular-nums font-semibold ${
                b.status === 'EXPIRED' ? 'text-rose-600' : (b.status === 'NEAR_EXPIRY' ? 'text-amber-600' : 'text-emerald-600')
              }">
                ${daysLeftDisp}
              </td>
              <td class="p-2.5 text-center whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${badgeStatus}">${statusText}</span>
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
                ${formatNumber(Number(b.initial_qty) || 0, 1)}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                ${formatNumber(Number(b.current_qty) || 0, 1)}
              </td>
              <td class="p-2.5 whitespace-nowrap font-mono text-gray-500 text-xs">
                ${b.receipt_code ? `<span class="text-brand-600 font-semibold">${b.receipt_code}</span>` : '—'}
              </td>
            </tr>
          `;
        }).join('');
      }

      if (mob) {
        mob.innerHTML = batches.map(b => {
          const expDisp = b.exp_date ? String(b.exp_date).split('T')[0] : '—';
          return `
            <div class="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-purple-700 dark:text-purple-400">Lô: ${b.batch_code || 'LÔ-CHUNG'}</span>
                <span class="font-mono font-semibold text-xs ${b.status === 'EXPIRED' ? 'text-rose-600' : (b.status === 'NEAR_EXPIRY' ? 'text-amber-600' : 'text-emerald-600')}">
                  ${b.days_left !== 999 ? `Còn ${b.days_left} ngày` : ''}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div>Hạn dùng: <b class="font-mono text-gray-900 dark:text-white">${expDisp}</b></div>
                <div>Vị trí: <b class="text-gray-900 dark:text-white">${b.storage_loc || 'Kệ Bếp'}</b></div>
                <div>SL Nhập: <b class="font-mono text-gray-900 dark:text-white">${formatNumber(Number(b.initial_qty) || 0, 1)}</b></div>
                <div>SL Tồn: <b class="font-mono font-bold text-blue-600 dark:text-blue-400">${formatNumber(Number(b.current_qty) || 0, 1)}</b></div>
              </div>
              ${b.receipt_code ? `<div class="text-xs text-gray-400">Chứng từ: ${b.receipt_code}</div>` : ''}
            </div>
          `;
        }).join('');
      }
    } else {
      if (tbody) tbody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-rose-500">Lỗi: ${json.error}</td></tr>`;
    }
  } catch (err: any) {
    console.error('openWhItemBatchesModal error:', err);
    if (tbody) tbody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-rose-500">Lỗi kết nối: ${err.message}</td></tr>`;
  }
}
