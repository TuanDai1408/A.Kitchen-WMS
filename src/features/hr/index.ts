import { escapeHtml, paginateList } from '@/ts/utils/formatters';
import { canUserCreate, canUserEdit, canUserDelete, assertPermission, getCurrentAppUser } from '@/features/auth';

declare const window: any;
declare const XLSX: any;
declare const ExcelJS: any;
declare const lucide: any;
declare const showToast: (msg: string, type?: string) => void;
declare const showLoading: (msg?: string) => void;
declare const hideLoading: () => void;

export interface HrEmployee {
  id: number;
  emp_code: string;
  full_name: string;
  job_title?: string;
  gender?: string;
  hire_date?: string | null;
  birth_date?: string | null;
  age?: number | null;
  status?: string;
  work_location?: string;
  emp_type?: string;
  phone?: string;
  company_email?: string;
  resign_date?: string | null;
  notes?: string;
}

let gHrEmployees: HrEmployee[] = [];
let gHrFiltered: HrEmployee[] = [];
let hrCurrentPage = 1;
let hrPageSize = 25;

const HR_PAGINATION_IDS = {
  startId: 'hrPageStart',
  endId: 'hrPageEnd',
  totalId: 'hrTotalCount',
  badgeId: 'hrCurrentPageBadge',
  prevId: 'hrPrevBtn',
  nextId: 'hrNextBtn'
};

const DEFAULT_JOB_TITLES = [
  'Giám sát',
  'Tổ trưởng',
  'Tổ trưởng bếp',
  'Chuyên viên Quản lý chất lượng',
  'Nhân viên Bếp chính',
  'Nhân viên Phụ bếp',
  'Nhân viên hỗ trợ điểm',
  'Thủ kho'
];

function fmtDateYmd(val: any): string {
  if (!val) return '';
  return String(val).slice(0, 10);
}

function fmtDateVn(val: any): string {
  const s = fmtDateYmd(val);
  if (!s || s.length < 10) return '—';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
}

function getHrAuthHeaders(): Record<string, string> {
  const user = getCurrentAppUser();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (user?.email) headers['X-User-Email'] = user.email;
  return headers;
}

export function changeHrPage(delta: number): void {
  hrCurrentPage += delta;
  renderHrEmployeesTable();
}

export function changeHrPageSize(size: string | number): void {
  hrPageSize = Math.max(1, parseInt(String(size), 10) || 25);
  hrCurrentPage = 1;
  renderHrEmployeesTable();
}

