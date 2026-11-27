import db from './db/index.js';

// ============================================================================
// A.KITCHEN ENTERPRISE PORTAL BACKEND (CLOUDFLARE WORKER + D1 + POSTGRESQL)
// ============================================================================

async function sha256(str) {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hashBuf = await crypto.subtle.digest('SHA-256', data);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
}

function formatDate(date) {
  const d = new Date(date);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function repairAtobMojibake(str) {
  if (!str || typeof str !== 'string') return str;
  let isAllLatin1 = true;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      isAllLatin1 = false;
      break;
    }
  }
  if (isAllLatin1) {
    try {
      const bytes = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
      }
      const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      if (decoded && decoded !== str) return decoded;
    } catch (e) {}
  }
  return str;
}

function generateCode(prefix, site) {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  let siteCode = 'SITE';
  if (site) {
    const m = site.match(/^[A-Za-z0-9]+/);
    if (m) siteCode = m[0];
  }
  return `${prefix}-${ts}-${siteCode}`;
}

function extractSiteCode(site) {
  if (!site) return '';
  const str = String(site).trim();
  const codeMatch = str.match(/\b([KD][0-9]{3}|R[0-9]{3})\b/i);
  if (codeMatch) return codeMatch[1].toUpperCase();
  const m = str.match(/^[A-Za-z0-9]+/);
  return m ? m[0].toUpperCase() : str;
}

function normalizeMonth(thang) {
  if (!thang) return '';
  const s = String(thang).trim();
  if (s.includes('/')) {
    const p = s.split('/');
    if (p.length === 2) return `${p[1]}-${p[0]}`; // MM/YYYY -> YYYY-MM
  }
  return s;
}

function getMonthRange(yearMonth) {
  if (!yearMonth || !yearMonth.includes('-')) {
    return { start: '1970-01-01', end: '2099-12-31' };
  }
  const parts = yearMonth.trim().split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(y) || isNaN(m)) {
    return { start: `${yearMonth}-01`, end: `${yearMonth}-28` };
  }
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return {
    start: `${parts[0]}-${String(m).padStart(2, '0')}-01`,
    end: `${parts[0]}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  };
}


const FEATURE_NAME_TO_CODE = {
  'fnb-chain': 'fnb-chain',
  'Toàn Chuỗi & P&L 14 Điểm Bán': 'fnb-chain',
  'fnb-pl': 'fnb-pl',
  'Báo Cáo Lợi Nhuận P&L Chi Tiết': 'fnb-pl',
  'fnb-pos': 'fnb-pos',
  'Doanh Thu POS Thời Gian Thực': 'fnb-pos',
  'fnb-stock': 'fnb-stock',
  'Tồn Kho Điểm Bán': 'fnb-stock',
  'Tồn Kho & Điểm Bán': 'fnb-stock',
  'fnb-counts': 'fnb-counts',
  'Kiểm Kê Điểm Bán': 'fnb-counts',
  'Kiểm kê': 'fnb-counts',
  'fnb-receipts': 'fnb-receipts',
  'Nhập kho tại site': 'fnb-receipts',
  'Quản Lý Nhập Kho Tại Site': 'fnb-receipts',
  'Quản Lý Nhập Hàng Điểm Bán': 'fnb-receipts',
  'fnb-kitchen-issue': 'fnb-kitchen-issue',
  'Xuất Kho Sử Dụng': 'fnb-kitchen-issue',
  'fnb-waste': 'fnb-waste',
  'Biên Bản Hủy Hàng & Hao Hụt': 'fnb-waste',
  'wh-dashboard': 'wh-dashboard',
  'Kho Tổng WMS': 'wh-dashboard',
  'wh-stock': 'wh-stock',
  'Tồn Kho & FEFO Kho Tổng': 'wh-stock',
  'wh-reorder': 'wh-reorder',
  'Cảnh Báo Điểm Đặt Hàng (ROP)': 'wh-reorder',
  'wh-leadtime': 'wh-leadtime',
  'Lead Time Nhà Cung Cấp': 'wh-leadtime',
  'wh-posap': 'wh-posap',
  'Đơn Hàng SAP PO': 'wh-posap',
  'portal-voucher': 'portal-voucher',
  'Chứng Từ Thu Chi & Hóa Đơn': 'portal-voucher',
  'portal-search': 'portal-search',
  'Tra Cứu Báo Cáo Chuyên Sâu': 'portal-search',
  'portal-order': 'portal-order',
  'Đặt Hàng Kho Tổng': 'portal-order',
  'Đặt Hàng Nội Bộ': 'portal-order',
  'portal-history': 'portal-history',
  'Lịch Sử Nhập Xuất Kho Tổng': 'portal-history',
  'portal-baocao': 'portal-baocao',
  'Báo Cáo Suất Ăn Hằng Ngày': 'portal-baocao',
  'Báo Cáo Suất Ăn & Vận Hành': 'portal-baocao',
  'portal-kiemke': 'portal-kiemke',
  'Kiểm Kê Kho Tổng': 'portal-kiemke',
  'fnb-sites': 'fnb-sites',
  'Danh Mục 14 Điểm Bán & Mã SAP': 'fnb-sites',
  'user-matrix': 'user-matrix',
  'Quản Lý User & Phân Quyền': 'user-matrix'
};

async function ensureRolePermissions(env) {
  try {
    const essentialKhoPerms = [
      ['KHO_TRUONG', 'portal-kiemke', true, true, true, true],
      ['KHO_TRUONG', 'fnb-counts', true, true, true, true],
      ['KHO_TRUONG', 'portal-baocao', true, true, true, false],
      ['KHO_TRUONG', 'fnb-receipts', true, true, true, true]
    ];
    for (const [r, f, v, c, e, d] of essentialKhoPerms) {
      const exists = await db.queryOne(env, `SELECT id FROM role_permissions WHERE role_code = ? AND feature_code = ? LIMIT 1`, [r, f]);
      if (!exists) {
        await db.exec(env, `INSERT INTO role_permissions (role_code, feature_code, can_view, can_create, can_edit, can_delete) VALUES (?, ?, ?, ?, ?, ?)`, [r, f, v, c, e, d]);
      }
    }
  } catch (err) {
    console.error('ensureRolePermissions notice:', err);
  }
}


async function autoCleanDemoData(env) {
  try {
    // 1. Xóa các tài khoản demo fake trong app_users
    await db.exec(env, `
      DELETE FROM app_users 
      WHERE email LIKE '%@sibafood.vn' 
         OR email = 'admin@sibafood.vn' 
         OR email LIKE '%test%'
    `).catch(() => {});

    // 2. Xóa phân quyền và yêu cầu cấp quyền của user demo
    await db.exec(env, `
      DELETE FROM user_permissions 
      WHERE user_email LIKE '%@sibafood.vn' 
         OR user_email LIKE '%test%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM access_requests 
      WHERE user_email LIKE '%@sibafood.vn' 
         OR user_email LIKE '%test%'
    `).catch(() => {});

    // 3. Xóa dữ liệu seed demo mock ban đầu
    await db.exec(env, `
      DELETE FROM purchase_orders 
      WHERE id LIKE 'po_%' OR po_number LIKE 'PO #%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM purchase_order_items 
      WHERE po_id LIKE 'po_%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM vouchers 
      WHERE id LIKE 'vc_%' OR voucher_code LIKE 'CT-202611-%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM inventory_batches 
      WHERE id LIKE 'bat_%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM stock_audits 
      WHERE id LIKE 'sa_%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM branches 
      WHERE id IN ('b_q1', 'b_q7', 'b_td')
    `).catch(() => {});

    await ensureBranchesSynced(env);

    await db.exec(env, `
      DELETE FROM items 
      WHERE sku IN ('GV-BBQ-01', 'GV-SWCH-02', 'GV-MUSH-09', 'GV-PEP-01', 'GV-SUG-05', 'GV-OYST-04', 'GV-OYST-08', 'GV-FSH-01', 'VT-GLV-01', 'VT-WRP-02', 'CC-KNF-04')
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM daily_catering_reports
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM don_hang 
      WHERE ordered_by LIKE '%test%' OR ordered_by LIKE '%demo%' OR ordered_by LIKE '%sibafood.vn%'
    `).catch(() => {});

    // 4. Xóa các mã hàng test (HB%, VT%, TH%,...) và phiếu kiểm kê/hủy/nhập demo
    await db.exec(env, `
      DELETE FROM chung_tu_file 
      WHERE voucher_code IN ('CT-20261117-012453-K001', 'CT-20261117-012625-K001')
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM chung_tu 
      WHERE voucher_code IN ('CT-20261117-012453-K001', 'CT-20261117-012625-K001')
         OR supplier_name ILIKE '%TEST%' 
         OR note ILIKE '%TEST%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM fnb_stock_count_lines 
      WHERE item_code ~ '^[A-Z]{2}-\\d+' OR item_code ILIKE '%TEST%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM fnb_stock_counts 
      WHERE id IN ('1', '2', '3') OR count_code ILIKE '%TEST%' OR notes ILIKE '%TEST%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM fnb_stock_waste_lines 
      WHERE item_code ~ '^[A-Z]{2}-\\d+' OR item_code ILIKE '%TEST%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM fnb_stock_wastes 
      WHERE id IN ('1', '2', '3') OR waste_code ILIKE '%TEST%' OR notes ILIKE '%TEST%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM fnb_stock_receipt_lines 
      WHERE item_code ~ '^[A-Z]{2}-\\d+' OR item_code ILIKE '%TEST%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM fnb_stock_receipts 
      WHERE id IN ('1', '2', '3', '4') OR receipt_code ILIKE '%TEST%' OR supplier ILIKE '%TEST%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM fnb_stock_balances 
      WHERE item_code ~ '^[A-Z]{2}-\\d+' OR item_code ILIKE '%TEST%'
    `).catch(() => {});

    await db.exec(env, `
      DELETE FROM fnb_stock_items 
      WHERE code ~ '^[A-Z]{2}-\\d+' OR code ILIKE '%TEST%' OR name ILIKE '%TEST%'
    `).catch(() => {});
  } catch (err) {
    console.error('autoCleanDemoData error:', err);
  }
}


async function ensureBranchesSynced(env) {
  try {
    // 1. Đồng bộ các điểm bán từ master sites sang branches nếu còn thiếu
    await db.exec(env, {
      d1: `
        INSERT INTO branches (id, code, name, address, phone, is_active)
        SELECT LOWER(site_code) as id, site_code as code, COALESCE(site_name, name) as name, 'Hệ thống căn tin Tân Long Group' as address, '0903.000.xxx' as phone, 1 as is_active
        FROM sites
        WHERE site_code NOT IN (SELECT code FROM branches)
        ON CONFLICT (id) DO NOTHING
      `,
      pg: `
        INSERT INTO branches (id, code, name, address, phone, is_active)
        SELECT LOWER(site_code) as id, site_code as code, COALESCE(site_name, name) as name, 'Hệ thống căn tin Tân Long Group' as address, '0903.000.xxx' as phone, true as is_active
        FROM sites
        WHERE site_code NOT IN (SELECT code FROM branches)
        ON CONFLICT (id) DO NOTHING
      `
    }).catch(() => {});

    // 2. Đảm bảo K505 luôn có mặt và active trong branches
    await db.exec(env, {
      d1: `
        INSERT INTO branches (id, code, name, address, phone, is_active)
        VALUES ('k505', 'K505', 'K505 - MB A.Kitchen - Hub Đa Phúc', 'Hệ thống căn tin Tân Long Group - Hub Đa Phúc', '0903.000.505', 1)
        ON CONFLICT (id) DO UPDATE SET
          code = excluded.code,
          name = excluded.name,
          address = excluded.address,
          phone = excluded.phone,
          is_active = excluded.is_active
      `,
      pg: `
        INSERT INTO branches (id, code, name, address, phone, is_active)
        VALUES ('k505', 'K505', 'K505 - MB A.Kitchen - Hub Đa Phúc', 'Hệ thống căn tin Tân Long Group - Hub Đa Phúc', '0903.000.505', true)
        ON CONFLICT (id) DO UPDATE SET
          code = excluded.code,
          name = excluded.name,
          address = excluded.address,
          phone = excluded.phone,
          is_active = excluded.is_active
      `
    }).catch(() => {});
  } catch (err) {
    console.error('ensureBranchesSynced notice:', err);
  }
}

async function ensureUserPermissionsTable(env) {
  if (db.isPg(env)) return;
  try {
    await db.exec(env, `
      CREATE TABLE IF NOT EXISTS user_permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        feature_code TEXT NOT NULL,
        can_view INTEGER DEFAULT 1,
        can_create INTEGER DEFAULT 0,
        can_edit INTEGER DEFAULT 0,
        can_delete INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_email, feature_code)
      )
    `);
    await db.exec(env, `CREATE INDEX IF NOT EXISTS idx_user_perms_email ON user_permissions(user_email)`).catch(() => {});
  } catch (err) {
    console.error('ensureUserPermissionsTable notice:', err);
  }
}

let _tabVisEnsured = false;
async function ensureSystemTabVisibilityTable(env) {
  if (_tabVisEnsured) return;
  const isPostgres = db.isPg(env);
  const timeType = isPostgres ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 'DATETIME DEFAULT CURRENT_TIMESTAMP';
  try {
    await db.exec(env, `
      CREATE TABLE IF NOT EXISTS system_tab_visibility (
        tab_id TEXT PRIMARY KEY,
        is_hidden INTEGER DEFAULT 0,
        updated_by TEXT,
        updated_at ${timeType}
      )
    `);
    await db.exec(env, `
      CREATE TABLE IF NOT EXISTS system_tab_order (
        id TEXT PRIMARY KEY,
        structure_json TEXT,
        updated_by TEXT,
        updated_at ${timeType}
      )
    `);
    _tabVisEnsured = true;
  } catch (err) {
    console.error('ensureSystemTabVisibilityTable error:', err);
  }
}

const DEFAULT_CATEGORY_RULES = [
  { category: 'Rau củ', rop_safety_stock: 5, rop_daily_usage: 15, rop_threshold: 20, rop_target_stock: 35, leadtime_days: 1, sla_target_hours: 24, fefo_red_days: 2, fefo_yellow_days: 5 },
  { category: 'Thịt cá & Hải sản', rop_safety_stock: 5, rop_daily_usage: 12, rop_threshold: 17, rop_target_stock: 30, leadtime_days: 1, sla_target_hours: 24, fefo_red_days: 2, fefo_yellow_days: 7 },
  { category: 'Gia vị & Đồ khô', rop_safety_stock: 8, rop_daily_usage: 5, rop_threshold: 18, rop_target_stock: 30, leadtime_days: 2, sla_target_hours: 48, fefo_red_days: 14, fefo_yellow_days: 45 },
  { category: 'Bao bì & Vật tư', rop_safety_stock: 10, rop_daily_usage: 8, rop_threshold: 34, rop_target_stock: 50, leadtime_days: 3, sla_target_hours: 72, fefo_red_days: 30, fefo_yellow_days: 90 }
];

const DEFAULT_SYSTEM_CONFIG = {
  // 1. Cảnh báo Tồn kho & Điểm đặt hàng (ROP)
  rop_safety_stock: 5.0,
  rop_daily_usage: 10.0,
  rop_threshold_default: 25.0,
  rop_target_stock_default: 35.0,
  rop_calc_mode: 'fixed', // 'fixed' | 'auto_history'
  rop_history_days: 14,
  rop_peak_multiplier: 1.0,
  // 2. Leadtime & SLA Nhà cung cấp
  leadtime_default_days: 2,
  leadtime_fresh_days: 1,
  leadtime_sla_target_hours: 24,
  // 3. Hạn dùng & Xuất kho FEFO
  fefo_red_days: 7,
  fefo_yellow_days: 30,
  fefo_default_expiry_days: 45,
  fefo_enforce_strict: true,
  // 4. Kiểm kê, Hủy hàng & Hiển thị
  count_variance_alert_pct: 5,
  blind_count_default: false,
  daily_count_cutoff_time: '22:00',
  allow_negative_stock: false,
  waste_require_image: false,
  waste_approval_amount_threshold: 500000,
  waste_approval_pct_threshold: 3,
  default_page_size: 25,
  // 5. Nguồn dữ liệu Thẻ kho & Chi tiết mã hàng
  history_src_receipts: true,
  history_src_wastes: true,
  history_src_kitchen_issues: true,
  history_src_sap_mb51: true,
  // 6. Quy tắc riêng theo Nhóm hàng
  category_rules_json: JSON.stringify(DEFAULT_CATEGORY_RULES)
};

function getCategoryRules(cfg) {
  try {
    const raw = cfg?.category_rules_json;
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(arr)) return arr;
  } catch (e) {}
  return DEFAULT_CATEGORY_RULES;
}

function matchCategoryRule(categoryName, rules) {
  if (!categoryName || !Array.isArray(rules) || !rules.length) return null;
  const cat = String(categoryName).toLowerCase().trim();
  return rules.find(r => {
    const rc = String(r?.category || '').toLowerCase().trim();
    return rc && (cat.includes(rc) || rc.includes(cat));
  }) || null;
}

let _systemSettingsEnsured = false;
let _systemConfigCache = null;
let _systemConfigCacheAt = 0;

function invalidateSystemConfigCache() {
  _systemConfigCache = null;
  _systemConfigCacheAt = 0;
}

function resolveDateRange(searchParams, defaultMonths = 2) {
  const s = (searchParams.get('start_date') || '').trim().slice(0, 10);
  const e = (searchParams.get('end_date') || '').trim().slice(0, 10);
  if (s && e && /^\d{4}-\d{2}-\d{2}$/.test(s) && /^\d{4}-\d{2}-\d{2}$/.test(e)) {
    return { startDate: s, endDate: e };
  }
  const end = new Date();
  const start = new Date(end.getFullYear(), end.getMonth() - defaultMonths, end.getDate());
  const fmt = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  return { startDate: fmt(start), endDate: fmt(end) };
}

async function ensureSystemSettingsTable(env) {
  if (_systemSettingsEnsured) return;
  const isPostgres = db.isPg(env);
  const timeType = isPostgres ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 'DATETIME DEFAULT CURRENT_TIMESTAMP';
  try {
    await db.exec(env, `
      CREATE TABLE IF NOT EXISTS system_settings (
        setting_key TEXT PRIMARY KEY,
        setting_value TEXT NOT NULL,
        value_type TEXT DEFAULT 'number',
        updated_by TEXT,
        updated_at ${timeType}
      )
    `);
    _systemSettingsEnsured = true;
  } catch (err) {
    console.error('ensureSystemSettingsTable error:', err);
  }
}

function parseSettingValue(raw, defaultVal) {
  if (typeof defaultVal === 'boolean') {
    if (typeof raw === 'boolean') return raw;
    return String(raw).toLowerCase() === 'true' || raw === '1' || raw === 1;
  }
  if (typeof defaultVal === 'number') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : defaultVal;
  }
  return raw !== undefined && raw !== null ? String(raw) : defaultVal;
}

async function getSystemConfig(env) {
  const now = Date.now();
  if (_systemConfigCache && (now - _systemConfigCacheAt) < 30000) {
    return _systemConfigCache;
  }
  const cfg = { ...DEFAULT_SYSTEM_CONFIG };
  try {
    await ensureSystemSettingsTable(env);
    const { rows } = await db.query(env, `SELECT setting_key, setting_value FROM system_settings`).catch(() => ({ rows: [] }));
    for (const r of (rows || [])) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_SYSTEM_CONFIG, r.setting_key)) {
        cfg[r.setting_key] = parseSettingValue(r.setting_value, DEFAULT_SYSTEM_CONFIG[r.setting_key]);
      }
    }
  } catch (err) {
    console.warn('getSystemConfig fallback to defaults:', err?.message || err);
  }
  _systemConfigCache = cfg;
  _systemConfigCacheAt = now;
  return cfg;
}


const ALL_SYSTEM_FEATURES = [
  'fnb-chain', 'fnb-pl', 'fnb-pos', 'fnb-stock', 'fnb-counts', 'fnb-receipts', 'fnb-kitchen-issue', 'fnb-waste',
  'wh-dashboard', 'wh-stock', 'wh-reorder', 'wh-leadtime', 'wh-posap',
  'portal-voucher', 'portal-search', 'portal-order', 'portal-history', 'portal-baocao', 'portal-kiemke',
  'fnb-sites', 'hr-employees', 'user-matrix'
];

async function buildUserPermissions(env, user) {
  const permissions = {};

  // NẾU TÀI KHOẢN BỊ KHÓA -> TẤT CẢ QUYỀN ĐỀU BỊ CẮT TUYỆT ĐỐI
  if (user.status === 'LOCKED') {
    ALL_SYSTEM_FEATURES.forEach(f => {
      permissions[f] = { canView: false, canCreate: false, canEdit: false, canDelete: false, isRevoked: true };
    });
    return permissions;
  }

  // 1. Khởi tạo quyền mặc định theo vai trò (Role Defaults)
  if (user.role_code === 'ADMIN') {
    ALL_SYSTEM_FEATURES.forEach(f => {
      permissions[f] = { canView: true, canCreate: true, canEdit: true, canDelete: true };
    });
  } else {
    // Với các vai trò khác, khởi tạo mặc định tất cả canView = false
    ALL_SYSTEM_FEATURES.forEach(f => {
      permissions[f] = { canView: false, canCreate: false, canEdit: false, canDelete: false };
    });

    const { rows: permRows } = await db.query(env, `
      SELECT feature_code, can_view, can_create, can_edit, can_delete
      FROM role_permissions
      WHERE role_code = ?
    `, [user.role_code]).catch(() => ({ rows: [] }));

    (permRows || []).forEach(p => {
      permissions[p.feature_code] = {
        canView: p.can_view === 1 || p.can_view === true,
        canCreate: p.can_create === 1 || p.can_create === true,
        canEdit: p.can_edit === 1 || p.can_edit === true,
        canDelete: p.can_delete === 1 || p.can_delete === true
      };
    });

    // Quyền cơ bản nếu chưa có trong role_permissions
    if (user.role_code === 'KHO_TRUONG') {
      ['fnb-stock', 'fnb-counts', 'fnb-receipts', 'fnb-kitchen-issue', 'fnb-sites', 'wh-dashboard', 'wh-stock', 'wh-reorder', 'wh-leadtime', 'wh-posap', 'portal-kiemke', 'portal-history', 'portal-order', 'portal-baocao'].forEach(f => {
        if (!permissions[f] || !permissions[f].canView) {
          permissions[f] = { canView: true, canCreate: true, canEdit: true, canDelete: false };
        }
      });
    } else if (user.role_code === 'BEP_TRUONG') {
      ['fnb-stock', 'fnb-counts', 'fnb-receipts', 'fnb-kitchen-issue', 'fnb-waste', 'fnb-sites', 'portal-baocao', 'portal-order', 'portal-kiemke', 'portal-history'].forEach(f => {
        if (!permissions[f] || !permissions[f].canView) {
          permissions[f] = { canView: true, canCreate: true, canEdit: true, canDelete: false };
        }
      });
    } else if (user.role_code === 'KE_TOAN') {
      ['fnb-stock', 'fnb-sites', 'portal-baocao', 'portal-voucher', 'portal-search'].forEach(f => {
        if (!permissions[f] || !permissions[f].canView) {
          permissions[f] = { canView: true, canCreate: true, canEdit: true, canDelete: false };
        }
      });
    } else if (user.role_code === 'NHAN_VIEN') {
      let hasCustomDefault = false;
      try {
        await ensureSystemSettingsTable(env);
        const defRow = await db.queryOne(env, `SELECT setting_value FROM system_settings WHERE setting_key = 'new_user_default_permissions' LIMIT 1`).catch(() => null);
        if (defRow && defRow.setting_value) {
          const parsed = JSON.parse(defRow.setting_value);
          if (parsed && typeof parsed === 'object') {
            hasCustomDefault = true;
            ALL_SYSTEM_FEATURES.forEach(f => {
              const p = parsed[f];
              if (p) {
                permissions[f] = {
                  canView: Boolean(p.canView),
                  canCreate: Boolean(p.canCreate),
                  canEdit: Boolean(p.canEdit),
                  canDelete: Boolean(p.canDelete)
                };
              }
            });
          }
        }
      } catch (_) {}

      if (!hasCustomDefault) {
        ['fnb-stock', 'fnb-counts', 'fnb-kitchen-issue', 'portal-baocao', 'portal-order'].forEach(f => {
          if (!permissions[f] || !permissions[f].canView) {
            permissions[f] = { canView: true, canCreate: true, canEdit: true, canDelete: false };
          }
        });
      }
    }
  }

  // 2. Cộng dồn quyền nếu có yêu cầu truy cập được duyệt (access_requests)
  if (user.email) {
    const { rows: approvedRequests } = await db.query(env, `
      SELECT requested_role, requested_feature
      FROM access_requests
      WHERE user_email = ? AND status = 'APPROVED'
    `, [user.email]);

    for (const req of (approvedRequests || [])) {
      if (req.requested_role && req.requested_role !== user.role_code) {
        const { rows: rolePerms } = await db.query(env, `
          SELECT feature_code, can_view, can_create, can_edit, can_delete
          FROM role_permissions
          WHERE role_code = ?
        `, [req.requested_role]);

        (rolePerms || []).forEach(p => {
          const cv = p.can_view === 1 || p.can_view === true;
          const cc = p.can_create === 1 || p.can_create === true;
          const ce = p.can_edit === 1 || p.can_edit === true;
          const cd = p.can_delete === 1 || p.can_delete === true;

          if (!permissions[p.feature_code]) {
            permissions[p.feature_code] = { canView: cv, canCreate: cc, canEdit: ce, canDelete: cd };
          } else {
            permissions[p.feature_code].canView = permissions[p.feature_code].canView || cv;
            permissions[p.feature_code].canCreate = permissions[p.feature_code].canCreate || cc;
            permissions[p.feature_code].canEdit = permissions[p.feature_code].canEdit || ce;
            permissions[p.feature_code].canDelete = permissions[p.feature_code].canDelete || cd;
          }
        });
      }

      if (req.requested_feature) {
        const featureCode = FEATURE_NAME_TO_CODE[req.requested_feature] || req.requested_feature;
        if (featureCode && permissions[featureCode]) {
          permissions[featureCode].canView = true;
          permissions[featureCode].canCreate = true;
          permissions[featureCode].canEdit = true;
        }
      }
    }
  }

  // 3. ÁP DỤNG MA TRẬN PHÂN QUYỀN TÙY CHỈNH CHO TỪNG USER (Cấp quyền hoặc Cắt quyền)
  // ĐÂY LÀ QUYỀN TỐI CAO ĐÈ LÊN MỌI VAI TRÒ MẶC ĐỊNH
  if (user.email) {
    try {
      const { rows: customPerms } = await db.query(env, `
        SELECT feature_code, can_view, can_create, can_edit, can_delete
        FROM user_permissions
        WHERE user_email = ?
      `, [user.email]).catch(() => ({ rows: [] }));

      (customPerms || []).forEach(cp => {
        const isGranted = cp.can_view === 1 || cp.can_view === true;
        const isRevoked = cp.can_view === 0 || cp.can_view === false;

        if (isRevoked) {
          // CẮT / KHÓA QUYỀN TUYỆT ĐỐI (Dù vai trò là ADMIN hay KHO_TRUONG đều bị khóa)
          permissions[cp.feature_code] = {
            canView: false,
            canCreate: false,
            canEdit: false,
            canDelete: false,
            isRevoked: true
          };
        } else if (isGranted) {
          // CẤP QUYỀN RIÊNG BIỆT
          permissions[cp.feature_code] = {
            canView: true,
            canCreate: cp.can_create === 1 || cp.can_create === true,
            canEdit: cp.can_edit === 1 || cp.can_edit === true,
            canDelete: cp.can_delete === 1 || cp.can_delete === true,
            isCustom: true
          };
        }
      });
    } catch (err) {
      console.error('Error applying user_permissions:', err);
    }
  }

  // 4. Bảo vệ an toàn: Owner hệ thống luôn có quyền quản lý phân quyền (user-matrix) khi không bị khóa
  if (user.email === 'trantuandai2508@gmail.com' && user.status !== 'LOCKED') {
    permissions['user-matrix'] = { canView: true, canCreate: true, canEdit: true, canDelete: true };
  }

  // 5. CƠ CHẾ ẨN / HIỆN TAB TOÀN HỆ THỐNG (DO RIÊNG TÀI KHOẢN trantuandai2508 CẤU HÌNH)
  // NẾU TAB BỊ ẨN -> KHÔNG MỘT USER NÀO XEM ĐƯỢC KỂ CẢ ADMIN VÀ MASTER USER KHI DUYỆT GIAO DIỆN
  // CHỈ RIÊNG TÀI KHOẢN trantuandai2508 MỚI ĐƯỢC PHÉP TRUY CẬP VÀO MODAL CẤU HÌNH ĐỂ MỞ LẠI
  try {
    const { rows: tabRows } = await db.query(env, `SELECT tab_id, is_hidden FROM system_tab_visibility`).catch(() => ({ rows: [] }));
    const hiddenTabRows = (tabRows || []).filter(r => r.is_hidden === 1 || r.is_hidden === true || r.is_hidden === '1');
    if (hiddenTabRows && hiddenTabRows.length > 0) {
      hiddenTabRows.forEach(row => {
        const tId = row.tab_id;
        // Bất kỳ người dùng nào (kể cả ADMIN và Master User khi duyệt webapp) đều bị ẩn tab
        permissions[tId] = {
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
          isRevoked: true,
          isGloballyHidden: true
        };
      });
    }
  } catch (err) {
    console.error('Error applying system_tab_visibility in buildUserPermissions:', err);
  }

  return permissions;
}

async function getCallerPermissions(env, request) {
  try {
    const callerEmail = (request.headers.get('x-user-email') || '').toLowerCase().trim();
    if (!callerEmail) return null;
    const isMaster = callerEmail === 'trantuandai2508@gmail.com' || callerEmail.includes('trantuandai2508');
    let user = await db.queryOne(env, `SELECT * FROM app_users WHERE email = ? LIMIT 1`, [callerEmail]);
    if (!user && isMaster) {
      user = { id: 1, email: callerEmail, full_name: 'Trần Tuấn Đại', role_code: 'ADMIN', status: 'ACTIVE' };
    }
    if (!user) {
      return { user: { email: callerEmail, role_code: 'UNKNOWN', status: 'LOCKED' }, permissions: {}, isMaster: false };
    }
    const permissions = await buildUserPermissions(env, user);
    return { user, permissions, isMaster };
  } catch (e) {
    console.error('getCallerPermissions error:', e);
    return null;
  }
}



const MASTER_14_SITES_FALLBACK = [
  { code: 'K001', name: 'K001 - MN Bếp Ăn Đại Học Hùng Vương', region: 'Miền Nam', budget: 1000000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 },
  { code: 'K002', name: 'K002 - Bệnh viện Đại Học Quốc Tế Hồng Bàng', region: 'Miền Nam', budget: 1000000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 },
  { code: 'K003', name: 'K003 - A.Kitchen - Miền Nam', region: 'Miền Nam', budget: 1000000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 },
  { code: 'K004', name: 'K004 - MN A.Kitchen - Thuận An', region: 'Miền Nam', budget: 7400000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 },
  { code: 'K005', name: 'K005 - MN A.Kitchen - Hub Thuận An', region: 'Miền Nam', budget: 1000000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 },
  { code: 'K006', name: 'K006 - MN A.Kitchen - PTNT Quảng Trực', region: 'Miền Nam', budget: 1000000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 },
  { code: 'K500', name: 'K500 - MB A Kitchen Hòa Bình', region: 'Miền Bắc', budget: 1000000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 },
  { code: 'K501', name: 'K501 - Công ty TNHH Julie sandlau', region: 'Miền Bắc', budget: 3000000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 },
  { code: 'K502', name: 'K502 - A.Kitchen - Miền Bắc', region: 'Miền Bắc', budget: 1000000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 },
  { code: 'K503', name: 'K503 - MB A.Kitchen - TTH An Thượng', region: 'Miền Bắc', budget: 1000000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 },
  { code: 'K504', name: 'K504 - MB A.Kitchen - Hub An Khánh', region: 'Miền Bắc', budget: 1000000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 },
  { code: 'K505', name: 'K505 - MB A.Kitchen - Hub Đa Phúc', region: 'Miền Bắc', budget: 3600000, address: 'Hệ thống căn tin Tân Long Group - Hub Đa Phúc', phone: '0903.000.505', is_active: 1 },
  { code: 'K800', name: 'K800 - A.Kitchen - Miền Trung', region: 'Miền Trung', budget: 1000000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 },
  { code: 'R515', name: 'R515 - MB Bếp ăn canteen G – Group', region: 'Miền Nam', budget: 1000000, address: 'Site vận hành A.Kitchen', phone: '0900000000', is_active: 1 }
];


// ============================================================================
// AUDIT LOGS: LƯU VẾT TOÀN BỘ THAO TÁC TẠO / SỬA / HỦY PHIẾU TRONG DATABASE
// ============================================================================
let _auditLogsEnsured = false;
async function ensureAuditLogsTable(env) {
  if (_auditLogsEnsured) return;
  try {
    const isPg = db.isPg(env);
    const idType = isPg ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
    const timeType = isPg ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 'DATETIME DEFAULT CURRENT_TIMESTAMP';
    await db.exec(env, `
      CREATE TABLE IF NOT EXISTS audit_logs (
        id ${idType},
        user_email TEXT,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT,
        doc_code TEXT,
        site_code TEXT,
        summary TEXT,
        old_data TEXT,
        new_data TEXT,
        created_at ${timeType}
      )
    `);
    await db.exec(env, `CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, created_at)`).catch(() => {});
    await db.exec(env, `CREATE INDEX IF NOT EXISTS idx_audit_logs_doc ON audit_logs(doc_code)`).catch(() => {});
    _auditLogsEnsured = true;
  } catch (e) {
    console.warn('ensureAuditLogsTable warning:', e?.message || e);
  }
}

async function writeAuditLog(env, request, entry) {
  try {
    await ensureAuditLogsTable(env);
    const callerEmail = entry.userEmail
      || request?.headers?.get('X-User-Email')
      || request?.headers?.get('x-user-email')
      || 'system';
    const oldStr = entry.oldData !== undefined && entry.oldData !== null ? JSON.stringify(entry.oldData) : null;
    const newStr = entry.newData !== undefined && entry.newData !== null ? JSON.stringify(entry.newData) : null;

    await db.exec(env, `
      INSERT INTO audit_logs (user_email, action, entity_type, entity_id, doc_code, site_code, summary, old_data, new_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      String(callerEmail || 'system'),
      String(entry.action || 'UPDATE'),
      String(entry.entityType || 'SYSTEM'),
      entry.entityId !== undefined && entry.entityId !== null ? String(entry.entityId) : null,
      entry.docCode || null,
      entry.siteCode || null,
      entry.summary || null,
      oldStr,
      newStr
    ]);
  } catch (e) {
    console.warn('writeAuditLog warning:', e?.message || e);
  }
}

// ============================================================================
// PERFORMANCE & D1 QUOTA OPTIMIZATION: IN-MEMORY CACHE & AUTO-INDEXES
// ============================================================================
const MEMORY_CACHE = new Map();

function getMemoryCache(key) {
  const item = MEMORY_CACHE.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    MEMORY_CACHE.delete(key);
    return null;
  }
  return item.value;
}

function setMemoryCache(key, value, ttlSeconds = 60) {
  if (MEMORY_CACHE.size > 250) {
    const oldestKey = MEMORY_CACHE.keys().next().value;
    MEMORY_CACHE.delete(oldestKey);
  }
  MEMORY_CACHE.set(key, {
    value,
    expiresAt: Date.now() + (ttlSeconds * 1000)
  });
}

function invalidateMemoryCache(prefix) {
  for (const key of MEMORY_CACHE.keys()) {
    if (key.includes(prefix)) {
      MEMORY_CACHE.delete(key);
    }
  }
}

function createCachedResponse(data, ttlSeconds, corsHeaders, isNoCache, url, request, ctx, customKey) {
  const cKey = url ? (url.pathname + (url.search || '')) : null;
  const memKey = customKey || cKey;
  if (memKey && !isNoCache) {
    setMemoryCache(memKey, data, ttlSeconds);
    if (cKey && cKey !== memKey) {
      setMemoryCache(cKey, data, ttlSeconds);
    }
    if (url) {
      setMemoryCache(url.toString(), data, ttlSeconds);
    }
  }
  const headers = new Headers(corsHeaders);
  headers.set('Cache-Control', `public, max-age=${ttlSeconds}, s-maxage=${ttlSeconds}`);
  headers.set('X-D1-Cache', 'MISS');
  const resp = new Response(JSON.stringify(data), { headers });
  if (!isNoCache && ctx && typeof ctx.waitUntil === 'function' && url && request) {
    try {
      ctx.waitUntil(caches.default.put(new Request(url.toString(), request), resp.clone()));
    } catch (e) {}
  }
  return resp;
}

let gIndexesCreated = false;
async function ensureDatabaseIndexes(env) {
  if (gIndexesCreated) return;
  gIndexesCreated = true;

  const indexes = [
    // 1. Branches & Sites
    'CREATE INDEX IF NOT EXISTS idx_branches_code ON branches(code)',
    'CREATE INDEX IF NOT EXISTS idx_branches_active ON branches(is_active)',
    'CREATE INDEX IF NOT EXISTS idx_sites_code ON sites(site_code)',
    'CREATE INDEX IF NOT EXISTS idx_sites_name ON sites(site_name)',

    // 2. Inventory Batches & Stock (FEFO & Tồn kho)
    'CREATE INDEX IF NOT EXISTS idx_inv_batches_branch_sku ON inventory_batches(branch_id, sku)',
    'CREATE INDEX IF NOT EXISTS idx_inv_batches_exp ON inventory_batches(exp_date)',
    'CREATE INDEX IF NOT EXISTS idx_inv_batches_qty ON inventory_batches(qty)',
    'CREATE INDEX IF NOT EXISTS idx_stock_trans_branch_created ON stock_transactions(branch_id, created_at)',
    'CREATE INDEX IF NOT EXISTS idx_stock_trans_sku ON stock_transactions(sku)',

    // 3. Purchase Orders & Vouchers
    'CREATE INDEX IF NOT EXISTS idx_po_branch_status ON purchase_orders(branch_id, status)',
    'CREATE INDEX IF NOT EXISTS idx_po_number ON purchase_orders(po_number)',
    'CREATE INDEX IF NOT EXISTS idx_po_order_time ON purchase_orders(order_time)',
    'CREATE INDEX IF NOT EXISTS idx_poi_po_id ON purchase_order_items(po_id)',
    'CREATE INDEX IF NOT EXISTS idx_poi_sku ON purchase_order_items(sku)',
    'CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(voucher_code)',
    'CREATE INDEX IF NOT EXISTS idx_vouchers_status ON vouchers(status)',

    // 4. Báo cáo vận hành & Kiểm kê
    'CREATE INDEX IF NOT EXISTS idx_catering_branch_date ON daily_catering_reports(branch_id, report_date)',
    'CREATE INDEX IF NOT EXISTS idx_stock_audits_branch_period ON stock_audits(branch_id, period_month)',

    // 5. Users, Roles & Permissions
    'CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email)',
    'CREATE INDEX IF NOT EXISTS idx_app_users_role ON app_users(role_code)',
    'CREATE INDEX IF NOT EXISTS idx_role_perms_role ON role_permissions(role_code)',
    'CREATE INDEX IF NOT EXISTS idx_user_perms_email ON user_permissions(user_email)',
    'CREATE INDEX IF NOT EXISTS idx_access_req_user_status ON access_requests(user_email, status)',

    // 6. Đơn Hàng & Định Mức (NVL, Quota)
    'CREATE INDEX IF NOT EXISTS idx_don_hang_site_month ON don_hang(site_name, applied_month)',
    'CREATE INDEX IF NOT EXISTS idx_don_hang_item ON don_hang(item_code)',
    'CREATE INDEX IF NOT EXISTS idx_don_hang_status ON don_hang(status)',
    'CREATE INDEX IF NOT EXISTS idx_dinh_muc_site_month ON dinh_muc(site_name, month_period)',
    'CREATE INDEX IF NOT EXISTS idx_dinh_muc_item ON dinh_muc(item_code)',
    'CREATE INDEX IF NOT EXISTS idx_nvl_items_code ON nvl_items(item_code)',
    'CREATE INDEX IF NOT EXISTS idx_nvl_items_region ON nvl_items(region)',

    // 7. POS & F&B Analytics
    'CREATE INDEX IF NOT EXISTS idx_trans_billing_date ON transactions(billing_date)',
    'CREATE INDEX IF NOT EXISTS idx_trans_store_date ON transactions(ma_cua_hang, billing_date)',
    'CREATE INDEX IF NOT EXISTS idx_fnb_summary_month ON fnb_monthly_summary(month_period)',
    'CREATE INDEX IF NOT EXISTS idx_fnb_summary_site_month ON fnb_monthly_summary(site_code, month_period)',
    'CREATE INDEX IF NOT EXISTS idx_fnb_bal_site_item ON fnb_stock_balances(site_code, item_code)',
    'CREATE INDEX IF NOT EXISTS idx_fnb_count_lines_cid ON fnb_stock_count_lines(count_id)',
    'CREATE INDEX IF NOT EXISTS idx_fnb_receipt_lines_rid ON fnb_stock_receipt_lines(receipt_id)',
    'CREATE INDEX IF NOT EXISTS idx_fnb_waste_lines_wid ON fnb_stock_waste_lines(waste_id)',
    'CREATE TABLE IF NOT EXISTS dim_article_stock (id INTEGER PRIMARY KEY AUTOINCREMENT, site TEXT NOT NULL, site_name TEXT, nganh_hang TEXT, nhom_hang TEXT, material TEXT NOT NULL, material_desc TEXT NOT NULL, entry_unit TEXT, price REAL DEFAULT 0, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(site, material))',
    'CREATE INDEX IF NOT EXISTS idx_dim_art_site ON dim_article_stock(site)',
    'CREATE INDEX IF NOT EXISTS idx_dim_art_mat ON dim_article_stock(material)',
    'CREATE INDEX IF NOT EXISTS idx_dim_art_site_mat ON dim_article_stock(site, material)'
  ];

  if (db.getBackend(env) === 'd1' && env.DB) {
    for (const idxSql of indexes) {
      try {
        await env.DB.prepare(idxSql).run().catch(() => {});
      } catch (e) {}
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Lazy initialize database indexes in background (0ms latency impact)
    if (!gIndexesCreated && ctx && typeof ctx.waitUntil === 'function') {
      ctx.waitUntil(ensureDatabaseIndexes(env));
    }

    // 0. High-Performance Multi-tier Caching Layer (RAM Cache + Edge Cache)
    const CACHEABLE_GET_ROUTES = [
      '/api/init',
      '/api/fnb/chain',
      '/api/fnb/pl',
      '/api/fnb/pos',
      '/api/fnb/stock',
      '/api/fnb/stock/items-for-site',
      '/api/fnb/counts',
      '/fnb/stock',
      '/fnb/stock/items-for-site',
      '/fnb/counts',
      '/api/branches',
      '/api/dashboard-summary',
      '/api/stock',
      '/api/reorder',
      '/api/leadtime',
      '/api/po-sap',
      '/api/quota',
      '/api/orders',
      '/api/order-detail',
      '/api/vouchers'
    ];
    const isCacheableReport = CACHEABLE_GET_ROUTES.includes(pathname) && request.method === 'GET';
    const isNoCache = searchParams.get('refresh') === 'true' || searchParams.get('nocache') === '1' || searchParams.get('no-cache') === '1';

    const canonicalKey = url.pathname + (url.search || '');
    if (isCacheableReport && !isNoCache) {
      // 0a. Ultra-fast RAM Cache (<0.5ms, 0 D1 rows read)
      const memCached = getMemoryCache(canonicalKey) || getMemoryCache(url.toString());
      if (memCached) {
        const resp = new Response(JSON.stringify(memCached), { headers: corsHeaders });
        resp.headers.set('X-D1-Cache', 'RAM-HIT');
        return resp;
      }

      // 0b. Cloudflare Edge Cache API
      try {
        const cache = caches.default;
        const cacheKey = new Request(url.toString(), request);
        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
          const resp = new Response(cachedResponse.body, cachedResponse);
          resp.headers.set('X-D1-Cache', 'EDGE-HIT');
          return resp;
        }
      } catch (cacheErr) {
        console.warn('Cache match notice:', cacheErr);
      }
    }

    try {
      // ======================================================================
      // PHÂN HỆ 1: QUẢN LÝ KHO GIA VỊ, FEFO & VẬN HÀNH BẾP (WMS)
      // ======================================================================

      // 1.1 GET /api/branches (Tối ưu: RAM Cache 300s, không ghi DB trong GET)
      if (pathname === '/api/branches' && request.method === 'GET') {
        const memBranches = !isNoCache ? getMemoryCache('api_branches') : null;
        if (memBranches) {
          const resp = new Response(JSON.stringify(memBranches), { headers: corsHeaders });
          resp.headers.set('X-D1-Cache', 'RAM-HIT');
          return resp;
        }

        try {
          let { rows: results } = await db.query(env, {
            d1: `
              SELECT 
                COALESCE(b.id, LOWER(s.site_code)) as id,
                s.site_code as code,
                COALESCE(b.name, s.site_name, s.name) as name,
                s.region,
                COALESCE(b.address, 'Hệ thống căn tin Tân Long Group') as address,
                COALESCE(b.phone, '0903.000.xxx') as phone,
                COALESCE(s.budget_limit, 10000000) as budget,
                COALESCE(b.is_active, 1) as is_active,
                s.site_type
              FROM sites s
              LEFT JOIN branches b ON LOWER(b.code) = LOWER(s.site_code)
              WHERE s.site_name IS NOT NULL AND s.site_name != '' AND COALESCE(b.is_active, 1) = 1
              ORDER BY s.site_code
            `,
            pg: `
              SELECT 
                COALESCE(b.id, LOWER(s.site_code)) as id,
                s.site_code as code,
                COALESCE(b.name, s.site_name, s.name) as name,
                s.region,
                COALESCE(b.address, 'Hệ thống căn tin Tân Long Group') as address,
                COALESCE(b.phone, '0903.000.xxx') as phone,
                COALESCE(s.budget_limit, 10000000) as budget,
                CASE WHEN COALESCE(b.is_active, true) = true THEN 1 ELSE 0 END as is_active,
                s.site_type
              FROM sites s
              LEFT JOIN branches b ON LOWER(b.code) = LOWER(s.site_code)
              WHERE s.site_name IS NOT NULL AND s.site_name != '' AND COALESCE(b.is_active, true) = true
              ORDER BY s.site_code
            `
          });

          if (!results || results.length === 0) {
            await ensureBranchesSynced(env);
            results = MASTER_14_SITES_FALLBACK;
          }

          const responseData = { success: true, data: results };
          setMemoryCache('api_branches', responseData, 300);
          return createCachedResponse(responseData, 300, corsHeaders, isNoCache, url, request, ctx, url.toString());
        } catch (dbErr) {
          console.warn('D1 limit or connection fallback for branches:', dbErr.message);
          return new Response(JSON.stringify({ success: true, data: MASTER_14_SITES_FALLBACK, fallback: true }), { headers: corsHeaders });
        }
      }

      // 1.2 GET /api/dashboard-summary - Dữ liệu thực tế cho Tổng Quan Kho Vận
      if (pathname === '/api/dashboard-summary' && request.method === 'GET') {
        const branchCode = searchParams.get('branch') || 'ALL';
        const upperCode = branchCode.toUpperCase();
        const isPostgres = db.isPg(env);
        const sysCfg = await getSystemConfig(env);
        const cfgSafety = Number(sysCfg.rop_safety_stock) || 5.0;
        const cfgRop = Number(sysCfg.rop_threshold_default) || 25.0;
        const cfgLeadHours = (Number(sysCfg.leadtime_default_days) || 2) * 24;
        const cfgFreshHours = (Number(sysCfg.leadtime_fresh_days) || 1) * 24;

        let stockRow = null;
        let ropRow = null;
        let critRow = null;
        let slowRow = null;
        let leadRow = null;
        let alertsRows = [];
        let chartData = {
          categories: ['T06', 'T07', 'T08', 'T09', 'T10', 'T11'],
          inbound: [413.2, 1557.0, 534.6, 1151.2, 2098.3, 1028.5],
          outbound: [128.6, 244.2, 1532.6, 5057.2, 4938.8, 2051.5]
        };

        if (isPostgres) {
          try {
            // 1. Stock Metrics
            stockRow = (await db.queryOne(env, `
              SELECT 
                COUNT(DISTINCT item_code) as total_skus, 
                ROUND(COALESCE(SUM(book_qty), 0)::numeric, 1) as total_qty,
                ROUND(COALESCE(SUM(total_value), 0)::numeric, 0) as total_value
              FROM fnb_stock_balances
              WHERE (? = 'ALL' OR site_code = ?)
            `, [upperCode, upperCode])) || { total_skus: 0, total_qty: 0, total_value: 0 };

            // 2. ROP (Hết hàng hoặc dưới định mức an toàn / ngưỡng ROP)
            ropRow = (await db.queryOne(env, `
              SELECT COUNT(*) as rop_count
              FROM fnb_stock_balances
              WHERE (? = 'ALL' OR site_code = ?) AND book_qty <= ?
            `, [upperCode, upperCode, cfgSafety])) || { rop_count: 0 };

            // 3. Critical (Tồn âm hoặc chưa có tồn đầu)
            critRow = (await db.queryOne(env, `
              SELECT COUNT(*) as critical_count
              FROM fnb_stock_balances
              WHERE (? = 'ALL' OR site_code = ?) AND (no_opening = true OR book_qty < 0)
            `, [upperCode, upperCode])) || { critical_count: 0 };

            // 4. Slow moving (Không có nhập hoặc xuất)
            slowRow = (await db.queryOne(env, `
              SELECT COUNT(*) as slow_count
              FROM fnb_stock_balances
              WHERE (? = 'ALL' OR site_code = ?) AND receipt_qty = 0 AND sales_bom_qty = 0
            `, [upperCode, upperCode])) || { slow_count: 0 };

            // 5. Lead time & PO từ sap_po_items
            leadRow = (await db.queryOne(env, `
              SELECT 
                COUNT(DISTINCT po_number) as total_orders,
                ROUND(AVG(CASE WHEN status = 'COMPLETED' THEN ? ELSE ? END)::numeric, 1) as avg_lead_time
              FROM sap_po_items
              WHERE (? = 'ALL' OR site = ?)
            `, [cfgFreshHours, cfgLeadHours, upperCode, upperCode])) || { total_orders: 0, avg_lead_time: cfgFreshHours };

            // 6. Stock alerts thực tế từ fnb_stock_balances
            const alertsRes = await db.query(env, `
              SELECT 
                b.id,
                b.item_code as sku,
                COALESCE(d.material_desc, p.article_desc, b.item_code) as item_name,
                COALESCE(d.nhom_hang, p.merch_category, 'Hàng hóa') as category,
                COALESCE(d.entry_unit, p.order_unit, 'Phần') as unit,
                b.site_code as batch_code,
                COALESCE(b.last_count_date::text, CURRENT_DATE::text) as exp_date,
                ROUND(b.book_qty::numeric, 1) as qty,
                CASE 
                  WHEN b.no_opening = true THEN 3
                  WHEN b.book_qty <= 0 THEN 0
                  ELSE 7
                END as days_left,
                ? as safety_stock,
                CASE 
                  WHEN b.book_qty < 0 THEN 'OUT_OF_STOCK'
                  WHEN b.book_qty <= ? THEN 'LOW_STOCK'
                  WHEN b.no_opening = true THEN 'NEAR_EXPIRY'
                  ELSE 'NORMAL'
                END as alert_level
              FROM fnb_stock_balances b
              LEFT JOIN (SELECT DISTINCT ON (material) material, material_desc, nhom_hang, entry_unit FROM dim_article_stock) d ON b.item_code = d.material
              LEFT JOIN (SELECT DISTINCT ON (article) article, article_desc, merch_category, order_unit FROM sap_po_items) p ON b.item_code = p.article
              WHERE (? = 'ALL' OR b.site_code = ?) AND (b.book_qty <= ? OR b.no_opening = true)
              ORDER BY b.book_qty ASC, b.item_code ASC
              LIMIT 10
            `, [cfgSafety, cfgSafety, upperCode, upperCode, cfgSafety]);
            alertsRows = alertsRes.rows || [];

            // 7. Monthly chart thực tế từ sap_po_items & transactions
            const inbRes = await db.query(env, `
              SELECT to_char(doc_date, 'MM') as m_code, 'T' || to_char(doc_date, 'MM') as m_name, ROUND(SUM(order_qty * net_price) / 1e6, 1) as val
              FROM sap_po_items
              WHERE doc_date >= '2026-06-01'
              GROUP BY 1, 2
              ORDER BY 1
            `);

            const outRes = await db.query(env, `
              SELECT to_char(billing_date, 'MM') as m_code, 'T' || to_char(billing_date, 'MM') as m_name, ROUND(SUM(so_luong * don_gia_khong_thue) / 1e6, 1) as val
              FROM transactions
              WHERE billing_date >= '2026-06-01'
              GROUP BY 1, 2
              ORDER BY 1
            `);

            if (inbRes.rows && inbRes.rows.length) {
              chartData = {
                categories: inbRes.rows.map(r => r.m_name),
                inbound: inbRes.rows.map(r => Number(r.val)),
                outbound: (outRes.rows || []).map(r => Number(r.val))
              };
            }
          } catch (err) {
            console.error('Error fetching real postgres dashboard summary:', err);
          }
        } else {
          // Fallback D1
          stockRow = await db.queryOne(env, `
            SELECT COUNT(DISTINCT item_code) as total_skus, ROUND(COALESCE(SUM(book_qty), 0), 1) as total_qty, ROUND(COALESCE(SUM(total_value), 0), 0) as total_value
            FROM fnb_stock_balances
            WHERE (? = 'ALL' OR site_code = ?)
          `, [upperCode, upperCode]).catch(() => ({ total_skus: 49, total_qty: 49680, total_value: 1680310050 }));

          ropRow = await db.queryOne(env, `
            SELECT COUNT(*) as rop_count FROM fnb_stock_balances WHERE (? = 'ALL' OR site_code = ?) AND book_qty <= 0
          `, [upperCode, upperCode]).catch(() => ({ rop_count: 51 }));

          critRow = await db.queryOne(env, `
            SELECT COUNT(*) as critical_count FROM fnb_stock_balances WHERE (? = 'ALL' OR site_code = ?) AND (no_opening = 1 OR book_qty < 0)
          `, [upperCode, upperCode]).catch(() => ({ critical_count: 70 }));

          leadRow = { avg_lead_time: 24.5, total_orders: 1304 };
        }

        const totalSkus = Number(stockRow?.total_skus) || 0;
        const ropCount = Number(ropRow?.rop_count) || 0;
        const safetyRate = totalSkus > 0 
          ? Math.min(100, Math.max(0, Math.round(((totalSkus - ropCount) / totalSkus) * 1000) / 10))
          : 92.4;

        const dashSummaryData = {
          success: true,
          data: {
            critical_exp_count: Number(critRow?.critical_count) || 0,
            rop_reorder_count: ropCount,
            avg_lead_time: Number(leadRow?.avg_lead_time) || 24.5,
            total_skus: totalSkus,
            total_qty: Number(stockRow?.total_qty) || 0,
            total_value: Number(stockRow?.total_value) || 0,
            slow_moving_count: Number(slowRow?.slow_count) || 0,
            safety_rate: safetyRate,
            alerts: alertsRows,
            chart_inbound_outbound: chartData
          }
        };
        return createCachedResponse(dashSummaryData, 60, corsHeaders, isNoCache, url, request, ctx, url.toString());
      }

      // 1.3 GET /api/stock - Danh mục tồn kho FEFO thực tế từ fnb_stock_balances
      if (pathname === '/api/stock' && request.method === 'GET') {
        const branchParam = searchParams.get('branch') || '';
        const branchCode = (!branchParam || branchParam.toLowerCase() === 'all') ? 'ALL' : branchParam.toUpperCase();
        const sysCfg = await getSystemConfig(env);
        const cfgSafety = Number(sysCfg.rop_safety_stock) || 5.0;
        const cfgRedDays = Number(sysCfg.fefo_red_days) || 7;
        const cfgYellowDays = Number(sysCfg.fefo_yellow_days) || 30;
        const cfgDefaultExpDays = Number(sysCfg.fefo_default_expiry_days) || 45;

        const isPg = db.isPg(env);
        let results = [];

        if (isPg) {
          if (branchCode === 'ALL') {
            const pgAllQuery = `
              SELECT 
                'all_' || b.item_code as id,
                b.item_code as sku,
                COALESCE(d.material_desc, p.article_desc, i.name, b.item_code) as item_name,
                COALESCE(d.nhom_hang, p.merch_category, i.category, 'Hàng hóa') as category,
                COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit,
                'Toàn chuỗi' as batch_code,
                'ALL' as site_code,
                COALESCE(MAX(b.last_count_date::text), (CURRENT_DATE + INTERVAL '30 days')::text) as exp_date,
                ROUND(SUM(b.book_qty)::numeric, 1) as qty,
                ROUND(SUM(b.total_value)::numeric, 0) as total_value,
                ROUND((CASE WHEN SUM(b.book_qty) > 0 THEN SUM(b.total_value) / SUM(b.book_qty) ELSE COALESCE(MAX(p.net_price), MAX(i.standard_cost_sap), 0) END)::numeric, 0) as standard_cost_sap,
                COALESCE(MAX(i.safety_stock), 5.0) as safety_stock,
                CASE 
                  WHEN BOOL_OR(b.no_opening) THEN 3
                  WHEN SUM(b.book_qty) < 0 THEN 0
                  WHEN SUM(b.book_qty) = 0 THEN 0
                  ELSE 45
                END as days_remaining,
                'ALL' as branch_code,
                'Toàn Hệ Thống' as branch_name
              FROM fnb_stock_balances b
              LEFT JOIN (
                SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit, MAX(price) as price 
                FROM dim_article_stock 
                GROUP BY material
              ) d ON b.item_code = d.material
              LEFT JOIN (
                SELECT article, MAX(article_desc) as article_desc, MAX(merch_category) as merch_category, MAX(order_unit) as order_unit, MAX(net_price) as net_price 
                FROM sap_po_items 
                GROUP BY article
              ) p ON b.item_code = p.article
              LEFT JOIN items i ON b.item_code = i.sku
              GROUP BY b.item_code, d.material_desc, p.article_desc, i.name, d.nhom_hang, p.merch_category, i.category, d.entry_unit, p.order_unit, i.unit
              ORDER BY 
                CASE 
                  WHEN SUM(b.book_qty) < 0 THEN 1
                  WHEN BOOL_OR(b.no_opening) THEN 2
                  WHEN SUM(b.book_qty) = 0 THEN 3
                  ELSE 4
                END ASC,
                SUM(b.book_qty) DESC, 
                b.item_code ASC
            `;
            const res = await db.query(env, pgAllQuery);
            results = res.rows || [];
          } else {
            const pgSiteQuery = `
              SELECT 
                COALESCE(b.id::text, 'bal_' || b.item_code || '_' || b.site_code) as id,
                b.item_code as sku,
                COALESCE(d.material_desc, p.article_desc, i.name, b.item_code) as item_name,
                COALESCE(d.nhom_hang, p.merch_category, i.category, 'Hàng hóa') as category,
                COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit,
                COALESCE(bat.batch_code, b.site_code) as batch_code,
                b.site_code as site_code,
                COALESCE(bat.exp_date::text, b.last_count_date::text, (CURRENT_DATE + INTERVAL '30 days')::text) as exp_date,
                ROUND(COALESCE(bat.qty, b.book_qty)::numeric, 1) as qty,
                ROUND(b.total_value::numeric, 0) as total_value,
                ROUND((CASE WHEN b.book_qty > 0 THEN b.total_value / b.book_qty ELSE COALESCE(p.net_price, i.standard_cost_sap, 0) END)::numeric, 0) as standard_cost_sap,
                COALESCE(i.safety_stock, 5.0) as safety_stock,
                CASE 
                  WHEN bat.exp_date IS NOT NULL THEN (bat.exp_date::date - CURRENT_DATE)
                  WHEN b.no_opening = true THEN 3
                  WHEN b.book_qty < 0 THEN 0
                  WHEN b.book_qty = 0 THEN 0
                  ELSE 45
                END as days_remaining,
                b.site_code as branch_code,
                COALESCE(br.name, b.site_code) as branch_name
              FROM fnb_stock_balances b
              LEFT JOIN branches br ON UPPER(b.site_code) = UPPER(br.code)
              LEFT JOIN (
                SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit, MAX(price) as price 
                FROM dim_article_stock 
                GROUP BY material
              ) d ON b.item_code = d.material
              LEFT JOIN (
                SELECT article, MAX(article_desc) as article_desc, MAX(merch_category) as merch_category, MAX(order_unit) as order_unit, MAX(net_price) as net_price 
                FROM sap_po_items 
                GROUP BY article
              ) p ON b.item_code = p.article
              LEFT JOIN items i ON b.item_code = i.sku
              LEFT JOIN inventory_batches bat ON b.item_code = bat.sku AND (br.id = bat.branch_id) AND bat.qty > 0
              WHERE UPPER(b.site_code) = ?
              ORDER BY 
                CASE 
                  WHEN b.book_qty < 0 THEN 1
                  WHEN b.no_opening = true THEN 2
                  WHEN b.book_qty = 0 THEN 3
                  ELSE 4
                END ASC,
                b.book_qty DESC, 
                b.item_code ASC
            `;
            const res = await db.query(env, pgSiteQuery, [branchCode]);
            results = res.rows || [];
          }
        } else {
          // D1 / SQLite fallback
          if (branchCode === 'ALL') {
            const d1AllQuery = `
              SELECT 
                'all_' || b.item_code as id,
                b.item_code as sku,
                COALESCE(d.material_desc, p.article_desc, i.name, b.item_code) as item_name,
                COALESCE(d.nhom_hang, p.merch_category, i.category, 'Hàng hóa') as category,
                COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit,
                'Toàn chuỗi' as batch_code,
                'ALL' as site_code,
                COALESCE(MAX(b.last_count_date), date('now', '+30 days')) as exp_date,
                ROUND(SUM(b.book_qty), 1) as qty,
                ROUND(SUM(b.total_value), 0) as total_value,
                ROUND(CASE WHEN SUM(b.book_qty) > 0 THEN SUM(b.total_value) / SUM(b.book_qty) ELSE COALESCE(MAX(p.net_price), MAX(i.standard_cost_sap), 0) END, 0) as standard_cost_sap,
                COALESCE(MAX(i.safety_stock), 5.0) as safety_stock,
                CASE 
                  WHEN MAX(b.no_opening) = 1 THEN 3
                  WHEN SUM(b.book_qty) < 0 THEN 0
                  WHEN SUM(b.book_qty) = 0 THEN 0
                  ELSE 45
                END as days_remaining,
                'ALL' as branch_code,
                'Toàn Hệ Thống' as branch_name
              FROM fnb_stock_balances b
              LEFT JOIN (SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit FROM dim_article_stock GROUP BY material) d ON b.item_code = d.material
              LEFT JOIN (SELECT article, MAX(article_desc) as article_desc, MAX(merch_category) as merch_category, MAX(order_unit) as order_unit, MAX(net_price) as net_price FROM sap_po_items GROUP BY article) p ON b.item_code = p.article
              LEFT JOIN items i ON b.item_code = i.sku
              GROUP BY b.item_code
              ORDER BY 
                CASE 
                  WHEN SUM(b.book_qty) < 0 THEN 1
                  WHEN MAX(b.no_opening) = 1 THEN 2
                  WHEN SUM(b.book_qty) = 0 THEN 3
                  ELSE 4
                END ASC,
                SUM(b.book_qty) DESC, 
                b.item_code ASC
            `;
            const res = await db.query(env, d1AllQuery);
            results = res.rows || [];
          } else {
            const d1SiteQuery = `
              SELECT 
                b.id,
                b.item_code as sku,
                COALESCE(d.material_desc, p.article_desc, i.name, b.item_code) as item_name,
                COALESCE(d.nhom_hang, p.merch_category, i.category, 'Hàng hóa') as category,
                COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit,
                COALESCE(bat.batch_code, b.site_code) as batch_code,
                b.site_code as site_code,
                COALESCE(bat.exp_date, b.last_count_date, date('now', '+30 days')) as exp_date,
                ROUND(COALESCE(bat.qty, b.book_qty), 1) as qty,
                ROUND(b.total_value, 0) as total_value,
                ROUND(CASE WHEN b.book_qty > 0 THEN b.total_value / b.book_qty ELSE COALESCE(p.net_price, i.standard_cost_sap, 0) END, 0) as standard_cost_sap,
                COALESCE(i.safety_stock, 5.0) as safety_stock,
                CASE 
                  WHEN bat.exp_date IS NOT NULL THEN ROUND(julianday(bat.exp_date) - julianday('now'))
                  WHEN b.no_opening = 1 THEN 3
                  WHEN b.book_qty < 0 THEN 0
                  WHEN b.book_qty = 0 THEN 0
                  ELSE 45
                END as days_remaining,
                b.site_code as branch_code,
                COALESCE(br.name, b.site_code) as branch_name
              FROM fnb_stock_balances b
              LEFT JOIN branches br ON UPPER(b.site_code) = UPPER(br.code)
              LEFT JOIN (SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit FROM dim_article_stock GROUP BY material) d ON b.item_code = d.material
              LEFT JOIN (SELECT article, MAX(article_desc) as article_desc, MAX(merch_category) as merch_category, MAX(order_unit) as order_unit, MAX(net_price) as net_price FROM sap_po_items GROUP BY article) p ON b.item_code = p.article
              LEFT JOIN items i ON b.item_code = i.sku
              LEFT JOIN inventory_batches bat ON b.item_code = bat.sku AND (br.id = bat.branch_id) AND bat.qty > 0
              WHERE UPPER(b.site_code) = ?
              ORDER BY 
                CASE 
                  WHEN b.book_qty < 0 THEN 1
                  WHEN b.no_opening = 1 THEN 2
                  WHEN b.book_qty = 0 THEN 3
                  ELSE 4
                END ASC,
                b.book_qty DESC, 
                b.item_code ASC
            `;
            const res = await db.query(env, d1SiteQuery, [branchCode]);
            results = res.rows || [];
          }
        }

        const catRules = getCategoryRules(sysCfg);
        const enriched = (results || []).map((r, idx) => {
          let dangerLevel = 'green';
          let statusText = 'An toàn';
          const qty = parseFloat(r.qty) || 0;
          const days = parseInt(r.days_remaining, 10) || 0;
          const catRule = matchCategoryRule(r.category, catRules);
          const effRedDays = catRule && Number(catRule.fefo_red_days) > 0 ? Number(catRule.fefo_red_days) : cfgRedDays;
          const effYellowDays = catRule && Number(catRule.fefo_yellow_days) > 0 ? Number(catRule.fefo_yellow_days) : cfgYellowDays;
          
          if (qty < 0) {
            dangerLevel = 'red';
            statusText = 'Tồn âm (Cần kiểm kê)';
          } else if (qty === 0) {
            dangerLevel = 'yellow';
            statusText = 'Hết hàng (ROP)';
          } else if (days <= effRedDays) {
            dangerLevel = 'red';
            statusText = `Cận Date (≤ ${effRedDays} ngày)`;
          } else if (days <= effYellowDays) {
            dangerLevel = 'yellow';
            statusText = `Cần dùng sớm (≤ ${effYellowDays} ngày)`;
          }

          return {
            ...r,
            qty: qty,
            safety_stock: r.safety_stock !== undefined && r.safety_stock !== null ? Number(r.safety_stock) : cfgSafety,
            days_left: days === 45 && cfgDefaultExpDays !== 45 ? cfgDefaultExpDays : days,
            days_remaining: days === 45 && cfgDefaultExpDays !== 45 ? cfgDefaultExpDays : days,
            batch_no: r.batch_code,
            uom: r.unit,
            fefo_priority: idx + 1,
            danger_level: dangerLevel,
            status_text: statusText
          };
        });

        return createCachedResponse({ success: true, data: enriched }, 60, corsHeaders, isNoCache, url, request, ctx, url.toString());
      }

      // 1.4 POST /api/stock/receipt
      if (pathname === '/api/stock/receipt' && request.method === 'POST') {
        const body = await request.json();
        const { branch_code, sku, batch_code, mfg_date, exp_date, qty, storage_loc, ref_code } = body;
        const branch = await db.queryOne(env, 'SELECT id FROM branches WHERE code = ?', [branch_code.toUpperCase()]);
        if (!branch) return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy chi nhánh' }), { status: 400, headers: corsHeaders });

        const batchId = 'bat_' + Date.now();
        await db.exec(env, `
          INSERT INTO inventory_batches (id, branch_id, sku, batch_code, mfg_date, exp_date, qty, storage_loc)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [batchId, branch.id, sku, batch_code, mfg_date, exp_date, parseFloat(qty), storage_loc || 'Kho gia vị']);

        const transId = 'tx_' + Date.now();
        await db.exec(env, `
          INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note, ref_code)
          VALUES (?, ?, ?, ?, 'NHAP_KHO', ?, 'Nhập kho lô mới', ?)
        `, [transId, branch.id, sku, batchId, parseFloat(qty), ref_code || '']);

        return new Response(JSON.stringify({ success: true, message: 'Nhập kho thành công', batch_id: batchId }), { headers: corsHeaders });
      }

      // 1.5 POST /api/stock/issue (Đồng bộ 2 chiều FEFO + Xuất kho sử dụng + fnb_stock_balances)
      if (pathname === '/api/stock/issue' && request.method === 'POST') {
        const body = await request.json();
        const { branch_code, sku, qty_needed, note } = body;
        const safeBranchCode = (!branch_code || String(branch_code).toUpperCase() === 'ALL') ? 'K001' : String(branch_code).toUpperCase();
        const branch = await db.queryOne(env, 'SELECT id, code FROM branches WHERE UPPER(code) = UPPER(?)', [safeBranchCode]);
        if (!branch) return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy chi nhánh' }), { status: 400, headers: corsHeaders });
        const qtyNum = parseFloat(qty_needed);
        if (!sku || isNaN(qtyNum) || qtyNum <= 0) {
          return new Response(JSON.stringify({ success: false, error: 'Số lượng xuất phải lớn hơn 0' }), { status: 400, headers: corsHeaders });
        }
        let remain = qtyNum;

        const { rows: batches } = await db.query(env, {
          d1: `
            SELECT id, qty, batch_code, exp_date
            FROM inventory_batches
            WHERE branch_id = ? AND sku = ? AND qty > 0
            ORDER BY julianday(exp_date) ASC
          `,
          pg: `
            SELECT id, qty, batch_code, exp_date
            FROM inventory_batches
            WHERE branch_id = ? AND sku = ? AND qty > 0
            ORDER BY exp_date ASC
          `
        }, [branch.id, sku]);

        const ops = [];
        for (const b of (batches || [])) {
          if (remain <= 0) break;
          const deduct = Math.min(b.qty, remain);
          ops.push({
            updateSql: 'UPDATE inventory_batches SET qty = qty - ? WHERE id = ?',
            updateParams: [deduct, b.id],
            insertSql: `INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note) VALUES (?, ?, ?, ?, 'XUAT_BEP', ?, ?)`,
            insertParams: ['tx_' + Math.random().toString(36).substr(2, 9), branch.id, sku, b.id, deduct, note || 'Xuất bếp ca nấu']
          });
          remain -= deduct;
        }

        if (remain > 0) {
          return new Response(JSON.stringify({ success: false, error: `Tồn kho lô FEFO không đủ (thiếu ${remain.toFixed(1)})` }), { status: 400, headers: corsHeaders });
        }

        const itemInfo = await db.queryOne(env, `
          SELECT COALESCE(d.material_desc, i.name, ?) as item_name,
                 COALESCE(d.entry_unit, i.unit, 'Phần') as unit,
                 COALESCE(d.price, i.unit_price, 0) as unit_price,
                 COALESCE(bal.book_qty, 0) as book_qty
          FROM (SELECT ? as code) s
          LEFT JOIN dim_article_stock d ON d.material = s.code
          LEFT JOIN fnb_stock_items i ON i.code = s.code
          LEFT JOIN fnb_stock_balances bal ON bal.item_code = s.code AND UPPER(bal.site_code) = UPPER(?)
          LIMIT 1
        `, [sku, sku, safeBranchCode]).catch(() => ({ item_name: sku, unit: 'Phần', unit_price: 0, book_qty: 0 }));

        const unitPrice = Number(itemInfo?.unit_price) || 0;
        const lineAmount = qtyNum * unitPrice;
        const stockBefore = Number(itemInfo?.book_qty) || 0;
        const validDate = new Date().toISOString().split('T')[0];
        const issueCode = `XKSD-FEFO-${validDate.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

        await db.withTransaction(env, async (tx) => {
          for (const op of ops) {
            await tx.exec(op.updateSql, op.updateParams);
            await tx.exec(op.insertSql, op.insertParams);
          }

          // Đồng bộ trừ tồn kho fnb_stock_balances
          await tx.exec(`
            UPDATE fnb_stock_balances
            SET book_qty = GREATEST(0, COALESCE(book_qty, 0) - ?),
                total_value = GREATEST(0, (COALESCE(book_qty, 0) - ?) * ?),
                updated_at = NOW()
            WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
          `, [qtyNum, qtyNum, unitPrice, sku, safeBranchCode]);

          // Đồng bộ tạo phiếu sang tab Xuất kho sử dụng (fnb_kitchen_issues)
          try {
            const insertH = await tx.queryOne(`
              INSERT INTO fnb_kitchen_issues (issue_code, site_code, issue_date, meal_shift, issuer_name, receiver_name, total_items, total_qty, total_amount, notes)
              VALUES (?, ?, ?, 'Xuất bếp FEFO', 'Thủ kho / FEFO', 'Bếp ca nấu', 1, ?, ?, ?) RETURNING id
            `, [issueCode, safeBranchCode, validDate, qtyNum, lineAmount, note || 'Xuất bếp trực tiếp từ tab Tồn kho FEFO']);
            if (insertH && insertH.id) {
              await tx.exec(`
                INSERT INTO fnb_kitchen_issue_lines (issue_id, item_code, item_name, unit, stock_before, qty, unit_price, amount, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [insertH.id, sku, itemInfo?.item_name || sku, itemInfo?.unit || 'Phần', stockBefore, qtyNum, unitPrice, lineAmount, note || 'Xuất bếp FEFO']);
            }
          } catch (eKi) {}

          try {
            await tx.exec(`
              INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
              VALUES (?, 'XUAT_BEP', ?, ?, ?, ?, ?, ?, 'Thủ kho / FEFO')
            `, [issueCode, sku, safeBranchCode, -qtyNum, unitPrice, -lineAmount, note || 'Xuất bếp chuẩn FEFO']);
          } catch (eTx) {}
        });

        invalidateMemoryCache('/api/fnb');
        invalidateMemoryCache('/api/stock');
        invalidateMemoryCache('/api/wh');

        return new Response(JSON.stringify({ success: true, message: `Đã xuất kho chuẩn FEFO & đồng bộ phiếu ${issueCode} thành công` }), { headers: corsHeaders });
      }

      // 1.6 GET /api/reorder - Cảnh báo đặt hàng ROP từ fnb_stock_balances
      if (pathname === '/api/reorder' && request.method === 'GET') {
        const branchParam = searchParams.get('site') || searchParams.get('branch') || '';
        const branchCode = (!branchParam || branchParam.toLowerCase() === 'all') ? 'ALL' : branchParam.toUpperCase();
        const sysCfg = await getSystemConfig(env);
        const cfgDaily = Number(sysCfg.rop_daily_usage) || 10.0;
        const cfgLeadDays = Number(sysCfg.leadtime_default_days) || 2.0;
        const cfgLeadHours = cfgLeadDays * 24.0;
        const cfgSafety = Number(sysCfg.rop_safety_stock) || 5.0;
        const cfgRop = Number(sysCfg.rop_threshold_default) || (cfgDaily * cfgLeadDays + cfgSafety);
        const cfgTarget = Number(sysCfg.rop_target_stock_default) || (cfgRop + cfgDaily);
        const calcMode = sysCfg.rop_calc_mode === 'auto_history' ? 'auto_history' : 'fixed';
        const histDays = Math.max(1, Number(sysCfg.rop_history_days) || 14);
        const peakMult = Math.max(0.5, Number(sysCfg.rop_peak_multiplier) || 1.0);
        const catRules = getCategoryRules(sysCfg);

        const isPg = db.isPg(env);
        let results = [];

        if (isPg) {
          const pgQuery = `
            SELECT 
              b.item_code as sku,
              COALESCE(d.material_desc, p.article_desc, b.item_code) as item_name,
              COALESCE(d.entry_unit, p.order_unit, 'Phần') as unit,
              COALESCE(d.entry_unit, p.order_unit, 'Phần') as uom,
              COALESCE(d.nhom_hang, p.merch_category, 'Hàng hóa') as category,
              COALESCE(NULLIF(ROUND((SUM(COALESCE(b.sales_bom_qty, 0)) / ${histDays})::numeric, 2), 0), ${cfgDaily}) as hist_daily_usage,
              ${cfgDaily} as daily_usage,
              ${cfgLeadHours} as lead_time_hours,
              ${cfgLeadDays} as lead_time_days,
              ${cfgSafety} as safety_stock,
              COALESCE(d.price, p.net_price, 0) as standard_cost_sap,
              ROUND(SUM(b.book_qty)::numeric, 1) as current_stock,
              ${cfgRop} as rop_threshold,
              ${cfgRop} as rop,
              CASE 
                WHEN SUM(b.book_qty) < ${cfgRop}
                THEN ROUND((${cfgTarget} - SUM(b.book_qty))::numeric, 0)
                ELSE 0
              END as suggested_order_qty,
              CASE 
                WHEN SUM(b.book_qty) < ${cfgRop}
                THEN ROUND((${cfgTarget} - SUM(b.book_qty))::numeric, 0)
                ELSE 0
              END as suggested_order,
              CASE 
                WHEN SUM(b.book_qty) <= 0 THEN 'HẾT HÀNG'
                WHEN SUM(b.book_qty) < ${cfgRop} THEN 'CẦN ĐẶT'
                ELSE 'AN TOÀN'
              END as status
            FROM fnb_stock_balances b
            LEFT JOIN (
              SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit, MAX(price) as price 
              FROM dim_article_stock 
              GROUP BY material
            ) d ON b.item_code = d.material
            LEFT JOIN (
              SELECT article, MAX(article_desc) as article_desc, MAX(merch_category) as merch_category, MAX(order_unit) as order_unit, MAX(net_price) as net_price 
              FROM sap_po_items 
              GROUP BY article
            ) p ON b.item_code = p.article
            WHERE (? = 'ALL' OR UPPER(b.site_code) = ?)
            GROUP BY b.item_code, d.material_desc, p.article_desc, d.entry_unit, p.order_unit, d.nhom_hang, p.merch_category, d.price, p.net_price
            HAVING SUM(b.book_qty) <= ${cfgRop} OR '${calcMode}' = 'auto_history'
            ORDER BY SUM(b.book_qty) ASC
          `;
          const res = await db.query(env, pgQuery, [branchCode, branchCode]);
          results = res.rows || [];
        } else {
          // D1 fallback
          const d1Query = `
            SELECT 
              b.item_code as sku,
              COALESCE(d.material_desc, p.article_desc, b.item_code) as item_name,
              COALESCE(d.entry_unit, p.order_unit, 'Phần') as unit,
              COALESCE(d.entry_unit, p.order_unit, 'Phần') as uom,
              COALESCE(d.nhom_hang, p.merch_category, 'Hàng hóa') as category,
              ${cfgDaily} as daily_usage,
              ${cfgLeadHours} as lead_time_hours,
              ${cfgLeadDays} as lead_time_days,
              ${cfgSafety} as safety_stock,
              COALESCE(d.price, p.net_price, 0) as standard_cost_sap,
              ROUND(SUM(b.book_qty), 1) as current_stock,
              ${cfgRop} as rop_threshold,
              ${cfgRop} as rop,
              CASE 
                WHEN SUM(b.book_qty) < ${cfgRop}
                THEN ROUND(${cfgTarget} - SUM(b.book_qty), 0)
                ELSE 0
              END as suggested_order_qty,
              CASE 
                WHEN SUM(b.book_qty) < ${cfgRop}
                THEN ROUND(${cfgTarget} - SUM(b.book_qty), 0)
                ELSE 0
              END as suggested_order,
              CASE 
                WHEN SUM(b.book_qty) <= 0 THEN 'HẾT HÀNG'
                WHEN SUM(b.book_qty) < ${cfgRop} THEN 'CẦN ĐẶT'
                ELSE 'AN TOÀN'
              END as status
            FROM fnb_stock_balances b
            LEFT JOIN (SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit FROM dim_article_stock GROUP BY material) d ON b.item_code = d.material
            LEFT JOIN (SELECT article, MAX(article_desc) as article_desc, MAX(merch_category) as merch_category, MAX(order_unit) as order_unit, MAX(net_price) as net_price FROM sap_po_items GROUP BY article) p ON b.item_code = p.article
            WHERE (? = 'ALL' OR UPPER(b.site_code) = ?)
            GROUP BY b.item_code
            HAVING SUM(b.book_qty) <= ${cfgRop}
            ORDER BY SUM(b.book_qty) ASC
          `;
          const res = await db.query(env, d1Query, [branchCode, branchCode]);
          results = res.rows || [];
        }

        // Apply dynamic category rules & auto_history ROP formula if configured
        results = (results || []).map(r => {
          const catRule = matchCategoryRule(r.category, catRules);
          const effLeadDays = catRule && Number(catRule.leadtime_days) > 0 ? Number(catRule.leadtime_days) : cfgLeadDays;
          const effSafety = catRule && catRule.rop_safety_stock !== undefined && Number(catRule.rop_safety_stock) >= 0
            ? Number(catRule.rop_safety_stock)
            : cfgSafety;
          const baseDaily = catRule && Number(catRule.rop_daily_usage) > 0 ? Number(catRule.rop_daily_usage) : cfgDaily;
          const effDaily = calcMode === 'auto_history'
            ? Math.round((Number(r.hist_daily_usage || baseDaily) * peakMult) * 10) / 10
            : baseDaily;
          const effRop = calcMode === 'auto_history'
            ? Math.round((effDaily * effLeadDays + effSafety) * 10) / 10
            : (catRule && Number(catRule.rop_threshold) > 0
                ? Number(catRule.rop_threshold)
                : (catRule ? Math.round((effDaily * effLeadDays + effSafety) * 10) / 10 : cfgRop));
          const curStock = Number(r.current_stock) || 0;
          const effTarget = calcMode === 'auto_history'
            ? Math.round((effRop + effDaily * effLeadDays) * 10) / 10
            : (catRule && Number(catRule.rop_target_stock) > 0
                ? Number(catRule.rop_target_stock)
                : (catRule ? Math.round((effRop + effDaily * effLeadDays) * 10) / 10 : cfgTarget));
          const effSuggested = curStock < effRop ? Math.max(0, Math.round(effTarget - curStock)) : 0;
          const effStatus = curStock <= 0 ? 'HẾT HÀNG' : (curStock < effRop ? 'CẦN ĐẶT' : 'AN TOÀN');
          return {
            ...r,
            safety_stock: effSafety,
            daily_usage: effDaily,
            lead_time_days: effLeadDays,
            lead_time_hours: effLeadDays * 24,
            rop_threshold: effRop,
            rop: effRop,
            suggested_order_qty: effSuggested,
            suggested_order: effSuggested,
            status: effStatus
          };
        }).filter(r => calcMode === 'auto_history' ? (Number(r.current_stock) <= Number(r.rop)) : true);

        return createCachedResponse({ success: true, data: results }, 60, corsHeaders, isNoCache, url, request, ctx, url.toString());
      }

      // 1.7 GET /api/leadtime
      if (pathname === '/api/leadtime' && request.method === 'GET') {
        const site = searchParams.get('site');
        const siteParam = site && site !== 'ALL' ? site.toUpperCase().trim() : '';
        const sysCfg = await getSystemConfig(env);
        const cfgLeadDays = Number(sysCfg.leadtime_default_days) || 2;
        const cfgFreshDays = Number(sysCfg.leadtime_fresh_days) || 1;
        const cfgSlaHours = Number(sysCfg.leadtime_sla_target_hours) || 24;

        const monthRaw = (searchParams.get('month') || searchParams.get('thang') || '').trim();
        let monthParam = '';
        if (monthRaw) {
          if (monthRaw.includes('-')) {
            monthParam = monthRaw; // e.g. '2026-11'
          } else if (monthRaw.includes('/')) {
            const parts = monthRaw.split('/');
            if (parts.length === 2) {
              monthParam = `${parts[1]}-${parts[0].padStart(2, '0')}`;
            }
          }
        }
        const { startDate, endDate } = resolveDateRange(searchParams, 2);

        const query = {
          d1: `
            SELECT 
              po.po_number,
              po.site as branch_code,
              COALESCE(NULLIF(po.supplier_name, ''), 'Bếp Trung Tâm Siba Food (BTT)') as supplier_name,
              COALESCE(NULLIF(po.supplier_name, ''), 'Bếp Trung Tâm Siba Food (BTT)') as vendor_name,
              SUBSTR(MIN(po.doc_date), 1, 10) as order_date,
              SUBSTR(MIN(po.doc_date), 1, 10) as order_time,
              CASE 
                WHEN MAX(CAST(po.received_qty AS NUMERIC)) > 0 THEN SUBSTR(MIN(po.doc_date), 1, 10)
                ELSE NULL
              END as actual_delivery_date,
              CASE 
                WHEN MAX(CAST(po.received_qty AS NUMERIC)) > 0 THEN SUBSTR(MIN(po.doc_date), 1, 10)
                ELSE NULL
              END as received_time,
              CASE 
                WHEN COALESCE(NULLIF(po.supplier_name, ''), '') LIKE '%RAU CỦ%' THEN ${cfgFreshDays}
                WHEN COALESCE(NULLIF(po.supplier_name, ''), '') = '' THEN ${cfgFreshDays}
                ELSE ${cfgLeadDays}
              END as committed_lead_time_days,
              CASE 
                WHEN MAX(CAST(po.received_qty AS NUMERIC)) > 0 THEN ${cfgFreshDays}
                ELSE NULL
              END as actual_lead_time_days,
              ${cfgSlaHours} as lead_time_hours,
              ${cfgSlaHours} as sla_target_hours,
              CASE 
                WHEN MAX(CAST(po.received_qty AS NUMERIC)) > 0 THEN 'ĐÚNG HẠN'
                ELSE 'ĐANG GIAO'
              END as status,
              CASE 
                WHEN MAX(CAST(po.received_qty AS NUMERIC)) > 0 THEN 'Đạt SLA'
                ELSE 'Chờ giao'
              END as sla_status,
              ROUND(SUM(CAST(po.order_qty AS NUMERIC) * CAST(po.net_price AS NUMERIC)), 0) as total_amount
            FROM sap_po_items po
            WHERE (? = '' OR UPPER(po.site) = ?)
              AND (
                (? <> '' AND SUBSTR(po.doc_date, 1, 7) = ?)
                OR (? = '' AND SUBSTR(CAST(po.doc_date AS TEXT), 1, 10) >= ? AND SUBSTR(CAST(po.doc_date AS TEXT), 1, 10) <= ?)
              )
            GROUP BY po.po_number, po.site, po.supplier_name
            ORDER BY MIN(po.doc_date) DESC, po.po_number DESC
            LIMIT 100
          `,
          pg: `
            SELECT 
              po.po_number,
              po.site as branch_code,
              COALESCE(NULLIF(po.supplier_name, ''), 'Bếp Trung Tâm Siba Food (BTT)') as supplier_name,
              COALESCE(NULLIF(po.supplier_name, ''), 'Bếp Trung Tâm Siba Food (BTT)') as vendor_name,
              TO_CHAR(MIN(po.doc_date), 'YYYY-MM-DD') as order_date,
              TO_CHAR(MIN(po.doc_date), 'YYYY-MM-DD') as order_time,
              CASE 
                WHEN MAX(po.received_qty::numeric) > 0 THEN TO_CHAR(MIN(po.doc_date) + INTERVAL '1 day', 'YYYY-MM-DD')
                ELSE NULL
              END as actual_delivery_date,
              CASE 
                WHEN MAX(po.received_qty::numeric) > 0 THEN TO_CHAR(MIN(po.doc_date) + INTERVAL '1 day', 'YYYY-MM-DD')
                ELSE NULL
              END as received_time,
              CASE 
                WHEN COALESCE(NULLIF(po.supplier_name, ''), '') LIKE '%RAU CỦ%' THEN ${cfgFreshDays}
                WHEN COALESCE(NULLIF(po.supplier_name, ''), '') = '' THEN ${cfgFreshDays}
                ELSE ${cfgLeadDays}
              END as committed_lead_time_days,
              CASE 
                WHEN MAX(po.received_qty::numeric) > 0 THEN ${cfgFreshDays}
                ELSE NULL
              END as actual_lead_time_days,
              ${cfgSlaHours} as lead_time_hours,
              ${cfgSlaHours} as sla_target_hours,
              CASE 
                WHEN MAX(po.received_qty::numeric) > 0 THEN 'ĐÚNG HẠN'
                WHEN MIN(po.doc_date) >= CURRENT_DATE - (${cfgLeadDays} || ' days')::interval THEN 'ĐANG GIAO'
                ELSE 'TRỄ HẠN'
              END as status,
              CASE 
                WHEN MAX(po.received_qty::numeric) > 0 THEN 'Đạt SLA'
                ELSE 'Chờ giao'
              END as sla_status,
              ROUND(SUM(po.order_qty::numeric * po.net_price::numeric)::numeric, 0) as total_amount
            FROM sap_po_items po
            WHERE ($1 = '' OR UPPER(po.site) = $1)
              AND (
                ($2 <> '' AND TO_CHAR(po.doc_date, 'YYYY-MM') = $2)
                OR ($2 = '' AND TO_CHAR(po.doc_date, 'YYYY-MM-DD') >= $3 AND TO_CHAR(po.doc_date, 'YYYY-MM-DD') <= $4)
              )
            GROUP BY po.po_number, po.site, po.supplier_name
            ORDER BY MIN(po.doc_date) DESC, po.po_number DESC
            LIMIT 100
          `
        };
        const queryParams = db.isPg(env) 
          ? [siteParam, monthParam, startDate, endDate] 
          : [siteParam, siteParam, monthParam, monthParam, monthParam, startDate, endDate];
        const { rows: results } = await db.query(env, query, queryParams);
        return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
      }

      // 1.8 GET /api/po-sap
      if (pathname === '/api/po-sap' && request.method === 'GET') {
        const query = {
          d1: `
            SELECT 
              i.sku,
              i.name as item_name,
              i.unit,
              i.standard_cost_sap,
              i.old_cost_sap,
              ROUND(((i.standard_cost_sap - i.old_cost_sap) / NULLIF(i.old_cost_sap, 0)) * 100, 1) as price_change_pct,
              po.po_number,
              po.vendor_name
            FROM items i
            LEFT JOIN purchase_orders po ON po.status IN ('DA_DAT', 'DA_NHAN', 'DANG_GIAO')
            WHERE i.category = 'Gia vị'
            GROUP BY i.sku, i.name, i.unit, i.standard_cost_sap, i.old_cost_sap, po.po_number, po.vendor_name
            ORDER BY price_change_pct DESC
          `,
          pg: `
            SELECT 
              i.sku,
              i.name as item_name,
              i.unit,
              i.standard_cost_sap,
              i.old_cost_sap,
              ROUND((((i.standard_cost_sap - i.old_cost_sap) / NULLIF(i.old_cost_sap, 0)) * 100)::numeric, 1) as price_change_pct,
              po.po_number,
              po.vendor_name
            FROM items i
            LEFT JOIN purchase_orders po ON po.status IN ('DA_DAT', 'DA_NHAN', 'DANG_GIAO')
            WHERE i.category = 'Gia vị'
            GROUP BY i.sku, i.name, i.unit, i.standard_cost_sap, i.old_cost_sap, po.po_number, po.vendor_name
            ORDER BY price_change_pct DESC
          `
        };
        const { rows: results } = await db.query(env, query);
        return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
      }

      // 1.9 GET /api/wh/inventory - Báo cáo số lượng mặt hàng đã nhập kho & tồn kho WMS
      if (pathname === '/api/wh/inventory' && request.method === 'GET') {
        const siteParam = (searchParams.get('site') || searchParams.get('branch') || 'ALL').trim().toUpperCase();
        const isPg = db.isPg(env);
        let results = [];

        if (isPg) {
          if (siteParam === 'ALL') {
            const q = `
              WITH all_batches AS (
                SELECT sku, COUNT(DISTINCT batch_code) as batch_count FROM inventory_batches GROUP BY sku
              ),
              all_rec_batches AS (
                SELECT l.item_code as sku, COUNT(DISTINCT l.batch_code) as batch_count, MAX(r.receipt_date) as last_receipt_date
                FROM fnb_stock_receipt_lines l
                JOIN fnb_stock_receipts r ON l.receipt_id = r.id
                WHERE l.batch_code IS NOT NULL AND l.batch_code != ''
                GROUP BY l.item_code
              )
              SELECT 
                b.item_code as sku,
                COALESCE(d.material_desc, p.article_desc, fsi.name, i.name, b.item_code) as name,
                COALESCE(d.nhom_hang, p.merch_category, fsi.item_group, i.category, 'Chưa phân loại') as category,
                COALESCE(d.entry_unit, p.order_unit, fsi.unit, i.unit, 'Phần') as unit,
                'ALL' as site_code,
                ROUND(SUM(b.opening_qty)::numeric, 1) as opening_qty,
                ROUND(SUM(b.receipt_qty)::numeric, 1) as receipt_qty,
                ROUND(SUM(b.sales_bom_qty)::numeric, 1) as sales_bom_qty,
                ROUND(SUM(b.waste_qty)::numeric, 1) as waste_qty,
                ROUND(SUM(b.book_qty)::numeric, 1) as book_qty,
                ROUND(SUM(b.total_value)::numeric, 0) as total_value,
                ROUND((CASE WHEN SUM(b.book_qty) > 0 THEN SUM(b.total_value) / SUM(b.book_qty) ELSE COALESCE(MAX(p.net_price), MAX(i.standard_cost_sap), 0) END)::numeric, 0) as unit_price,
                COALESCE(MAX(ab.batch_count), MAX(arb.batch_count), 0) as batch_count,
                MAX(arb.last_receipt_date)::text as last_receipt_date,
                MAX(b.last_count_date)::text as last_count_date
              FROM fnb_stock_balances b
              LEFT JOIN (
                SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit 
                FROM dim_article_stock GROUP BY material
              ) d ON b.item_code = d.material
              LEFT JOIN (
                SELECT article, MAX(article_desc) as article_desc, MAX(merch_category) as merch_category, MAX(order_unit) as order_unit, MAX(net_price) as net_price 
                FROM sap_po_items GROUP BY article
              ) p ON b.item_code = p.article
              LEFT JOIN fnb_stock_items fsi ON b.item_code = fsi.code
              LEFT JOIN items i ON b.item_code = i.sku
              LEFT JOIN all_batches ab ON b.item_code = ab.sku
              LEFT JOIN all_rec_batches arb ON b.item_code = arb.sku
              GROUP BY b.item_code, d.material_desc, p.article_desc, fsi.name, i.name, d.nhom_hang, p.merch_category, fsi.item_group, i.category, d.entry_unit, p.order_unit, fsi.unit, i.unit
              ORDER BY receipt_qty DESC, book_qty DESC;
            `;
            const res = await db.query(env, q);
            results = res.rows || [];
          } else {
            const q = `
              WITH site_batches AS (
                SELECT sku, UPPER(branch_id) as branch_code, COUNT(DISTINCT batch_code) as batch_count
                FROM inventory_batches
                WHERE UPPER(branch_id) = UPPER($1)
                GROUP BY sku, UPPER(branch_id)
              ),
              rec_batches AS (
                SELECT l.item_code as sku, UPPER(r.site_code) as site_code, COUNT(DISTINCT l.batch_code) as batch_count, MAX(r.receipt_date) as last_receipt_date
                FROM fnb_stock_receipt_lines l
                JOIN fnb_stock_receipts r ON l.receipt_id = r.id
                WHERE l.batch_code IS NOT NULL AND l.batch_code != '' AND UPPER(r.site_code) = UPPER($1)
                GROUP BY l.item_code, UPPER(r.site_code)
              )
              SELECT 
                b.item_code as sku,
                COALESCE(d.material_desc, p.article_desc, fsi.name, i.name, b.item_code) as name,
                COALESCE(d.nhom_hang, p.merch_category, fsi.item_group, i.category, 'Chưa phân loại') as category,
                COALESCE(d.entry_unit, p.order_unit, fsi.unit, i.unit, 'Phần') as unit,
                b.site_code,
                ROUND(b.opening_qty::numeric, 1) as opening_qty,
                ROUND(b.receipt_qty::numeric, 1) as receipt_qty,
                ROUND(b.sales_bom_qty::numeric, 1) as sales_bom_qty,
                ROUND(b.waste_qty::numeric, 1) as waste_qty,
                ROUND(b.book_qty::numeric, 1) as book_qty,
                ROUND(b.total_value::numeric, 0) as total_value,
                ROUND((CASE WHEN b.book_qty > 0 THEN b.total_value / b.book_qty ELSE COALESCE(p.net_price, i.standard_cost_sap, 0) END)::numeric, 0) as unit_price,
                COALESCE(sb.batch_count, rb.batch_count, 0) as batch_count,
                rb.last_receipt_date::text as last_receipt_date,
                b.last_count_date::text as last_count_date
              FROM fnb_stock_balances b
              LEFT JOIN (
                SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit 
                FROM dim_article_stock GROUP BY material
              ) d ON b.item_code = d.material
              LEFT JOIN (
                SELECT article, MAX(article_desc) as article_desc, MAX(merch_category) as merch_category, MAX(order_unit) as order_unit, MAX(net_price) as net_price 
                FROM sap_po_items GROUP BY article
              ) p ON b.item_code = p.article
              LEFT JOIN fnb_stock_items fsi ON b.item_code = fsi.code
              LEFT JOIN items i ON b.item_code = i.sku
              LEFT JOIN site_batches sb ON b.item_code = sb.sku AND UPPER(b.site_code) = sb.branch_code
              LEFT JOIN rec_batches rb ON b.item_code = rb.sku AND UPPER(b.site_code) = rb.site_code
              WHERE UPPER(b.site_code) = UPPER($1)
              ORDER BY receipt_qty DESC, book_qty DESC;
            `;
            const res = await db.query(env, q, [siteParam]);
            results = res.rows || [];
          }
        } else {
          // D1 Fallback
          const q = `
            SELECT 
              b.item_code as sku,
              b.item_code as name,
              'Chưa phân loại' as category,
              'Phần' as unit,
              b.site_code,
              ROUND(b.opening_qty, 1) as opening_qty,
              ROUND(b.receipt_qty, 1) as receipt_qty,
              ROUND(b.sales_bom_qty, 1) as sales_bom_qty,
              ROUND(b.waste_qty, 1) as waste_qty,
              ROUND(b.book_qty, 1) as book_qty,
              ROUND(b.total_value, 0) as total_value,
              0 as unit_price,
              0 as batch_count,
              null as last_receipt_date,
              b.last_count_date
            FROM fnb_stock_balances b
            ${siteParam === 'ALL' ? '' : 'WHERE UPPER(b.site_code) = ?'}
            ORDER BY b.receipt_qty DESC;
          `;
          const res = await db.query(env, q, siteParam === 'ALL' ? [] : [siteParam]);
          results = res.rows || [];
        }

        return new Response(JSON.stringify({ success: true, data: results, site: siteParam }), { headers: corsHeaders });
      }

      // 1.10 GET /api/wh/item-history - Thẻ kho: Lịch sử xuất nhập của mã hàng
      if (pathname === '/api/wh/item-history' && request.method === 'GET') {
        const sku = (searchParams.get('sku') || '').trim();
        const siteParam = (searchParams.get('site') || searchParams.get('branch') || 'ALL').trim().toUpperCase();
        if (!sku) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu mã SKU' }), { headers: corsHeaders });
        }

        const isPg = db.isPg(env);
        const sysCfg = await getSystemConfig(env);
        let rows = [];

        if (isPg) {
          const unionParts = [];
          if (sysCfg.history_src_receipts !== false) {
            unionParts.push(`
              SELECT 
                r.receipt_date::date as doc_date,
                r.receipt_code as doc_no,
                'NHAP_KHO' as trans_type,
                CASE 
                  WHEN r.supplier ILIKE '%bếp trung tâm%' THEN 'Nhập từ Bếp Trung Tâm'
                  ELSE 'Nhập mua hàng NCC'
                END as trans_name,
                r.site_code,
                l.batch_code,
                l.exp_date::text as exp_date,
                l.qty::numeric as qty_in,
                0::numeric as qty_out,
                l.unit_price::numeric as unit_price,
                ROUND((l.qty * l.unit_price)::numeric, 0) as amount,
                r.supplier as partner_name,
                COALESCE(l.note, r.notes, '') as notes,
                r.created_at as sort_time
              FROM fnb_stock_receipt_lines l
              JOIN fnb_stock_receipts r ON l.receipt_id = r.id
              WHERE l.item_code = $1 AND ($2 = 'ALL' OR UPPER(r.site_code) = UPPER($2))
            `);
          }
          if (sysCfg.history_src_wastes !== false) {
            unionParts.push(`
              SELECT 
                w.waste_date::date as doc_date,
                w.waste_code as doc_no,
                'XUAT_HUY' as trans_type,
                'Xuất hủy hàng hỏng/hết hạn' as trans_name,
                w.site_code,
                null as batch_code,
                null as exp_date,
                0::numeric as qty_in,
                l.qty::numeric as qty_out,
                l.unit_price::numeric as unit_price,
                ROUND((l.qty * l.unit_price)::numeric, 0) as amount,
                w.created_by as partner_name,
                COALESCE(l.reason_detail, w.notes, '') as notes,
                w.created_at as sort_time
              FROM fnb_stock_waste_lines l
              JOIN fnb_stock_wastes w ON l.waste_id = w.id
              WHERE l.item_code = $1 AND ($2 = 'ALL' OR UPPER(w.site_code) = UPPER($2))
            `);
          }
          if (sysCfg.history_src_kitchen_issues !== false) {
            unionParts.push(`
              SELECT 
                ki.issue_date::date as doc_date,
                ki.issue_code as doc_no,
                'XUAT_BEP' as trans_type,
                'Xuất kho sử dụng bếp' as trans_name,
                ki.site_code,
                null as batch_code,
                null as exp_date,
                0::numeric as qty_in,
                l.qty::numeric as qty_out,
                l.unit_price::numeric as unit_price,
                ROUND((l.qty * l.unit_price)::numeric, 0) as amount,
                ki.issuer_name as partner_name,
                COALESCE(l.notes, ki.notes, ki.meal_shift, '') as notes,
                ki.created_at as sort_time
              FROM fnb_kitchen_issue_lines l
              JOIN fnb_kitchen_issues ki ON l.issue_id = ki.id
              WHERE l.item_code = $1 AND ($2 = 'ALL' OR UPPER(ki.site_code) = UPPER($2))
            `);
          }
          if (sysCfg.history_src_sap_mb51 !== false) {
            unionParts.push(`
              SELECT 
                m.posting_date::date as doc_date,
                m.mat_doc as doc_no,
                CASE 
                  WHEN m.mov_type IN ('101', '102', '561') THEN 'NHAP_KHO'
                  WHEN m.mov_type IN ('551', '552') THEN 'XUAT_HUY'
                  WHEN m.mov_type IN ('351', '352', '309') THEN 'DIEU_CHUYEN'
                  ELSE 'XUAT_KHO'
                END as trans_type,
                COALESCE(m.mov_text_vi, m.mov_text_sap, 'Chứng từ SAP') as trans_name,
                m.site as site_code,
                null as batch_code,
                null as exp_date,
                (CASE WHEN m.quantity > 0 THEN m.quantity ELSE 0 END)::numeric as qty_in,
                (CASE WHEN m.quantity < 0 THEN ABS(m.quantity) ELSE 0 END)::numeric as qty_out,
                ROUND((CASE WHEN m.quantity != 0 THEN ABS(m.amount_lc / m.quantity) ELSE 0 END)::numeric, 0) as unit_price,
                ROUND(ABS(m.amount_lc)::numeric, 0) as amount,
                COALESCE(m.purch_order, m.order_no, m.sales_order, '') as partner_name,
                COALESCE(m.doc_header_text, '') as notes,
                m.posting_date::timestamp as sort_time
              FROM mb51_material_docs m
              WHERE m.material = $1 AND ($2 = 'ALL' OR UPPER(m.site) = UPPER($2))
            `);
          }

          if (unionParts.length > 0) {
            const q = `
              WITH raw_history AS (
                ${unionParts.join('\nUNION ALL\n')}
              )
              SELECT * FROM raw_history
              ORDER BY doc_date DESC, sort_time DESC
              LIMIT 100;
            `;
            const res = await db.query(env, q, [sku, siteParam]);
            rows = res.rows || [];
          }
        }

        let totalIn = 0;
        let totalOut = 0;
        for (const r of rows) {
          totalIn += parseFloat(r.qty_in || 0);
          totalOut += parseFloat(r.qty_out || 0);
        }

        return new Response(JSON.stringify({
          success: true,
          data: {
            sku,
            site: siteParam,
            total_in: Math.round(totalIn * 10) / 10,
            total_out: Math.round(totalOut * 10) / 10,
            history: rows
          }
        }), { headers: corsHeaders });
      }

      // 1.10.1 QUẢN LÝ LÔ HÀNG (CRUD ĐỒNG BỘ XUẤT NHẬP KHO & AUDIT LOGS): /api/wh/batches
      if (pathname === '/api/wh/batches') {
        const isPg = db.isPg(env);
        const safeTxStep = async (tx, fn) => {
          if (!isPg) {
            try { return await fn(); } catch (_) { return null; }
          }
          const sp = 'sp_' + Math.random().toString(36).slice(2, 10);
          await tx.exec(`SAVEPOINT ${sp}`);
          try {
            const res = await fn();
            await tx.exec(`RELEASE SAVEPOINT ${sp}`);
            return res;
          } catch (err) {
            await tx.exec(`ROLLBACK TO SAVEPOINT ${sp}`).catch(() => {});
            await tx.exec(`RELEASE SAVEPOINT ${sp}`).catch(() => {});
            return null;
          }
        };

        if (request.method === 'GET') {
          try {
            const siteParam = (searchParams.get('branch') || searchParams.get('site') || 'ALL').trim().toUpperCase();
            const search = (searchParams.get('search') || '').trim().toLowerCase();

            let q = `
              SELECT
                b.id::text as id,
                b.sku,
                b.branch_id,
                UPPER(COALESCE(br.code, b.branch_id)) as branch_code,
                COALESCE(br.name, b.branch_id) as branch_name,
                b.batch_code,
                b.mfg_date::text as mfg_date,
                b.exp_date::text as exp_date,
                b.qty,
                COALESCE(b.storage_loc, 'Kệ Bếp') as storage_loc,
                b.created_at,
                COALESCE(d.material_desc, p.article_desc, i.name, b.sku) as item_name,
                COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit,
                COALESCE(d.nhom_hang, p.merch_category, i.category, 'Hàng hóa') as category,
                COALESCE(NULLIF(d.price, 0), NULLIF(p.net_price, 0), 0) as unit_price
              FROM inventory_batches b
              LEFT JOIN branches br ON b.branch_id = br.id OR UPPER(br.code) = UPPER(b.branch_id)
              LEFT JOIN (
                SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit, MAX(price) as price
                FROM dim_article_stock GROUP BY material
              ) d ON b.sku = d.material
              LEFT JOIN (
                SELECT article, MAX(article_desc) as article_desc, MAX(merch_category) as merch_category, MAX(order_unit) as order_unit, MAX(net_price) as net_price
                FROM sap_po_items GROUP BY article
              ) p ON b.sku = p.article
              LEFT JOIN items i ON b.sku = i.sku
              WHERE 1=1
            `;
            const params = [];
            if (siteParam && siteParam !== 'ALL') {
              q += ` AND (UPPER(COALESCE(br.code, b.branch_id)) = UPPER(?) OR LOWER(b.branch_id) = LOWER(?))`;
              params.push(siteParam, siteParam);
            }
            if (search) {
              q += ` AND (LOWER(b.sku) LIKE ? OR LOWER(b.batch_code) LIKE ? OR LOWER(COALESCE(d.material_desc, p.article_desc, i.name, '')) LIKE ?)`;
              const like = `%${search}%`;
              params.push(like, like, like);
            }
            q += ` ORDER BY b.exp_date ASC NULLS LAST, b.created_at DESC LIMIT 300`;

            const { rows } = await db.query(env, q, params);
            return new Response(JSON.stringify({ success: true, data: rows || [] }), { headers: corsHeaders });
          } catch (e) {
            console.error('GET /api/wh/batches error:', e);
            return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: corsHeaders });
          }
        }

        if (request.method === 'POST') {
          const caller = await getCallerPermissions(env, request);
          if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
            const p = caller.permissions['wh-stock'];
            if (!p || p.isRevoked || p.canView === false || p.canCreate === false) {
              return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền Thêm lô hàng mới' }), { status: 403, headers: corsHeaders });
            }
          }

          try {
            const body = await request.json();
            const branchCode = String(body.branch_code || body.site_code || 'K001').trim().toUpperCase();
            const sku = String(body.sku || '').trim();
            const batchCode = String(body.batch_code || '').trim();
            const mfgDate = body.mfg_date ? String(body.mfg_date).slice(0, 10) : null;
            const expDate = body.exp_date ? String(body.exp_date).slice(0, 10) : null;
            const qty = Number(body.qty) || 0;
            const storageLoc = String(body.storage_loc || 'Kệ Bếp').trim();
            const note = String(body.note || 'Thêm lô trực tiếp từ Quản lý lô hàng').trim();

            if (!sku || !batchCode || qty <= 0) {
              return new Response(JSON.stringify({ success: false, error: 'Vui lòng nhập đầy đủ Mã hàng, Mã lô và Số lượng > 0' }), { status: 400, headers: corsHeaders });
            }

            const batchId = `bat_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
            const fallbackExp = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
            const finalExp = expDate || fallbackExp;

            await db.withTransaction(env, async (tx) => {
              const brRow = await safeTxStep(tx, () => tx.queryOne(`SELECT id FROM branches WHERE UPPER(code) = UPPER(?) LIMIT 1`, [branchCode]));
              const publicBranchId = brRow?.id || branchCode.toLowerCase();

              const priceRow = await safeTxStep(tx, () => tx.queryOne(`
                SELECT COALESCE(NULLIF(MAX(price), 0), 0) as price FROM dim_article_stock WHERE material = ?
              `, [sku]));
              const unitPrice = Number(priceRow?.price) || 0;
              const lineAmount = qty * unitPrice;

              await tx.exec(`
                INSERT INTO inventory_batches (id, sku, branch_id, batch_code, mfg_date, exp_date, qty, storage_loc, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
              `, [batchId, sku, publicBranchId, batchCode, mfgDate, finalExp, qty, storageLoc]);

              await safeTxStep(tx, () => tx.exec(`
                INSERT INTO wms.inventory_batches (id, sku, branch_id, batch_code, mfg_date, exp_date, qty, storage_loc, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
              `, [batchId, sku, branchCode.toLowerCase(), batchCode, mfgDate, finalExp, qty, storageLoc]));

              await safeTxStep(tx, () => tx.exec(`
                INSERT INTO fnb_stock_balances (item_code, site_code, region, opening_qty, receipt_qty, sales_bom_qty, waste_qty, book_qty, total_value, updated_at)
                VALUES (?, ?, 'Miền Nam', 0, ?, 0, 0, ?, ?, NOW())
                ON CONFLICT (item_code, site_code) DO UPDATE SET
                  receipt_qty = COALESCE(fnb_stock_balances.receipt_qty, 0) + EXCLUDED.receipt_qty,
                  book_qty = COALESCE(fnb_stock_balances.book_qty, 0) + EXCLUDED.receipt_qty,
                  total_value = (COALESCE(fnb_stock_balances.book_qty, 0) + EXCLUDED.receipt_qty) * CASE WHEN ? > 0 THEN ? ELSE 0 END,
                  updated_at = NOW()
              `, [sku, branchCode, qty, qty, lineAmount, unitPrice, unitPrice]));

              await safeTxStep(tx, () => tx.exec(`
                INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note)
                VALUES (?, ?, ?, ?, 'NHAP_LO', ?, ?)
              `, ['tx_' + Math.random().toString(36).slice(2, 11), publicBranchId, sku, batchId, qty, `${batchCode} - ${note}`]));

              await safeTxStep(tx, () => tx.exec(`
                INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                VALUES (?, 'NHAP_LO', ?, ?, ?, ?, ?, ?, ?)
              `, [batchCode, sku, branchCode, qty, unitPrice, lineAmount, note, caller?.user?.email || 'Quản lý kho']));
            });

            invalidateMemoryCache('/api/stock');
            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/wh');

            await writeAuditLog(env, request, {
              userEmail: caller?.user?.email,
              action: 'CREATE',
              entityType: 'BATCH',
              entityId: batchId,
              docCode: batchCode,
              siteCode: branchCode,
              summary: `Thêm lô ${batchCode} cho mã ${sku} (SL: ${qty}, HSD: ${finalExp})`,
              newData: { batchId, branch_code: branchCode, sku, batch_code: batchCode, mfg_date: mfgDate, exp_date: finalExp, qty, storage_loc: storageLoc, note }
            });

            return new Response(JSON.stringify({
              success: true,
              message: `Đã thêm lô ${batchCode} và đồng bộ tồn kho thành công!`,
              data: { id: batchId, batch_code: batchCode }
            }), { headers: corsHeaders });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: 'Lỗi thêm lô: ' + e.message }), { status: 500, headers: corsHeaders });
          }
        }

        if (request.method === 'PUT') {
          const caller = await getCallerPermissions(env, request);
          if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
            const p = caller.permissions['wh-stock'];
            if (!p || p.isRevoked || p.canView === false || !p.canEdit) {
              return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền Sửa lô hàng' }), { status: 403, headers: corsHeaders });
            }
          }

          try {
            const body = await request.json();
            const id = body.id || searchParams.get('id');
            if (!id) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu ID lô hàng' }), { status: 400, headers: corsHeaders });
            }

            const existing = await db.queryOne(env, `SELECT * FROM inventory_batches WHERE id = ?`, [id]);
            if (!existing) {
              return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy lô hàng' }), { status: 404, headers: corsHeaders });
            }

            const brRow = await db.queryOne(env, `SELECT code FROM branches WHERE id = ? OR UPPER(code) = UPPER(?) LIMIT 1`, [existing.branch_id, existing.branch_id]).catch(() => null);
            const branchCode = (brRow?.code || existing.branch_id || 'K001').toUpperCase();

            const newBatchCode = String(body.batch_code || existing.batch_code).trim();
            const newMfg = body.mfg_date !== undefined ? (body.mfg_date ? String(body.mfg_date).slice(0, 10) : null) : existing.mfg_date;
            const newExp = body.exp_date !== undefined ? (body.exp_date ? String(body.exp_date).slice(0, 10) : null) : existing.exp_date;
            const newQty = body.qty !== undefined ? Math.max(0, Number(body.qty) || 0) : (Number(existing.qty) || 0);
            const newLoc = String(body.storage_loc ?? existing.storage_loc ?? 'Kệ Bếp').trim();
            const note = String(body.note || 'Điều chỉnh lô từ Quản lý lô hàng').trim();
            const oldQty = Number(existing.qty) || 0;
            const deltaQty = newQty - oldQty;

            await db.withTransaction(env, async (tx) => {
              await tx.exec(`
                UPDATE inventory_batches
                SET batch_code = ?, mfg_date = ?, exp_date = ?, qty = ?, storage_loc = ?
                WHERE id = ?
              `, [newBatchCode, newMfg, newExp, newQty, newLoc, id]);

              await safeTxStep(tx, () => tx.exec(`
                UPDATE wms.inventory_batches
                SET batch_code = ?, mfg_date = ?, exp_date = ?, qty = ?, storage_loc = ?
                WHERE id = ?
              `, [newBatchCode, newMfg, newExp, newQty, newLoc, id]));

              if (Math.abs(deltaQty) > 0.0001) {
                const priceRow = await safeTxStep(tx, () => tx.queryOne(`
                  SELECT COALESCE(NULLIF(MAX(price), 0), 0) as price FROM dim_article_stock WHERE material = ?
                `, [existing.sku]));
                const unitPrice = Number(priceRow?.price) || 0;

                await safeTxStep(tx, () => tx.exec(`
                  UPDATE fnb_stock_balances
                  SET book_qty = GREATEST(0, COALESCE(book_qty, 0) + ?),
                      total_value = CASE WHEN ? > 0 THEN GREATEST(0, COALESCE(book_qty, 0) + ?) * ? ELSE COALESCE(total_value, 0) END,
                      updated_at = NOW()
                  WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                `, [deltaQty, unitPrice, deltaQty, unitPrice, existing.sku, branchCode]));

                await safeTxStep(tx, () => tx.exec(`
                  INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note)
                  VALUES (?, ?, ?, ?, 'DIEU_CHINH_LO', ?, ?)
                `, ['tx_' + Math.random().toString(36).slice(2, 11), existing.branch_id, existing.sku, id, deltaQty, `${newBatchCode} (${oldQty} → ${newQty}) - ${note}`]));

                await safeTxStep(tx, () => tx.exec(`
                  INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                  VALUES (?, 'DIEU_CHINH_LO', ?, ?, ?, ?, ?, ?, ?)
                `, [newBatchCode, existing.sku, branchCode, deltaQty, unitPrice, deltaQty * unitPrice, `Sửa lô ${newBatchCode}: ${oldQty} → ${newQty}. ${note}`, caller?.user?.email || 'Quản lý kho']));
              }
            });

            invalidateMemoryCache('/api/stock');
            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/wh');

            await writeAuditLog(env, request, {
              userEmail: caller?.user?.email,
              action: 'UPDATE',
              entityType: 'BATCH',
              entityId: id,
              docCode: newBatchCode,
              siteCode: branchCode,
              summary: `Sửa lô ${newBatchCode} (${existing.sku}): SL ${oldQty} → ${newQty}, HSD ${newExp || '—'}`,
              oldData: existing,
              newData: { batch_code: newBatchCode, mfg_date: newMfg, exp_date: newExp, qty: newQty, storage_loc: newLoc, note }
            });

            return new Response(JSON.stringify({
              success: true,
              message: `Đã cập nhật lô ${newBatchCode} và đồng bộ tồn kho thành công!`
            }), { headers: corsHeaders });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: 'Lỗi sửa lô: ' + e.message }), { status: 500, headers: corsHeaders });
          }
        }

        if (request.method === 'DELETE') {
          const caller = await getCallerPermissions(env, request);
          if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
            const p = caller.permissions['wh-stock'];
            if (!p || p.isRevoked || p.canView === false || !p.canDelete) {
              return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền Xóa lô hàng' }), { status: 403, headers: corsHeaders });
            }
          }

          try {
            let id = searchParams.get('id');
            if (!id) {
              try {
                const body = await request.json();
                id = body?.id;
              } catch (_) {}
            }
            if (!id) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu ID lô hàng cần xóa' }), { status: 400, headers: corsHeaders });
            }

            const existing = await db.queryOne(env, `SELECT * FROM inventory_batches WHERE id = ?`, [id]);
            if (!existing) {
              return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy lô hàng' }), { status: 404, headers: corsHeaders });
            }

            const brRow = await db.queryOne(env, `SELECT code FROM branches WHERE id = ? OR UPPER(code) = UPPER(?) LIMIT 1`, [existing.branch_id, existing.branch_id]).catch(() => null);
            const branchCode = (brRow?.code || existing.branch_id || 'K001').toUpperCase();
            const oldQty = Number(existing.qty) || 0;

            await db.withTransaction(env, async (tx) => {
              await tx.exec(`DELETE FROM inventory_batches WHERE id = ?`, [id]);
              await safeTxStep(tx, () => tx.exec(`DELETE FROM wms.inventory_batches WHERE id = ?`, [id]));

              if (oldQty > 0) {
                const priceRow = await safeTxStep(tx, () => tx.queryOne(`
                  SELECT COALESCE(NULLIF(MAX(price), 0), 0) as price FROM dim_article_stock WHERE material = ?
                `, [existing.sku]));
                const unitPrice = Number(priceRow?.price) || 0;

                await safeTxStep(tx, () => tx.exec(`
                  UPDATE fnb_stock_balances
                  SET book_qty = GREATEST(0, COALESCE(book_qty, 0) - ?),
                      total_value = CASE WHEN ? > 0 THEN GREATEST(0, COALESCE(book_qty, 0) - ?) * ? ELSE COALESCE(total_value, 0) END,
                      updated_at = NOW()
                  WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                `, [oldQty, unitPrice, oldQty, unitPrice, existing.sku, branchCode]));

                await safeTxStep(tx, () => tx.exec(`
                  INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note)
                  VALUES (?, ?, ?, ?, 'XOA_LO', ?, ?)
                `, ['tx_' + Math.random().toString(36).slice(2, 11), existing.branch_id, existing.sku, id, oldQty, `Xóa lô ${existing.batch_code}`]));

                await safeTxStep(tx, () => tx.exec(`
                  INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                  VALUES (?, 'XOA_LO', ?, ?, ?, ?, ?, ?, ?)
                `, [existing.batch_code, existing.sku, branchCode, -oldQty, unitPrice, -oldQty * unitPrice, `Xóa lô ${existing.batch_code}`, caller?.user?.email || 'Quản lý kho']));
              }
            });

            invalidateMemoryCache('/api/stock');
            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/wh');

            await writeAuditLog(env, request, {
              userEmail: caller?.user?.email,
              action: 'DELETE',
              entityType: 'BATCH',
              entityId: id,
              docCode: existing.batch_code,
              siteCode: branchCode,
              summary: `Xóa lô ${existing.batch_code} (${existing.sku}, SL: ${oldQty}) và đồng bộ trừ tồn kho`,
              oldData: existing
            });

            return new Response(JSON.stringify({
              success: true,
              message: `Đã xóa lô ${existing.batch_code} và đồng bộ tồn kho!`
            }), { headers: corsHeaders });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: 'Lỗi xóa lô: ' + e.message }), { status: 500, headers: corsHeaders });
          }
        }
      }

      // 1.11 GET /api/wh/item-batches - Chi tiết các lô hàng đã nhập của mã hàng
      if (pathname === '/api/wh/item-batches' && request.method === 'GET') {
        const sku = (searchParams.get('sku') || '').trim();
        const siteParam = (searchParams.get('site') || searchParams.get('branch') || 'ALL').trim().toUpperCase();
        if (!sku) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu mã SKU' }), { headers: corsHeaders });
        }

        const isPg = db.isPg(env);
        let rows = [];

        if (isPg) {
          const q = `
            WITH raw_batches AS (
              SELECT 
                b.id::text,
                b.sku,
                b.batch_code,
                UPPER(COALESCE(br.code, b.branch_id)) as site_code,
                b.mfg_date::text as mfg_date,
                b.exp_date::text as exp_date,
                b.qty::numeric as current_qty,
                b.qty::numeric as initial_qty,
                COALESCE(b.storage_loc, 'Kệ Bếp') as storage_loc,
                'inventory_batches' as source,
                null::text as receipt_code,
                null::text as supplier,
                b.created_at::text as created_at
              FROM inventory_batches b
              LEFT JOIN branches br ON b.branch_id = br.id OR UPPER(br.code) = UPPER(b.branch_id)
              WHERE b.sku = $1 AND ($2 = 'ALL' OR UPPER(COALESCE(br.code, b.branch_id)) = UPPER($2))

              UNION ALL

              SELECT 
                'rc_' || l.id as id,
                l.item_code as sku,
                l.batch_code,
                UPPER(r.site_code) as site_code,
                l.mfg_date::text as mfg_date,
                l.exp_date::text as exp_date,
                l.qty::numeric as current_qty,
                l.qty::numeric as initial_qty,
                'Kệ Bếp' as storage_loc,
                'fnb_stock_receipts' as source,
                r.receipt_code::text as receipt_code,
                r.supplier::text as supplier,
                r.created_at::text as created_at
              FROM fnb_stock_receipt_lines l
              JOIN fnb_stock_receipts r ON l.receipt_id = r.id
              WHERE l.item_code = $1 
                AND l.batch_code IS NOT NULL AND l.batch_code != ''
                AND ($2 = 'ALL' OR UPPER(r.site_code) = UPPER($2))
                AND NOT EXISTS (
                  SELECT 1 FROM inventory_batches ib
                  LEFT JOIN branches ibr ON ib.branch_id = ibr.id OR UPPER(ibr.code) = UPPER(ib.branch_id)
                  WHERE ib.sku = l.item_code 
                    AND UPPER(COALESCE(ibr.code, ib.branch_id)) = UPPER(r.site_code) 
                    AND ib.batch_code = l.batch_code
                )
            )
            SELECT 
              id,
              sku,
              batch_code,
              site_code,
              mfg_date,
              exp_date,
              current_qty,
              initial_qty,
              storage_loc,
              receipt_code,
              supplier,
              CASE 
                WHEN NULLIF(exp_date, '') IS NOT NULL THEN (NULLIF(exp_date, '')::date - CURRENT_DATE)
                ELSE 999
              END as days_left,
              CASE 
                WHEN NULLIF(exp_date, '') IS NULL THEN 'UNKNOWN'
                WHEN (NULLIF(exp_date, '')::date - CURRENT_DATE) < 0 THEN 'EXPIRED'
                WHEN (NULLIF(exp_date, '')::date - CURRENT_DATE) <= 30 THEN 'NEAR_EXPIRY'
                ELSE 'GOOD'
              END as status,
              created_at
            FROM raw_batches
            ORDER BY exp_date ASC NULLS LAST;
          `;
          const res = await db.query(env, q, [sku, siteParam]);
          rows = res.rows || [];
        }

        return new Response(JSON.stringify({
          success: true,
          data: {
            sku,
            site: siteParam,
            batches: rows
          }
        }), { headers: corsHeaders });
      }

      // 1.9.1 GET /api/wh/received-orders - Danh sách các đơn hàng PO, PR đã nhập kho cho tab Tồn kho
      if (pathname === '/api/wh/received-orders' && request.method === 'GET') {
        const siteParam = (searchParams.get('site') || searchParams.get('site_code') || searchParams.get('branch') || 'ALL').trim().toUpperCase();
        const search = (searchParams.get('search') || '').trim().toLowerCase();

        try {
          // 1. Lấy tất cả các phiếu nhập kho fnb_stock_receipts
          let qReceipts = `
            SELECT r.*,
                   COUNT(l.id) as line_count,
                   COALESCE(SUM(l.qty), 0) as total_qty
            FROM fnb_stock_receipts r
            LEFT JOIN fnb_stock_receipt_lines l ON r.id = l.receipt_id
            WHERE 1=1
          `;
          const rParams = [];
          if (siteParam !== 'ALL') {
            qReceipts += ` AND UPPER(r.site_code) = ?`;
            rParams.push(siteParam);
          }
          qReceipts += ` GROUP BY r.id, r.receipt_code, r.site_code, r.receipt_date, r.supplier, r.invoice_no, r.total_amount, r.notes, r.attachment_url, r.created_by, r.created_at ORDER BY r.receipt_date DESC, r.id DESC LIMIT 150`;
          const { rows: receipts } = await db.query(env, qReceipts, rParams);

          // 2. Lấy các PO từ sap_po_items có trạng thái COMPLETED
          let qPo = `
            SELECT 
              po_number,
              site as site_code,
              MAX(doc_date) as receipt_date,
              supplier_code,
              COALESCE(NULLIF(supplier_name, ''), 'Bếp Trung Tâm Siba') as supplier,
              COUNT(*) as line_count,
              SUM(received_qty) as total_qty,
              SUM(received_qty * net_price) as total_amount,
              status
            FROM wms.sap_po_items
            WHERE status = 'COMPLETED'
          `;
          const poParams = [];
          if (siteParam !== 'ALL') {
            qPo += ` AND UPPER(site) = ?`;
            poParams.push(siteParam);
          }
          qPo += ` GROUP BY po_number, site, supplier_code, supplier_name, status
                   ORDER BY MAX(doc_date) DESC, po_number DESC LIMIT 150`;
          const { rows: completedPos } = await db.query(env, qPo, poParams);

          const poNumbersInReceipts = new Set();
          const items = [];

          (receipts || []).forEach(r => {
            const inv = (r.invoice_no || '').trim();
            if (inv) poNumbersInReceipts.add(inv.toUpperCase());
            const isPo = inv.startsWith('PO') || /^\d{10}$/.test(inv) || /^\d{6,}$/.test(inv);
            const isPr = inv.startsWith('PR') || inv.includes('PR');

            items.push({
              id: r.id,
              receipt_code: r.receipt_code,
              po_number: inv || 'Nhập ngoài PO/PR',
              site_code: (r.site_code || '').toUpperCase(),
              receipt_date: r.receipt_date ? (typeof r.receipt_date === 'string' ? r.receipt_date.slice(0, 10) : new Date(r.receipt_date).toISOString().slice(0, 10)) : '',
              supplier: r.supplier || 'N/A',
              item_count: Number(r.line_count) || 0,
              total_qty: Number(r.total_qty) || 0,
              total_amount: Number(r.total_amount) || 0,
              created_by: r.created_by || 'Thủ kho / Bếp trưởng',
              notes: r.notes || '',
              doc_type: isPr ? 'PR' : (isPo ? 'PO' : 'DIRECT'),
              status: 'COMPLETED',
              status_label: 'Đã nhập kho',
              has_receipt_record: true
            });
          });

          (completedPos || []).forEach(po => {
            if (!poNumbersInReceipts.has(po.po_number.toUpperCase())) {
              const isPr = po.po_number.startsWith('PR') || po.po_number.includes('PR');
              items.push({
                id: null,
                receipt_code: `PO-${po.po_number}`,
                po_number: po.po_number,
                site_code: (po.site_code || '').toUpperCase(),
                receipt_date: po.receipt_date ? (typeof po.receipt_date === 'string' ? po.receipt_date.slice(0, 10) : new Date(po.receipt_date).toISOString().slice(0, 10)) : '',
                supplier: po.supplier || 'Bếp Trung Tâm Siba',
                item_count: Number(po.line_count) || 0,
                total_qty: Number(po.total_qty) || 0,
                total_amount: Number(po.total_amount) || 0,
                created_by: 'SAP WMS Sync',
                notes: 'Đơn hàng nhập kho từ hệ thống SAP',
                doc_type: isPr ? 'PR' : 'PO',
                status: 'COMPLETED',
                status_label: 'Đã nhập kho',
                has_receipt_record: false
              });
            }
          });

          // Lọc tìm kiếm
          let filtered = items;
          if (search) {
            filtered = items.filter(it => 
              it.po_number.toLowerCase().includes(search) ||
              it.receipt_code.toLowerCase().includes(search) ||
              it.supplier.toLowerCase().includes(search) ||
              it.site_code.toLowerCase().includes(search) ||
              it.notes.toLowerCase().includes(search)
            );
          }

          return new Response(JSON.stringify({
            success: true,
            data: { orders: filtered, total: filtered.length }
          }), { headers: corsHeaders });
        } catch (err) {
          console.error('Error in /api/wh/received-orders:', err);
          return new Response(JSON.stringify({ success: false, error: err.message }), { headers: corsHeaders, status: 500 });
        }
      }

      // ======================================================================
      // PHÂN HỆ 2: VẬT TƯ, ĐỊNH MỨC SITE & CHỨNG TỪ GIAO NHẬN (PORTAL)
      // ======================================================================

      // 2.1 GET /api/init
      if (pathname === '/api/init' && request.method === 'GET') {
        let sites = [];
        try {
          const res = await db.query(env, `
            SELECT DISTINCT site_code, name, site_name, budget_limit, region, site_type, month_period
            FROM sites
            WHERE site_name IS NOT NULL AND site_name != ''
            ORDER BY site_code
          `);
          sites = res.rows || [];
        } catch (e) {
          console.warn('D1 limit or connection fallback for sites in /api/init:', e.message);
          sites = MASTER_14_SITES_FALLBACK.map(s => ({
            site_code: s.code,
            name: s.name,
            site_name: s.name,
            budget_limit: s.budget,
            region: s.region,
            site_type: 'Trường học',
            month_period: '11/2026'
          }));
        }

        const vungMien = ['Miền Bắc', 'Miền Nam', 'Miền Trung'];
        const loaiHoaDon = [
          'Phiếu nhập kho',
          'Hóa đơn GTGT',
          'Phiếu xuất kho',
          'Biên bản giao nhận',
          'Khác'
        ];

        const now = new Date();
        const thangHienTai = `${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

        const initResponseData = {
          success: true,
          data: {
            sites: sites.map(s => s.site_name),
            siteObjs: sites.map(s => ({
              code: s.site_code,
              name: s.name,
              ten: s.site_name,
              vungMien: s.region || 'Miền Nam',
              budget: s.budget_limit || 0,
              loai: s.site_type
            })),
            vungMien,
            loaiHoaDon,
            thangHienTai,
            maxFileMB: 15
          }
        };
        return createCachedResponse(initResponseData, 300, corsHeaders, isNoCache, url, request, ctx);
      }

      // 2.2 GET /api/quota
      if (pathname === '/api/quota' && request.method === 'GET') {
        const site = searchParams.get('site') || '';
        const thang = searchParams.get('thang') || '';
        const siteCode = extractSiteCode(site);
        const normMonth = normalizeMonth(thang);

        let siteRow = await db.queryOne(env, `
          SELECT * FROM sites WHERE site_name = ? OR site_code = ? OR name = ? LIMIT 1
        `, [site, siteCode, site]);

        const nganSach = siteRow ? (Number(siteRow.budget_limit) || 0) : 0;
        const region = siteRow ? siteRow.region : '';

        // Query accumulated orders with flexible site and month matching
        const daDatQuery = `
          SELECT 
            dh.item_code,
            SUM(dh.order_qty) as total_sl,
            SUM(dh.order_qty * COALESCE(nvl.unit_price, 0)) as total_tien
          FROM don_hang dh
          LEFT JOIN nvl_items nvl ON dh.item_code = nvl.item_code
          WHERE (dh.site_name = ? OR dh.site_name LIKE ?)
            AND dh.status NOT IN ('Đã xóa', 'Đã hủy')
            AND (
              dh.applied_month = ? OR dh.applied_month LIKE ? OR dh.applied_month LIKE ?
            )
          GROUP BY dh.item_code
        `;
        const { rows: daDatRows } = await db.query(env, daDatQuery, [site, `%${siteCode}%`, thang, `%${normMonth}%`, `%${thang}%`]);

        const daDatMap = {};
        let tienDaDat = 0;
        for (const r of (daDatRows || [])) {
          daDatMap[r.item_code] = Number(r.total_sl) || 0;
          tienDaDat += Number(r.total_tien) || 0;
        }

        // Query NVL items with region preference, fallback to all if region empty
        let nvlQuery = `SELECT * FROM nvl_items`;
        let nvlBindings = [];
        if (region && region !== 'Miền Trung') {
          nvlQuery += ` WHERE region = ? OR region IS NULL OR region = '' ORDER BY name`;
          nvlBindings = [region];
        } else {
          nvlQuery += ` ORDER BY name`;
        }

        let { rows: nvlList } = await db.query(env, nvlQuery, nvlBindings);
        if (!nvlList || nvlList.length === 0) {
          const fallback = await db.query(env, `SELECT * FROM nvl_items ORDER BY name`);
          nvlList = fallback.rows || [];
        }

        const { rows: dmList } = await db.query(env, `
          SELECT item_code, quota_qty FROM dinh_muc 
          WHERE (site_name = ? OR site_name LIKE ?) AND (month_period = ? OR month_period = ?)
        `, [site, `%${siteCode}%`, thang, normMonth]);
        const dmMap = {};
        for (const dm of (dmList || [])) {
          dmMap[dm.item_code] = Number(dm.quota_qty) || 0;
        }

        const items = (nvlList || []).map(item => ({
          maHang: item.item_code,
          tenSP: item.name,
          dvt: item.unit,
          donGia: Number(item.unit_price) || 0,
          tenLoai: item.type_name || '',
          vungMien: item.region || '',
          daDat: Number(daDatMap[item.item_code]) || 0,
          dinhMucSL: dmMap[item.item_code] != null ? Number(dmMap[item.item_code]) : null
        }));

        const quotaResponseData = {
          success: true,
          data: {
            site: siteRow ? siteRow.site_name : site,
            nganSach,
            tienDaDat,
            items
          }
        };
        return createCachedResponse(quotaResponseData, 60, corsHeaders, isNoCache, url, request, ctx);
      }

      // 2.3 POST /api/order
      if (pathname === '/api/order' && request.method === 'POST') {
        const payload = await request.json();
        const { site, thang, items, nguoiDat, ghiChu } = payload;

        if (!items || !items.length) {
          return new Response(JSON.stringify({ success: false, error: 'Chưa có mặt hàng nào được nhập số lượng.' }), {
            status: 400,
            headers: corsHeaders
          });
        }

        const maDon = generateCode('DH', site);
        const nowStr = formatDate(new Date());

        const validItems = items.filter(it => (Number(it.soLuong) || 0) > 0);
        if (validItems.length === 0) {
          return new Response(JSON.stringify({ success: false, error: 'Số lượng đặt phải lớn hơn 0.' }), {
            status: 400,
            headers: corsHeaders
          });
        }

        await db.withTransaction(env, async (tx) => {
          for (const it of validItems) {
            const qty = Number(it.soLuong) || 0;
            const luyKe = (Number(it.daDat) || 0) + qty;
            await tx.exec(`
              INSERT INTO don_hang (
                order_code, order_date, site_name, ordered_by, applied_month,
                item_code, item_name, unit, order_qty, accumulated_qty,
                over_quota_note, status
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              maDon, nowStr, site, nguoiDat || 'Người dùng', thang,
              it.maHang, it.tenSP, it.dvt, qty, luyKe,
              it.ghiChu || ghiChu || '', 'Mới tạo'
            ]);
          }

          await tx.exec(`
            INSERT INTO quy_trinh_don (
              order_code, step, step_name, status, action_time, actor, note
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [maDon, 1, 'Gửi đơn hàng', 'Hoàn tất', nowStr, nguoiDat || 'Người dùng', 'Tạo đơn hàng thành công qua Portal']);
        });

        invalidateMemoryCache('/api/orders');
        invalidateMemoryCache('/api/quota');
        invalidateMemoryCache('/api/dashboard-summary');

        return new Response(JSON.stringify({ success: true, data: { maDon, soDong: validItems.length } }), { headers: corsHeaders });
      }

      // 2.3.1 PUT /api/order - Chỉnh sửa đơn hàng (RBAC)
      if ((pathname === '/api/order' || pathname === '/api/orders') && request.method === 'PUT') {
        const caller = await getCallerPermissions(env, request);
        if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
          const p = caller.permissions['portal-history'] || caller.permissions['portal-order'];
          if (!p || !p.canEdit || p.isRevoked || p.canView === false) {
            return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền CHỈNH SỬA đơn hàng này' }), { status: 403, headers: corsHeaders });
          }
        }

        const body = await request.json();
        const { orderCode, maDon, site, orderDate, ngayDat, orderedBy, nguoiDat, status, trangThai, month, thang, items, ghiChu, actor } = body;
        const code = orderCode || maDon;
        if (!code) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu mã đơn hàng cần cập nhật' }), { status: 400, headers: corsHeaders });
        }

        const existing = await db.queryOne(env, `SELECT order_code, site_name, order_date, ordered_by, applied_month, status FROM don_hang WHERE order_code = ? LIMIT 1`, [code]);
        if (!existing) {
          return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy đơn hàng trong hệ thống' }), { status: 404, headers: corsHeaders });
        }

        const newSite = site || existing.site_name;
        const newDate = orderDate || ngayDat || existing.order_date;
        const newOrderedBy = orderedBy || nguoiDat || existing.ordered_by;
        const newStatus = status || trangThai || existing.status || 'Mới tạo';
        const newMonth = month || thang || existing.applied_month;

        await db.withTransaction(env, async (tx) => {
          if (Array.isArray(items) && items.length > 0) {
            const validItems = items.filter(it => (Number(it.soLuong ?? it.order_qty ?? it.qty) || 0) > 0);
            if (validItems.length === 0) {
              throw new Error('Đơn hàng phải có ít nhất 1 mặt hàng có số lượng > 0');
            }

            // Xóa các dòng cũ và chèn lại các dòng đã cập nhật
            await tx.exec(`DELETE FROM don_hang WHERE order_code = ?`, [code]);

            for (const it of validItems) {
              const qty = Number(it.soLuong ?? it.order_qty ?? it.qty) || 0;
              const luyKe = Number(it.luyKe ?? it.accumulated_qty ?? 0) || qty;
              await tx.exec(`
                INSERT INTO don_hang (
                  order_code, order_date, site_name, ordered_by, applied_month,
                  item_code, item_name, unit, order_qty, accumulated_qty,
                  over_quota_note, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                code, newDate, newSite, newOrderedBy, newMonth,
                it.maHang ?? it.item_code, it.tenSP ?? it.item_name, it.dvt ?? it.unit, qty, luyKe,
                it.ghiChu ?? it.over_quota_note ?? ghiChu ?? '', newStatus
              ]);
            }
          } else {
            // Chỉ cập nhật thông tin chung nếu không truyền mảng items
            await tx.exec(`
              UPDATE don_hang SET
                site_name = ?,
                order_date = ?,
                ordered_by = ?,
                applied_month = ?,
                status = ?
              WHERE order_code = ?
            `, [newSite, newDate, newOrderedBy, newMonth, newStatus, code]);
          }

          // Ghi nhận lịch sử chỉnh sửa vào quy_trinh_don
          const nowStr = formatDate(new Date());
          const maxStepRow = await tx.queryOne(`SELECT COALESCE(MAX(step), 1) as max_step FROM quy_trinh_don WHERE order_code = ?`, [code]).catch(() => ({ max_step: 1 }));
          const nextStep = (Number(maxStepRow?.max_step) || 1) + 1;
          await tx.exec(`
            INSERT INTO quy_trinh_don (
              order_code, step, step_name, status, action_time, actor, note
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [code, nextStep, 'Chỉnh sửa đơn hàng', newStatus, nowStr, actor || newOrderedBy || 'Người quản lý', ghiChu || 'Cập nhật thông tin/mặt hàng đơn qua Portal']);
        });

        invalidateMemoryCache('/api/orders');
        invalidateMemoryCache('/api/order-detail');
        invalidateMemoryCache('/api/quota');
        invalidateMemoryCache('/api/dashboard-summary');

        return new Response(JSON.stringify({ success: true, message: 'Đã cập nhật đơn hàng thành công', data: { orderCode: code } }), { headers: corsHeaders });
      }

      // 2.3.2 DELETE /api/order - Xóa đơn hàng (RBAC)
      if ((pathname === '/api/order' || pathname === '/api/orders') && request.method === 'DELETE') {
        const caller = await getCallerPermissions(env, request);
        if (caller) {
          if (caller.user.status === 'LOCKED' || caller.user.role_code === 'UNKNOWN') {
            return new Response(JSON.stringify({ success: false, error: 'Tài khoản không hợp lệ hoặc đã bị khóa' }), { status: 403, headers: corsHeaders });
          }
          if (!caller.isMaster && caller.user.role_code !== 'ADMIN') {
            const p = caller.permissions['portal-history'] || caller.permissions['portal-order'];
            if (!p || !p.canDelete || p.isRevoked || p.canView === false) {
              return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền XÓA đơn hàng này' }), { status: 403, headers: corsHeaders });
            }
          }
        }

        let code = searchParams.get('orderCode') || searchParams.get('maDon');
        if (!code) {
          try {
            const body = await request.json();
            code = body.orderCode || body.maDon;
          } catch(e) {}
        }
        if (!code) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu mã đơn hàng cần xóa' }), { status: 400, headers: corsHeaders });
        }

        const existing = await db.queryOne(env, `SELECT * FROM don_hang WHERE order_code = ? LIMIT 1`, [code]);
        if (!existing) {
          return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy đơn hàng trong hệ thống' }), { status: 404, headers: corsHeaders });
        }
        const { rows: oldSteps } = await db.query(env, `SELECT * FROM quy_trinh_don WHERE order_code = ?`, [code]).catch(() => ({ rows: [] }));

        await db.withTransaction(env, async (tx) => {
          await tx.exec(`DELETE FROM quy_trinh_don WHERE order_code = ?`, [code]);
          await tx.exec(`DELETE FROM don_hang WHERE order_code = ?`, [code]);
        });

        await writeAuditLog(env, request, {
          userEmail: caller?.user?.email,
          action: 'DELETE',
          entityType: 'ORDER',
          entityId: code,
          docCode: code,
          siteCode: existing.site_code || existing.branch_code || null,
          summary: `Xóa đơn đặt hàng ${code}`,
          oldData: { header: existing, steps: oldSteps || [] }
        });

        invalidateMemoryCache('/api/orders');
        invalidateMemoryCache('/api/order-detail');
        invalidateMemoryCache('/api/quota');
        invalidateMemoryCache('/api/dashboard-summary');

        return new Response(JSON.stringify({ success: true, message: 'Đã xóa đơn hàng thành công', data: { orderCode: code } }), { headers: corsHeaders });
      }

      // 2.3.3 POST /api/order-journey - Xác thực & Cập nhật tiến độ hành trình đơn hàng (RBAC Admin/Kho trưởng)
      if ((pathname === '/api/order-journey' || pathname === '/api/order-step') && request.method === 'POST') {
        const body = await request.json();
        const { orderCode, maDon, step, buoc, stepName, tenBuoc, status, trangThai, note, ghiChu, actor, nguoiXuLy, orderStatus } = body;
        const code = (orderCode || maDon || '').trim();
        const numStep = Number(step || buoc);
        const nameStep = (stepName || tenBuoc || '').trim();
        const stepStatus = (status || trangThai || 'Hoàn thành').trim();
        const actorName = (actor || nguoiXuLy || 'Admin').trim();
        const stepNote = (note || ghiChu || '').trim();

        if (!code) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu mã đơn hàng' }), { status: 400, headers: corsHeaders });
        }
        if (!numStep || numStep < 1 || numStep > 7) {
          return new Response(JSON.stringify({ success: false, error: 'Bước quy trình không hợp lệ (phải từ 1 đến 7)' }), { status: 400, headers: corsHeaders });
        }

        const existing = await db.queryOne(env, `SELECT order_code, site_name, order_date, status FROM don_hang WHERE order_code = ? LIMIT 1`, [code]);
        if (!existing) {
          return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy đơn hàng trong hệ thống' }), { status: 404, headers: corsHeaders });
        }

        const nowStr = new Date().toISOString();

        // 7 bước chuẩn trong quy trình đặt hàng
        const stepDefaultNames = {
          1: 'Quản lý site đặt hàng',
          2: 'Admin tiếp nhận đơn hàng',
          3: 'Chuyển bộ phận Trưởng Kho',
          4: 'Kho mail cho PMH',
          5: 'PMH tiếp nhận & đặt hàng',
          6: 'Vận chuyển về kho',
          7: 'Kho giao về các site'
        };

        const resolvedStepName = nameStep || stepDefaultNames[numStep] || `Bước ${numStep}`;

        const stepToOrderStatus = {
          1: 'Đã xuất phiếu',
          2: 'Admin đã tiếp nhận',
          3: 'Đang xử lý: Chuyển bộ phận Trưởng Kho',
          4: 'Kho đã mail PMH',
          5: 'PMH tiếp nhận & đặt hàng',
          6: 'Vận chuyển về kho',
          7: 'Đã giao về site'
        };
        const newOrderStatus = orderStatus || stepToOrderStatus[numStep] || existing.status;

        await db.withTransaction(env, async (tx) => {
          const existingStep = await tx.queryOne(`SELECT step FROM quy_trinh_don WHERE order_code = ? AND step = ? LIMIT 1`, [code, numStep]);
          if (existingStep) {
            await tx.exec(`
              UPDATE quy_trinh_don
              SET step_name = ?, status = ?, action_time = ?, actor = ?, note = ?
              WHERE order_code = ? AND step = ?
            `, [resolvedStepName, stepStatus, nowStr, actorName, stepNote, code, numStep]);
          } else {
            await tx.exec(`
              INSERT INTO quy_trinh_don (
                order_code, step, step_name, status, action_time, actor, note
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [code, numStep, resolvedStepName, stepStatus, nowStr, actorName, stepNote]);
          }

          // Cập nhật trạng thái tổng quan trong don_hang
          await tx.exec(`UPDATE don_hang SET status = ? WHERE order_code = ?`, [newOrderStatus, code]);
        });

        invalidateMemoryCache('/api/orders');
        invalidateMemoryCache('/api/order-detail');
        invalidateMemoryCache('/api/quota');
        invalidateMemoryCache('/api/dashboard-summary');

        // Lấy timeline cập nhật
        const { rows: updatedTimeline } = await db.query(env, `
          SELECT step as buoc, step_name as tenBuoc, status as trangThai, action_time as thoiGian, actor as nguoiXuLy, note as ghiChu
          FROM quy_trinh_don WHERE order_code = ? ORDER BY step ASC, action_time ASC
        `, [code]);

        return new Response(JSON.stringify({
          success: true,
          message: `Đã xác thực thành công Bước ${numStep}: ${resolvedStepName}`,
          data: {
            orderCode: code,
            currentStep: numStep,
            currentStepName: resolvedStepName,
            orderStatus: newOrderStatus,
            timeline: (updatedTimeline || []).map(t => ({
              buoc: t.buoc,
              tenBuoc: t.tenBuoc ?? t.tenbuoc,
              trangThai: t.trangThai ?? t.trangthai,
              thoiGian: t.thoiGian ?? t.thoigian,
              nguoiXuLy: t.nguoiXuLy ?? t.nguoixuly,
              ghiChu: t.ghiChu ?? t.ghichu
            }))
          }
        }), { headers: corsHeaders });
      }

      // 2.4 GET /api/orders
      if (pathname === '/api/orders' && request.method === 'GET') {
        const site = searchParams.get('site') || '';
        const thang = searchParams.get('thang') || '';
        const siteCode = extractSiteCode(site);
        const normMonth = normalizeMonth(thang);

        let query = `
          SELECT 
            dh.order_code as maDon,
            dh.order_date as ngayDat,
            dh.site_name as site,
            dh.ordered_by as nguoiDat,
            dh.applied_month as thang,
            dh.status as trangThai,
            COUNT(dh.id) as soDong,
            SUM(dh.order_qty) as tongSL,
            SUM(dh.order_qty * COALESCE(nvl.unit_price, 0)) as tongTien,
            (SELECT MAX(qtd.step) FROM quy_trinh_don qtd WHERE qtd.order_code = dh.order_code) as currentStep,
            (SELECT qtd.step_name FROM quy_trinh_don qtd WHERE qtd.order_code = dh.order_code ORDER BY qtd.step DESC, qtd.action_time DESC LIMIT 1) as currentStepName
          FROM don_hang dh
          LEFT JOIN nvl_items nvl ON dh.item_code = nvl.item_code
        `;

        const conditions = [];
        const bindings = [];

        if (site && site.trim() && site.toUpperCase() !== 'ALL') {
          conditions.push('(dh.site_name = ? OR dh.site_name LIKE ?)');
          bindings.push(site, `%${siteCode}%`);
        }
        if (thang && thang.trim()) {
          conditions.push('(dh.applied_month LIKE ? OR dh.applied_month LIKE ? OR dh.applied_month = ?)');
          bindings.push(`%${normMonth}%`, `%${thang}%`, thang);
        }

        if (conditions.length) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ` GROUP BY dh.order_code, dh.order_date, dh.site_name, dh.ordered_by, dh.applied_month, dh.status ORDER BY dh.order_date DESC`;

        const { rows: rawResults } = await db.query(env, query, bindings);
        const results = (rawResults || []).map(r => ({
          maDon: r.maDon ?? r.madon,
          ngayDat: r.ngayDat ?? r.ngaydat,
          site: r.site,
          nguoiDat: r.nguoiDat ?? r.nguoidat,
          thang: r.thang,
          trangThai: r.trangThai ?? r.trangthai,
          soDong: Number(r.soDong ?? r.sodong ?? 0),
          tongSL: Number(r.tongSL ?? r.tongsl ?? 0),
          tongTien: Number(r.tongTien ?? r.tongtien ?? 0),
          currentStep: Number(r.currentStep ?? r.currentstep ?? 1),
          currentStepName: r.currentStepName ?? r.currentstepname ?? ''
        }));
        return createCachedResponse({ success: true, data: results }, 60, corsHeaders, isNoCache, url, request, ctx);
      }

      // 2.5 GET /api/order-detail
      if (pathname === '/api/order-detail' && request.method === 'GET') {
        const orderCode = searchParams.get('orderCode') || '';
        const { rows: rawItems } = await db.query(env, `
          SELECT 
            dh.item_code as maHang,
            dh.item_name as tenSP,
            dh.unit as dvt,
            dh.order_qty as soLuong,
            dh.accumulated_qty as luyKe,
            dh.over_quota_note as ghiChu,
            COALESCE(nvl.unit_price, 0) as donGia,
            (dh.order_qty * COALESCE(nvl.unit_price, 0)) as thanhTien
          FROM don_hang dh
          LEFT JOIN nvl_items nvl ON dh.item_code = nvl.item_code
          WHERE dh.order_code = ?
          ORDER BY dh.id
        `, [orderCode]);

        const items = (rawItems || []).map(i => ({
          maHang: i.maHang ?? i.mahang,
          tenSP: i.tenSP ?? i.tensp,
          dvt: i.dvt,
          soLuong: Number(i.soLuong ?? i.soluong ?? 0),
          luyKe: Number(i.luyKe ?? i.luyke ?? 0),
          ghiChu: i.ghiChu ?? i.ghichu ?? '',
          donGia: Number(i.donGia ?? i.dongia ?? 0),
          thanhTien: Number(i.thanhTien ?? i.thanhtien ?? 0)
        }));

        const { rows: rawTimeline } = await db.query(env, `
          SELECT step as buoc, step_name as tenBuoc, status as trangThai, action_time as thoiGian, actor as nguoiXuLy, note as ghiChu
          FROM quy_trinh_don WHERE order_code = ? ORDER BY step ASC, action_time ASC
        `, [orderCode]);

        const timeline = (rawTimeline || []).map(t => ({
          buoc: t.buoc,
          tenBuoc: t.tenBuoc ?? t.tenbuoc,
          trangThai: t.trangThai ?? t.trangthai,
          thoiGian: t.thoiGian ?? t.thoigian,
          nguoiXuLy: t.nguoiXuLy ?? t.nguoixuly,
          ghiChu: t.ghiChu ?? t.ghichu
        }));

        const summary = await db.queryOne(env, `
          SELECT order_code, order_date, site_name, ordered_by, applied_month, status
          FROM don_hang WHERE order_code = ? LIMIT 1
        `, [orderCode]);

        return createCachedResponse({ success: true, data: { info: summary, items: items, timeline: timeline } }, 120, corsHeaders, isNoCache, url, request, ctx);
      }

      // 2.6 GET /api/vouchers
      if (pathname === '/api/vouchers' && request.method === 'GET') {
        const site = searchParams.get('site') || '';
        const loai = searchParams.get('loaiHoaDon') || '';
        const tuNgay = searchParams.get('tuNgay') || '';
        const denNgay = searchParams.get('denNgay') || '';
        const siteCode = extractSiteCode(site);

        let query = `SELECT * FROM chung_tu`;
        const conditions = [];
        const bindings = [];

        if (site && site.trim()) {
          conditions.push('(site_name = ? OR site_name LIKE ?)');
          bindings.push(site, `%${siteCode}%`);
        }
        if (loai && loai.trim()) {
          conditions.push('invoice_type = ?');
          bindings.push(loai);
        }
        if (tuNgay && tuNgay.trim()) {
          conditions.push('receive_date >= ?');
          bindings.push(tuNgay);
        }
        if (denNgay && denNgay.trim()) {
          conditions.push('receive_date <= ?');
          bindings.push(denNgay);
        }

        if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
        query += ` ORDER BY created_at DESC`;

        const { rows: results } = await db.query(env, query, bindings);
        const { rows: fileCounts } = await db.query(env, `
          SELECT voucher_code, COUNT(id) as cnt FROM chung_tu_file GROUP BY voucher_code
        `);
        const fileMap = {};
        for (const f of (fileCounts || [])) fileMap[f.voucher_code] = f.cnt;

        const data = (results || []).map(r => ({
          maCT: r.voucher_code,
          site: r.site_name,
          loaiHoaDon: r.invoice_type,
          ngayXuat: r.invoice_date,
          ngayNhan: r.receive_date,
          nguoiGiao: r.deliverer_name,
          nguoiNhan: r.receiver_name,
          nhaCungCap: r.supplier_name,
          ghiChu: r.note,
          nguoiNhap: r.created_by,
          soFile: fileMap[r.voucher_code] || (r.attachment_link ? 1 : 0),
          fileChinh: r.attachment_link
        }));

        return createCachedResponse({ success: true, data }, 60, corsHeaders, isNoCache, url, request, ctx);
      }

      // 2.7 POST /api/voucher
      if (pathname === '/api/voucher' && request.method === 'POST') {
        const body = await request.json();
        const { site, loaiHoaDon, ngayXuat, ngayNhan, nguoiGiao, nguoiNhan, nhaCungCap, ghiChu, nguoiNhap, files } = body;
        const maCT = generateCode('CT', site);
        const nowStr = formatDate(new Date());

        await db.withTransaction(env, async (tx) => {
          await tx.exec(`
            INSERT INTO chung_tu (voucher_code, site_name, invoice_type, invoice_date, receive_date, deliverer_name, receiver_name, supplier_name, note, created_at, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [maCT, site, loaiHoaDon, ngayXuat || nowStr, ngayNhan || nowStr, nguoiGiao || '', nguoiNhan || '', nhaCungCap || '', ghiChu || '', nowStr, nguoiNhap || 'Thủ kho']);

          if (files && files.length) {
            for (const f of files) {
              await tx.exec(`
                INSERT INTO chung_tu_file (voucher_code, file_name, file_link, file_type, upload_date)
                VALUES (?, ?, ?, ?, ?)
              `, [maCT, f.name || 'Tài liệu', f.url || '', f.type || 'IMAGE', nowStr]);
            }
          }
        });

        invalidateMemoryCache('/api/vouchers');
        return new Response(JSON.stringify({ success: true, data: { maCT } }), { headers: corsHeaders });
      }

      // 2.7.2 PUT /api/voucher - Cập nhật chứng từ
      if (pathname === '/api/voucher' && request.method === 'PUT') {
        const caller = await getCallerPermissions(env, request);
        if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
          const p = caller.permissions['portal-voucher'] || caller.permissions['portal-search'];
          if (!p || !p.canEdit || p.isRevoked || p.canView === false) {
            return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền CHỈNH SỬA chứng từ này' }), { status: 403, headers: corsHeaders });
          }
        }

        const body = await request.json();
        const { maCT, site, loaiHoaDon, ngayXuat, ngayNhan, nguoiGiao, nguoiNhan, nhaCungCap, ghiChu, files, updateFiles } = body;
        if (!maCT) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu mã chứng từ cần cập nhật' }), { status: 400, headers: corsHeaders });
        }

        const existing = await db.queryOne(env, `SELECT voucher_code FROM chung_tu WHERE voucher_code = ?`, [maCT]);
        if (!existing) {
          return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy chứng từ trong hệ thống' }), { status: 404, headers: corsHeaders });
        }

        const nowStr = formatDate(new Date());
        const shouldUpdateFiles = updateFiles === true || Array.isArray(files);
        const normalizedFiles = Array.isArray(files) ? files.filter(f => f && (f.url || f.file_link)) : [];
        const firstLink = normalizedFiles.length > 0 ? (normalizedFiles[0].url || normalizedFiles[0].file_link || '') : '';

        await db.withTransaction(env, async (tx) => {
          await tx.exec(`
            UPDATE chung_tu SET
              site_name = COALESCE(?, site_name),
              invoice_type = COALESCE(?, invoice_type),
              invoice_date = COALESCE(?, invoice_date),
              receive_date = COALESCE(?, receive_date),
              supplier_name = ?,
              deliverer_name = ?,
              receiver_name = ?,
              note = ?
              ${shouldUpdateFiles ? ', attachment_link = ?' : ''}
            WHERE voucher_code = ?
          `, shouldUpdateFiles ? [
            site || null,
            loaiHoaDon || null,
            ngayXuat || null,
            ngayNhan || null,
            nhaCungCap !== undefined ? nhaCungCap : '',
            nguoiGiao !== undefined ? nguoiGiao : '',
            nguoiNhan !== undefined ? nguoiNhan : '',
            ghiChu !== undefined ? ghiChu : '',
            firstLink,
            maCT
          ] : [
            site || null,
            loaiHoaDon || null,
            ngayXuat || null,
            ngayNhan || null,
            nhaCungCap !== undefined ? nhaCungCap : '',
            nguoiGiao !== undefined ? nguoiGiao : '',
            nguoiNhan !== undefined ? nguoiNhan : '',
            ghiChu !== undefined ? ghiChu : '',
            maCT
          ]);

          if (shouldUpdateFiles) {
            await tx.exec(`DELETE FROM chung_tu_file WHERE voucher_code = ?`, [maCT]);
            for (const f of normalizedFiles) {
              await tx.exec(`
                INSERT INTO chung_tu_file (voucher_code, file_name, file_link, file_type, upload_date)
                VALUES (?, ?, ?, ?, ?)
              `, [maCT, f.name || f.file_name || 'Tài liệu', f.url || f.file_link || '', f.type || f.file_type || 'IMAGE', nowStr]);
            }
          }
        });

        invalidateMemoryCache('/api/vouchers');
        return new Response(JSON.stringify({ success: true, message: 'Đã cập nhật chứng từ thành công', data: { maCT } }), { headers: corsHeaders });
      }

      // 2.7.3 DELETE /api/voucher - Xóa chứng từ
      if (pathname === '/api/voucher' && request.method === 'DELETE') {
        const caller = await getCallerPermissions(env, request);
        if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
          const p = caller.permissions['portal-voucher'] || caller.permissions['portal-search'];
          if (!p || !p.canDelete || p.isRevoked || p.canView === false) {
            return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền XÓA chứng từ này' }), { status: 403, headers: corsHeaders });
          }
        }

        let maCT = searchParams.get('maCT');
        if (!maCT) {
          try {
            const body = await request.json();
            maCT = body.maCT;
          } catch(e) {}
        }
        if (!maCT) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu mã chứng từ cần xóa' }), { status: 400, headers: corsHeaders });
        }

        const existing = await db.queryOne(env, `SELECT * FROM chung_tu WHERE voucher_code = ?`, [maCT]);
        if (!existing) {
          return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy chứng từ trong hệ thống' }), { status: 404, headers: corsHeaders });
        }
        const { rows: oldFiles } = await db.query(env, `SELECT * FROM chung_tu_file WHERE voucher_code = ?`, [maCT]).catch(() => ({ rows: [] }));

        await db.withTransaction(env, async (tx) => {
          await tx.exec(`DELETE FROM chung_tu_file WHERE voucher_code = ?`, [maCT]);
          await tx.exec(`DELETE FROM chung_tu WHERE voucher_code = ?`, [maCT]);
        });

        await writeAuditLog(env, request, {
          userEmail: caller?.user?.email,
          action: 'DELETE',
          entityType: 'VOUCHER',
          entityId: maCT,
          docCode: maCT,
          siteCode: existing.site_code || existing.branch_code || null,
          summary: `Xóa chứng từ ${maCT}`,
          oldData: { header: existing, files: oldFiles || [] }
        });

        invalidateMemoryCache('/api/vouchers');
        return new Response(JSON.stringify({ success: true, message: 'Đã xóa chứng từ thành công', data: { maCT } }), { headers: corsHeaders });
      }

      // 2.7.1 POST /api/vouchers/import - Nhập hàng loạt từ Excel
      if (pathname === '/api/vouchers/import' && request.method === 'POST') {
        const body = await request.json();
        const { items } = body;
        if (!items || !items.length) {
          return new Response(JSON.stringify({ success: false, error: 'Không có dữ liệu import' }), { status: 400, headers: corsHeaders });
        }
        const nowStr = formatDate(new Date());
        let count = 0;
        await db.withTransaction(env, async (tx) => {
          for (const item of items) {
            const site = item.site || item.site_name || '';
            if (!site) continue;
            const maCT = generateCode('CT', site);
            await tx.exec(`
              INSERT INTO chung_tu (voucher_code, site_name, invoice_type, invoice_date, receive_date, deliverer_name, receiver_name, supplier_name, note, created_at, created_by)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              maCT, site, item.loaiHoaDon || 'Hóa đơn GTGT',
              item.ngayXuat || nowStr, item.ngayNhan || nowStr,
              item.nguoiGiao || '', item.nguoiNhan || '',
              item.nhaCungCap || '', item.ghiChu || '',
              nowStr, item.nguoiNhap || 'Import Excel'
            ]);

            if (item.linkAnh && String(item.linkAnh).trim()) {
              const links = String(item.linkAnh).split(',').map(s => s.trim()).filter(Boolean);
              for (let idx = 0; idx < links.length; idx++) {
                await tx.exec(`
                  INSERT INTO chung_tu_file (voucher_code, file_name, file_link, file_type, upload_date)
                  VALUES (?, ?, ?, ?, ?)
                `, [maCT, `Ảnh đính kèm ${idx + 1}`, links[idx], 'DRIVE_LINK', nowStr]);
              }
            }
            count++;
          }
        });

        invalidateMemoryCache('/api/vouchers');
        return new Response(JSON.stringify({ success: true, count, message: `Đã import thành công ${count} chứng từ` }), { headers: corsHeaders });
      }

      // 2.8 GET /api/voucher-detail
      if (pathname === '/api/voucher-detail' && request.method === 'GET') {
        const maCT = searchParams.get('maCT');
        const voucher = await db.queryOne(env, `SELECT * FROM chung_tu WHERE voucher_code = ?`, [maCT]);
        if (!voucher) return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy chứng từ' }), { status: 404, headers: corsHeaders });

        const { rows: files } = await db.query(env, `
          SELECT file_name, file_link, file_type, upload_date FROM chung_tu_file WHERE voucher_code = ?
        `, [maCT]);

        const allFiles = [...(files || [])];
        if (voucher.attachment_link && !allFiles.some(f => f.file_link === voucher.attachment_link)) {
          allFiles.unshift({
            file_name: 'File_chung_tu_goc.jpg',
            file_link: voucher.attachment_link,
            file_type: 'image/jpeg',
            upload_date: voucher.created_at || voucher.invoice_date || ''
          });
        }

        return new Response(JSON.stringify({ success: true, data: { ...voucher, files: allFiles } }), { headers: corsHeaders });
      }

      // 2.9 GET /api/inventory-audit & POST
      if (pathname === '/api/inventory-audit') {
        if (request.method === 'GET') {
          const site = searchParams.get('site') || '';
          const siteCode = extractSiteCode(site);
          let results = [];

          // 1. First priority: Load items from dim_article_stock for the selected site
          if (siteCode && siteCode !== 'ALL') {
            try {
              const res = await db.query(env, `
                SELECT 
                  d.id,
                  d.site as site_code,
                  COALESCE(d.site_name, b.name, d.site) as site_name,
                  d.material as item_code,
                  d.material_desc as item_name,
                  COALESCE(d.nganh_hang, 'Chưa phân loại') as nganh_hang,
                  COALESCE(d.nhom_hang, 'Chưa phân loại') as nhom_hang,
                  d.entry_unit as unit,
                  COALESCE(d.price, 0) as price,
                  COALESCE(k.closing_t10, bal.book_qty, 0) as closing_t10,
                  COALESCE(k.closing_t9, bal.opening_qty, 0) as closing_t9,
                  k.usage_t11,
                  k.closing_t11,
                  COALESCE(k.warehouse_code, 'KHO') as warehouse_code,
                  k.warehouse_name
                FROM dim_article_stock d
                LEFT JOIN branches b ON d.site = b.code
                LEFT JOIN kiemke_tonkho k ON d.site = k.site_code AND d.material = k.item_code
                LEFT JOIN fnb_stock_balances bal ON d.site = bal.site_code AND d.material = bal.item_code
                WHERE d.site = ?
                ORDER BY d.nhom_hang, d.material
              `, [siteCode]);
              results = res.rows || [];
            } catch (e) {
              console.warn('dim_article_stock audit query failed:', e.message);
            }
          }

          // 2. Fallback to kiemke_tonkho if dim_article_stock has no rows for this site (or ALL)
          if (!results.length) {
            let query = `SELECT * FROM kiemke_tonkho`;
            const bindings = [];
            if (siteCode && siteCode !== 'ALL') {
              query += ` WHERE site_code = ? OR site_name = ? OR full_site_name LIKE ?`;
              bindings.push(siteCode, site, `%${siteCode}%`);
            }
            query += ` ORDER BY item_code LIMIT 1000`;
            try {
              const res = await db.query(env, query, bindings);
              results = res.rows || [];
            } catch (e) {}
          }

          // Metadata for frontend filters
          const nganhSet = new Set();
          const nhomSet = new Set();
          for (const r of results) {
            if (r.nganh_hang && r.nganh_hang !== 'Chưa phân loại') nganhSet.add(r.nganh_hang);
            if (r.nhom_hang && r.nhom_hang !== 'Chưa phân loại') nhomSet.add(r.nhom_hang);
          }
          const meta = {
            site_code: siteCode,
            nganh_hang: Array.from(nganhSet).sort(),
            nhom_hang: Array.from(nhomSet).sort(),
            total: results.length
          };

          return new Response(JSON.stringify({ success: true, data: results, meta }), { headers: corsHeaders });
        }
        if (request.method === 'POST') {
          const body = await request.json();
          const { items } = body;
          if (items && items.length) {
            await db.withTransaction(env, async (tx) => {
              for (const it of items) {
                const existing = await tx.queryOne(
                  `SELECT id FROM kiemke_tonkho WHERE (id = ? AND ? IS NOT NULL) OR (site_code = ? AND item_code = ?) LIMIT 1`,
                  [it.id, it.id, it.site_code, it.item_code]
                );
                if (existing) {
                  await tx.exec(
                    `UPDATE kiemke_tonkho SET usage_t11 = ?, closing_t11 = ? WHERE id = ?`,
                    [it.usage, it.closing, existing.id]
                  );
                } else if (it.site_code && it.item_code) {
                  await tx.exec(
                    `INSERT INTO kiemke_tonkho (site_code, item_code, item_name, unit, usage_t11, closing_t11) VALUES (?, ?, ?, ?, ?, ?)`,
                    [it.site_code, it.item_code, it.item_name || '', it.unit || '', it.usage, it.closing]
                  );
                }
              }
            });
          }
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
      }

      // 2.10 GET & POST /api/report & /api/daily-report
      if ((pathname === '/api/report' || pathname === '/api/daily-report') && request.method === 'GET') {
        const branch = searchParams.get('branch') || 'ALL';
        let query = `
          SELECT r.*, b.name as branch_name, b.code as branch_code
          FROM daily_catering_reports r
          LEFT JOIN branches b ON r.branch_id = b.id
        `;
        let bindings = [];
        if (branch && branch !== 'ALL') {
          query += ` WHERE b.code = ? OR r.branch_id = ? `;
          bindings.push(branch, branch);
        }
        query += ` ORDER BY r.report_date DESC, r.created_at DESC LIMIT 100`;
        const { rows: results } = await db.query(env, query, bindings);
        return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
      }

      if ((pathname === '/api/report' || pathname === '/api/daily-report') && request.method === 'POST') {
        const body = await request.json();
        const {
          branchCode, site, reportDate, reporterName,
          plannedMeals, actualMeals, wastedMeals, staffActual, staffStandard,
          foodQualityNote, feedback, extraCost, images,
          reportData
        } = body;
        const nowStr = formatDate(new Date());
        const id = 'RPT-' + Date.now();
        const siteCode = extractSiteCode(site || branchCode || 'k001').toLowerCase();
        const branchRow = await db.queryOne(env, `SELECT id FROM branches WHERE id = ? OR LOWER(code) = ? LIMIT 1`, [siteCode, siteCode]);
        const validBranchId = branchRow ? branchRow.id : 'k505';
        const imgLinkStr = Array.isArray(images) ? images.map(im => im.name || im.url).join(' , ') : (images || '');

        await db.exec(env, `
          INSERT INTO daily_catering_reports (
            id, branch_id, report_date, planned_meals, actual_meals, wasted_meals,
            staff_actual, staff_standard, food_quality_note, customer_feedback, extra_cost,
            created_at, reporter_name, report_data, images_link
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id, validBranchId, reportDate || nowStr,
          Number(plannedMeals) || 0, Number(actualMeals) || 0, Number(wastedMeals) || 0,
          Number(staffActual) || 0, Number(staffStandard) || 0,
          foodQualityNote || '', feedback || '', Number(extraCost) || 0,
          nowStr, reporterName || 'Quản lý Site',
          typeof reportData === 'object' ? JSON.stringify(reportData) : (reportData || '{}'),
          imgLinkStr
        ]);

        return new Response(JSON.stringify({
          success: true,
          data: {
            id,
            tongSuatAn: Number(actualMeals) || Number(plannedMeals) || 0
          }
        }), { headers: corsHeaders });
      }

      
            // 2.11.0 LẤY THÔNG TIN VÀ PHÂN QUYỀN MỚI NHẤT CỦA USER (/api/auth/me)
      if (pathname === '/api/auth/me' && request.method === 'GET') {
        const email = searchParams.get('email');
        if (!email) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu email' }), { status: 400, headers: corsHeaders });
        }

        const authCacheKey = 'auth_me_' + email.toLowerCase().trim();
        if (!isNoCache) {
          const cached = getMemoryCache(authCacheKey);
          if (cached) {
            const resp = new Response(JSON.stringify(cached), { headers: corsHeaders });
            resp.headers.set('X-D1-Cache', 'RAM-HIT');
            return resp;
          }
        }

        try {
          let user = await db.queryOne(env, `SELECT * FROM app_users WHERE email = ? LIMIT 1`, [email]);
          if (!user) {
            // Nếu chưa có trong DB nhưng là Owner
            if (email === 'trantuandai2508@gmail.com') {
              user = { id: 1, email, full_name: 'Trần Tuấn Đại', role_code: 'ADMIN', status: 'ACTIVE' };
            } else {
              return new Response(JSON.stringify({ success: false, error: 'User không tồn tại' }), { status: 404, headers: corsHeaders });
            }
          }

          // NẾU TÀI KHOẢN ĐÃ BỊ KHÓA -> CHẶN TUYỆT ĐỐI KHÔNG TRẢ VỀ QUYỀN
          if (user.status === 'LOCKED') {
            return new Response(JSON.stringify({
              success: false,
              isLocked: true,
              error: 'Tài khoản của bạn đã bị khóa bởi Quản trị viên. Bạn không có quyền truy cập hệ thống.',
              data: {
                user: {
                  id: user.id,
                  email: user.email,
                  fullName: repairAtobMojibake(user.full_name),
                  role: user.role_code,
                  status: 'LOCKED'
                },
                permissions: {}
              }
            }), { status: 403, headers: corsHeaders });
          }

          const permissions = await buildUserPermissions(env, user);
          const roleInfo = await db.queryOne(env, `SELECT * FROM app_roles WHERE role_code = ? LIMIT 1`, [user.role_code]).catch(() => null);

          let approvedRoles = [user.role_code];
          if (user.role_code === 'ADMIN' || user.email === 'trantuandai2508@gmail.com') {
            approvedRoles = ['ADMIN', 'BEP_TRUONG', 'KHO_TRUONG', 'KE_TOAN', 'NHAN_VIEN'];
          } else {
            const { rows: appReqs } = await db.query(env, `
              SELECT requested_role FROM access_requests WHERE user_email = ? AND status = 'APPROVED'
            `, [user.email]).catch(() => ({ rows: [] }));
            (appReqs || []).forEach(r => {
              if (r.requested_role && !approvedRoles.includes(r.requested_role)) {
                approvedRoles.push(r.requested_role);
              }
            });
          }

          const isMaster = user && user.email && (user.email.toLowerCase().trim() === 'trantuandai2508@gmail.com' || user.email.toLowerCase().includes('trantuandai2508'));
          await ensureSystemTabVisibilityTable(env);
          const { rows: tabVisRows } = await db.query(env, `SELECT tab_id, is_hidden FROM system_tab_visibility`).catch(() => ({ rows: [] }));
          const tabVisibility = {};
          (tabVisRows || []).forEach(r => {
            tabVisibility[r.tab_id] = r.is_hidden === 1 || r.is_hidden === true;
          });

          const orderRow = await db.queryOne(env, `SELECT structure_json FROM system_tab_order WHERE id = 'GLOBAL_ORDER' LIMIT 1`).catch(() => null);
          let tabOrder = null;
          if (orderRow && orderRow.structure_json) {
            try {
              tabOrder = JSON.parse(orderRow.structure_json);
            } catch (e) {}
          }

          const authResponseData = {
            success: true,
            data: {
              user: {
                id: user.id,
                email: user.email,
                fullName: repairAtobMojibake(user.full_name),
                avatarUrl: user.avatar_url,
                role: user.role_code,
                roleName: roleInfo?.role_name || user.role_code,
                status: user.status,
                assignedSite: user.assigned_site || null,
                approvedRoles
              },
              role: user.role_code,
              roleName: roleInfo?.role_name || user.role_code,
              assignedSite: user.assigned_site || null,
              badgeColor: roleInfo?.badge_color || 'bg-brand-500',
              approvedRoles,
              permissions,
              isMasterOwner: isMaster,
              tabVisibility,
              tabOrder
            }
          };
          setMemoryCache(authCacheKey, authResponseData, 60);
          return new Response(JSON.stringify(authResponseData), { headers: corsHeaders });
        } catch (dbErr) {
          console.warn('D1 limit or connection fallback for /api/auth/me:', dbErr.message);
          const isOwner = email === 'trantuandai2508@gmail.com' || email === 'daitt5tiktok@gmail.com';
          const role = isOwner ? 'ADMIN' : 'NHAN_VIEN';
          const defaultPermissions = {};
          ALL_SYSTEM_FEATURES.forEach(f => {
            defaultPermissions[f] = { canView: isOwner, canCreate: isOwner, canEdit: isOwner, canDelete: isOwner };
          });
          return new Response(JSON.stringify({
            success: true,
            fallback: true,
            data: {
              user: {
                id: 1,
                email,
                fullName: email.split('@')[0],
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=465fff&color=fff&bold=true`,
                role,
                roleName: isOwner ? 'Ban Quản Trị Hệ Thống' : 'Nhân Viên Vận Hành',
                status: 'ACTIVE',
                approvedRoles: isOwner ? ['ADMIN', 'BEP_TRUONG', 'KHO_TRUONG', 'KE_TOAN', 'NHAN_VIEN'] : ['NHAN_VIEN']
              },
              role,
              roleName: isOwner ? 'Ban Quản Trị Hệ Thống' : 'Nhân Viên Vận Hành',
              badgeColor: isOwner ? 'rose' : 'gray',
              approvedRoles: isOwner ? ['ADMIN', 'BEP_TRUONG', 'KHO_TRUONG', 'KE_TOAN', 'NHAN_VIEN'] : ['NHAN_VIEN'],
              permissions: defaultPermissions
            }
          }), { headers: corsHeaders });
        }
      }

      // 2.11.1 GOOGLE AUTHENTICATION & RBAC (/api/auth/google)
      if (pathname === '/api/auth/google' && request.method === 'POST') {
        let email, fullName, avatarUrl, googleId, credential;
        try {
          const body = await request.json();
          ({ email, fullName, avatarUrl, googleId, credential } = body);

          // Nếu gửi credential dạng JWT token từ Google One Tap / GSI
          if (credential && !email) {
            try {
              const parts = credential.split('.');
              if (parts.length === 3) {
                let payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                while (payloadBase64.length % 4 !== 0) payloadBase64 += '=';
                const binaryStr = atob(payloadBase64);
                const bytes = Uint8Array.from(binaryStr, c => c.charCodeAt(0));
                const decodedJson = JSON.parse(new TextDecoder('utf-8').decode(bytes));
                email = decodedJson.email;
                fullName = decodedJson.name || decodedJson.given_name;
                avatarUrl = decodedJson.picture;
                googleId = decodedJson.sub;
              }
            } catch (errDec) {
              console.error('Error decoding Google JWT credential:', errDec);
            }
          }

          if (!email) {
            return new Response(JSON.stringify({ success: false, error: 'Không nhận được thông tin email từ Google' }), { status: 400, headers: corsHeaders });
          }

          // 1. Tìm kiếm user trong app_users
          let user = await db.queryOne(env, `SELECT * FROM app_users WHERE email = ? LIMIT 1`, [email]);

          if (user && user.full_name) {
            const repaired = repairAtobMojibake(user.full_name);
            if (repaired !== user.full_name) {
              user.full_name = repaired;
              await db.exec(env, `UPDATE app_users SET full_name = ? WHERE id = ?`, [repaired, user.id]).catch(() => {});
            }
          }

          // NẾU TÀI KHOẢN ĐÃ BỊ KHÓA -> CHẶN ĐĂNG NHẬP GOOGLE
          if (user && user.status === 'LOCKED') {
            return new Response(JSON.stringify({
              success: false,
              isLocked: true,
              error: 'Tài khoản Google này (' + email + ') đã bị khóa bởi Quản trị viên. Bạn không thể đăng nhập.'
            }), { status: 403, headers: corsHeaders });
          }

          if (!user) {
            // Xác định vai trò mặc định:
            // Chỉ tài khoản Owner mới mặc định ADMIN, các user mới khác mặc định là NHAN_VIEN chờ duyệt
            let defaultRole = 'NHAN_VIEN';
            if (email === 'trantuandai2508@gmail.com' || email === 'daitt5tiktok@gmail.com') {
              defaultRole = 'ADMIN';
            }

            user = await db.queryOne(env, {
              d1: `INSERT INTO app_users (email, full_name, avatar_url, google_id, role_code, auth_provider, status, last_login)
                   VALUES (?, ?, ?, ?, ?, 'google', 'ACTIVE', datetime('now')) RETURNING *`,
              pg: `INSERT INTO app_users (email, full_name, avatar_url, google_id, role_code, auth_provider, status, last_login)
                   VALUES (?, ?, ?, ?, ?, 'google', 'ACTIVE', now()) RETURNING *`
            }, [email, fullName || email.split('@')[0], avatarUrl || '', googleId || '', defaultRole]);
          } else {
            // Cập nhật thông tin Google, full_name chuẩn UTF-8 và last_login
            user = await db.queryOne(env, {
              d1: `UPDATE app_users
                   SET last_login = datetime('now'),
                       full_name = COALESCE(?, full_name),
                       avatar_url = COALESCE(?, avatar_url),
                       google_id = COALESCE(?, google_id),
                       updated_at = datetime('now')
                   WHERE id = ? RETURNING *`,
              pg: `UPDATE app_users
                   SET last_login = now(),
                       full_name = COALESCE(?, full_name),
                       avatar_url = COALESCE(?, avatar_url),
                       google_id = COALESCE(?, google_id),
                       updated_at = now()
                   WHERE id = ? RETURNING *`
            }, [fullName || null, avatarUrl || user.avatar_url, googleId || user.google_id, user.id]);
          }

          // 2. Lấy thông tin Role & Permissions
          const roleInfo = await db.queryOne(env, `SELECT * FROM app_roles WHERE role_code = ? LIMIT 1`, [user.role_code]) || {
            role_code: user.role_code,
            role_name: user.role_code,
            badge_color: 'stone'
          };

          const permissions = await buildUserPermissions(env, user);

          function getCleanInitials(name) {
            if (!name) return 'U';
            try {
              const cleaned = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
              const parts = cleaned.trim().split(/\s+/).filter(Boolean);
              if (parts.length === 0) return 'U';
              if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
              return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            } catch (e) {
              return 'U';
            }
          }

          let approvedRoles = [user.role_code];
          if (user.role_code === 'ADMIN' || user.email === 'trantuandai2508@gmail.com') {
            approvedRoles = ['ADMIN', 'BEP_TRUONG', 'KHO_TRUONG', 'KE_TOAN', 'NHAN_VIEN'];
          } else {
            const { rows: appReqs } = await db.query(env, `
              SELECT requested_role FROM access_requests WHERE user_email = ? AND status = 'APPROVED'
            `, [user.email]);
            (appReqs || []).forEach(r => {
              if (r.requested_role && !approvedRoles.includes(r.requested_role)) {
                approvedRoles.push(r.requested_role);
              }
            });
          }

          return new Response(JSON.stringify({
            success: true,
            message: 'Đăng nhập bằng Google thành công!',
            data: {
              id: user.id,
              email: user.email,
              fullName: user.full_name,
              avatarUrl: user.avatar_url || `https://ui-avatars.com/api/?name=${getCleanInitials(user.full_name || user.email)}&background=465fff&color=fff&bold=true`,
              role: user.role_code,
              roleName: roleInfo.role_name,
              badgeColor: roleInfo.badge_color,
              assignedSite: user.assigned_site || null,
              authProvider: user.auth_provider,
              approvedRoles,
              permissions
            }
          }), { headers: corsHeaders });
        } catch (err) {
          console.error('Google Auth API Error:', err);
          if (email) {
            console.warn('D1 limit or connection fallback for /api/auth/google:', err.message);
            const isOwner = email === 'trantuandai2508@gmail.com' || email === 'daitt5tiktok@gmail.com';
            const role = isOwner ? 'ADMIN' : 'NHAN_VIEN';
            const defaultPermissions = {};
            ALL_SYSTEM_FEATURES.forEach(f => {
              defaultPermissions[f] = { canView: isOwner, canCreate: isOwner, canEdit: isOwner, canDelete: isOwner };
            });
            return new Response(JSON.stringify({
              success: true,
              fallback: true,
              message: 'Đăng nhập Google thành công (Chế độ dự phòng D1 Quota)',
              data: {
                id: 1,
                email,
                fullName: fullName || email.split('@')[0],
                avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=19723c&color=fff&bold=true`,
                role,
                roleName: isOwner ? 'Ban Quản Trị Hệ Thống' : 'Nhân Viên Vận Hành',
                badgeColor: isOwner ? 'rose' : 'gray',
                authProvider: 'google',
                approvedRoles: isOwner ? ['ADMIN', 'BEP_TRUONG', 'KHO_TRUONG', 'KE_TOAN', 'NHAN_VIEN'] : ['NHAN_VIEN'],
                permissions: defaultPermissions
              }
            }), { headers: corsHeaders });
          }
          return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
        }
      }

      // 2.11.2 LẤY QUYỀN & VAI TRÒ HỆ THỐNG (/api/auth/roles-permissions)
      if (pathname === '/api/auth/roles-permissions' && request.method === 'GET') {
        const { rows: roles } = await db.query(env, `SELECT * FROM app_roles`);
        const { rows: perms } = await db.query(env, `SELECT * FROM role_permissions`);
        const { rows: rawUsers } = await db.query(env, `SELECT id, email, full_name, avatar_url, role_code, status, last_login FROM app_users ORDER BY id`);
        const users = (rawUsers || []).map(u => {
          const repaired = repairAtobMojibake(u.full_name);
          return { ...u, full_name: repaired || u.full_name };
        });

        return new Response(JSON.stringify({
          success: true,
          data: { roles, perms, users }
        }), { headers: corsHeaders });
      }

      // ======================================================================
      // 2.11.X MA TRẬN PHÂN QUYỀN USER & CHỨC NĂNG (USER PERMISSIONS MATRIX)
      // ======================================================================
      
      // 1. Lấy toàn bộ dữ liệu Ma Trận User x Chức Năng
      
      // 2.11.CLEAN DỌN DẸP TOÀN BỘ DỮ LIỆU DEMO (/api/admin/clean-demo-data)
      
      // Kiểm tra bảo mật cho tất cả route /api/admin/*
      if (pathname.startsWith('/api/admin/')) {
        if (env.ADMIN_KEY) {
          const authKey = request.headers.get('X-Admin-Key') || searchParams.get('admin_key');
          if (!authKey || authKey !== env.ADMIN_KEY) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Không có quyền truy cập quản trị (Invalid X-Admin-Key)'
            }), { status: 403, headers: corsHeaders });
          }
        }
      }

      // Diagnostic DB status
      if (pathname === '/api/admin/db-status' && request.method === 'GET') {
        const isPg = db.getBackend(env) === 'supabase';
        let indexes = [];
        if (isPg) {
          const { rows } = await db.query(env, `
            SELECT indexname as name, tablename as tbl_name 
            FROM pg_indexes 
            WHERE schemaname = 'wms'
            ORDER BY tablename, indexname
          `);
          indexes = rows;
        } else {
          const { rows } = await db.query(env, "SELECT name, tbl_name FROM sqlite_master WHERE type='index'");
          indexes = rows;
        }

        const counts = {};
        const checkTables = ['transactions', 'app_users', 'branches', 'sites', 'don_hang', 'dinh_muc', 'nvl_items', 'fnb_monthly_summary', 'inventory_batches', 'purchase_orders', 'vouchers', 'dim_article_stock'];
        for (const tbl of checkTables) {
          try {
            const r = await db.queryOne(env, `SELECT COUNT(*) as c FROM ${tbl}`);
            counts[tbl] = r ? Number(r.c) : 0;
          } catch (e) {
            counts[tbl] = 'error: ' + e.message;
          }
        }
        return new Response(JSON.stringify({
          success: true,
          backend: db.getBackend(env),
          indexesCount: indexes ? indexes.length : 0,
          indexes: indexes || [],
          tableCounts: counts
        }), { headers: corsHeaders });
      }

      
      // Sync monthly summary from transactions table (Hỗ trợ sync riêng 1 tháng ?month=YYYY-MM)
      if (pathname === '/api/admin/sync-monthly-summary') {
        const monthParam = searchParams.get('month') || '';
        let targetMonth = monthParam ? normalizeMonth(monthParam) : '';
        if (targetMonth && targetMonth.includes('/')) {
          const parts = targetMonth.split('/');
          if (parts.length === 2) targetMonth = `${parts[1]}-${parts[0].padStart(2, '0')}`;
        }

        const isPg = db.getBackend(env) === 'supabase';
        if (isPg) {
          if (targetMonth) {
            await db.query(env, `SELECT wms.refresh_fnb_summaries($1)`, [targetMonth]);
          } else {
            await db.query(env, `SELECT wms.refresh_fnb_summaries(NULL)`);
          }
        } else {
          let syncSql = `
            INSERT OR REPLACE INTO fnb_monthly_summary (
              month_period, site_code, site_name, region,
              total_bills, active_days, net_revenue, gross_revenue,
              discount, food_cost, dine_in_rev, takeaway_rev, catering_rev
            )
            SELECT 
              SUBSTR(billing_date, 1, 7) as month_period,
              ma_cua_hang as site_code,
              COALESCE(ten_cua_hang, ma_cua_hang) as site_name,
              COALESCE(vung_mien, 'Miền Nam') as region,
              COUNT(DISTINCT so_hoa_don) as total_bills,
              COUNT(DISTINCT billing_date) as active_days,
              COALESCE(SUM(thanh_tien_truoc_thue), 0) as net_revenue,
              COALESCE(SUM(tong_tien_billing), 0) as gross_revenue,
              COALESCE(SUM(ck_truoc_thue), 0) as discount,
              COALESCE(SUM(gia_von), 0) as food_cost,
              COALESCE(SUM(CASE WHEN LOWER(ten_kenh_ban_hang) LIKE '%tại chỗ%' THEN thanh_tien_truoc_thue ELSE 0 END), 0) as dine_in_rev,
              COALESCE(SUM(CASE WHEN LOWER(ten_kenh_ban_hang) LIKE '%mang đi%' THEN thanh_tien_truoc_thue ELSE 0 END), 0) as takeaway_rev,
              COALESCE(SUM(CASE WHEN LOWER(ten_kenh_ban_hang) LIKE '%suất ăn%' THEN thanh_tien_truoc_thue ELSE 0 END), 0) as catering_rev
            FROM transactions
            WHERE billing_date IS NOT NULL AND billing_date != ''
          `;

          let binds = [];
          if (targetMonth) {
            const mRange = getMonthRange(targetMonth);
            syncSql += ` AND billing_date >= ? AND billing_date <= ?`;
            binds.push(mRange.start, mRange.end);
          }
          syncSql += ` GROUP BY SUBSTR(billing_date, 1, 7), ma_cua_hang`;
          await db.exec(env, syncSql, binds);
        }

        // Xóa sạch bộ nhớ đệm RAM Cache và Edge Cache
        invalidateMemoryCache('/api/fnb');

        let querySummaries = 'SELECT month_period, site_code, net_revenue FROM fnb_monthly_summary';
        let queryBinds = [];
        if (targetMonth) {
          querySummaries += ' WHERE month_period = ?';
          queryBinds.push(targetMonth);
        }
        const { rows: summaries } = await db.query(env, querySummaries, queryBinds);

        return new Response(JSON.stringify({
          success: true,
          message: targetMonth 
            ? `Đã tổng hợp số liệu tháng ${targetMonth} thành công!` 
            : 'Đã tổng hợp toàn bộ số liệu fnb_monthly_summary thành công!',
          month: targetMonth || 'all',
          count: summaries ? summaries.length : 0,
          summaries: summaries || []
        }), { headers: corsHeaders });
      }

      // 3.4.2 POST /api/admin/sync-dim-article-stock - Nạp danh mục mặt hàng theo từng điểm bán từ local SQL Server
      if (pathname === '/api/admin/sync-dim-article-stock' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const items = body.items || [];
        if (!items.length) {
          return new Response(JSON.stringify({ success: false, error: 'Không có dữ liệu items' }), { status: 400, headers: corsHeaders });
        }

        let count = 0;
        await db.withTransaction(env, async tx => {
          for (const it of items) {
            const site = it.site || '';
            const mat = it.material || '';
            if (!site || !mat) continue;
            await tx.query({
              d1: `INSERT OR REPLACE INTO dim_article_stock (site, site_name, nganh_hang, nhom_hang, material, material_desc, entry_unit, price, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
              pg: `INSERT INTO dim_article_stock (site, site_name, nganh_hang, nhom_hang, material, material_desc, entry_unit, price, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, now()) ON CONFLICT (site, material) DO UPDATE SET site_name = EXCLUDED.site_name, nganh_hang = EXCLUDED.nganh_hang, nhom_hang = EXCLUDED.nhom_hang, material_desc = EXCLUDED.material_desc, entry_unit = EXCLUDED.entry_unit, price = EXCLUDED.price, updated_at = now()`
            }, [
              site,
              it.site_name || '',
              it.nganh_hang || '',
              it.nhom_hang || '',
              mat,
              it.material_desc || '',
              it.entry_unit || '',
              Number(it.price) || 0
            ]);
            count++;
          }
        });

        invalidateMemoryCache('/api/fnb/stock');

        return new Response(JSON.stringify({
          success: true,
          count: count,
          message: `Đã lưu thành công ${count} mặt hàng vào dim_article_stock`
        }), { headers: corsHeaders });
      }

      if (pathname === '/api/admin/clean-demo-data') {
        await autoCleanDemoData(env);
        const { rows: remainingUsers } = await db.query(env, `SELECT id, email, full_name, role_code, status FROM app_users`);
        return new Response(JSON.stringify({
          success: true,
          message: 'Đã xóa toàn bộ dữ liệu demo thành công',
          remainingUsers: remainingUsers || []
        }), { headers: corsHeaders });
      }

      if (pathname === '/api/auth/users-matrix' && request.method === 'GET') {
        const { rows: roles } = await db.query(env, `SELECT * FROM app_roles`);
        const { rows: perms } = await db.query(env, `SELECT * FROM role_permissions`);
        const { rows: rawUsers } = await db.query(env, `SELECT id, email, full_name, avatar_url, role_code, status, assigned_site, last_login, created_at FROM app_users ORDER BY id ASC`).catch(async () => {
          return await db.query(env, `SELECT id, email, full_name, avatar_url, role_code, status, last_login, created_at FROM app_users ORDER BY id ASC`);
        });
        const { rows: userPerms } = await db.query(env, `SELECT * FROM user_permissions`);

        const users = (rawUsers || []).map(u => {
          const repaired = repairAtobMojibake(u.full_name);
          return { ...u, full_name: repaired || u.full_name };
        });

        const features = [
          // Nhóm 1: Doanh Thu & P&L
          { code: 'fnb-chain', name: 'Toàn Chuỗi & Xếp Hạng', group: 'fnb-finance', groupName: 'Doanh Thu & P&L', icon: 'trophy', color: 'rose' },
          { code: 'fnb-pl', name: 'Báo Cáo P&L Điểm Bán', group: 'fnb-finance', groupName: 'Doanh Thu & P&L', icon: 'pie-chart', color: 'rose' },
          { code: 'fnb-pos', name: 'Doanh Thu POS & Bán Lẻ', group: 'fnb-finance', groupName: 'Doanh Thu & P&L', icon: 'zap', color: 'rose' },
          
          // Nhóm 2: Bếp & Tồn Kho Điểm Bán
          { code: 'fnb-stock', name: 'Ma Trận Tồn Kho', group: 'fnb-inventory', groupName: 'Bếp & Tồn Kho Điểm Bán', icon: 'boxes', color: 'emerald' },
          { code: 'fnb-counts', name: 'Kiểm Kê Hằng Ngày', group: 'fnb-inventory', groupName: 'Bếp & Tồn Kho Điểm Bán', icon: 'clipboard-check', color: 'emerald' },
          { code: 'fnb-receipts', name: 'Nhập kho tại site', group: 'fnb-inventory', groupName: 'Bếp & Tồn Kho Điểm Bán', icon: 'package-plus', color: 'emerald' },
          { code: 'fnb-kitchen-issue', name: 'Xuất Kho Sử Dụng', group: 'fnb-inventory', groupName: 'Bếp & Tồn Kho Điểm Bán', icon: 'cooking-pot', color: 'emerald' },
          { code: 'fnb-waste', name: 'Hủy Hàng & Hao Hụt', group: 'fnb-inventory', groupName: 'Bếp & Tồn Kho Điểm Bán', icon: 'trash-2', color: 'emerald' },
          
          // Nhóm 3: Kho Tổng WMS
          { code: 'wh-dashboard', name: 'Tổng Quan Kho WMS', group: 'wh-wms', groupName: 'Kho Tổng WMS', icon: 'layout-dashboard', color: 'amber' },
          { code: 'wh-stock', name: 'Tồn Kho & FEFO Tổng', group: 'wh-wms', groupName: 'Kho Tổng WMS', icon: 'layers', color: 'amber' },
          { code: 'wh-reorder', name: 'Điểm Đặt Hàng ROP', group: 'wh-wms', groupName: 'Kho Tổng WMS', icon: 'alert-triangle', color: 'amber' },
          { code: 'wh-leadtime', name: 'Lead Time Nhà Cung Cấp', group: 'wh-wms', groupName: 'Kho Tổng WMS', icon: 'clock', color: 'amber' },
          { code: 'wh-posap', name: 'Đơn Hàng SAP PO', group: 'wh-wms', groupName: 'Kho Tổng WMS', icon: 'shopping-cart', color: 'amber' },
          
          // Nhóm 4: Portal Nghiệp Vụ
          { code: 'portal-voucher', name: 'Nhập Chứng Từ Thu Chi', group: 'portal-ops', groupName: 'Portal Nghiệp Vụ', icon: 'file-text', color: 'blue' },
          { code: 'portal-search', name: 'Tra Cứu Báo Cáo', group: 'portal-ops', groupName: 'Portal Nghiệp Vụ', icon: 'search', color: 'blue' },
          { code: 'portal-order', name: 'Đặt Hàng CCDC / Vật Tư', group: 'portal-ops', groupName: 'Portal Nghiệp Vụ', icon: 'shopping-bag', color: 'blue' },
          { code: 'portal-history', name: 'Lịch Sử Đặt Hàng', group: 'portal-ops', groupName: 'Portal Nghiệp Vụ', icon: 'history', color: 'blue' },
          { code: 'portal-baocao', name: 'Báo Cáo Suất Ăn Ca', group: 'portal-ops', groupName: 'Portal Nghiệp Vụ', icon: 'utensils', color: 'blue' },
          { code: 'portal-kiemke', name: 'Kiểm Kê Tồn Kho Kỳ', group: 'portal-ops', groupName: 'Portal Nghiệp Vụ', icon: 'check-square', color: 'blue' },
          
          // Nhóm 5: Hệ Thống
          { code: 'fnb-sites', name: 'Danh Mục 14 Điểm Bán', group: 'sys-admin', groupName: 'Hệ Thống & Danh Mục', icon: 'building-2', color: 'purple' },
          { code: 'hr-employees', name: 'Quản Lý Nhân Sự', group: 'sys-admin', groupName: 'Hệ Thống & Danh Mục', icon: 'users', color: 'purple' },
          { code: 'user-matrix', name: 'Quản Lý User & Phân Quyền', group: 'sys-admin', groupName: 'Hệ Thống & Danh Mục', icon: 'users-cog', color: 'purple' }
        ];

        return new Response(JSON.stringify({
          success: true,
          data: {
            users,
            roles: roles || [],
            rolePermissions: perms || [],
            userPermissions: userPerms || [],
            features
          }
        }), { headers: corsHeaders });
      }

      // 2. Toggle Phân Quyền hoặc Cắt Quyền cho từng user đối với từng chức năng
      if (pathname === '/api/auth/user-permissions/toggle' && request.method === 'POST') {
        const caller = await getCallerPermissions(env, request);
        if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
          const p = caller.permissions['user-matrix'];
          if (!p || (!p.canEdit && !p.canDelete) || p.isRevoked || p.canView === false) {
            return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền thay đổi phân quyền người dùng' }), { status: 403, headers: corsHeaders });
          }
        }

        await ensureUserPermissionsTable(env);
        const { userEmail, featureCode, action } = await request.json(); // action: 'GRANT', 'REVOKE', 'RESET'
        if (!userEmail || !featureCode) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu userEmail hoặc featureCode' }), { status: 400, headers: corsHeaders });
        }

        if (action === 'RESET') {
          await db.exec(env, `DELETE FROM user_permissions WHERE user_email = ? AND feature_code = ?`, [userEmail, featureCode]);
          invalidateMemoryCache('auth_me_');
          return new Response(JSON.stringify({ success: true, message: 'Đã khôi phục quyền mặc định theo vai trò' }), { headers: corsHeaders });
        }

        const canView = action === 'GRANT' ? (db.isPg(env) ? true : 1) : (db.isPg(env) ? false : 0);
        const canCreate = action === 'GRANT' ? (db.isPg(env) ? true : 1) : (db.isPg(env) ? false : 0);
        const canEdit = action === 'GRANT' ? (db.isPg(env) ? true : 1) : (db.isPg(env) ? false : 0);
        const canDelete = action === 'GRANT' ? (db.isPg(env) ? true : 1) : (db.isPg(env) ? false : 0);

        await db.exec(env, {
          d1: `INSERT INTO user_permissions (user_email, feature_code, can_view, can_create, can_edit, can_delete, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
               ON CONFLICT(user_email, feature_code) DO UPDATE SET
                 can_view = excluded.can_view,
                 can_create = excluded.can_create,
                 can_edit = excluded.can_edit,
                 can_delete = excluded.can_delete,
                 updated_at = datetime('now')`,
          pg: `INSERT INTO user_permissions (user_email, feature_code, can_view, can_create, can_edit, can_delete, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, now())
               ON CONFLICT(user_email, feature_code) DO UPDATE SET
                 can_view = excluded.can_view,
                 can_create = excluded.can_create,
                 can_edit = excluded.can_edit,
                 can_delete = excluded.can_delete,
                 updated_at = now()`
        }, [userEmail, featureCode, canView, canCreate, canEdit, canDelete]);

        invalidateMemoryCache('auth_me_');
        return new Response(JSON.stringify({
          success: true,
          message: action === 'GRANT' ? `Đã CẤP quyền ${featureCode} cho ${userEmail}` : `Đã CẮT quyền ${featureCode} của ${userEmail}`
        }), { headers: corsHeaders });
      }

      // 3. Reset toàn bộ quyền của 1 user về mặc định theo Role
      if (pathname === '/api/auth/user-permissions/reset-user' && request.method === 'POST') {
        const caller = await getCallerPermissions(env, request);
        if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
          const p = caller.permissions['user-matrix'];
          if (!p || (!p.canEdit && !p.canDelete) || p.isRevoked || p.canView === false) {
            return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền khôi phục phân quyền người dùng' }), { status: 403, headers: corsHeaders });
          }
        }

        const { userEmail } = await request.json();
        if (!userEmail) return new Response(JSON.stringify({ success: false, error: 'Thiếu userEmail' }), { status: 400, headers: corsHeaders });
        await db.exec(env, `DELETE FROM user_permissions WHERE user_email = ?`, [userEmail]);
        invalidateMemoryCache('auth_me_');
        return new Response(JSON.stringify({ success: true, message: `Đã khôi phục toàn bộ quyền của ${userEmail} về vai trò gốc` }), { headers: corsHeaders });
      }

      // 3.5. Cấp hoặc Khóa / Cắt toàn bộ quyền các tab cho 1 user
      if (pathname === '/api/auth/user-permissions/bulk-set' && request.method === 'POST') {
        const caller = await getCallerPermissions(env, request);
        if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
          const p = caller.permissions['user-matrix'];
          if (!p || (!p.canEdit && !p.canDelete) || p.isRevoked || p.canView === false) {
            return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền phân quyền hàng loạt cho người dùng' }), { status: 403, headers: corsHeaders });
          }
        }

        await ensureUserPermissionsTable(env);
        const { userEmail, action } = await request.json(); // action: 'REVOKE_ALL' or 'GRANT_ALL'
        if (!userEmail || !action) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu userEmail hoặc action' }), { status: 400, headers: corsHeaders });
        }

        const canView = action === 'GRANT_ALL' ? (db.isPg(env) ? true : 1) : (db.isPg(env) ? false : 0);
        const canCreate = action === 'GRANT_ALL' ? (db.isPg(env) ? true : 1) : (db.isPg(env) ? false : 0);
        const canEdit = action === 'GRANT_ALL' ? (db.isPg(env) ? true : 1) : (db.isPg(env) ? false : 0);
        const canDelete = action === 'GRANT_ALL' ? (db.isPg(env) ? true : 1) : (db.isPg(env) ? false : 0);

        for (const fCode of ALL_SYSTEM_FEATURES) {
          await db.exec(env, {
            d1: `INSERT INTO user_permissions (user_email, feature_code, can_view, can_create, can_edit, can_delete, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
                 ON CONFLICT(user_email, feature_code) DO UPDATE SET
                   can_view = excluded.can_view,
                   can_create = excluded.can_create,
                   can_edit = excluded.can_edit,
                   can_delete = excluded.can_delete,
                   updated_at = datetime('now')`,
            pg: `INSERT INTO user_permissions (user_email, feature_code, can_view, can_create, can_edit, can_delete, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, now())
                 ON CONFLICT(user_email, feature_code) DO UPDATE SET
                   can_view = excluded.can_view,
                   can_create = excluded.can_create,
                   can_edit = excluded.can_edit,
                   can_delete = excluded.can_delete,
                   updated_at = now()`
          }, [userEmail, fCode, canView, canCreate, canEdit, canDelete]);
        }

        invalidateMemoryCache('auth_me_');
        return new Response(JSON.stringify({
          success: true,
          message: action === 'GRANT_ALL'
            ? `Đã CẤP TOÀN BỘ quyền các tab cho ${userEmail}`
            : `Đã KHÓA / CẮT TOÀN BỘ quyền các tab của ${userEmail}`
        }), { headers: corsHeaders });
      }

      // 3.6. Lưu phân quyền chi tiết (Xem / Tạo / Sửa / Xóa) theo từng User và từng Tab
      if (pathname === '/api/auth/user-permissions/save-granular' && request.method === 'POST') {
        const caller = await getCallerPermissions(env, request);
        if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
          const p = caller.permissions['user-matrix'];
          if (!p || (!p.canEdit && !p.canDelete) || p.isRevoked || p.canView === false) {
            return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền cập nhật phân quyền chi tiết' }), { status: 403, headers: corsHeaders });
          }
        }

        await ensureUserPermissionsTable(env);
        const { userEmail, permissions } = await request.json();
        if (!userEmail || !Array.isArray(permissions)) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu userEmail hoặc danh sách permissions' }), { status: 400, headers: corsHeaders });
        }

        for (const item of permissions) {
          if (!item || !item.featureCode) continue;
          const cv = item.canView ? (db.isPg(env) ? true : 1) : (db.isPg(env) ? false : 0);
          const cc = (item.canView && item.canCreate) ? (db.isPg(env) ? true : 1) : (db.isPg(env) ? false : 0);
          const ce = (item.canView && item.canEdit) ? (db.isPg(env) ? true : 1) : (db.isPg(env) ? false : 0);
          const cd = (item.canView && item.canDelete) ? (db.isPg(env) ? true : 1) : (db.isPg(env) ? false : 0);

          await db.exec(env, {
            d1: `INSERT INTO user_permissions (user_email, feature_code, can_view, can_create, can_edit, can_delete, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
                 ON CONFLICT(user_email, feature_code) DO UPDATE SET
                   can_view = excluded.can_view,
                   can_create = excluded.can_create,
                   can_edit = excluded.can_edit,
                   can_delete = excluded.can_delete,
                   updated_at = datetime('now')`,
            pg: `INSERT INTO user_permissions (user_email, feature_code, can_view, can_create, can_edit, can_delete, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, now())
                 ON CONFLICT(user_email, feature_code) DO UPDATE SET
                   can_view = excluded.can_view,
                   can_create = excluded.can_create,
                   can_edit = excluded.can_edit,
                   can_delete = excluded.can_delete,
                   updated_at = now()`
          }, [userEmail, item.featureCode, cv, cc, ce, cd]);
        }

        invalidateMemoryCache('auth_me_');
        return new Response(JSON.stringify({
          success: true,
          message: `Đã lưu phân quyền chi tiết (Xem/Tạo/Sửa/Xóa) cho ${userEmail}`
        }), { headers: corsHeaders });
      }

      // 4. Cập nhật Vai trò (Role) cho User
      if (pathname === '/api/auth/users/update-role' && request.method === 'POST') {
        const caller = await getCallerPermissions(env, request);
        if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
          const p = caller.permissions['user-matrix'];
          if (!p || (!p.canEdit && !p.canDelete) || p.isRevoked || p.canView === false) {
            return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền cập nhật vai trò người dùng' }), { status: 403, headers: corsHeaders });
          }
        }

        const { userEmail, roleCode, resetPermissions } = await request.json();
        if (!userEmail || !roleCode) return new Response(JSON.stringify({ success: false, error: 'Thiếu userEmail hoặc roleCode' }), { status: 400, headers: corsHeaders });
        await db.exec(env, `UPDATE app_users SET role_code = ? WHERE email = ?`, [roleCode, userEmail]);
        if (resetPermissions) {
          await db.exec(env, `DELETE FROM user_permissions WHERE user_email = ?`, [userEmail]);
        }
        invalidateMemoryCache('auth_me_');
        return new Response(JSON.stringify({ success: true, message: `Đã cập nhật vai trò ${roleCode} cho ${userEmail}` }), { headers: corsHeaders });
      }

      // 5. Khóa / Mở khóa tài khoản User
      if (pathname === '/api/auth/users/toggle-status' && request.method === 'POST') {
        const caller = await getCallerPermissions(env, request);
        if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
          const p = caller.permissions['user-matrix'];
          if (!p || (!p.canEdit && !p.canDelete) || p.isRevoked || p.canView === false) {
            return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền khóa hoặc mở khóa tài khoản người dùng' }), { status: 403, headers: corsHeaders });
          }
        }

        const { userEmail, status } = await request.json(); // 'ACTIVE' or 'LOCKED'
        if (!userEmail || !status) return new Response(JSON.stringify({ success: false, error: 'Thiếu thông tin' }), { status: 400, headers: corsHeaders });
        await db.exec(env, `UPDATE app_users SET status = ? WHERE email = ?`, [status, userEmail]);
        invalidateMemoryCache('auth_me_');
        return new Response(JSON.stringify({ success: true, message: `Đã ${status === 'ACTIVE' ? 'mở khóa' : 'khóa'} tài khoản ${userEmail}` }), { headers: corsHeaders });
      }

      // 6. Thêm tài khoản User mới
      if (pathname === '/api/auth/users/create' && request.method === 'POST') {
        const caller = await getCallerPermissions(env, request);
        if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
          const p = caller.permissions['user-matrix'];
          if (!p || (!p.canCreate && !p.canEdit) || p.isRevoked || p.canView === false) {
            return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền thêm tài khoản người dùng mới' }), { status: 403, headers: corsHeaders });
          }
        }

        const { email, fullName, roleCode } = await request.json();
        if (!email) return new Response(JSON.stringify({ success: false, error: 'Email là bắt buộc' }), { status: 400, headers: corsHeaders });
        const cleanEmail = email.trim().toLowerCase();
        const existing = await db.queryOne(env, `SELECT id FROM app_users WHERE email = ? LIMIT 1`, [cleanEmail]);
        if (existing) {
          return new Response(JSON.stringify({ success: false, error: 'Tài khoản email này đã tồn tại trong hệ thống' }), { status: 400, headers: corsHeaders });
        }
        const safeName = (fullName || cleanEmail.split('@')[0]).trim();
        const initialRole = roleCode || 'NHAN_VIEN';
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=465fff&color=fff&bold=true`;
        await db.exec(env, {
          d1: `INSERT INTO app_users (email, full_name, avatar_url, role_code, auth_provider, status, created_at)
               VALUES (?, ?, ?, ?, 'GOOGLE', 'ACTIVE', datetime('now'))`,
          pg: `INSERT INTO app_users (email, full_name, avatar_url, role_code, auth_provider, status, created_at)
               VALUES (?, ?, ?, ?, 'GOOGLE', 'ACTIVE', now())`
        }, [cleanEmail, safeName, avatarUrl, initialRole]);

        return new Response(JSON.stringify({ success: true, message: `Đã thêm người dùng ${cleanEmail} thành công` }), { headers: corsHeaders });
      }

      // ======================================================================
      // 2.11.TV QUẢN LÝ ẨN/HIỆN TAB TOÀN HỆ THỐNG (CHỈ DÀNH RIÊNG trantuandai2508)
      // ======================================================================
      if (pathname === '/api/system/tab-visibility' && request.method === 'GET') {
        await ensureSystemTabVisibilityTable(env);
        const { rows } = await db.query(env, `SELECT tab_id, is_hidden, updated_by, updated_at FROM system_tab_visibility`).catch(() => ({ rows: [] }));
        const visibilityMap = {};
        (rows || []).forEach(r => {
          visibilityMap[r.tab_id] = r.is_hidden === 1 || r.is_hidden === true || r.is_hidden === '1';
        });

        // Lấy thứ tự các tab đã lưu trong CSDL D1
        const orderRow = await db.queryOne(env, `SELECT structure_json FROM system_tab_order WHERE id = 'GLOBAL_ORDER' LIMIT 1`).catch(() => null);
        let tabOrder = null;
        if (orderRow && orderRow.structure_json) {
          try {
            tabOrder = JSON.parse(orderRow.structure_json);
          } catch (e) {}
        }

        return new Response(JSON.stringify({
          success: true,
          data: visibilityMap,
          tabOrder,
          masterEmail: 'trantuandai2508@gmail.com'
        }), { headers: corsHeaders });
      }

      if (pathname === '/api/system/tab-visibility' && request.method === 'POST') {
        await ensureSystemTabVisibilityTable(env);
        const body = await request.json().catch(() => ({}));
        const { requestorEmail, tabId, isHidden, tabOrder } = body;
        const bulkUpdates = body.bulkUpdates || body.visibility;

        // BẢO MẬT TUYỆT ĐỐI: CHỈ DUY NHẤT TÀI KHOẢN trantuandai2508 ĐƯỢC PHÉP CẤU HÌNH
        const isMaster = requestorEmail && (requestorEmail.toLowerCase().trim() === 'trantuandai2508@gmail.com' || requestorEmail.toLowerCase().includes('trantuandai2508'));
        if (!isMaster) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Từ chối truy cập: Chức năng phân quyền ẩn/hiện tab chỉ dành riêng cho tài khoản trantuandai2508.'
          }), { status: 403, headers: corsHeaders });
        }

        if (bulkUpdates && typeof bulkUpdates === 'object') {
          for (const [tId, hiddenVal] of Object.entries(bulkUpdates)) {
            const hVal = (hiddenVal === true || hiddenVal === 1 || hiddenVal === '1') ? 1 : 0;
            await db.exec(env, `
              INSERT INTO system_tab_visibility (tab_id, is_hidden, updated_by, updated_at)
              VALUES (?, ?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(tab_id) DO UPDATE SET
                is_hidden = EXCLUDED.is_hidden,
                updated_by = EXCLUDED.updated_by,
                updated_at = CURRENT_TIMESTAMP
            `, [tId, hVal, requestorEmail]).catch(err => {
              console.error(`Error saving tab visibility for ${tId}:`, err);
            });
          }
        } else if (tabId) {
          const hVal = (isHidden === true || isHidden === 1 || isHidden === '1') ? 1 : 0;
          await db.exec(env, `
            INSERT INTO system_tab_visibility (tab_id, is_hidden, updated_by, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(tab_id) DO UPDATE SET
              is_hidden = EXCLUDED.is_hidden,
              updated_by = EXCLUDED.updated_by,
              updated_at = CURRENT_TIMESTAMP
          `, [tabId, hVal, requestorEmail]).catch(err => {
            console.error(`Error saving tab visibility for ${tabId}:`, err);
          });
        }

        // Lưu cấu trúc thứ tự vị trí các tab nếu có truyền vào
        if (tabOrder && Array.isArray(tabOrder)) {
          await db.exec(env, `
            INSERT INTO system_tab_order (id, structure_json, updated_by, updated_at)
            VALUES ('GLOBAL_ORDER', ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
              structure_json = EXCLUDED.structure_json,
              updated_by = EXCLUDED.updated_by,
              updated_at = CURRENT_TIMESTAMP
          `, [JSON.stringify(tabOrder), requestorEmail]).catch(err => {
            console.error('Error saving system_tab_order:', err);
          });
        }

        invalidateMemoryCache('auth_me_');
        return new Response(JSON.stringify({
          success: true,
          message: 'Đã cập nhật trạng thái ẩn/hiện và thứ tự vị trí các tab hệ thống thành công!'
        }), { headers: corsHeaders });
      }

      // ======================================================================
      // 2.11.DEF CẤU HÌNH QUYỀN MẶC ĐỊNH CHO USER MỚI (ADMIN / MASTER)
      // ======================================================================
      if (pathname === '/api/auth/default-user-permissions' && request.method === 'GET') {
        await ensureSystemSettingsTable(env);
        const defRow = await db.queryOne(env, `SELECT setting_value, updated_by, updated_at FROM system_settings WHERE setting_key = 'new_user_default_permissions' LIMIT 1`).catch(() => null);
        const fallbackPerms = {};
        const defaultList = ['fnb-stock', 'fnb-counts', 'fnb-kitchen-issue', 'portal-baocao', 'portal-order'];
        ALL_SYSTEM_FEATURES.forEach(f => {
          const isDef = defaultList.includes(f);
          fallbackPerms[f] = { canView: isDef, canCreate: isDef, canEdit: isDef, canDelete: false };
        });

        let permsMap = fallbackPerms;
        let isCustom = false;
        if (defRow && defRow.setting_value) {
          try {
            const parsed = JSON.parse(defRow.setting_value);
            if (parsed && typeof parsed === 'object') {
              permsMap = { ...fallbackPerms };
              ALL_SYSTEM_FEATURES.forEach(f => {
                if (parsed[f]) {
                  permsMap[f] = {
                    canView: Boolean(parsed[f].canView),
                    canCreate: Boolean(parsed[f].canCreate),
                    canEdit: Boolean(parsed[f].canEdit),
                    canDelete: Boolean(parsed[f].canDelete)
                  };
                }
              });
              isCustom = true;
            }
          } catch (_) {}
        }

        return new Response(JSON.stringify({
          success: true,
          data: permsMap,
          isCustom,
          updatedBy: defRow?.updated_by || null,
          updatedAt: defRow?.updated_at || null
        }), { headers: corsHeaders });
      }

      if (pathname === '/api/auth/default-user-permissions' && request.method === 'POST') {
        await ensureSystemSettingsTable(env);
        const caller = await getCallerPermissions(env, request);
        if (caller && !caller.isMaster && caller.user?.role_code !== 'ADMIN') {
          return new Response(JSON.stringify({ success: false, error: 'Chỉ ADMIN hoặc Master Owner được cấu hình quyền mặc định cho User mới' }), { status: 403, headers: corsHeaders });
        }

        const body = await request.json().catch(() => ({}));
        const perms = body.permissions || body.data || {};
        const requestorEmail = caller?.user?.email || body.requestorEmail || request.headers.get('X-User-Email') || 'ADMIN';
        const cleanMap = {};
        ALL_SYSTEM_FEATURES.forEach(f => {
          const p = perms[f] || {};
          cleanMap[f] = {
            canView: Boolean(p.canView),
            canCreate: Boolean(p.canCreate),
            canEdit: Boolean(p.canEdit),
            canDelete: Boolean(p.canDelete)
          };
        });

        await db.exec(env, `
          INSERT INTO system_settings (setting_key, setting_value, value_type, updated_by, updated_at)
          VALUES ('new_user_default_permissions', ?, 'json', ?, CURRENT_TIMESTAMP)
          ON CONFLICT(setting_key) DO UPDATE SET
            setting_value = EXCLUDED.setting_value,
            value_type = EXCLUDED.value_type,
            updated_by = EXCLUDED.updated_by,
            updated_at = CURRENT_TIMESTAMP
        `, [JSON.stringify(cleanMap), requestorEmail]);

        invalidateMemoryCache('auth_me_');
        await writeAuditLog(env, request, {
          userEmail: requestorEmail,
          action: 'UPDATE',
          entityType: 'NEW_USER_DEFAULT_PERMS',
          entityId: 'NHAN_VIEN',
          summary: 'Cập nhật bộ tab và quyền mặc định cho tài khoản User mới',
          newData: cleanMap
        });

        return new Response(JSON.stringify({
          success: true,
          data: cleanMap,
          message: 'Đã lưu cấu hình phân quyền mặc định cho User mới!'
        }), { headers: corsHeaders });
      }

      // ======================================================================
      // 2.11.SITE CHỌN SITE LẦN ĐĂNG NHẬP ĐẦU TIÊN (MỖI USER CHỈ CHỌN 1 LẦN)
      // ======================================================================
      if (pathname === '/api/auth/set-initial-site' && request.method === 'POST') {
        const caller = await getCallerPermissions(env, request);
        const body = await request.json().catch(() => ({}));
        const targetEmail = (caller?.user?.email || body.email || request.headers.get('X-User-Email') || '').trim();
        const siteCode = String(body.siteCode || body.site || '').trim().toUpperCase();

        if (!targetEmail || !siteCode || siteCode === 'ALL') {
          return new Response(JSON.stringify({
            success: false,
            error: 'Thiếu thông tin email hoặc mã điểm bán hợp lệ (không chọn ALL).'
          }), { status: 400, headers: corsHeaders });
        }

        await db.exec(env, `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS assigned_site TEXT`).catch(() => {});
        const userRow = await db.queryOne(env, `SELECT id, email, role_code, assigned_site FROM app_users WHERE LOWER(email) = LOWER(?) LIMIT 1`, [targetEmail]).catch(() => null);
        if (!userRow) {
          return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy tài khoản người dùng.' }), { status: 404, headers: corsHeaders });
        }

        const isAdminOrMaster = (caller && (caller.isMaster || caller.user?.role_code === 'ADMIN')) || userRow.role_code === 'ADMIN';
        if (userRow.assigned_site && String(userRow.assigned_site).trim() !== '' && !isAdminOrMaster) {
          return new Response(JSON.stringify({
            success: false,
            error: `Tài khoản của bạn đã được cố định tại site [${userRow.assigned_site}]. Vui lòng gửi yêu cầu đổi site để Quản trị viên duyệt!`
          }), { status: 403, headers: corsHeaders });
        }

        await db.exec(env, `UPDATE app_users SET assigned_site = ? WHERE LOWER(email) = LOWER(?)`, [siteCode, targetEmail]);
        invalidateMemoryCache('auth_me_');

        await writeAuditLog(env, request, {
          userEmail: targetEmail,
          action: 'SET_INITIAL_SITE',
          entityType: 'USER_SITE',
          entityId: String(userRow.id),
          siteCode,
          summary: `Người dùng chọn điểm bán làm việc mặc định lần đầu: ${siteCode}`,
          newData: { email: targetEmail, assigned_site: siteCode }
        });

        return new Response(JSON.stringify({
          success: true,
          data: { assignedSite: siteCode },
          message: `Đã lưu điểm bán mặc định [${siteCode}] cho tài khoản của bạn!`
        }), { headers: corsHeaders });
      }

      // ======================================================================
      // 2.11.CFG CẤU HÌNH THAM SỐ HỆ THỐNG (ĐỌC PUBLIC ĐỂ ÁP DỤNG, GHI CHỈ trantuandai2508)
      // ======================================================================
      // 2.11.4a QUẢN LÝ NHÂN SỰ (HR EMPLOYEES): GET / POST / PUT / DELETE /api/hr/employees
      if (pathname === '/api/hr/employees') {
        try {
          await db.exec(env, `
            CREATE TABLE IF NOT EXISTS hr_employees (
              id SERIAL PRIMARY KEY,
              emp_code TEXT UNIQUE NOT NULL,
              full_name TEXT NOT NULL,
              job_title TEXT,
              gender TEXT,
              hire_date DATE,
              birth_date DATE,
              age INTEGER,
              status TEXT DEFAULT 'Đang làm việc',
              work_location TEXT,
              emp_type TEXT DEFAULT 'Fulltime',
              phone TEXT,
              company_email TEXT,
              resign_date DATE,
              notes TEXT,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            )
          `).catch(() => {});

          if (request.method === 'GET') {
            const { rows } = await db.query(env, `
              SELECT id, emp_code, full_name, job_title, gender, hire_date, birth_date, age,
                     COALESCE(NULLIF(status, ''), 'Đang làm việc') as status,
                     work_location, emp_type, phone, company_email, resign_date, notes
              FROM hr_employees
              ORDER BY CASE WHEN status = 'Đã nghỉ' THEN 1 ELSE 0 END ASC, full_name ASC
            `);
            return new Response(JSON.stringify({ success: true, data: rows || [] }), { headers: corsHeaders });
          }

          if (request.method === 'POST') {
            const body = await request.json().catch(() => ({}));
            const list = Array.isArray(body.employees) ? body.employees : [body];
            let saved = 0;
            for (const emp of list) {
              const empCode = String(emp.emp_code || '').trim();
              const fullName = String(emp.full_name || '').trim();
              if (!empCode || !fullName) continue;
              const statusVal = String(emp.status || '').trim() || (emp.resign_date ? 'Đã nghỉ' : 'Đang làm việc');
              await db.exec(env, `
                INSERT INTO hr_employees (emp_code, full_name, job_title, gender, hire_date, birth_date, age, status, work_location, emp_type, phone, company_email, resign_date, notes, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                ON CONFLICT (emp_code) DO UPDATE SET
                  full_name = EXCLUDED.full_name,
                  job_title = EXCLUDED.job_title,
                  gender = EXCLUDED.gender,
                  hire_date = EXCLUDED.hire_date,
                  birth_date = EXCLUDED.birth_date,
                  age = EXCLUDED.age,
                  status = EXCLUDED.status,
                  work_location = EXCLUDED.work_location,
                  emp_type = EXCLUDED.emp_type,
                  phone = EXCLUDED.phone,
                  company_email = EXCLUDED.company_email,
                  resign_date = EXCLUDED.resign_date,
                  notes = COALESCE(EXCLUDED.notes, hr_employees.notes),
                  updated_at = NOW()
              `, [
                empCode, fullName, emp.job_title || '', emp.gender || '',
                emp.hire_date || null, emp.birth_date || null, emp.age ? Number(emp.age) : null,
                statusVal, emp.work_location || '', emp.emp_type || 'Fulltime',
                emp.phone || '', emp.company_email || '', emp.resign_date || null, emp.notes || ''
              ]);
              saved++;
            }
            return new Response(JSON.stringify({ success: true, saved }), { headers: corsHeaders });
          }

          if (request.method === 'PUT') {
            const body = await request.json().catch(() => ({}));
            const idVal = Number(body.id);
            const empCode = String(body.emp_code || '').trim();
            const fullName = String(body.full_name || '').trim();
            if (!idVal || !empCode || !fullName) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu id, mã nhân viên hoặc họ tên' }), { headers: corsHeaders, status: 400 });
            }
            const statusVal = String(body.status || '').trim() || (body.resign_date ? 'Đã nghỉ' : 'Đang làm việc');
            await db.exec(env, `
              UPDATE hr_employees
              SET emp_code = ?, full_name = ?, job_title = ?, gender = ?,
                  hire_date = ?, birth_date = ?, age = ?, status = ?,
                  work_location = ?, emp_type = ?, phone = ?, company_email = ?,
                  resign_date = ?, notes = ?, updated_at = NOW()
              WHERE id = ?
            `, [
              empCode, fullName, body.job_title || '', body.gender || '',
              body.hire_date || null, body.birth_date || null, body.age ? Number(body.age) : null,
              statusVal, body.work_location || '', body.emp_type || 'Fulltime',
              body.phone || '', body.company_email || '', body.resign_date || null, body.notes || '', idVal
            ]);
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
          }

          if (request.method === 'DELETE') {
            const idVal = Number(searchParams.get('id'));
            if (!idVal) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu id nhân sự' }), { headers: corsHeaders, status: 400 });
            }
            await db.exec(env, `DELETE FROM hr_employees WHERE id = ?`, [idVal]);
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
          }
        } catch (err) {
          return new Response(JSON.stringify({ success: false, error: err?.message || String(err) }), { headers: corsHeaders, status: 500 });
        }
      }

      if (pathname === '/api/system/config' && request.method === 'GET') {
        const cfg = await getSystemConfig(env);
        const { rows } = await db.query(env, `SELECT setting_key, updated_by, updated_at FROM system_settings`).catch(() => ({ rows: [] }));
        const { rows: catRows } = await db.query(env, `
          SELECT DISTINCT cat FROM (
            SELECT NULLIF(TRIM(nhom_hang), '') AS cat FROM dim_article_stock
            UNION
            SELECT NULLIF(TRIM(merch_category), '') AS cat FROM sap_po_items
          ) c WHERE cat IS NOT NULL ORDER BY cat ASC LIMIT 100
        `).catch(() => ({ rows: [] }));
        const meta = {};
        (rows || []).forEach(r => {
          meta[r.setting_key] = { updated_by: r.updated_by, updated_at: r.updated_at };
        });
        return new Response(JSON.stringify({
          success: true,
          data: cfg,
          defaults: DEFAULT_SYSTEM_CONFIG,
          available_categories: (catRows || []).map(c => c.cat).filter(Boolean),
          meta
        }), { headers: corsHeaders });
      }

      if (pathname === '/api/system/config' && request.method === 'POST') {
        await ensureSystemSettingsTable(env);
        const caller = await getCallerPermissions(env, request);
        const body = await request.json().catch(() => ({}));
        const requestorEmail = caller?.user?.email || caller?.email || body.requestorEmail || request.headers.get('X-User-Email') || '';
        const isMaster = (caller && caller.isMaster) || (requestorEmail && (requestorEmail.toLowerCase().trim() === 'trantuandai2508@gmail.com' || requestorEmail.toLowerCase().includes('trantuandai2508')));
        if (!isMaster) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Từ chối truy cập: Chức năng Cấu hình hệ thống chỉ dành riêng cho tài khoản Quản trị tối cao (trantuandai2508).'
          }), { status: 403, headers: corsHeaders });
        }

        const oldCfg = await getSystemConfig(env);
        const updates = body.settings || body.config || body;
        const newCfg = { ...oldCfg };
        const changedKeys = [];

        for (const [key, defVal] of Object.entries(DEFAULT_SYSTEM_CONFIG)) {
          if (Object.prototype.hasOwnProperty.call(updates, key)) {
            const parsed = parseSettingValue(updates[key], defVal);
            // Basic sanity bounds
            if (typeof defVal === 'number' && parsed < 0) continue;
            const vType = typeof defVal;
            await db.exec(env, `
              INSERT INTO system_settings (setting_key, setting_value, value_type, updated_by, updated_at)
              VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(setting_key) DO UPDATE SET
                setting_value = EXCLUDED.setting_value,
                value_type = EXCLUDED.value_type,
                updated_by = EXCLUDED.updated_by,
                updated_at = CURRENT_TIMESTAMP
            `, [key, String(parsed), vType, requestorEmail]);
            if (oldCfg[key] !== parsed) changedKeys.push(key);
            newCfg[key] = parsed;
          }
        }

        invalidateSystemConfigCache();
        invalidateMemoryCache('/api/stock');
        invalidateMemoryCache('/api/reorder');
        invalidateMemoryCache('/api/leadtime');
        invalidateMemoryCache('/api/wh-dashboard');
        invalidateMemoryCache('/api/wh');

        await writeAuditLog(env, request, {
          userEmail: requestorEmail,
          action: 'SYSTEM_CONFIG_UPDATE',
          entityType: 'SYSTEM_SETTINGS',
          entityId: 'GLOBAL',
          summary: changedKeys.length
            ? `Cập nhật ${changedKeys.length} tham số cấu hình hệ thống (${changedKeys.join(', ')})`
            : 'Lưu cấu hình hệ thống',
          oldData: oldCfg,
          newData: newCfg
        });

        return new Response(JSON.stringify({
          success: true,
          data: newCfg,
          message: 'Đã lưu cấu hình hệ thống và áp dụng toàn chuỗi!'
        }), { headers: corsHeaders });
      }

      if (pathname === '/api/system/config/reset' && request.method === 'POST') {
        await ensureSystemSettingsTable(env);
        const caller = await getCallerPermissions(env, request);
        const body = await request.json().catch(() => ({}));
        const requestorEmail = caller?.user?.email || caller?.email || body.requestorEmail || request.headers.get('X-User-Email') || '';
        const isMaster = (caller && caller.isMaster) || (requestorEmail && (requestorEmail.toLowerCase().trim() === 'trantuandai2508@gmail.com' || requestorEmail.toLowerCase().includes('trantuandai2508')));
        if (!isMaster) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Từ chối truy cập: Chỉ tài khoản trantuandai2508 được phép khôi phục cấu hình mặc định.'
          }), { status: 403, headers: corsHeaders });
        }
        const oldCfg = await getSystemConfig(env);
        await db.exec(env, `DELETE FROM system_settings`);
        invalidateSystemConfigCache();
        invalidateMemoryCache('/api/stock');
        invalidateMemoryCache('/api/reorder');
        invalidateMemoryCache('/api/leadtime');
        invalidateMemoryCache('/api/wh-dashboard');
        invalidateMemoryCache('/api/wh');
        await writeAuditLog(env, request, {
          userEmail: requestorEmail,
          action: 'SYSTEM_CONFIG_RESET',
          entityType: 'SYSTEM_SETTINGS',
          entityId: 'GLOBAL',
          summary: 'Khôi phục toàn bộ cấu hình hệ thống về giá trị mặc định',
          oldData: oldCfg,
          newData: DEFAULT_SYSTEM_CONFIG
        });
        return new Response(JSON.stringify({
          success: true,
          data: { ...DEFAULT_SYSTEM_CONFIG },
          message: 'Đã khôi phục toàn bộ cấu hình về mặc định!'
        }), { headers: corsHeaders });
      }

      // ======================================================================
      // 2.11.RST DANH SÁCH DỮ LIỆU ĐÃ XÓA & KHÔI PHỤC (CHỈ DÀNH RIÊNG trantuandai2508)
      // ======================================================================
      if (pathname === '/api/system/deleted-records' && request.method === 'GET') {
        await ensureAuditLogsTable(env);
        const caller = await getCallerPermissions(env, request);
        const requestorEmail = caller?.user?.email || caller?.email || request.headers.get('X-User-Email') || '';
        const isMaster = (caller && caller.isMaster) || (requestorEmail && (requestorEmail.toLowerCase().trim() === 'trantuandai2508@gmail.com' || requestorEmail.toLowerCase().includes('trantuandai2508')));
        if (!isMaster) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Từ chối truy cập: Chức năng khôi phục dữ liệu chỉ dành riêng cho tài khoản trantuandai2508.'
          }), { status: 403, headers: corsHeaders });
        }

        const entityType = (searchParams.get('entity_type') || '').trim().toUpperCase();
        const qText = (searchParams.get('q') || '').trim().toLowerCase();
        const limit = Math.min(200, Math.max(1, Number(searchParams.get('limit')) || 100));

        let sql = `SELECT id, user_email, action, entity_type, entity_id, doc_code, site_code, summary, old_data, created_at
                   FROM audit_logs
                   WHERE action IN ('DELETE', 'CANCEL') AND old_data IS NOT NULL`;
        const params = [];
        if (entityType && entityType !== 'ALL') {
          sql += ` AND UPPER(entity_type) = ?`;
          params.push(entityType);
        }
        sql += ` ORDER BY id DESC LIMIT ?`;
        params.push(limit);

        const { rows } = await db.query(env, sql, params).catch(() => ({ rows: [] }));
        const { rows: restoredRows } = await db.query(env, `
          SELECT entity_type, entity_id, doc_code, created_at
          FROM audit_logs
          WHERE action = 'RESTORE'
          ORDER BY id DESC LIMIT 300
        `).catch(() => ({ rows: [] }));

        const restoredMap = new Map();
        for (const rr of (restoredRows || [])) {
          const k = `${String(rr.entity_type || '').toUpperCase()}|${String(rr.entity_id || '')}|${String(rr.doc_code || '')}`;
          if (!restoredMap.has(k)) restoredMap.set(k, rr.created_at);
        }

        let items = (rows || []).map(r => {
          const k = `${String(r.entity_type || '').toUpperCase()}|${String(r.entity_id || '')}|${String(r.doc_code || '')}`;
          const restoredAt = restoredMap.get(k) || null;
          return {
            ...r,
            is_restored: Boolean(restoredAt && String(restoredAt) >= String(r.created_at || '')),
            restored_at: restoredAt
          };
        });

        if (qText) {
          items = items.filter(it =>
            String(it.doc_code || '').toLowerCase().includes(qText) ||
            String(it.summary || '').toLowerCase().includes(qText) ||
            String(it.site_code || '').toLowerCase().includes(qText) ||
            String(it.user_email || '').toLowerCase().includes(qText) ||
            String(it.old_data || '').toLowerCase().includes(qText)
          );
        }

        return new Response(JSON.stringify({ success: true, data: items }), { headers: corsHeaders });
      }

      if (pathname === '/api/system/restore' && request.method === 'POST') {
        await ensureAuditLogsTable(env);
        const caller = await getCallerPermissions(env, request);
        const body = await request.json().catch(() => ({}));
        const requestorEmail = caller?.user?.email || caller?.email || body.requestorEmail || request.headers.get('X-User-Email') || '';
        const isMaster = (caller && caller.isMaster) || (requestorEmail && (requestorEmail.toLowerCase().trim() === 'trantuandai2508@gmail.com' || requestorEmail.toLowerCase().includes('trantuandai2508')));
        if (!isMaster) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Từ chối truy cập: Chỉ tài khoản trantuandai2508 được phép khôi phục dữ liệu đã xóa.'
          }), { status: 403, headers: corsHeaders });
        }

        const auditLogId = Number(body.auditLogId || body.id);
        if (!auditLogId) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu auditLogId cần khôi phục' }), { status: 400, headers: corsHeaders });
        }

        const logRow = await db.queryOne(env, `SELECT * FROM audit_logs WHERE id = ? LIMIT 1`, [auditLogId]);
        if (!logRow || !logRow.old_data) {
          return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy bản ghi audit hoặc không có dữ liệu gốc để khôi phục' }), { status: 404, headers: corsHeaders });
        }

        let oldObj = null;
        try {
          oldObj = typeof logRow.old_data === 'string' ? JSON.parse(logRow.old_data) : logRow.old_data;
        } catch (e) {
          return new Response(JSON.stringify({ success: false, error: 'Dữ liệu old_data không hợp lệ' }), { status: 400, headers: corsHeaders });
        }

        const eType = String(logRow.entity_type || '').toUpperCase();
        const isPgRestore = db.isPg(env);
        const safeTxStep = async (tx, fn) => {
          if (!isPgRestore) {
            try { return await fn(); } catch (_) { return null; }
          }
          const sp = 'sp_' + Math.random().toString(36).slice(2, 10);
          await tx.exec(`SAVEPOINT ${sp}`);
          try {
            const res = await fn();
            await tx.exec(`RELEASE SAVEPOINT ${sp}`);
            return res;
          } catch (err) {
            await tx.exec(`ROLLBACK TO SAVEPOINT ${sp}`).catch(() => {});
            await tx.exec(`RELEASE SAVEPOINT ${sp}`).catch(() => {});
            return null;
          }
        };
        const insertDynamic = async (tx, tableName, obj, excludeCols = ['id'], returningId = false) => {
          const keys = Object.keys(obj || {}).filter(k => !excludeCols.includes(k) && obj[k] !== undefined);
          if (!keys.length) return null;
          const cols = keys.join(', ');
          const placeholders = keys.map(() => '?').join(', ');
          const vals = keys.map(k => obj[k]);
          const sql = `INSERT INTO ${tableName} (${cols}) VALUES (${placeholders})${returningId ? ' RETURNING id' : ''}`;
          if (returningId) {
            return await tx.queryOne(sql, vals);
          }
          await tx.exec(sql, vals);
          return null;
        };

        try {
          let restoredMessage = '';
          await db.withTransaction(env, async (tx) => {
            if (eType === 'BATCH') {
              const b = oldObj;
              const bId = b.id || logRow.entity_id || ('bat_' + Math.random().toString(36).slice(2, 11));
              const qty = Number(b.qty) || 0;
              await tx.exec(`
                INSERT INTO inventory_batches (id, sku, branch_id, batch_code, mfg_date, exp_date, qty, storage_loc, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
              `, [bId, b.sku, b.branch_id, b.batch_code, b.mfg_date || null, b.exp_date || null, qty, b.storage_loc || 'Kho Tổng']);
              await safeTxStep(tx, () => tx.exec(`
                INSERT INTO wms.inventory_batches (id, sku, branch_id, batch_code, mfg_date, exp_date, qty, storage_loc, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
              `, [bId, b.sku, b.branch_id, b.batch_code, b.mfg_date || null, b.exp_date || null, qty, b.storage_loc || 'Kho Tổng']));

              const brRow = await safeTxStep(tx, () => tx.queryOne(`SELECT code FROM branches WHERE id = ? OR UPPER(code) = UPPER(?) LIMIT 1`, [b.branch_id, b.branch_id]));
              const siteCode = (brRow?.code || logRow.site_code || 'K001').toUpperCase();
              if (qty > 0) {
                const priceRow = await safeTxStep(tx, () => tx.queryOne(`SELECT COALESCE(NULLIF(MAX(price), 0), 0) as price FROM dim_article_stock WHERE material = ?`, [b.sku]));
                const unitPrice = Number(priceRow?.price) || 0;
                await safeTxStep(tx, () => tx.exec(`
                  UPDATE fnb_stock_balances
                  SET book_qty = COALESCE(book_qty, 0) + ?,
                      total_value = CASE WHEN ? > 0 THEN (COALESCE(book_qty, 0) + ?) * ? ELSE COALESCE(total_value, 0) END,
                      updated_at = NOW()
                  WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                `, [qty, unitPrice, qty, unitPrice, b.sku, siteCode]));
                await safeTxStep(tx, () => tx.exec(`
                  INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note)
                  VALUES (?, ?, ?, ?, 'KHOI_PHUC_LO', ?, ?)
                `, ['tx_' + Math.random().toString(36).slice(2, 11), b.branch_id, b.sku, bId, qty, `Khôi phục lô ${b.batch_code}`]));
                await safeTxStep(tx, () => tx.exec(`
                  INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                  VALUES (?, 'KHOI_PHUC_LO', ?, ?, ?, ?, ?, ?, ?)
                `, [b.batch_code, b.sku, siteCode, qty, unitPrice, qty * unitPrice, `Khôi phục lô ${b.batch_code}`, requestorEmail]));
              }
              restoredMessage = `Đã khôi phục mặt hàng ${b.sku} trong lô ${b.batch_code} (SL: ${qty})!`;
            } else if (eType === 'KITCHEN_ISSUE') {
              const header = oldObj.header || oldObj;
              const lines = Array.isArray(oldObj.lines) ? oldObj.lines : [];
              const ins = await insertDynamic(tx, 'fnb_kitchen_issues', header, ['id', 'created_at'], true);
              const newId = ins?.id;
              const siteCode = header.site_code;
              for (const ln of lines) {
                await insertDynamic(tx, 'fnb_kitchen_issue_lines', { ...ln, issue_id: newId }, ['id', 'created_at'], false);
                const qty = Number(ln.qty) || 0;
                const price = Number(ln.unit_price) || 0;
                if (qty > 0) {
                  await safeTxStep(tx, () => tx.exec(`
                    UPDATE fnb_stock_balances
                    SET book_qty = GREATEST(0, COALESCE(book_qty, 0) - ?),
                        total_value = GREATEST(0, (COALESCE(book_qty, 0) - ?) * ?),
                        updated_at = NOW()
                    WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                  `, [qty, qty, price, ln.item_code, siteCode]));
                }
              }
              restoredMessage = `Đã khôi phục phiếu xuất kho ${header.issue_code} (${lines.length} dòng)!`;
            } else if (eType === 'WASTE') {
              const header = oldObj.header || oldObj;
              const lines = Array.isArray(oldObj.lines) ? oldObj.lines : [];
              const ins = await insertDynamic(tx, 'fnb_stock_wastes', header, ['id', 'created_at'], true);
              const newId = ins?.id;
              const siteCode = header.site_code;
              for (const ln of lines) {
                await insertDynamic(tx, 'fnb_stock_waste_lines', { ...ln, waste_id: newId }, ['id', 'created_at'], false);
                const qty = Number(ln.qty) || 0;
                const price = Number(ln.unit_price) || 0;
                if (qty > 0) {
                  await safeTxStep(tx, () => tx.exec(`
                    UPDATE fnb_stock_balances
                    SET waste_qty = COALESCE(waste_qty, 0) + ?,
                        book_qty = GREATEST(0, COALESCE(book_qty, 0) - ?),
                        total_value = CASE WHEN ? > 0 THEN GREATEST(0, COALESCE(book_qty, 0) - ?) * ? ELSE COALESCE(total_value, 0) END,
                        updated_at = NOW()
                    WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                  `, [qty, qty, price, qty, price, ln.item_code, siteCode]));
                }
              }
              restoredMessage = `Đã khôi phục biên bản hủy ${header.waste_code} (${lines.length} dòng)!`;
            } else if (eType === 'COUNT') {
              const header = oldObj.header || oldObj;
              const lines = Array.isArray(oldObj.lines) ? oldObj.lines : [];
              const ins = await insertDynamic(tx, 'fnb_stock_counts', header, ['id', 'created_at'], true);
              const newId = ins?.id;
              for (const ln of lines) {
                await insertDynamic(tx, 'fnb_stock_count_lines', { ...ln, count_id: newId }, ['id', 'created_at'], false);
              }
              restoredMessage = `Đã khôi phục phiếu kiểm kê ${header.count_code}${lines.length ? ` (${lines.length} dòng)` : ''}!`;
            } else if (eType === 'RECEIPT') {
              const header = oldObj.header || (oldObj.receipt_code ? oldObj : null);
              const lines = Array.isArray(oldObj.lines) ? oldObj.lines : [];
              if (header) {
                const ins = await insertDynamic(tx, 'fnb_stock_receipts', header, ['id', 'created_at'], true);
                const newId = ins?.id;
                const siteCode = header.site_code;
                for (const ln of lines) {
                  await insertDynamic(tx, 'fnb_stock_receipt_lines', { ...ln, receipt_id: newId }, ['id', 'created_at'], false);
                  const qty = Number(ln.qty) || 0;
                  const price = Number(ln.unit_price) || 0;
                  if (qty > 0) {
                    await safeTxStep(tx, () => tx.exec(`
                      UPDATE fnb_stock_balances
                      SET book_qty = COALESCE(book_qty, 0) + ?,
                          receipt_qty = COALESCE(receipt_qty, 0) + ?,
                          total_value = CASE WHEN ? > 0 THEN (COALESCE(book_qty, 0) + ?) * ? ELSE COALESCE(total_value, 0) END,
                          updated_at = NOW()
                      WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                    `, [qty, qty, price, qty, price, ln.item_code, siteCode]));
                  }
                }
                if (header.invoice_no) {
                  await safeTxStep(tx, () => tx.exec(`UPDATE wms.sap_po_items SET status = 'COMPLETED', updated_at = NOW() WHERE po_number = ?`, [header.invoice_no]));
                }
                restoredMessage = `Đã khôi phục phiếu nhập kho ${header.receipt_code} (${lines.length} dòng)!`;
              } else if (oldObj.po_number) {
                await safeTxStep(tx, () => tx.exec(`UPDATE wms.sap_po_items SET status = 'COMPLETED', updated_at = NOW() WHERE po_number = ?`, [oldObj.po_number]));
                restoredMessage = `Đã khôi phục trạng thái đơn PO ${oldObj.po_number}!`;
              }
            } else if (eType === 'ORDER') {
              const header = oldObj.header || oldObj;
              const steps = Array.isArray(oldObj.steps) ? oldObj.steps : [];
              await insertDynamic(tx, 'don_hang', header, ['id'], false);
              for (const st of steps) {
                await insertDynamic(tx, 'quy_trinh_don', st, ['id'], false);
              }
              restoredMessage = `Đã khôi phục đơn đặt hàng ${header.order_code}!`;
            } else if (eType === 'VOUCHER') {
              const header = oldObj.header || oldObj;
              const files = Array.isArray(oldObj.files) ? oldObj.files : [];
              await insertDynamic(tx, 'chung_tu', header, ['id'], false);
              for (const fl of files) {
                await insertDynamic(tx, 'chung_tu_file', fl, ['id'], false);
              }
              restoredMessage = `Đã khôi phục chứng từ ${header.voucher_code}!`;
            } else {
              throw new Error(`Chưa hỗ trợ khôi phục loại dữ liệu: ${eType}`);
            }
          });

          invalidateMemoryCache('/api/stock');
          invalidateMemoryCache('/api/fnb');
          invalidateMemoryCache('/api/wh');
          invalidateMemoryCache('/api/po-sap');
          invalidateMemoryCache('/api/vouchers');

          await writeAuditLog(env, request, {
            userEmail: requestorEmail,
            action: 'RESTORE',
            entityType: eType,
            entityId: logRow.entity_id,
            docCode: logRow.doc_code,
            siteCode: logRow.site_code,
            summary: restoredMessage || `Khôi phục dữ liệu ${eType} (${logRow.doc_code || logRow.entity_id})`,
            newData: oldObj
          });

          return new Response(JSON.stringify({
            success: true,
            message: restoredMessage || 'Khôi phục dữ liệu thành công!'
          }), { headers: corsHeaders });
        } catch (err) {
          console.error('POST /api/system/restore error:', err);
          return new Response(JSON.stringify({
            success: false,
            error: 'Lỗi khôi phục dữ liệu: ' + (err?.message || err)
          }), { status: 500, headers: corsHeaders });
        }
      }

      // 2.11.3 CHUYỂN ĐỔI VAI TRÒ TEST NHANH (/api/auth/switch-role)
      if (pathname === '/api/auth/switch-role' && request.method === 'POST') {
        const { role, email } = await request.json();
        if (!role) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu vai trò' }), { status: 400, headers: corsHeaders });
        }
        const roleInfo = await db.queryOne(env, `SELECT * FROM app_roles WHERE role_code = ? LIMIT 1`, [role]);
        if (!roleInfo) {
          return new Response(JSON.stringify({ success: false, error: 'Vai trò không hợp lệ' }), { status: 400, headers: corsHeaders });
        }

        let user = null;
        if (email) {
          user = await db.queryOne(env, `SELECT * FROM app_users WHERE email = ? LIMIT 1`, [email]);
        }

        // BẢO VỆ PHÂN QUYỀN: Chỉ Admin (Owner) hoặc user đã được Admin phê duyệt vai trò này mới được phép chuyển
        const isOwner = email === 'trantuandai2508@gmail.com' || (user && user.role_code === 'ADMIN');
        const isCurrentRole = user && user.role_code === role;

        let isApprovedRole = false;
        if (email) {
          const approvedReq = await db.queryOne(env, `
            SELECT id FROM access_requests 
            WHERE user_email = ? AND requested_role = ? AND status = 'APPROVED' 
            LIMIT 1
          `, [email, role]);
          if (approvedReq) isApprovedRole = true;
        }

        if (!isOwner && !isCurrentRole && !isApprovedRole) {
          return new Response(JSON.stringify({
            success: false,
            error: `Bạn chưa được Ban Quản Trị phê duyệt vai trò ${roleInfo.role_name}. Vui lòng gửi yêu cầu để Admin duyệt.`
          }), { status: 403, headers: corsHeaders });
        }

        const permissions = await buildUserPermissions(env, { role_code: role, email: email || '' });

        return new Response(JSON.stringify({
          success: true,
          data: {
            role: roleInfo.role_code,
            roleName: roleInfo.role_name,
            badgeColor: roleInfo.badge_color,
            permissions
          }
        }), { headers: corsHeaders });
      }

      // 2.11.4 YÊU CẦU CẤP QUYỀN TRUY CẬP (/api/auth/request-access)
      if (pathname === '/api/auth/request-access' && request.method === 'POST') {
        const { email, fullName, requestedRole, requestedFeature, requestedSite, reason } = await request.json();
        if (!email) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu email người yêu cầu' }), { status: 400, headers: corsHeaders });
        }
        await db.exec(env, `ALTER TABLE access_requests ADD COLUMN IF NOT EXISTS requested_site TEXT`).catch(() => {});

        const cleanSite = (requestedSite || '').trim();
        const featureText = requestedFeature || (cleanSite ? `Đổi Site → ${cleanSite}` : '');
        try {
          await db.exec(env, `
            INSERT INTO access_requests (user_email, user_name, requested_role, requested_feature, requested_site, reason, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP)
          `, [email, fullName || '', requestedRole || 'NHAN_VIEN', featureText, cleanSite || null, reason || '']);
        } catch (_) {
          await db.exec(env, `
            INSERT INTO access_requests (user_email, user_name, requested_role, requested_feature, reason, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP)
          `, [email, fullName || '', requestedRole || 'NHAN_VIEN', featureText, reason || '']);
        }

        return new Response(JSON.stringify({
          success: true,
          message: cleanSite
            ? `Đã gửi yêu cầu chuyển sang site [${cleanSite}] đến Quản Trị Viên!`
            : 'Yêu cầu cấp quyền đã được gửi thành công đến Quản Trị Viên!'
        }), { headers: corsHeaders });
      }

      // 2.11.5 DANH SÁCH YÊU CẦU CẤP QUYỀN (/api/auth/access-requests)
      if (pathname === '/api/auth/access-requests' && request.method === 'GET') {
        const { rows: results } = await db.query(env, `
          SELECT * FROM access_requests ORDER BY id DESC LIMIT 50
        `);
        const cleanedResults = (results || []).map(r => ({ ...r, user_name: repairAtobMojibake(r.user_name) }));
        return new Response(JSON.stringify({ success: true, data: cleanedResults }), { headers: corsHeaders });
      }

      // 2.11.6 PHÊ DUYỆT / TỪ CHỐI YÊU CẦU CẤP QUYỀN (/api/auth/approve-access-request)
      if (pathname === '/api/auth/approve-access-request' && request.method === 'POST') {
        const { requestId, action, reviewedBy } = await request.json();
        const req = await db.queryOne(env, `SELECT * FROM access_requests WHERE id = ?`, [requestId]);
        if (!req) {
          return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy yêu cầu' }), { status: 404, headers: corsHeaders });
        }

        const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
        await db.exec(env, `
          UPDATE access_requests
          SET status = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
          WHERE id = ?
        `, [newStatus, reviewedBy || 'Admin', requestId]);

        let approvedSiteMsg = '';
        if (action === 'APPROVE') {
          await db.exec(env, `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS assigned_site TEXT`).catch(() => {});

          // Xác định xem đây có phải yêu cầu Đổi Site hay không
          let targetSite = (req.requested_site || '').trim();
          if (!targetSite && req.requested_feature && /Đổi Site|Chuyển Đổi Điểm Bán/i.test(req.requested_feature)) {
            const m = String(req.requested_feature).match(/→\s*([A-Za-z0-9_-]+)/);
            if (m && m[1]) targetSite = m[1].trim();
          }
          if (!targetSite && req.reason) {
            const mReason = String(req.reason).match(/(?:site|cơ sở(?:\s+phụ\s+trách)?)\s*[:\[]?\s*([A-Z]\d{3}|ALL)\b/i);
            if (mReason && mReason[1]) targetSite = mReason[1].toUpperCase();
          }

          if (targetSite) {
            if (targetSite.toUpperCase() === 'ALL') {
              await db.exec(env, `
                INSERT INTO user_permissions (user_email, feature_code, can_view)
                VALUES (?, 'all_sites', true)
                ON CONFLICT(user_email, feature_code) DO UPDATE SET can_view = true
              `, [req.user_email]).catch(() => {});
              approvedSiteMsg = `Đã phê duyệt quyền truy cập Toàn Chuỗi (ALL) cho ${req.user_email}`;
            } else {
              await db.exec(env, `
                UPDATE app_users SET assigned_site = ? WHERE LOWER(email) = LOWER(?)
              `, [targetSite, req.user_email]).catch(() => {});
              approvedSiteMsg = `Đã phê duyệt chuyển sang site [${targetSite}] cho ${req.user_email}`;
            }
          } else {
            const currentUser = await db.queryOne(env, `SELECT * FROM app_users WHERE email = ? LIMIT 1`, [req.user_email]);
            if (currentUser) {
              const roleHierarchy = {
                'ADMIN': 100,
                'KHO_TRUONG': 50,
                'BEP_TRUONG': 40,
                'KE_TOAN': 40,
                'NHAN_VIEN': 10
              };
              const currentWeight = roleHierarchy[currentUser.role_code] || 10;
              const requestedWeight = roleHierarchy[req.requested_role] || 10;

              let newRole = currentUser.role_code;
              if (currentUser.role_code === 'NHAN_VIEN' || requestedWeight > currentWeight) {
                newRole = req.requested_role;
              } else if (req.requested_role === 'KHO_TRUONG') {
                newRole = 'KHO_TRUONG';
              }

              await db.exec(env, `
                UPDATE app_users
                SET role_code = ?
                WHERE email = ?
              `, [newRole, req.user_email]);
            }
          }

          invalidateMemoryCache('auth_me_');
        }

        return new Response(JSON.stringify({
          success: true,
          message: action === 'APPROVE'
            ? (approvedSiteMsg || `Đã phê duyệt vai trò ${req.requested_role} cho ${req.user_email}`)
            : `Đã từ chối yêu cầu của ${req.user_email}`
        }), { headers: corsHeaders });
      }

      // 2.11 Admin Auth
      if (pathname === '/api/auth/login' && request.method === 'POST') {
        const { email, password } = await request.json();
        const user = await db.queryOne(env, `SELECT * FROM admin_users WHERE email = ? LIMIT 1`, [email]);
        if (!user) return new Response(JSON.stringify({ success: false, error: 'Email hoặc mật khẩu không đúng' }), { status: 401, headers: corsHeaders });

        const computedHash = await sha256(`${user.salt}::${password}`);
        if (computedHash !== user.password_hash && password !== user.password_raw) {
          return new Response(JSON.stringify({ success: false, error: 'Mật khẩu không chính xác' }), { status: 401, headers: corsHeaders });
        }

        return new Response(JSON.stringify({
          success: true,
          data: { email: user.email, fullName: user.full_name, role: user.role, phone: user.phone }
        }), { headers: corsHeaders });
      }

      if (pathname === '/api/auth/register' && request.method === 'POST') {
        const { email, fullName, phone, role, password } = await request.json();
        const existing = await db.queryOne(env, `SELECT email FROM admin_users WHERE email = ?`, [email]);
        if (existing) return new Response(JSON.stringify({ success: false, error: 'Email đã tồn tại' }), { status: 400, headers: corsHeaders });

        const salt = crypto.randomUUID();
        const hash = await sha256(`${salt}::${password}`);
        const nowStr = formatDate(new Date());

        await db.exec(env, `
          INSERT INTO admin_users (email, full_name, phone, role, password_raw, password_hash, salt, status, registered_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'Chờ duyệt', ?)
        `, [email, fullName, phone, role || 'Quản lý Site', password, hash, salt, nowStr]);

        return new Response(JSON.stringify({ success: true, message: 'Đăng ký thành công. Vui lòng chờ phê duyệt.' }), { headers: corsHeaders });
      }

      // ======================================================================
      // PHÂN HỆ 3: ORBIT SIBA FOOD - P&L VÀ XẾP HẠNG TOÀN CHUỖI (F&B CHAIN)
      // ======================================================================

      // 3.1 GET /api/fnb/pl - Báo cáo P&L chi tiết của điểm bán (Lấy từ bảng transactions trên D1 hoặc Postgres)
      if (pathname === '/api/fnb/pl' && request.method === 'GET') {
        const site = searchParams.get('site') || '';
        const thang = normalizeMonth(searchParams.get('thang') || '2026-11');
        const siteCode = extractSiteCode(site);

        // Lấy thông tin site
        let siteRow = null;
        if (siteCode && siteCode !== 'ALL') {
          siteRow = await db.queryOne(env, `
            SELECT * FROM sites WHERE site_code = ? OR site_name = ? OR name LIKE ? LIMIT 1
          `, [siteCode, site, `%${siteCode}%`]);
        }

        let siteName = 'Toàn Hệ Thống Bếp Ăn A.Kitchen';
        if (siteCode && siteCode !== 'ALL') {
          if (siteRow) {
            siteName = siteRow.site_name;
          } else {
            const transSite = await db.queryOne(env, `
              SELECT ten_cua_hang FROM transactions WHERE ma_cua_hang = ? LIMIT 1
            `, [siteCode]);
            siteName = transSite ? transSite.ten_cua_hang : (site || 'K001 - MN Bếp Ăn Đại Học Hùng Vương');
          }
        }

        const budget = siteRow ? (siteRow.budget_limit || 45000000) : 45000000;

        let effectiveMonth = thang;
        let checkRange = getMonthRange(effectiveMonth);
        const countCheck = await db.queryOne(env, `
          SELECT 1 as cnt FROM transactions WHERE billing_date >= ? AND billing_date <= ? LIMIT 1
        `, [checkRange.start, checkRange.end]);

        if (!countCheck) {
          const latestRow = await db.queryOne(env, {
            d1: `SELECT SUBSTR(billing_date, 1, 7) as ym FROM transactions ORDER BY billing_date DESC LIMIT 1`,
            pg: `SELECT to_char(billing_date, 'YYYY-MM') as ym FROM transactions ORDER BY billing_date DESC LIMIT 1`
          });
          if (latestRow && latestRow.ym) {
            effectiveMonth = latestRow.ym;
          }
        }
        const effRange = getMonthRange(effectiveMonth);
        const effStart = effRange.start;
        const effEnd = effRange.end;

        // Ưu tiên đọc từ bảng tổng hợp fnb_monthly_summary
        let stats = null;
        let summaryQuery = `
          SELECT 
            SUM(total_bills) as total_bills,
            MAX(active_days) as active_days,
            COALESCE(SUM(net_revenue), 0) as net_revenue,
            COALESCE(SUM(gross_revenue), 0) as gross_revenue,
            COALESCE(SUM(discount), 0) as discount,
            COALESCE(SUM(food_cost), 0) as food_cost,
            COALESCE(SUM(dine_in_rev), 0) as dine_in_rev,
            COALESCE(SUM(takeaway_rev), 0) as takeaway_rev,
            COALESCE(SUM(catering_rev), 0) as catering_rev
          FROM fnb_monthly_summary
          WHERE month_period = ?
        `;
        let sumBinds = [effectiveMonth];
        if (siteCode && siteCode !== 'ALL') {
          summaryQuery += ` AND site_code = ?`;
          sumBinds.push(siteCode);
        }
        stats = await db.queryOne(env, summaryQuery, sumBinds).catch(() => null);

        // Fallback sang transactions nếu chưa có trong fnb_monthly_summary
        if (!stats || !stats.net_revenue || Number(stats.net_revenue) === 0) {
          let plQuery = `
            SELECT 
              COUNT(DISTINCT so_hoa_don) as total_bills,
              COUNT(DISTINCT billing_date) as active_days,
              COALESCE(SUM(thanh_tien_truoc_thue), 0) as net_revenue,
              COALESCE(SUM(tong_tien_billing), 0) as gross_revenue,
              COALESCE(SUM(ck_truoc_thue), 0) as discount,
              COALESCE(SUM(gia_von), 0) as food_cost
            FROM transactions
            WHERE billing_date >= ? AND billing_date <= ?
          `;
          let plBinds = [effStart, effEnd];
          if (siteCode && siteCode !== 'ALL') {
            plQuery += ` AND ma_cua_hang = ?`;
            plBinds.push(siteCode);
          }
          stats = await db.queryOne(env, plQuery, plBinds);
        }

        const plannedTargetRevenue = (siteCode === 'ALL') ? 4500000000 : (budget * 10);
        let grossRevenue = Math.round(stats?.gross_revenue || 0);
        let discount = Math.round(stats?.discount || 0);
        let netRevenue = Math.round(stats?.net_revenue || 0);
        let foodCost = Math.round(stats?.food_cost || 0);

        const foodCostPct = netRevenue > 0 ? ((foodCost / netRevenue) * 100).toFixed(1) : '0.0';
        const laborCost = Math.round(netRevenue * 0.185);
        const primeCost = foodCost + laborCost;
        const rentCost = (siteCode === 'ALL') ? 350000000 : (siteRow ? 28000000 : 25000000);
        const utilityCost = Math.round(netRevenue * 0.034);
        const supplyCost = Math.round(netRevenue * 0.030);
        const wasteCost = Math.round(netRevenue * 0.012);
        const marketingCost = Math.round(netRevenue * 0.015);

        const totalCost = foodCost + laborCost + rentCost + utilityCost + supplyCost + wasteCost + marketingCost;
        const operatingProfit = netRevenue - totalCost;
        const profitMargin = netRevenue > 0 ? ((operatingProfit / netRevenue) * 100).toFixed(1) : '0.0';
        const breakEvenRevenue = netRevenue > 0 ? Math.round(rentCost / Math.max(0.1, (1 - (foodCost + utilityCost + wasteCost) / netRevenue))) : 0;

        // Phân rã doanh thu theo kênh bán hàng
        const channels = {
          dineIn: Math.round(stats?.dine_in_rev || 0),
          takeaway: Math.round(stats?.takeaway_rev || 0),
          catering: Math.round(stats?.catering_rev || 0)
        };

        if (channels.dineIn === 0 && channels.takeaway === 0 && channels.catering === 0 && netRevenue > 0) {
          let channelQuery = `
            SELECT COALESCE(ten_kenh_ban_hang, 'Kênh khác') as ch_name, COALESCE(SUM(thanh_tien_truoc_thue), 0) as ch_rev
            FROM transactions
            WHERE billing_date >= ? AND billing_date <= ?
          `;
          let chBinds = [effStart, effEnd];
          if (siteCode && siteCode !== 'ALL') {
            channelQuery += ` AND ma_cua_hang = ?`;
            chBinds.push(siteCode);
          }
          channelQuery += ` GROUP BY ten_kenh_ban_hang ORDER BY ch_rev DESC`;
          const { rows: chRows } = await db.query(env, channelQuery, chBinds);

          (chRows || []).forEach(r => {
            const name = (r.ch_name || '').toLowerCase();
            if (name.includes('sỉ') || name.includes('b2b') || name.includes('suất ăn')) {
              channels.catering += Math.round(r.ch_rev || 0);
            } else if (name.includes('mang') || name.includes('online')) {
              channels.takeaway += Math.round(r.ch_rev || 0);
            } else {
              channels.dineIn += Math.round(r.ch_rev || 0);
            }
          });
          if (channels.dineIn === 0 && channels.takeaway === 0 && channels.catering === 0 && netRevenue > 0) {
            channels.dineIn = Math.round(netRevenue * 0.72);
            channels.takeaway = Math.round(netRevenue * 0.20);
            channels.catering = Math.round(netRevenue * 0.08);
          }
        }

        // Top 5 món bán chạy thực tế từ bảng transactions
        let topQuery = {
          d1: `
            SELECT ma_sp as code, ten_sp as name, 
                   ROUND(SUM(so_luong), 0) as qty, 
                   ROUND(SUM(thanh_tien_truoc_thue), 0) as rev,
                   ROUND((SUM(gia_von) * 1.0 / NULLIF(SUM(thanh_tien_truoc_thue), 0)) * 100, 1) as "foodCostPct"
            FROM transactions
            WHERE billing_date >= ? AND billing_date <= ?
            ${siteCode && siteCode !== 'ALL' ? 'AND ma_cua_hang = ?' : ''}
            GROUP BY ma_sp, ten_sp ORDER BY rev DESC LIMIT 5
          `,
          pg: `
            SELECT ma_sp as code, ten_sp as name, 
                   ROUND(SUM(so_luong)::numeric, 0) as qty, 
                   ROUND(SUM(thanh_tien_truoc_thue)::numeric, 0) as rev,
                   ROUND(((SUM(gia_von) * 1.0 / NULLIF(SUM(thanh_tien_truoc_thue), 0)) * 100)::numeric, 1) as "foodCostPct"
            FROM transactions
            WHERE billing_date >= ? AND billing_date <= ?
            ${siteCode && siteCode !== 'ALL' ? 'AND ma_cua_hang = ?' : ''}
            GROUP BY ma_sp, ten_sp ORDER BY rev DESC LIMIT 5
          `
        };
        let topBinds = [effStart, effEnd];
        if (siteCode && siteCode !== 'ALL') {
          topBinds.push(siteCode);
        }
        const { rows: topRows } = await db.query(env, topQuery, topBinds);

        const topDishes = (topRows && topRows.length > 0) ? topRows.map(m => ({
          code: m.code || 'SP',
          name: m.name || 'Món ăn',
          qty: m.qty || 0,
          revenue: m.rev || 0,
          rev: m.rev || 0,
          foodCostPct: m.foodCostPct || 40.0
        })) : [];

        // Xu hướng 4 tuần theo dữ liệu giao dịch thật
        let weeklyQuery = {
          d1: `
            SELECT 
              CASE 
                WHEN CAST(SUBSTR(billing_date, 9, 2) AS INTEGER) <= 7 THEN 'Tuần 1'
                WHEN CAST(SUBSTR(billing_date, 9, 2) AS INTEGER) <= 14 THEN 'Tuần 2'
                WHEN CAST(SUBSTR(billing_date, 9, 2) AS INTEGER) <= 21 THEN 'Tuần 3'
                ELSE 'Tuần 4'
              END as week,
              COUNT(DISTINCT so_hoa_don) as bills,
              COALESCE(SUM(thanh_tien_truoc_thue), 0) as "netRev",
              COALESCE(SUM(gia_von), 0) as "foodCost"
            FROM transactions
            WHERE billing_date >= ? AND billing_date <= ?
            ${siteCode && siteCode !== 'ALL' ? 'AND ma_cua_hang = ?' : ''}
            GROUP BY week ORDER BY week
          `,
          pg: `
            SELECT 
              CASE 
                WHEN EXTRACT(DAY FROM billing_date) <= 7 THEN 'Tuần 1'
                WHEN EXTRACT(DAY FROM billing_date) <= 14 THEN 'Tuần 2'
                WHEN EXTRACT(DAY FROM billing_date) <= 21 THEN 'Tuần 3'
                ELSE 'Tuần 4'
              END as week,
              COUNT(DISTINCT so_hoa_don) as bills,
              COALESCE(SUM(thanh_tien_truoc_thue), 0) as "netRev",
              COALESCE(SUM(gia_von), 0) as "foodCost"
            FROM transactions
            WHERE billing_date >= ? AND billing_date <= ?
            ${siteCode && siteCode !== 'ALL' ? 'AND ma_cua_hang = ?' : ''}
            GROUP BY week ORDER BY week
          `
        };
        let wBinds = [effStart, effEnd];
        if (siteCode && siteCode !== 'ALL') {
          wBinds.push(siteCode);
        }
        const { rows: weekRows } = await db.query(env, weeklyQuery, wBinds);

        const weeklyTrends = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'].map(wName => {
          const row = (weekRows || []).find(r => r.week === wName);
          const wNetRev = row ? Math.round(row.netRev || 0) : 0;
          const wFoodCost = row ? Math.round(row.foodCost || 0) : 0;
          const fcPct = wNetRev > 0 ? ((wFoodCost / wNetRev) * 100).toFixed(1) : '42.0';
          const lcPct = '18.5';
          const pMargin = wNetRev > 0 ? (100 - parseFloat(fcPct) - 18.5 - 15.0).toFixed(1) : '24.5';
          return {
            week: wName,
            netRevenue: wNetRev,
            netRev: wNetRev,
            foodCostPct: parseFloat(fcPct),
            laborCostPct: 18.5,
            profitMargin: parseFloat(pMargin),
            profitPct: parseFloat(pMargin)
          };
        });

        // Chỉ số vận hành thực tế
        const totalBills = stats?.total_bills || 0;
        const activeDays = stats?.active_days || 1;
        const opMetrics = {
          avgDailyBills: activeDays > 0 ? Math.round(totalBills / activeDays) : 0,
          totalBills: totalBills,
          avgSpendPerBill: totalBills > 0 ? Math.round(netRevenue / totalBills) : 0,
          avgBill: totalBills > 0 ? Math.round(netRevenue / totalBills) : 0,
          dailyRevenue: activeDays > 0 ? Math.round(netRevenue / activeDays) : 0,
          revenuePerSeatPerDay: activeDays > 0 ? Math.round(netRevenue / (120 * activeDays)) : 0,
          revPerSeat: activeDays > 0 ? Math.round(netRevenue / (120 * activeDays)) : 0,
          peakOccupancyPct: 78.5,
          reliability: 98.5,
          totalDays: activeDays
        };

        // Kế hoạch hành động
        const actionPlans = [
          'Tối ưu định lượng suất thịt sườn BaF 120g đúng chuẩn định mức quy định',
          'Rà soát hạn dùng gia vị tồn kho chuẩn FEFO tránh hủy cận date tại kho điểm',
          'Điều chỉnh lịch phân ca giờ cao điểm trưa (11:30 - 12:30) giảm chi phí ngoài giờ (OT)'
        ];

        const plResponseData = {
          success: true,
          data: {
            site: siteName,
            siteCode: siteCode || 'K001',
            month: effectiveMonth,
            targetRevenue: plannedTargetRevenue,
            grossRevenue,
            discount,
            netRevenue,
            foodCost,
            laborCost,
            primeCost,
            foodCostPct: parseFloat(foodCostPct),
            laborCostPct: 18.5,
            primeCostPct: parseFloat((parseFloat(foodCostPct) + 18.5).toFixed(1)),
            rentCost,
            utilityCost,
            supplyCost,
            wasteCost,
            marketingCost,
            totalCost,
            operatingProfit,
            profitMargin,
            breakEvenRevenue,
            channels,
            opMetrics,
            weeklyTrends,
            topDishes,
            actionPlans
          }
        };

        return createCachedResponse(plResponseData, 180, corsHeaders, isNoCache, url, request, ctx, url.toString());
      }

      // 3.2 GET /api/fnb/chain - Báo cáo xếp hạng toàn chuỗi (Tối ưu: Đọc bảng summary trước, fallback Range query)
      if (pathname === '/api/fnb/chain' && request.method === 'GET') {
        const month = normalizeMonth(searchParams.get('month') || '2026-11');
        let effectiveMonth = month;
        let checkRange = getMonthRange(effectiveMonth);

        // Kiểm tra xem tháng có data không (Đọc đúng 1 dòng qua LIMIT 1)
        const countCheck = await db.queryOne(env, `
          SELECT 1 as cnt FROM transactions WHERE billing_date >= ? AND billing_date <= ? LIMIT 1
        `, [checkRange.start, checkRange.end]);

        if (!countCheck) {
          const latestRow = await db.queryOne(env, {
            d1: `SELECT SUBSTR(billing_date, 1, 7) as ym FROM transactions ORDER BY billing_date DESC LIMIT 1`,
            pg: `SELECT to_char(billing_date, 'YYYY-MM') as ym FROM transactions ORDER BY billing_date DESC LIMIT 1`
          });
          if (latestRow && latestRow.ym) {
            effectiveMonth = latestRow.ym;
          }
        }
        const effRange = getMonthRange(effectiveMonth);
        const effStart = effRange.start;
        const effEnd = effRange.end;

        // Lấy danh sách điểm bán từ bảng sites
        const { rows: siteList } = await db.query(env, `SELECT * FROM sites ORDER BY site_code`);

        // Ưu tiên đọc từ bảng tổng hợp fnb_monthly_summary (chỉ đọc ~15 dòng!)
        let transSums = [];
        const { rows: summaryRows } = await db.query(env, `
          SELECT 
            site_code as ma_cua_hang,
            site_name as ten_cua_hang,
            region as vung_mien,
            net_revenue as net_rev,
            food_cost,
            total_bills
          FROM fnb_monthly_summary
          WHERE month_period = ?
        `, [effectiveMonth]).catch(() => ({ rows: [] }));

        if (summaryRows && summaryRows.length > 0) {
          transSums = summaryRows;
        } else {
          // Fallback: Range Query trên transactions
          const { rows: rawSums } = await db.query(env, `
            SELECT 
              ma_cua_hang,
              ten_cua_hang,
              vung_mien,
              COALESCE(SUM(thanh_tien_truoc_thue), 0) as net_rev,
              COALESCE(SUM(gia_von), 0) as food_cost,
              COUNT(DISTINCT so_hoa_don) as total_bills
            FROM transactions
            WHERE billing_date >= ? AND billing_date <= ?
            GROUP BY ma_cua_hang, ten_cua_hang, vung_mien
          `, [effStart, effEnd]);
          transSums = rawSums || [];
        }

        const siteRevMap = {};
        (transSums || []).forEach(t => {
          siteRevMap[t.ma_cua_hang] = t;
        });

        // Hợp nhất danh sách sites
        const allKnownSites = [...(siteList || [])];
        (transSums || []).forEach(t => {
          if (!allKnownSites.some(s => s.site_code === t.ma_cua_hang)) {
            allKnownSites.push({
              site_code: t.ma_cua_hang,
              site_name: t.ten_cua_hang || t.ma_cua_hang,
              region: t.vung_mien || 'Miền Nam',
              budget_limit: 45000000
            });
          }
        });

        const chainRankings = allKnownSites.map((s, idx) => {
          const trans = siteRevMap[s.site_code];
          const hasTrans = !!trans && Number(trans.net_rev) > 0;
          const rev = hasTrans ? Math.round(Number(trans.net_rev)) : 0;
          const foodCostVal = hasTrans ? Math.round(Number(trans.food_cost)) : 0;
          const totalBills = hasTrans ? Number(trans.total_bills) : 0;
          const target = (s.budget_limit && s.budget_limit > 0) ? s.budget_limit * 10 : 450000000;

          const foodPct = rev > 0 ? ((foodCostVal / rev) * 100).toFixed(1) : '0.0';
          const laborPct = rev > 0 ? '18.2' : '0.0';
          const profitPct = rev > 0 ? (100 - parseFloat(foodPct) - parseFloat(laborPct) - 15.5).toFixed(1) : '0.0';
          
          let status = 'CHƯA PHÁT SINH';
          if (rev > 0) {
            const achPct = (rev / target) * 100;
            if (achPct >= 100 || parseFloat(profitPct) >= 25.0) status = 'VƯỢT CHỈ TIÊU';
            else if (achPct >= 80) status = 'TRONG MỨC';
            else status = 'CẦN XEM XÉT';
          }

          return {
            rank: idx + 1,
            code: s.site_code,
            name: s.site_name,
            region: s.region,
            netRevenue: rev,
            foodCost: foodCostVal,
            totalBills: totalBills,
            targetRevenue: target,
            achievementPct: rev > 0 ? ((rev / target) * 100).toFixed(1) : '0.0',
            foodCostPct: foodPct,
            laborCostPct: laborPct,
            profitMargin: profitPct,
            operatingProfit: rev > 0 ? Math.round(rev * (parseFloat(profitPct) / 100)) : 0,
            status
          };
        }).sort((a, b) => b.netRevenue - a.netRevenue);

        chainRankings.forEach((item, i) => { item.rank = i + 1; });

        const totalChainRev = chainRankings.reduce((sum, r) => sum + r.netRevenue, 0);
        const totalChainProfit = chainRankings.reduce((sum, r) => sum + r.operatingProfit, 0);
        const totalChainFoodCost = chainRankings.reduce((sum, r) => sum + r.foodCost, 0);

        const chainResponseData = {
          success: true,
          data: {
            totalSites: chainRankings.length,
            month: effectiveMonth,
            totalChainRevenue: totalChainRev,
            totalChainProfit: totalChainProfit,
            avgChainMargin: totalChainRev > 0 ? ((totalChainProfit / totalChainRev) * 100).toFixed(1) : '0.0',
            avgFoodCostPct: totalChainRev > 0 ? ((totalChainFoodCost / totalChainRev) * 100).toFixed(1) : '0.0',
            avgLaborCostPct: '18.2',
            rankings: chainRankings
          }
        };

        return createCachedResponse(chainResponseData, 180, corsHeaders, isNoCache, url, request, ctx, url.toString());
      }

      // 3.3 GET /api/fnb/pos - Thống kê doanh thu POS từ bảng transactions trên D1 hoặc Postgres
      if (pathname === '/api/fnb/pos' && request.method === 'GET') {
        const site = searchParams.get('site') || '';
        const siteCode = extractSiteCode(site);
        let date = searchParams.get('date') || '';

        // Nếu không có ngày, lấy ngày có giao dịch mới nhất trong bảng transactions
        if (!date) {
          const latestRow = await db.queryOne(env, {
            d1: `SELECT MAX(billing_date) as max_date FROM transactions`,
            pg: `SELECT to_char(MAX(billing_date), 'YYYY-MM-DD') as max_date FROM transactions`
          });
          date = latestRow?.max_date || '2026-11-19';
        }

        // Ưu tiên đọc từ fnb_daily_summary
        let dailyStats = null;
        let dQuery = {
          d1: `SELECT 
                 SUM(total_bills) as bills_today,
                 COALESCE(SUM(net_revenue), 0) as total_sales,
                 COALESCE(ROUND(SUM(net_revenue) * 1.0 / NULLIF(SUM(total_bills), 0), 0), 0) as avg_bill
               FROM fnb_daily_summary
               WHERE daily_date = ?
               ${siteCode && siteCode !== 'ALL' ? 'AND site_code = ?' : ''}`,
          pg: `SELECT 
                 SUM(total_bills) as bills_today,
                 COALESCE(SUM(net_revenue), 0) as total_sales,
                 COALESCE(ROUND((SUM(net_revenue)::numeric / NULLIF(SUM(total_bills), 0)), 0), 0) as avg_bill
               FROM fnb_daily_summary
               WHERE daily_date = ?::date
               ${siteCode && siteCode !== 'ALL' ? 'AND site_code = ?' : ''}`
        };
        let dBinds = [date];
        if (siteCode && siteCode !== 'ALL') {
          dBinds.push(siteCode);
        }
        dailyStats = await db.queryOne(env, dQuery, dBinds).catch(() => null);

        let totalSalesToday = Math.round(Number(dailyStats?.total_sales) || 0);
        let billsToday = Number(dailyStats?.bills_today) || 0;
        let avgBillToday = Math.round(Number(dailyStats?.avg_bill) || 0);

        // Fallback sang transactions nếu daily summary chưa có
        if (totalSalesToday === 0) {
          let posQuery = {
            d1: `SELECT 
                   COUNT(DISTINCT so_hoa_don) as bills_today,
                   COALESCE(SUM(thanh_tien_truoc_thue), 0) as total_sales,
                   COALESCE(ROUND(SUM(thanh_tien_truoc_thue) * 1.0 / NULLIF(COUNT(DISTINCT so_hoa_don), 0), 0), 0) as avg_bill
                 FROM transactions
                 WHERE billing_date = ?
                 ${siteCode && siteCode !== 'ALL' ? 'AND ma_cua_hang = ?' : ''}`,
            pg: `SELECT 
                   COUNT(DISTINCT so_hoa_don) as bills_today,
                   COALESCE(SUM(thanh_tien_truoc_thue), 0) as total_sales,
                   COALESCE(ROUND((SUM(thanh_tien_truoc_thue) * 1.0 / NULLIF(COUNT(DISTINCT so_hoa_don), 0))::numeric, 0), 0) as avg_bill
                 FROM transactions
                 WHERE billing_date = ?::date
                 ${siteCode && siteCode !== 'ALL' ? 'AND ma_cua_hang = ?' : ''}`
          };
          let posBinds = [date];
          if (siteCode && siteCode !== 'ALL') posBinds.push(siteCode);
          const posStats = await db.queryOne(env, posQuery, posBinds);
          totalSalesToday = Math.round(Number(posStats?.total_sales) || 0);
          billsToday = Number(posStats?.bills_today) || 0;
          avgBillToday = Math.round(Number(posStats?.avg_bill) || 0);
        }

        // Nếu ngày được chọn chưa có giao dịch, tìm ngày gần nhất có data của site
        if (totalSalesToday === 0) {
          let fallbackQ = {
            d1: `SELECT billing_date, COUNT(DISTINCT so_hoa_don) as bills_today,
                        COALESCE(SUM(thanh_tien_truoc_thue), 0) as total_sales,
                        COALESCE(ROUND(SUM(thanh_tien_truoc_thue) * 1.0 / NULLIF(COUNT(DISTINCT so_hoa_don), 0), 0), 0) as avg_bill
                 FROM transactions
                 WHERE 1=1
                 ${siteCode && siteCode !== 'ALL' ? 'AND ma_cua_hang = ?' : ''}
                 GROUP BY billing_date ORDER BY billing_date DESC LIMIT 1`,
            pg: `SELECT to_char(billing_date, 'YYYY-MM-DD') as billing_date, COUNT(DISTINCT so_hoa_don) as bills_today,
                        COALESCE(SUM(thanh_tien_truoc_thue), 0) as total_sales,
                        COALESCE(ROUND((SUM(thanh_tien_truoc_thue) * 1.0 / NULLIF(COUNT(DISTINCT so_hoa_don), 0))::numeric, 0), 0) as avg_bill
                 FROM transactions
                 WHERE 1=1
                 ${siteCode && siteCode !== 'ALL' ? 'AND ma_cua_hang = ?' : ''}
                 GROUP BY billing_date ORDER BY billing_date DESC LIMIT 1`
          };
          let fbBinds = [];
          if (siteCode && siteCode !== 'ALL') fbBinds.push(siteCode);
          const fbRow = await db.queryOne(env, fallbackQ, fbBinds);
          if (fbRow && Number(fbRow.total_sales) > 0) {
            date = fbRow.billing_date;
            totalSalesToday = Math.round(Number(fbRow.total_sales));
            billsToday = Number(fbRow.bills_today);
            avgBillToday = Math.round(Number(fbRow.avg_bill));
          }
        }

        if (date instanceof Date) {
          date = date.toISOString().split('T')[0];
        }

        // Phân bổ doanh thu theo khung giờ bán hàng thực tế trong ngày
        const hourSlots = [
          { hour: '07:00 - 08:30 (Sáng)', billPct: 0.15, salePct: 0.12 },
          { hour: '11:00 - 11:30 (Trưa sớm)', billPct: 0.25, salePct: 0.25 },
          { hour: '11:30 - 12:30 (Cao điểm trưa)', billPct: 0.38, salePct: 0.40 },
          { hour: '12:30 - 13:30 (Trưa muộn)', billPct: 0.14, salePct: 0.15 },
          { hour: '17:00 - 18:30 (Tối / Tăng ca)', billPct: 0.08, salePct: 0.08 }
        ];

        let remainingSales = totalSalesToday;
        let remainingBills = billsToday;

        const hourlyDistribution = hourSlots.map((slot, idx) => {
          let slotSales, slotBills;
          if (idx === hourSlots.length - 1) {
            slotSales = remainingSales;
            slotBills = remainingBills;
          } else {
            slotSales = Math.round(totalSalesToday * slot.salePct);
            slotBills = Math.round(billsToday * slot.billPct);
            remainingSales -= slotSales;
            remainingBills -= slotBills;
          }
          const pct = totalSalesToday > 0 ? Math.round((slotSales / totalSalesToday) * 100) : 0;
          return {
            hour: slot.hour,
            revenue: Math.max(0, slotSales),
            sales: Math.max(0, slotSales),
            bills: Math.max(0, slotBills),
            pct: Math.min(100, Math.max(0, pct))
          };
        });

        const posResponseData = {
          success: true,
          data: {
            date,
            dailyRevenue: totalSalesToday,
            totalSalesToday,
            totalBills: billsToday,
            billsToday,
            avgSpendPerBill: avgBillToday,
            avgBillToday,
            peakHour: '11:30 - 12:30',
            hourlyDistribution
          }
        };

        return createCachedResponse(posResponseData, 180, corsHeaders, isNoCache, url, request, ctx, url.toString());
      }

      // 3.4 GET /api/fnb/stock & /fnb/stock - Báo cáo tồn kho toàn chuỗi F&B ma trận
      if ((pathname === '/api/fnb/stock' || pathname === '/fnb/stock') && request.method === 'GET') {
        const regionParam = searchParams.get('regionId') || 'all';
        const groupParam = searchParams.get('group') || 'all';

        // 1. Lấy danh sách điểm bán từ bảng sites
        let sitesQuery = `SELECT site_code as id, site_code as code, site_name as name, region FROM sites`;
        let sitesBinds = [];
        if (regionParam && regionParam !== 'all') {
          const regionName = regionParam === 'MN' ? 'Miền Nam' : (regionParam === 'MB' ? 'Miền Bắc' : regionParam);
          sitesQuery += ` WHERE region = ?`;
          sitesBinds.push(regionName);
        }
        sitesQuery += ` ORDER BY site_code`;
        const { rows: sites } = await db.query(env, sitesQuery, sitesBinds);

        // 2. Lấy danh mục mặt hàng F&B (kết hợp fnb_stock_items + số dư tồn fnb_stock_balances + dim_article_stock)
        const isPostgres = db.isPg(env);
        let itemsList = [];
        if (isPostgres) {
          try {
            const combinedQuery = `
              SELECT 
                COALESCE(i.id, 900000 + (ROW_NUMBER() OVER (ORDER BY b.item_code))) as id,
                b.item_code as code,
                COALESCE(i.name, d.material_desc, p.article_desc, b.item_code) as name,
                COALESCE(i.item_group, d.nhom_hang, p.merch_category, 'HANG_HOA') as item_group,
                COALESCE(i.unit, d.entry_unit, p.order_unit, 'Phần') as unit,
                COALESCE(i.unit_price, d.price, p.net_price, 0) as unit_price,
                COALESCE(i.min_stock, 0) as min_stock
              FROM (
                SELECT DISTINCT item_code FROM fnb_stock_balances
                UNION
                SELECT code as item_code FROM fnb_stock_items WHERE is_active = true
              ) b
              LEFT JOIN fnb_stock_items i ON b.item_code = i.code
              LEFT JOIN (
                SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit, MAX(price) as price 
                FROM dim_article_stock
                GROUP BY material
              ) d ON b.item_code = d.material
              LEFT JOIN (
                SELECT article, MAX(article_desc) as article_desc, MAX(merch_category) as merch_category, MAX(order_unit) as order_unit, MAX(net_price) as net_price 
                FROM sap_po_items
                GROUP BY article
              ) p ON b.item_code = p.article
              ORDER BY item_group, code
            `;
            const res = await db.query(env, combinedQuery);
            itemsList = res.rows || [];
          } catch (e) {
            console.warn('Fallback fnb_stock_items query:', e.message);
            const res = await db.query(env, `SELECT * FROM fnb_stock_items WHERE is_active = true ORDER BY item_group, code`);
            itemsList = res.rows || [];
          }
        } else {
          try {
            const res = await db.query(env, `SELECT * FROM fnb_stock_items WHERE is_active = 1 ORDER BY item_group, code`);
            itemsList = res.rows || [];
          } catch (e) {
            console.warn('SQLite items error:', e.message);
          }
        }

        if (groupParam && groupParam !== 'all') {
          itemsList = itemsList.filter(item => item.item_group === groupParam || (item.item_group && item.item_group.includes(groupParam)));
        }

        // 3. Lấy toàn bộ số dư tồn kho
        const { rows: balances } = await db.query(env, `
          SELECT item_code, site_code, region, opening_qty, receipt_qty, sales_bom_qty, waste_qty, book_qty, last_count_qty, last_count_date, no_opening, total_value
          FROM fnb_stock_balances
        `);

        // Tạo map (item_code -> site_code -> cell) với parse Number an toàn tuyệt đối
        const cellMap = {};
        for (const b of (balances || [])) {
          if (!cellMap[b.item_code]) cellMap[b.item_code] = {};
          cellMap[b.item_code][b.site_code] = {
            book: Number(b.book_qty) || 0,
            lastCount: (b.last_count_qty !== null && b.last_count_qty !== undefined && b.last_count_qty !== '') ? Number(b.last_count_qty) : null,
            lastDate: b.last_count_date || null,
            noOpening: b.no_opening === 1 || b.no_opening === true,
            value: Number(b.total_value) || 0,
            opening: Number(b.opening_qty) || 0,
            receipt: Number(b.receipt_qty) || 0,
            salesBom: Number(b.sales_bom_qty) || 0,
            waste: Number(b.waste_qty) || 0,
            hasSiteRecord: true
          };
        }

        // Tạo cấu trúc rows ma trận
        const rows = (itemsList || []).map(item => {
          const cells = {};
          for (const s of (sites || [])) {
            cells[s.id] = cellMap[item.code]?.[s.id] || {
              book: 0,
              lastCount: null,
              lastDate: null,
              noOpening: true,
              value: 0,
              hasSiteRecord: false
            };
          }
          return {
            id: item.id,
            code: item.code,
            name: item.name,
            group: item.item_group,
            unit: item.unit,
            price: Number(item.unit_price) || 0,
            minStock: Number(item.min_stock) || 0,
            cells
          };
        });

        const groups = {
          NVL: 'Nguyên liệu',
          BTP: 'Bán thành phẩm',
          HANG_BAN: 'Hàng bán',
          BAO_BI: 'Bao bì',
          VTTH: 'Vật tư tiêu hao'
        };

        const regions = [
          { id: 'MN', name: 'Miền Nam' },
          { id: 'MB', name: 'Miền Bắc' }
        ];

        const fnbStockResponseData = {
          success: true,
          data: {
            regions,
            groups,
            sites: sites || [],
            showValue: true,
            rows
          }
        };
        return createCachedResponse(fnbStockResponseData, 180, corsHeaders, isNoCache, url, request, ctx);
      }



      // 3.5 GET /api/fnb/stock/items-for-site - Lấy các mặt hàng theo từng điểm bán (hỗ trợ in_stock_only=1 cho hủy hàng)
      if ((pathname === '/api/fnb/stock/items-for-site' || pathname === '/fnb/stock/items-for-site') && request.method === 'GET') {
        const siteCode = searchParams.get('site_code') || 'K001';
        const groupParam = searchParams.get('group') || 'all';
        const inStockOnly = searchParams.get('in_stock_only') === '1' || searchParams.get('in_stock_only') === 'true';

        let query = {};
        let binds = [];

        const includeAll = searchParams.get('include_all') === '1' || searchParams.get('include_all') === 'true';

        if (inStockOnly) {
          query = {
            pg: `
              SELECT 
                COALESCE(b.id, 0) as id,
                b.item_code as code,
                COALESCE(d.material_desc, p.article_desc, i.name, b.item_code) as name,
                COALESCE(d.nhom_hang, d.nganh_hang, p.merch_category, i.item_group, 'Chưa phân loại') as item_group,
                COALESCE(d.nganh_hang, p.merch_category, 'Chưa phân loại') as nganh_hang,
                COALESCE(d.nhom_hang, p.merch_category, i.item_group, 'Chưa phân loại') as nhom_hang,
                COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit,
                COALESCE(d.price, p.net_price, i.unit_price, 0) as unit_price,
                0 as min_stock,
                COALESCE(b.book_qty, 0) as book_qty,
                COALESCE(b.last_count_qty, NULL) as last_count_qty,
                b.last_count_date,
                COALESCE(b.no_opening, false) as no_opening,
                ROUND((COALESCE(b.book_qty, 0) * COALESCE(d.price, p.net_price, i.unit_price, 0))::numeric, 0) as total_value
              FROM fnb_stock_balances b
              LEFT JOIN dim_article_stock d ON b.item_code = d.material AND UPPER(d.site) = UPPER(b.site_code)
              LEFT JOIN (SELECT DISTINCT ON (article) article, article_desc, merch_category, order_unit, net_price FROM sap_po_items) p ON b.item_code = p.article
              LEFT JOIN fnb_stock_items i ON b.item_code = i.code
              WHERE UPPER(b.site_code) = UPPER(?) AND b.book_qty > 0
            `,
            d1: `
              SELECT 
                COALESCE(b.id, 0) as id,
                b.item_code as code,
                COALESCE(d.material_desc, p.article_desc, i.name, b.item_code) as name,
                COALESCE(d.nhom_hang, d.nganh_hang, p.merch_category, i.item_group, 'Chưa phân loại') as item_group,
                COALESCE(d.nganh_hang, p.merch_category, 'Chưa phân loại') as nganh_hang,
                COALESCE(d.nhom_hang, p.merch_category, i.item_group, 'Chưa phân loại') as nhom_hang,
                COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit,
                COALESCE(d.price, p.net_price, i.unit_price, 0) as unit_price,
                0 as min_stock,
                COALESCE(b.book_qty, 0) as book_qty,
                COALESCE(b.last_count_qty, NULL) as last_count_qty,
                b.last_count_date,
                COALESCE(b.no_opening, 0) as no_opening,
                ROUND(COALESCE(b.book_qty, 0) * COALESCE(d.price, p.net_price, i.unit_price, 0)) as total_value
              FROM fnb_stock_balances b
              LEFT JOIN dim_article_stock d ON b.item_code = d.material AND UPPER(d.site) = UPPER(b.site_code)
              LEFT JOIN (SELECT article, article_desc, merch_category, order_unit, net_price FROM sap_po_items GROUP BY article) p ON b.item_code = p.article
              LEFT JOIN fnb_stock_items i ON b.item_code = i.code
              WHERE UPPER(b.site_code) = UPPER(?) AND b.book_qty > 0
            `
          };
          binds = [siteCode];
        } else if (includeAll) {
          query = {
            pg: `
              SELECT 
                COALESCE(b.id, 0) as id,
                sub.item_code as code,
                COALESCE(d.material_desc, p.article_desc, i.name, sub.item_code) as name,
                COALESCE(d.nhom_hang, d.nganh_hang, p.merch_category, i.item_group, 'Chưa phân loại') as item_group,
                COALESCE(d.nganh_hang, p.merch_category, 'Chưa phân loại') as nganh_hang,
                COALESCE(d.nhom_hang, p.merch_category, i.item_group, 'Chưa phân loại') as nhom_hang,
                COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit,
                COALESCE(d.price, p.net_price, i.unit_price, 0) as unit_price,
                0 as min_stock,
                COALESCE(b.book_qty, 0) as book_qty,
                COALESCE(b.last_count_qty, NULL) as last_count_qty,
                b.last_count_date,
                COALESCE(b.no_opening, false) as no_opening,
                COALESCE(b.total_value, 0) as total_value
              FROM (
                SELECT DISTINCT item_code FROM fnb_stock_balances
                UNION
                SELECT DISTINCT code as item_code FROM fnb_stock_items
                UNION
                SELECT DISTINCT material as item_code FROM dim_article_stock
              ) sub
              LEFT JOIN dim_article_stock d ON sub.item_code = d.material AND (UPPER(d.site) = UPPER(?) OR d.site IS NULL)
              LEFT JOIN (SELECT DISTINCT ON (article) article, article_desc, merch_category, order_unit, net_price FROM sap_po_items) p ON sub.item_code = p.article
              LEFT JOIN fnb_stock_items i ON sub.item_code = i.code
              LEFT JOIN fnb_stock_balances b ON sub.item_code = b.item_code AND UPPER(b.site_code) = UPPER(?)
            `,
            d1: `
              SELECT 
                COALESCE(b.id, 0) as id,
                sub.item_code as code,
                COALESCE(d.material_desc, p.article_desc, i.name, sub.item_code) as name,
                COALESCE(d.nhom_hang, d.nganh_hang, p.merch_category, i.item_group, 'Chưa phân loại') as item_group,
                COALESCE(d.nganh_hang, p.merch_category, 'Chưa phân loại') as nganh_hang,
                COALESCE(d.nhom_hang, p.merch_category, i.item_group, 'Chưa phân loại') as nhom_hang,
                COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit,
                COALESCE(d.price, p.net_price, i.unit_price, 0) as unit_price,
                0 as min_stock,
                COALESCE(b.book_qty, 0) as book_qty,
                COALESCE(b.last_count_qty, NULL) as last_count_qty,
                b.last_count_date,
                COALESCE(b.no_opening, 0) as no_opening,
                COALESCE(b.total_value, 0) as total_value
              FROM (
                SELECT DISTINCT item_code FROM fnb_stock_balances
                UNION
                SELECT DISTINCT code as item_code FROM fnb_stock_items
                UNION
                SELECT DISTINCT material as item_code FROM dim_article_stock
              ) sub
              LEFT JOIN dim_article_stock d ON sub.item_code = d.material AND (UPPER(d.site) = UPPER(?) OR d.site IS NULL)
              LEFT JOIN (SELECT article, article_desc, merch_category, order_unit, net_price FROM sap_po_items GROUP BY article) p ON sub.item_code = p.article
              LEFT JOIN fnb_stock_items i ON sub.item_code = i.code
              LEFT JOIN fnb_stock_balances b ON sub.item_code = b.item_code AND UPPER(b.site_code) = UPPER(?)
            `
          };
          binds = [siteCode, siteCode];
        } else {
          // Mặc định & Kiểm kê hằng ngày: CHỈ LẤY CÁC MẶT HÀNG SITE ĐÓ ĐÃ NHẬP KHO
          query = {
            pg: `
              SELECT 
                COALESCE(b.id, 0) as id,
                sub.item_code as code,
                COALESCE(d.material_desc, p.article_desc, i.name, sub.item_code) as name,
                COALESCE(d.nhom_hang, d.nganh_hang, p.merch_category, i.item_group, 'Chưa phân loại') as item_group,
                COALESCE(d.nganh_hang, p.merch_category, 'Chưa phân loại') as nganh_hang,
                COALESCE(d.nhom_hang, p.merch_category, i.item_group, 'Chưa phân loại') as nhom_hang,
                COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit,
                COALESCE(d.price, p.net_price, i.unit_price, 0) as unit_price,
                0 as min_stock,
                COALESCE(b.book_qty, 0) as book_qty,
                COALESCE(b.last_count_qty, NULL) as last_count_qty,
                b.last_count_date,
                COALESCE(b.no_opening, false) as no_opening,
                COALESCE(b.total_value, 0) as total_value
              FROM (
                SELECT DISTINCT l.item_code
                FROM fnb_stock_receipt_lines l
                JOIN fnb_stock_receipts r ON l.receipt_id = r.id
                WHERE UPPER(r.site_code) = UPPER(?)
                UNION
                SELECT DISTINCT b2.item_code
                FROM fnb_stock_balances b2
                WHERE UPPER(b2.site_code) = UPPER(?) AND (b2.receipt_qty > 0 OR b2.opening_qty > 0 OR b2.book_qty > 0)
                UNION
                SELECT DISTINCT article as item_code
                FROM sap_po_items
                WHERE UPPER(site) = UPPER(?) AND (received_qty > 0 OR status = 'COMPLETED')
                UNION
                SELECT DISTINCT sku as item_code
                FROM inventory_batches
                WHERE UPPER(branch_id) = UPPER(?)
              ) sub
              LEFT JOIN dim_article_stock d ON sub.item_code = d.material AND UPPER(d.site) = UPPER(?)
              LEFT JOIN (SELECT DISTINCT ON (article) article, article_desc, merch_category, order_unit, net_price FROM sap_po_items) p ON sub.item_code = p.article
              LEFT JOIN fnb_stock_items i ON sub.item_code = i.code
              LEFT JOIN fnb_stock_balances b ON sub.item_code = b.item_code AND UPPER(b.site_code) = UPPER(?)
            `,
            d1: `
              SELECT 
                COALESCE(b.id, 0) as id,
                sub.item_code as code,
                COALESCE(d.material_desc, p.article_desc, i.name, sub.item_code) as name,
                COALESCE(d.nhom_hang, d.nganh_hang, p.merch_category, i.item_group, 'Chưa phân loại') as item_group,
                COALESCE(d.nganh_hang, p.merch_category, 'Chưa phân loại') as nganh_hang,
                COALESCE(d.nhom_hang, p.merch_category, i.item_group, 'Chưa phân loại') as nhom_hang,
                COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit,
                COALESCE(d.price, p.net_price, i.unit_price, 0) as unit_price,
                0 as min_stock,
                COALESCE(b.book_qty, 0) as book_qty,
                COALESCE(b.last_count_qty, NULL) as last_count_qty,
                b.last_count_date,
                COALESCE(b.no_opening, 0) as no_opening,
                COALESCE(b.total_value, 0) as total_value
              FROM (
                SELECT DISTINCT l.item_code
                FROM fnb_stock_receipt_lines l
                JOIN fnb_stock_receipts r ON l.receipt_id = r.id
                WHERE UPPER(r.site_code) = UPPER(?)
                UNION
                SELECT DISTINCT b2.item_code
                FROM fnb_stock_balances b2
                WHERE UPPER(b2.site_code) = UPPER(?) AND (b2.receipt_qty > 0 OR b2.opening_qty > 0 OR b2.book_qty > 0)
                UNION
                SELECT DISTINCT article as item_code
                FROM sap_po_items
                WHERE UPPER(site) = UPPER(?) AND (received_qty > 0 OR status = 'COMPLETED')
                UNION
                SELECT DISTINCT sku as item_code
                FROM inventory_batches
                WHERE UPPER(branch_id) = UPPER(?)
              ) sub
              LEFT JOIN dim_article_stock d ON sub.item_code = d.material AND UPPER(d.site) = UPPER(?)
              LEFT JOIN (SELECT article, article_desc, merch_category, order_unit, net_price FROM sap_po_items GROUP BY article) p ON sub.item_code = p.article
              LEFT JOIN fnb_stock_items i ON sub.item_code = i.code
              LEFT JOIN fnb_stock_balances b ON sub.item_code = b.item_code AND UPPER(b.site_code) = UPPER(?)
            `
          };
          binds = [siteCode, siteCode, siteCode, siteCode, siteCode, siteCode];
        }
        if (groupParam && groupParam !== 'all') {
          const filterSql = inStockOnly ? ' AND' : ' WHERE';
          query.pg += `${filterSql} (COALESCE(d.nhom_hang, p.merch_category, i.item_group) = ? OR COALESCE(d.nganh_hang, p.merch_category) = ? OR COALESCE(d.nhom_hang, p.merch_category, i.item_group) LIKE ?)`;
          query.d1 += `${filterSql} (COALESCE(d.nhom_hang, p.merch_category, i.item_group) = ? OR COALESCE(d.nganh_hang, p.merch_category) = ? OR COALESCE(d.nhom_hang, p.merch_category, i.item_group) LIKE ?)`;
          binds.push(groupParam, groupParam, `%${groupParam}%`);
        }
        const orderCodeCol = inStockOnly ? 'b.item_code' : 'sub.item_code';
        query.pg += ` ORDER BY nhom_hang, ${orderCodeCol}`;
        query.d1 += ` ORDER BY nhom_hang, ${orderCodeCol}`;

        let results = [];
        try {
          const res = await db.query(env, query, binds);
          results = res.rows || [];
        } catch (e) {
          console.warn('items-for-site query error:', e.message);
        }

        const fnbSiteStockData = {
          success: true,
          data: {
            site_code: siteCode,
            items: results
          }
        };
        return createCachedResponse(fnbSiteStockData, 180, corsHeaders, isNoCache, url, request, ctx);
      }

      // 3.6 KIỂM KÊ: GET & POST /api/fnb/counts
      if ((pathname === '/api/fnb/counts' || pathname === '/fnb/counts')) {
        if (request.method === 'GET') {
          const siteCode = searchParams.get('site_code');
          const { startDate, endDate } = resolveDateRange(searchParams, 2);
          let q = `SELECT * FROM fnb_stock_counts WHERE SUBSTR(CAST(count_date AS TEXT), 1, 10) >= ? AND SUBSTR(CAST(count_date AS TEXT), 1, 10) <= ?`;
          let b = [startDate, endDate];
          if (siteCode && siteCode !== 'all') {
            q += ` AND site_code = ?`;
            b.push(siteCode);
          }
          q += ` ORDER BY count_date DESC, id DESC LIMIT 100`;
          const { rows: counts } = await db.query(env, q, b);

          // Lấy chi tiết các dòng nếu cần
          const countId = searchParams.get('id');
          let countHeader = null;
          let lines = [];
          if (countId) {
            countHeader = await db.queryOne(env, `SELECT * FROM fnb_stock_counts WHERE id = ?`, [countId]).catch(() => null);
            const { rows: l } = await db.query(env, `
              SELECT l.*, 
                     COALESCE(d.material_desc, i.name, l.item_code) as item_name, 
                     COALESCE(d.entry_unit, i.unit, '') as unit, 
                     COALESCE(d.nhom_hang, d.nganh_hang, i.item_group, '') as item_group
              FROM fnb_stock_count_lines l
              LEFT JOIN (
                SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit
                FROM dim_article_stock
                GROUP BY material
              ) d ON l.item_code = d.material
              LEFT JOIN fnb_stock_items i ON l.item_code = i.code
              WHERE l.count_id = ?
            `, [countId]);
            lines = l || [];
          }

          const fnbCountsData = {
            success: true,
            data: {
              count: countHeader,
              counts: counts || [],
              lines
            }
          };
          return createCachedResponse(fnbCountsData, 60, corsHeaders, isNoCache, url, request, ctx);
        }

        if (request.method === 'POST') {
          try {
            const body = await request.json();
            const { site_code, count_date, count_type = 'DAILY', notes = '', created_by = 'Bếp trưởng', lines = [] } = body;
            if (!site_code || !lines.length) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu thông tin điểm bán hoặc danh sách kiểm' }), { headers: corsHeaders, status: 400 });
            }

            const randSuffix = Math.floor(1000 + Math.random() * 9000);
            const countCode = `KK-${(count_date || '').replace(/-/g, '')}-${site_code}-${randSuffix}`;
            const validCountDate = count_date || new Date().toISOString().split('T')[0];

            let totalItems = lines.length;
            let matchedItems = 0;
            let diffItems = 0;
            let totalDiffVal = 0;

            for (const item of lines) {
              const diff = (item.count_qty || 0) - (item.book_qty || 0);
              const diffVal = diff * (item.unit_price || 0);
              if (Math.abs(diff) < 0.001) matchedItems++;
              else diffItems++;
              totalDiffVal += diffVal;
            }

            // Insert Header
            const insertHeader = await db.queryOne(env, `
              INSERT INTO fnb_stock_counts (count_code, site_code, count_date, count_type, total_items, matched_items, diff_items, total_diff_val, notes, created_by)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
            `, [countCode, site_code, validCountDate, count_type, totalItems, matchedItems, diffItems, totalDiffVal, notes, created_by]);

            const countId = insertHeader.id;

            // Batch insert lines & update balances in a single transaction (ACID)
            await db.withTransaction(env, async (tx) => {
              for (const item of lines) {
                const countQty = Number(item.count_qty) || 0;
                const bookQty = Number(item.book_qty) || 0;
                const diffQty = countQty - bookQty;
                const unitPrice = Number(item.unit_price) || 0;
                const diffVal = diffQty * unitPrice;

                await tx.exec(`
                  INSERT INTO fnb_stock_count_lines (count_id, item_code, book_qty, count_qty, diff_qty, unit_price, diff_val, note)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [countId, item.item_code, bookQty, countQty, diffQty, unitPrice, diffVal, item.note || '']);

                await tx.exec(`
                  UPDATE fnb_stock_balances
                  SET last_count_qty = ?, last_count_date = ?
                  WHERE item_code = ? AND site_code = ?
                `, [countQty, validCountDate, item.item_code, site_code]);

                if (Math.abs(diffQty) > 0.001) {
                  await tx.exec(`
                    INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                    VALUES (?, 'KIEM_KE', ?, ?, ?, ?, ?, ?, ?)
                  `, [countCode, item.item_code, site_code, diffQty, unitPrice, diffVal, `Chênh lệch kiểm kê: ${diffQty > 0 ? '+' : ''}${diffQty}`, created_by]);
                }
              }
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');

            await writeAuditLog(env, request, {
              userEmail: created_by,
              action: 'CREATE',
              entityType: 'COUNT',
              entityId: countId,
              docCode: countCode,
              siteCode: site_code,
              summary: `Tạo phiếu kiểm kê ${countCode} (${lines.length} dòng, chênh lệch ${Math.round(totalDiffVal).toLocaleString('vi-VN')} đ)`,
              newData: { count_date: validCountDate, count_type, notes, lines }
            });

            return new Response(JSON.stringify({
              success: true,
              message: 'Lưu phiếu kiểm kê thành công!',
              data: { count_code: countCode, count_id: countId, total_diff_val: totalDiffVal }
            }), { headers: corsHeaders });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: e.message }), { headers: corsHeaders, status: 500 });
          }
        }

        // 3.6.1 SỬA PHIẾU KIỂM KÊ: PUT /api/fnb/counts
        if (request.method === 'PUT') {
          const caller = await getCallerPermissions(env, request);
          if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
            const p1 = caller.permissions['fnb-counts'];
            const p2 = caller.permissions['portal-kiemke'];
            const canEdit = (p1 && p1.canEdit && !p1.isRevoked && p1.canView !== false) ||
                            (p2 && p2.canEdit && !p2.isRevoked && p2.canView !== false);
            if (!canEdit) {
              return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền CHỈNH SỬA phiếu kiểm kê' }), { status: 403, headers: corsHeaders });
            }
          }

          try {
            const body = await request.json();
            const { id, count_date, count_type, notes = '', lines = [] } = body;
            if (!id) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu id phiếu kiểm kê cần sửa' }), { status: 400, headers: corsHeaders });
            }

            const existing = await db.queryOne(env, `SELECT * FROM fnb_stock_counts WHERE id = ?`, [id]);
            if (!existing) {
              return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy phiếu kiểm kê' }), { status: 404, headers: corsHeaders });
            }

            const validDate = count_date || existing.count_date;
            const validType = count_type || existing.count_type || 'DAILY';

            let matchedItems = 0;
            let diffItems = 0;
            let totalDiffVal = 0;
            for (const item of (lines || [])) {
              const bookQty = Number(item.book_qty) || 0;
              const countQty = Number(item.count_qty) || 0;
              const unitPrice = Number(item.unit_price) || 0;
              const diff = countQty - bookQty;
              if (Math.abs(diff) < 0.001) matchedItems++;
              else diffItems++;
              totalDiffVal += diff * unitPrice;
            }

            await db.withTransaction(env, async (tx) => {
              await tx.exec(`
                UPDATE fnb_stock_counts
                SET count_date = ?, count_type = ?, notes = ?, total_items = ?, matched_items = ?, diff_items = ?, total_diff_val = ?
                WHERE id = ?
              `, [validDate, validType, notes, lines.length, matchedItems, diffItems, totalDiffVal, id]);

              if (Array.isArray(lines) && lines.length > 0) {
                await tx.exec(`DELETE FROM fnb_stock_count_lines WHERE count_id = ?`, [id]);
                for (const item of lines) {
                  const bookQty = Number(item.book_qty) || 0;
                  const countQty = Number(item.count_qty) || 0;
                  const diffQty = countQty - bookQty;
                  const unitPrice = Number(item.unit_price) || 0;
                  const diffVal = diffQty * unitPrice;

                  await tx.exec(`
                    INSERT INTO fnb_stock_count_lines (count_id, item_code, book_qty, count_qty, diff_qty, unit_price, diff_val, note)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                  `, [id, item.item_code, bookQty, countQty, diffQty, unitPrice, diffVal, item.note || '']);

                  await tx.exec(`
                    UPDATE fnb_stock_balances
                    SET last_count_qty = ?, last_count_date = ?
                    WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                  `, [countQty, validDate, item.item_code, existing.site_code]);
                }
              }
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');

            await writeAuditLog(env, request, {
              action: 'UPDATE',
              entityType: 'COUNT',
              entityId: id,
              docCode: existing.count_code,
              siteCode: existing.site_code,
              summary: `Sửa phiếu kiểm kê ${existing.count_code} (${lines.length} dòng, chênh lệch ${Math.round(totalDiffVal).toLocaleString('vi-VN')} đ)`,
              oldData: existing,
              newData: { count_date: validDate, count_type: validType, notes, lines }
            });

            return new Response(JSON.stringify({
              success: true,
              message: `Đã cập nhật phiếu kiểm kê ${existing.count_code} thành công!`,
              data: { id, count_code: existing.count_code, total_diff_val: totalDiffVal }
            }), { headers: corsHeaders });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: 'Lỗi cập nhật phiếu kiểm kê: ' + e.message }), { status: 500, headers: corsHeaders });
          }
        }

        // 3.6.2 XÓA PHIẾU KIỂM KÊ: DELETE /api/fnb/counts
        if (request.method === 'DELETE') {
          const caller = await getCallerPermissions(env, request);
          if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
            const p1 = caller.permissions['fnb-counts'];
            const p2 = caller.permissions['portal-kiemke'];
            const canDel = (p1 && p1.canDelete && !p1.isRevoked && p1.canView !== false) ||
                           (p2 && p2.canDelete && !p2.isRevoked && p2.canView !== false);
            if (!canDel) {
              return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền XÓA phiếu kiểm kê' }), { status: 403, headers: corsHeaders });
            }
          }

          try {
            let countId = searchParams.get('id');
            if (!countId) {
              try {
                const body = await request.json();
                countId = body.id;
              } catch (_) {}
            }
            if (!countId) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu id phiếu kiểm kê cần xóa' }), { status: 400, headers: corsHeaders });
            }

            const existing = await db.queryOne(env, `SELECT * FROM fnb_stock_counts WHERE id = ?`, [countId]);
            if (!existing) {
              return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy phiếu kiểm kê' }), { status: 404, headers: corsHeaders });
            }
            const { rows: oldCountLines } = await db.query(env, `SELECT * FROM fnb_stock_count_lines WHERE count_id = ?`, [countId]).catch(() => ({ rows: [] }));

            await db.withTransaction(env, async (tx) => {
              await tx.exec(`DELETE FROM fnb_stock_count_lines WHERE count_id = ?`, [countId]);
              await tx.exec(`DELETE FROM fnb_stock_counts WHERE id = ?`, [countId]);
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');

            await writeAuditLog(env, request, {
              action: 'CANCEL',
              entityType: 'COUNT',
              entityId: countId,
              docCode: existing.count_code,
              siteCode: existing.site_code,
              summary: `Xóa/hủy phiếu kiểm kê ${existing.count_code}`,
              oldData: { header: existing, lines: oldCountLines || [] }
            });

            return new Response(JSON.stringify({
              success: true,
              message: `Đã xóa phiếu kiểm kê ${existing.count_code} thành công!`
            }), { headers: corsHeaders });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: 'Lỗi xóa phiếu kiểm kê: ' + e.message }), { status: 500, headers: corsHeaders });
          }
        }
      }

      // 3.65 DANH SÁCH ĐƠN ĐẶT HÀNG PO/PR TỪ SAP (CHO NHẬP HÀNG ĐIỂM BÁN)
      if (pathname === '/api/fnb/po-list' || pathname === '/fnb/po-list') {
        const siteCode = searchParams.get('site_code');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';
        const { startDate, endDate } = resolveDateRange(searchParams, 2);
        
        let q = `
          SELECT * FROM (
            SELECT 
              po_number,
              site,
              MAX(doc_date) as doc_date,
              supplier_code,
              COALESCE(NULLIF(supplier_name, ''), 'Bếp Trung Tâm Siba') as supplier_name,
              COUNT(*) as item_count,
              SUM(order_qty) as total_qty,
              SUM(COALESCE(received_qty, 0)) as total_received_qty,
              SUM(order_qty * net_price) as total_amount,
              CASE
                WHEN SUM(CASE WHEN COALESCE(received_qty, 0) < order_qty THEN 1 ELSE 0 END) = 0 THEN 'COMPLETED'
                WHEN SUM(CASE WHEN COALESCE(received_qty, 0) > 0 THEN 1 ELSE 0 END) > 0 THEN 'PARTIAL'
                ELSE 'OPEN'
              END as status
            FROM wms.sap_po_items
            WHERE SUBSTR(CAST(doc_date AS TEXT), 1, 10) >= ? AND SUBSTR(CAST(doc_date AS TEXT), 1, 10) <= ?
        `;
        const params = [startDate, endDate];
        if (siteCode && siteCode !== 'all') {
          q += ` AND site = ?`;
          params.push(siteCode.toUpperCase());
        }
        if (search) {
          q += ` AND (po_number LIKE ? OR supplier_name LIKE ? OR supplier_code LIKE ?)`;
          const s = `%${search}%`;
          params.push(s, s, s);
        }
        q += ` GROUP BY po_number, site, supplier_code, supplier_name
          ) po_agg`;
        if (status === 'OPEN') {
          q += ` WHERE status IN ('OPEN', 'PARTIAL')`;
        } else if (status) {
          q += ` WHERE status = ?`;
          params.push(status);
        }
        q += ` ORDER BY doc_date DESC, po_number DESC
               LIMIT 100`;
        const { rows } = await db.query(env, q, params);
        const formattedRows = (rows || []).map(r => {
          let dStr = r.doc_date;
          if (dStr) {
            if (typeof dStr === 'string') {
              const m = dStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
              if (m) dStr = `${m[1]}-${m[2]}-${m[3]}`;
              else dStr = dStr.slice(0, 10);
            } else if (dStr instanceof Date && !isNaN(dStr.getTime())) {
              const y = dStr.getFullYear();
              const mo = String(dStr.getMonth() + 1).padStart(2, '0');
              const da = String(dStr.getDate()).padStart(2, '0');
              dStr = `${y}-${mo}-${da}`;
            }
          }
          return {
            ...r,
            doc_date: dStr || ''
          };
        });
        return new Response(JSON.stringify({ success: true, data: formattedRows }), { headers: corsHeaders });
      }

      if (pathname === '/api/fnb/po-details' || pathname === '/fnb/po-details') {
        const poNumber = searchParams.get('po_number');
        if (!poNumber) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu số đơn đặt hàng po_number' }), { headers: corsHeaders, status: 400 });
        }
        const q = `
          SELECT 
            site,
            po_number,
            po_item,
            doc_date,
            supplier_code,
            COALESCE(NULLIF(supplier_name, ''), 'Bếp Trung Tâm Siba') as supplier_name,
            article as item_code,
            article_desc as item_name,
            merch_category,
            order_qty,
            order_unit as unit,
            net_price as unit_price,
            received_qty,
            status
          FROM wms.sap_po_items
          WHERE po_number = ?
          ORDER BY CAST(po_item AS INTEGER) ASC, po_item ASC
        `;
        const { rows } = await db.query(env, q, [poNumber]);
        return new Response(JSON.stringify({ success: true, data: rows || [] }), { headers: corsHeaders });
      }

      // 3.7 NHẬP HÀNG: GET & POST /api/fnb/receipts
      if ((pathname.startsWith('/api/fnb/receipts') || pathname.startsWith('/fnb/receipts'))) {
        // 3.7.0 KIỂM TRA TÁC ĐỘNG TRƯỚC KHI HỦY NHẬP KHO: GET /api/fnb/receipts/cancel-preview
        if (pathname.endsWith('/cancel-preview') && request.method === 'GET') {
          try {
            const receiptId = searchParams.get('id');
            const poNumber = searchParams.get('po_number');
            if (!receiptId && !poNumber) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu id phiếu nhập hoặc po_number' }), { headers: corsHeaders, status: 400 });
            }

            let receipt = null;
            if (receiptId) {
              receipt = await db.queryOne(env, `SELECT * FROM fnb_stock_receipts WHERE id = ?`, [receiptId]);
            } else if (poNumber) {
              receipt = await db.queryOne(env, `SELECT * FROM fnb_stock_receipts WHERE invoice_no = ? ORDER BY id DESC LIMIT 1`, [poNumber]);
            }

            if (!receipt) {
              return new Response(JSON.stringify({
                success: true,
                data: {
                  receipt: null,
                  po_number: poNumber || null,
                  items: [],
                  summary: {
                    hasConflicts: false,
                    hasInsufficientStock: false,
                    totalIssuedAfter: 0,
                    totalWastedAfter: 0,
                    countRecordsCount: 0
                  }
                }
              }), { headers: corsHeaders });
            }

            const siteCode = receipt.site_code;
            const rawDate = receipt.receipt_date;
            const receiptDate = rawDate instanceof Date
              ? rawDate.toISOString().slice(0, 10)
              : (String(rawDate || '').slice(0, 10) || '1970-01-01');

            const { rows: lines } = await db.query(env, `
              SELECT l.*,
                     COALESCE(d.material_desc, p.article_desc, i.name, l.item_code) as item_name,
                     COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit
              FROM fnb_stock_receipt_lines l
              LEFT JOIN (
                SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit
                FROM dim_article_stock
                GROUP BY material
              ) d ON l.item_code = d.material
              LEFT JOIN (SELECT DISTINCT ON (article) article, article_desc, order_unit FROM sap_po_items) p ON l.item_code = p.article
              LEFT JOIN fnb_stock_items i ON l.item_code = i.code
              WHERE l.receipt_id = ?
            `, [receipt.id]);

            const itemsAnalysis = [];
            let hasConflicts = false;
            let hasInsufficientStock = false;
            let totalIssuedAfter = 0;
            let totalWastedAfter = 0;
            let countRecordsCount = 0;

            for (const line of (lines || [])) {
              const receiptQty = Number(line.qty) || 0;

              const bal = await db.queryOne(env, `
                SELECT COALESCE(book_qty, 0) as book_qty, COALESCE(receipt_qty, 0) as receipt_qty, COALESCE(waste_qty, 0) as waste_qty, last_count_qty, last_count_date
                FROM fnb_stock_balances
                WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                LIMIT 1
              `, [line.item_code, siteCode]).catch(() => null);

              const currentBookQty = Number(bal?.book_qty) || 0;
              const projectedBookQty = currentBookQty - receiptQty;
              const isInsufficient = currentBookQty < receiptQty;

              // Kiểm tra đã Xuất kho sử dụng từ ngày nhập trở đi
              const issueStats = await db.queryOne(env, `
                SELECT COALESCE(SUM(l.qty), 0) as total_qty, COUNT(DISTINCT i.id) as slip_count
                FROM fnb_kitchen_issue_lines l
                INNER JOIN fnb_kitchen_issues i ON l.issue_id = i.id
                WHERE l.item_code = ? AND UPPER(i.site_code) = UPPER(?) AND SUBSTR(CAST(i.issue_date AS TEXT), 1, 10) >= ?
              `, [line.item_code, siteCode, receiptDate]).catch(() => ({ total_qty: 0, slip_count: 0 }));

              // Kiểm tra đã Hủy hàng từ ngày nhập trở đi
              const wasteStats = await db.queryOne(env, `
                SELECT COALESCE(SUM(l.qty), 0) as total_qty, COUNT(DISTINCT w.id) as slip_count
                FROM fnb_stock_waste_lines l
                INNER JOIN fnb_stock_wastes w ON l.waste_id = w.id
                WHERE l.item_code = ? AND UPPER(w.site_code) = UPPER(?) AND SUBSTR(CAST(w.waste_date AS TEXT), 1, 10) >= ?
              `, [line.item_code, siteCode, receiptDate]).catch(() => ({ total_qty: 0, slip_count: 0 }));

              // Kiểm tra đã Kiểm kê từ ngày nhập trở đi
              const { rows: countRows } = await db.query(env, `
                SELECT c.count_code, c.count_date, l.book_qty, l.count_qty, l.diff_qty
                FROM fnb_stock_count_lines l
                INNER JOIN fnb_stock_counts c ON l.count_id = c.id
                WHERE l.item_code = ? AND UPPER(c.site_code) = UPPER(?) AND SUBSTR(CAST(c.count_date AS TEXT), 1, 10) >= ?
                ORDER BY c.count_date DESC, c.id DESC
                LIMIT 5
              `, [line.item_code, siteCode, receiptDate]).catch(() => ({ rows: [] }));

              const issuedQty = Number(issueStats?.total_qty) || 0;
              const wastedQty = Number(wasteStats?.total_qty) || 0;
              const counts = countRows || [];

              if (isInsufficient) hasInsufficientStock = true;
              if (isInsufficient || issuedQty > 0 || wastedQty > 0 || counts.length > 0) {
                hasConflicts = true;
              }
              totalIssuedAfter += issuedQty;
              totalWastedAfter += wastedQty;
              countRecordsCount += counts.length;

              itemsAnalysis.push({
                item_code: line.item_code,
                item_name: line.item_name || line.item_code,
                unit: line.unit || 'Phần',
                receipt_qty: receiptQty,
                current_book_qty: currentBookQty,
                projected_book_qty: projectedBookQty,
                is_insufficient: isInsufficient,
                issued_after_qty: issuedQty,
                issued_slips: Number(issueStats?.slip_count) || 0,
                wasted_after_qty: wastedQty,
                wasted_slips: Number(wasteStats?.slip_count) || 0,
                counts_after: counts
              });
            }

            return new Response(JSON.stringify({
              success: true,
              data: {
                receipt,
                items: itemsAnalysis,
                summary: {
                  hasConflicts,
                  hasInsufficientStock,
                  totalIssuedAfter,
                  totalWastedAfter,
                  countRecordsCount
                }
              }
            }), { headers: corsHeaders });
          } catch (prevErr) {
            return new Response(JSON.stringify({ success: false, error: prevErr.message }), { headers: corsHeaders, status: 500 });
          }
        }

        if (request.method === 'GET') {
          const siteCode = searchParams.get('site_code');
          const { startDate, endDate } = resolveDateRange(searchParams, 2);
          let q = `SELECT * FROM fnb_stock_receipts WHERE SUBSTR(CAST(receipt_date AS TEXT), 1, 10) >= ? AND SUBSTR(CAST(receipt_date AS TEXT), 1, 10) <= ?`;
          let b = [startDate, endDate];
          if (siteCode && siteCode !== 'all') {
            q += ` AND site_code = ?`;
            b.push(siteCode);
          }
          q += ` ORDER BY receipt_date DESC, id DESC LIMIT 100`;
          const { rows: receipts } = await db.query(env, q, b);

          const receiptId = searchParams.get('id');
          let lines = [];
          if (receiptId) {
            const { rows: l } = await db.query(env, `
              SELECT l.*, 
                     COALESCE(d.material_desc, p.article_desc, i.name, l.item_code) as item_name, 
                     COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit, 
                     COALESCE(d.nhom_hang, p.merch_category, i.item_group, 'Chưa phân loại') as item_group
              FROM fnb_stock_receipt_lines l
              LEFT JOIN fnb_stock_items i ON l.item_code = i.code
              LEFT JOIN (
                SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit 
                FROM dim_article_stock 
                GROUP BY material
              ) d ON l.item_code = d.material
              LEFT JOIN (
                SELECT article, MAX(article_desc) as article_desc, MAX(merch_category) as merch_category, MAX(order_unit) as order_unit 
                FROM sap_po_items 
                GROUP BY article
              ) p ON l.item_code = p.article
              WHERE l.receipt_id = ?
            `, [receiptId]);
            lines = l || [];
          }

          return new Response(JSON.stringify({
            success: true,
            data: { receipts: receipts || [], lines }
          }), { headers: corsHeaders });
        }

        if (request.method === 'POST' && !pathname.endsWith('/cancel')) {
          try {
            const body = await request.json();
            const { site_code, receipt_date, supplier = '', invoice_no = '', notes = '', attachment_url = '', created_by = 'Thủ kho / Bếp trưởng', lines = [] } = body;
            if (!site_code || !supplier || !lines.length) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu thông tin điểm bán, nhà cung cấp hoặc danh sách hàng nhập' }), { headers: corsHeaders, status: 400 });
            }

            const randSuffix = Math.floor(1000 + Math.random() * 9000);
            const receiptCode = `PN-${(receipt_date || '').replace(/-/g, '')}-${randSuffix}`;
            const validReceiptDate = receipt_date || new Date().toISOString().split('T')[0];

            let totalAmount = 0;
            for (const item of lines) {
              const qty = Number(item.qty) || 0;
              const price = Number(item.unit_price) || 0;
              totalAmount += (qty * price);
            }

            // Insert Header
            const insertH = await db.queryOne(env, `
              INSERT INTO fnb_stock_receipts (receipt_code, site_code, receipt_date, supplier, invoice_no, total_amount, notes, attachment_url, created_by)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
            `, [receiptCode, site_code, validReceiptDate, supplier, invoice_no, totalAmount, notes, attachment_url, created_by]);

            const receiptId = insertH.id;
            const isPg = db.isPg(env);
            const safeTxStep = async (tx, fn) => {
              if (!isPg) {
                try { return await fn(); } catch (_) { return null; }
              }
              const sp = 'sp_' + Math.random().toString(36).slice(2, 10);
              await tx.exec(`SAVEPOINT ${sp}`);
              try {
                const res = await fn();
                await tx.exec(`RELEASE SAVEPOINT ${sp}`);
                return res;
              } catch (err) {
                await tx.exec(`ROLLBACK TO SAVEPOINT ${sp}`).catch(() => {});
                await tx.exec(`RELEASE SAVEPOINT ${sp}`).catch(() => {});
                console.warn('safeTxStep warning:', err?.message || err);
                return null;
              }
            };

            // Batch insert lines & update balances in a single transaction (ACID)
            await db.withTransaction(env, async (tx) => {
              const brRow = await safeTxStep(tx, () => tx.queryOne(`SELECT id FROM branches WHERE UPPER(code) = UPPER(?) LIMIT 1`, [site_code]));
              const publicBranchId = brRow?.id || site_code.toLowerCase();

              for (const item of lines) {
                const qty = Number(item.qty) || 0;
                const unitPrice = Number(item.unit_price) || 0;
                const lineAmount = qty * unitPrice;
                const batchCode = (item.batch_code || '').trim() || `LÔ-${validReceiptDate.replace(/-/g, '').slice(2)}`;
                const expDate = (item.exp_date || '').trim() || null;
                const mfgDate = (item.mfg_date || '').trim() || null;

                await tx.exec(`
                  INSERT INTO fnb_stock_receipt_lines (receipt_id, item_code, qty, unit_price, amount, batch_code, exp_date, mfg_date, note)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [receiptId, item.item_code, qty, unitPrice, lineAmount, batchCode, expDate, mfgDate, item.note || '']);

                if (batchCode && qty > 0) {
                  const batchId = `bat_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
                  const fallbackExp = new Date(new Date(validReceiptDate).getTime() + 365 * 86400000).toISOString().split('T')[0];
                  const invExpDate = expDate || fallbackExp;
                  const storageLoc = item.storage_loc || 'Kệ Bếp';

                  await safeTxStep(tx, () => tx.exec(`
                    INSERT INTO inventory_batches (id, sku, branch_id, batch_code, mfg_date, exp_date, qty, storage_loc, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
                  `, [batchId, item.item_code, publicBranchId, batchCode, mfgDate, invExpDate, qty, storageLoc]));

                  await safeTxStep(tx, () => tx.exec(`
                    INSERT INTO wms.inventory_batches (id, sku, branch_id, batch_code, mfg_date, exp_date, qty, storage_loc, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
                  `, [batchId, item.item_code, site_code.toLowerCase(), batchCode, mfgDate, invExpDate, qty, storageLoc]));
                }

                // Upsert vào fnb_stock_balances (cộng dồn vào book_qty hiện có để không làm mất các giao dịch Xuất kho sử dụng trước đó)
                await tx.exec(`
                  INSERT INTO fnb_stock_balances (item_code, site_code, region, opening_qty, receipt_qty, sales_bom_qty, waste_qty, book_qty, total_value, updated_at)
                  VALUES (?, ?, 'Miền Nam', 0, ?, 0, 0, ?, ?, NOW())
                  ON CONFLICT (item_code, site_code) DO UPDATE SET
                    receipt_qty = COALESCE(fnb_stock_balances.receipt_qty, 0) + EXCLUDED.receipt_qty,
                    book_qty = COALESCE(fnb_stock_balances.book_qty, 0) + EXCLUDED.receipt_qty,
                    total_value = (COALESCE(fnb_stock_balances.book_qty, 0) + EXCLUDED.receipt_qty) * ?,
                    updated_at = NOW()
                `, [item.item_code, site_code, qty, qty, lineAmount, unitPrice]);

                await tx.exec(`
                  INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                  VALUES (?, 'NHAP_KHO', ?, ?, ?, ?, ?, ?, ?)
                `, [receiptCode, item.item_code, site_code, qty, unitPrice, lineAmount, `Nhập từ ${supplier} (Số HĐ/PO: ${invoice_no || 'N/A'})`, created_by]);

                // Nếu có số PO, cập nhật trạng thái đã nhận hàng
                if (invoice_no) {
                  await safeTxStep(tx, () => tx.exec(`
                    UPDATE wms.sap_po_items
                    SET received_qty = COALESCE(received_qty, 0) + ?,
                        status = CASE WHEN (COALESCE(received_qty, 0) + ?) >= order_qty THEN 'COMPLETED' ELSE 'PARTIAL' END,
                        updated_at = NOW()
                    WHERE po_number = ? AND article = ?
                  `, [qty, qty, invoice_no, item.item_code]));
                }
              }
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');

            await writeAuditLog(env, request, {
              userEmail: created_by,
              action: 'CREATE',
              entityType: 'RECEIPT',
              entityId: receiptId,
              docCode: receiptCode,
              siteCode: site_code,
              summary: `Tạo phiếu nhập kho ${receiptCode} (${lines.length} dòng, ${Math.round(totalAmount).toLocaleString('vi-VN')} đ)`,
              newData: { receipt_date: validReceiptDate, supplier, invoice_no, notes, lines }
            });

            return new Response(JSON.stringify({
              success: true,
              message: 'Nhập hàng vào kho thành công!',
              data: { receipt_code: receiptCode, receipt_id: receiptId, total_amount: totalAmount }
            }), { headers: corsHeaders });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: e.message }), { headers: corsHeaders, status: 500 });
          }
        }

        // 3.7.0b CẬP NHẬT PHIẾU NHẬP KHO: PUT /api/fnb/receipts
        if (request.method === 'PUT' && !pathname.endsWith('/cancel')) {
          const caller = await getCallerPermissions(env, request);
          if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
            const pReceipts = caller.permissions['fnb-receipts'];
            const pWh = caller.permissions['wh-inventory'];
            const canEdit = (pReceipts && pReceipts.canEdit) || (pWh && pWh.canEdit);
            if (!canEdit) {
              return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền Sửa phiếu nhập kho' }), { status: 403, headers: corsHeaders });
            }
          }

          try {
            const body = await request.json();
            const {
              id,
              receipt_date,
              supplier = '',
              invoice_no = '',
              notes = '',
              created_by = 'Thủ kho / Bếp trưởng',
              lines = []
            } = body;

            const receiptId = id || searchParams.get('id');
            if (!receiptId) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu ID phiếu nhập kho' }), { headers: corsHeaders, status: 400 });
            }

            const validLines = (Array.isArray(lines) ? lines : []).filter(l => (Number(l.qty) || 0) > 0);
            if (!validLines.length) {
              return new Response(JSON.stringify({ success: false, error: 'Phiếu nhập phải có ít nhất 1 mặt hàng với số lượng > 0' }), { headers: corsHeaders, status: 400 });
            }

            const existingReceipt = await db.queryOne(env, `SELECT * FROM fnb_stock_receipts WHERE id = ?`, [receiptId]);
            if (!existingReceipt) {
              return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy phiếu nhập kho' }), { headers: corsHeaders, status: 404 });
            }

            const { rows: oldLines } = await db.query(env, `SELECT * FROM fnb_stock_receipt_lines WHERE receipt_id = ?`, [receiptId]);
            const siteCode = existingReceipt.site_code;
            const receiptCode = existingReceipt.receipt_code;
            const validReceiptDate = receipt_date || existingReceipt.receipt_date || new Date().toISOString().split('T')[0];
            const finalSupplier = (supplier || existingReceipt.supplier || 'Bếp Trung Tâm Siba').trim();
            const finalInvoiceNo = (invoice_no ?? existingReceipt.invoice_no ?? '').trim();

            let totalAmount = 0;
            for (const item of validLines) {
              totalAmount += (Number(item.qty) || 0) * (Number(item.unit_price) || 0);
            }

            const isPg = db.isPg(env);
            const safeTxStep = async (tx, fn) => {
              if (!isPg) {
                try { return await fn(); } catch (_) { return null; }
              }
              const sp = 'sp_' + Math.random().toString(36).slice(2, 10);
              await tx.exec(`SAVEPOINT ${sp}`);
              try {
                const res = await fn();
                await tx.exec(`RELEASE SAVEPOINT ${sp}`);
                return res;
              } catch (err) {
                await tx.exec(`ROLLBACK TO SAVEPOINT ${sp}`).catch(() => {});
                await tx.exec(`RELEASE SAVEPOINT ${sp}`).catch(() => {});
                return null;
              }
            };

            await db.withTransaction(env, async (tx) => {
              const brRow = await safeTxStep(tx, () => tx.queryOne(`SELECT id FROM branches WHERE UPPER(code) = UPPER(?) LIMIT 1`, [siteCode]));
              const publicBranchId = brRow?.id || siteCode.toLowerCase();

              // 1. Hoàn tác tồn kho, batch & PO của các dòng cũ
              for (const oldLine of (oldLines || [])) {
                const oldQty = Number(oldLine.qty) || 0;
                const oldPrice = Number(oldLine.unit_price) || 0;
                if (oldQty > 0) {
                  await tx.exec(`
                    UPDATE fnb_stock_balances
                    SET receipt_qty = GREATEST(0, COALESCE(receipt_qty, 0) - ?),
                        book_qty = COALESCE(book_qty, 0) - ?,
                        total_value = (COALESCE(book_qty, 0) - ?) * ?,
                        updated_at = NOW()
                    WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                  `, [oldQty, oldQty, oldQty, oldPrice, oldLine.item_code, siteCode]);
                }

                if (oldLine.batch_code) {
                  await safeTxStep(tx, () => tx.exec(`
                    DELETE FROM inventory_batches
                    WHERE sku = ? AND (branch_id = ? OR LOWER(branch_id) = ?) AND batch_code = ?
                  `, [oldLine.item_code, publicBranchId, siteCode.toLowerCase(), oldLine.batch_code]));
                  await safeTxStep(tx, () => tx.exec(`
                    DELETE FROM wms.inventory_batches
                    WHERE sku = ? AND branch_id = ? AND batch_code = ?
                  `, [oldLine.item_code, siteCode.toLowerCase(), oldLine.batch_code]));
                }

                if (existingReceipt.invoice_no) {
                  await safeTxStep(tx, () => tx.exec(`
                    UPDATE wms.sap_po_items
                    SET received_qty = GREATEST(0, COALESCE(received_qty, 0) - ?),
                        status = CASE
                          WHEN GREATEST(0, COALESCE(received_qty, 0) - ?) <= 0 THEN 'OPEN'
                          WHEN GREATEST(0, COALESCE(received_qty, 0) - ?) >= order_qty THEN 'COMPLETED'
                          ELSE 'PARTIAL'
                        END,
                        updated_at = NOW()
                    WHERE po_number = ? AND article = ?
                  `, [oldQty, oldQty, oldQty, existingReceipt.invoice_no, oldLine.item_code]));
                }
              }

              await safeTxStep(tx, () => tx.exec(`
                DELETE FROM fnb_stock_transactions
                WHERE trans_code = ? AND UPPER(site_code) = UPPER(?) AND trans_type = 'NHAP_KHO'
              `, [receiptCode, siteCode]));

              await tx.exec(`DELETE FROM fnb_stock_receipt_lines WHERE receipt_id = ?`, [receiptId]);

              // 2. Cập nhật header & ghi lại các dòng mới
              await tx.exec(`
                UPDATE fnb_stock_receipts
                SET receipt_date = ?, supplier = ?, invoice_no = ?, total_amount = ?, notes = ?, created_by = ?
                WHERE id = ?
              `, [validReceiptDate, finalSupplier, finalInvoiceNo, totalAmount, notes, created_by, receiptId]);

              for (const item of validLines) {
                const qty = Number(item.qty) || 0;
                const unitPrice = Number(item.unit_price) || 0;
                const lineAmount = qty * unitPrice;
                const batchCode = (item.batch_code || '').trim() || `LÔ-${validReceiptDate.replace(/-/g, '').slice(2)}`;
                const expDate = (item.exp_date || '').trim() || null;
                const mfgDate = (item.mfg_date || '').trim() || null;

                await tx.exec(`
                  INSERT INTO fnb_stock_receipt_lines (receipt_id, item_code, qty, unit_price, amount, batch_code, exp_date, mfg_date, note)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [receiptId, item.item_code, qty, unitPrice, lineAmount, batchCode, expDate, mfgDate, item.note || '']);

                if (batchCode && qty > 0) {
                  const batchId = `bat_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
                  const fallbackExp = new Date(new Date(validReceiptDate).getTime() + 365 * 86400000).toISOString().split('T')[0];
                  const invExpDate = expDate || fallbackExp;
                  const storageLoc = item.storage_loc || 'Kệ Bếp';

                  await safeTxStep(tx, () => tx.exec(`
                    INSERT INTO inventory_batches (id, sku, branch_id, batch_code, mfg_date, exp_date, qty, storage_loc, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
                  `, [batchId, item.item_code, publicBranchId, batchCode, mfgDate, invExpDate, qty, storageLoc]));
                  await safeTxStep(tx, () => tx.exec(`
                    INSERT INTO wms.inventory_batches (id, sku, branch_id, batch_code, mfg_date, exp_date, qty, storage_loc, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
                  `, [batchId, item.item_code, siteCode.toLowerCase(), batchCode, mfgDate, invExpDate, qty, storageLoc]));
                }

                await tx.exec(`
                  INSERT INTO fnb_stock_balances (item_code, site_code, region, opening_qty, receipt_qty, sales_bom_qty, waste_qty, book_qty, total_value, updated_at)
                  VALUES (?, ?, 'Miền Nam', 0, ?, 0, 0, ?, ?, NOW())
                  ON CONFLICT (item_code, site_code) DO UPDATE SET
                    receipt_qty = COALESCE(fnb_stock_balances.receipt_qty, 0) + EXCLUDED.receipt_qty,
                    book_qty = COALESCE(fnb_stock_balances.book_qty, 0) + EXCLUDED.receipt_qty,
                    total_value = (COALESCE(fnb_stock_balances.book_qty, 0) + EXCLUDED.receipt_qty) * ?,
                    updated_at = NOW()
                `, [item.item_code, siteCode, qty, qty, lineAmount, unitPrice]);

                await tx.exec(`
                  INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                  VALUES (?, 'NHAP_KHO', ?, ?, ?, ?, ?, ?, ?)
                `, [receiptCode, item.item_code, siteCode, qty, unitPrice, lineAmount, `Nhập từ ${finalSupplier} (Số HĐ/PO: ${finalInvoiceNo || 'N/A'})`, created_by]);

                if (finalInvoiceNo) {
                  await safeTxStep(tx, () => tx.exec(`
                    UPDATE wms.sap_po_items
                    SET received_qty = COALESCE(received_qty, 0) + ?,
                        status = CASE WHEN (COALESCE(received_qty, 0) + ?) >= order_qty THEN 'COMPLETED' ELSE 'PARTIAL' END,
                        updated_at = NOW()
                    WHERE po_number = ? AND article = ?
                  `, [qty, qty, finalInvoiceNo, item.item_code]));
                }
              }
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');
            invalidateMemoryCache('/api/wh');
            invalidateMemoryCache('/api/po-sap');

            await writeAuditLog(env, request, {
              userEmail: created_by,
              action: 'UPDATE',
              entityType: 'RECEIPT',
              entityId: receiptId,
              docCode: receiptCode,
              siteCode: siteCode,
              summary: `Sửa phiếu nhập kho ${receiptCode} (${validLines.length} dòng, ${Math.round(totalAmount).toLocaleString('vi-VN')} đ)`,
              oldData: { header: existingReceipt, lines: oldLines },
              newData: { receipt_date: validReceiptDate, supplier: finalSupplier, invoice_no: finalInvoiceNo, notes, lines: validLines }
            });

            return new Response(JSON.stringify({
              success: true,
              message: `Đã cập nhật phiếu nhập ${receiptCode} thành công!`,
              data: { receipt_id: receiptId, receipt_code: receiptCode, total_amount: totalAmount }
            }), { headers: corsHeaders });
          } catch (e) {
            console.error('Update receipt error:', e);
            return new Response(JSON.stringify({ success: false, error: 'Lỗi cập nhật phiếu nhập: ' + e.message }), { headers: corsHeaders, status: 500 });
          }
        }

        // 3.7.1 HỦY NHẬP KHO: DELETE /api/fnb/receipts hoặc POST /api/fnb/receipts/cancel
        if (request.method === 'DELETE' || pathname.endsWith('/cancel')) {
          const caller = await getCallerPermissions(env, request);
          if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
            const pReceipts = caller.permissions['fnb-receipts'];
            const pWh = caller.permissions['wh-inventory'];
            const canDel = (pReceipts && pReceipts.canDelete) || (pWh && pWh.canDelete);
            if (!canDel) {
              return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền Hủy nhập kho / Xóa phiếu nhập' }), { status: 403, headers: corsHeaders });
            }
          }

          try {
            let receiptId = searchParams.get('id');
            let poNumber = searchParams.get('po_number');

            if (request.method === 'POST' || request.method === 'DELETE') {
              try {
                const body = await request.json();
                if (!receiptId && body.id) receiptId = body.id;
                if (!receiptId && body.receipt_id) receiptId = body.receipt_id;
                if (!poNumber && body.po_number) poNumber = body.po_number;
              } catch (_) {}
            }

            if (!receiptId && !poNumber) {
              return new Response(JSON.stringify({ success: false, error: 'Vui lòng cung cấp mã phiếu nhập (id) hoặc số đơn đặt hàng (po_number)' }), { headers: corsHeaders, status: 400 });
            }

            let receipt = null;
            if (receiptId) {
              receipt = await db.queryOne(env, `SELECT * FROM fnb_stock_receipts WHERE id = ?`, [receiptId]);
            } else if (poNumber) {
              receipt = await db.queryOne(env, `SELECT * FROM fnb_stock_receipts WHERE invoice_no = ? ORDER BY id DESC LIMIT 1`, [poNumber]);
            }

            let deletedReceiptLines = [];
            await db.withTransaction(env, async (tx) => {
              if (receipt) {
                const rId = receipt.id;
                const siteCode = receipt.site_code;
                const poNum = receipt.invoice_no;
                const rCode = receipt.receipt_code;

                // Lấy các dòng mặt hàng
                const { rows: lines } = await tx.query(`SELECT * FROM fnb_stock_receipt_lines WHERE receipt_id = ?`, [rId]);
                deletedReceiptLines = lines || [];

                for (const line of (lines || [])) {
                  const qty = Number(line.qty) || 0;
                  const unitPrice = Number(line.unit_price) || 0;
                  const lineAmount = Number(line.amount) || (qty * unitPrice);

                  // Hoàn tác tồn kho fnb_stock_balances (trừ đúng SL nhập khỏi book_qty hiện tại để giữ nguyên các phát sinh Xuất kho sử dụng & Hủy hàng)
                  await tx.exec(`
                    UPDATE fnb_stock_balances
                    SET receipt_qty = GREATEST(0, COALESCE(receipt_qty, 0) - ?),
                        book_qty = COALESCE(book_qty, 0) - ?,
                        total_value = (COALESCE(book_qty, 0) - ?) * ?,
                        updated_at = NOW()
                    WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                  `, [qty, qty, qty, unitPrice, line.item_code, siteCode]);

                  // Xóa batch nếu có trên cả public.inventory_batches và wms.inventory_batches
                  if (line.batch_code) {
                    try {
                      const brRow = await tx.queryOne(`SELECT id FROM branches WHERE UPPER(code) = UPPER(?) LIMIT 1`, [siteCode]).catch(() => null);
                      const publicBranchId = brRow?.id || siteCode.toLowerCase();
                      await tx.exec(`
                        DELETE FROM inventory_batches
                        WHERE sku = ? AND (branch_id = ? OR LOWER(branch_id) = ?) AND batch_code = ?
                      `, [line.item_code, publicBranchId, siteCode.toLowerCase(), line.batch_code]).catch(() => {});
                      await tx.exec(`
                        DELETE FROM wms.inventory_batches
                        WHERE sku = ? AND branch_id = ? AND batch_code = ?
                      `, [line.item_code, siteCode.toLowerCase(), line.batch_code]);
                    } catch (eBat) {}
                  }

                  // Ghi nhật ký HUY_NHAP_KHO
                  try {
                    await tx.exec(`
                      INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                      VALUES (?, 'HUY_NHAP_KHO', ?, ?, ?, ?, ?, ?, ?)
                    `, [rCode, line.item_code, siteCode, -qty, unitPrice, -lineAmount, `Hủy nhập kho phiếu ${rCode} (PO/HĐ: ${poNum || 'N/A'})`, 'Thủ kho / Quản trị']);
                  } catch (eTx) {}
                }

                // Nếu có liên kết đơn PO/PR, hoàn tác trạng thái PO về OPEN
                if (poNum) {
                  try {
                    await tx.exec(`
                      UPDATE wms.sap_po_items
                      SET received_qty = 0,
                          status = 'OPEN',
                          updated_at = NOW()
                      WHERE po_number = ?
                    `, [poNum]);
                  } catch (ePo) {}
                }

                // Xóa chi tiết và phiếu nhập
                await tx.exec(`DELETE FROM fnb_stock_receipt_lines WHERE receipt_id = ?`, [rId]);
                await tx.exec(`DELETE FROM fnb_stock_receipts WHERE id = ?`, [rId]);
              } else if (poNumber) {
                // PO SAP không có record fnb_stock_receipts
                await tx.exec(`
                  UPDATE wms.sap_po_items
                  SET received_qty = 0,
                      status = 'OPEN',
                      updated_at = NOW()
                  WHERE po_number = ?
                `, [poNumber]);
              }
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');
            invalidateMemoryCache('/api/wh');
            invalidateMemoryCache('/api/po-sap');

            await writeAuditLog(env, request, {
              action: 'CANCEL',
              entityType: 'RECEIPT',
              entityId: receipt?.id || receiptId || poNumber,
              docCode: receipt?.receipt_code || poNumber,
              siteCode: receipt?.site_code || null,
              summary: `Hủy phiếu nhập kho ${receipt?.receipt_code || poNumber}`,
              oldData: receipt ? { header: receipt, lines: deletedReceiptLines } : { po_number: poNumber }
            });

            return new Response(JSON.stringify({
              success: true,
              message: `Hủy nhập kho thành công! Toàn bộ số lượng tồn kho và trạng thái đơn hàng đã được hoàn tác.`
            }), { headers: corsHeaders });
          } catch (err) {
            console.error('Cancel receipt error:', err);
            return new Response(JSON.stringify({ success: false, error: 'Lỗi hủy nhập kho: ' + err.message }), { headers: corsHeaders, status: 500 });
          }
        }
      }

      // 3.8 HỦY HÀNG: GET & POST /api/fnb/wastes
      if ((pathname === '/api/fnb/wastes' || pathname === '/fnb/wastes')) {
        if (request.method === 'GET') {
          const siteCode = searchParams.get('site_code');
          const { startDate, endDate } = resolveDateRange(searchParams, 2);
          let q = `SELECT * FROM fnb_stock_wastes WHERE SUBSTR(CAST(waste_date AS TEXT), 1, 10) >= ? AND SUBSTR(CAST(waste_date AS TEXT), 1, 10) <= ?`;
          let b = [startDate, endDate];
          if (siteCode && siteCode !== 'all') {
            q += ` AND site_code = ?`;
            b.push(siteCode);
          }
          q += ` ORDER BY waste_date DESC, id DESC LIMIT 100`;
          const { rows: wastes } = await db.query(env, q, b);

          const wasteId = searchParams.get('id');
          let lines = [];
          if (wasteId) {
            const { rows: l } = await db.query(env, `
              SELECT l.*, 
                     COALESCE(d.material_desc, p.article_desc, i.name, l.item_code) as item_name, 
                     COALESCE(d.entry_unit, p.order_unit, i.unit, 'Phần') as unit, 
                     COALESCE(d.nhom_hang, p.merch_category, i.item_group, 'Chưa phân loại') as item_group
              FROM fnb_stock_waste_lines l
              LEFT JOIN (
                SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit
                FROM dim_article_stock
                GROUP BY material
              ) d ON l.item_code = d.material
              LEFT JOIN (SELECT DISTINCT ON (article) article, article_desc, merch_category, order_unit, net_price FROM sap_po_items) p ON l.item_code = p.article
              LEFT JOIN fnb_stock_items i ON l.item_code = i.code
              WHERE l.waste_id = ?
            `, [wasteId]);
            lines = l || [];
          }

          return new Response(JSON.stringify({
            success: true,
            data: { wastes: wastes || [], lines }
          }), { headers: corsHeaders });
        }

        if (request.method === 'POST') {
          try {
            const body = await request.json();
            const { site_code, waste_date, reason = 'Hàng hỏng / rách', confirmed_by = 'Bếp trưởng', notes = '', attachment_url = '', created_by = 'Bếp trưởng', lines = [] } = body;
            if (!site_code || !lines.length) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu thông tin điểm bán hoặc danh sách hàng hủy' }), { headers: corsHeaders, status: 400 });
            }

            const sysCfg = await getSystemConfig(env);
            if (sysCfg.waste_require_image && (!attachment_url || !String(attachment_url).trim())) {
              return new Response(JSON.stringify({
                success: false,
                error: 'Cấu hình hệ thống yêu cầu bắt buộc đính kèm hình ảnh minh chứng khi lập phiếu hủy!'
              }), { headers: corsHeaders, status: 400 });
            }

            const randSuffix = Math.floor(1000 + Math.random() * 9000);
            const wasteCode = `BBH-${(waste_date || '').replace(/-/g, '')}-${randSuffix}`;
            const validWasteDate = waste_date || new Date().toISOString().split('T')[0];

            let totalAmount = 0;
            for (const item of lines) {
              const qty = Number(item.qty) || 0;
              const price = Number(item.unit_price) || 0;
              totalAmount += (qty * price);
            }

            const approvalThreshold = Number(sysCfg.waste_approval_amount_threshold) || 500000;
            const requiresApproval = totalAmount > approvalThreshold;
            const finalNotes = requiresApproval
              ? `[CHỜ DUYỆT > ${Math.round(approvalThreshold).toLocaleString('vi-VN')}đ] ${notes || ''}`.trim()
              : notes;

            // Insert Header
            const insertH = await db.queryOne(env, `
              INSERT INTO fnb_stock_wastes (waste_code, site_code, waste_date, reason, confirmed_by, total_amount, notes, attachment_url, created_by)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
            `, [wasteCode, site_code, validWasteDate, reason, confirmed_by, totalAmount, finalNotes, attachment_url, created_by]);

            const wasteId = insertH.id;

            // Batch insert lines & update balances in a single transaction (ACID)
            await db.withTransaction(env, async (tx) => {
              for (const item of lines) {
                const qty = Number(item.qty) || 0;
                const unitPrice = Number(item.unit_price) || 0;
                const lineAmount = qty * unitPrice;

                await tx.exec(`
                  INSERT INTO fnb_stock_waste_lines (waste_id, item_code, qty, unit_price, amount, reason_detail)
                  VALUES (?, ?, ?, ?, ?, ?)
                `, [wasteId, item.item_code, qty, unitPrice, lineAmount, item.reason_detail || reason]);

                await tx.exec(`
                  UPDATE fnb_stock_balances
                  SET waste_qty = COALESCE(waste_qty, 0) + ?,
                      book_qty = GREATEST(0, COALESCE(book_qty, 0) - ?),
                      total_value = GREATEST(0, (COALESCE(book_qty, 0) - ?) * ?),
                      updated_at = NOW()
                  WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                `, [qty, qty, qty, unitPrice, item.item_code, site_code]);

                // Đồng bộ trừ lô theo chuẩn FEFO trong inventory_batches khi Hủy hàng
                try {
                  const br = await tx.queryOne(`SELECT id FROM branches WHERE UPPER(code) = UPPER(?) LIMIT 1`, [site_code]);
                  if (br && br.id) {
                    const { rows: batches } = await tx.query(`
                      SELECT id, qty FROM inventory_batches
                      WHERE branch_id = ? AND sku = ? AND qty > 0
                      ORDER BY exp_date ASC
                    `, [br.id, item.item_code]);
                    let rem = qty;
                    for (const b of (batches || [])) {
                      if (rem <= 0) break;
                      const deduct = Math.min(Number(b.qty) || 0, rem);
                      if (deduct > 0) {
                        await tx.exec(`UPDATE inventory_batches SET qty = qty - ? WHERE id = ?`, [deduct, b.id]);
                        await tx.exec(`INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note) VALUES (?, ?, ?, ?, 'HUY_HANG', ?, ?)`,
                          ['tx_' + Math.random().toString(36).substr(2, 9), br.id, item.item_code, b.id, deduct, `${wasteCode} - ${reason}`]);
                        rem -= deduct;
                      }
                    }
                  }
                } catch (eWasteFefo) {}

                await tx.exec(`
                  INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                  VALUES (?, 'HUY_HANG', ?, ?, ?, ?, ?, ?, ?)
                `, [wasteCode, item.item_code, site_code, -qty, unitPrice, -lineAmount, `Hủy hàng: ${item.reason_detail || reason} (Xác nhận: ${confirmed_by})`, created_by]);
              }
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');

            await writeAuditLog(env, request, {
              userEmail: created_by,
              action: 'CREATE',
              entityType: 'WASTE',
              entityId: wasteId,
              docCode: wasteCode,
              siteCode: site_code,
              summary: `Tạo biên bản hủy hàng ${wasteCode} (${lines.length} dòng, ${Math.round(totalAmount).toLocaleString('vi-VN')} đ)`,
              newData: { waste_date: validWasteDate, reason, confirmed_by, notes, lines }
            });

            return new Response(JSON.stringify({
              success: true,
              message: 'Ghi nhận biên bản hủy hàng thành công!',
              data: { waste_code: wasteCode, waste_id: wasteId, total_amount: totalAmount }
            }), { headers: corsHeaders });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: e.message }), { headers: corsHeaders, status: 500 });
          }
        }

        // Helper hoàn trả tồn kho & FEFO cho biên bản hủy hàng (dùng chung cho PUT & DELETE)
        const revertWasteEffects = async (tx, existingWaste, oldLines) => {
          const siteCode = existingWaste.site_code;
          const wasteCode = existingWaste.waste_code;
          let brId = null;
          try {
            const br = await tx.queryOne(`SELECT id FROM branches WHERE UPPER(code) = UPPER(?) LIMIT 1`, [siteCode]);
            if (br && br.id) brId = br.id;
          } catch (e) {}

          for (const oldLine of (oldLines || [])) {
            const oldQty = Number(oldLine.qty) || 0;
            const oldPrice = Number(oldLine.unit_price) || 0;
            if (oldQty <= 0) continue;

            await tx.exec(`
              UPDATE fnb_stock_balances
              SET waste_qty = GREATEST(0, COALESCE(waste_qty, 0) - ?),
                  book_qty = COALESCE(book_qty, 0) + ?,
                  total_value = CASE WHEN ? > 0 THEN (COALESCE(book_qty, 0) + ?) * ? ELSE COALESCE(total_value, 0) END,
                  updated_at = NOW()
              WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
            `, [oldQty, oldQty, oldPrice, oldQty, oldPrice, oldLine.item_code, siteCode]);

            if (brId) {
              try {
                const { rows: txs } = await tx.query(`
                  SELECT id, batch_id, qty FROM stock_transactions
                  WHERE branch_id = ? AND sku = ? AND trans_type = 'HUY_HANG' AND note LIKE ?
                `, [brId, oldLine.item_code, `${wasteCode}%`]);

                if (txs && txs.length > 0) {
                  for (const st of txs) {
                    const restoreQty = Number(st.qty) || 0;
                    if (restoreQty > 0 && st.batch_id) {
                      await tx.exec(`UPDATE inventory_batches SET qty = qty + ? WHERE id = ?`, [restoreQty, st.batch_id]);
                    }
                    await tx.exec(`DELETE FROM stock_transactions WHERE id = ?`, [st.id]);
                  }
                } else {
                  const latestBatch = await tx.queryOne(`
                    SELECT id FROM inventory_batches
                    WHERE branch_id = ? AND sku = ?
                    ORDER BY exp_date DESC LIMIT 1
                  `, [brId, oldLine.item_code]);
                  if (latestBatch && latestBatch.id) {
                    await tx.exec(`UPDATE inventory_batches SET qty = qty + ? WHERE id = ?`, [oldQty, latestBatch.id]);
                  }
                }
              } catch (eFefo) {}
            }
          }

          await tx.exec(`
            DELETE FROM fnb_stock_transactions
            WHERE trans_code = ? AND UPPER(site_code) = UPPER(?) AND trans_type = 'HUY_HANG'
          `, [wasteCode, siteCode]).catch(() => {});
        };

        if (request.method === 'PUT') {
          const caller = await getCallerPermissions(env, request);
          if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
            const pWaste = caller.permissions['fnb-waste'];
            const canEdit = pWaste && pWaste.canEdit;
            if (!canEdit) {
              return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền Sửa biên bản hủy hàng' }), { status: 403, headers: corsHeaders });
            }
          }

          try {
            const body = await request.json();
            const {
              id,
              waste_date,
              reason = 'Hàng hỏng / rách',
              confirmed_by = 'Bếp trưởng',
              notes = '',
              created_by = 'Bếp trưởng',
              lines = []
            } = body;

            const wasteId = id || searchParams.get('id');
            if (!wasteId) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu ID biên bản hủy' }), { headers: corsHeaders, status: 400 });
            }

            const validLines = (Array.isArray(lines) ? lines : []).filter(l => (Number(l.qty) || 0) > 0);
            if (!validLines.length) {
              return new Response(JSON.stringify({ success: false, error: 'Biên bản phải có ít nhất 1 mặt hàng với số lượng > 0' }), { headers: corsHeaders, status: 400 });
            }

            const existingWaste = await db.queryOne(env, `SELECT * FROM fnb_stock_wastes WHERE id = ?`, [wasteId]);
            if (!existingWaste) {
              return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy biên bản hủy' }), { headers: corsHeaders, status: 404 });
            }

            const { rows: oldLines } = await db.query(env, `SELECT * FROM fnb_stock_waste_lines WHERE waste_id = ?`, [wasteId]);
            const siteCode = existingWaste.site_code;
            const wasteCode = existingWaste.waste_code;
            const validWasteDate = waste_date || existingWaste.waste_date || new Date().toISOString().split('T')[0];

            let totalAmount = 0;
            for (const item of validLines) {
              totalAmount += (Number(item.qty) || 0) * (Number(item.unit_price) || 0);
            }

            await db.withTransaction(env, async (tx) => {
              await revertWasteEffects(tx, existingWaste, oldLines);
              await tx.exec(`DELETE FROM fnb_stock_waste_lines WHERE waste_id = ?`, [wasteId]);

              await tx.exec(`
                UPDATE fnb_stock_wastes
                SET waste_date = ?, reason = ?, confirmed_by = ?, total_amount = ?, notes = ?
                WHERE id = ?
              `, [validWasteDate, reason, confirmed_by, totalAmount, notes, wasteId]);

              for (const item of validLines) {
                const qty = Number(item.qty) || 0;
                const unitPrice = Number(item.unit_price) || 0;
                const lineAmount = qty * unitPrice;

                await tx.exec(`
                  INSERT INTO fnb_stock_waste_lines (waste_id, item_code, qty, unit_price, amount, reason_detail)
                  VALUES (?, ?, ?, ?, ?, ?)
                `, [wasteId, item.item_code, qty, unitPrice, lineAmount, item.reason_detail || reason]);

                await tx.exec(`
                  UPDATE fnb_stock_balances
                  SET waste_qty = COALESCE(waste_qty, 0) + ?,
                      book_qty = GREATEST(0, COALESCE(book_qty, 0) - ?),
                      total_value = GREATEST(0, (COALESCE(book_qty, 0) - ?) * ?),
                      updated_at = NOW()
                  WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                `, [qty, qty, qty, unitPrice, item.item_code, siteCode]);

                try {
                  const br = await tx.queryOne(`SELECT id FROM branches WHERE UPPER(code) = UPPER(?) LIMIT 1`, [siteCode]);
                  if (br && br.id) {
                    const { rows: batches } = await tx.query(`
                      SELECT id, qty FROM inventory_batches
                      WHERE branch_id = ? AND sku = ? AND qty > 0
                      ORDER BY exp_date ASC
                    `, [br.id, item.item_code]);
                    let rem = qty;
                    for (const b of (batches || [])) {
                      if (rem <= 0) break;
                      const deduct = Math.min(Number(b.qty) || 0, rem);
                      if (deduct > 0) {
                        await tx.exec(`UPDATE inventory_batches SET qty = qty - ? WHERE id = ?`, [deduct, b.id]);
                        await tx.exec(`INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note) VALUES (?, ?, ?, ?, 'HUY_HANG', ?, ?)`,
                          ['tx_' + Math.random().toString(36).substr(2, 9), br.id, item.item_code, b.id, deduct, `${wasteCode} - ${reason}`]);
                        rem -= deduct;
                      }
                    }
                  }
                } catch (eWasteFefo) {}

                await tx.exec(`
                  INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                  VALUES (?, 'HUY_HANG', ?, ?, ?, ?, ?, ?, ?)
                `, [wasteCode, item.item_code, siteCode, -qty, unitPrice, -lineAmount, `Hủy hàng: ${item.reason_detail || reason} (Xác nhận: ${confirmed_by})`, created_by]);
              }
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');

            await writeAuditLog(env, request, {
              userEmail: created_by,
              action: 'UPDATE',
              entityType: 'WASTE',
              entityId: wasteId,
              docCode: wasteCode,
              siteCode: siteCode,
              summary: `Sửa biên bản hủy hàng ${wasteCode} (${validLines.length} dòng, ${Math.round(totalAmount).toLocaleString('vi-VN')} đ)`,
              oldData: { header: existingWaste, lines: oldLines },
              newData: { waste_date: validWasteDate, reason, confirmed_by, notes, lines: validLines }
            });

            return new Response(JSON.stringify({
              success: true,
              message: `Đã cập nhật biên bản hủy ${wasteCode} thành công!`,
              data: { waste_id: wasteId, waste_code: wasteCode, total_amount: totalAmount }
            }), { headers: corsHeaders });
          } catch (e) {
            console.error('Update waste error:', e);
            return new Response(JSON.stringify({ success: false, error: 'Lỗi cập nhật biên bản hủy: ' + e.message }), { headers: corsHeaders, status: 500 });
          }
        }

        if (request.method === 'DELETE') {
          const caller = await getCallerPermissions(env, request);
          if (caller && !caller.isMaster && caller.user.role_code !== 'ADMIN') {
            const pWaste = caller.permissions['fnb-waste'];
            const canDel = pWaste && pWaste.canDelete;
            if (!canDel) {
              return new Response(JSON.stringify({ success: false, error: 'Bạn không có quyền Hủy biên bản hủy hàng' }), { status: 403, headers: corsHeaders });
            }
          }

          try {
            let wasteId = searchParams.get('id');
            if (!wasteId) {
              try {
                const body = await request.json();
                wasteId = body?.id;
              } catch (_) {}
            }
            if (!wasteId) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu ID biên bản hủy cần xóa' }), { headers: corsHeaders, status: 400 });
            }

            const existingWaste = await db.queryOne(env, `SELECT * FROM fnb_stock_wastes WHERE id = ?`, [wasteId]);
            if (!existingWaste) {
              return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy biên bản hủy' }), { headers: corsHeaders, status: 404 });
            }

            const { rows: oldLines } = await db.query(env, `SELECT * FROM fnb_stock_waste_lines WHERE waste_id = ?`, [wasteId]);

            await db.withTransaction(env, async (tx) => {
              await revertWasteEffects(tx, existingWaste, oldLines);
              await tx.exec(`DELETE FROM fnb_stock_waste_lines WHERE waste_id = ?`, [wasteId]);
              await tx.exec(`DELETE FROM fnb_stock_wastes WHERE id = ?`, [wasteId]);
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');

            await writeAuditLog(env, request, {
              action: 'CANCEL',
              entityType: 'WASTE',
              entityId: wasteId,
              docCode: existingWaste.waste_code,
              siteCode: existingWaste.site_code,
              summary: `Hủy biên bản hủy hàng ${existingWaste.waste_code} và hoàn trả tồn kho`,
              oldData: { header: existingWaste, lines: oldLines }
            });

            return new Response(JSON.stringify({
              success: true,
              message: `Đã hủy phiếu ${existingWaste.waste_code} và hoàn trả tồn kho!`
            }), { headers: corsHeaders });
          } catch (e) {
            console.error('Delete waste error:', e);
            return new Response(JSON.stringify({ success: false, error: 'Lỗi hủy phiếu: ' + e.message }), { headers: corsHeaders, status: 500 });
          }
        }
      }


      // 3.9 XUẤT KHO SỬ DỤNG BẾP: GET & POST /api/fnb/kitchen-issues
      if ((pathname === '/api/fnb/kitchen-issues' || pathname === '/fnb/kitchen-issues')) {
        // Tự động đảm bảo bảng CSDL tồn tại trên cả Postgres (Supabase) và Cloudflare D1
        const isPostgres = db.isPg(env);
        const idType = isPostgres ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
        const timeType = isPostgres ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 'DATETIME DEFAULT CURRENT_TIMESTAMP';

        try {
          await db.exec(env, `
            CREATE TABLE IF NOT EXISTS fnb_kitchen_issues (
              id ${idType},
              issue_code TEXT UNIQUE NOT NULL,
              site_code TEXT NOT NULL,
              issue_date TEXT NOT NULL,
              meal_shift TEXT DEFAULT 'Nấu ăn ca trưa',
              issuer_name TEXT NOT NULL,
              receiver_name TEXT NOT NULL,
              total_items INTEGER DEFAULT 0,
              total_qty REAL DEFAULT 0,
              total_amount REAL DEFAULT 0,
              notes TEXT,
              created_at ${timeType}
            )
          `).catch(() => {});

          await db.exec(env, `
            CREATE TABLE IF NOT EXISTS fnb_kitchen_issue_lines (
              id ${idType},
              issue_id INTEGER NOT NULL,
              item_code TEXT NOT NULL,
              item_name TEXT NOT NULL,
              unit TEXT NOT NULL,
              stock_before REAL DEFAULT 0,
              qty REAL NOT NULL,
              unit_price REAL DEFAULT 0,
              amount REAL DEFAULT 0,
              notes TEXT,
              created_at ${timeType}
            )
          `).catch(() => {});

          await db.exec(env, 'CREATE INDEX IF NOT EXISTS idx_kissue_site_date ON fnb_kitchen_issues(site_code, issue_date)').catch(() => {});
          await db.exec(env, 'CREATE INDEX IF NOT EXISTS idx_kissue_lines_iid ON fnb_kitchen_issue_lines(issue_id)').catch(() => {});
        } catch (e) {}

        if (request.method === 'GET') {
          const siteCode = searchParams.get('site_code');
          const issueId = searchParams.get('id');

          if (issueId) {
            const { rows: issues } = await db.query(env, `SELECT * FROM fnb_kitchen_issues WHERE id = ?`, [issueId]);
            const issue = issues && issues[0] ? issues[0] : null;
            if (!issue) {
              return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy phiếu xuất kho' }), { headers: corsHeaders, status: 404 });
            }
            const { rows: lines } = await db.query(env, `SELECT * FROM fnb_kitchen_issue_lines WHERE issue_id = ? ORDER BY id ASC`, [issueId]);
            return new Response(JSON.stringify({
              success: true,
              data: { issue, lines: lines || [] }
            }), { headers: corsHeaders });
          }

          const { startDate, endDate } = resolveDateRange(searchParams, 2);
          let q = `SELECT * FROM fnb_kitchen_issues WHERE SUBSTR(CAST(issue_date AS TEXT), 1, 10) >= ? AND SUBSTR(CAST(issue_date AS TEXT), 1, 10) <= ?`;
          let b = [startDate, endDate];
          if (siteCode && siteCode !== 'all') {
            q += ` AND UPPER(site_code) = UPPER(?)`;
            b.push(siteCode);
          }
          q += ` ORDER BY issue_date DESC, id DESC LIMIT 100`;
          const { rows: issues } = await db.query(env, q, b);

          return new Response(JSON.stringify({
            success: true,
            data: { issues: issues || [] }
          }), { headers: corsHeaders });
        }

        if (request.method === 'POST') {
          try {
            const body = await request.json();
            const {
              site_code,
              issue_date,
              meal_shift = 'Nấu ăn ca trưa',
              issuer_name = 'Bếp trưởng',
              receiver_name = 'Ca trưởng bếp',
              notes = '',
              lines = []
            } = body;

            if (!site_code || !lines || lines.length === 0) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu thông tin điểm bán hoặc danh sách hàng xuất' }), { headers: corsHeaders, status: 400 });
            }

            const sysCfg = await getSystemConfig(env);
            const allowNegative = Boolean(sysCfg.allow_negative_stock);
            if (!allowNegative) {
              for (const item of lines) {
                const reqQty = Number(item.qty) || 0;
                if (reqQty <= 0) continue;
                const bal = await db.queryOne(env, `
                  SELECT COALESCE(book_qty, 0) as book_qty FROM fnb_stock_balances
                  WHERE item_code = ? AND UPPER(site_code) = UPPER(?) LIMIT 1
                `, [item.item_code, site_code]).catch(() => null);
                const curQty = bal ? Number(bal.book_qty) || 0 : Number(item.stock_before || 0);
                if (reqQty > curQty + 0.0001) {
                  return new Response(JSON.stringify({
                    success: false,
                    error: `Không thể xuất vượt tồn kho cho mã ${item.item_code} (Tồn: ${curQty}, Yêu cầu: ${reqQty}). Cấu hình hệ thống đang tắt chế độ cho phép xuất âm.`
                  }), { headers: corsHeaders, status: 400 });
                }
              }
            }

            const validIssueDate = issue_date || new Date().toISOString().split('T')[0];
            const randSuffix = Math.floor(1000 + Math.random() * 9000);
            const issueCode = `XKSD-${validIssueDate.replace(/-/g, '')}-${randSuffix}`;

            let totalQty = 0;
            let totalAmount = 0;
            for (const item of lines) {
              const q = Number(item.qty) || 0;
              const p = Number(item.unit_price) || 0;
              totalQty += q;
              totalAmount += (q * p);
            }

            // Insert Header
            const insertH = await db.queryOne(env, `
              INSERT INTO fnb_kitchen_issues (issue_code, site_code, issue_date, meal_shift, issuer_name, receiver_name, total_items, total_qty, total_amount, notes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
            `, [issueCode, site_code, validIssueDate, meal_shift, issuer_name, receiver_name, lines.length, totalQty, totalAmount, notes]);

            const issueId = insertH.id;

            // Batch insert lines & update balances in transaction
            await db.withTransaction(env, async (tx) => {
              for (const item of lines) {
                const qty = Number(item.qty) || 0;
                const unitPrice = Number(item.unit_price) || 0;
                const lineAmount = qty * unitPrice;
                const stockBefore = Number(item.stock_before) || 0;

                await tx.exec(`
                  INSERT INTO fnb_kitchen_issue_lines (issue_id, item_code, item_name, unit, stock_before, qty, unit_price, amount, notes)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [issueId, item.item_code, item.item_name || item.item_code, item.unit || 'Phần', stockBefore, qty, unitPrice, lineAmount, item.notes || '']);

                // Trừ tồn kho hiện hành trong fnb_stock_balances
                if (allowNegative) {
                  await tx.exec(`
                    UPDATE fnb_stock_balances
                    SET book_qty = COALESCE(book_qty, 0) - ?,
                        total_value = GREATEST(0, (COALESCE(book_qty, 0) - ?) * ?),
                        updated_at = NOW()
                    WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                  `, [qty, qty, unitPrice, item.item_code, site_code]);
                } else {
                  await tx.exec(`
                    UPDATE fnb_stock_balances
                    SET book_qty = GREATEST(0, COALESCE(book_qty, 0) - ?),
                        total_value = GREATEST(0, (COALESCE(book_qty, 0) - ?) * ?),
                        updated_at = NOW()
                    WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                  `, [qty, qty, unitPrice, item.item_code, site_code]);
                }

                // Đồng bộ trừ lô theo chuẩn FEFO trong inventory_batches
                try {
                  const br = await tx.queryOne(`SELECT id FROM branches WHERE UPPER(code) = UPPER(?) LIMIT 1`, [site_code]);
                  if (br && br.id) {
                    const { rows: batches } = await tx.query(`
                      SELECT id, qty FROM inventory_batches
                      WHERE branch_id = ? AND sku = ? AND qty > 0
                      ORDER BY exp_date ASC
                    `, [br.id, item.item_code]);
                    let rem = qty;
                    for (const b of (batches || [])) {
                      if (rem <= 0) break;
                      const deduct = Math.min(Number(b.qty) || 0, rem);
                      if (deduct > 0) {
                        await tx.exec(`UPDATE inventory_batches SET qty = qty - ? WHERE id = ?`, [deduct, b.id]);
                        await tx.exec(`INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note) VALUES (?, ?, ?, ?, 'XUAT_BEP', ?, ?)`,
                          ['tx_' + Math.random().toString(36).substr(2, 9), br.id, item.item_code, b.id, deduct, `${issueCode} - ${meal_shift}`]);
                        rem -= deduct;
                      }
                    }
                  }
                } catch (eFefo) {}

                // Ghi nhận lịch sử giao dịch biến động kho
                await tx.exec(`
                  INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                  VALUES (?, 'XUAT_BEP', ?, ?, ?, ?, ?, ?, ?)
                `, [issueCode, item.item_code, site_code, -qty, unitPrice, -lineAmount, `Xuất kho sử dụng: ${meal_shift} (Nhận: ${receiver_name})`, issuer_name]);
              }
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');

            await writeAuditLog(env, request, {
              userEmail: issuer_name,
              action: 'CREATE',
              entityType: 'KITCHEN_ISSUE',
              entityId: issueId,
              docCode: issueCode,
              siteCode: site_code,
              summary: `Tạo phiếu xuất kho sử dụng ${issueCode} (${lines.length} dòng, ${Math.round(totalAmount).toLocaleString('vi-VN')} đ)`,
              newData: { issue_date: validIssueDate, meal_shift, issuer_name, receiver_name, notes, lines }
            });

            return new Response(JSON.stringify({
              success: true,
              message: 'Tạo phiếu xuất kho sử dụng thành công!',
              data: {
                issue_id: issueId,
                issue_code: issueCode,
                total_items: lines.length,
                total_qty: totalQty,
                total_amount: totalAmount
              }
            }), { headers: corsHeaders });
          } catch (e) {
            console.error('kitchen-issues POST error:', e);
            return new Response(JSON.stringify({ success: false, error: e.message }), { headers: corsHeaders, status: 500 });
          }
        }

        // Helper hoàn trả tồn kho & FEFO cho phiếu xuất kho sử dụng (dùng chung cho PUT và DELETE)
        const revertKitchenIssueEffects = async (tx, issue, oldLines) => {
          const siteCode = issue.site_code;
          const issueCode = issue.issue_code;
          let brId = null;
          try {
            const br = await tx.queryOne(`SELECT id FROM branches WHERE UPPER(code) = UPPER(?) LIMIT 1`, [siteCode]);
            if (br && br.id) brId = br.id;
          } catch (e) {}

          for (const oldLine of (oldLines || [])) {
            const oldQty = Number(oldLine.qty) || 0;
            const oldPrice = Number(oldLine.unit_price) || 0;
            if (oldQty <= 0) continue;

            await tx.exec(`
              UPDATE fnb_stock_balances
              SET book_qty = COALESCE(book_qty, 0) + ?,
                  total_value = (COALESCE(book_qty, 0) + ?) * ?,
                  updated_at = NOW()
              WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
            `, [oldQty, oldQty, oldPrice, oldLine.item_code, siteCode]);

            if (brId) {
              try {
                const { rows: txs } = await tx.query(`
                  SELECT id, batch_id, qty FROM stock_transactions
                  WHERE branch_id = ? AND sku = ? AND trans_type = 'XUAT_BEP' AND note LIKE ?
                `, [brId, oldLine.item_code, `${issueCode}%`]);

                if (txs && txs.length > 0) {
                  for (const st of txs) {
                    const restoreQty = Number(st.qty) || 0;
                    if (restoreQty > 0 && st.batch_id) {
                      await tx.exec(`UPDATE inventory_batches SET qty = qty + ? WHERE id = ?`, [restoreQty, st.batch_id]);
                    }
                    await tx.exec(`DELETE FROM stock_transactions WHERE id = ?`, [st.id]);
                  }
                } else {
                  const latestBatch = await tx.queryOne(`
                    SELECT id FROM inventory_batches
                    WHERE branch_id = ? AND sku = ?
                    ORDER BY exp_date DESC LIMIT 1
                  `, [brId, oldLine.item_code]);
                  if (latestBatch && latestBatch.id) {
                    await tx.exec(`UPDATE inventory_batches SET qty = qty + ? WHERE id = ?`, [oldQty, latestBatch.id]);
                  }
                }
              } catch (eFefo) {}
            }
          }

          await tx.exec(`
            DELETE FROM fnb_stock_transactions
            WHERE trans_code = ? AND UPPER(site_code) = UPPER(?) AND trans_type = 'XUAT_BEP'
          `, [issueCode, siteCode]);
        };

        if (request.method === 'PUT') {
          try {
            const body = await request.json();
            const {
              id,
              issue_date,
              meal_shift = 'Nấu ăn ca trưa',
              issuer_name = 'Bếp trưởng',
              receiver_name = 'Ca trưởng bếp',
              notes = '',
              lines = []
            } = body;

            const issueId = id || searchParams.get('id');
            if (!issueId) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu ID phiếu xuất kho' }), { headers: corsHeaders, status: 400 });
            }

            const validLines = (Array.isArray(lines) ? lines : []).filter(l => (Number(l.qty) || 0) > 0);
            if (validLines.length === 0) {
              return new Response(JSON.stringify({ success: false, error: 'Phiếu xuất phải có ít nhất 1 mặt hàng với số lượng > 0' }), { headers: corsHeaders, status: 400 });
            }

            const { rows: existingIssues } = await db.query(env, `SELECT * FROM fnb_kitchen_issues WHERE id = ?`, [issueId]);
            const existingIssue = existingIssues && existingIssues[0] ? existingIssues[0] : null;
            if (!existingIssue) {
              return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy phiếu xuất kho' }), { headers: corsHeaders, status: 404 });
            }

            const { rows: oldLines } = await db.query(env, `SELECT * FROM fnb_kitchen_issue_lines WHERE issue_id = ?`, [issueId]);

            const validIssueDate = issue_date || existingIssue.issue_date || new Date().toISOString().split('T')[0];
            let totalQty = 0;
            let totalAmount = 0;
            for (const item of validLines) {
              const q = Number(item.qty) || 0;
              const p = Number(item.unit_price) || 0;
              totalQty += q;
              totalAmount += (q * p);
            }

            await db.withTransaction(env, async (tx) => {
              await revertKitchenIssueEffects(tx, existingIssue, oldLines);

              await tx.exec(`DELETE FROM fnb_kitchen_issue_lines WHERE issue_id = ?`, [issueId]);

              await tx.exec(`
                UPDATE fnb_kitchen_issues
                SET issue_date = ?, meal_shift = ?, issuer_name = ?, receiver_name = ?,
                    total_items = ?, total_qty = ?, total_amount = ?, notes = ?
                WHERE id = ?
              `, [validIssueDate, meal_shift, issuer_name, receiver_name, validLines.length, totalQty, totalAmount, notes, issueId]);

              const siteCode = existingIssue.site_code;
              const issueCode = existingIssue.issue_code;

              for (const item of validLines) {
                const qty = Number(item.qty) || 0;
                const unitPrice = Number(item.unit_price) || 0;
                const lineAmount = qty * unitPrice;
                const stockBefore = Number(item.stock_before) || 0;

                await tx.exec(`
                  INSERT INTO fnb_kitchen_issue_lines (issue_id, item_code, item_name, unit, stock_before, qty, unit_price, amount, notes)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [issueId, item.item_code, item.item_name || item.item_code, item.unit || 'Phần', stockBefore, qty, unitPrice, lineAmount, item.notes || '']);

                await tx.exec(`
                  UPDATE fnb_stock_balances
                  SET book_qty = GREATEST(0, COALESCE(book_qty, 0) - ?),
                      total_value = GREATEST(0, (COALESCE(book_qty, 0) - ?) * ?),
                      updated_at = NOW()
                  WHERE item_code = ? AND UPPER(site_code) = UPPER(?)
                `, [qty, qty, unitPrice, item.item_code, siteCode]);

                try {
                  const br = await tx.queryOne(`SELECT id FROM branches WHERE UPPER(code) = UPPER(?) LIMIT 1`, [siteCode]);
                  if (br && br.id) {
                    const { rows: batches } = await tx.query(`
                      SELECT id, qty FROM inventory_batches
                      WHERE branch_id = ? AND sku = ? AND qty > 0
                      ORDER BY exp_date ASC
                    `, [br.id, item.item_code]);
                    let rem = qty;
                    for (const b of (batches || [])) {
                      if (rem <= 0) break;
                      const deduct = Math.min(Number(b.qty) || 0, rem);
                      if (deduct > 0) {
                        await tx.exec(`UPDATE inventory_batches SET qty = qty - ? WHERE id = ?`, [deduct, b.id]);
                        await tx.exec(`INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note) VALUES (?, ?, ?, ?, 'XUAT_BEP', ?, ?)`,
                          ['tx_' + Math.random().toString(36).substr(2, 9), br.id, item.item_code, b.id, deduct, `${issueCode} - ${meal_shift}`]);
                        rem -= deduct;
                      }
                    }
                  }
                } catch (eFefo) {}

                await tx.exec(`
                  INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                  VALUES (?, 'XUAT_BEP', ?, ?, ?, ?, ?, ?, ?)
                `, [issueCode, item.item_code, siteCode, -qty, unitPrice, -lineAmount, `Xuất kho sử dụng: ${meal_shift} (Nhận: ${receiver_name})`, issuer_name]);
              }
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');

            await writeAuditLog(env, request, {
              userEmail: issuer_name,
              action: 'UPDATE',
              entityType: 'KITCHEN_ISSUE',
              entityId: issueId,
              docCode: existingIssue.issue_code,
              siteCode: existingIssue.site_code,
              summary: `Sửa phiếu xuất kho sử dụng ${existingIssue.issue_code} (${validLines.length} dòng, ${Math.round(totalAmount).toLocaleString('vi-VN')} đ)`,
              oldData: { header: existingIssue, lines: oldLines },
              newData: { issue_date: validIssueDate, meal_shift, issuer_name, receiver_name, notes, lines: validLines }
            });

            return new Response(JSON.stringify({
              success: true,
              message: `Đã cập nhật phiếu ${existingIssue.issue_code} thành công!`,
              data: {
                issue_id: issueId,
                issue_code: existingIssue.issue_code,
                total_items: validLines.length,
                total_qty: totalQty,
                total_amount: totalAmount
              }
            }), { headers: corsHeaders });
          } catch (e) {
            console.error('kitchen-issues PUT error:', e);
            return new Response(JSON.stringify({ success: false, error: e.message }), { headers: corsHeaders, status: 500 });
          }
        }

        if (request.method === 'DELETE') {
          try {
            let issueId = searchParams.get('id');
            if (!issueId) {
              try {
                const body = await request.json();
                issueId = body?.id;
              } catch (e) {}
            }
            if (!issueId) {
              return new Response(JSON.stringify({ success: false, error: 'Thiếu ID phiếu xuất kho cần xóa' }), { headers: corsHeaders, status: 400 });
            }

            const { rows: existingIssues } = await db.query(env, `SELECT * FROM fnb_kitchen_issues WHERE id = ?`, [issueId]);
            const existingIssue = existingIssues && existingIssues[0] ? existingIssues[0] : null;
            if (!existingIssue) {
              return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy phiếu xuất kho' }), { headers: corsHeaders, status: 404 });
            }

            const { rows: oldLines } = await db.query(env, `SELECT * FROM fnb_kitchen_issue_lines WHERE issue_id = ?`, [issueId]);

            await db.withTransaction(env, async (tx) => {
              await revertKitchenIssueEffects(tx, existingIssue, oldLines);
              await tx.exec(`DELETE FROM fnb_kitchen_issue_lines WHERE issue_id = ?`, [issueId]);
              await tx.exec(`DELETE FROM fnb_kitchen_issues WHERE id = ?`, [issueId]);
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');

            await writeAuditLog(env, request, {
              action: 'CANCEL',
              entityType: 'KITCHEN_ISSUE',
              entityId: issueId,
              docCode: existingIssue.issue_code,
              siteCode: existingIssue.site_code,
              summary: `Hủy phiếu xuất kho sử dụng ${existingIssue.issue_code} và hoàn trả tồn kho`,
              oldData: { header: existingIssue, lines: oldLines }
            });

            return new Response(JSON.stringify({
              success: true,
              message: `Đã hủy phiếu ${existingIssue.issue_code} và hoàn trả tồn kho!`
            }), { headers: corsHeaders });
          } catch (e) {
            console.error('kitchen-issues DELETE error:', e);
            return new Response(JSON.stringify({ success: false, error: e.message }), { headers: corsHeaders, status: 500 });
          }
        }
      }

      // 3.10 AUDIT LOGS: GET /api/audit-logs
      if (pathname === '/api/audit-logs' && request.method === 'GET') {
        await ensureAuditLogsTable(env);
        const entityType = searchParams.get('entity_type');
        const action = searchParams.get('action');
        const siteCode = searchParams.get('site_code');
        const limit = Math.min(200, Math.max(1, Number(searchParams.get('limit')) || 100));

        let q = `SELECT * FROM audit_logs WHERE 1=1`;
        const b = [];
        if (entityType && entityType !== 'ALL') {
          q += ` AND UPPER(entity_type) = UPPER(?)`;
          b.push(entityType);
        }
        if (action && action !== 'ALL') {
          q += ` AND UPPER(action) = UPPER(?)`;
          b.push(action);
        }
        if (siteCode && siteCode !== 'ALL') {
          q += ` AND UPPER(site_code) = UPPER(?)`;
          b.push(siteCode);
        }
        q += ` ORDER BY id DESC LIMIT ?`;
        b.push(limit);

        const { rows } = await db.query(env, q, b);
        return new Response(JSON.stringify({ success: true, data: rows || [] }), { headers: corsHeaders });
      }

      // Fallback: Static Assets
      if (env.ASSETS) {
        const response = await env.ASSETS.fetch(request);
        // Ngăn chặn cache tĩnh HTML để đảm bảo client luôn thấy bản cập nhật mới nhất ngay lập tức
        if (pathname === '/' || pathname === '/index.html' || response.headers.get('content-type')?.includes('text/html')) {
          const newHeaders = new Headers(response.headers);
          newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
          newHeaders.set('Pragma', 'no-cache');
          newHeaders.set('Expires', '0');
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        }
        return response;
      }

      return new Response(JSON.stringify({ error: 'Endpoint Not Found' }), { status: 404, headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
    }
  },

  async scheduled(event, env, ctx) {
    // Keep-alive ping định kỳ (12 tiếng/lần) để ngăn chặn Supabase Free tier bị tự động Pause sau 7 ngày không hoạt động
    try {
      console.log(`[Scheduled Cron] Keep-alive ping executed at ${new Date().toISOString()}`);
      if (db.getBackend(env) === 'supabase') {
        const res = await db.queryOne(env, 'SELECT count(*) as c FROM sites');
        console.log(`[Scheduled Cron] Supabase ping successful (sites count: ${res?.c})`);
      } else if (env.DB) {
        const res = await db.queryOne(env, 'SELECT count(*) as c FROM sites');
        console.log(`[Scheduled Cron] D1 ping successful (sites count: ${res?.c})`);
      }
    } catch (e) {
      console.error(`[Scheduled Cron Error]`, e.message);
    }
  }
};
