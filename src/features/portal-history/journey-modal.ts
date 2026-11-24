import type { OrderDetailInfo, JourneyStepRecord } from './types';
import { fmtDate, safeEscapeHtml, canAuthenticateJourney } from './helpers';

declare const lucide: any;
declare function showLoading(msg?: string): void;
declare function hideLoading(): void;
declare function showToast(msg: string, type?: string): void;
declare function getAppCurrentUser(): any;

export let currentJourneyOrderCode: string | null = null;
export let currentJourneyData: any = null;

export const STANDARD_STEPS = [
  { step: 1, name: 'Quản lý site đặt hàng', desc: 'Điểm bán tạo phiếu đặt hàng thành công qua hệ thống Portal' },
  { step: 2, name: 'Admin tiếp nhận đơn hàng', desc: 'Admin/Bộ phận điều phối kiểm tra định mức & duyệt tiếp nhận đơn' },
  { step: 3, name: 'Chuyển bộ phận Trưởng Kho', desc: 'Thủ kho tiếp nhận yêu cầu, phân loại và chuẩn bị kế hoạch soạn' },
  { step: 4, name: 'Kho mail cho PMH', desc: 'Kho phối hợp phòng mua hàng hoặc nhà cung cấp kiểm tra tồn kho' },
  { step: 5, name: 'PMH tiếp nhận & đặt hàng', desc: 'Phòng mua hàng xác nhận đơn hàng với NCC hoặc xuất kho tổng' },
  { step: 6, name: 'Vận chuyển về kho', desc: 'Hàng hóa tập kết, kiểm đếm chất lượng và đóng gói chuyển đi' },
  { step: 7, name: 'Kho giao về các site', desc: 'Đang vận chuyển giao về điểm bán / Bếp trưởng ký nhận đủ' }
];

