import { ChainSiteRanking, ChainSummaryData } from './types';
import { formatVND } from '@/ts/utils/formatters';

export let gChainRankings: ChainSiteRanking[] = [];
export let gCurrentFilterRegion = 'ALL';

declare const showLoading: () => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const renderKpi: (id: string, opts: any) => void;
declare const lucide: any;

export async function triggerSyncFnbMonthlySummary(): Promise<void> {
  const btn = document.getElementById('btnSyncFnbMonthly') as HTMLButtonElement | null;
  const icon = document.getElementById('iconSyncFnbMonthly');
  const label = document.getElementById('labelSyncFnbMonthly');

  try {
    if (btn) btn.disabled = true;
    if (icon) icon.classList.add('animate-spin');
    if (label) label.textContent = 'Đang đồng bộ...';

    const monthInput = document.getElementById('globalMonthPicker') as HTMLInputElement | null;
    const month = monthInput?.value || new Date().toISOString().slice(0, 7);

    const resp = await fetch('/api/fnb/chain/sync-monthly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month })
    });
    const res = await resp.json();

    if (res.success) {
      if (typeof showToast === 'function') {
        showToast(`Đã đồng bộ số liệu tháng ${month} thành công (${res.count || 14} điểm bán)!`, 'success');
      }
      await loadFnbChain();
    } else {
      if (typeof showToast === 'function') {
        showToast('Lỗi đồng bộ: ' + (res.error || 'Không thành công'), 'error');
      }
    }
  } catch (err: any) {
    console.error('triggerSyncFnbMonthlySummary error:', err);
    if (typeof showToast === 'function') {
      showToast('Lỗi kết nối khi đồng bộ: ' + err.message, 'error');
    }
  } finally {
    if (btn) btn.disabled = false;
    if (icon) icon.classList.remove('animate-spin');
    if (label) label.textContent = 'Đồng bộ số liệu';
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
}

