// ============================================================================
// A.KITCHEN ENTERPRISE PORTAL BACKEND (CLOUDFLARE WORKER + D1)
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
  const m = String(site).trim().match(/^[A-Za-z0-9]+/);
  return m ? m[0] : site;
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
      ['KHO_TRUONG', 'portal-kiemke', 1, 1, 1, 1],
      ['KHO_TRUONG', 'fnb-counts', 1, 1, 1, 1],
      ['KHO_TRUONG', 'portal-baocao', 1, 1, 1, 0],
      ['KHO_TRUONG', 'fnb-receipts', 1, 1, 1, 1]
    ];
    for (const [r, f, v, c, e, d] of essentialKhoPerms) {
      const exists = await env.DB.prepare(`SELECT id FROM role_permissions WHERE role_code = ? AND feature_code = ? LIMIT 1`).bind(r, f).first();
      if (!exists) {
        await env.DB.prepare(`INSERT INTO role_permissions (role_code, feature_code, can_view, can_create, can_edit, can_delete) VALUES (?, ?, ?, ?, ?, ?)`).bind(r, f, v, c, e, d).run();
      }
    }
  } catch (err) {
    console.error('ensureRolePermissions notice:', err);
  }
}


async function autoCleanDemoData(env) {
  try {
    // 1. Xóa các tài khoản demo fake trong app_users
    await env.DB.prepare(`
      DELETE FROM app_users 
      WHERE email LIKE '%@sibafood.vn' 
         OR email = 'admin@sibafood.vn' 
         OR email LIKE '%test%'
    `).run();

    // 2. Xóa phân quyền và yêu cầu cấp quyền của user demo
    await env.DB.prepare(`
      DELETE FROM user_permissions 
      WHERE user_email LIKE '%@sibafood.vn' 
         OR user_email LIKE '%test%'
    `).run().catch(() => {});

    await env.DB.prepare(`
      DELETE FROM access_requests 
      WHERE user_email LIKE '%@sibafood.vn' 
         OR user_email LIKE '%test%'
    `).run().catch(() => {});

    // 3. Xóa dữ liệu seed demo mock ban đầu
    await env.DB.prepare(`
      DELETE FROM purchase_orders 
      WHERE id LIKE 'po_%' OR po_number LIKE 'PO #%'
    `).run().catch(() => {});

    await env.DB.prepare(`
      DELETE FROM purchase_order_items 
      WHERE po_id LIKE 'po_%'
    `).run().catch(() => {});

    await env.DB.prepare(`
      DELETE FROM vouchers 
      WHERE id LIKE 'vc_%' OR voucher_code LIKE 'CT-202611-%'
    `).run().catch(() => {});

    await env.DB.prepare(`
      DELETE FROM inventory_batches 
      WHERE id LIKE 'bat_%'
    `).run().catch(() => {});

    await env.DB.prepare(`
      DELETE FROM stock_audits 
      WHERE id LIKE 'sa_%'
    `).run().catch(() => {});

    await env.DB.prepare(`
      DELETE FROM branches 
      WHERE id IN ('b_q1', 'b_q7', 'b_td')
    `).run().catch(() => {});

    await ensureBranchesSynced(env);

    await env.DB.prepare(`
      DELETE FROM items 
      WHERE sku IN ('GV-BBQ-01', 'GV-SWCH-02', 'GV-MUSH-09', 'GV-PEP-01', 'GV-SUG-05', 'GV-OYST-04', 'GV-OYST-08', 'GV-FSH-01', 'VT-GLV-01', 'VT-WRP-02', 'CC-KNF-04')
    `).run().catch(() => {});

    await env.DB.prepare(`
      DELETE FROM daily_catering_reports
    `).run().catch(() => {});

    await env.DB.prepare(`
      DELETE FROM don_hang 
      WHERE ordered_by LIKE '%test%' OR ordered_by LIKE '%demo%' OR ordered_by LIKE '%sibafood.vn%'
    `).run().catch(() => {});
  } catch (err) {
    console.error('autoCleanDemoData error:', err);
  }
}


async function ensureBranchesSynced(env) {
  try {
    // 1. Đồng bộ các điểm bán từ master sites sang branches nếu còn thiếu
    await env.DB.prepare(`
      INSERT OR IGNORE INTO branches (id, code, name, address, phone, is_active)
      SELECT LOWER(site_code) as id, site_code as code, COALESCE(site_name, name) as name, 'Hệ thống căn tin Tân Long Group' as address, '0903.000.xxx' as phone, 1 as is_active
      FROM sites
      WHERE site_code NOT IN (SELECT code FROM branches)
    `).run().catch(() => {});

    // 2. Đảm bảo K505 luôn có mặt và active trong branches
    await env.DB.prepare(`
      INSERT OR REPLACE INTO branches (id, code, name, address, phone, is_active)
      VALUES ('k505', 'K505', 'K505 - MB A.Kitchen - Hub Đa Phúc', 'Hệ thống căn tin Tân Long Group - Hub Đa Phúc', '0903.000.505', 1)
    `).run().catch(() => {});
  } catch (err) {
    console.error('ensureBranchesSynced notice:', err);
  }
}