export function renderJourneyTimeline(_info: OrderDetailInfo, timeline: JourneyStepRecord[]): void {
  const container = document.getElementById('journeyTimelineContainer');
  if (!container) return;

  const currentStepText = document.getElementById('journeyCurrentStepText');

  const timelineMap: Record<number, JourneyStepRecord> = {};
  (timeline || []).forEach(t => {
    const b = Number(t.buoc);
    if (b) timelineMap[b] = t;
  });

  const recordedSteps = Object.keys(timelineMap).map(Number);
  const maxRecordedStep = recordedSteps.length ? Math.max(...recordedSteps) : 1;

  if (currentStepText) {
    currentStepText.textContent = `Bước ${maxRecordedStep}/7 (${STANDARD_STEPS[maxRecordedStep - 1]?.name || ''})`;
  }

  container.innerHTML = STANDARD_STEPS.map(s => {
    const t = timelineMap[s.step];
    const isCompleted = t && (t.trangThai === 'Hoàn thành' || t.trangThai === 'Hoàn tất');
    const isCurrent = (s.step === maxRecordedStep) || (t && !isCompleted);

    let circleClass = 'bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700';
    let iconHtml = `<span class="font-mono text-xs font-bold">${s.step}</span>`;
    let cardBorder = 'border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/60';
    let titleClass = 'text-gray-500 dark:text-gray-400 font-medium';
    let badgeHtml = `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Chờ xử lý</span>`;

    if (isCompleted) {
      circleClass = 'bg-emerald-600 text-white border-emerald-600 shadow-sm';
      iconHtml = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`;
      cardBorder = 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20';
      titleClass = 'text-emerald-900 dark:text-emerald-200 font-bold';
      badgeHtml = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Đã hoàn thành</span>`;
    } else if (isCurrent) {
      circleClass = 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-4 ring-indigo-100 dark:ring-indigo-950/60';
      iconHtml = `<svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg>`;
      cardBorder = 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-200 dark:ring-indigo-800/50';
      titleClass = 'text-indigo-900 dark:text-indigo-100 font-bold';
      badgeHtml = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>Đang xử lý</span>`;
    }

    return `
      <div class="relative flex items-start gap-3 group">
        <div class="absolute -left-[27px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${circleClass}">
          ${iconHtml}
        </div>
        <div class="flex-1 p-3 rounded-xl border ${cardBorder} shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs ${titleClass}">Bước ${s.step}: ${safeEscapeHtml(t?.tenBuoc || s.name)}</span>
            ${badgeHtml}
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">${safeEscapeHtml(s.desc)}</p>
          ${t ? `
            <div class="pt-1.5 mt-1 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div class="text-gray-600 dark:text-gray-300">
                Người xử lý: <b class="text-gray-900 dark:text-white">${safeEscapeHtml(t.nguoiXuLy || 'Hệ thống')}</b>
              </div>
              <div class="text-gray-400 dark:text-gray-500 font-mono">
                ${t.thoiGian ? fmtDate(t.thoiGian) : ''}
              </div>
              ${t.ghiChu ? `
                <div class="w-full text-gray-700 dark:text-gray-300 italic bg-white/70 dark:bg-gray-800/60 p-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                  " ${safeEscapeHtml(t.ghiChu)} "
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

export async function openOrderJourneyModal(orderCode: string): Promise<void> {
  if (!orderCode) return;
  currentJourneyOrderCode = orderCode;
  (window as any)._currentJourneyOrderCode = orderCode;
  const modal = document.getElementById('modalOrderJourney');
  if (!modal) return;

  const subtitle = document.getElementById('journeyOrderSubtitle');
  if (subtitle) subtitle.textContent = `Mã đơn: ${orderCode}`;

  if (typeof showLoading === 'function') showLoading('Tải hành trình đơn hàng...');
  try {
    const res = await fetch(`/api/order-detail?orderCode=${encodeURIComponent(orderCode)}&_t=${Date.now()}`);
    const json = await res.json();
    if (!json.success || !json.data) {
      if (typeof showToast === 'function') showToast(json.error || 'Không thể tải hành trình đơn hàng', 'error');
      return;
    }

    const { info, timeline } = json.data;
    currentJourneyData = json.data;
    (window as any)._currentJourneyData = json.data;

    const siteEl = document.getElementById('journeySiteName');
    if (siteEl) siteEl.textContent = info.site_name || info.site || '—';
    const orderedByEl = document.getElementById('journeyOrderedBy');
    if (orderedByEl) orderedByEl.textContent = info.ordered_by || '—';
    const dateEl = document.getElementById('journeyOrderDate');
    if (dateEl) dateEl.textContent = fmtDate(info.order_date || '');
    const badgeStatusEl = document.getElementById('journeyBadgeStatus');
    if (badgeStatusEl) badgeStatusEl.textContent = info.status || 'Đang xử lý';

    renderJourneyTimeline(info, timeline || []);

    const isAdmin = canAuthenticateJourney(info);
    const adminSection = document.getElementById('journeyAdminSection');
    if (adminSection) {
      if (isAdmin) {
        adminSection.classList.remove('hidden');
        const user = (typeof getAppCurrentUser === 'function' ? getAppCurrentUser() : null) || (window as any).gCurrentUser;
        const actorEl = document.getElementById('journeyAdminActor');
        if (actorEl) actorEl.textContent = (user && (user.fullName || user.email)) || 'Quản trị viên';

        const maxStep = (timeline && timeline.length) ? Math.max(...timeline.map((t: any) => Number(t.buoc) || 1)) : 1;
        const nextStep = Math.min(maxStep + 1, 7);
        const selectStep = document.getElementById('journeySelectStep') as HTMLSelectElement | null;
        if (selectStep) selectStep.value = String(nextStep);
        const noteInput = document.getElementById('journeyStepNote') as HTMLInputElement | null;
        if (noteInput) noteInput.value = '';
      } else {
        adminSection.classList.add('hidden');
      }
    }

    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  } catch (err) {
    console.error('Error openOrderJourneyModal:', err);
    if (typeof showToast === 'function') showToast('Lỗi kết nối khi tải hành trình', 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export function closeOrderJourneyModal(): void {
  const modal = document.getElementById('modalOrderJourney');
  if (modal) modal.classList.add('hidden');
}

export async function submitJourneyStep(): Promise<void> {
  const orderCode = currentJourneyOrderCode || (window as any)._currentJourneyOrderCode;
  if (!orderCode) return;

  const selectStep = document.getElementById('journeySelectStep') as HTMLSelectElement | null;
  const stepStatus = document.getElementById('journeyStepStatus') as HTMLSelectElement | null;
  const stepNote = document.getElementById('journeyStepNote') as HTMLInputElement | null;
  const btn = document.getElementById('btnSubmitJourneyStep') as HTMLButtonElement | null;

  const step = Number(selectStep ? selectStep.value : 1);
  const status = stepStatus ? stepStatus.value : 'Hoàn thành';
  const note = stepNote ? stepNote.value.trim() : '';

  const user = (typeof getAppCurrentUser === 'function' ? getAppCurrentUser() : null) || (window as any).gCurrentUser;
  const actor = (user && (user.fullName || user.email)) || 'Admin';

  const stepNames: Record<number, string> = {
    1: 'Quản lý site đặt hàng',
    2: 'Admin tiếp nhận đơn hàng',
    3: 'Chuyển bộ phận Trưởng Kho',
    4: 'Kho mail cho PMH',
    5: 'PMH tiếp nhận & đặt hàng',
    6: 'Vận chuyển về kho',
    7: 'Kho giao về các site'
  };
  const stepName = stepNames[step] || `Bước ${step}`;

  try {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="inline-block animate-spin mr-1">⏳</span> Đang lưu...`;
    }

    const res = await fetch('/api/order-journey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderCode,
        step,
        stepName,
        status,
        note,
        actor
      })
    });

    const json = await res.json();
    if (!json.success) {
      if (typeof showToast === 'function') showToast(json.error || 'Cập nhật bước hành trình thất bại', 'error');
      return;
    }

    if (typeof showToast === 'function') showToast(`Đã xác thực thành công Bước ${step}: ${stepName}`, 'success');

    if (json.data && json.data.timeline) {
      const info = currentJourneyData?.info || (window as any)._currentJourneyData?.info || { order_code: orderCode };
      info.status = json.data.orderStatus;
      const badgeStatusEl = document.getElementById('journeyBadgeStatus');
      if (badgeStatusEl) badgeStatusEl.textContent = info.status;
      renderJourneyTimeline(info, json.data.timeline);

      if (selectStep && step < 7) {
        selectStep.value = String(step + 1);
      }
      if (stepNote) stepNote.value = '';
    }

    if (typeof (window as any).loadHistory === 'function') {
      (window as any).loadHistory();
    }
  } catch (err) {
    console.error('Error submitJourneyStep:', err);
    if (typeof showToast === 'function') showToast('Lỗi kết nối khi cập nhật tiến độ', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i><span>Xác nhận cập nhật bước này</span>`;
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }
  }
}
