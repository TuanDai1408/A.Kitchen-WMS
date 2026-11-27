import type { PortalOrderItem } from './types';
import { safeCellCode, safeCellBadge, safeEscapeHtml, fmtVND, fmtNum } from './helpers';
import { adjustListHeightForSubTable } from '@/ts/utils/formatters';

declare const lucide: any;

export function getAppItems(): PortalOrderItem[] {
  const win = window as any;
  if (!win.App) win.App = {};
  if (!win.App.items) win.App.items = [];
  return win.App.items;
}

export function setAppItems(items: PortalOrderItem[]): void {
  const win = window as any;
  if (!win.App) win.App = {};
  win.App.items = items;
}

export function renderOrderTable(): void {
  const body = document.getElementById('dinhMucBody');
  const mobileContainer = document.getElementById('orderMobileCards');
  const search = ((document.getElementById('orderSearch') as HTMLInputElement)?.value || '').toLowerCase();
  const type = (document.getElementById('fLoai') as HTMLSelectElement)?.value || '';
  const onlyTyped = (document.getElementById('fChiNhap') as HTMLInputElement)?.checked;
  const channel = (document.getElementById('orderSupplyChannel') as HTMLSelectElement)?.value || 'ALL';

  const items = getAppItems();

  const filtered = items.filter(it => {
    if (search && !it.maHang.toLowerCase().includes(search) && !it.tenSP.toLowerCase().includes(search)) return false;
    if (type && it.tenLoai !== type) return false;
    if (onlyTyped && (!it.soLuongDat || it.soLuongDat <= 0)) return false;
    if (channel === 'BTT') {
      const txt = ((it.nguonCung || '') + ' ' + (it.tenLoai || '') + ' ' + (it.tenSP || '')).toLowerCase();
      if (!txt.includes('btt') && !txt.includes('trung tâm') && !txt.includes('chế biến')) return false;
    } else if (channel === 'NCC') {
      const txt = ((it.nguonCung || '') + ' ' + (it.tenLoai || '')).toLowerCase();
      if (txt.includes('btt') || txt.includes('trung tâm')) return false;
    } else if (channel === 'URGENT') {
      const txt = ((it.nganh_hang || '') + ' ' + (it.tenLoai || '') + ' ' + (it.tenSP || '')).toLowerCase();
      if (!txt.includes('tươi') && !txt.includes('thịt') && !txt.includes('rau') && !txt.includes('khẩn')) return false;
    }
    return true;
  });

  if (!filtered.length) {
    if (body) body.innerHTML = '<tr><td colspan="8" class="p-8 text-center text-gray-400 dark:text-gray-500">Không có mặt hàng nào phù hợp với Site và Vùng đã chọn.</td></tr>';
    if (mobileContainer) mobileContainer.innerHTML = '<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không có mặt hàng nào phù hợp với Site và Vùng đã chọn.</div>';
    return;
  }

  const isDesktop = window.innerWidth >= 1024;

  // 1. Render Desktop Table Rows (Only if on Desktop screen)
  if (body) {
    if (isDesktop) {
      body.innerHTML = filtered.map(it => {
        const sl = it.soLuongDat || '';
        const thanhTien = (it.soLuongDat || 0) * (it.donGia || 0);
        return `
          <tr>
            <td class="col-code">${safeCellCode(it.maHang)}</td>
            <td><span class="font-medium text-gray-900 dark:text-white">${it.tenSP}</span></td>
            <td>${safeCellBadge('neutral', it.tenLoai || 'CCDC')}</td>
            <td>${it.dvt || 'Cái'}</td>
            <td class="col-num"><span class="num">${fmtVND(it.donGia)}</span></td>
            <td class="col-num"><span class="num">${fmtNum(it.daDat)}</span></td>
            <td class="col-num text-right">
              <input type="number" min="0" value="${sl}" placeholder="0" class="input h-8 w-24 text-right num"
                oninput="onQtyChange('${it.maHang}', this.value)">
            </td>
            <td class="col-num font-semibold text-brand-600 dark:text-brand-400" id="subtotal-${it.maHang}">${fmtVND(thanhTien)}</td>
          </tr>
        `;
      }).join('');
    } else {
      body.innerHTML = '';
    }
  }

  // 2. Render Native Mobile Cards (Only if on Mobile screen)
  if (mobileContainer) {
    if (!isDesktop) {
      mobileContainer.innerHTML = filtered.map(it => {
        const sl = it.soLuongDat || '';
        const thanhTien = (it.soLuongDat || 0) * (it.donGia || 0);
        return `
          <div class="data-card space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                  ${safeCellCode(it.maHang)}
                  ${safeCellBadge('neutral', it.tenLoai || 'CCDC')}
                  <span class="text-xs text-gray-500">ĐVT: ${it.dvt || 'Cái'}</span>
                </div>
                <h4 class="font-medium text-sm text-gray-900 dark:text-white leading-snug">${it.tenSP}</h4>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <div>
                <span class="text-xs text-gray-400">Đơn giá:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${fmtVND(it.donGia)}</div>
              </div>
              <div>
                <span class="text-xs text-gray-400">Đã đặt lũy kế:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${fmtNum(it.daDat)}</div>
              </div>
              <div class="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <div class="flex-1">
                  <label class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Số lượng đặt:</label>
                  <input type="number" min="0" value="${sl}" placeholder="0" class="input h-10 w-full text-center num text-sm font-semibold"
                    oninput="onQtyChange('${it.maHang}', this.value)">
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-400">Thành tiền:</span>
                  <div class="text-base font-semibold text-brand-600 dark:text-brand-400 num" id="mob-subtotal-${it.maHang}">${fmtVND(thanhTien)}</div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      mobileContainer.innerHTML = '';
    }
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function filterItems(): void {
  renderOrderTable();
}

export function onQtyChange(sku: string, val: string): void {
  const items = getAppItems();
  const it = items.find(i => i.maHang === sku);
  if (it) {
    it.soLuongDat = Number(val) || 0;
    const subtotalEl = document.getElementById(`subtotal-${sku}`);
    if (subtotalEl) subtotalEl.textContent = fmtVND(it.soLuongDat * (it.donGia || 0));
    const subtotalMobEl = document.getElementById(`mob-subtotal-${sku}`);
    if (subtotalMobEl) subtotalMobEl.textContent = fmtVND(it.soLuongDat * (it.donGia || 0));

    // Sync inputs across desktop table and mobile cards
    document.querySelectorAll<HTMLInputElement>(`input[oninput*="'${sku}'"]`).forEach(inp => {
      if (inp.value !== val) inp.value = val;
    });
  }
  calcBudget();
}

export function calcBudget(forcedBudget?: number, forcedDaDat?: number): void {
  const elNganSach = document.getElementById('kpiNganSach') as HTMLElement | null;
  const elDaDat = document.getElementById('kpiDaDat') as HTMLElement | null;

  const nganSach = forcedBudget !== undefined ? Number(forcedBudget) : (
    Number(elNganSach?.dataset?.raw) || Number((elNganSach?.textContent || '').replace(/[^\d]/g, '')) || 0
  );
  const daDat = forcedDaDat !== undefined ? Number(forcedDaDat) : (
    Number(elDaDat?.dataset?.raw) || Number((elDaDat?.textContent || '').replace(/[^\d]/g, '')) || 0
  );

  const items = getAppItems();
  const dangNhap = items.reduce((sum, it) => sum + ((it.soLuongDat || 0) * (it.donGia || 0)), 0);
  const tongDung = daDat + dangNhap;
  const conLai = nganSach - tongDung;
  const pct = nganSach > 0 ? Math.round((tongDung / nganSach) * 100) : 0;

  const conLaiEl = document.getElementById('kpiConLai') as HTMLElement | null;
  if (conLaiEl) {
    conLaiEl.dataset.raw = String(conLai);
    conLaiEl.textContent = fmtVND(conLai);
    conLaiEl.title = fmtVND(conLai);
    if (conLai < 0) {
      conLaiEl.classList.remove('text-gray-900', 'dark:text-white');
      conLaiEl.classList.add('text-rose-600', 'dark:text-rose-400');
    } else {
      conLaiEl.classList.remove('text-rose-600', 'dark:text-rose-400');
      conLaiEl.classList.add('text-gray-900', 'dark:text-white');
    }
  }

  const dangNhapEl = document.getElementById('kpiDangNhapSub');
  if (dangNhapEl) dangNhapEl.textContent = 'Đang nhập: ' + fmtVND(dangNhap);

  const conLaiDelta = document.getElementById('kpiConLaiDelta');
  if (conLaiDelta) {
    if (conLai < 0) {
      conLaiDelta.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50';
      conLaiDelta.innerHTML = `<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>Âm hạn mức</span>`;
    } else {
      conLaiDelta.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50';
      conLaiDelta.innerHTML = `<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>Khả dụng</span>`;
    }
  }

  const tyLeEl = document.getElementById('kpiTyLe');
  if (tyLeEl) {
    tyLeEl.textContent = pct + '%';
    if (pct > 100) {
      tyLeEl.className = 'text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums tracking-tight num';
    } else if (pct > 80) {
      tyLeEl.className = 'text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums tracking-tight num';
    } else {
      tyLeEl.className = 'text-xl sm:text-2xl font-bold font-mono text-gray-900 dark:text-white tabular-nums tracking-tight num';
    }
  }

  const budUsedEl = document.getElementById('budUsed');
  if (budUsedEl) budUsedEl.textContent = fmtVND(tongDung);

  const fill = document.getElementById('budFill');
  const budBadge = document.getElementById('budBadge');
  const budNote = document.getElementById('budNote');
  if (fill) {
    fill.style.width = Math.min(pct, 100) + '%';
    if (pct > 100) {
      fill.className = 'h-full rounded-full bg-rose-500 transition-all duration-300';
      if (budBadge) {
        budBadge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50';
        budBadge.innerHTML = `<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>Vượt ${pct - 100}%</span>`;
      }
      if (budNote) budNote.innerHTML = `<span class="text-rose-600 dark:text-rose-400 font-semibold">⚠️ Vượt định mức ${pct - 100}%! Cần giải trình.</span>`;
    } else if (pct > 80) {
      fill.className = 'h-full rounded-full bg-amber-500 transition-all duration-300';
      if (budBadge) {
        budBadge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50';
        budBadge.innerHTML = `<span>Gần chạm trần</span>`;
      }
      if (budNote) budNote.textContent = `Đã dùng ${pct}% ngân sách. Gần chạm mức giới hạn.`;
    } else {
      fill.className = 'h-full rounded-full bg-indigo-500 transition-all duration-300';
      if (budBadge) {
        budBadge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50';
        budBadge.innerHTML = `<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>An toàn</span>`;
      }
      if (budNote) budNote.textContent = `Ngân sách an toàn (${pct}%).`;
    }
  }
  renderOrderCartSummary();
}

export function renderOrderCartSummary(): void {
  const card = document.getElementById('orderCartSummaryCard');
  const slip = document.getElementById('orderCartSelectedSlip');
  const tbody = document.getElementById('orderCartSummaryBody');
  const countEl = document.getElementById('orderCartItemCount');
  const footerCountEl = document.getElementById('orderCartFooterCount');
  const qtyEl = document.getElementById('orderCartTotalQty');
  const amtEl = document.getElementById('orderCartTotalAmount');
  const submitBtn = document.getElementById('btnSubmitPortalOrder') as HTMLButtonElement | null;
  if (!card || !tbody) return;

  const selected = getAppItems().filter(i => (Number(i.soLuongDat) || 0) > 0);
  const totalQty = selected.reduce((s, it) => s + (Number(it.soLuongDat) || 0), 0);
  const totalAmt = selected.reduce((s, it) => s + ((Number(it.soLuongDat) || 0) * (Number(it.donGia) || 0)), 0);

  if (countEl) countEl.textContent = String(selected.length);
  if (footerCountEl) footerCountEl.textContent = String(selected.length);
  if (qtyEl) qtyEl.textContent = String(Math.round(totalQty * 10) / 10);
  if (amtEl) amtEl.textContent = fmtVND(totalAmt);

  if (!selected.length) {
    slip?.classList.add('hidden');
    adjustListHeightForSubTable(false, 'orderItemsScroll', 'orderMobileCards');
    tbody.innerHTML = '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    return;
  }

  slip?.classList.remove('hidden');
  adjustListHeightForSubTable(true, 'orderItemsScroll', 'orderMobileCards');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }

  tbody.innerHTML = selected.map((it, idx) => {
    const qty = Number(it.soLuongDat) || 0;
    const price = Number(it.donGia) || 0;
    const lineAmt = qty * price;
    return `
      <tr class="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors">
        <td class="py-1.5 px-2.5 text-center font-mono text-gray-400">${idx + 1}</td>
        <td class="py-1.5 px-2.5 font-mono font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">${safeEscapeHtml(it.maHang)}</td>
        <td class="py-1.5 px-2.5 font-medium text-gray-900 dark:text-white">${safeEscapeHtml(it.tenSP)}</td>
        <td class="py-1.5 px-2 text-center text-gray-600 dark:text-gray-300">${safeEscapeHtml(it.dvt || '')}</td>
        <td class="py-1.5 px-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">${qty}</td>
        <td class="py-1.5 px-2.5 text-right font-mono text-gray-600 dark:text-gray-300 tabular-nums">${fmtVND(price)}</td>
        <td class="py-1.5 px-2.5 text-right font-mono font-bold text-brand-600 dark:text-brand-400 tabular-nums">${fmtVND(lineAmt)}</td>
        <td class="py-1.5 px-2 text-center">
          <button type="button" onclick="removeOrderCartItem('${safeEscapeHtml(it.maHang)}')" class="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="Bỏ mặt hàng này">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  const w = typeof window !== 'undefined' ? (window as any) : {};
  if (w.lucide && typeof w.lucide.createIcons === 'function') {
    w.lucide.createIcons({ root: card });
  }
}

export function removeOrderCartItem(sku: string): void {
  onQtyChange(sku, '0');
  document.querySelectorAll<HTMLInputElement>(`input[oninput*="'${sku}'"]`).forEach(inp => {
    inp.value = '';
  });
}

export function clearOrderCart(): void {
  const items = getAppItems();
  items.forEach(it => { it.soLuongDat = 0; });
  renderOrderTable();
  calcBudget();
}
