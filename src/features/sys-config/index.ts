import { isMasterAccount } from '@/features/auth/constants';
import { getCurrentAppUser } from '@/features/auth/action-guards';

declare const showToast: (msg: string, type?: string) => void;
declare const lucide: any;

export interface CategoryRule {
  category: string;
  fefo_red_days: number;
  fefo_yellow_days: number;
  leadtime_days: number;
}

export interface SystemConfigData {
  rop_safety_stock: number;
  rop_daily_usage: number;
  rop_threshold_default: number;
  rop_target_stock_default: number;
  rop_calc_mode: 'fixed' | 'auto_history';
  rop_history_days: number;
  rop_peak_multiplier: number;
  leadtime_default_days: number;
  leadtime_fresh_days: number;
  leadtime_sla_target_hours: number;
  fefo_red_days: number;
  fefo_yellow_days: number;
  fefo_default_expiry_days: number;
  fefo_enforce_strict: boolean;
  count_variance_alert_pct: number;
  blind_count_default: boolean;
  daily_count_cutoff_time: string;
  allow_negative_stock: boolean;
  waste_require_image: boolean;
  waste_approval_amount_threshold: number;
  waste_approval_pct_threshold: number;
  default_page_size: number;
  category_rules_json: string;
}

export const DEFAULT_CATEGORY_RULES_UI: CategoryRule[] = [
  { category: 'Rau củ', fefo_red_days: 2, fefo_yellow_days: 5, leadtime_days: 1 },
  { category: 'Thịt cá & Hải sản', fefo_red_days: 2, fefo_yellow_days: 7, leadtime_days: 1 },
  { category: 'Gia vị & Đồ khô', fefo_red_days: 14, fefo_yellow_days: 45, leadtime_days: 2 },
  { category: 'Bao bì & Vật tư', fefo_red_days: 30, fefo_yellow_days: 90, leadtime_days: 3 }
];

export const DEFAULT_SYSTEM_CONFIG_UI: SystemConfigData = {
  rop_safety_stock: 5,
  rop_daily_usage: 10,
  rop_threshold_default: 25,
  rop_target_stock_default: 35,
  rop_calc_mode: 'fixed',
  rop_history_days: 14,
  rop_peak_multiplier: 1.0,
  leadtime_default_days: 2,
  leadtime_fresh_days: 1,
  leadtime_sla_target_hours: 24,
  fefo_red_days: 7,
  fefo_yellow_days: 30,
  fefo_default_expiry_days: 45,
  fefo_enforce_strict: true,
  count_variance_alert_pct: 5,
  blind_count_default: false,
  daily_count_cutoff_time: '22:00',
  allow_negative_stock: false,
  waste_require_image: false,
  waste_approval_amount_threshold: 500000,
  waste_approval_pct_threshold: 3,
  default_page_size: 25,
  category_rules_json: JSON.stringify(DEFAULT_CATEGORY_RULES_UI)
};

let gSystemConfigCache: SystemConfigData = { ...DEFAULT_SYSTEM_CONFIG_UI };
let gSystemConfigLoaded = false;
let gEditableCategoryRules: CategoryRule[] = [...DEFAULT_CATEGORY_RULES_UI];

export function getCachedSystemConfig(): SystemConfigData {
  return gSystemConfigCache;
}

export async function preloadSystemConfig(force = false): Promise<SystemConfigData> {
  if (gSystemConfigLoaded && !force) return gSystemConfigCache;
  try {
    const resp = await fetch('/api/system/config');
    if (resp.ok) {
      const json = await resp.json();
      if (json.success && json.data) {
        gSystemConfigCache = { ...DEFAULT_SYSTEM_CONFIG_UI, ...json.data };
        gSystemConfigLoaded = true;
        if (typeof window !== 'undefined') {
          (window as any).gSystemConfig = gSystemConfigCache;
        }
      }
    }
  } catch (err) {
    console.warn('preloadSystemConfig failed:', err);
  }
  return gSystemConfigCache;
}

function setInputVal(id: string, val: number | boolean | string): void {
  const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
  if (!el) return;
  if (el instanceof HTMLInputElement && el.type === 'checkbox') {
    el.checked = Boolean(val);
  } else {
    el.value = String(val);
  }
}

