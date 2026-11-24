import { VoucherFileItem, VoucherPayload } from './types';
import { cellCode, cellDate, cellBadge, cellFiles, cellPerson, cellSite } from './helpers';
import { escapeHtml } from '@/ts/utils/formatters';

export let uploadedFiles: VoucherFileItem[] = [];

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const openGeneralModal: (title: string, bodyHtml: string) => void;
declare const closeGeneralModal: () => void;
declare const switchTab: (tabId: string) => void;
declare const exportStyledExcel: (fileName: string, sheetName: string, headers: string[], dataRows: any[][], numCols?: number[], codeCols?: number[]) => void;
declare const XLSX: any;
declare const lucide: any;
declare const App: any;

export function onChonFile(input: HTMLInputElement): void {
  const files = Array.from(input.files || []);
  const maxBytes = 20 * 1024 * 1024; // 20MB
  files.forEach((f) => {
    if (f.size > maxBytes) {
      if (typeof showToast === 'function') {
        showToast(`File "${f.name}" vượt quá 20MB, vui lòng chọn file nhỏ hơn.`);
      }
      return;
    }
    uploadedFiles.push({ name: f.name, size: f.size, type: f.type || 'DOCUMENT' });
  });
  renderUploadedFiles();
  input.value = '';
}

export function onSelectFiles(input: HTMLInputElement): void {
  onChonFile(input);
}

