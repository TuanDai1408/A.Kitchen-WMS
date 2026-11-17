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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json; charset=utf-8'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // ======================================================================
      // PHÂN HỆ 1: QUẢN LÝ KHO GIA VỊ, FEFO & VẬN HÀNH BẾP (WMS)
      // ======================================================================

      // 1.1 GET /api/branches
      if (pathname === '/api/branches' && request.method === 'GET') {
        const { results } = await env.DB.prepare(`
          SELECT * FROM branches WHERE is_active = 1 ORDER BY code
        `).all();
        return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
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
          SELECT COUNT(DISTINCT i.sku) as total_skus, ROUND(COALESCE(SUM(b.qty), 0), 1) as total_qty
          FROM items i
          JOIN inventory_batches b ON i.sku = b.sku
          JOIN branches br ON b.branch_id = br.id
          WHERE br.code = ? AND b.qty > 0
        `).bind(upperCode).first();

        return new Response(JSON.stringify({
          success: true,
          data: {
            critical_exp_count: critRow ? critRow.critical_count : 0,
            rop_reorder_count: ropRow ? ropRow.rop_count : 0,
            avg_lead_time: leadRow ? (leadRow.avg_lead_time || 24.5) : 24.5,
            total_skus: stockRow ? stockRow.total_skus : 0,
            total_qty: stockRow ? stockRow.total_qty : 0
          }
        }), { headers: corsHeaders });
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

        return new Response(JSON.stringify({ success: true, data: enriched }), { headers: corsHeaders });
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
        const { results: sites } = await env.DB.prepare(`
          SELECT DISTINCT site_code, name, site_name, budget_limit, region, site_type, month_period
          FROM sites
          WHERE site_name IS NOT NULL AND site_name != ''
          ORDER BY site_code
        `).all();

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

        return new Response(JSON.stringify({ success: true, data: { ...voucher, files } }), { headers: corsHeaders });
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

      // 2.10 POST /api/report & /api/daily-report
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
        const siteVal = site || branchCode || 'K001';
        const imgLinkStr = Array.isArray(images) ? images.map(im => im.name || im.url).join(' , ') : (images || '');

        await env.DB.prepare(`
          INSERT INTO daily_catering_reports (
            id, branch_id, report_date, planned_meals, actual_meals, wasted_meals,
            staff_actual, staff_standard, food_quality_note, customer_feedback, extra_cost,
            created_at, reporter_name, report_data, images_link
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id, siteVal, reportDate || nowStr,
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

      // Fallback: Static Assets
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }

      return new Response(JSON.stringify({ error: 'Endpoint Not Found' }), { status: 404, headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
    }
  }
};