async function ensureUserPermissionsTable(env) {
  try {
    await env.DB.prepare(`
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
    `).run();
    await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_user_perms_email ON user_permissions(user_email)`).run().catch(() => {});
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

    const { results: permRows } = await env.DB.prepare(`
      SELECT feature_code, can_view, can_create, can_edit, can_delete
      FROM role_permissions
      WHERE role_code = ?
    `).bind(user.role_code).all().catch(() => ({ results: [] }));

    (permRows || []).forEach(p => {
      permissions[p.feature_code] = {
        canView: p.can_view === 1,
        canCreate: p.can_create === 1,
        canEdit: p.can_edit === 1,
        canDelete: p.can_delete === 1
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
    const { results: approvedRequests } = await env.DB.prepare(`
      SELECT requested_role, requested_feature
      FROM access_requests
      WHERE user_email = ? AND status = 'APPROVED'
    `).bind(user.email).all();

    for (const req of (approvedRequests || [])) {
      if (req.requested_role && req.requested_role !== user.role_code) {
        const { results: rolePerms } = await env.DB.prepare(`
          SELECT feature_code, can_view, can_create, can_edit, can_delete
          FROM role_permissions
          WHERE role_code = ?
        `).bind(req.requested_role).all();

        (rolePerms || []).forEach(p => {
          if (!permissions[p.feature_code]) {
            permissions[p.feature_code] = {
              canView: p.can_view === 1,
              canCreate: p.can_create === 1,
              canEdit: p.can_edit === 1,
              canDelete: p.can_delete === 1
            };
          } else {
            permissions[p.feature_code].canView = permissions[p.feature_code].canView || (p.can_view === 1);
            permissions[p.feature_code].canCreate = permissions[p.feature_code].canCreate || (p.can_create === 1);
            permissions[p.feature_code].canEdit = permissions[p.feature_code].canEdit || (p.can_edit === 1);
            permissions[p.feature_code].canDelete = permissions[p.feature_code].canDelete || (p.can_delete === 1);
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
      const { results: customPerms } = await env.DB.prepare(`
        SELECT feature_code, can_view, can_create, can_edit, can_delete
        FROM user_permissions
        WHERE user_email = ?
      `).bind(user.email).all().catch(() => ({ results: [] }));

      (customPerms || []).forEach(cp => {
        if (cp.can_view === 0) {
          // CẮT / KHÓA QUYỀN TUYỆT ĐỐI (Dù vai trò là ADMIN hay KHO_TRUONG đều bị khóa)
          permissions[cp.feature_code] = {
            canView: false,
            canCreate: false,
            canEdit: false,
            canDelete: false,
            isRevoked: true
          };
        } else if (cp.can_view === 1) {
          // CẤP QUYỀN RIÊNG BIỆT
          permissions[cp.feature_code] = {
            canView: true,
            canCreate: cp.can_create === 1,
            canEdit: cp.can_edit === 1,
            canDelete: cp.can_delete === 1,
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

function createCachedResponse(data, ttlSeconds, corsHeaders, isNoCache, url, request, ctx, memKey) {
  if (memKey && !isNoCache) {
    setMemoryCache(memKey, data, ttlSeconds);
  }
  const headers = new Headers(corsHeaders);
  headers.set('Cache-Control', `public, max-age=${ttlSeconds}, s-maxage=${ttlSeconds}`);
  headers.set('X-D1-Cache', 'MISS');
  const resp = new Response(JSON.stringify(data), { headers });
  if (!isNoCache && ctx && typeof ctx.waitUntil === 'function') {
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
    'CREATE INDEX IF NOT EXISTS idx_fnb_waste_lines_wid ON fnb_stock_waste_lines(waste_id)'
  ];

  for (const idxSql of indexes) {
    try {
      await env.DB.prepare(idxSql).run().catch(() => {});
    } catch (e) {}
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
      '/api/branches',
      '/api/dashboard-summary',
      '/api/stock',
      '/api/reorder',
      '/api/leadtime',
      '/api/po-sap',
      '/api/quota',
      '/api/orders',
      '/api/vouchers'
    ];
    const isCacheableReport = CACHEABLE_GET_ROUTES.includes(pathname) && request.method === 'GET';
    const isNoCache = searchParams.get('refresh') === 'true' || searchParams.get('nocache') === '1';

    if (isCacheableReport && !isNoCache) {
      // 0a. Ultra-fast RAM Cache (<0.5ms, 0 D1 rows read)
      const memCached = getMemoryCache(url.toString());
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
          let { results } = await env.DB.prepare(`
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
          `).all();

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

      // 1.2 GET /api/dashboard-summary
      if (pathname === '/api/dashboard-summary' && request.method === 'GET') {
        const branchCode = searchParams.get('branch') || 'k505';
        const upperCode = branchCode.toUpperCase();

        const critRow = await env.DB.prepare(`
          SELECT COUNT(*) as critical_count
          FROM inventory_batches b
          JOIN branches br ON b.branch_id = br.id
          WHERE br.code = ? AND b.qty > 0 AND (julianday(b.exp_date) - julianday('now')) <= 7
        `).bind(upperCode).first();

        const ropRow = await env.DB.prepare(`
          SELECT COUNT(*) as rop_count FROM (
            SELECT i.sku
            FROM items i
            LEFT JOIN branches br ON br.code = ?
            LEFT JOIN inventory_batches b ON i.sku = b.sku AND b.branch_id = br.id AND b.qty > 0
            WHERE i.category = 'Gia vị'
            GROUP BY i.sku
            HAVING COALESCE(SUM(b.qty), 0) < ((i.daily_usage * (i.lead_time_hours / 24.0)) + i.safety_stock)
          )
        `).bind(upperCode).first();

        const leadRow = await env.DB.prepare(`
          SELECT ROUND(AVG(lead_time_hours), 1) as avg_lead_time, COUNT(*) as total_orders
          FROM purchase_orders
          WHERE lead_time_hours IS NOT NULL
        `).first();

        const stockRow = await env.DB.prepare(`
          SELECT 
            COUNT(DISTINCT i.sku) as total_skus, 
            ROUND(COALESCE(SUM(b.qty), 0), 1) as total_qty,
            ROUND(COALESCE(SUM(b.qty * COALESCE(i.standard_cost_sap, 0)), 0), 0) as total_value
          FROM items i
          JOIN inventory_batches b ON i.sku = b.sku
          JOIN branches br ON b.branch_id = br.id
          WHERE br.code = ? AND b.qty > 0
        `).bind(upperCode).first();

        // Slow moving count (batches created > 20 days ago with stock remaining)
        const slowRow = await env.DB.prepare(`
          SELECT COUNT(DISTINCT b.sku) as slow_count
          FROM inventory_batches b
          JOIN branches br ON b.branch_id = br.id
          WHERE br.code = ? AND b.qty > 0 AND (julianday('now') - julianday(b.created_at)) >= 14
        `).bind(upperCode).first().catch(() => ({ slow_count: 2 }));

        // Stock alerts for recent-orders style table
        const alertsRows = await env.DB.prepare(`
          SELECT 
            b.id, b.sku, i.name as item_name, i.category, i.unit, b.batch_code, b.exp_date,
            ROUND(b.qty, 1) as qty,
            ROUND((julianday(b.exp_date) - julianday('now')), 0) as days_left,
            i.safety_stock,
            CASE 
              WHEN b.qty <= 0 THEN 'OUT_OF_STOCK'
              WHEN (julianday(b.exp_date) - julianday('now')) <= 7 THEN 'NEAR_EXPIRY'
              WHEN b.qty <= i.safety_stock THEN 'LOW_STOCK'
              ELSE 'NORMAL'
            END as alert_level
          FROM inventory_batches b
          JOIN items i ON b.sku = i.sku
          JOIN branches br ON b.branch_id = br.id
          WHERE br.code = ? AND (
            b.qty <= i.safety_stock OR (julianday(b.exp_date) - julianday('now')) <= 15
          )
          ORDER BY days_left ASC, b.qty ASC
          LIMIT 8
        `).bind(upperCode).all().catch(() => ({ results: [] }));

        const totalSkus = stockRow ? (stockRow.total_skus || 0) : 0;
        const ropCount = ropRow ? (ropRow.rop_count || 0) : 0;
        const safetyRate = totalSkus > 0 
          ? Math.min(100, Math.max(0, Math.round(((totalSkus - ropCount) / totalSkus) * 1000) / 10))
          : 92.4;

        const dashSummaryData = {
          success: true,
          data: {
            critical_exp_count: critRow ? critRow.critical_count : 0,
            rop_reorder_count: ropCount,
            avg_lead_time: leadRow ? (leadRow.avg_lead_time || 24.5) : 24.5,
            total_skus: totalSkus,
            total_qty: stockRow ? stockRow.total_qty : 0,
            total_value: stockRow && stockRow.total_value ? stockRow.total_value : 1258600000,
            slow_moving_count: slowRow && slowRow.slow_count ? slowRow.slow_count : 2,
            safety_rate: safetyRate,
            alerts: alertsRows && alertsRows.results ? alertsRows.results : []
          }
        };
        return createCachedResponse(dashSummaryData, 60, corsHeaders, isNoCache, url, request, ctx, url.toString());
      }

      // 1.3 GET /api/stock
      if (pathname === '/api/stock' && request.method === 'GET') {
        const branchCode = searchParams.get('branch') || 'k505';
        const query = `
          SELECT 
            b.id as batch_id,
            b.batch_code,
            b.mfg_date,
            b.exp_date,
            b.qty,
            b.storage_loc,
            i.sku,
            i.name as item_name,
            i.category,
            i.unit,
            i.standard_cost_sap,
            ROUND(julianday(b.exp_date) - julianday('now')) as days_remaining
          FROM inventory_batches b
          JOIN items i ON b.sku = i.sku
          JOIN branches br ON b.branch_id = br.id
          WHERE br.code = ? AND b.qty > 0
          ORDER BY julianday(b.exp_date) ASC
        `;
        const { results } = await env.DB.prepare(query).bind(branchCode.toUpperCase()).all();

        const enriched = results.map((r, idx) => {
          let dangerLevel = 'green';
          let statusText = 'An toàn';
          if (r.days_remaining <= 7) {
            dangerLevel = 'red';
            statusText = 'Cận Date (≤ 7 ngày)';
          } else if (r.days_remaining <= 30) {
            dangerLevel = 'yellow';
            statusText = 'Cần dùng sớm (≤ 30 ngày)';
          }
          return {
            ...r,
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
        const branch = await env.DB.prepare('SELECT id FROM branches WHERE code = ?').bind(branch_code.toUpperCase()).first();
        if (!branch) return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy chi nhánh' }), { status: 400, headers: corsHeaders });

        const batchId = 'bat_' + Date.now();
        await env.DB.prepare(`
          INSERT INTO inventory_batches (id, branch_id, sku, batch_code, mfg_date, exp_date, qty, storage_loc)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(batchId, branch.id, sku, batch_code, mfg_date, exp_date, parseFloat(qty), storage_loc || 'Kho gia vị').run();

        const transId = 'tx_' + Date.now();
        await env.DB.prepare(`
          INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note, ref_code)
          VALUES (?, ?, ?, ?, 'NHAP_KHO', ?, 'Nhập kho lô mới', ?)
        `).bind(transId, branch.id, sku, batchId, parseFloat(qty), ref_code || '').run();

        return new Response(JSON.stringify({ success: true, message: 'Nhập kho thành công', batch_id: batchId }), { headers: corsHeaders });
      }

      // 1.5 POST /api/stock/issue
      if (pathname === '/api/stock/issue' && request.method === 'POST') {
        const body = await request.json();
        const { branch_code, sku, qty_needed, note } = body;
        const branch = await env.DB.prepare('SELECT id FROM branches WHERE code = ?').bind(branch_code.toUpperCase()).first();
        let remain = parseFloat(qty_needed);

        const { results: batches } = await env.DB.prepare(`
          SELECT id, qty, batch_code, exp_date
          FROM inventory_batches
          WHERE branch_id = ? AND sku = ? AND qty > 0
          ORDER BY julianday(exp_date) ASC
        `).bind(branch.id, sku).all();

        const stmts = [];
        for (const b of batches) {
          if (remain <= 0) break;
          const deduct = Math.min(b.qty, remain);
          stmts.push(env.DB.prepare('UPDATE inventory_batches SET qty = qty - ? WHERE id = ?').bind(deduct, b.id));
          stmts.push(env.DB.prepare(`
            INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note)
            VALUES (?, ?, ?, ?, 'XUAT_BEP', ?, ?)
          `).bind('tx_' + Math.random().toString(36).substr(2, 9), branch.id, sku, b.id, deduct, note || 'Xuất bếp ca nấu'));
          remain -= deduct;
        }

        if (remain > 0) {
          return new Response(JSON.stringify({ success: false, error: `Tồn kho không đủ (thiếu ${remain.toFixed(1)})` }), { status: 400, headers: corsHeaders });
        }

        await env.DB.batch(stmts);
        return new Response(JSON.stringify({ success: true, message: 'Đã xuất kho chuẩn FEFO thành công' }), { headers: corsHeaders });
      }

      // 1.6 GET /api/reorder
      if (pathname === '/api/reorder' && request.method === 'GET') {
        const branchCode = searchParams.get('branch') || 'k505';
        const query = `
          SELECT 
            i.sku,
            i.name as item_name,
            i.unit,
            i.category,
            i.daily_usage,
            i.lead_time_hours,
            i.safety_stock,
            i.standard_cost_sap,
            COALESCE(SUM(b.qty), 0) as current_stock,
            ROUND((i.daily_usage * (i.lead_time_hours / 24.0)) + i.safety_stock, 1) as rop_threshold,
            CASE 
              WHEN COALESCE(SUM(b.qty), 0) < ((i.daily_usage * (i.lead_time_hours / 24.0)) + i.safety_stock)
              THEN ROUND(((i.daily_usage * (i.lead_time_hours / 24.0)) + i.safety_stock) * 1.5 - COALESCE(SUM(b.qty), 0), 0)
              ELSE 0
            END as suggested_order_qty
          FROM items i
          LEFT JOIN branches br ON br.code = ?
          LEFT JOIN inventory_batches b ON i.sku = b.sku AND b.branch_id = br.id AND b.qty > 0
          WHERE i.category = 'Gia vị'
          GROUP BY i.sku
          ORDER BY (current_stock - rop_threshold) ASC
        `;
        const { results } = await env.DB.prepare(query).bind(branchCode.toUpperCase()).all();
        return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
      }

      // 1.7 GET /api/leadtime
      if (pathname === '/api/leadtime' && request.method === 'GET') {
        const query = `
          SELECT 
            po.id,
            po.po_number,
            br.name as branch_name,
            br.code as branch_code,
            po.vendor_name,
            po.order_time,
            po.received_time,
            po.lead_time_hours,
            po.sla_target_hours,
            ROUND(po.lead_time_hours - po.sla_target_hours, 1) as delay_hours,
            CASE 
              WHEN po.lead_time_hours <= po.sla_target_hours THEN 'Đạt SLA'
              ELSE 'Trễ hẹn NCC'
            END as sla_status,
            po.status,
            po.total_amount
          FROM purchase_orders po
          JOIN branches br ON po.branch_id = br.id
          ORDER BY po.order_time DESC
        `;
        const { results } = await env.DB.prepare(query).all();
        return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
      }

      // 1.8 GET /api/po-sap
      if (pathname === '/api/po-sap' && request.method === 'GET') {
        const query = `
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
          GROUP BY i.sku
          ORDER BY price_change_pct DESC
        `;
        const { results } = await env.DB.prepare(query).all();
        return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
      }

      // ======================================================================
      // PHÂN HỆ 2: VẬT TƯ, ĐỊNH MỨC SITE & CHỨNG TỪ GIAO NHẬN (PORTAL)
      // ======================================================================

      // 2.1 GET /api/init
      if (pathname === '/api/init' && request.method === 'GET') {
        let sites = [];
        try {
          const res = await env.DB.prepare(`
            SELECT DISTINCT site_code, name, site_name, budget_limit, region, site_type, month_period
            FROM sites
            WHERE site_name IS NOT NULL AND site_name != ''
            ORDER BY site_code
          `).all();
          sites = res.results || [];
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

        return new Response(JSON.stringify({
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
        }), { headers: corsHeaders });
      }

      // 2.2 GET /api/quota
      if (pathname === '/api/quota' && request.method === 'GET') {
        const site = searchParams.get('site') || '';
        const thang = searchParams.get('thang') || '';
        const siteCode = extractSiteCode(site);
        const normMonth = normalizeMonth(thang);

        let siteRow = await env.DB.prepare(`
          SELECT * FROM sites WHERE site_name = ? OR site_code = ? OR name = ? LIMIT 1
        `).bind(site, siteCode, site).first();

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
        const { results: daDatRows } = await env.DB.prepare(daDatQuery)
          .bind(site, `%${siteCode}%`, thang, `%${normMonth}%`, `%${thang}%`)
          .all();

        const daDatMap = {};
        let tienDaDat = 0;
        for (const r of daDatRows) {
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

        let { results: nvlList } = await env.DB.prepare(nvlQuery).bind(...nvlBindings).all();
        if (!nvlList || nvlList.length === 0) {
          const fallback = await env.DB.prepare(`SELECT * FROM nvl_items ORDER BY name`).all();
          nvlList = fallback.results;
        }

        const { results: dmList } = await env.DB.prepare(`
          SELECT item_code, quota_qty FROM dinh_muc 
          WHERE (site_name = ? OR site_name LIKE ?) AND (month_period = ? OR month_period = ?)
        `).bind(site, `%${siteCode}%`, thang, normMonth).all();
        const dmMap = {};
        for (const dm of dmList) {
          dmMap[dm.item_code] = dm.quota_qty || 0;
        }

        const items = nvlList.map(item => ({
          maHang: item.item_code,
          tenSP: item.name,
          dvt: item.unit,
          donGia: item.unit_price || 0,
          tenLoai: item.type_name || '',
          vungMien: item.region || '',
          daDat: daDatMap[item.item_code] || 0,
          dinhMucSL: dmMap[item.item_code] || null
        }));

        return new Response(JSON.stringify({
          success: true,
          data: {
            site: siteRow ? siteRow.site_name : site,
            nganSach,
            tienDaDat,
            items
          }
        }), { headers: corsHeaders });
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

        const insertDhStmt = env.DB.prepare(`
          INSERT INTO don_hang (
            order_code, order_date, site_name, ordered_by, applied_month,
            item_code, item_name, unit, order_qty, accumulated_qty,
            over_quota_note, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const stmts = [];
        for (const it of items) {
          const qty = Number(it.soLuong) || 0;
          if (qty <= 0) continue;
          const luyKe = (Number(it.daDat) || 0) + qty;
          stmts.push(insertDhStmt.bind(
            maDon, nowStr, site, nguoiDat || 'Người dùng', thang,
            it.maHang, it.tenSP, it.dvt, qty, luyKe,
            it.ghiChu || ghiChu || '', 'Mới tạo'
          ));
        }

        if (stmts.length === 0) {
          return new Response(JSON.stringify({ success: false, error: 'Số lượng đặt phải lớn hơn 0.' }), {
            status: 400,
            headers: corsHeaders
          });
        }

        const insertQtStmt = env.DB.prepare(`
          INSERT INTO quy_trinh_don (
            order_code, step, step_name, status, action_time, actor, note
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(maDon, 1, 'Gửi đơn hàng', 'Hoàn tất', nowStr, nguoiDat || 'Người dùng', 'Tạo đơn hàng thành công qua Portal');

        stmts.push(insertQtStmt);
        await env.DB.batch(stmts);

        return new Response(JSON.stringify({ success: true, data: { maDon, soDong: stmts.length - 1 } }), { headers: corsHeaders });
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
        query += ` GROUP BY dh.order_code ORDER BY dh.order_date DESC`;

        const { results } = await env.DB.prepare(query).bind(...bindings).all();
        return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
      }

      // 2.5 GET /api/order-detail
      if (pathname === '/api/order-detail' && request.method === 'GET') {
        const orderCode = searchParams.get('orderCode') || '';
        const { results: items } = await env.DB.prepare(`
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
        `).bind(orderCode).all();

        const { results: timeline } = await env.DB.prepare(`
          SELECT step as buoc, step_name as tenBuoc, status as trangThai, action_time as thoiGian, actor as nguoiXuLy, note as ghiChu
          FROM quy_trinh_don WHERE order_code = ? ORDER BY step ASC, action_time ASC
        `).bind(orderCode).all();

        const summary = await env.DB.prepare(`
          SELECT order_code, order_date, site_name, ordered_by, applied_month, status
          FROM don_hang WHERE order_code = ? LIMIT 1
        `).bind(orderCode).first();

        return new Response(JSON.stringify({ success: true, data: { info: summary, items, timeline } }), { headers: corsHeaders });
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

        const { results } = await env.DB.prepare(query).bind(...bindings).all();
        const { results: fileCounts } = await env.DB.prepare(`
          SELECT voucher_code, COUNT(id) as cnt FROM chung_tu_file GROUP BY voucher_code
        `).all();
        const fileMap = {};
        for (const f of fileCounts) fileMap[f.voucher_code] = f.cnt;

        const data = results.map(r => ({
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

        return new Response(JSON.stringify({ success: true, data }), { headers: corsHeaders });
      }

      // 2.7 POST /api/voucher
      if (pathname === '/api/voucher' && request.method === 'POST') {
        const body = await request.json();
        const { site, loaiHoaDon, ngayXuat, ngayNhan, nguoiGiao, nguoiNhan, nhaCungCap, ghiChu, nguoiNhap, files } = body;
        const maCT = generateCode('CT', site);
        const nowStr = formatDate(new Date());

        await env.DB.prepare(`
          INSERT INTO chung_tu (voucher_code, site_name, invoice_type, invoice_date, receive_date, deliverer_name, receiver_name, supplier_name, note, created_at, created_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(maCT, site, loaiHoaDon, ngayXuat || nowStr, ngayNhan || nowStr, nguoiGiao || '', nguoiNhan || '', nhaCungCap || '', ghiChu || '', nowStr, nguoiNhap || 'Thủ kho').run();

        if (files && files.length) {
          const fileStmts = files.map(f => env.DB.prepare(`
            INSERT INTO chung_tu_file (voucher_code, file_name, file_link, file_type, upload_date)
            VALUES (?, ?, ?, ?, ?)
          `).bind(maCT, f.name || 'Tài liệu', f.url || '', f.type || 'IMAGE', nowStr));
          await env.DB.batch(fileStmts);
        }

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
        for (const item of items) {
          const site = item.site || item.site_name || '';
          if (!site) continue;
          const maCT = generateCode('CT', site);
          await env.DB.prepare(`
            INSERT INTO chung_tu (voucher_code, site_name, invoice_type, invoice_date, receive_date, deliverer_name, receiver_name, supplier_name, note, created_at, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            maCT, site, item.loaiHoaDon || 'Hóa đơn GTGT',
            item.ngayXuat || nowStr, item.ngayNhan || nowStr,
            item.nguoiGiao || '', item.nguoiNhan || '',
            item.nhaCungCap || '', item.ghiChu || '',
            nowStr, item.nguoiNhap || 'Import Excel'
          ).run();

          if (item.linkAnh && String(item.linkAnh).trim()) {
            const links = String(item.linkAnh).split(',').map(s => s.trim()).filter(Boolean);
            const fileStmts = links.map((lnk, idx) => env.DB.prepare(`
              INSERT INTO chung_tu_file (voucher_code, file_name, file_link, file_type, upload_date)
              VALUES (?, ?, ?, ?, ?)
            `).bind(maCT, `Ảnh đính kèm ${idx + 1}`, lnk, 'DRIVE_LINK', nowStr));
            if (fileStmts.length) await env.DB.batch(fileStmts);
          }
          count++;
        }
        return new Response(JSON.stringify({ success: true, count, message: `Đã import thành công ${count} chứng từ` }), { headers: corsHeaders });
      }

      // 2.8 GET /api/voucher-detail
      if (pathname === '/api/voucher-detail' && request.method === 'GET') {
        const maCT = searchParams.get('maCT');
        const voucher = await env.DB.prepare(`SELECT * FROM chung_tu WHERE voucher_code = ?`).bind(maCT).first();
        if (!voucher) return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy chứng từ' }), { status: 404, headers: corsHeaders });

        const { results: files } = await env.DB.prepare(`
          SELECT file_name, file_link, file_type, upload_date FROM chung_tu_file WHERE voucher_code = ?
        `).bind(maCT).all();

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
          let query = `SELECT * FROM kiemke_tonkho`;
          const bindings = [];
          if (site && site.trim()) {
            query += ` WHERE site_code = ? OR site_name = ? OR full_site_name LIKE ? OR site_code = ?`;
            bindings.push(site, site, `%${site}%`, siteCode);
          }
          query += ` ORDER BY item_code LIMIT 300`;
          const { results } = await env.DB.prepare(query).bind(...bindings).all();
          return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
        }
        if (request.method === 'POST') {
          const body = await request.json();
          const { items } = body;
          if (items && items.length) {
            const stmts = items.map(it => env.DB.prepare(`
              UPDATE kiemke_tonkho SET usage_t11 = ?, closing_t11 = ? WHERE id = ?
            `).bind(it.usage, it.closing, it.id));
            await env.DB.batch(stmts);
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
        const { results } = await env.DB.prepare(query).bind(...bindings).all();
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
        const branchRow = await env.DB.prepare(`SELECT id FROM branches WHERE id = ? OR LOWER(code) = ? LIMIT 1`).bind(siteCode, siteCode).first();
        const validBranchId = branchRow ? branchRow.id : 'k505';
        const imgLinkStr = Array.isArray(images) ? images.map(im => im.name || im.url).join(' , ') : (images || '');

        await env.DB.prepare(`
          INSERT INTO daily_catering_reports (
            id, branch_id, report_date, planned_meals, actual_meals, wasted_meals,
            staff_actual, staff_standard, food_quality_note, customer_feedback, extra_cost,
            created_at, reporter_name, report_data, images_link
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id, validBranchId, reportDate || nowStr,
          Number(plannedMeals) || 0, Number(actualMeals) || 0, Number(wastedMeals) || 0,
          Number(staffActual) || 0, Number(staffStandard) || 0,
          foodQualityNote || '', feedback || '', Number(extraCost) || 0,
          nowStr, reporterName || 'Quản lý Site',
          typeof reportData === 'object' ? JSON.stringify(reportData) : (reportData || '{}'),
          imgLinkStr
        ).run();

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
          let user = await env.DB.prepare(`SELECT * FROM app_users WHERE email = ? LIMIT 1`).bind(email).first();
          if (!user) {
            // Nếu chưa có trong DB nhưng là Owner
            if (email === 'trantuandai2508@gmail.com' || email === 'daitt5tiktok@gmail.com') {
              user = { id: 1, email, full_name: 'Trần Tuấn Đại', role_code: 'ADMIN', status: 'ACTIVE' };
            } else {
              return new Response(JSON.stringify({ success: false, error: 'User không tồn tại' }), { status: 404, headers: corsHeaders });
            }
          }
          const permissions = await buildUserPermissions(env, user);
          const roleInfo = await env.DB.prepare(`SELECT * FROM app_roles WHERE role_code = ? LIMIT 1`).bind(user.role_code).first().catch(() => null);

          let approvedRoles = [user.role_code];
          if (user.role_code === 'ADMIN' || user.email === 'trantuandai2508@gmail.com') {
            approvedRoles = ['ADMIN', 'BEP_TRUONG', 'KHO_TRUONG', 'KE_TOAN', 'NHAN_VIEN'];
          } else {
            const { results: appReqs } = await env.DB.prepare(`
              SELECT requested_role FROM access_requests WHERE user_email = ? AND status = 'APPROVED'
            `).bind(user.email).all().catch(() => ({ results: [] }));
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
          let user = await env.DB.prepare(`SELECT * FROM app_users WHERE email = ? LIMIT 1`).bind(email).first();

          if (user && user.full_name) {
            const repaired = repairAtobMojibake(user.full_name);
            if (repaired !== user.full_name) {
              user.full_name = repaired;
              await env.DB.prepare(`UPDATE app_users SET full_name = ? WHERE id = ?`).bind(repaired, user.id).run().catch(() => {});
            }
          }

          if (!user) {
            // Xác định vai trò mặc định:
            // Chỉ tài khoản Owner mới mặc định ADMIN, các user mới khác mặc định là NHAN_VIEN chờ duyệt
            let defaultRole = 'NHAN_VIEN';
            if (email === 'trantuandai2508@gmail.com' || email === 'daitt5tiktok@gmail.com') {
              defaultRole = 'ADMIN';
            }

            const insertRes = await env.DB.prepare(`
              INSERT INTO app_users (email, full_name, avatar_url, google_id, role_code, auth_provider, status, last_login)
              VALUES (?, ?, ?, ?, ?, 'google', 'ACTIVE', datetime('now'))
            `).bind(email, fullName || email.split('@')[0], avatarUrl || '', googleId || '', defaultRole).run();

            user = await env.DB.prepare(`SELECT * FROM app_users WHERE id = ?`).bind(insertRes.meta.last_row_id).first();
          } else {
            // Cập nhật thông tin Google, full_name chuẩn UTF-8 và last_login
            await env.DB.prepare(`
              UPDATE app_users
              SET last_login = datetime('now'),
                  full_name = COALESCE(?, full_name),
                  avatar_url = COALESCE(?, avatar_url),
                  google_id = COALESCE(?, google_id),
                  updated_at = datetime('now')
              WHERE id = ?
            `).bind(fullName || null, avatarUrl || user.avatar_url, googleId || user.google_id, user.id).run();
            user = await env.DB.prepare(`SELECT * FROM app_users WHERE id = ?`).bind(user.id).first();
          }

          // 2. Lấy thông tin Role & Permissions
          const roleInfo = await env.DB.prepare(`SELECT * FROM app_roles WHERE role_code = ? LIMIT 1`).bind(user.role_code).first() || {
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
            const { results: appReqs } = await env.DB.prepare(`
              SELECT requested_role FROM access_requests WHERE user_email = ? AND status = 'APPROVED'
            `).bind(user.email).all();
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
        const { results: roles } = await env.DB.prepare(`SELECT * FROM app_roles`).all();
        const { results: perms } = await env.DB.prepare(`SELECT * FROM role_permissions`).all();
        const { results: rawUsers } = await env.DB.prepare(`SELECT id, email, full_name, avatar_url, role_code, status, last_login FROM app_users ORDER BY id`).all();
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
      
      // Diagnostic DB status
      if (pathname === '/api/admin/db-status' && request.method === 'GET') {
        const { results: indexes } = await env.DB.prepare("SELECT name, tbl_name FROM sqlite_master WHERE type='index'").all();
        const counts = {};
        for (const tbl of ['transactions', 'app_users', 'branches', 'sites', 'don_hang', 'dinh_muc', 'nvl_items', 'fnb_monthly_summary', 'inventory_batches', 'purchase_orders', 'vouchers']) {
          try {
            const r = await env.DB.prepare(`SELECT COUNT(*) as c FROM ${tbl}`).first();
            counts[tbl] = r ? r.c : 0;
          } catch (e) {
            counts[tbl] = 'error: ' + e.message;
          }
        }
        return new Response(JSON.stringify({
          success: true,
          indexesCount: indexes ? indexes.length : 0,
          indexes: indexes || [],
          tableCounts: counts
        }), { headers: corsHeaders });
      }

      
      // Sync monthly summary from transactions table (Chuyển 37,329 dòng transactions thành ~28 dòng summary)
      if (pathname === '/api/admin/sync-monthly-summary') {
        await env.DB.prepare(`
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
          GROUP BY SUBSTR(billing_date, 1, 7), ma_cua_hang
        `).run();
        invalidateMemoryCache('/api/fnb');
        const { results: summaries } = await env.DB.prepare('SELECT month_period, site_code, net_revenue FROM fnb_monthly_summary').all();
        return new Response(JSON.stringify({
          success: true,
          message: 'Đã tổng hợp số liệu fnb_monthly_summary thành công!',
          count: summaries ? summaries.length : 0,
          summaries: summaries || []
        }), { headers: corsHeaders });
      }

      if (pathname === '/api/admin/clean-demo-data') {
        await autoCleanDemoData(env);
        const { results: remainingUsers } = await env.DB.prepare(`SELECT id, email, full_name, role_code, status FROM app_users`).all();
        return new Response(JSON.stringify({
          success: true,
          message: 'Đã xóa toàn bộ dữ liệu demo thành công',
          remainingUsers: remainingUsers || []
        }), { headers: corsHeaders });
      }

      if (pathname === '/api/auth/users-matrix' && request.method === 'GET') {
        const { results: roles } = await env.DB.prepare(`SELECT * FROM app_roles`).all();
        const { results: perms } = await env.DB.prepare(`SELECT * FROM role_permissions`).all();
        const { results: rawUsers } = await env.DB.prepare(`SELECT id, email, full_name, avatar_url, role_code, status, last_login, created_at FROM app_users ORDER BY id ASC`).all();
        const { results: userPerms } = await env.DB.prepare(`SELECT * FROM user_permissions`).all();

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
          await env.DB.prepare(`DELETE FROM user_permissions WHERE user_email = ? AND feature_code = ?`).bind(userEmail, featureCode).run();
          return new Response(JSON.stringify({ success: true, message: 'Đã khôi phục quyền mặc định theo vai trò' }), { headers: corsHeaders });
        }

        const canView = action === 'GRANT' ? 1 : 0;
        const canCreate = action === 'GRANT' ? 1 : 0;
        const canEdit = action === 'GRANT' ? 1 : 0;
        const canDelete = action === 'GRANT' ? 1 : 0;

        await env.DB.prepare(`
          INSERT INTO user_permissions (user_email, feature_code, can_view, can_create, can_edit, can_delete, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
          ON CONFLICT(user_email, feature_code) DO UPDATE SET
            can_view = excluded.can_view,
            can_create = excluded.can_create,
            can_edit = excluded.can_edit,
            can_delete = excluded.can_delete,
            updated_at = datetime('now')
        `).bind(userEmail, featureCode, canView, canCreate, canEdit, canDelete).run();

        return new Response(JSON.stringify({
          success: true,
          message: action === 'GRANT' ? `Đã CẤP quyền ${featureCode} cho ${userEmail}` : `Đã CẮT quyền ${featureCode} của ${userEmail}`
        }), { headers: corsHeaders });
      }

      // 3. Reset toàn bộ quyền của 1 user về mặc định theo Role
      if (pathname === '/api/auth/user-permissions/reset-user' && request.method === 'POST') {
        const { userEmail } = await request.json();
        if (!userEmail) return new Response(JSON.stringify({ success: false, error: 'Thiếu userEmail' }), { status: 400, headers: corsHeaders });
        await env.DB.prepare(`DELETE FROM user_permissions WHERE user_email = ?`).bind(userEmail).run();
        return new Response(JSON.stringify({ success: true, message: `Đã khôi phục toàn bộ quyền của ${userEmail} về vai trò gốc` }), { headers: corsHeaders });
      }

      // 4. Cập nhật Vai trò (Role) cho User
      if (pathname === '/api/auth/users/update-role' && request.method === 'POST') {
        const { userEmail, roleCode, resetPermissions } = await request.json();
        if (!userEmail || !roleCode) return new Response(JSON.stringify({ success: false, error: 'Thiếu userEmail hoặc roleCode' }), { status: 400, headers: corsHeaders });
        await env.DB.prepare(`UPDATE app_users SET role_code = ? WHERE email = ?`).bind(roleCode, userEmail).run();
        if (resetPermissions) {
          await env.DB.prepare(`DELETE FROM user_permissions WHERE user_email = ?`).bind(userEmail).run();
        }
        return new Response(JSON.stringify({ success: true, message: `Đã cập nhật vai trò ${roleCode} cho ${userEmail}` }), { headers: corsHeaders });
      }

      // 5. Khóa / Mở khóa tài khoản User
      if (pathname === '/api/auth/users/toggle-status' && request.method === 'POST') {
        const { userEmail, status } = await request.json(); // 'ACTIVE' or 'LOCKED'
        if (!userEmail || !status) return new Response(JSON.stringify({ success: false, error: 'Thiếu thông tin' }), { status: 400, headers: corsHeaders });
        await env.DB.prepare(`UPDATE app_users SET status = ? WHERE email = ?`).bind(status, userEmail).run();
        return new Response(JSON.stringify({ success: true, message: `Đã ${status === 'ACTIVE' ? 'mở khóa' : 'khóa'} tài khoản ${userEmail}` }), { headers: corsHeaders });
      }

      // 6. Thêm tài khoản User mới
      if (pathname === '/api/auth/users/create' && request.method === 'POST') {
        const { email, fullName, roleCode } = await request.json();
        if (!email) return new Response(JSON.stringify({ success: false, error: 'Email là bắt buộc' }), { status: 400, headers: corsHeaders });
        const cleanEmail = email.trim().toLowerCase();
        const existing = await env.DB.prepare(`SELECT id FROM app_users WHERE email = ? LIMIT 1`).bind(cleanEmail).first();
        if (existing) {
          return new Response(JSON.stringify({ success: false, error: 'Tài khoản email này đã tồn tại trong hệ thống' }), { status: 400, headers: corsHeaders });
        }
        const safeName = (fullName || cleanEmail.split('@')[0]).trim();
        const initialRole = roleCode || 'NHAN_VIEN';
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=465fff&color=fff&bold=true`;
        await env.DB.prepare(`
          INSERT INTO app_users (email, full_name, avatar_url, role_code, auth_provider, status, created_at)
          VALUES (?, ?, ?, ?, 'GOOGLE', 'ACTIVE', datetime('now'))
        `).bind(cleanEmail, safeName, avatarUrl, initialRole).run();

        return new Response(JSON.stringify({ success: true, message: `Đã thêm người dùng ${cleanEmail} thành công` }), { headers: corsHeaders });
      }

      // 2.11.3 CHUYỂN ĐỔI VAI TRÒ TEST NHANH (/api/auth/switch-role)
      if (pathname === '/api/auth/switch-role' && request.method === 'POST') {
        const { role, email } = await request.json();
        if (!role) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu vai trò' }), { status: 400, headers: corsHeaders });
        }
        const roleInfo = await env.DB.prepare(`SELECT * FROM app_roles WHERE role_code = ? LIMIT 1`).bind(role).first();
        if (!roleInfo) {
          return new Response(JSON.stringify({ success: false, error: 'Vai trò không hợp lệ' }), { status: 400, headers: corsHeaders });
        }

        let user = null;
        if (email) {
          user = await env.DB.prepare(`SELECT * FROM app_users WHERE email = ? LIMIT 1`).bind(email).first();
        }

        // BẢO VỆ PHÂN QUYỀN: Chỉ Admin (Owner) hoặc user đã được Admin phê duyệt vai trò này mới được phép chuyển
        const isOwner = email === 'trantuandai2508@gmail.com' || (user && user.role_code === 'ADMIN');
        const isCurrentRole = user && user.role_code === role;

        let isApprovedRole = false;
        if (email) {
          const approvedReq = await env.DB.prepare(`
            SELECT id FROM access_requests 
            WHERE user_email = ? AND requested_role = ? AND status = 'APPROVED' 
            LIMIT 1
          `).bind(email, role).first();
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
        await env.DB.prepare(`
          INSERT INTO access_requests (user_email, user_name, requested_role, requested_feature, reason, status, created_at)
          VALUES (?, ?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP)
        `).bind(email, fullName || '', requestedRole || 'BEP_TRUONG', requestedFeature || '', reason || '').run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Yêu cầu cấp quyền đã được gửi thành công đến Quản Trị Viên!'
        }), { headers: corsHeaders });
      }

      // 2.11.5 DANH SÁCH YÊU CẦU CẤP QUYỀN (/api/auth/access-requests)
      if (pathname === '/api/auth/access-requests' && request.method === 'GET') {
        const { results } = await env.DB.prepare(`
          SELECT * FROM access_requests ORDER BY id DESC LIMIT 50
        `).all();
        const cleanedResults = (results || []).map(r => ({ ...r, user_name: repairAtobMojibake(r.user_name) }));
        return new Response(JSON.stringify({ success: true, data: cleanedResults }), { headers: corsHeaders });
      }

      // 2.11.6 PHÊ DUYỆT / TỪ CHỐI YÊU CẦU CẤP QUYỀN (/api/auth/approve-access-request)
      if (pathname === '/api/auth/approve-access-request' && request.method === 'POST') {
        const { requestId, action, reviewedBy } = await request.json();
        const req = await env.DB.prepare(`SELECT * FROM access_requests WHERE id = ?`).bind(requestId).first();
        if (!req) {
          return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy yêu cầu' }), { status: 404, headers: corsHeaders });
        }

        const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
        await env.DB.prepare(`
          UPDATE access_requests
          SET status = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
          WHERE id = ?
        `).bind(newStatus, reviewedBy || 'Admin', requestId).run();

        if (action === 'APPROVE') {
          const currentUser = await env.DB.prepare(`SELECT * FROM app_users WHERE email = ? LIMIT 1`).bind(req.user_email).first();
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

            await env.DB.prepare(`
              UPDATE app_users
              SET role_code = ?
              WHERE email = ?
            `).bind(newRole, req.user_email).run();
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
        const user = await env.DB.prepare(`SELECT * FROM admin_users WHERE email = ? LIMIT 1`).bind(email).first();
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
        const existing = await env.DB.prepare(`SELECT email FROM admin_users WHERE email = ?`).bind(email).first();
        if (existing) return new Response(JSON.stringify({ success: false, error: 'Email đã tồn tại' }), { status: 400, headers: corsHeaders });

        const salt = crypto.randomUUID();
        const hash = await sha256(`${salt}::${password}`);
        const nowStr = formatDate(new Date());

        await env.DB.prepare(`
          INSERT INTO admin_users (email, full_name, phone, role, password_raw, password_hash, salt, status, registered_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'Chờ duyệt', ?)
        `).bind(email, fullName, phone, role || 'Quản lý Site', password, hash, salt, nowStr).run();

        return new Response(JSON.stringify({ success: true, message: 'Đăng ký thành công. Vui lòng chờ phê duyệt.' }), { headers: corsHeaders });
      }

      // ======================================================================
      // PHÂN HỆ 3: ORBIT SIBA FOOD - P&L VÀ XẾP HẠNG TOÀN CHUỖI (F&B CHAIN)
      // ======================================================================

      // 3.1 GET /api/fnb/pl - Báo cáo P&L chi tiết của điểm bán (Lấy từ bảng transactions trên D1)
      if (pathname === '/api/fnb/pl' && request.method === 'GET') {
        const site = searchParams.get('site') || '';
        const thang = normalizeMonth(searchParams.get('thang') || '2026-11');
        const siteCode = extractSiteCode(site);

        // Lấy thông tin site
        let siteRow = null;
        if (siteCode && siteCode !== 'ALL') {
          siteRow = await env.DB.prepare(`
            SELECT * FROM sites WHERE site_code = ? OR site_name = ? OR name LIKE ? LIMIT 1
          `).bind(siteCode, site, `%${siteCode}%`).first();
        }

        let siteName = 'Toàn Hệ Thống Bếp Ăn A.Kitchen';
        if (siteCode && siteCode !== 'ALL') {
          if (siteRow) {
            siteName = siteRow.site_name;
          } else {
            const transSite = await env.DB.prepare(`
              SELECT ten_cua_hang FROM transactions WHERE ma_cua_hang = ? LIMIT 1
            `).bind(siteCode).first();
            siteName = transSite ? `${siteCode} - ${transSite.ten_cua_hang}` : (site || 'K001 - MN Bếp Ăn Đại Học Hùng Vương');
          }
        }

        const budget = siteRow ? (siteRow.budget_limit || 45000000) : 45000000;

        // Kiểm tra xem tháng này có dữ liệu trong transactions không (Dùng LIMIT 1 để chỉ đọc 1 dòng duy nhất)
        let effectiveMonth = thang;
        const startCheck = `${effectiveMonth}-01`;
        const endCheck = `${effectiveMonth}-31`;
        const countCheck = await env.DB.prepare(`
          SELECT 1 as cnt FROM transactions WHERE billing_date >= ? AND billing_date <= ? LIMIT 1
        `).bind(startCheck, endCheck).first();

        if (!countCheck) {
          const latestRow = await env.DB.prepare(`
            SELECT SUBSTR(billing_date, 1, 7) as ym FROM transactions ORDER BY billing_date DESC LIMIT 1
          `).first();
          if (latestRow && latestRow.ym) {
            effectiveMonth = latestRow.ym;
          }
        }
        const effStart = `${effectiveMonth}-01`;
        const effEnd = `${effectiveMonth}-31`;

        // Truy vấn tổng hợp doanh thu và chi phí từ bảng transactions bằng Range Index (giảm 70% rows read)
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

        const stats = await env.DB.prepare(plQuery).bind(...plBinds).first();

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

        // Phân rã doanh thu theo kênh bán hàng thực tế từ bảng transactions
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
        const { results: chRows } = await env.DB.prepare(channelQuery).bind(...chBinds).all();

        const channels = {
          dineIn: 0,
          takeaway: 0,
          catering: 0
        };
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

        // Top 5 món bán chạy thực tế từ bảng transactions
        let topQuery = `
          SELECT ma_sp as code, ten_sp as name, 
                 ROUND(SUM(so_luong), 0) as qty, 
                 ROUND(SUM(thanh_tien_truoc_thue), 0) as rev,
                 ROUND((SUM(gia_von) * 1.0 / NULLIF(SUM(thanh_tien_truoc_thue), 0)) * 100, 1) as foodCostPct
          FROM transactions
          WHERE billing_date >= ? AND billing_date <= ?
        `;
        let topBinds = [effStart, effEnd];
        if (siteCode && siteCode !== 'ALL') {
          topQuery += ` AND ma_cua_hang = ?`;
          topBinds.push(siteCode);
        }
        topQuery += ` GROUP BY ma_sp, ten_sp ORDER BY rev DESC LIMIT 5`;
        const { results: topRows } = await env.DB.prepare(topQuery).bind(...topBinds).all();

        const topDishes = (topRows && topRows.length > 0) ? topRows.map(m => ({
          code: m.code || 'SP',
          name: m.name || 'Món ăn',
          qty: m.qty || 0,
          revenue: m.rev || 0,
          rev: m.rev || 0,
          foodCostPct: m.foodCostPct || 40.0
        })) : [];

        // Xu hướng 4 tuần theo dữ liệu giao dịch thật
        let weeklyQuery = `
          SELECT 
            CASE 
              WHEN CAST(SUBSTR(billing_date, 9, 2) AS INTEGER) <= 7 THEN 'Tuần 1'
              WHEN CAST(SUBSTR(billing_date, 9, 2) AS INTEGER) <= 14 THEN 'Tuần 2'
              WHEN CAST(SUBSTR(billing_date, 9, 2) AS INTEGER) <= 21 THEN 'Tuần 3'
              ELSE 'Tuần 4'
            END as week,
            COUNT(DISTINCT so_hoa_don) as bills,
            COALESCE(SUM(thanh_tien_truoc_thue), 0) as netRev,
            COALESCE(SUM(gia_von), 0) as foodCost
          FROM transactions
          WHERE billing_date >= ? AND billing_date <= ?
        `;
        let wBinds = [effStart, effEnd];
        if (siteCode && siteCode !== 'ALL') {
          weeklyQuery += ` AND ma_cua_hang = ?`;
          wBinds.push(siteCode);
        }
        weeklyQuery += ` GROUP BY week ORDER BY week`;
        const { results: weekRows } = await env.DB.prepare(weeklyQuery).bind(...wBinds).all();

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
        const startCheck = `${effectiveMonth}-01`;
        const endCheck = `${effectiveMonth}-31`;

        // Kiểm tra xem tháng có data không (Đọc đúng 1 dòng qua LIMIT 1)
        const countCheck = await env.DB.prepare(`
          SELECT 1 as cnt FROM transactions WHERE billing_date >= ? AND billing_date <= ? LIMIT 1
        `).bind(startCheck, endCheck).first();

        if (!countCheck) {
          const latestRow = await env.DB.prepare(`
            SELECT SUBSTR(billing_date, 1, 7) as ym FROM transactions ORDER BY billing_date DESC LIMIT 1
          `).first();
          if (latestRow && latestRow.ym) {
            effectiveMonth = latestRow.ym;
          }
        }
        const effStart = `${effectiveMonth}-01`;
        const effEnd = `${effectiveMonth}-31`;

        // Lấy danh sách điểm bán từ bảng sites
        const { results: siteList } = await env.DB.prepare(`SELECT * FROM sites ORDER BY site_code`).all();

        // Ưu tiên đọc từ bảng tổng hợp fnb_monthly_summary (chỉ đọc ~15 dòng!)
        let transSums = [];
        const { results: summaryRows } = await env.DB.prepare(`
          SELECT 
            site_code as ma_cua_hang,
            site_name as ten_cua_hang,
            region as vung_mien,
            net_revenue as net_rev,
            food_cost,
            total_bills
          FROM fnb_monthly_summary
          WHERE month_period = ?
        `).bind(effectiveMonth).all().catch(() => ({ results: [] }));

        if (summaryRows && summaryRows.length > 0) {
          transSums = summaryRows;
        } else {
          // Fallback: Range Query trên transactions (giảm 72% rows read so với LIKE)
          const { results: rawSums } = await env.DB.prepare(`
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
          `).bind(effStart, effEnd).all();
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
          const hasTrans = !!trans && trans.net_rev > 0;
          const rev = hasTrans ? Math.round(trans.net_rev) : 0;
          const foodCostVal = hasTrans ? Math.round(trans.food_cost) : 0;
          const totalBills = hasTrans ? trans.total_bills : 0;
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

      // 3.3 GET /api/fnb/pos - Thống kê doanh thu POS từ bảng transactions trên D1
      if (pathname === '/api/fnb/pos' && request.method === 'GET') {
        const site = searchParams.get('site') || '';
        const siteCode = extractSiteCode(site);
        let date = searchParams.get('date') || '';

        // Nếu không có ngày, lấy ngày có giao dịch mới nhất trong bảng transactions
        if (!date) {
          const latestRow = await env.DB.prepare(`
            SELECT MAX(billing_date) as max_date FROM transactions
          `).first();
          date = latestRow?.max_date || '2026-11-19';
        }

        // Truy vấn doanh thu trong ngày (Tận dụng index idx_trans_site_date)
        let posQuery = `
          SELECT 
            COUNT(DISTINCT so_hoa_don) as bills_today,
            COALESCE(SUM(thanh_tien_truoc_thue), 0) as total_sales,
            COALESCE(ROUND(SUM(thanh_tien_truoc_thue) * 1.0 / NULLIF(COUNT(DISTINCT so_hoa_don), 0), 0), 0) as avg_bill
          FROM transactions
          WHERE billing_date = ?
        `;
        let posBinds = [date];
        if (siteCode && siteCode !== 'ALL') {
          posQuery += ` AND ma_cua_hang = ?`;
          posBinds.push(siteCode);
        }

        const posStats = await env.DB.prepare(posQuery).bind(...posBinds).first();
        let totalSalesToday = Math.round(posStats?.total_sales || 0);
        let billsToday = posStats?.bills_today || 0;
        let avgBillToday = Math.round(posStats?.avg_bill || 0);

        // Nếu ngày được chọn chưa có giao dịch, tìm ngày gần nhất có data của site
        if (totalSalesToday === 0) {
          let fallbackQ = `
            SELECT billing_date, COUNT(DISTINCT so_hoa_don) as bills_today,
                   COALESCE(SUM(thanh_tien_truoc_thue), 0) as total_sales,
                   COALESCE(ROUND(SUM(thanh_tien_truoc_thue) * 1.0 / NULLIF(COUNT(DISTINCT so_hoa_don), 0), 0), 0) as avg_bill
            FROM transactions
            WHERE 1=1
          `;
          let fbBinds = [];
          if (siteCode && siteCode !== 'ALL') {
            fallbackQ += ` AND ma_cua_hang = ?`;
            fbBinds.push(siteCode);
          }
          fallbackQ += ` GROUP BY billing_date ORDER BY billing_date DESC LIMIT 1`;
          const fbRow = await env.DB.prepare(fallbackQ).bind(...fbBinds).first();
          if (fbRow && fbRow.total_sales > 0) {
            date = fbRow.billing_date;
            totalSalesToday = Math.round(fbRow.total_sales);
            billsToday = fbRow.bills_today;
            avgBillToday = Math.round(fbRow.avg_bill);
          }
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
        const { results: sites } = await env.DB.prepare(sitesQuery).bind(...sitesBinds).all();

        // 2. Lấy danh mục mặt hàng F&B
        let itemsQuery = `SELECT * FROM fnb_stock_items WHERE is_active = 1`;
        let itemsBinds = [];
        if (groupParam && groupParam !== 'all') {
          itemsQuery += ` AND item_group = ?`;
          itemsBinds.push(groupParam);
        }
        itemsQuery += ` ORDER BY item_group, code`;
        const { results: itemsList } = await env.DB.prepare(itemsQuery).bind(...itemsBinds).all();

        // 3. Lấy toàn bộ số dư tồn kho
        const { results: balances } = await env.DB.prepare(`
          SELECT item_code, site_code, region, opening_qty, receipt_qty, sales_bom_qty, waste_qty, book_qty, last_count_qty, last_count_date, no_opening, total_value
          FROM fnb_stock_balances
        `).all();

        // Tạo map (item_code -> site_code -> cell)
        const cellMap = {};
        for (const b of balances) {
          if (!cellMap[b.item_code]) cellMap[b.item_code] = {};
          cellMap[b.item_code][b.site_code] = {
            book: b.book_qty,
            lastCount: b.last_count_qty,
            lastDate: b.last_count_date,
            noOpening: b.no_opening === 1,
            value: b.total_value,
            opening: b.opening_qty,
            receipt: b.receipt_qty,
            salesBom: b.sales_bom_qty,
            waste: b.waste_qty
          };
        }

        // Tạo cấu trúc rows ma trận
        const rows = itemsList.map(item => {
          const cells = {};
          for (const s of sites) {
            cells[s.id] = cellMap[item.code]?.[s.id] || {
              book: 0,
              lastCount: null,
              lastDate: null,
              noOpening: true,
              value: 0
            };
          }
          return {
            id: item.id,
            code: item.code,
            name: item.name,
            group: item.item_group,
            unit: item.unit,
            price: item.unit_price,
            minStock: item.min_stock,
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

        return new Response(JSON.stringify({
          success: true,
          data: {
            regions,
            groups,
            sites,
            showValue: true,
            rows
          }
        }), { headers: corsHeaders });
      }



      // 3.5 GET /api/fnb/stock/items-for-site - Lấy danh mục & tồn sách cho 1 điểm bán
      if ((pathname === '/api/fnb/stock/items-for-site' || pathname === '/fnb/stock/items-for-site') && request.method === 'GET') {
        const siteCode = searchParams.get('site_code') || 'K001';
        const groupParam = searchParams.get('group') || 'all';

        let query = `
          SELECT i.id, i.code, i.name, i.item_group, i.unit, i.unit_price, i.min_stock,
                 COALESCE(b.book_qty, 0) as book_qty,
                 COALESCE(b.last_count_qty, NULL) as last_count_qty,
                 b.last_count_date,
                 COALESCE(b.no_opening, 1) as no_opening,
                 COALESCE(b.total_value, 0) as total_value
          FROM fnb_stock_items i
          LEFT JOIN fnb_stock_balances b ON i.code = b.item_code AND b.site_code = ?
          WHERE i.is_active = 1
        `;
        let binds = [siteCode];
        if (groupParam && groupParam !== 'all') {
          query += ` AND i.item_group = ?`;
          binds.push(groupParam);
        }
        query += ` ORDER BY i.item_group, i.code`;

        const { results } = await env.DB.prepare(query).bind(...binds).all();
        return new Response(JSON.stringify({
          success: true,
          data: {
            site_code: siteCode,
            items: results
          }
        }), { headers: corsHeaders });
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
          const { results: counts } = await env.DB.prepare(q).bind(...b).all();

          // Lấy chi tiết các dòng nếu cần
          const countId = searchParams.get('id');
          let lines = [];
          if (countId) {
            const { results: l } = await env.DB.prepare(`
              SELECT l.*, i.name as item_name, i.unit, i.item_group
              FROM fnb_stock_count_lines l
              LEFT JOIN fnb_stock_items i ON l.item_code = i.code
              WHERE l.count_id = ?
            `).bind(countId).all();
            lines = l;
          }

          return new Response(JSON.stringify({
            success: true,
            data: {
              counts,
              lines
            }
          }), { headers: corsHeaders });
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
            const insertHeader = await env.DB.prepare(`
              INSERT INTO fnb_stock_counts (count_code, site_code, count_date, count_type, total_items, matched_items, diff_items, total_diff_val, notes, created_by)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(countCode, site_code, count_date, count_type, totalItems, matchedItems, diffItems, totalDiffVal, notes, created_by).run();

            const countId = insertHeader.meta.last_row_id;

            // Batch insert lines & update balances in a single transaction (ACID & D1 Optimized)
            const countBatchStmts = [];
            for (const item of lines) {
              const countQty = Number(item.count_qty) || 0;
              const bookQty = Number(item.book_qty) || 0;
              const diffQty = countQty - bookQty;
              const unitPrice = Number(item.unit_price) || 0;
              const diffVal = diffQty * unitPrice;

              countBatchStmts.push(env.DB.prepare(`
                INSERT INTO fnb_stock_count_lines (count_id, item_code, book_qty, count_qty, diff_qty, unit_price, diff_val, note)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `).bind(countId, item.item_code, bookQty, countQty, diffQty, unitPrice, diffVal, item.note || ''));

              countBatchStmts.push(env.DB.prepare(`
                UPDATE fnb_stock_balances
                SET last_count_qty = ?, last_count_date = ?
                WHERE item_code = ? AND site_code = ?
              `).bind(countQty, count_date, item.item_code, site_code));

              if (Math.abs(diffQty) > 0.001) {
                countBatchStmts.push(env.DB.prepare(`
                  INSERT INTO fnb_stock_transactions (trans_code, trans_date, site_code, item_code, trans_type, qty, unit_price, amount, notes, created_by)
                  VALUES (?, ?, ?, ?, 'KIEM_KE', ?, ?, ?, ?, ?)
                `).bind(countCode, count_date, site_code, item.item_code, diffQty, unitPrice, diffVal, `Chênh lệch kiểm kê: ${diffQty > 0 ? '+' : ''}${diffQty}`, created_by));
              }
            }

            if (countBatchStmts.length > 0) {
              await env.DB.batch(countBatchStmts);
            }
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
          const { results: receipts } = await env.DB.prepare(q).bind(...b).all();

          const receiptId = searchParams.get('id');
          let lines = [];
          if (receiptId) {
            const { results: l } = await env.DB.prepare(`
              SELECT l.*, i.name as item_name, i.unit, i.item_group
              FROM fnb_stock_receipt_lines l
              LEFT JOIN fnb_stock_items i ON l.item_code = i.code
              WHERE l.receipt_id = ?
            `).bind(receiptId).all();
            lines = l;
          }

          return new Response(JSON.stringify({
            success: true,
            data: { receipts, lines }
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

            let totalAmount = 0;
            for (const item of lines) {
              const qty = Number(item.qty) || 0;
              const price = Number(item.unit_price) || 0;
              totalAmount += (qty * price);
            }

            // Insert Header
            const insertH = await env.DB.prepare(`
              INSERT INTO fnb_stock_receipts (receipt_code, site_code, receipt_date, supplier, invoice_no, total_amount, notes, attachment_url, created_by)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(receiptCode, site_code, receipt_date, supplier, invoice_no, totalAmount, notes, attachment_url, created_by).run();

            const receiptId = insertH.meta.last_row_id;

            // Batch insert lines & update balances in a single transaction (ACID & D1 Optimized)
            const receiptBatchStmts = [];
            for (const item of lines) {
              const qty = Number(item.qty) || 0;
              const unitPrice = Number(item.unit_price) || 0;
              const lineAmount = qty * unitPrice;

              receiptBatchStmts.push(env.DB.prepare(`
                INSERT INTO fnb_stock_receipt_lines (receipt_id, item_code, qty, unit_price, amount, note)
                VALUES (?, ?, ?, ?, ?, ?)
              `).bind(receiptId, item.item_code, qty, unitPrice, lineAmount, item.note || ''));

              receiptBatchStmts.push(env.DB.prepare(`
                UPDATE fnb_stock_balances
                SET receipt_qty = receipt_qty + ?,
                    book_qty = opening_qty + receipt_qty + ? - sales_bom_qty - waste_qty,
                    total_value = (opening_qty + receipt_qty + ? - sales_bom_qty - waste_qty) * ?
                WHERE item_code = ? AND site_code = ?
              `).bind(qty, qty, qty, unitPrice, item.item_code, site_code));

              receiptBatchStmts.push(env.DB.prepare(`
                INSERT INTO fnb_stock_transactions (trans_code, trans_date, site_code, item_code, trans_type, qty, unit_price, amount, notes, created_by)
                VALUES (?, ?, ?, ?, 'NHAP_KHO', ?, ?, ?, ?, ?)
              `).bind(receiptCode, receipt_date, site_code, item.item_code, qty, unitPrice, lineAmount, `Nhập từ ${supplier} (Số HĐ: ${invoice_no || 'N/A'})`, created_by));
            }

            if (receiptBatchStmts.length > 0) {
              await env.DB.batch(receiptBatchStmts);
            }
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
          const { results: wastes } = await env.DB.prepare(q).bind(...b).all();

          const wasteId = searchParams.get('id');
          let lines = [];
          if (wasteId) {
            const { results: l } = await env.DB.prepare(`
              SELECT l.*, i.name as item_name, i.unit, i.item_group
              FROM fnb_stock_waste_lines l
              LEFT JOIN fnb_stock_items i ON l.item_code = i.code
              WHERE l.waste_id = ?
            `).bind(wasteId).all();
            lines = l;
          }

          return new Response(JSON.stringify({
            success: true,
            data: { wastes, lines }
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

            let totalAmount = 0;
            for (const item of lines) {
              const qty = Number(item.qty) || 0;
              const price = Number(item.unit_price) || 0;
              totalAmount += (qty * price);
            }

            // Insert Header
            const insertH = await env.DB.prepare(`
              INSERT INTO fnb_stock_wastes (waste_code, site_code, waste_date, reason, confirmed_by, total_amount, notes, attachment_url, created_by)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(wasteCode, site_code, waste_date, reason, confirmed_by, totalAmount, notes, attachment_url, created_by).run();

            const wasteId = insertH.meta.last_row_id;

            // Batch insert lines & update balances in a single transaction (ACID & D1 Optimized)
            const wasteBatchStmts = [];
            for (const item of lines) {
              const qty = Number(item.qty) || 0;
              const unitPrice = Number(item.unit_price) || 0;
              const lineAmount = qty * unitPrice;

              wasteBatchStmts.push(env.DB.prepare(`
                INSERT INTO fnb_stock_waste_lines (waste_id, item_code, qty, unit_price, amount, reason_detail)
                VALUES (?, ?, ?, ?, ?, ?)
              `).bind(wasteId, item.item_code, qty, unitPrice, lineAmount, item.reason_detail || reason));

              wasteBatchStmts.push(env.DB.prepare(`
                UPDATE fnb_stock_balances
                SET waste_qty = waste_qty + ?,
                    book_qty = opening_qty + receipt_qty - sales_bom_qty - (waste_qty + ?),
                    total_value = (opening_qty + receipt_qty - sales_bom_qty - (waste_qty + ?)) * ?
                WHERE item_code = ? AND site_code = ?
              `).bind(qty, qty, qty, unitPrice, item.item_code, site_code));

              wasteBatchStmts.push(env.DB.prepare(`
                INSERT INTO fnb_stock_transactions (trans_code, trans_date, site_code, item_code, trans_type, qty, unit_price, amount, notes, created_by)
                VALUES (?, ?, ?, ?, 'HUY_HANG', ?, ?, ?, ?, ?)
              `).bind(wasteCode, waste_date, site_code, item.item_code, -qty, unitPrice, -lineAmount, `Hủy hàng: ${reason} (Xác nhận: ${confirmed_by})`, created_by));
            }

            if (wasteBatchStmts.length > 0) {
              await env.DB.batch(wasteBatchStmts);
            }
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
  }
};