export function renderUploadedFiles(): void {
  const el = document.getElementById('ctFileList');
  if (!el) return;
  const list = (typeof window !== 'undefined' && (window as any).uploadedFiles) ? (window as any).uploadedFiles : uploadedFiles;
  if (!list.length) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML = list.map((f: any, i: number) => `
    <div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl text-xs">
      <div class="flex items-center gap-2 overflow-hidden">
        <i data-lucide="file-text" class="w-4 h-4 text-brand-600 shrink-0"></i>
        <span class="font-bold text-gray-800 dark:text-gray-100 truncate">${escapeHtml(f.name)}</span>
        <span class="text-gray-400 dark:text-gray-500 font-mono tabular-nums text-xs">(${Math.round(f.size / 1024)} KB)</span>
      </div>
      <button type="button" onclick="removeFile(${i})" class="text-rose-600 hover:text-rose-800 font-bold px-2 py-1 text-xs">Xóa</button>
    </div>
  `).join('');
  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

export function removeFile(i: number): void {
  const list = (typeof window !== 'undefined' && (window as any).uploadedFiles) ? (window as any).uploadedFiles : uploadedFiles;
  list.splice(i, 1);
  renderUploadedFiles();
}

export function resetChungTuForm(): void {
  const ncc = document.getElementById('ctNCC') as HTMLInputElement | null; if (ncc) ncc.value = '';
  const giao = document.getElementById('ctNguoiGiao') as HTMLInputElement | null; if (giao) giao.value = '';
  const nhan = document.getElementById('ctNguoiNhan') as HTMLInputElement | null; if (nhan) nhan.value = '';
  const ghiChu = document.getElementById('ctGhiChu') as HTMLInputElement | null; if (ghiChu) ghiChu.value = '';
  const fileInput = document.getElementById('ctFile') as HTMLInputElement | null; if (fileInput) fileInput.value = '';
  uploadedFiles.length = 0;
  if (typeof window !== 'undefined') (window as any).uploadedFiles = uploadedFiles;
  renderUploadedFiles();
  if (typeof showToast === 'function') {
    showToast('Đã làm mới form chứng từ');
  }
}

export function resetVoucherForm(): void {
  resetChungTuForm();
}

export async function luuChungTuForm(): Promise<void> {
  const site = (document.getElementById('ctSite') as HTMLSelectElement | null)?.value || '';
  const loai = (document.getElementById('ctLoai') as HTMLSelectElement | null)?.value || '';
  const ngayXuat = (document.getElementById('ctNgayXuat') as HTMLInputElement | null)?.value || '';
  const ngayNhan = (document.getElementById('ctNgayNhan') as HTMLInputElement | null)?.value || '';

  if (!site) {
    if (typeof showToast === 'function') showToast('Vui lòng chọn Site áp dụng!');
    return;
  }
  if (!loai) {
    if (typeof showToast === 'function') showToast('Vui lòng chọn Loại hóa đơn / chứng từ!');
    return;
  }
  if (!ngayXuat || !ngayNhan) {
    if (typeof showToast === 'function') showToast('Vui lòng nhập Ngày xuất và Ngày nhận!');
    return;
  }

  if (typeof showLoading === 'function') showLoading('Đang lưu chứng từ & tệp đính kèm...');
  const btn = document.getElementById('btnLuuCT') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    const userEmail = (typeof App !== 'undefined' && App.user) ? App.user.email : 'Thủ kho Site';
    const payload: VoucherPayload = {
      site,
      loaiHoaDon: loai,
      ngayXuat,
      ngayNhan,
      nhaCungCap: (document.getElementById('ctNCC') as HTMLInputElement | null)?.value.trim() || '',
      nguoiGiao: (document.getElementById('ctNguoiGiao') as HTMLInputElement | null)?.value.trim() || '',
      nguoiNhan: (document.getElementById('ctNguoiNhan') as HTMLInputElement | null)?.value.trim() || '',
      ghiChu: (document.getElementById('ctGhiChu') as HTMLInputElement | null)?.value.trim() || '',
      nguoiNhap: userEmail,
      files: uploadedFiles.map((f) => ({ name: f.name, url: 'https://drive.google.com/sample', type: f.type }))
    };

    const res = await fetch('/api/voucher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      const maCT = json.data ? json.data.maCT : 'CT-SUCCESS';
      if (typeof openGeneralModal === 'function') {
        openGeneralModal('Lưu Chứng Từ Thành Công', `
          <div class="text-center py-4 space-y-3">
            <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-title-sm font-bold">✓</div>
            <div class="text-base font-semibold text-gray-800 dark:text-gray-100">Chứng từ đã được lưu vào hệ thống!</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 font-mono tabular-nums">Mã chứng từ: <b class="text-brand-600 text-sm">${escapeHtml(maCT)}</b></div>
            <div class="text-xs text-gray-600 dark:text-gray-300">Đã cập nhật cơ sở dữ liệu Cloudflare D1. Bạn có thể tra cứu tại tab "Tra Cứu Chứng Từ".</div>
            <button onclick="closeGeneralModal(); switchTab('portal-search');" class="mt-2 px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm">
              Đến Trang Tra Cứu
            </button>
          </div>
        `);
      }
      resetChungTuForm();
    } else {
      if (typeof showToast === 'function') showToast('Lỗi: ' + (json.error || 'Không thể lưu chứng từ'));
    }
  } catch (err: any) {
    if (typeof showToast === 'function') showToast('Lỗi kết nối: ' + err.message);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (btn) btn.disabled = false;
  }
}

export function saveVoucher(): Promise<void> {
  return luuChungTuForm();
}

export function taiTemplateChungTu(): void {
  const headers = [
    'Mã Site', 'Tên Site', 'Loại hóa đơn', 'Ngày xuất hóa đơn (yyyy-mm-dd)',
    'Ngày nhận hàng (yyyy-mm-dd)', 'Nhà cung cấp', 'Người giao', 'Người nhận',
    'Ghi chú', 'Link ảnh (Drive)'
  ];
  const sampleRows = [
    [
      'K001', 'K001 - MN Bếp Ăn Đại Học Hùng Vương', 'Hóa đơn GTGT', '2026-11-15',
      '2026-11-15', 'Công ty TNHH Thực Phẩm Sạch', 'Nguyễn Văn Giao', 'Trần Thị Nhận',
      'Hàng giao đủ số lượng, bao bì nguyên vẹn', 'https://drive.google.com/file/d/1sample1/view'
    ]
  ];
  if (typeof exportStyledExcel === 'function') {
    exportStyledExcel('Template_Import_Chung_Tu.xlsx', 'ImportChungTu', headers, sampleRows, [], [0, 3, 4]);
    if (typeof showToast === 'function') showToast('Đã tải template Excel import chứng từ về máy!');
  }
}

