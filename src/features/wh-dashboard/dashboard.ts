import type { DashboardSummaryData, StockAlertItem } from './types';
import { formatNumber, formatDate, escapeHtml } from '@/ts/utils/formatters';

declare const App: { currentBranch?: string; [key: string]: any };
declare const lucide: any;
declare function renderKpi(id: string, opts: any): void;

declare let chartSafetyGauge: any;
declare let chartInboundOutbound: any;
declare let chartValueTrend: any;

export function updateApexChartsTheme(isDark: boolean): void {
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridBorder = isDark ? '#1E293B' : '#F1F5F9';

  if (typeof chartInboundOutbound !== 'undefined' && chartInboundOutbound) {
    try {
      chartInboundOutbound.updateOptions({
        chart: { foreColor: textColor },
        grid: { borderColor: gridBorder },
        xaxis: { labels: { style: { colors: textColor } } },
        yaxis: { labels: { style: { colors: textColor } } },
        tooltip: { theme: isDark ? 'dark' : 'light' }
      });
    } catch {
      // Ignore chart update if not ready
    }
  }

  if (typeof chartSafetyGauge !== 'undefined' && chartSafetyGauge) {
    try {
      chartSafetyGauge.updateOptions({
        plotOptions: {
          radialBar: {
            track: { background: isDark ? '#1C243D' : '#E8EAEE' },
            dataLabels: { value: { color: isDark ? '#FFFFFF' : '#1D2939' } }
          }
        }
      });
    } catch {
      // Ignore
    }
  }

  if (typeof chartValueTrend !== 'undefined' && chartValueTrend) {
    try {
      chartValueTrend.updateOptions({
        chart: { foreColor: textColor },
        grid: { borderColor: gridBorder },
        xaxis: { labels: { style: { colors: textColor } } },
        yaxis: { labels: { style: { colors: textColor } } }
      });
    } catch {
      // Ignore
    }
  }
}

