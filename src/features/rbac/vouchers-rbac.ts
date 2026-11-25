import { CurrentUserSession } from './types';
import { cellCode, cellDate, cellBadge, cellFiles, cellPerson, cellSite, fmtDate } from '@/features/portal/helpers';
import { canUserEdit, canUserDelete, isMasterAccount, assertPermission } from '@/features/auth';
import { uploadVoucherFileToSupabase, resolveVoucherImageThumbUrl, isImageFile } from '@/features/portal/supabase-storage';

export let _pendingDeleteVoucherCode: string | null = null;
export let _editVoucherFiles: Array<{
  file_name: string;
  file_link: string;
  file_type: string;
  file?: File;
  previewUrl?: string;
  isNew?: boolean;
}> = [];

declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;
declare const showToast: (msg: string, type?: string) => void;
declare const openGeneralModal: (title: string, bodyHtml: string) => void;
declare const closeGeneralModal: () => void;
declare const loadPersistedUser: () => any;
declare const getActiveSite: () => string;
declare const lucide: any;

export function getAppCurrentUser(): CurrentUserSession | null {
  if (typeof window !== 'undefined' && (window as any).gCurrentUser) {
    return (window as any).gCurrentUser;
  }
  if (typeof loadPersistedUser === 'function') {
    const u = loadPersistedUser();
    if (u && typeof window !== 'undefined') {
      (window as any).gCurrentUser = u;
      return u;
    }
  }
  return null;
}

export function canEditVouchers(): boolean {
  const user = getAppCurrentUser();
  if (!user) return false;
  if (isMasterAccount(user.email)) return true;
  return canUserEdit('portal-voucher') || canUserEdit('portal-search');
}

export function canDeleteVouchers(): boolean {
  const user = getAppCurrentUser();
  if (!user) return false;
  if (isMasterAccount(user.email)) return true;
  return canUserDelete('portal-voucher') || canUserDelete('portal-search');
}