export function importExcelChungTu(input: HTMLInputElement): void {
  const file = input.files && input.files[0];
  if (!file) return;
  const infoEl = document.getElementById('importInfo');
  const resEl = document.getElementById('importResult');
  if (infoEl) infoEl.textContent = `Đang đọc file: ${file.name}...`;

  const reader = new FileReader();
  reader.onload = async function (e: ProgressEvent<FileReader>) {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

      if (!rows.length) {
        if (typeof showToast === 'function') showToast('File Excel không có dòng dữ liệu nào!');
        if (infoEl) infoEl.textContent = '';
        input.value = '';
        return;
      }

      const userEmail = (typeof App !== 'undefined' && App.user) ? App.user.email : 'Import Excel';
      const items = rows.map((r) => {
        const siteVal = r['Tên Site'] || r['Site'] || r['Mã Site'] || '';
        const loaiVal = r['Loại hóa đơn'] || r['Loại chứng từ'] || 'Hóa đơn GTGT';
        const ngayXuat = r['Ngày xuất hóa đơn (yyyy-mm-dd)'] || r['Ngày xuất'] || '';
        const ngayNhan = r['Ngày nhận hàng (yyyy-mm-dd)'] || r['Ngày nhận'] || '';
        const ncc = r['Nhà cung cấp'] || '';
        const giao = r['Người giao'] || '';
        const nhan = r['Người nhận'] || '';
        const ghiChu = r['Ghi chú'] || '';
        const linkAnh = r['Link ảnh (Drive)'] || r['Link ảnh'] || '';

        return {
          site: siteVal,
          loaiHoaDon: loaiVal,
          ngayXuat,
          ngayNhan,
          nhaCungCap: ncc,
          nguoiGiao: giao,
          nguoiNhan: nhan,
          ghiChu,
          linkAnh,
          nguoiNhap: userEmail
        };
      }).filter((it) => it.site && it.loaiHoaDon);

      if (!items.length) {
        if (typeof showToast === 'function') showToast('Không tìm thấy dòng nào hợp lệ (cần có Site và Loại hóa đơn)!');
        if (infoEl) infoEl.textContent = '';
        input.value = '';
        return;
      }

      if (typeof showLoading === 'function') showLoading(`Đang import ${items.length} chứng từ vào D1...`);
      const resp = await fetch('/api/vouchers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      const json = await resp.json();
      if (json.success) {
        if (infoEl) infoEl.textContent = '';
        if (resEl) {
          resEl.innerHTML = `
            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
              <span>✓ <b>Thành công:</b> Đã import ${json.count} chứng từ vào hệ thống Cloudflare D1.</span>
              <button onclick="switchTab('portal-search')" class="underline font-bold">Xem danh sách</button>
            </div>
          `;
        }
        if (typeof showToast === 'function') showToast(`Đã import thành công ${json.count} chứng từ!`);
      } else {
        if (typeof showToast === 'function') showToast('Lỗi: ' + (json.error || 'Không thể import chứng từ'));
      }
    } catch (err: any) {
      if (typeof showToast === 'function') showToast('Lỗi đọc file Excel: ' + err.message);
    } finally {
      if (typeof hideLoading === 'function') hideLoading();
      input.value = '';
    }
  };
  reader.readAsArrayBuffer(file);
}