export async function loadFnbChain(): Promise<void> {
  try {
    if (typeof showLoading === 'function') showLoading();
    const monthInput = document.getElementById('globalMonthPicker') as HTMLInputElement | null;
    const month = monthInput?.value || '2026-11';

    const resp = await fetch(`/api/fnb/chain?month=${encodeURIComponent(month)}`);
    const res = await resp.json();

    if (res.success && res.data) {
      const d: ChainSummaryData = res.data;
      gChainRankings = d.rankings || [];

      // Update KPI Cards via renderKpi
      if (typeof renderKpi === 'function') {
        renderKpi('chainTotalRevenue', {
          value: d.totalChainRevenue,
          sub: '14 Điểm bán toàn hệ thống A.Kitchen'
        });
        renderKpi('chainTotalProfit', {
          value: d.totalChainProfit,
          sub: 'Lợi nhuận gộp toàn chuỗi'
        });
        renderKpi('chainAvgFoodCost', {
          text: `${d.avgFoodCostPct}%`,
          sub: 'dưới ngưỡng 43%',
          deltaGood: (d.avgFoodCostPct <= 43)
        });
        renderKpi('chainAvgLaborCost', {
          text: `${d.avgLaborCostPct}%`,
          sub: 'dưới ngưỡng 19%',
          deltaGood: (d.avgLaborCostPct <= 19)
        });
      }

      const marginEl = document.getElementById('chainAvgMargin');
      if (marginEl) marginEl.textContent = `${d.avgChainMargin}%`;

      renderFnbChainTable(gChainRankings);
    }
  } catch (err: any) {
    console.error('Error loadFnbChain:', err);
    if (typeof showToast === 'function') {
      showToast('Lỗi tải dữ liệu toàn chuỗi: ' + err.message, 'error');
    }
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
}

export function renderFnbChainTable(items?: ChainSiteRanking[]): void {
  const tbody = document.getElementById('fnbChainTableBody');
  const mob = document.getElementById('fnbChainMobileCards');
  const list = items || gChainRankings;

  if (!list || list.length === 0) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="11" class="text-center py-8 text-gray-400">Không tìm thấy điểm bán nào phù hợp.</td></tr>`;
    if (mob) mob.innerHTML = `<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không tìm thấy điểm bán nào phù hợp.</div>`;
    return;
  }

  // Desktop Table
  if (tbody) {
    tbody.innerHTML = list.map((s) => {
      let statusBadge = '';
      if (s.status === 'VƯỢT CHỈ TIÊU') {
        statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">VƯỢT CHỈ TIÊU</span>`;
      } else if (s.status === 'TRONG MỨC') {
        statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800">TRONG MỨC</span>`;
      } else if (s.status === 'CHƯA PHÁT SINH') {
        statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">CHƯA PHÁT SINH</span>`;
      } else {
        statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800">CẦN XEM XÉT</span>`;
      }

      let rankBadge = '';
      if (s.rank === 1) rankBadge = `<span class="w-6 h-6 rounded-full bg-amber-400 text-gray-900 font-semibold inline-flex items-center justify-center text-xs shadow-xs">🥇1</span>`;
      else if (s.rank === 2) rankBadge = `<span class="w-6 h-6 rounded-full bg-gray-300 text-gray-900 font-semibold inline-flex items-center justify-center text-xs shadow-xs">🥈2</span>`;
      else if (s.rank === 3) rankBadge = `<span class="w-6 h-6 rounded-full bg-amber-700 text-white font-semibold inline-flex items-center justify-center text-xs shadow-xs">🥉3</span>`;
      else rankBadge = `<span class="tabular-nums font-mono text-gray-500 font-bold">${s.rank}</span>`;

      const achNum = parseFloat(String(s.achievementPct)) || 0;
      const fcNum = parseFloat(String(s.foodCostPct)) || 0;

      return `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center">${rankBadge}</td>
          <td class="py-3 px-4">
            <div class="font-bold text-gray-900 dark:text-white">${s.name}</div>
            <div class="text-xs font-mono tabular-nums text-gray-400">SAP: ${s.code}</div>
          </td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded text-xs font-bold ${s.region === 'Miền Nam' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'}">${s.region}</span>
          </td>
          <td class="py-3 px-3 text-right font-mono tabular-nums font-bold text-gray-900 dark:text-white">${formatVND(s.netRevenue)}</td>
          <td class="py-3 px-3 text-right font-mono tabular-nums text-gray-500">${formatVND(s.targetRevenue)}</td>
          <td class="py-3 px-3 text-center">
            <div class="font-mono tabular-nums font-bold text-gray-900 dark:text-white">${s.achievementPct}%</div>
            <div class="w-16 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mx-auto mt-1 overflow-hidden">
              <div class="${achNum >= 100 ? 'bg-emerald-500' : 'bg-blue-500'} h-1.5 rounded-full" style="width: ${Math.min(100, achNum)}%"></div>
            </div>
          </td>
          <td class="py-3 px-3 text-center font-mono tabular-nums ${fcNum <= 43 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}">${s.foodCostPct}%</td>
          <td class="py-3 px-3 text-center font-mono tabular-nums text-purple-600 font-bold">${s.laborCostPct}%</td>
          <td class="py-3 px-3 text-right font-mono tabular-nums font-bold text-emerald-600">${formatVND(s.operatingProfit)}</td>
          <td class="py-3 px-3 text-center">${statusBadge}</td>
          <td class="py-3 px-3 text-center">
            <button onclick="viewSitePL('${s.code}')" class="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-brand-500 hover:text-white dark:bg-gray-800 dark:hover:bg-brand-500 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all flex items-center gap-1 mx-auto">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i>
              <span>P&amp;L</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Mobile Cards
  if (mob) {
    mob.innerHTML = list.map((s) => {
      let statusBadge = '';
      if (s.status === 'VƯỢT CHỈ TIÊU') {
        statusBadge = `<span class="badge badge-success text-xs">Vượt chỉ tiêu</span>`;
      } else if (s.status === 'TRONG MỨC') {
        statusBadge = `<span class="badge badge-brand text-xs">Trong mức</span>`;
      } else if (s.status === 'CHƯA PHÁT SINH') {
        statusBadge = `<span class="badge badge-neutral text-xs">Chưa phát sinh</span>`;
      } else {
        statusBadge = `<span class="badge badge-danger text-xs">Cần xem xét</span>`;
      }

      return `
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="font-bold text-brand-600 dark:text-brand-400 font-mono text-xs">#${s.rank} ${s.code}</span>
              ${statusBadge}
            </div>
            <span class="text-xs text-gray-400">${s.region}</span>
          </div>
          <div class="data-card-body space-y-2">
            <div class="font-bold text-sm text-gray-900 dark:text-white">${s.name}</div>
            <div class="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <div>
                <span class="text-gray-400">Doanh thu:</span>
                <span class="font-mono font-bold text-gray-900 dark:text-white ml-1">${formatVND(s.netRevenue)}</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400">Đạt chỉ tiêu:</span>
                <span class="font-mono font-bold text-brand-600 dark:text-brand-400 ml-1">${s.achievementPct}%</span>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-1 text-xs text-center pt-1 border-t border-gray-100 dark:border-gray-800">
              <div>
                <div class="text-gray-400 text-[10px]">Food Cost</div>
                <div class="font-mono font-bold ${parseFloat(String(s.foodCostPct)) <= 43 ? 'text-emerald-600' : 'text-rose-600'}">${s.foodCostPct}%</div>
              </div>
              <div>
                <div class="text-gray-400 text-[10px]">Labor Cost</div>
                <div class="font-mono font-bold text-purple-600">${s.laborCostPct}%</div>
              </div>
              <div>
                <div class="text-gray-400 text-[10px]">EBITDA</div>
                <div class="font-mono font-bold text-emerald-600">${formatVND(s.operatingProfit)}</div>
              </div>
            </div>
          </div>
          <div class="flex justify-end pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="viewSitePL('${s.code}')" class="btn btn-secondary btn-sm">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i> Xem P&L
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

export function filterFnbChainByRegion(reg: string): void {
  gCurrentFilterRegion = reg;
  ['filterRegALL', 'filterRegMN', 'filterRegMB'].forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.classList.remove('bg-brand-500', 'text-white', 'shadow-xs', 'font-bold');
    btn.classList.add('font-medium', 'text-gray-600', 'dark:text-gray-300');
  });

  const activeBtnId = reg === 'ALL' ? 'filterRegALL' : (reg === 'Miền Nam' ? 'filterRegMN' : 'filterRegMB');
  const activeBtn = document.getElementById(activeBtnId);
  if (activeBtn) {
    activeBtn.classList.remove('font-medium', 'text-gray-600', 'dark:text-gray-300');
    activeBtn.classList.add('bg-brand-500', 'text-white', 'shadow-xs', 'font-bold');
  }

  let filtered = gChainRankings;
  if (reg !== 'ALL') {
    filtered = gChainRankings.filter((s) => s.region === reg);
  }
  renderFnbChainTable(filtered);
}

export function onSearchChainSite(val: string): void {
  const query = String(val || '').toLowerCase().trim();
  let filtered = gChainRankings;
  if (gCurrentFilterRegion !== 'ALL') {
    filtered = filtered.filter((s) => s.region === gCurrentFilterRegion);
  }
  if (query) {
    filtered = filtered.filter((s) =>
      s.code.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.region.toLowerCase().includes(query)
    );
  }
  renderFnbChainTable(filtered);
}
