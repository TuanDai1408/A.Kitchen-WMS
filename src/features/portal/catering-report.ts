import { CateringReportImage, CateringReportPayload } from './types';
import { escapeHtml } from '@/ts/utils/formatters';

export let bcAnhFiles: CateringReportImage[] = [];

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const openGeneralModal: (title: string, bodyHtml: string) => void;
declare const closeGeneralModal: () => void;
declare const lucide: any;

export function bcNguoiBaoCaoChange(): void {
  const sel = document.getElementById('bcNguoiBaoCao') as HTMLSelectElement | null;
  const khac = document.getElementById('bcNguoiBaoCaoKhac') as HTMLInputElement | null;
  if (sel && khac) {
    if (sel.value === 'Khác') {
      khac.classList.remove('hidden');
      khac.focus();
    } else {
      khac.classList.add('hidden');
      khac.value = '';
    }
  }
}

export function tinhTongSuat(): void {
  const sang = parseFloat((document.getElementById('bcSang') as HTMLInputElement | null)?.value || '0') || 0;
  const trua = parseFloat((document.getElementById('bcTrua') as HTMLInputElement | null)?.value || '0') || 0;
  const chieu = parseFloat((document.getElementById('bcChieu') as HTMLInputElement | null)?.value || '0') || 0;
  const nv = parseFloat((document.getElementById('bcNhanVien') as HTMLInputElement | null)?.value || '0') || 0;
  const huy = parseFloat((document.getElementById('bcHuy') as HTMLInputElement | null)?.value || '0') || 0;
  const tong = sang + trua + chieu + nv + huy;
  const tongEl = document.getElementById('bcTong') as HTMLInputElement | null;
  if (tongEl) tongEl.value = Math.round(tong).toLocaleString('vi-VN');
}

export function bcChonAnh(input: HTMLInputElement): void {
  const files = Array.from(input.files || []);
  const maxBytes = 20 * 1024 * 1024; // 20MB
  files.forEach((f) => {
    if (f.size > maxBytes) {
      if (typeof showToast === 'function') {
        showToast(`Ảnh "${f.name}" vượt quá 20MB, bỏ qua.`);
      }
      return;
    }
    const url = URL.createObjectURL(f);
    bcAnhFiles.push({ name: f.name, size: f.size, previewUrl: url });
  });
  bcRenderAnh();
  input.value = '';
}