export async function searchVouchers(): Promise<void> {
  const siteInput = document.getElementById('scSite') as HTMLSelectElement | null;
  const loaiInput = document.getElementById('scLoai') as HTMLSelectElement | null;
  const site = siteInput ? siteInput.value : '';
  const loai = loaiInput ? loaiInput.value : '';
  const url = `/api/vouchers?site=${encodeURIComponent(site)}&loaiHoaDon=${encodeURIComponent(loai)}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    const tbody = document.getElementById('scBody');
    if (json.success && json.data && json.data.length) {
      if (tbody) {
        tbody.innerHTML = json.data.map((r: any) => `
          <tr>
            <td class="col-code">${cellCode(r.maCT)}</td>
            <td>${cellSite(r.site)}</td>
            <td class="col-badge">${cellBadge('neutral', r.loaiHoaDon)}</td>
            <td class="col-date">${cellDate(r.ngayXuat)}</td>
            <td class="col-date">${cellDate(r.ngayNhan)}</td>
            <td><span class="font-medium text-gray-900 dark:text-white text-xs">${escapeHtml(r.nhaCungCap || '—')}</span></td>
            <td>${cellPerson(r.nguoiNhap)}</td>
            <td class="col-badge text-center">${cellFiles(r.soFile)}</td>
            <td class="col-actions text-right">
              <button onclick="viewVoucherDetail('${escapeHtml(r.maCT)}')" class="btn btn-sm btn-ghost" title="Xem chi tiết">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Xem</span>
              </button>
            </td>
          </tr>
        `).join('');
      }
    } else {
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="9" class="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">Không có chứng từ nào.</td></tr>';
      }
    }
  } catch (e: any) {
    console.error('searchVouchers error:', e);
  }
}

export async function viewVoucherDetail(maCT: string): Promise<void> {
  if (typeof showLoading === 'function') showLoading('Tải chi tiết chứng từ...');
  try {
    const res = await fetch(`/api/voucher-detail?maCT=${encodeURIComponent(maCT)}`);
    const json = await res.json();
    if (json.success) {
      const v = json.data;
      const html = `
        <div class="space-y-4 text-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200 dark:border-gray-800 text-sm">
            <div><span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Mã chứng từ:</span> <span class="code font-semibold text-brand-600 dark:text-brand-400 text-sm font-mono">${escapeHtml(v.voucher_code)}</span></div>
            <div><span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Loại chứng từ:</span> <span class="font-medium text-gray-900 dark:text-white">${escapeHtml(v.invoice_type)}</span></div>
            <div><span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Điểm nhận:</span> <span class="font-medium text-gray-900 dark:text-white">${escapeHtml(v.site_name)}</span></div>
            <div><span class="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Nhà cung cấp:</span> <span class="font-medium text-gray-900 dark:text-white">${escapeHtml(v.supplier_name || '—')}</span></div>
          </div>
          <div class="p-3.5 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Ghi chú:</span>
            <p class="text-gray-800 dark:text-gray-200">${escapeHtml(v.note || 'Không có ghi chú')}</p>
          </div>
          <div>
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-2">Tệp tài liệu đính kèm:</span>
            <div class="space-y-2">
              ${v.files && v.files.length ? v.files.map((f: any) => `
                <div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 text-xs">
                  <span class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <i data-lucide="file-text" class="w-4 h-4 text-brand-500"></i>
                    <span>${escapeHtml(f.file_name)}</span>
                  </span>
                  <a href="${escapeHtml(f.file_link)}" target="_blank" class="btn btn-sm btn-secondary">Mở tệp</a>
                </div>
              `).join('') : '<p class="text-xs text-gray-400 dark:text-gray-500 italic p-3 text-center bg-gray-50 dark:bg-gray-800/30 rounded-xl">Không có tệp đính kèm</p>'}
            </div>
          </div>
        </div>
      `;
      if (typeof openGeneralModal === 'function') {
        openGeneralModal(`Chứng từ ${maCT}`, html);
      }
    }
  } catch (e: any) {
    if (typeof showToast === 'function') showToast('Lỗi: ' + e.message);
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}
