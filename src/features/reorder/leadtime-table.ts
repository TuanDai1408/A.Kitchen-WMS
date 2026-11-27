import type { LeadTimeItem, SlaFilter } from './types';
import { paginateList } from '@/ts/utils/formatters';

declare const App: { leadTimeRawData?: LeadTimeItem[]; currentBranch?: string; [key: string]: any };

let leadTimeCurrentPage = 1;
let leadTimePageSize = 25;
let leadTimeActiveItems: LeadTimeItem[] = [];

const LEADTIME_PAGINATION_IDS = {
  startId: 'leadTimePageStart',
  endId: 'leadTimePageEnd',
  totalId: 'leadTimeTotalCount',
  badgeId: 'leadTimeCurrentPageBadge',
  prevId: 'leadTimePrevBtn',
  nextId: 'leadTimeNextBtn'
};

export function changeLeadTimePage(delta: number): void {
  leadTimeCurrentPage += delta;
  renderLeadTimeTable(leadTimeActiveItems);
}

export function changeLeadTimePageSize(size: string | number): void {
  leadTimePageSize = Math.max(1, parseInt(String(size), 10) || 25);
  leadTimeCurrentPage = 1;
  renderLeadTimeTable(leadTimeActiveItems);
}

export function renderLeadTimeTable(items: LeadTimeItem[]): void {
  leadTimeActiveItems = items || [];
  const tbody = document.getElementById('leadTimeTableBody');
  const mob = document.getElementById('leadTimeMobileCards');

  const { pagedItems, page } = paginateList(leadTimeActiveItems, leadTimeCurrentPage, leadTimePageSize, LEADTIME_PAGINATION_IDS);
  leadTimeCurrentPage = page;

  if (!pagedItems.length) {
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-gray-400">Không tìm thấy đơn PO nào phù hợp với Site và Kỳ tháng đã chọn.</td></tr>';
    }
    if (mob) {
      mob.innerHTML = '<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không tìm thấy đơn PO nào phù hợp với Site và Kỳ tháng đã chọn.</div>';
    }
    return;
  }

  if (tbody) {
    tbody.innerHTML = pagedItems.map(r => {
      const sup = r.supplier_name || r.vendor_name || 'Bếp Trung Tâm Siba Food';
      const oDate = r.order_date || (r.order_time ? r.order_time.split(' ')[0] : '—');
      const dDate = r.actual_delivery_date || (r.received_time ? r.received_time.split(' ')[0] : '—');
      const actual = (r.actual_lead_time_days !== null && r.actual_lead_time_days !== undefined)
        ? (r.actual_lead_time_days + ' ngày')
        : (r.lead_time_hours ? (r.lead_time_hours + 'h') : '—');
      const st = r.status || (r.sla_status === 'Đạt SLA' ? 'ĐÚNG HẠN' : 'TRỄ HẠN');
      const isGood = st === 'ĐÚNG HẠN' || r.sla_status === 'Đạt SLA';
      const isPending = st === 'ĐANG GIAO' || r.sla_status === 'Chờ giao';

      const badgeClass = isGood
        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200'
        : (isPending
          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200'
          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200');

      return `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 font-mono tabular-nums font-bold text-gray-900 dark:text-white">${r.po_number}</td>
          <td class="p-3 font-mono tabular-nums font-bold text-brand-600 dark:text-brand-400">
            <span class="px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/60">${r.branch_code || r.site || '—'}</span>
          </td>
          <td class="p-3 font-bold text-gray-800 dark:text-gray-200">${sup}</td>
          <td class="p-3 font-mono tabular-nums text-gray-600 dark:text-gray-300">${oDate}</td>
          <td class="p-3 font-mono tabular-nums text-gray-600 dark:text-gray-300">${dDate}</td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${!isGood && !isPending ? 'text-rose-600' : 'text-emerald-600'}">${actual}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${badgeClass}">${st}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (mob) {
    mob.innerHTML = pagedItems.map(r => {
      const sup = r.supplier_name || r.vendor_name || 'Bếp Trung Tâm Siba Food';
      const oDate = r.order_date || (r.order_time ? r.order_time.split(' ')[0] : '—');
      const dDate = r.actual_delivery_date || (r.received_time ? r.received_time.split(' ')[0] : '—');
      const commit = r.committed_lead_time_days
        ? (r.committed_lead_time_days + ' ngày')
        : (r.sla_target_hours ? (r.sla_target_hours + 'h') : '24h');
      const actual = (r.actual_lead_time_days !== null && r.actual_lead_time_days !== undefined)
        ? (r.actual_lead_time_days + ' ngày')
        : (r.lead_time_hours ? (r.lead_time_hours + 'h') : '—');
      const st = r.status || (r.sla_status === 'Đạt SLA' ? 'ĐÚNG HẠN' : 'TRỄ HẠN');
      const isGood = st === 'ĐÚNG HẠN' || r.sla_status === 'Đạt SLA';
      const isPending = st === 'ĐANG GIAO' || r.sla_status === 'Chờ giao';

      const badgeClass = isGood
        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200'
        : (isPending
          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200'
          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200');

      return `
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-xs text-gray-900 dark:text-white">${sup}</div>
              <div class="text-xs font-mono tabular-nums text-gray-400">PO: ${r.po_number} · Điểm: <b class="text-brand-600 dark:text-brand-400">${r.branch_code || r.site || '—'}</b></div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${badgeClass}">${st}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
            <div>Ngày đặt: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${oDate}</b></div>
            <div>Ngày nhận: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${dDate}</b></div>
            <div>Cam kết SLA: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${commit}</b></div>
            <div>Lead time thực tế: <b class="font-mono tabular-nums font-bold ${!isGood && !isPending ? 'text-rose-600' : 'text-emerald-600'}">${actual}</b></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

export function filterLeadTimeSla(slaFilter: SlaFilter | string): void {
  leadTimeCurrentPage = 1;
  const raw: LeadTimeItem[] = (typeof App !== 'undefined' && App.leadTimeRawData) ? App.leadTimeRawData : [];
  if (!slaFilter || slaFilter === 'ALL') {
    renderLeadTimeTable(raw);
    return;
  }
  const filtered = raw.filter(r => {
    const st = r.status || (r.sla_status === 'Đạt SLA' ? 'ĐÚNG HẠN' : 'TRỄ HẠN');
    if (slaFilter === 'ON_TIME') return st === 'ĐÚNG HẠN' || r.sla_status === 'Đạt SLA';
    if (slaFilter === 'DELIVERING') return st === 'ĐANG GIAO' || r.sla_status === 'Chờ giao';
    if (slaFilter === 'LATE') return st === 'TRỄ HẠN' || r.sla_status === 'Trễ hẹn NCC';
    return true;
  });
  renderLeadTimeTable(filtered);
}

/**
 * Fetch and load PO supplier Lead Time records from /api/leadtime
 */
export async function loadLeadTime(): Promise<void> {
  const globalBranch = (document.getElementById('globalBranchSelect') as HTMLSelectElement | null)?.value;
  const appBranch = (typeof App !== 'undefined' && App.currentBranch) ? App.currentBranch : '';
  const globalSite = (appBranch || globalBranch || '').toUpperCase();
  const monthInput = (document.getElementById('leadTimeMonth') as HTMLInputElement | null)?.value || '';

  const params = new URLSearchParams();
  if (globalSite && globalSite !== 'ALL') {
    params.set('site', globalSite);
  }
  if (monthInput) {
    params.set('month', monthInput);
  }

  const url = params.toString() ? `/api/leadtime?${params.toString()}` : '/api/leadtime';
  try {
    const res = await fetch(url);
    const json = await res.json();
    const items: LeadTimeItem[] = (json.success && json.data) ? json.data : [];
    if (typeof App !== 'undefined') {
      App.leadTimeRawData = items;
    }

    const slaFilter = (document.getElementById('leadTimeSlaFilter') as HTMLSelectElement | null)?.value || 'ALL';
    filterLeadTimeSla(slaFilter);
  } catch (e) {
    console.error('Error loading Lead Time:', e);
  }
}