export async function openEditVoucherModal(maCT: string): Promise<void> {
  if (!assertPermission('portal-voucher', 'edit', 'chỉnh sửa chứng từ thu chi')) {
    return;
  }
  if (typeof showLoading === 'function') showLoading('Đang tải thông tin chứng từ...');

  try {
    const res = await fetch(`/api/voucher-detail?maCT=${encodeURIComponent(maCT)}`);
    const json = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Không tải được chi tiết chứng từ');
    }
    const v = json.data;

    const codeEl = document.getElementById('editVoucherCode') as HTMLInputElement | null;
    if (codeEl) codeEl.value = v.voucher_code || maCT;
    const subEl = document.getElementById('editVoucherSubtitle');
    if (subEl) subEl.textContent = `Mã: ${v.voucher_code || maCT}`;

    const siteSelect = document.getElementById('editVoucherSite') as HTMLSelectElement | null;
    if (siteSelect) {
      const sitesList = (typeof (window as any).getAppSitesList === 'function' ? (window as any).getAppSitesList() : []) || [];
      siteSelect.innerHTML = sitesList.map((s: any) => {
        const val = s.ten || s.name || s.code || s;
        const isSel = (v.site_name === val || v.site_name === s.name || v.site_name === s.code) ? 'selected' : '';
        return `<option value="${val}" ${isSel}>${val}</option>`;
      }).join('');
      if (v.site_name && !sitesList.some((s: any) => (s.ten || s.name || s.code) === v.site_name)) {
        siteSelect.insertAdjacentHTML('afterbegin', `<option value="${v.site_name}" selected>${v.site_name}</option>`);
      }
    }

    const loaiSelect = document.getElementById('editVoucherLoai') as HTMLSelectElement | null;
    if (loaiSelect) loaiSelect.value = v.invoice_type || 'Hóa đơn GTGT';

    const ngayXuatEl = document.getElementById('editVoucherNgayXuat') as HTMLInputElement | null;
    if (ngayXuatEl) ngayXuatEl.value = (v.invoice_date || '').slice(0, 10);

    const ngayNhanEl = document.getElementById('editVoucherNgayNhan') as HTMLInputElement | null;
    if (ngayNhanEl) ngayNhanEl.value = (v.receive_date || '').slice(0, 10);

    const nccEl = document.getElementById('editVoucherNCC') as HTMLInputElement | null;
    if (nccEl) nccEl.value = v.supplier_name || '';

    const nguoiGiaoEl = document.getElementById('editVoucherNguoiGiao') as HTMLInputElement | null;
    if (nguoiGiaoEl) nguoiGiaoEl.value = v.deliverer_name || '';

    const nguoiNhanEl = document.getElementById('editVoucherNguoiNhan') as HTMLInputElement | null;
    if (nguoiNhanEl) nguoiNhanEl.value = v.receiver_name || '';

    const ghiChuEl = document.getElementById('editVoucherGhiChu') as HTMLInputElement | null;
    if (ghiChuEl) ghiChuEl.value = v.note || '';

    const files = v.files || [];
    _editVoucherFiles = files.map((f: any) => ({
      file_name: f.file_name || 'Tệp đính kèm',
      file_link: f.file_link || '',
      file_type: f.file_type || '',
      isNew: false
    }));
    const newFilesInput = document.getElementById('editVoucherNewFilesInput') as HTMLInputElement | null;
    if (newFilesInput) newFilesInput.value = '';
    renderEditVoucherFilesList();

    const modal = document.getElementById('modalEditVoucher');
    if (modal) modal.classList.remove('hidden');
  } catch (err: any) {
    console.error('openEditVoucherModal error:', err);
    if (typeof showToast === 'function') showToast('Lỗi tải chứng từ: ' + err.message, 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
}

export function renderEditVoucherFilesList(): void {
  const filesCountEl = document.getElementById('editVoucherFilesCount');
  const filesListEl = document.getElementById('editVoucherFilesList');
  if (filesCountEl) filesCountEl.textContent = `${_editVoucherFiles.length} tệp`;
  if (!filesListEl) return;

  if (!_editVoucherFiles.length) {
    filesListEl.innerHTML = '<div class="text-gray-400 italic text-[11px] py-2 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">Chưa có ảnh hoặc tệp đính kèm nào. Bấm "Thêm ảnh / tệp" để tải lên Supabase.</div>';
    return;
  }

  filesListEl.innerHTML = _editVoucherFiles.map((f, idx) => {
    const thumb = f.previewUrl || resolveVoucherImageThumbUrl(f);
    const viewHref = f.previewUrl || f.file_link;
    return `
      <div class="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs gap-2.5">
        <div class="flex items-center gap-2.5 min-w-0">
          ${thumb ? `
            <img src="${thumb}" alt="${f.file_name}" class="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shrink-0 cursor-pointer" onclick="openImageLightbox('${viewHref}', '${f.file_name}', '${f.file_type || 'image/jpeg'}')">
          ` : `
            <div class="w-10 h-10 rounded-lg bg-gray-200/70 dark:bg-gray-700 flex items-center justify-center shrink-0">
              <i data-lucide="file-text" class="w-4 h-4 text-gray-500"></i>
            </div>
          `}
          <div class="min-w-0">
            <div class="truncate text-gray-700 dark:text-gray-200 font-semibold" title="${f.file_name}">${f.file_name}</div>
            <div class="text-[10px] ${f.isNew ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-gray-400'}">
              ${f.isNew ? 'Ảnh/tệp mới (chờ lưu lên Supabase)' : 'Đã lưu trên hệ thống'}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          ${viewHref ? `<button type="button" onclick="openImageLightbox('${viewHref}', '${f.file_name}', '${f.file_type || 'image/jpeg'}')" class="text-brand-600 hover:underline font-bold">Xem</button>` : ''}
          <button type="button" onclick="removeEditVoucherFile(${idx})" class="text-rose-600 hover:text-rose-700 font-bold px-1.5 py-0.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40">Xóa</button>
        </div>
      </div>
    `;
  }).join('');

  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

export function onSelectEditVoucherFiles(input: HTMLInputElement): void {
  const files = Array.from(input.files || []);
  const maxBytes = 20 * 1024 * 1024; // 20MB
  files.forEach((f) => {
    if (f.size > maxBytes) {
      if (typeof showToast === 'function') {
        showToast(`File "${f.name}" vượt quá 20MB, vui lòng chọn file nhỏ hơn.`, 'warning');
      }
      return;
    }
    const isImg = isImageFile(f.name, f.type);
    const previewUrl = isImg ? URL.createObjectURL(f) : undefined;
    _editVoucherFiles.push({
      file_name: f.name,
      file_link: '',
      file_type: f.type || 'application/octet-stream',
      file: f,
      previewUrl,
      isNew: true
    });
  });
  renderEditVoucherFilesList();
  input.value = '';
}

export function removeEditVoucherFile(idx: number): void {
  const removed = _editVoucherFiles[idx];
  if (removed && removed.previewUrl && removed.previewUrl.startsWith('blob:')) {
    try { URL.revokeObjectURL(removed.previewUrl); } catch {}
  }
  _editVoucherFiles.splice(idx, 1);
  renderEditVoucherFilesList();
}

export function closeEditVoucherModal(): void {
  _editVoucherFiles.forEach((f) => {
    if (f.previewUrl && f.previewUrl.startsWith('blob:')) {
      try { URL.revokeObjectURL(f.previewUrl); } catch {}
    }
  });
  _editVoucherFiles = [];
  const modal = document.getElementById('modalEditVoucher');
  if (modal) modal.classList.add('hidden');
}

export async function saveEditVoucher(): Promise<void> {
  if (!assertPermission('portal-voucher', 'edit', 'chỉnh sửa chứng từ')) {
    return;
  }
  const maCT = (document.getElementById('editVoucherCode') as HTMLInputElement | null)?.value;
  if (!maCT) {
    if (typeof showToast === 'function') showToast('Thiếu mã chứng từ cần sửa', 'warning');
    return;
  }

  const site = (document.getElementById('editVoucherSite') as HTMLSelectElement | null)?.value || '';
  const loaiHoaDon = (document.getElementById('editVoucherLoai') as HTMLSelectElement | null)?.value || '';
  const ngayXuat = (document.getElementById('editVoucherNgayXuat') as HTMLInputElement | null)?.value || '';
  const ngayNhan = (document.getElementById('editVoucherNgayNhan') as HTMLInputElement | null)?.value || '';
  const nhaCungCap = (document.getElementById('editVoucherNCC') as HTMLInputElement | null)?.value || '';
  const nguoiGiao = (document.getElementById('editVoucherNguoiGiao') as HTMLInputElement | null)?.value || '';
  const nguoiNhan = (document.getElementById('editVoucherNguoiNhan') as HTMLInputElement | null)?.value || '';
  const ghiChu = (document.getElementById('editVoucherGhiChu') as HTMLInputElement | null)?.value || '';

  const saveBtn = document.getElementById('btnSaveEditVoucher') as HTMLButtonElement | null;
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="inline-block animate-spin mr-1">⌛</span> Đang lưu...';
  }

  try {
    const finalFiles: Array<{ name: string; url: string; type: string }> = [];
    const newFilesCount = _editVoucherFiles.filter(f => f.isNew && f.file).length;
    let uploadedIdx = 0;

    for (const item of _editVoucherFiles) {
      if (item.isNew && item.file) {
        uploadedIdx++;
        if (saveBtn) {
          saveBtn.innerHTML = `<span class="inline-block animate-spin mr-1">⌛</span> Đang tải ảnh (${uploadedIdx}/${newFilesCount})...`;
        }
        const uploaded = await uploadVoucherFileToSupabase(item.file, site || 'chung-tu');
        finalFiles.push({ name: uploaded.name, url: uploaded.url, type: uploaded.type });
      } else if (item.file_link) {
        finalFiles.push({
          name: item.file_name,
          url: item.file_link,
          type: item.file_type || 'IMAGE'
        });
      }
    }

    const res = await fetch('/api/voucher', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maCT,
        site,
        loaiHoaDon,
        ngayXuat,
        ngayNhan,
        nhaCungCap,
        nguoiGiao,
        nguoiNhan,
        ghiChu,
        updateFiles: true,
        files: finalFiles
      })
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Cập nhật không thành công');
    }
    if (typeof showToast === 'function') showToast('Đã cập nhật chứng từ thành công', 'success');
    closeEditVoucherModal();
    await searchVouchers();
  } catch (err: any) {
    console.error('saveEditVoucher error:', err);
    if (typeof showToast === 'function') showToast('Lỗi cập nhật: ' + err.message, 'error');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i data-lucide="save" class="w-3.5 h-3.5"></i><span>Lưu thay đổi</span>';
      if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      }
    }
  }
}