function getNumberInputVal(id: string, fallback: number): number {
  const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
  if (!el) return fallback;
  const n = Number(el.value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function getStringInputVal(id: string, fallback: string): string {
  const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
  return el && el.value ? String(el.value).trim() : fallback;
}

function getCheckboxVal(id: string, fallback: boolean): boolean {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return el ? Boolean(el.checked) : fallback;
}

function escapeAttr(val: string): string {
  return String(val || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function onRopCalcModeChange(): void {
  const mode = getStringInputVal('cfg_rop_calc_mode', 'fixed');
  const autoBox = document.getElementById('cfgRopAutoHistoryBox');
  if (autoBox) {
    autoBox.classList.toggle('hidden', mode !== 'auto_history');
  }
}

export function renderCategoryRulesTable(): void {
  const tbody = document.getElementById('cfgCategoryRulesBody');
  if (!tbody) return;
  if (!gEditableCategoryRules.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-xs text-gray-400">Chưa có quy tắc nhóm hàng nào. Nhấn "+ Thêm nhóm hàng" để tạo.</td></tr>`;
    return;
  }
  tbody.innerHTML = gEditableCategoryRules.map((r, idx) => `
    <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40">
      <td class="p-2.5">
        <input type="text" value="${escapeAttr(r.category)}" oninput="updateCategoryRuleField(${idx}, 'category', this.value)" placeholder="Tên nhóm hàng (VD: Rau củ)" class="input w-full text-xs py-1.5 px-2.5 font-sans">
      </td>
      <td class="p-2.5">
        <input type="number" min="1" step="1" value="${r.fefo_red_days}" oninput="updateCategoryRuleField(${idx}, 'fefo_red_days', this.value)" class="input w-full text-xs py-1.5 px-2 font-mono text-right">
      </td>
      <td class="p-2.5">
        <input type="number" min="1" step="1" value="${r.fefo_yellow_days}" oninput="updateCategoryRuleField(${idx}, 'fefo_yellow_days', this.value)" class="input w-full text-xs py-1.5 px-2 font-mono text-right">
      </td>
      <td class="p-2.5">
        <input type="number" min="1" step="1" value="${r.leadtime_days}" oninput="updateCategoryRuleField(${idx}, 'leadtime_days', this.value)" class="input w-full text-xs py-1.5 px-2 font-mono text-right">
      </td>
      <td class="p-2.5 text-center">
        <button type="button" onclick="removeCategoryRuleRow(${idx})" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="Xóa dòng">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    </tr>
  `).join('');

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons({ root: tbody });
  }
}

export function addCategoryRuleRow(): void {
  gEditableCategoryRules.push({
    category: '',
    fefo_red_days: 7,
    fefo_yellow_days: 30,
    leadtime_days: 2
  });
  renderCategoryRulesTable();
}

export function removeCategoryRuleRow(idx: number): void {
  gEditableCategoryRules.splice(idx, 1);
  renderCategoryRulesTable();
}

export function updateCategoryRuleField(idx: number, field: keyof CategoryRule, val: string): void {
  const row = gEditableCategoryRules[idx];
  if (!row) return;
  if (field === 'category') {
    row.category = val;
  } else {
    const n = Number(val);
    row[field] = Number.isFinite(n) && n > 0 ? n : 1;
  }
}

export async function loadSystemConfig(): Promise<void> {
  const user = getCurrentAppUser();
  const lockBanner = document.getElementById('sysConfigLockBanner');
  const formWrap = document.getElementById('sysConfigFormContainer');

  if (!user || !isMasterAccount(user)) {
    if (lockBanner) lockBanner.classList.remove('hidden');
    if (formWrap) formWrap.classList.add('hidden');
    return;
  }

  if (lockBanner) lockBanner.classList.add('hidden');
  if (formWrap) formWrap.classList.remove('hidden');

  try {
    const resp = await fetch('/api/system/config');
    const json = await resp.json();
    if (json.success && json.data) {
      const cfg: SystemConfigData = { ...DEFAULT_SYSTEM_CONFIG_UI, ...json.data };
      gSystemConfigCache = cfg;
      gSystemConfigLoaded = true;
      if (typeof window !== 'undefined') {
        (window as any).gSystemConfig = cfg;
      }

      setInputVal('cfg_rop_safety_stock', cfg.rop_safety_stock);
      setInputVal('cfg_rop_daily_usage', cfg.rop_daily_usage);
      setInputVal('cfg_rop_threshold_default', cfg.rop_threshold_default);
      setInputVal('cfg_rop_target_stock_default', cfg.rop_target_stock_default);
      setInputVal('cfg_rop_calc_mode', cfg.rop_calc_mode || 'fixed');
      setInputVal('cfg_rop_history_days', cfg.rop_history_days || 14);
      setInputVal('cfg_rop_peak_multiplier', cfg.rop_peak_multiplier || 1.0);
      onRopCalcModeChange();

      setInputVal('cfg_leadtime_default_days', cfg.leadtime_default_days);
      setInputVal('cfg_leadtime_fresh_days', cfg.leadtime_fresh_days);
      setInputVal('cfg_leadtime_sla_target_hours', cfg.leadtime_sla_target_hours);

      setInputVal('cfg_fefo_red_days', cfg.fefo_red_days);
      setInputVal('cfg_fefo_yellow_days', cfg.fefo_yellow_days);
      setInputVal('cfg_fefo_default_expiry_days', cfg.fefo_default_expiry_days);
      setInputVal('cfg_fefo_enforce_strict', cfg.fefo_enforce_strict);

      setInputVal('cfg_count_variance_alert_pct', cfg.count_variance_alert_pct);
      setInputVal('cfg_blind_count_default', cfg.blind_count_default);
      setInputVal('cfg_daily_count_cutoff_time', cfg.daily_count_cutoff_time || '22:00');
      setInputVal('cfg_allow_negative_stock', cfg.allow_negative_stock);
      setInputVal('cfg_waste_require_image', cfg.waste_require_image);
      setInputVal('cfg_waste_approval_amount_threshold', cfg.waste_approval_amount_threshold ?? 500000);
      setInputVal('cfg_waste_approval_pct_threshold', cfg.waste_approval_pct_threshold ?? 3);
      setInputVal('cfg_default_page_size', cfg.default_page_size);

      try {
        const parsedRules = JSON.parse(cfg.category_rules_json || '[]');
        gEditableCategoryRules = Array.isArray(parsedRules) ? parsedRules : [...DEFAULT_CATEGORY_RULES_UI];
      } catch {
        gEditableCategoryRules = [...DEFAULT_CATEGORY_RULES_UI];
      }
      renderCategoryRulesTable();

      const metaEl = document.getElementById('sysConfigLastUpdated');
      if (metaEl && json.meta && typeof json.meta === 'object') {
        const entries = Object.values(json.meta) as { updated_by?: string; updated_at?: string }[];
        if (entries.length > 0) {
          const latest = entries.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))[0];
          if (latest?.updated_at) {
            metaEl.textContent = `Cập nhật gần nhất: ${latest.updated_at} (${latest.updated_by || 'Master'})`;
          }
        } else {
          metaEl.textContent = 'Đang sử dụng bộ tham số mặc định hệ thống';
        }
      }
    }
  } catch (err) {
    console.error('loadSystemConfig error:', err);
    if (typeof showToast === 'function') showToast('Không thể tải cấu hình hệ thống!', 'error');
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    const root = document.getElementById('sys-config');
    if (root) lucide.createIcons({ root });
  }
}

export async function saveSystemConfig(): Promise<void> {
  const user = getCurrentAppUser();
  if (!user || !isMasterAccount(user)) {
    if (typeof showToast === 'function') showToast('Chỉ tài khoản Quản trị tối cao (trantuandai2508) mới có quyền lưu cấu hình!', 'error');
    return;
  }

  const fefoRed = getNumberInputVal('cfg_fefo_red_days', 7);
  const fefoYellow = getNumberInputVal('cfg_fefo_yellow_days', 30);
  if (fefoYellow < fefoRed) {
    if (typeof showToast === 'function') showToast('Ngưỡng cảnh báo Vàng FEFO phải lớn hơn hoặc bằng ngưỡng Đỏ!', 'error');
    return;
  }

  const ropThresh = getNumberInputVal('cfg_rop_threshold_default', 25);
  const ropTarget = getNumberInputVal('cfg_rop_target_stock_default', 35);
  if (ropTarget < ropThresh) {
    if (typeof showToast === 'function') showToast('Mức tồn mục tiêu (Target) phải lớn hơn hoặc bằng Điểm đặt hàng (ROP)!', 'error');
    return;
  }

  const cleanRules = gEditableCategoryRules
    .filter(r => String(r.category || '').trim().length > 0)
    .map(r => ({
      category: String(r.category).trim(),
      fefo_red_days: Math.max(1, Number(r.fefo_red_days) || 7),
      fefo_yellow_days: Math.max(1, Number(r.fefo_yellow_days) || 30),
      leadtime_days: Math.max(1, Number(r.leadtime_days) || 2)
    }));

  const payload: SystemConfigData = {
    rop_safety_stock: getNumberInputVal('cfg_rop_safety_stock', 5),
    rop_daily_usage: getNumberInputVal('cfg_rop_daily_usage', 10),
    rop_threshold_default: ropThresh,
    rop_target_stock_default: ropTarget,
    rop_calc_mode: getStringInputVal('cfg_rop_calc_mode', 'fixed') === 'auto_history' ? 'auto_history' : 'fixed',
    rop_history_days: Math.max(1, getNumberInputVal('cfg_rop_history_days', 14)),
    rop_peak_multiplier: Math.max(0.5, getNumberInputVal('cfg_rop_peak_multiplier', 1.0)),
    leadtime_default_days: getNumberInputVal('cfg_leadtime_default_days', 2),
    leadtime_fresh_days: getNumberInputVal('cfg_leadtime_fresh_days', 1),
    leadtime_sla_target_hours: getNumberInputVal('cfg_leadtime_sla_target_hours', 24),
    fefo_red_days: fefoRed,
    fefo_yellow_days: fefoYellow,
    fefo_default_expiry_days: getNumberInputVal('cfg_fefo_default_expiry_days', 45),
    fefo_enforce_strict: getCheckboxVal('cfg_fefo_enforce_strict', true),
    count_variance_alert_pct: getNumberInputVal('cfg_count_variance_alert_pct', 5),
    blind_count_default: getCheckboxVal('cfg_blind_count_default', false),
    daily_count_cutoff_time: getStringInputVal('cfg_daily_count_cutoff_time', '22:00'),
    allow_negative_stock: getCheckboxVal('cfg_allow_negative_stock', false),
    waste_require_image: getCheckboxVal('cfg_waste_require_image', false),
    waste_approval_amount_threshold: getNumberInputVal('cfg_waste_approval_amount_threshold', 500000),
    waste_approval_pct_threshold: getNumberInputVal('cfg_waste_approval_pct_threshold', 3),
    default_page_size: getNumberInputVal('cfg_default_page_size', 25),
    category_rules_json: JSON.stringify(cleanRules)
  };

  const btn = document.getElementById('btnSaveSystemConfig') as HTMLButtonElement | null;
  if (btn) btn.disabled = true;

  try {
    const resp = await fetch('/api/system/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': user.email || ''
      },
      body: JSON.stringify({
        requestorEmail: user.email || '',
        settings: payload
      })
    });
    const json = await resp.json();
    if (!resp.ok || !json.success) {
      if (typeof showToast === 'function') showToast(json.error || 'Lỗi lưu cấu hình hệ thống!', 'error');
      return;
    }

    gSystemConfigCache = { ...DEFAULT_SYSTEM_CONFIG_UI, ...(json.data || payload) };
    gSystemConfigLoaded = true;
    if (typeof window !== 'undefined') {
      (window as any).gSystemConfig = gSystemConfigCache;
    }

    if (typeof showToast === 'function') {
      showToast(json.message || 'Đã lưu cấu hình hệ thống và áp dụng toàn chuỗi!', 'success');
    }
    await loadSystemConfig();
  } catch (err: any) {
    if (typeof showToast === 'function') showToast('Lỗi kết nối khi lưu cấu hình: ' + (err?.message || err), 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

export async function resetSystemConfigToDefault(): Promise<void> {
  const user = getCurrentAppUser();
  if (!user || !isMasterAccount(user)) {
    if (typeof showToast === 'function') showToast('Chỉ tài khoản trantuandai2508 mới được phép khôi phục mặc định!', 'error');
    return;
  }

  try {
    const resp = await fetch('/api/system/config/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': user.email || ''
      },
      body: JSON.stringify({ requestorEmail: user.email || '' })
    });
    const json = await resp.json();
    if (!resp.ok || !json.success) {
      if (typeof showToast === 'function') showToast(json.error || 'Không thể khôi phục mặc định!', 'error');
      return;
    }
    gSystemConfigCache = { ...DEFAULT_SYSTEM_CONFIG_UI };
    gSystemConfigLoaded = true;
    if (typeof showToast === 'function') showToast('Đã khôi phục toàn bộ tham số về mặc định!', 'success');
    await loadSystemConfig();
  } catch (err: any) {
    if (typeof showToast === 'function') showToast('Lỗi kết nối: ' + (err?.message || err), 'error');
  }
}

