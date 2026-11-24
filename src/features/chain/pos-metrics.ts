import { SitePosData } from './types';
import { formatVND } from '@/ts/utils/formatters';

declare const showLoading: () => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const renderKpi: (id: string, opts: any) => void;
declare const lucide: any;

export async function loadFnbPOS(): Promise<void> {
  try {
    if (typeof showLoading === 'function') showLoading();
    const site = (document.getElementById('globalBranchSelect') as HTMLSelectElement | null)?.value || 'K001';
    const dateInput = document.getElementById('posDatePicker') as HTMLInputElement | null;
    const date = dateInput?.value || '2026-11-19';

    const resp = await fetch(`/api/fnb/pos?site=${encodeURIComponent(site)}&date=${encodeURIComponent(date)}`);
    const res = await resp.json();
    if (res.success && res.data) {
      if (res.data.date && dateInput && dateInput.value !== res.data.date) {
        dateInput.value = res.data.date;
      }
      renderFnbPOS(res.data);
    }
  } catch (err: any) {
    console.error('Error loadFnbPOS:', err);
    if (typeof showToast === 'function') {
      showToast('Lỗi tải POS: ' + err.message, 'error');
    }
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
}

export function renderFnbPOS(d: SitePosData): void {
  if (!d) return;

  if (typeof renderKpi === 'function') {
    renderKpi('posDailyRevenue', {
      value: d.dailyRevenue || d.totalSalesToday || 0,
      sub: 'so với TB tuần'
    });
    renderKpi('posDailyBills', {
      value: d.totalBills || d.billsToday || 0,
      unit: 'bill',
      isCurrency: false,
      sub: 'Số giao dịch thanh toán'
    });
    renderKpi('posDailyAOV', {
      value: d.avgSpendPerBill || d.avgBillToday || 0,
      sub: 'Suất trưa công sở'
    });
  }

  const list = document.getElementById('posHourlyList');
  if (list && d.hourlyDistribution) {
    list.innerHTML = d.hourlyDistribution.map((h) => `
      <div>
        <div class="flex justify-between font-bold mb-1 font-mono text-xs">
          <span>${h.hour} (${h.bills} bills)</span>
          <span class="tabular-nums">${formatVND(h.revenue || h.sales || 0)} (${h.pct}%)</span>
        </div>
        <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
          <div class="bg-brand-500 h-2 rounded-full" style="width: ${h.pct}%"></div>
        </div>
      </div>
    `).join('');
  }
}