export async function confirmDeleteVoucher(maCT: string): Promise<void> {
  if (!assertPermission('portal-voucher', 'delete', 'xóa chứng từ thu chi')) {
    return;
  }
  _pendingDeleteVoucherCode = maCT;
  const codeEl = document.getElementById('confirmDeleteVoucherCode');
  if (codeEl) codeEl.textContent = maCT;

  const infoEl = document.getElementById('confirmDeleteVoucherInfo');
  if (infoEl) infoEl.innerHTML = '<span class="text-gray-400">Đang tải chi tiết...</span>';

  const modal = document.getElementById('modalConfirmDeleteVoucher');
  if (modal) modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  try {
    const res = await fetch(`/api/voucher-detail?maCT=${encodeURIComponent(maCT)}`);
    const json = await res.json();
    if (json.success && json.data && infoEl) {
      const v = json.data;
      infoEl.innerHTML = `
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div>Điểm bán: <b class="text-gray-900 dark:text-white">${v.site_name || '—'}</b></div>
          <div>Loại HĐ: <b class="text-gray-900 dark:text-white">${v.invoice_type || '—'}</b></div>
          <div>Ngày nhận: <b class="num font-medium text-gray-900 dark:text-white font-mono">${fmtDate(v.receive_date)}</b></div>
          <div>NCC: <b class="text-gray-900 dark:text-white truncate block">${v.supplier_name || '—'}</b></div>
        </div>
      `;
    }
  } catch {}
}