export interface DeletedAuditRecord {
  id: number;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  doc_code: string;
  site_code: string;
  summary: string;
  old_data: string;
  created_at: string;
  is_restored?: boolean;
  restored_at?: string | null;
}

let gDeletedRecordsList: DeletedAuditRecord[] = [];

const ENTITY_LABELS: Record<string, { label: string; badge: string }> = {
  BATCH: { label: 'Lô hàng (FEFO)', badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  KITCHEN_ISSUE: { label: 'Xuất kho sử dụng', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  WASTE: { label: 'Hủy hàng & hao hụt', badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
  COUNT: { label: 'Kiểm kê hằng ngày', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  RECEIPT: { label: 'Nhập kho tại site', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  ORDER: { label: 'Đặt hàng vật tư', badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
  VOUCHER: { label: 'Chứng từ kế toán', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' }
};

export function switchSysConfigSubView(mode: 'params' | 'restore'): void {
  const paramsBox = document.getElementById('sysConfigFormContainer');
  const restoreBox = document.getElementById('sysConfigRestoreContainer');
  const headerActions = document.getElementById('sysConfigHeaderActions');
  const btnParams = document.getElementById('btnSubTabSysCfgParams');
  const btnRestore = document.getElementById('btnSubTabSysCfgRestore');

  const activeCls = 'pb-2.5 pt-1 border-b-2 border-brand-500 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center gap-2 shrink-0 transition-all';
  const inactiveCls = 'pb-2.5 pt-1 border-b-2 border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium text-xs flex items-center gap-2 shrink-0 transition-all';

  if (mode === 'restore') {
    paramsBox?.classList.add('hidden');
    restoreBox?.classList.remove('hidden');
    headerActions?.classList.add('hidden');
    if (btnParams) btnParams.className = inactiveCls;
    if (btnRestore) btnRestore.className = activeCls;
    loadDeletedRecords();
  } else {
    paramsBox?.classList.remove('hidden');
    restoreBox?.classList.add('hidden');
    headerActions?.classList.remove('hidden');
    if (btnParams) btnParams.className = activeCls;
    if (btnRestore) btnRestore.className = inactiveCls;
  }
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    const root = document.getElementById('sys-config');
    if (root) lucide.createIcons({ root });
  }
}

export async function loadDeletedRecords(): Promise<void> {
  const user = getCurrentAppUser();
  if (!user || !isMasterAccount(user)) return;

  const entityType = (document.getElementById('sysRestoreEntityFilter') as HTMLSelectElement | null)?.value || 'ALL';
  const tbody = document.getElementById('sysRestoreTableBody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-400 text-xs">Đang tải lịch sử dữ liệu đã xóa...</td></tr>`;
  }

  try {
    const resp = await fetch(`/api/system/deleted-records?entity_type=${encodeURIComponent(entityType)}`, {
      headers: { 'X-User-Email': user.email || '' }
    });
    const json = await resp.json();
    if (!resp.ok || !json.success) {
      throw new Error(json.error || 'Không thể tải danh sách');
    }
    gDeletedRecordsList = json.data || [];
    filterDeletedRecords();
  } catch (err: any) {
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-rose-500 text-xs">${escapeAttr(err?.message || 'Lỗi tải dữ liệu')}</td></tr>`;
    }
  }
}

export function filterDeletedRecords(): void {
  const q = ((document.getElementById('sysRestoreSearchInput') as HTMLInputElement | null)?.value || '').trim().toLowerCase();
  const filtered = gDeletedRecordsList.filter(r => {
    if (!q) return true;
    return (
      String(r.doc_code || '').toLowerCase().includes(q) ||
      String(r.summary || '').toLowerCase().includes(q) ||
      String(r.site_code || '').toLowerCase().includes(q) ||
      String(r.user_email || '').toLowerCase().includes(q) ||
      String(r.old_data || '').toLowerCase().includes(q)
    );
  });

  const tbody = document.getElementById('sysRestoreTableBody');
  const mob = document.getElementById('sysRestoreMobileCards');

  if (!filtered.length) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-gray-400 text-xs">Chưa có bản ghi đã xóa nào phù hợp bộ lọc.</td></tr>`;
    if (mob) mob.innerHTML = `<div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Chưa có bản ghi đã xóa nào.</div>`;
    return;
  }

  if (tbody) {
    tbody.innerHTML = filtered.map(r => {
      const meta = ENTITY_LABELS[String(r.entity_type || '').toUpperCase()] || { label: r.entity_type, badge: 'bg-gray-100 text-gray-700 border-gray-200' };
      const timeStr = r.created_at ? String(r.created_at).replace('T', ' ').slice(0, 19) : '—';
      const actionHtml = r.is_restored
        ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold"><i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i> Đã khôi phục</span>`
        : `<button type="button" onclick="restoreDeletedRecord(${r.id})" class="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Khôi phục</button>`;

      return `
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">${escapeAttr(timeStr)}</td>
          <td class="p-3 whitespace-nowrap">
            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border ${meta.badge}">${escapeAttr(meta.label)}</span>
          </td>
          <td class="p-3 font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">${escapeAttr(r.doc_code || r.entity_id || '—')}</td>
          <td class="p-3 text-center font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">${escapeAttr(r.site_code || 'ALL')}</td>
          <td class="p-3 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">${escapeAttr(r.user_email || '—')}</td>
          <td class="p-3 text-xs text-gray-800 dark:text-gray-200 min-w-[220px]">${escapeAttr(r.summary || '—')}</td>
          <td class="p-3 text-right whitespace-nowrap">${actionHtml}</td>
        </tr>
      `;
    }).join('');
  }

  if (mob) {
    mob.innerHTML = filtered.map(r => {
      const meta = ENTITY_LABELS[String(r.entity_type || '').toUpperCase()] || { label: r.entity_type, badge: 'bg-gray-100 text-gray-700 border-gray-200' };
      const timeStr = r.created_at ? String(r.created_at).replace('T', ' ').slice(0, 19) : '—';
      const actionHtml = r.is_restored
        ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold">Đã khôi phục</span>`
        : `<button type="button" onclick="restoreDeletedRecord(${r.id})" class="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-bold inline-flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Khôi phục</button>`;

      return `
        <div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 p-4 space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border ${meta.badge}">${escapeAttr(meta.label)}</span>
            <span class="font-mono text-[11px] text-gray-400">${escapeAttr(timeStr)}</span>
          </div>
          <div class="font-mono text-xs font-bold text-gray-900 dark:text-white">${escapeAttr(r.doc_code || r.entity_id || '—')} • ${escapeAttr(r.site_code || 'ALL')}</div>
          <div class="text-xs text-gray-600 dark:text-gray-300">${escapeAttr(r.summary || '—')}</div>
          <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <span class="text-[11px] text-gray-400">${escapeAttr(r.user_email || '—')}</span>
            ${actionHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    const root = document.getElementById('sysConfigRestoreContainer');
    if (root) lucide.createIcons({ root });
  }
}

export async function restoreDeletedRecord(auditLogId: number): Promise<void> {
  const user = getCurrentAppUser();
  if (!user || !isMasterAccount(user)) {
    if (typeof showToast === 'function') showToast('Chỉ tài khoản trantuandai2508 được phép khôi phục dữ liệu!', 'error');
    return;
  }

  try {
    const resp = await fetch('/api/system/restore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': user.email || ''
      },
      body: JSON.stringify({ requestorEmail: user.email || '', auditLogId })
    });
    const json = await resp.json();
    if (!resp.ok || !json.success) {
      if (typeof showToast === 'function') showToast(json.error || 'Khôi phục thất bại!', 'error');
      return;
    }
    if (typeof showToast === 'function') showToast(json.message || 'Khôi phục dữ liệu thành công!', 'success');
    await loadDeletedRecords();
  } catch (err: any) {
    if (typeof showToast === 'function') showToast('Lỗi kết nối khi khôi phục: ' + (err?.message || err), 'error');
  }
}

if (typeof window !== 'undefined') {
  const w = window as any;
  w.loadSystemConfig = loadSystemConfig;
  w.saveSystemConfig = saveSystemConfig;
  w.resetSystemConfigToDefault = resetSystemConfigToDefault;
  w.preloadSystemConfig = preloadSystemConfig;
  w.getCachedSystemConfig = getCachedSystemConfig;
  w.onRopCalcModeChange = onRopCalcModeChange;
  w.addCategoryRuleRow = addCategoryRuleRow;
  w.removeCategoryRuleRow = removeCategoryRuleRow;
  w.updateCategoryRuleField = updateCategoryRuleField;
  w.switchSysConfigSubView = switchSysConfigSubView;
  w.loadDeletedRecords = loadDeletedRecords;
  w.filterDeletedRecords = filterDeletedRecords;
  w.restoreDeletedRecord = restoreDeletedRecord;
}