export function bcRenderAnh(): void {
  const el = document.getElementById('bcAnhList');
  if (!el) return;
  const list = (typeof window !== 'undefined' && (window as any).bcAnhFiles) ? (window as any).bcAnhFiles : bcAnhFiles;
  if (!list.length) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML = list.map((im: any, i: number) => `
    <div class="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/80 aspect-square">
      <img src="${im.previewUrl}" class="w-full h-full object-cover">
      <button type="button" onclick="bcXoaAnh(${i})" class="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 shadow-sm" title="Xóa ảnh">
        <i data-lucide="x" class="w-3 h-3"></i>
      </button>
      <div class="absolute bottom-0 inset-x-0 bg-slate-900/60 text-[10px] text-white px-1.5 py-0.5 truncate font-mono tabular-nums">${escapeHtml(im.name)}</div>
    </div>
  `).join('');
  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

export function bcXoaAnh(i: number): void {
  const list = (typeof window !== 'undefined' && (window as any).bcAnhFiles) ? (window as any).bcAnhFiles : bcAnhFiles;
  list.splice(i, 1);
  bcRenderAnh();
}

export function resetBaoCao(): void {
  const f = document.getElementById('bcForm') as HTMLFormElement | null;
  if (f) f.reset();
  const d = new Date();
  const bcNgay = document.getElementById('bcNgay') as HTMLInputElement | null;
  if (bcNgay) bcNgay.value = d.toISOString().split('T')[0];
  const tongEl = document.getElementById('bcTong') as HTMLInputElement | null;
  if (tongEl) tongEl.value = '0';
  const khac = document.getElementById('bcNguoiBaoCaoKhac') as HTMLInputElement | null;
  if (khac) {
    khac.classList.add('hidden');
    khac.value = '';
  }
  bcAnhFiles.length = 0;
  if (typeof window !== 'undefined') (window as any).bcAnhFiles = bcAnhFiles;
  bcRenderAnh();
  if (typeof showToast === 'function') {
    showToast('Đã làm mới form báo cáo ca bếp');
  }
}

export async function guiBaoCao(): Promise<void> {
  const site = (document.getElementById('bcSite') as HTMLSelectElement | null)?.value || '';
  if (!site) {
    if (typeof showToast === 'function') showToast('Vui lòng chọn Site ở thanh điều hướng phía trên!');
    return;
  }

  const ngay = (document.getElementById('bcNgay') as HTMLInputElement | null)?.value || '';
  if (!ngay) {
    if (typeof showToast === 'function') showToast('Vui lòng chọn Ngày báo cáo!');
    return;
  }

  const nguoiSel = (document.getElementById('bcNguoiBaoCao') as HTMLSelectElement | null)?.value || '';
  const nguoiKhac = (document.getElementById('bcNguoiBaoCaoKhac') as HTMLInputElement | null)?.value.trim() || '';
  const nguoiBC = (nguoiSel === 'Khác' ? nguoiKhac : nguoiSel);
  if (!nguoiBC) {
    if (typeof showToast === 'function') showToast('Vui lòng chọn hoặc nhập Người báo cáo!');
    return;
  }

  const sang = parseFloat((document.getElementById('bcSang') as HTMLInputElement | null)?.value || '0') || 0;
  const trua = parseFloat((document.getElementById('bcTrua') as HTMLInputElement | null)?.value || '0') || 0;
  const chieu = parseFloat((document.getElementById('bcChieu') as HTMLInputElement | null)?.value || '0') || 0;
  const nv = parseFloat((document.getElementById('bcNhanVien') as HTMLInputElement | null)?.value || '0') || 0;
  const huy = parseFloat((document.getElementById('bcHuy') as HTMLInputElement | null)?.value || '0') || 0;
  const tongXuat = sang + trua + chieu + nv + huy;

  // Collect form fields
  const f = document.getElementById('bcForm') as HTMLFormElement | null;
  const formData: Record<string, any> = {};
  if (f) {
    f.querySelectorAll('[name]').forEach((el: any) => {
      formData[el.getAttribute('name')] = el.value;
    });
  }

  if (typeof showLoading === 'function') showLoading('Đang gửi báo cáo vận hành ca bếp...');
  const btn = document.getElementById('btnGuiBaoCao') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    const staffCoMat = parseFloat((document.getElementById('bcStaffCoMat') as HTMLInputElement | null)?.value || '0') || 0;
    const staffVang = parseFloat((document.getElementById('bcStaffVang') as HTMLInputElement | null)?.value || '0') || 0;

    const payload: CateringReportPayload = {
      site,
      branchCode: site,
      reportDate: ngay,
      reporterName: nguoiBC,
      plannedMeals: tongXuat,
      actualMeals: tongXuat - huy,
      wastedMeals: huy,
      staffActual: staffCoMat,
      staffStandard: staffCoMat + staffVang,
      foodQualityNote: (document.getElementById('bcTinhTrangNVL') as HTMLInputElement | null)?.value || '',
      feedback: (document.getElementById('bcChiTietPhanHoi') as HTMLInputElement | null)?.value || '',
      extraCost: (document.getElementById('bcPhatSinhChiPhi') as HTMLSelectElement | null)?.value === 'Có' ? 1 : 0,
      images: bcAnhFiles.map((im) => ({ name: im.name })),
      reportData: {
        ...formData,
        'Site': site,
        'Người báo cáo': nguoiBC,
        'Tổng suất ăn đã xuất': tongXuat,
        'Ảnh đính kèm': bcAnhFiles.map((im) => im.name)
      }
    };

    const res = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      if (typeof openGeneralModal === 'function') {
        openGeneralModal('Gửi Báo Cáo Thành Công', `
          <div class="text-center py-4 space-y-3">
            <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-title-sm font-bold">✓</div>
            <div class="text-base font-semibold text-gray-800 dark:text-gray-100">Đã gửi báo cáo ca bếp thành công!</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Site: <b>${escapeHtml(site)}</b> · Ngày: <b>${escapeHtml(ngay)}</b></div>
            <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 inline-block font-mono tabular-nums text-xs">
              Tổng suất ăn đã xuất: <b class="text-emerald-700 text-sm font-semibold">${Math.round(tongXuat).toLocaleString('vi-VN')} suất</b>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Dữ liệu đã được lưu trữ an toàn trên Cloudflare D1.</div>
            <button onclick="closeGeneralModal();" class="mt-2 px-6 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm">
              Đã Hiểu
            </button>
          </div>
        `);
      }
      resetBaoCao();
    } else {
      if (typeof showToast === 'function') showToast('Lỗi: ' + (json.error || 'Không thể lưu báo cáo'));
    }
  } catch (err: any) {
    if (typeof showToast === 'function') showToast('Lỗi kết nối: ' + err.message);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (btn) btn.disabled = false;
  }
}

export function submitCateringReport(): Promise<void> {
  return guiBaoCao();
}