export function closeDeleteVoucherModal(): void {
  const modal = document.getElementById('modalConfirmDeleteVoucher');
  if (modal) modal.classList.add('hidden');
  _pendingDeleteVoucherCode = null;
}

export async function executeDeleteVoucher(): Promise<void> {
  const maCT = _pendingDeleteVoucherCode;
  if (!maCT) return;

  if (!assertPermission('portal-voucher', 'delete', 'xóa chứng từ thu chi')) {
    return;
  }

  const btn = document.getElementById('btnExecuteDeleteVoucher') as HTMLButtonElement | null;
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="inline-block animate-spin mr-1">⌛</span> Đang xóa...';
  }

  try {
    const res = await fetch('/api/voucher', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maCT })
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Xóa chứng từ không thành công');
    }
    if (typeof showToast === 'function') showToast(`Đã xóa thành công chứng từ ${maCT}`, 'success');
    closeDeleteVoucherModal();
    if (typeof closeGeneralModal === 'function') {
      closeGeneralModal();
    }
    await searchVouchers();
  } catch (err: any) {
    console.error('executeDeleteVoucher error:', err);
    if (typeof showToast === 'function') showToast('Lỗi khi xóa: ' + err.message, 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="trash-2" class="w-3.5 h-3.5"></i><span>Xác nhận xóa</span>';
      if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      }
    }
  }
}

