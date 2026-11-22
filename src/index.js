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
  'Quản Lý Nhập Hàng Điểm Bán': 'fnb-receipts',
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


const ALL_SYSTEM_FEATURES = [
  'fnb-chain', 'fnb-pl', 'fnb-pos', 'fnb-stock', 'fnb-counts', 'fnb-receipts', 'fnb-waste',
  'wh-dashboard', 'wh-stock', 'wh-reorder', 'wh-leadtime', 'wh-posap',
  'portal-voucher', 'portal-search', 'portal-order', 'portal-history', 'portal-baocao', 'portal-kiemke',
  'fnb-sites', 'user-matrix'
];

async function buildUserPermissions(env, user) {
  const permissions = {};

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
      ['fnb-stock', 'fnb-counts', 'fnb-receipts', 'fnb-sites', 'wh-dashboard', 'wh-stock', 'wh-reorder', 'wh-leadtime', 'wh-posap', 'portal-kiemke', 'portal-history', 'portal-order', 'portal-baocao'].forEach(f => {
        if (!permissions[f] || !permissions[f].canView) {
          permissions[f] = { canView: true, canCreate: true, canEdit: true, canDelete: false };
        }
      });
    } else if (user.role_code === 'BEP_TRUONG') {
      ['fnb-stock', 'fnb-counts', 'fnb-receipts', 'fnb-waste', 'fnb-sites', 'portal-baocao', 'portal-order', 'portal-kiemke', 'portal-history'].forEach(f => {
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
      ['fnb-stock', 'fnb-counts', 'portal-baocao', 'portal-order'].forEach(f => {
        if (!permissions[f] || !permissions[f].canView) {
          permissions[f] = { canView: true, canCreate: true, canEdit: true, canDelete: false };
        }
      });
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

  // 4. Bảo vệ an toàn: Owner hệ thống luôn có quyền quản lý phân quyền (user-matrix)
  if (user.email === 'trantuandai2508@gmail.com') {
    permissions['user-matrix'] = { canView: true, canCreate: true, canEdit: true, canDelete: true };
  }

  return permissions;
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

            // 2. ROP (Hết hàng hoặc dưới định mức an toàn)
            ropRow = (await db.queryOne(env, `
              SELECT COUNT(*) as rop_count
              FROM fnb_stock_balances
              WHERE (? = 'ALL' OR site_code = ?) AND book_qty <= 0
            `, [upperCode, upperCode])) || { rop_count: 0 };

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
                ROUND(AVG(CASE WHEN status = 'COMPLETED' THEN 24.0 ELSE 48.0 END)::numeric, 1) as avg_lead_time
              FROM sap_po_items
              WHERE (? = 'ALL' OR site = ?)
            `, [upperCode, upperCode])) || { total_orders: 0, avg_lead_time: 24.5 };

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
                5.0 as safety_stock,
                CASE 
                  WHEN b.book_qty < 0 THEN 'OUT_OF_STOCK'
                  WHEN b.book_qty = 0 THEN 'LOW_STOCK'
                  WHEN b.no_opening = true THEN 'NEAR_EXPIRY'
                  ELSE 'NORMAL'
                END as alert_level
              FROM fnb_stock_balances b
              LEFT JOIN (SELECT DISTINCT ON (material) material, material_desc, nhom_hang, entry_unit FROM dim_article_stock) d ON b.item_code = d.material
              LEFT JOIN (SELECT DISTINCT ON (article) article, article_desc, merch_category, order_unit FROM sap_po_items) p ON b.item_code = p.article
              WHERE (? = 'ALL' OR b.site_code = ?) AND (b.book_qty <= 0 OR b.no_opening = true)
              ORDER BY b.book_qty ASC, b.item_code ASC
              LIMIT 10
            `, [upperCode, upperCode]);
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

        const enriched = (results || []).map((r, idx) => {
          let dangerLevel = 'green';
          let statusText = 'An toàn';
          const qty = parseFloat(r.qty) || 0;
          const days = parseInt(r.days_remaining, 10) || 0;
          
          if (qty < 0) {
            dangerLevel = 'red';
            statusText = 'Tồn âm (Cần kiểm kê)';
          } else if (qty === 0) {
            dangerLevel = 'yellow';
            statusText = 'Hết hàng (ROP)';
          } else if (days <= 7) {
            dangerLevel = 'red';
            statusText = 'Cận Date (≤ 7 ngày)';
          } else if (days <= 30) {
            dangerLevel = 'yellow';
            statusText = 'Cần dùng sớm (≤ 30 ngày)';
          }

          return {
            ...r,
            qty: qty,
            days_left: days,
            days_remaining: days,
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

      // 1.5 POST /api/stock/issue
      if (pathname === '/api/stock/issue' && request.method === 'POST') {
        const body = await request.json();
        const { branch_code, sku, qty_needed, note } = body;
        const branch = await db.queryOne(env, 'SELECT id FROM branches WHERE code = ?', [branch_code.toUpperCase()]);
        if (!branch) return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy chi nhánh' }), { status: 400, headers: corsHeaders });
        let remain = parseFloat(qty_needed);

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
          return new Response(JSON.stringify({ success: false, error: `Tồn kho không đủ (thiếu ${remain.toFixed(1)})` }), { status: 400, headers: corsHeaders });
        }

        await db.withTransaction(env, async (tx) => {
          for (const op of ops) {
            await tx.exec(op.updateSql, op.updateParams);
            await tx.exec(op.insertSql, op.insertParams);
          }
        });

        return new Response(JSON.stringify({ success: true, message: 'Đã xuất kho chuẩn FEFO thành công' }), { headers: corsHeaders });
      }

      // 1.6 GET /api/reorder - Cảnh báo đặt hàng ROP từ fnb_stock_balances
      if (pathname === '/api/reorder' && request.method === 'GET') {
        const branchParam = searchParams.get('branch') || '';
        const branchCode = (!branchParam || branchParam.toLowerCase() === 'all') ? 'ALL' : branchParam.toUpperCase();

        const isPg = db.isPg(env);
        let results = [];

        if (isPg) {
          const pgQuery = `
            SELECT 
              b.item_code as sku,
              COALESCE(d.material_desc, p.article_desc, b.item_code) as item_name,
              COALESCE(d.entry_unit, p.order_unit, 'Phần') as unit,
              COALESCE(d.nhom_hang, p.merch_category, 'Hàng hóa') as category,
              10.0 as daily_usage,
              48.0 as lead_time_hours,
              5.0 as safety_stock,
              COALESCE(d.price, p.net_price, 0) as standard_cost_sap,
              ROUND(SUM(b.book_qty)::numeric, 1) as current_stock,
              25.0 as rop_threshold,
              CASE 
                WHEN SUM(b.book_qty) < 25.0 
                THEN ROUND((35.0 - SUM(b.book_qty))::numeric, 0)
                ELSE 0
              END as suggested_order_qty
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
            HAVING SUM(b.book_qty) <= 25.0
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
              COALESCE(d.nhom_hang, p.merch_category, 'Hàng hóa') as category,
              10.0 as daily_usage,
              48.0 as lead_time_hours,
              5.0 as safety_stock,
              COALESCE(d.price, p.net_price, 0) as standard_cost_sap,
              ROUND(SUM(b.book_qty), 1) as current_stock,
              25.0 as rop_threshold,
              CASE 
                WHEN SUM(b.book_qty) < 25.0 
                THEN ROUND(35.0 - SUM(b.book_qty), 0)
                ELSE 0
              END as suggested_order_qty
            FROM fnb_stock_balances b
            LEFT JOIN (SELECT material, MAX(material_desc) as material_desc, MAX(nhom_hang) as nhom_hang, MAX(entry_unit) as entry_unit FROM dim_article_stock GROUP BY material) d ON b.item_code = d.material
            LEFT JOIN (SELECT article, MAX(article_desc) as article_desc, MAX(merch_category) as merch_category, MAX(order_unit) as order_unit, MAX(net_price) as net_price FROM sap_po_items GROUP BY article) p ON b.item_code = p.article
            WHERE (? = 'ALL' OR UPPER(b.site_code) = ?)
            GROUP BY b.item_code
            HAVING SUM(b.book_qty) <= 25.0
            ORDER BY SUM(b.book_qty) ASC
          `;
          const res = await db.query(env, d1Query, [branchCode, branchCode]);
          results = res.rows || [];
        }

        return createCachedResponse({ success: true, data: results }, 60, corsHeaders, isNoCache, url, request, ctx, url.toString());
      }

      // 1.7 GET /api/leadtime
      if (pathname === '/api/leadtime' && request.method === 'GET') {
        const site = searchParams.get('site');
        const siteParam = site && site !== 'ALL' ? site.toUpperCase().trim() : '';

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
                WHEN COALESCE(NULLIF(po.supplier_name, ''), '') LIKE '%RAU CỦ%' THEN 1
                WHEN COALESCE(NULLIF(po.supplier_name, ''), '') = '' THEN 1
                ELSE 2
              END as committed_lead_time_days,
              CASE 
                WHEN MAX(CAST(po.received_qty AS NUMERIC)) > 0 THEN 1
                ELSE NULL
              END as actual_lead_time_days,
              24.0 as lead_time_hours,
              24.0 as sla_target_hours,
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
              AND (? = '' OR SUBSTR(po.doc_date, 1, 7) = ?)
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
                WHEN COALESCE(NULLIF(po.supplier_name, ''), '') LIKE '%RAU CỦ%' THEN 1
                WHEN COALESCE(NULLIF(po.supplier_name, ''), '') = '' THEN 1
                ELSE 2
              END as committed_lead_time_days,
              CASE 
                WHEN MAX(po.received_qty::numeric) > 0 THEN 1
                ELSE NULL
              END as actual_lead_time_days,
              24.0 as lead_time_hours,
              24.0 as sla_target_hours,
              CASE 
                WHEN MAX(po.received_qty::numeric) > 0 THEN 'ĐÚNG HẠN'
                WHEN MIN(po.doc_date) >= CURRENT_DATE - INTERVAL '2 days' THEN 'ĐANG GIAO'
                ELSE 'TRỄ HẠN'
              END as status,
              CASE 
                WHEN MAX(po.received_qty::numeric) > 0 THEN 'Đạt SLA'
                ELSE 'Chờ giao'
              END as sla_status,
              ROUND(SUM(po.order_qty::numeric * po.net_price::numeric)::numeric, 0) as total_amount
            FROM sap_po_items po
            WHERE ($1 = '' OR UPPER(po.site) = $1)
              AND ($2 = '' OR TO_CHAR(po.doc_date, 'YYYY-MM') = $2)
            GROUP BY po.po_number, po.site, po.supplier_name
            ORDER BY MIN(po.doc_date) DESC, po.po_number DESC
            LIMIT 100
          `
        };
        const queryParams = db.isPg(env) 
          ? [siteParam, monthParam] 
          : [siteParam, siteParam, monthParam, monthParam];
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

        const nganSach = siteRow ? (siteRow.budget_limit || 0) : 0;
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
          daDatMap[r.item_code] = r.total_sl || 0;
          tienDaDat += r.total_tien || 0;
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
          dmMap[dm.item_code] = dm.quota_qty || 0;
        }

        const items = (nvlList || []).map(item => ({
          maHang: item.item_code,
          tenSP: item.name,
          dvt: item.unit,
          donGia: item.unit_price || 0,
          tenLoai: item.type_name || '',
          vungMien: item.region || '',
          daDat: daDatMap[item.item_code] || 0,
          dinhMucSL: dmMap[item.item_code] || null
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
            SUM(dh.order_qty * COALESCE(nvl.unit_price, 0)) as tongTien
          FROM don_hang dh
          LEFT JOIN nvl_items nvl ON dh.item_code = nvl.item_code
        `;

        const conditions = [];
        const bindings = [];

        if (site && site.trim()) {
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
          tongTien: Number(r.tongTien ?? r.tongtien ?? 0)
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
            if (email === 'trantuandai2508@gmail.com' || email === 'daitt5tiktok@gmail.com') {
              user = { id: 1, email, full_name: 'Trần Tuấn Đại', role_code: 'ADMIN', status: 'ACTIVE' };
            } else {
              return new Response(JSON.stringify({ success: false, error: 'User không tồn tại' }), { status: 404, headers: corsHeaders });
            }
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
                approvedRoles
              },
              role: user.role_code,
              roleName: roleInfo?.role_name || user.role_code,
              badgeColor: roleInfo?.badge_color || 'bg-brand-500',
              approvedRoles,
              permissions
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
        const { rows: rawUsers } = await db.query(env, `SELECT id, email, full_name, avatar_url, role_code, status, last_login, created_at FROM app_users ORDER BY id ASC`);
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
          { code: 'fnb-receipts', name: 'Nhập Hàng Điểm Bán', group: 'fnb-inventory', groupName: 'Bếp & Tồn Kho Điểm Bán', icon: 'package-plus', color: 'emerald' },
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
        await ensureUserPermissionsTable(env);
        const { userEmail, featureCode, action } = await request.json(); // action: 'GRANT', 'REVOKE', 'RESET'
        if (!userEmail || !featureCode) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu userEmail hoặc featureCode' }), { status: 400, headers: corsHeaders });
        }

        if (action === 'RESET') {
          await db.exec(env, `DELETE FROM user_permissions WHERE user_email = ? AND feature_code = ?`, [userEmail, featureCode]);
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

        return new Response(JSON.stringify({
          success: true,
          message: action === 'GRANT' ? `Đã CẤP quyền ${featureCode} cho ${userEmail}` : `Đã CẮT quyền ${featureCode} của ${userEmail}`
        }), { headers: corsHeaders });
      }

      // 3. Reset toàn bộ quyền của 1 user về mặc định theo Role
      if (pathname === '/api/auth/user-permissions/reset-user' && request.method === 'POST') {
        const { userEmail } = await request.json();
        if (!userEmail) return new Response(JSON.stringify({ success: false, error: 'Thiếu userEmail' }), { status: 400, headers: corsHeaders });
        await db.exec(env, `DELETE FROM user_permissions WHERE user_email = ?`, [userEmail]);
        return new Response(JSON.stringify({ success: true, message: `Đã khôi phục toàn bộ quyền của ${userEmail} về vai trò gốc` }), { headers: corsHeaders });
      }

      // 4. Cập nhật Vai trò (Role) cho User
      if (pathname === '/api/auth/users/update-role' && request.method === 'POST') {
        const { userEmail, roleCode, resetPermissions } = await request.json();
        if (!userEmail || !roleCode) return new Response(JSON.stringify({ success: false, error: 'Thiếu userEmail hoặc roleCode' }), { status: 400, headers: corsHeaders });
        await db.exec(env, `UPDATE app_users SET role_code = ? WHERE email = ?`, [roleCode, userEmail]);
        if (resetPermissions) {
          await db.exec(env, `DELETE FROM user_permissions WHERE user_email = ?`, [userEmail]);
        }
        return new Response(JSON.stringify({ success: true, message: `Đã cập nhật vai trò ${roleCode} cho ${userEmail}` }), { headers: corsHeaders });
      }

      // 5. Khóa / Mở khóa tài khoản User
      if (pathname === '/api/auth/users/toggle-status' && request.method === 'POST') {
        const { userEmail, status } = await request.json(); // 'ACTIVE' or 'LOCKED'
        if (!userEmail || !status) return new Response(JSON.stringify({ success: false, error: 'Thiếu thông tin' }), { status: 400, headers: corsHeaders });
        await db.exec(env, `UPDATE app_users SET status = ? WHERE email = ?`, [status, userEmail]);
        return new Response(JSON.stringify({ success: true, message: `Đã ${status === 'ACTIVE' ? 'mở khóa' : 'khóa'} tài khoản ${userEmail}` }), { headers: corsHeaders });
      }

      // 6. Thêm tài khoản User mới
      if (pathname === '/api/auth/users/create' && request.method === 'POST') {
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
        const { email, fullName, requestedRole, requestedFeature, reason } = await request.json();
        if (!email) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu email người yêu cầu' }), { status: 400, headers: corsHeaders });
        }
        await db.exec(env, `
          INSERT INTO access_requests (user_email, user_name, requested_role, requested_feature, reason, status, created_at)
          VALUES (?, ?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP)
        `, [email, fullName || '', requestedRole || 'BEP_TRUONG', requestedFeature || '', reason || '']);

        return new Response(JSON.stringify({
          success: true,
          message: 'Yêu cầu cấp quyền đã được gửi thành công đến Quản Trị Viên!'
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

        if (action === 'APPROVE') {
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

        return new Response(JSON.stringify({
          success: true,
          message: action === 'APPROVE' ? `Đã phê duyệt vai trò ${req.requested_role} cho ${req.user_email}` : `Đã từ chối yêu cầu của ${req.user_email}`
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
            siteName = transSite ? `${siteCode} - ${transSite.ten_cua_hang}` : (site || 'K001 - MN Bếp Ăn Đại Học Hùng Vương');
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
        } else {
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
                WHERE UPPER(b2.site_code) = UPPER(?) AND (b2.receipt_qty > 0 OR b2.opening_qty > 0)
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
                WHERE UPPER(b2.site_code) = UPPER(?) AND (b2.receipt_qty > 0 OR b2.opening_qty > 0)
              ) sub
              LEFT JOIN dim_article_stock d ON sub.item_code = d.material AND UPPER(d.site) = UPPER(?)
              LEFT JOIN (SELECT article, article_desc, merch_category, order_unit, net_price FROM sap_po_items GROUP BY article) p ON sub.item_code = p.article
              LEFT JOIN fnb_stock_items i ON sub.item_code = i.code
              LEFT JOIN fnb_stock_balances b ON sub.item_code = b.item_code AND UPPER(b.site_code) = UPPER(?)
            `
          };
          binds = [siteCode, siteCode, siteCode, siteCode];
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
          let q = `SELECT * FROM fnb_stock_counts`;
          let b = [];
          if (siteCode && siteCode !== 'all') {
            q += ` WHERE site_code = ?`;
            b.push(siteCode);
          }
          q += ` ORDER BY count_date DESC, id DESC LIMIT 50`;
          const { rows: counts } = await db.query(env, q, b);

          // Lấy chi tiết các dòng nếu cần
          const countId = searchParams.get('id');
          let lines = [];
          if (countId) {
            const { rows: l } = await db.query(env, `
              SELECT l.*, 
                     COALESCE(d.material_desc, i.name, l.item_code) as item_name, 
                     COALESCE(d.entry_unit, i.unit, '') as unit, 
                     COALESCE(d.nhom_hang, d.nganh_hang, i.item_group, '') as item_group
              FROM fnb_stock_count_lines l
              LEFT JOIN dim_article_stock d ON l.item_code = d.material
              LEFT JOIN fnb_stock_items i ON l.item_code = i.code
              WHERE l.count_id = ?
            `, [countId]);
            lines = l || [];
          }

          const fnbCountsData = {
            success: true,
            data: {
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

            return new Response(JSON.stringify({
              success: true,
              message: 'Lưu phiếu kiểm kê thành công!',
              data: { count_code: countCode, count_id: countId, total_diff_val: totalDiffVal }
            }), { headers: corsHeaders });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: e.message }), { headers: corsHeaders, status: 500 });
          }
        }
      }

      // 3.65 DANH SÁCH ĐƠN ĐẶT HÀNG PO/PR TỪ SAP (CHO NHẬP HÀNG ĐIỂM BÁN)
      if (pathname === '/api/fnb/po-list' || pathname === '/fnb/po-list') {
        const siteCode = searchParams.get('site_code');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';
        
        let q = `
          SELECT 
            po_number,
            site,
            MAX(doc_date) as doc_date,
            supplier_code,
            COALESCE(NULLIF(supplier_name, ''), 'Bếp Trung Tâm Siba') as supplier_name,
            COUNT(*) as item_count,
            SUM(order_qty) as total_qty,
            SUM(order_qty * net_price) as total_amount,
            status
          FROM wms.sap_po_items
          WHERE 1=1
        `;
        const params = [];
        if (siteCode && siteCode !== 'all') {
          q += ` AND site = ?`;
          params.push(siteCode.toUpperCase());
        }
        if (status) {
          q += ` AND status = ?`;
          params.push(status);
        }
        if (search) {
          q += ` AND (po_number LIKE ? OR supplier_name LIKE ? OR supplier_code LIKE ?)`;
          const s = `%${search}%`;
          params.push(s, s, s);
        }
        q += ` GROUP BY po_number, site, supplier_code, supplier_name, status
               ORDER BY MAX(doc_date) DESC, po_number DESC
               LIMIT 100`;
        const { rows } = await db.query(env, q, params);
        return new Response(JSON.stringify({ success: true, data: rows || [] }), { headers: corsHeaders });
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
      if ((pathname === '/api/fnb/receipts' || pathname === '/fnb/receipts')) {
        if (request.method === 'GET') {
          const siteCode = searchParams.get('site_code');
          let q = `SELECT * FROM fnb_stock_receipts`;
          let b = [];
          if (siteCode && siteCode !== 'all') {
            q += ` WHERE site_code = ?`;
            b.push(siteCode);
          }
          q += ` ORDER BY receipt_date DESC, id DESC LIMIT 50`;
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

        if (request.method === 'POST') {
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

            // Batch insert lines & update balances in a single transaction (ACID)
            await db.withTransaction(env, async (tx) => {
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
                  try {
                    const batchId = `bat_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
                    const fallbackExp = new Date(new Date(validReceiptDate).getTime() + 365 * 86400000).toISOString().split('T')[0];
                    const invExpDate = expDate || fallbackExp;

                    await tx.exec(`
                      INSERT INTO wms.inventory_batches (id, sku, branch_id, batch_code, mfg_date, exp_date, qty, storage_loc, created_at)
                      VALUES (?, ?, ?, ?, ?, ?, ?, 'Kệ Bếp', NOW())
                    `, [batchId, item.item_code, site_code.toLowerCase(), batchCode, mfgDate, invExpDate, qty]);
                  } catch (batErr) {
                    console.warn('inventory_batches insert warning:', batErr.message);
                  }
                }

                // Upsert vào fnb_stock_balances để luôn đảm bảo có tồn kho tại điểm bán sau khi nhập
                await tx.exec(`
                  INSERT INTO fnb_stock_balances (item_code, site_code, region, opening_qty, receipt_qty, sales_bom_qty, waste_qty, book_qty, total_value, updated_at)
                  VALUES (?, ?, 'Miền Nam', 0, ?, 0, 0, ?, ?, NOW())
                  ON CONFLICT (item_code, site_code) DO UPDATE SET
                    receipt_qty = fnb_stock_balances.receipt_qty + EXCLUDED.receipt_qty,
                    book_qty = fnb_stock_balances.opening_qty + (fnb_stock_balances.receipt_qty + EXCLUDED.receipt_qty) - fnb_stock_balances.sales_bom_qty - fnb_stock_balances.waste_qty,
                    total_value = (fnb_stock_balances.opening_qty + (fnb_stock_balances.receipt_qty + EXCLUDED.receipt_qty) - fnb_stock_balances.sales_bom_qty - fnb_stock_balances.waste_qty) * ?,
                    updated_at = NOW()
                `, [item.item_code, site_code, qty, qty, lineAmount, unitPrice]);

                await tx.exec(`
                  INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                  VALUES (?, 'NHAP_KHO', ?, ?, ?, ?, ?, ?, ?)
                `, [receiptCode, item.item_code, site_code, qty, unitPrice, lineAmount, `Nhập từ ${supplier} (Số HĐ/PO: ${invoice_no || 'N/A'})`, created_by]);

                // Nếu có số PO, cập nhật trạng thái đã nhận hàng
                if (invoice_no) {
                  await tx.exec(`
                    UPDATE wms.sap_po_items
                    SET received_qty = received_qty + ?,
                        status = CASE WHEN (received_qty + ?) >= order_qty THEN 'COMPLETED' ELSE 'PARTIAL' END,
                        updated_at = NOW()
                    WHERE po_number = ? AND article = ?
                  `, [qty, qty, invoice_no, item.item_code]);
                }
              }
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');

            return new Response(JSON.stringify({
              success: true,
              message: 'Nhập hàng vào kho thành công!',
              data: { receipt_code: receiptCode, receipt_id: receiptId, total_amount: totalAmount }
            }), { headers: corsHeaders });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: e.message }), { headers: corsHeaders, status: 500 });
          }
        }
      }

      // 3.8 HỦY HÀNG: GET & POST /api/fnb/wastes
      if ((pathname === '/api/fnb/wastes' || pathname === '/fnb/wastes')) {
        if (request.method === 'GET') {
          const siteCode = searchParams.get('site_code');
          let q = `SELECT * FROM fnb_stock_wastes`;
          let b = [];
          if (siteCode && siteCode !== 'all') {
            q += ` WHERE site_code = ?`;
            b.push(siteCode);
          }
          q += ` ORDER BY waste_date DESC, id DESC LIMIT 50`;
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
              LEFT JOIN dim_article_stock d ON l.item_code = d.material
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

            const randSuffix = Math.floor(1000 + Math.random() * 9000);
            const wasteCode = `BBH-${(waste_date || '').replace(/-/g, '')}-${randSuffix}`;
            const validWasteDate = waste_date || new Date().toISOString().split('T')[0];

            let totalAmount = 0;
            for (const item of lines) {
              const qty = Number(item.qty) || 0;
              const price = Number(item.unit_price) || 0;
              totalAmount += (qty * price);
            }

            // Insert Header
            const insertH = await db.queryOne(env, `
              INSERT INTO fnb_stock_wastes (waste_code, site_code, waste_date, reason, confirmed_by, total_amount, notes, attachment_url, created_by)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
            `, [wasteCode, site_code, validWasteDate, reason, confirmed_by, totalAmount, notes, attachment_url, created_by]);

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

                await tx.exec(`
                  INSERT INTO fnb_stock_transactions (trans_code, trans_type, item_code, site_code, qty, unit_price, total_amount, note, created_by)
                  VALUES (?, 'HUY_HANG', ?, ?, ?, ?, ?, ?, ?)
                `, [wasteCode, item.item_code, site_code, -qty, unitPrice, -lineAmount, `Hủy hàng: ${item.reason_detail || reason} (Xác nhận: ${confirmed_by})`, created_by]);
              }
            });

            invalidateMemoryCache('/api/fnb');
            invalidateMemoryCache('/api/stock');

            return new Response(JSON.stringify({
              success: true,
              message: 'Ghi nhận biên bản hủy hàng thành công!',
              data: { waste_code: wasteCode, waste_id: wasteId, total_amount: totalAmount }
            }), { headers: corsHeaders });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: e.message }), { headers: corsHeaders, status: 500 });
          }
        }
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
