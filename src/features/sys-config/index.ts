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
}