export function renderStockAlertsTable(alerts: StockAlertItem[]): void {
  const tbody = document.getElementById('stockAlertsTableBody');
  const mob = document.getElementById('dashStockAlertsMobileCards');
  if (!tbody && !mob) return;

  if (!alerts || alerts.length === 0) {
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="px-5 py-6 text-center text-gray-400 dark:text-gray-500">
            <i data-lucide="check-circle" class="w-5 h-5 text-emerald-500 inline-block mb-1"></i>
            <p class="font-medium text-xs">Hiện tại không có cảnh báo vi phạm an toàn kho!</p>
          </td>
        </tr>
      `;
    }
    if (mob) {
      mob.innerHTML = `
        <div class="card p-6 text-center text-gray-400 dark:text-gray-500">
          <i data-lucide="check-circle" class="w-6 h-6 text-emerald-500 mx-auto mb-2"></i>
          <p class="font-medium text-sm">Hiện tại không có cảnh báo vi phạm an toàn kho!</p>
        </div>
      `;
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
    return;
  }

  if (tbody) {
    tbody.innerHTML = alerts.map(item => {
      let badgeClass = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40';
      let badgeText = 'Bình thường';

      if (item.alert_level === 'OUT_OF_STOCK') {
        badgeClass = 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-bold';
        badgeText = 'Hết hàng';
      } else if (item.alert_level === 'NEAR_EXPIRY') {
        badgeClass = 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 font-bold';
        badgeText = `Cận Date (${item.days_left || 0}d)`;
      } else if (item.alert_level === 'LOW_STOCK') {
        badgeClass = 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/40 font-bold';
        badgeText = 'Dưới mức an toàn';
      }

      return `
        <tr class="hover:bg-gray-50/60 dark:hover:bg-white/2 transition-colors">
          <td class="px-5 py-3.5 font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            <a href="javascript:void(0)" onclick="openItemDetailModal('${item.sku}')" class="text-brand-500 hover:underline flex items-center gap-1">
              ${item.sku}
            </a>
          </td>
          <td class="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-100 min-w-[160px]">
            <div>${item.item_name || item.sku}</div>
            <span class="text-xs text-gray-400 font-normal">${item.category || 'Gia vị'} • ${item.unit || 'Đơn vị'}</span>
          </td>
          <td class="px-5 py-3.5 whitespace-nowrap min-w-[155px]">
            <div class="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">${item.batch_code || 'Lô kho'}</div>
            <div class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 whitespace-nowrap">
              <i data-lucide="calendar" class="w-3 h-3 shrink-0"></i>
              <span>EXP: ${item.exp_date ? item.exp_date.slice(0, 10) : 'Chưa có'}</span>
            </div>
          </td>
          <td class="px-5 py-3.5 text-right font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            ${item.qty} ${item.unit || ''}
          </td>
          <td class="px-5 py-3.5 text-right font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            ${item.safety_stock || 5.0} ${item.unit || ''}
          </td>
          <td class="px-5 py-3.5 text-center whitespace-nowrap">
            <span class="inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ${badgeClass}">
              ${badgeText}
            </span>
          </td>
          <td class="px-5 py-3.5 text-right whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5 justify-end">
              <button onclick="openItemDetailModal('${item.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Xem chi tiết">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button onclick="openReceiptModal('${item.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Nhập bổ sung">
                <i data-lucide="package-plus" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (mob) {
    mob.innerHTML = alerts.map(item => {
      let badgeClass = 'badge-neutral';
      let badgeText = 'Bình thường';
      if (item.alert_level === 'OUT_OF_STOCK') {
        badgeClass = 'badge-danger';
        badgeText = 'Hết hàng';
      } else if (item.alert_level === 'NEAR_EXPIRY') {
        badgeClass = 'badge-warning';
        badgeText = `Cận Date (${item.days_left || 0}d)`;
      } else if (item.alert_level === 'LOW_STOCK') {
        badgeClass = 'badge-warning';
        badgeText = 'Dưới mức an toàn';
      }

      return `
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="code font-bold text-brand-600 dark:text-brand-400">${escapeHtml(item.sku || '')}</span>
              <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            <span class="text-xs text-gray-400">${escapeHtml(item.batch_code || 'Lô kho')}</span>
          </div>
          <div class="data-card-body space-y-1.5">
            <div class="font-semibold text-sm text-gray-900 dark:text-white">${escapeHtml(item.item_name || item.sku || '')}</div>
            <div class="text-xs text-gray-400">${escapeHtml(item.category || 'Gia vị')} • ${escapeHtml(item.unit || 'ĐVT')}</div>
            <div class="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <div>
                <span class="text-gray-400">Tồn hiện tại:</span>
                <span class="num font-semibold text-gray-900 dark:text-white ml-1">${item.qty} ${escapeHtml(item.unit || '')}</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400">An toàn:</span>
                <span class="num font-semibold text-amber-600 dark:text-amber-400 ml-1">${item.safety_stock || 5.0} ${escapeHtml(item.unit || '')}</span>
              </div>
            </div>
            ${item.exp_date ? `
              <div class="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 pt-1">
                <span>Hạn dùng:</span>
                <span class="num font-medium">${formatDate(item.exp_date.slice(0, 10))}</span>
              </div>
            ` : ''}
          </div>
          <div class="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="openItemDetailModal('${item.sku}')" class="btn btn-secondary btn-sm">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Chi tiết
            </button>
            <button onclick="openReceiptModal('${item.sku}')" class="btn btn-primary btn-sm">
              <i data-lucide="package-plus" class="w-3.5 h-3.5"></i> Nhập bổ sung
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
  const isDarkTheme = document.documentElement.classList.contains('dark');
  updateApexChartsTheme(isDarkTheme);
}

export function updateTailadminDashboard(d: DashboardSummaryData): void {
  // 1. Metric Cards via renderKpi
  if (typeof renderKpi === 'function') {
    renderKpi('dashMetricValue', {
      value: d.total_value || 0,
      sub: 'Theo giá bình quân kho'
    });
    renderKpi('dashMetricSkus', {
      value: d.total_skus || 0,
      unit: 'Mã',
      isCurrency: false,
      sub: 'Toàn bộ danh mục kho'
    });
    renderKpi('dashMetricRop', {
      value: d.rop_reorder_count || 0,
      unit: 'Mã',
      isCurrency: false,
      deltaText: ((d.rop_reorder_count || 0) > 0 ? `${d.rop_reorder_count} mã cần đặt` : 'An toàn'),
      deltaGood: ((d.rop_reorder_count || 0) === 0),
      sub: 'Chạm ngưỡng an toàn'
    });
    renderKpi('dashMetricExp', {
      value: d.critical_exp_count || 0,
      unit: 'Lô',
      isCurrency: false,
      deltaText: ((d.critical_exp_count || 0) > 0 ? `${d.critical_exp_count} lô xuất gấp` : 'An toàn'),
      deltaGood: ((d.critical_exp_count || 0) === 0),
      sub: 'Ưu tiên xuất FEFO'
    });
    renderKpi('dashMetricSlow', {
      value: d.slow_moving_count !== undefined ? d.slow_moving_count : 0,
      unit: 'Mã',
      isCurrency: false,
      sub: 'Lưu kho không biến động'
    });
  }

  const leadTextEl = document.getElementById('dashLeadTimeText');
  if (leadTextEl) {
    leadTextEl.textContent = `${d.avg_lead_time || 24.5}h`;
  }

  // 2. Safety Gauge Chart Update
  if (typeof chartSafetyGauge !== 'undefined' && chartSafetyGauge && typeof d.safety_rate !== 'undefined') {
    try {
      chartSafetyGauge.updateSeries([parseFloat(String(d.safety_rate))]);
    } catch {
      // Ignore
    }
  }

  // 3. Dynamic Monthly Inbound/Outbound Chart Update
  if (typeof chartInboundOutbound !== 'undefined' && chartInboundOutbound && d.chart_inbound_outbound) {
    const chartData = d.chart_inbound_outbound;
    const categories = Array.isArray(chartData.categories) ? chartData.categories : String(chartData.categories || '').split(' ').filter(Boolean);
    const inbound = Array.isArray(chartData.inbound) ? chartData.inbound : String(chartData.inbound || '').split(' ').filter(Boolean).map(Number);
    const outbound = Array.isArray(chartData.outbound) ? chartData.outbound : String(chartData.outbound || '').split(' ').filter(Boolean).map(Number);

    if (categories.length) {
      try {
        chartInboundOutbound.updateOptions({
          xaxis: { categories }
        });
        chartInboundOutbound.updateSeries([
          { name: 'Nhập kho (Tr ₫)', data: inbound },
          { name: 'Xuất kho (Tr ₫)', data: outbound }
        ]);
      } catch (err) {
        console.warn('Chart update notice:', err);
      }
    }
  }

  // 4. Render Stock Alerts Table
  renderStockAlertsTable(d.alerts || []);
}

/**
 * Fetch and load Dashboard Summary KPIs and charts from /api/dashboard-summary
 */
export async function loadDashboardSummary(): Promise<void> {
  try {
    const branch = (typeof App !== 'undefined' && App.currentBranch ? App.currentBranch : 'ALL').toUpperCase();
    const branchTitleEl = document.getElementById('dashBranchTitle');
    if (branchTitleEl) {
      branchTitleEl.textContent = (branch && branch !== 'ALL') ? branch : 'Toàn Chuỗi';
    }

    const res = await fetch(`/api/dashboard-summary?branch=${encodeURIComponent(branch)}&refresh=true`);
    const json = await res.json();
    if (json.success) {
      const d: DashboardSummaryData = json.data;
      updateTailadminDashboard(d);

      const elCrit = document.getElementById('dashCritCount');
      if (elCrit) elCrit.textContent = String(d.critical_exp_count || 0);

      const elRop = document.getElementById('dashRopCount');
      if (elRop) elRop.textContent = String(d.rop_reorder_count || 0);

      const elLead = document.getElementById('dashLeadTime');
      if (elLead) elLead.textContent = `${d.avg_lead_time || 24.5}h`;

      const elQty = document.getElementById('dashTotalQty');
      if (elQty) elQty.textContent = formatNumber(d.total_qty || 0, 1);

      const elSkus = document.getElementById('dashTotalSkus');
      if (elSkus) elSkus.textContent = `${d.total_skus || 0} SKU đang quản lý`;

      // Badges in navigation
      const bcEl = document.getElementById('badgeCritNav');
      if (bcEl) bcEl.textContent = String(d.critical_exp_count || 0);

      const brEl = document.getElementById('badgeRopNav');
      if (brEl) brEl.textContent = String(d.rop_reorder_count || 0);

      const w = typeof window !== 'undefined' ? (window as any) : {};
      if (typeof w.updateHeaderQuickAlerts === 'function') {
        w.updateHeaderQuickAlerts(d.rop_reorder_count || 0, d.critical_exp_count || 0);
      }
    }
  } catch (e) {
    console.error('Error loading dashboard summary:', e);
  }
}