export async function searchVouchers(): Promise<void> {
  const user = getAppCurrentUser();
  const activeSite = (typeof getActiveSite === 'function' ? getActiveSite() : (user ? user.assignedSite : '')) || '';
  const siteInput = document.getElementById('scSite') as HTMLSelectElement | null;
  const site = activeSite || (siteInput ? siteInput.value : '');
  const loai = (document.getElementById('scLoai') as HTMLSelectElement | null)?.value || '';
  const tuNgay = (document.getElementById('scTu') as HTMLInputElement | null)?.value || '';
  const denNgay = (document.getElementById('scDen') as HTMLInputElement | null)?.value || '';
  const auditFilter = (document.getElementById('scAuditFilter') as HTMLSelectElement | null)?.value || '';

  if (typeof showLoading === 'function') showLoading('Tra cứu chứng từ...');
  try {
    const url = `/api/vouchers?site=${encodeURIComponent(site)}&loaiHoaDon=${encodeURIComponent(loai)}&tuNgay=${encodeURIComponent(tuNgay)}&denNgay=${encodeURIComponent(denNgay)}&_t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } });
    const json = await res.json();
    const tbody = document.getElementById('scBody');
    const mobContainer = document.getElementById('scMobileCards');

    if (!json.success || !json.data || !json.data.length) {
      if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="p-8 text-center text-gray-400 text-xs">Không tìm thấy chứng từ nào</td></tr>';
      if (mobContainer) mobContainer.innerHTML = '<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs">Không tìm thấy chứng từ nào</div>';
      return;
    }

    let items = json.data;
    if (auditFilter === 'HAS_IMG') {
      items = items.filter((r: any) => Number(r.soFile) > 0);
    } else if (auditFilter === 'NO_IMG') {
      items = items.filter((r: any) => !r.soFile || Number(r.soFile) === 0);
    }

    if (!items.length) {
      if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="p-8 text-center text-gray-400 text-xs">Không tìm thấy chứng từ nào phù hợp với bộ lọc</td></tr>';
      if (mobContainer) mobContainer.innerHTML = '<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs">Không tìm thấy chứng từ nào phù hợp với bộ lọc</div>';
      return;
    }

    const canEdit = canEditVouchers();
    const canDelete = canDeleteVouchers();

    if (tbody) {
      tbody.innerHTML = items.map((r: any) => `
        <tr>
          <td class="col-code">${cellCode(r.maCT)}</td>
          <td>${cellSite(r.site)}</td>
          <td class="col-badge">${cellBadge('neutral', r.loaiHoaDon)}</td>
          <td class="col-date">${cellDate(r.ngayXuat)}</td>
          <td class="col-date">${cellDate(r.ngayNhan)}</td>
          <td><span class="font-medium text-gray-900 dark:text-white text-xs">${r.nhaCungCap || '—'}</span></td>
          <td>${cellPerson(r.nguoiNhap)}</td>
          <td class="col-badge text-center">${cellFiles(r.soFile)}</td>
          <td class="col-actions text-right">
            <div class="flex items-center justify-end gap-1">
              <button onclick="viewVoucherDetail('${r.maCT}')" class="btn btn-sm btn-ghost text-gray-600 hover:text-brand-600 dark:text-gray-400" title="Xem chi tiết">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Xem</span>
              </button>
              ${canEdit ? `
                <button onclick="openEditVoucherModal('${r.maCT}')" class="btn btn-sm btn-ghost text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30" title="Chỉnh sửa chứng từ">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg>
                  <span>Sửa</span>
                </button>
              ` : ''}
              ${canDelete ? `
                <button onclick="confirmDeleteVoucher('${r.maCT}')" class="btn btn-sm btn-ghost text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30" title="Xóa chứng từ">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  <span>Xóa</span>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `).join('');
    }

    if (mobContainer) {
      mobContainer.innerHTML = items.map((r: any) => `
        <div class="data-card space-y-3">
          <div class="flex items-center justify-between gap-2">
            ${cellCode(r.maCT)}
            ${cellBadge('neutral', r.loaiHoaDon)}
          </div>
          <div class="font-medium text-sm text-gray-900 dark:text-white leading-snug">${r.site}</div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 font-mono">
            <div>Ngày nhận: <b class="num text-gray-900 dark:text-white whitespace-nowrap">${fmtDate(r.ngayNhan)}</b></div>
            <div>NCC: <b class="text-gray-900 dark:text-white truncate block">${r.nhaCungCap || '—'}</b></div>
            <div>Người nhập: <b>${cellPerson(r.nguoiNhap)}</b></div>
            <div>Đính kèm: <b>${cellFiles(r.soFile)}</b></div>
          </div>
          <div class="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="viewVoucherDetail('${r.maCT}')" class="btn btn-secondary flex-1 text-xs py-2">
              <svg class="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span>Chi tiết</span>
            </button>
            ${canEdit ? `
              <button onclick="openEditVoucherModal('${r.maCT}')" class="btn btn-secondary text-xs py-2 text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg>
                <span>Sửa</span>
              </button>
            ` : ''}
            ${canDelete ? `
              <button onclick="confirmDeleteVoucher('${r.maCT}')" class="btn btn-secondary text-xs py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                <span>Xóa</span>
              </button>
            ` : ''}
          </div>
        </div>
      `).join('');
    }
  } catch (err: any) {
    console.error('searchVouchers error:', err);
    if (typeof showToast === 'function') showToast('Lỗi tra cứu chứng từ: ' + err.message, 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
}

export async function viewVoucherDetail(maCT: string): Promise<void> {
  if (typeof showLoading === 'function') showLoading('Tải chi tiết chứng từ...');
  try {
    const res = await fetch(`/api/voucher-detail?maCT=${encodeURIComponent(maCT)}`);
    const json = await res.json();
    if (json.success && json.data) {
      const v = json.data;

      let galleryHtml = '';
      if (v.files && v.files.length) {
        galleryHtml = `
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div class="font-medium text-xs text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
              <span>Tệp đính kèm & hình ảnh</span>
              <span class="badge badge-neutral">${v.files.length}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${v.files.map((f: any) => {
                const thumbUrl = resolveVoucherImageThumbUrl(f);

                return `
                  <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 flex flex-col justify-between gap-2 shadow-2xs">
                    ${thumbUrl ? `
                      <div class="w-full h-36 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 relative cursor-pointer group" onclick="openImageLightbox('${f.file_link}', '${f.file_name}', '${f.file_type}')">
                        <img src="${thumbUrl}" alt="${f.file_name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.parentElement.style.display='none';">
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity gap-1.5">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path></svg>
                          <span>Phóng to xem ảnh</span>
                        </div>
                      </div>
                    ` : ''}
                    <div class="flex items-center justify-between gap-2 min-w-0">
                      <div class="truncate text-xs font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1.5" title="${f.file_name}">
                        <svg class="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span class="truncate">${f.file_name}</span>
                      </div>
                      <div class="flex items-center gap-1 shrink-0">
                        <button onclick="openImageLightbox('${f.file_link}', '${f.file_name}', '${f.file_type}')" class="btn btn-sm btn-primary">
                          Xem
                        </button>
                        <a href="${f.file_link}" target="_blank" class="btn btn-sm btn-secondary p-1" title="Mở tệp trong tab mới">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      } else {
        galleryHtml = '<div class="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-center text-xs text-gray-400 italic">Không có tệp đính kèm hoặc hình ảnh nào</div>';
      }

      const canEdit = canEditVouchers();
      const canDelete = canDeleteVouchers();

      const html = `
        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-2.5 p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-800">
            <div><span class="text-gray-400">Mã chứng từ:</span><br><b class="code text-sm text-brand-600 dark:text-brand-400 font-semibold font-mono">${v.voucher_code}</b></div>
            <div><span class="text-gray-400">Loại hóa đơn:</span><br><b class="text-gray-800 dark:text-gray-200">${v.invoice_type}</b></div>
            <div><span class="text-gray-400">Điểm bán:</span><br><b class="text-gray-800 dark:text-gray-200">${v.site_name}</b></div>
            <div><span class="text-gray-400">Nhà cung cấp:</span><br><b class="text-gray-800 dark:text-gray-200">${v.supplier_name || '—'}</b></div>
            <div><span class="text-gray-400">Người giao:</span><br>${cellPerson(v.deliverer_name)}</div>
            <div><span class="text-gray-400">Người nhận:</span><br>${cellPerson(v.receiver_name)}</div>
            <div><span class="text-gray-400">Ngày xuất HĐ:</span><br><b class="num text-gray-800 dark:text-gray-200 font-mono">${fmtDate(v.invoice_date)}</b></div>
            <div><span class="text-gray-400">Ngày nhận hàng:</span><br><b class="num text-gray-800 dark:text-gray-200 font-mono">${fmtDate(v.receive_date)}</b></div>
          </div>
          <div>
            <span class="text-gray-400">Ghi chú nghiệp vụ:</span>
            <div class="p-2.5 mt-1 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300">${v.note || 'Không có ghi chú thêm.'}</div>
          </div>
          ${galleryHtml}
          ${(canEdit || canDelete) ? `
            <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
              ${canEdit ? `
                <button onclick="closeGeneralModal(); openEditVoucherModal('${v.voucher_code}')" class="btn btn-sm btn-secondary text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg>
                  <span>Chỉnh sửa chứng từ</span>
                </button>
              ` : ''}
              ${canDelete ? `
                <button onclick="closeGeneralModal(); confirmDeleteVoucher('${v.voucher_code}')" class="btn btn-sm btn-ghost text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  <span>Xóa chứng từ</span>
                </button>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `;
      if (typeof openGeneralModal === 'function') {
        openGeneralModal(`Chi Tiết Chứng Từ: ${maCT}`, html);
      }
    }
  } catch (err: any) {
    console.error('viewVoucherDetail error:', err);
    if (typeof showToast === 'function') showToast('Lỗi tải chi tiết: ' + err.message, 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
}
