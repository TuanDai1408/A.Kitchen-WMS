import { SitePLData } from './types';
import { formatVND } from '@/ts/utils/formatters';

export let currentPLData: SitePLData | null = null;

declare const showLoading: () => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const renderKpi: (id: string, opts: any) => void;
declare const lucide: any;

export function viewSitePL(siteCode: string): void {
  const sel = document.getElementById('plSiteSelector') as HTMLSelectElement | null;
  if (sel) sel.value = siteCode;
  const globalSel = document.getElementById('globalBranchSelect') as HTMLSelectElement | null;
  if (globalSel) globalSel.value = siteCode;

  if (typeof (window as any).switchTab === 'function') {
    (window as any).switchTab('fnb-pl');
  }
  loadFnbPL();
}

export async function loadFnbPL(): Promise<void> {
  try {
    if (typeof showLoading === 'function') showLoading();
    const globalSel = document.getElementById('globalBranchSelect') as HTMLSelectElement | null;
    const site = globalSel?.value || localStorage.getItem('orbit_user_site') || 'K001';
    const monthInput = document.getElementById('globalMonthPicker') as HTMLInputElement | null;
    const month = monthInput?.value || '2026-11';

    const resp = await fetch(`/api/fnb/pl?site=${encodeURIComponent(site)}&thang=${encodeURIComponent(month)}`);
    const res = await resp.json();
    if (res.success && res.data) {
      currentPLData = res.data;
      if (typeof window !== 'undefined') {
        (window as any).currentPLData = currentPLData;
      }
      const plSel = document.getElementById('plSiteSelector') as HTMLSelectElement | null;
      if (plSel && res.data.siteCode) {
        plSel.value = res.data.siteCode;
      }
      renderFnbPL(res.data);
      const focusVal = (document.getElementById('plFocusFilter') as HTMLSelectElement | null)?.value || 'ALL';
      filterPlBreakdown(focusVal);
    }
  } catch (err: any) {
    console.error('Error loadFnbPL:', err);
    if (typeof showToast === 'function') {
      showToast('Lỗi tải P&L: ' + err.message, 'error');
    }
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
}

export function filterPlBreakdown(focus?: string): void {
  const tbody = document.querySelector('#fnb-pl table tbody');
  if (!tbody) return;
  const rows = tbody.querySelectorAll('tr');
  rows.forEach((tr) => {
    const text = (tr.textContent || '').toLowerCase();
    if (!focus || focus === 'ALL') {
      (tr as HTMLElement).style.display = '';
    } else if (focus === 'COGS') {
      if (text.includes('giá vốn') || text.includes('food cost') || text.includes('nguyên vật liệu') || text.includes('doanh thu thuần')) {
        (tr as HTMLElement).style.display = '';
      } else {
        (tr as HTMLElement).style.display = 'none';
      }
    } else if (focus === 'LABOR') {
      if (text.includes('nhân sự') || text.includes('labor') || text.includes('quỹ lương') || text.includes('doanh thu thuần')) {
        (tr as HTMLElement).style.display = '';
      } else {
        (tr as HTMLElement).style.display = 'none';
      }
    } else if (focus === 'OPEX') {
      if (text.includes('vận hành') || text.includes('thuê') || text.includes('điện') || text.includes('cố định') || text.includes('doanh thu thuần')) {
        (tr as HTMLElement).style.display = '';
      } else {
        (tr as HTMLElement).style.display = 'none';
      }
    } else if (focus === 'EBITDA') {
      if (text.includes('ebitda') || text.includes('lợi nhuận') || text.includes('doanh thu thuần')) {
        (tr as HTMLElement).style.display = '';
      } else {
        (tr as HTMLElement).style.display = 'none';
      }
    }
  });
}

export function renderFnbPL(d: SitePLData): void {
  if (!d) return;

  const titleEl = document.getElementById('plSiteTitle');
  if (titleEl) titleEl.textContent = `Báo Cáo P&L: ${d.site}`;

  // KPI Strip via renderKpi
  const achPct = d.targetRevenue > 0 ? (d.netRevenue / d.targetRevenue) * 100 : 0;
  if (typeof renderKpi === 'function') {
    renderKpi('plNetRev', {
      value: d.netRevenue,
      sub: 'Doanh thu sau chiết khấu'
    });
  }

  const achEl = document.getElementById('plAchievement');
  if (achEl) {
    const achText = achPct > 0 ? `${achPct.toFixed(1)}%` : '0,0%';
    const achGood = achPct >= 100;
    achEl.className = achGood ? 'kpi-delta-good' : 'kpi-delta-bad';
    achEl.innerHTML = `<svg class="size-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="${achGood ? 'M12 19V5m0 0l-6 6m6-6l6 6' : 'M12 5v14m0 0l-6-6m6 6l6-6'}"/></svg><span class="font-mono tabular-nums">${achText}</span><span class="sr-only">${achGood ? 'đạt' : 'chưa đạt'}</span>`;
  }

  const fcPct = d.netRevenue > 0 ? (d.foodCost / d.netRevenue) * 100 : 0;
  const lcPct = d.netRevenue > 0 ? (d.laborCost / d.netRevenue) * 100 : 0;
  const primePct = d.netRevenue > 0 ? (d.primeCost / d.netRevenue) * 100 : 0;

  if (typeof renderKpi === 'function') {
    renderKpi('plPrimeCostPct', {
      text: `${primePct.toFixed(1)}%`,
      sub: 'Mục tiêu ≤ 62,0%',
      progress: Math.min(100, (primePct / 62.0) * 100)
    });
  }

  const primeBar = document.getElementById('plPrimeCostBar');
  if (primeBar) {
    primeBar.style.width = `${Math.min(100, (primePct / 62.0) * 100)}%`;
    primeBar.className = primePct > 62 ? 'kpi-progress-bar-error' : 'kpi-progress-bar';
  }

  const fcPctEl = document.getElementById('plFoodCostPct');
  if (fcPctEl) fcPctEl.textContent = `${fcPct.toFixed(1)}%`;
  const fcValEl = document.getElementById('plFoodCostVal');
  if (fcValEl) fcValEl.textContent = formatVND(d.foodCost);

  const lcPctEl = document.getElementById('plLaborCostPct');
  if (lcPctEl) lcPctEl.textContent = `${lcPct.toFixed(1)}%`;
  const lcValEl = document.getElementById('plLaborCostVal');
  if (lcValEl) lcValEl.textContent = formatVND(d.laborCost);

  if (typeof renderKpi === 'function') {
    renderKpi('plProfitVal', {
      value: d.operatingProfit,
      sub: 'Lợi nhuận hoạt động'
    });
    renderKpi('plBreakEven', {
      value: d.breakEvenRevenue,
      sub: 'Cố định tháng'
    });
  }

  const profitMarginEl = document.getElementById('plProfitMargin');
  if (profitMarginEl) {
    const pmGood = d.profitMargin >= 20;
    profitMarginEl.className = pmGood ? 'kpi-delta-good' : (d.profitMargin >= 0 ? 'kpi-delta-neutral' : 'kpi-delta-bad');
    profitMarginEl.innerHTML = `<span class="font-mono tabular-nums">${d.profitMargin}%</span>`;
  }

  // P&L Statement rows
  const setTxt = (id: string, val: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setTxt('plRowGross', formatVND(d.grossRevenue));
  setTxt('plRowDiscount', '-' + formatVND(d.discount));
  setTxt('plRowNet', formatVND(d.netRevenue));

  if (d.channels) {
    setTxt('plRowDineIn', formatVND(d.channels.dineIn));
    setTxt('plRowTakeaway', formatVND(d.channels.takeaway));
    setTxt('plRowCatering', formatVND(d.channels.catering));
  }

  setTxt('plRowFoodCost', formatVND(d.foodCost));
  setTxt('plRowFoodCostPct', d.netRevenue > 0 ? `${((d.foodCost / d.netRevenue) * 100).toFixed(1)}%` : '0.0%');

  setTxt('plRowLaborCost', formatVND(d.laborCost));
  setTxt('plRowLaborCostPct', d.netRevenue > 0 ? `${((d.laborCost / d.netRevenue) * 100).toFixed(1)}%` : '0.0%');

  setTxt('plRowPrimeCost', formatVND(d.primeCost));
  setTxt('plRowPrimeCostPct', d.netRevenue > 0 ? `${((d.primeCost / d.netRevenue) * 100).toFixed(1)}%` : '0.0%');

  setTxt('plRowRent', formatVND(d.rentCost));
  setTxt('plRowUtilities', formatVND(d.utilityCost));
  setTxt('plRowSupplies', formatVND(d.supplyCost));
  setTxt('plRowWaste', formatVND(d.wasteCost));
  setTxt('plRowMarketing', formatVND(d.marketingCost));
  setTxt('plRowTotalCost', formatVND(d.totalCost));
  setTxt('plRowEBITDA', formatVND(d.operatingProfit));
  setTxt('plRowEBITDAPct', `${d.profitMargin}%`);

  // Weekly Trends
  const trendBody = document.getElementById('plWeeklyTrendBody');
  if (trendBody && d.weeklyTrends) {
    trendBody.innerHTML = d.weeklyTrends.map((w) => `
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/30">
        <td class="py-1 px-2 font-bold font-mono text-xs">${w.week}</td>
        <td class="py-1 px-2 text-right font-mono text-xs">${formatVND(w.netRevenue || w.netRev || 0)}</td>
        <td class="py-1 px-2 text-center text-blue-600 font-bold font-mono text-xs">${w.foodCostPct}%</td>
        <td class="py-1 px-2 text-center text-purple-600 font-bold font-mono text-xs">${w.laborCostPct}%</td>
        <td class="py-1 px-2 text-right text-emerald-600 font-bold font-mono text-xs">${w.profitMargin || w.profitPct || 0}%</td>
      </tr>
    `).join('');
  }

  // Operational metrics
  if (d.opMetrics) {
    setTxt('plOpBillCount', `${d.opMetrics.avgDailyBills || 0} bill`);
    setTxt('plOpAvgBill', formatVND(d.opMetrics.avgSpendPerBill || 0));
    setTxt('plOpRevSeat', formatVND(d.opMetrics.revenuePerSeatPerDay || 0));
    setTxt('plOpOccupancy', `${d.opMetrics.peakOccupancyPct || 78.5}%`);
  }

  // Top dishes
  const dishList = document.getElementById('plTopDishesList');
  if (dishList && d.topDishes) {
    if (d.topDishes.length === 0) {
      dishList.innerHTML = '<div class="text-xs text-gray-400 py-2 text-center">Chưa phát sinh món trong kỳ</div>';
    } else {
      dishList.innerHTML = d.topDishes.map((m, i) => `
        <div class="flex items-center justify-between p-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/40">
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950 text-brand-500 font-bold text-xs flex items-center justify-center font-mono">${i + 1}</span>
            <span class="font-bold text-gray-800 dark:text-gray-200">${m.name}</span>
          </div>
          <div class="flex items-center gap-3 font-mono tabular-nums text-xs">
            <span class="text-gray-500">${m.qty} suất</span>
            <span class="font-bold text-gray-900 dark:text-white">${formatVND(m.revenue || m.rev || 0)}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // Action Plans
  const actionList = document.getElementById('plActionPlansList');
  if (actionList && d.actionPlans) {
    actionList.innerHTML = d.actionPlans.map((act) => `
      <div class="flex items-start gap-2 py-0.5">
        <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"></i>
        <span>${typeof act === 'object' ? (act.task || JSON.stringify(act)) : act}</span>
      </div>
    `).join('');
  }
}

export function onSelectPLSite(siteCode: string): void {
  const globalSel = document.getElementById('globalBranchSelect') as HTMLSelectElement | null;
  if (globalSel) globalSel.value = siteCode;
  loadFnbPL();
}