function populateHrFilters(list: HrEmployee[]): void {
  const fillSelect = (id: string, defaultLabel: string, values: string[]) => {
    const sel = document.getElementById(id) as HTMLSelectElement | null;
    if (!sel) return;
    const cur = sel.value || '';
    sel.innerHTML = `<option value="">${defaultLabel}</option>` + values.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
    if (cur && values.includes(cur)) sel.value = cur;
  };

  const locs = Array.from(new Set(list.map(e => (e.work_location || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'vi'));
  const jobs = Array.from(new Set(list.map(e => (e.job_title || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'vi'));
  const types = Array.from(new Set(list.map(e => (e.emp_type || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'vi'));

  fillSelect('hrFilterLocation', 'Tất cả nơi làm việc', locs);
  fillSelect('hrFilterJobTitle', 'Tất cả chức danh', jobs);
  fillSelect('hrFilterEmpType', 'Tất cả loại NV', types);
}

function updateHrKpis(list: HrEmployee[]): void {
  const total = list.length;
  const active = list.filter(e => (e.status || 'Đang làm việc') !== 'Đã nghỉ').length;
  const resigned = total - active;
  const locCount = new Set(list.map(e => (e.work_location || '').trim()).filter(Boolean)).size;

  const setTxt = (id: string, val: number) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  };
  setTxt('hrKpiTotal', total);
  setTxt('hrKpiActive', active);
  setTxt('hrKpiResigned', resigned);
  setTxt('hrKpiLocations', locCount);
}

function getActiveGlobalHrSite(): string {
  const globalSel = (document.getElementById('globalBranchSelect') as HTMLSelectElement | null)?.value;
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('orbit_user_site') : null;
  const raw = (globalSel || saved || 'ALL').trim().toUpperCase();
  return raw || 'ALL';
}

function matchEmployeeToGlobalSite(emp: HrEmployee, siteCode: string): boolean {
  if (!siteCode || siteCode === 'ALL') return true;
  const loc = (emp.work_location || '').toLowerCase().trim();
  if (!loc) return false;
  if (loc.includes(siteCode.toLowerCase())) return true;

  const sitesList = typeof window.getAppSitesList === 'function' ? window.getAppSitesList() : [];
  const siteObj = sitesList.find((s: any) => s?.code && s.code.toUpperCase() === siteCode);
  if (!siteObj) return false;

  const fullName = String(siteObj.ten || siteObj.name || '').toLowerCase();
  const stripped = fullName
    .replace(/^[a-z]\d{3}\s*-\s*/i, '')
    .replace(/^(mn|mb)\s+a\.?kitchen\s*-\s*/i, '')
    .trim();
  return Boolean(stripped && (loc.includes(stripped) || stripped.includes(loc)));
}

export function filterHrEmployees(): void {
  const activeSite = getActiveGlobalHrSite();
  const siteScoped = gHrEmployees.filter(e => matchEmployeeToGlobalSite(e, activeSite));
  updateHrKpis(siteScoped);

  const hrBadge = document.getElementById('hrCurrentSiteBadge');
  if (hrBadge) {
    if (activeSite === 'ALL') {
      hrBadge.textContent = 'Tất cả điểm bán';
    } else {
      const sitesList = typeof window.getAppSitesList === 'function' ? window.getAppSitesList() : [];
      const siteObj = sitesList.find((s: any) => s?.code && s.code.toUpperCase() === activeSite);
      hrBadge.textContent = siteObj ? (siteObj.ten || siteObj.name) : activeSite;
    }
  }

  const q = ((document.getElementById('hrSearchInput') as HTMLInputElement | null)?.value || '').toLowerCase().trim();
  const status = (document.getElementById('hrFilterStatus') as HTMLSelectElement | null)?.value || '';
  const loc = (document.getElementById('hrFilterLocation') as HTMLSelectElement | null)?.value || '';
  const job = (document.getElementById('hrFilterJobTitle') as HTMLSelectElement | null)?.value || '';
  const empType = (document.getElementById('hrFilterEmpType') as HTMLSelectElement | null)?.value || '';

  gHrFiltered = siteScoped.filter(e => {
    if (q) {
      const match =
        (e.emp_code || '').toLowerCase().includes(q) ||
        (e.full_name || '').toLowerCase().includes(q) ||
        (e.phone || '').toLowerCase().includes(q) ||
        (e.company_email || '').toLowerCase().includes(q) ||
        (e.job_title || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    const st = e.status || 'Đang làm việc';
    if (status && st !== status) return false;
    if (loc && (e.work_location || '').trim() !== loc) return false;
    if (job && (e.job_title || '').trim() !== job) return false;
    if (empType && (e.emp_type || '').trim() !== empType) return false;
    return true;
  });

  hrCurrentPage = 1;
  renderHrEmployeesTable();
}

export function renderHrEmployeesTable(): void {
  const canCreate = canUserCreate('hr-employees');
  const canEdit = canUserEdit('hr-employees');
  const canDelete = canUserDelete('hr-employees');

  document.getElementById('btnHrAddEmployee')?.classList.toggle('hidden', !canCreate);
  document.getElementById('btnHrImportExcel')?.classList.toggle('hidden', !canCreate);

  const tbody = document.getElementById('hrTableBody');
  const mob = document.getElementById('hrMobileCards');
  const { pagedItems, page, startIdx } = paginateList(gHrFiltered, hrCurrentPage, hrPageSize, HR_PAGINATION_IDS);
  hrCurrentPage = page;

  if (!pagedItems.length) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="11" class="p-8 text-center text-gray-400">Không tìm thấy nhân sự nào phù hợp.</td></tr>';
    if (mob) mob.innerHTML = '<div class="p-6 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Không tìm thấy nhân sự nào phù hợp.</div>';
    return;
  }

  const getStatusPill = (status?: string) => {
    const isResigned = status === 'Đã nghỉ';
    const cls = isResigned
      ? 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
    const dot = isResigned ? 'bg-rose-500' : 'bg-emerald-500';
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap shrink-0 ${cls}"><span class="w-1.5 h-1.5 rounded-full shrink-0 ${dot}"></span><span>${escapeHtml(status || 'Đang làm việc')}</span></span>`;
  };

  if (tbody) {
    tbody.innerHTML = pagedItems.map((e, idx) => `
      <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
        <td class="p-3 text-center font-mono text-gray-400 text-xs">${startIdx + idx + 1}</td>
        <td class="p-3 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs whitespace-nowrap">${escapeHtml(e.emp_code)}</td>
        <td class="p-3">
          <div class="font-semibold text-gray-900 dark:text-white text-xs">${escapeHtml(e.full_name)}</div>
          <div class="text-[11px] text-gray-400">${escapeHtml(e.gender || '—')}${e.age ? ` • ${e.age} tuổi` : ''}</div>
        </td>
        <td class="p-3 text-xs text-gray-700 dark:text-gray-200 font-medium">${escapeHtml(e.job_title || '—')}</td>
        <td class="p-3 text-xs text-gray-700 dark:text-gray-300">${escapeHtml(e.work_location || '—')}</td>
        <td class="p-3 text-center text-xs">
          <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold ${e.emp_type === 'Partime' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'}">${escapeHtml(e.emp_type || 'Fulltime')}</span>
        </td>
        <td class="p-3 text-center font-mono text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">${fmtDateVn(e.hire_date)}</td>
        <td class="p-3 font-mono text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">${escapeHtml(e.phone || '—')}</td>
        <td class="p-3 text-xs text-gray-500 dark:text-gray-400">${escapeHtml(e.company_email || '—')}</td>
        <td class="p-3 text-center whitespace-nowrap">${getStatusPill(e.status)}</td>
        <td class="p-3 text-center whitespace-nowrap">
          <div class="inline-flex items-center gap-1 justify-center">
            ${canEdit ? `
              <button type="button" onclick="openHrEmployeeModal(${e.id})" class="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 transition-colors" title="Chỉnh sửa nhân sự">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
            ` : ''}
            ${canDelete ? `
              <button type="button" onclick="deleteHrEmployee(${e.id}, '${escapeHtml(e.full_name)}')" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 transition-colors" title="Xóa nhân sự">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            ` : ''}
            ${!canEdit && !canDelete ? '<span class="text-[11px] text-gray-400">—</span>' : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  if (mob) {
    mob.innerHTML = pagedItems.map(e => `
      <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${escapeHtml(e.emp_code)}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">${escapeHtml(e.emp_type || 'Fulltime')}</span>
            </div>
            <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${escapeHtml(e.full_name)}</h4>
            <div class="text-xs text-gray-500">${escapeHtml(e.job_title || '—')} • ${escapeHtml(e.work_location || '—')}</div>
          </div>
          ${getStatusPill(e.status)}
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
          <div>SĐT: <b class="font-mono text-gray-900 dark:text-white">${escapeHtml(e.phone || '—')}</b></div>
          <div>Vào làm: <b class="font-mono text-gray-900 dark:text-white">${fmtDateVn(e.hire_date)}</b></div>
          <div class="col-span-2 truncate">Email: <span class="text-gray-700 dark:text-gray-300">${escapeHtml(e.company_email || '—')}</span></div>
        </div>
        ${(canEdit || canDelete) ? `
          <div class="flex items-center justify-end gap-1.5 pt-1">
            ${canEdit ? `<button type="button" onclick="openHrEmployeeModal(${e.id})" class="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs">Sửa</button>` : ''}
            ${canDelete ? `<button type="button" onclick="deleteHrEmployee(${e.id}, '${escapeHtml(e.full_name)}')" class="px-3 py-1 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs">Xóa</button>` : ''}
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export async function loadHrEmployees(): Promise<void> {
  try {
    const res = await fetch('/api/hr/employees?no-cache=1');
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Không tải được danh sách nhân sự');
    gHrEmployees = json.data || [];
    updateHrKpis(gHrEmployees);
    populateHrFilters(gHrEmployees);
    filterHrEmployees();
  } catch (err: any) {
    console.error('loadHrEmployees error:', err);
    if (typeof showToast === 'function') showToast('Lỗi tải nhân sự: ' + err.message, 'error');
  }
}

export function onHrSelectCustomToggle(selectId: string, customInputId: string): void {
  const sel = document.getElementById(selectId) as HTMLSelectElement | null;
  const custom = document.getElementById(customInputId) as HTMLInputElement | null;
  if (!sel || !custom) return;
  const isOther = sel.value === '__OTHER__';
  custom.classList.toggle('hidden', !isOther);
  if (isOther) custom.focus();
}

function populateHrModalDropdowns(currentJobTitle: string, currentLocation: string): void {
  const jobSet = new Set<string>(DEFAULT_JOB_TITLES);
  gHrEmployees.forEach(e => {
    const jt = (e.job_title || '').trim();
    if (jt) jobSet.add(jt);
  });
  if (currentJobTitle && !jobSet.has(currentJobTitle)) jobSet.add(currentJobTitle);

  const jobSel = document.getElementById('hrFormJobTitle') as HTMLSelectElement | null;
  const jobCustom = document.getElementById('hrFormJobTitleCustom') as HTMLInputElement | null;
  if (jobSel) {
    const sortedJobs = Array.from(jobSet).sort((a, b) => a.localeCompare(b, 'vi'));
    jobSel.innerHTML =
      '<option value="">-- Chọn chức danh --</option>' +
      sortedJobs.map(j => `<option value="${escapeHtml(j)}">${escapeHtml(j)}</option>`).join('') +
      '<option value="__OTHER__">+ Nhập chức danh khác...</option>';
    jobSel.value = currentJobTitle || '';
  }
  if (jobCustom) {
    jobCustom.value = '';
    jobCustom.classList.add('hidden');
  }

  const locSet = new Set<string>(['HUB Đa Phúc', 'Site Julie Sandlau']);
  const sitesList = typeof window.getAppSitesList === 'function' ? window.getAppSitesList() : [];
  sitesList.forEach((s: any) => {
    if (!s || s.code === 'ALL') return;
    const rawName = String(s.ten || s.name || '').replace(/^[A-Z]\d{3}\s*-\s*/, '').trim();
    if (rawName) locSet.add(rawName);
  });
  gHrEmployees.forEach(e => {
    const wl = (e.work_location || '').trim();
    if (wl) locSet.add(wl);
  });
  if (currentLocation && !locSet.has(currentLocation)) locSet.add(currentLocation);

  const locSel = document.getElementById('hrFormWorkLocation') as HTMLSelectElement | null;
  const locCustom = document.getElementById('hrFormWorkLocationCustom') as HTMLInputElement | null;
  if (locSel) {
    const sortedLocs = Array.from(locSet).sort((a, b) => a.localeCompare(b, 'vi'));
    locSel.innerHTML =
      '<option value="">-- Chọn nơi làm việc --</option>' +
      sortedLocs.map(l => `<option value="${escapeHtml(l)}">${escapeHtml(l)}</option>`).join('') +
      '<option value="__OTHER__">+ Nhập nơi làm việc khác...</option>';
    locSel.value = currentLocation || 'HUB Đa Phúc';
  }
  if (locCustom) {
    locCustom.value = '';
    locCustom.classList.add('hidden');
  }
}

export function openHrEmployeeModal(empId?: number): void {
  const isEdit = Boolean(empId);
  if (!assertPermission('hr-employees', isEdit ? 'edit' : 'create', isEdit ? 'chỉnh sửa thông tin nhân sự' : 'thêm nhân sự mới')) return;

  const modal = document.getElementById('hrEmployeeModal');
  const titleEl = document.getElementById('hrModalTitle');
  const emp = empId ? gHrEmployees.find(e => e.id === empId) : null;

  if (titleEl) titleEl.textContent = emp ? `Cập Nhật Nhân Sự (${emp.emp_code})` : 'Thêm Nhân Sự Mới';

  const setVal = (id: string, val: any) => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    if (el) el.value = val ?? '';
  };

  setVal('hrFormId', emp ? String(emp.id) : '');
  setVal('hrFormEmpCode', emp ? emp.emp_code : '');
  setVal('hrFormFullName', emp ? emp.full_name : '');
  setVal('hrFormGender', emp ? emp.gender : 'Nữ');
  setVal('hrFormHireDate', emp ? fmtDateYmd(emp.hire_date) : new Date().toISOString().slice(0, 10));
  setVal('hrFormBirthDate', emp ? fmtDateYmd(emp.birth_date) : '');
  setVal('hrFormStatus', emp ? (emp.status || 'Đang làm việc') : 'Đang làm việc');
  setVal('hrFormEmpType', emp ? (emp.emp_type || 'Fulltime') : 'Fulltime');
  setVal('hrFormPhone', emp ? emp.phone : '');
  setVal('hrFormEmail', emp ? emp.company_email : '');
  setVal('hrFormResignDate', emp ? fmtDateYmd(emp.resign_date) : '');

  populateHrModalDropdowns((emp?.job_title || '').trim(), (emp?.work_location || '').trim());

  if (modal) modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeHrEmployeeModal(): void {
  document.getElementById('hrEmployeeModal')?.classList.add('hidden');
}

export async function saveHrEmployee(): Promise<void> {
  const getVal = (id: string) => ((document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value || '').trim();
  const idVal = getVal('hrFormId');
  const isEdit = Boolean(idVal);
  if (!assertPermission('hr-employees', isEdit ? 'edit' : 'create', isEdit ? 'chỉnh sửa thông tin nhân sự' : 'thêm nhân sự mới')) return;

  const empCode = getVal('hrFormEmpCode');
  const fullName = getVal('hrFormFullName');
  if (!empCode || !fullName) {
    if (typeof showToast === 'function') showToast('Vui lòng nhập Mã nhân viên và Họ tên!', 'warning');
    return;
  }

  const jobSelVal = getVal('hrFormJobTitle');
  const jobTitle = jobSelVal === '__OTHER__' ? getVal('hrFormJobTitleCustom') : jobSelVal;

  const locSelVal = getVal('hrFormWorkLocation');
  const workLocation = locSelVal === '__OTHER__' ? getVal('hrFormWorkLocationCustom') : locSelVal;

  const birthDate = getVal('hrFormBirthDate') || null;
  let age: number | null = null;
  if (birthDate && birthDate.length >= 4) {
    const by = parseInt(birthDate.slice(0, 4), 10);
    if (by > 1940) age = new Date().getFullYear() - by;
  }

  const payload = {
    id: idVal ? Number(idVal) : undefined,
    emp_code: empCode,
    full_name: fullName,
    job_title: jobTitle,
    gender: getVal('hrFormGender'),
    hire_date: getVal('hrFormHireDate') || null,
    birth_date: birthDate,
    age,
    status: getVal('hrFormStatus') || 'Đang làm việc',
    work_location: workLocation,
    emp_type: getVal('hrFormEmpType') || 'Fulltime',
    phone: getVal('hrFormPhone'),
    company_email: getVal('hrFormEmail'),
    resign_date: getVal('hrFormResignDate') || null
  };

  try {
    if (typeof showLoading === 'function') showLoading('Đang lưu thông tin nhân sự...');
    const res = await fetch('/api/hr/employees', {
      method: idVal ? 'PUT' : 'POST',
      headers: getHrAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Lỗi lưu nhân sự');
    if (typeof showToast === 'function') showToast(idVal ? 'Đã cập nhật nhân sự!' : 'Đã thêm nhân sự mới!', 'success');
    closeHrEmployeeModal();
    await loadHrEmployees();
  } catch (err: any) {
    if (typeof showToast === 'function') showToast('Lỗi: ' + err.message, 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export async function deleteHrEmployee(empId: number, empName: string): Promise<void> {
  if (!assertPermission('hr-employees', 'delete', 'xóa hồ sơ nhân sự')) return;

  const msg = `Bạn có chắc chắn muốn xóa nhân sự "${empName}" khỏi hệ thống? Thao tác này không thể hoàn tác.`;
  const confirmFn = window.showAppConfirmModal;
  const ok = typeof confirmFn === 'function'
    ? await confirmFn(msg, { title: 'Xác nhận xóa nhân sự', confirmText: 'Xóa nhân sự', cancelText: 'Hủy bỏ', danger: true })
    : confirm(msg);
  if (!ok) return;

  try {
    if (typeof showLoading === 'function') showLoading('Đang xóa nhân sự...');
    const res = await fetch(`/api/hr/employees?id=${empId}`, {
      method: 'DELETE',
      headers: getHrAuthHeaders()
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Lỗi xóa nhân sự');
    if (typeof showToast === 'function') showToast(`Đã xóa nhân sự "${empName}"!`, 'success');
    await loadHrEmployees();
  } catch (err: any) {
    if (typeof showToast === 'function') showToast('Lỗi xóa: ' + err.message, 'error');
  } finally {
    if (typeof hideLoading === 'function') hideLoading();
  }
}

export async function downloadHrTemplateExcel(): Promise<void> {
  const fileName = 'A.Kitchen_Mau_Import_NhanSu.xlsx';
  const headers = [
    'STT', 'MÃ NHÂN VIÊN', 'HỌ VÀ TÊN NHÂN VIÊN', 'CHỨC DANH CÔNG VIỆC', 'GIỚI TÍNH',
    'NGÀY VÀO LÀM', 'NGÀY SINH', 'TUỔI', 'TÌNH TRẠNG', 'NƠI LÀM VIỆC',
    'LOẠI NHÂN VIÊN', 'ĐIỆN THOẠI', 'EMAIL CÔNG TY', 'THỜI GIAN NGHỈ VIỆC'
  ];
  const sampleRows = [
    [1, '11303999', 'Nguyễn Văn An', 'Nhân viên Bếp chính', 'Nam', '2026-11-01', '15/05/1992', 34, 'Đang làm việc', 'HUB Đa Phúc', 'Fulltime', '0909123456', 'annv@sibafood.hr-mail.vn', ''],
    [2, '11304000', 'Trần Thị Bình', 'Nhân viên Phụ bếp', 'Nữ', '2026-11-10', '20/08/1995', 31, 'Đang làm việc', 'Site Julie Sandlau', 'Partime', '0912345678', 'binhtt@sibafood.hr-mail.vn', '']
  ];

  if (typeof ExcelJS !== 'undefined') {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Chi tiet nhan su', {
      views: [{ state: 'frozen', xSplit: 0, ySplit: 2 }]
    });
    const titleRow = ws.addRow(['MẪU IMPORT DANH SÁCH NHÂN SỰ A.KITCHEN (Giữ nguyên dòng tiêu đề số 2)']);
    ws.mergeCells('A1:N1');
    titleRow.height = 24;
    titleRow.getCell(1).font = { name: 'Aptos', size: 12, bold: true, color: { argb: 'FF1F4E79' } };
    titleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };

    const hRow = ws.addRow(headers);
    hRow.height = 24;
    hRow.eachCell((cell: any) => {
      cell.font = { name: 'Aptos', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    sampleRows.forEach(rowVals => {
      const r = ws.addRow(rowVals);
      r.eachCell((cell: any, col: number) => {
        cell.font = { name: 'Aptos', size: 11 };
        const centerCols = [1, 2, 5, 6, 7, 9, 11, 12, 14];
        const rightCols = [8];
        cell.alignment = {
          vertical: 'middle',
          horizontal: rightCols.includes(col) ? 'right' : (centerCols.includes(col) ? 'center' : 'left')
        };
      });
    });

    ws.autoFilter = { from: { row: 2, column: 1 }, to: { row: sampleRows.length + 2, column: headers.length } };
    ws.columns = [
      { width: 7 }, { width: 16 }, { width: 24 }, { width: 28 }, { width: 11 },
      { width: 15 }, { width: 14 }, { width: 8 }, { width: 16 }, { width: 24 },
      { width: 16 }, { width: 15 }, { width: 30 }, { width: 20 }
    ];

    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (typeof showToast === 'function') showToast(`Đã tải file mẫu: ${fileName}`, 'success');
    return;
  }

  if (typeof XLSX !== 'undefined') {
    const wb = XLSX.utils.book_new();
    const aoa = [['MẪU IMPORT DANH SÁCH NHÂN SỰ A.KITCHEN'], headers, ...sampleRows];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), 'Chi tiet nhan su');
    XLSX.writeFile(wb, fileName);
  }
}

export async function exportHrEmployeesExcel(): Promise<void> {
  if (!gHrFiltered.length) {
    if (typeof showToast === 'function') showToast('Không có dữ liệu nhân sự để xuất!', 'warning');
    return;
  }
  const fileName = `A.Kitchen_DanhSachNhanSu_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.xlsx`;
  if (typeof ExcelJS !== 'undefined') {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Nhan_Su', {
      views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
    });
    const headers = ['STT', 'Mã NV', 'Họ và Tên', 'Chức danh', 'Giới tính', 'Ngày vào làm', 'Ngày sinh', 'Tuổi', 'Tình trạng', 'Nơi làm việc', 'Loại NV', 'Điện thoại', 'Email công ty', 'Ngày nghỉ việc'];
    const hRow = ws.addRow(headers);
    hRow.height = 24;
    hRow.eachCell((cell: any) => {
      cell.font = { name: 'Aptos', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    gHrFiltered.forEach((e, idx) => {
      const r = ws.addRow([
        idx + 1,
        e.emp_code,
        e.full_name,
        e.job_title || '',
        e.gender || '',
        fmtDateVn(e.hire_date),
        fmtDateVn(e.birth_date),
        e.age ?? '',
        e.status || 'Đang làm việc',
        e.work_location || '',
        e.emp_type || 'Fulltime',
        e.phone || '',
        e.company_email || '',
        e.resign_date ? fmtDateVn(e.resign_date) : ''
      ]);
      r.eachCell((cell: any, col: number) => {
        cell.font = { name: 'Aptos', size: 11 };
        const centerCols = [1, 2, 5, 6, 7, 9, 11, 12, 14];
        const rightCols = [8];
        cell.alignment = {
          vertical: 'middle',
          horizontal: rightCols.includes(col) ? 'right' : (centerCols.includes(col) ? 'center' : 'left')
        };
      });
    });

    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: gHrFiltered.length + 1, column: headers.length } };
    ws.columns = [
      { width: 7 }, { width: 13 }, { width: 24 }, { width: 28 }, { width: 10 },
      { width: 14 }, { width: 14 }, { width: 8 }, { width: 16 }, { width: 24 },
      { width: 12 }, { width: 15 }, { width: 30 }, { width: 15 }
    ];

    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (typeof showToast === 'function') showToast(`Đã xuất file Excel: ${fileName}`, 'success');
    return;
  }
  if (typeof XLSX !== 'undefined') {
    const aoa = [
      ['STT', 'Mã NV', 'Họ và Tên', 'Chức danh', 'Giới tính', 'Ngày vào làm', 'Ngày sinh', 'Tuổi', 'Tình trạng', 'Nơi làm việc', 'Loại NV', 'Điện thoại', 'Email công ty', 'Ngày nghỉ việc'],
      ...gHrFiltered.map((e, i) => [i + 1, e.emp_code, e.full_name, e.job_title || '', e.gender || '', fmtDateVn(e.hire_date), fmtDateVn(e.birth_date), e.age ?? '', e.status || 'Đang làm việc', e.work_location || '', e.emp_type || 'Fulltime', e.phone || '', e.company_email || '', e.resign_date ? fmtDateVn(e.resign_date) : ''])
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), 'Nhan_Su');
    XLSX.writeFile(wb, fileName);
  }
}

export async function importHrEmployeesExcel(input: HTMLInputElement): Promise<void> {
  if (!assertPermission('hr-employees', 'create', 'import danh sách nhân sự từ Excel')) {
    if (input) input.value = '';
    return;
  }
  const file = input?.files?.[0];
  if (!file || typeof XLSX === 'undefined') return;
  try {
    if (typeof showLoading === 'function') showLoading('Đang đọc file Excel nhân sự...');
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array', cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rawRows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
    const headerIdx = rawRows.findIndex(r => r.some(c => String(c || '').toUpperCase().includes('MÃ NHÂN VIÊN')));
    if (headerIdx < 0) throw new Error('Không tìm thấy dòng tiêu đề "MÃ NHÂN VIÊN" trong file Excel');

    const toYmd = (v: any): string | null => {
      if (!v) return null;
      if (v instanceof Date && !isNaN(v.getTime())) return v.toISOString().slice(0, 10);
      const s = String(v).trim();
      const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
      if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
      return null;
    };

    const employees: any[] = [];
    for (let i = headerIdx + 1; i < rawRows.length; i++) {
      const r = rawRows[i];
      const empCode = String(r[1] || '').trim();
      const fullName = String(r[2] || '').trim();
      if (!empCode || !fullName) continue;
      const resignDate = toYmd(r[13]);
      const rawStatus = String(r[8] || '').trim();
      employees.push({
        emp_code: empCode,
        full_name: fullName,
        job_title: String(r[3] || '').trim(),
        gender: String(r[4] || '').trim(),
        hire_date: toYmd(r[5]),
        birth_date: toYmd(r[6]),
        age: r[7] ? Number(r[7]) : null,
        status: rawStatus || (resignDate ? 'Đã nghỉ' : 'Đang làm việc'),
        work_location: String(r[9] || '').trim(),
        emp_type: String(r[10] || 'Fulltime').trim(),
        phone: String(r[11] || '').trim(),
        company_email: String(r[12] || '').trim(),
        resign_date: resignDate
      });
    }
    if (!employees.length) throw new Error('Không có dòng nhân sự hợp lệ trong file');

    const res = await fetch('/api/hr/employees', {
      method: 'POST',
      headers: getHrAuthHeaders(),
      body: JSON.stringify({ employees })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Lỗi import');
    if (typeof showToast === 'function') showToast(`Đã import/cập nhật ${employees.length} nhân sự!`, 'success');
    await loadHrEmployees();
  } catch (err: any) {
    if (typeof showToast === 'function') showToast('Lỗi import Excel: ' + err.message, 'error');
  } finally {
    if (input) input.value = '';
    if (typeof hideLoading === 'function') hideLoading();
  }
}

if (typeof window !== 'undefined') {
  const w = window as any;
  w.loadHrEmployees = loadHrEmployees;
  w.filterHrEmployees = filterHrEmployees;
  w.renderHrEmployeesTable = renderHrEmployeesTable;
  w.changeHrPage = changeHrPage;
  w.changeHrPageSize = changeHrPageSize;
  w.onHrSelectCustomToggle = onHrSelectCustomToggle;
  w.openHrEmployeeModal = openHrEmployeeModal;
  w.closeHrEmployeeModal = closeHrEmployeeModal;
  w.saveHrEmployee = saveHrEmployee;
  w.deleteHrEmployee = deleteHrEmployee;
  w.downloadHrTemplateExcel = downloadHrTemplateExcel;
  w.exportHrEmployeesExcel = exportHrEmployeesExcel;
  w.importHrEmployeesExcel = importHrEmployeesExcel;
}
