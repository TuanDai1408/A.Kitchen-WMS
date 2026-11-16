// ============================================================================
// A.KITCHEN • VẬT TƯ & CHỨNG TỪ — CLOUDFLARE WORKER BACKEND (D1 DATABASE)
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
      // ----------------------------------------------------------------------
      // 1. GET /api/init - Dữ liệu khởi tạo hệ thống
      // ----------------------------------------------------------------------
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

      // ----------------------------------------------------------------------
      // 2. GET /api/quota - Tải định mức, ngân sách & lũy kế của Site
      // ----------------------------------------------------------------------
      if (pathname === '/api/quota' && request.method === 'GET') {
        const site = searchParams.get('site') || '';
        const thang = searchParams.get('thang') || '';

        // Lấy thông tin site
        let siteRow = await env.DB.prepare(`
          SELECT * FROM sites WHERE site_name = ? LIMIT 1
        `).bind(site).first();

        if (!siteRow) {
          siteRow = await env.DB.prepare(`
            SELECT * FROM sites WHERE site_code = ? OR name = ? LIMIT 1
          `).bind(site, site).first();
        }

        const nganSach = siteRow ? (siteRow.budget_limit || 0) : 0;
        const region = siteRow ? siteRow.region : '';

        // Lấy lũy kế đã đặt từ các đơn hàng trước (không tính đơn hủy/xóa)
        const daDatQuery = `
          SELECT 
            dh.item_code,
            SUM(dh.order_qty) as total_sl,
            SUM(dh.order_qty * COALESCE(nvl.unit_price, 0)) as total_tien
          FROM don_hang dh
          LEFT JOIN nvl_items nvl ON dh.item_code = nvl.item_code
          WHERE dh.site_name = ? 
            AND dh.status NOT IN ('Đã xóa', 'Đã hủy')
            AND (dh.applied_month = ? OR dh.applied_month LIKE ? OR dh.applied_month LIKE ?)
          GROUP BY dh.item_code
        `;
        const { results: daDatRows } = await env.DB.prepare(daDatQuery)
          .bind(site, thang, `%${thang}%`, `${thang.split('/').reverse().join('-')}%`)
          .all();

        const daDatMap = {};
        let tienDaDat = 0;
        for (const r of daDatRows) {
          daDatMap[r.item_code] = r.total_sl || 0;
          tienDaDat += r.total_tien || 0;
        }

        // Lấy danh mục NVL (ưu tiên vùng miền của site, nếu không có lấy toàn bộ)
        let nvlQuery = `SELECT * FROM nvl_items`;
        let nvlBindings = [];
        if (region) {
          nvlQuery += ` WHERE region = ? OR region IS NULL OR region = '' ORDER BY name`;
          nvlBindings = [region];
        } else {
          nvlQuery += ` ORDER BY name`;
        }

        const { results: nvlList } = await env.DB.prepare(nvlQuery).bind(...nvlBindings).all();

        // Lấy định mức số lượng riêng nếu có trong bảng dinh_muc
        const { results: dmList } = await env.DB.prepare(`
          SELECT item_code, quota_qty FROM dinh_muc WHERE site_name = ? AND month_period = ?
        `).bind(site, thang).all();
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

      // ----------------------------------------------------------------------
      // 3. POST /api/order - Tạo đơn hàng mới
      // ----------------------------------------------------------------------
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
            maDon,
            nowStr,
            site,
            nguoiDat || 'Người dùng',
            thang,
            it.maHang,
            it.tenSP,
            it.dvt,
            qty,
            luyKe,
            it.ghiChu || ghiChu || '',
            'Mới tạo'
          ));
        }

        if (stmts.length === 0) {
          return new Response(JSON.stringify({ success: false, error: 'Số lượng đặt phải lớn hơn 0.' }), {
            status: 400,
            headers: corsHeaders
          });
        }

        // Thêm bước 1 vào quy trình đơn hàng
        const insertQtStmt = env.DB.prepare(`
          INSERT INTO quy_trinh_don (
            order_code, step, step_name, status, action_time, actor, note
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          maDon,
          1,
          'Gửi đơn hàng',
          'Hoàn tất',
          nowStr,
          nguoiDat || 'Người dùng',
          'Tạo đơn hàng thành công qua Portal'
        );

        stmts.push(insertQtStmt);

        await env.DB.batch(stmts);

        return new Response(JSON.stringify({
          success: true,
          data: {
            maDon,
            soDong: stmts.length - 1
          }
        }), { headers: corsHeaders });
      }

      // ----------------------------------------------------------------------
      // 4. GET /api/orders - Lịch sử đặt hàng
      // ----------------------------------------------------------------------
      if (pathname === '/api/orders' && request.method === 'GET') {
        const site = searchParams.get('site') || '';
        const thang = searchParams.get('thang') || '';

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

        if (site) {
          conditions.push('dh.site_name = ?');
          bindings.push(site);
        }
        if (thang) {
          conditions.push('(dh.applied_month = ? OR dh.applied_month LIKE ?)');
          bindings.push(thang, `%${thang}%`);
        }

        if (conditions.length) {
          query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` GROUP BY dh.order_code ORDER BY dh.order_date DESC`;

        const { results } = await env.DB.prepare(query).bind(...bindings).all();

        return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
      }

      // ----------------------------------------------------------------------
      // 5. GET /api/order-detail - Chi tiết đơn hàng & Timeline quy trình
      // ----------------------------------------------------------------------
      if (pathname === '/api/order-detail' && request.method === 'GET') {
        const orderCode = searchParams.get('orderCode') || '';
        if (!orderCode) {
          return new Response(JSON.stringify({ success: false, error: 'Thiếu mã đơn hàng' }), {
            status: 400,
            headers: corsHeaders
          });
        }

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
          SELECT 
            step as buoc,
            step_name as tenBuoc,
            status as trangThai,
            action_time as thoiGian,
            actor as nguoiXuLy,
            note as ghiChu
          FROM quy_trinh_don
          WHERE order_code = ?
          ORDER BY step ASC, action_time ASC
        `).bind(orderCode).all();

        const summary = await env.DB.prepare(`
          SELECT order_code, order_date, site_name, ordered_by, applied_month, status
          FROM don_hang
          WHERE order_code = ?
          LIMIT 1
        `).bind(orderCode).first();

        return new Response(JSON.stringify({
          success: true,
          data: {
            info: summary,
            items,
            timeline
          }
        }), { headers: corsHeaders });
      }

      // ----------------------------------------------------------------------
      // 6. POST /api/order-timeline - Cập nhật bước quy trình xử lý đơn hàng
      // ----------------------------------------------------------------------
      if (pathname === '/api/order-timeline' && request.method === 'POST') {
        const body = await request.json();
        const { orderCode, step, stepName, status, actor, note } = body;
        const nowStr = formatDate(new Date());

        await env.DB.prepare(`
          INSERT INTO quy_trinh_don (order_code, step, step_name, status, action_time, actor, note)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(orderCode, step, stepName, status, nowStr, actor, note || '').run();

        // Cập nhật trạng thái tổng đơn nếu cần
        if (status === 'Đã duyệt' || status === 'Hoàn tất') {
          await env.DB.prepare(`UPDATE don_hang SET status = ? WHERE order_code = ?`).bind(status, orderCode).run();
        }

        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // ----------------------------------------------------------------------
      // 7. POST /api/order/delete - Hủy / Xóa đơn hàng
      // ----------------------------------------------------------------------
      if (pathname === '/api/order/delete' && request.method === 'POST') {
        const body = await request.json();
        const { orderCode, reason, actor } = body;
        const nowStr = formatDate(new Date());

        await env.DB.prepare(`UPDATE don_hang SET status = 'Đã hủy' WHERE order_code = ?`).bind(orderCode).run();

        await env.DB.prepare(`
          INSERT INTO quy_trinh_don (order_code, step, step_name, status, action_time, actor, note)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(orderCode, 99, 'Hủy đơn hàng', 'Đã hủy', nowStr, actor || 'Admin', reason || 'Người dùng hủy đơn').run();

        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // ----------------------------------------------------------------------
      // 8. GET /api/vouchers - Tra cứu chứng từ
      // ----------------------------------------------------------------------
      if (pathname === '/api/vouchers' && request.method === 'GET') {
        const site = searchParams.get('site') || '';
        const loai = searchParams.get('loaiHoaDon') || '';
        const tuNgay = searchParams.get('tuNgay') || '';
        const denNgay = searchParams.get('denNgay') || '';
        const nguoiNhap = searchParams.get('nguoiNhap') || '';

        let query = `SELECT * FROM chung_tu`;
        const conditions = [];
        const bindings = [];

        if (site) {
          conditions.push('site_name = ?');
          bindings.push(site);
        }
        if (loai) {
          conditions.push('invoice_type = ?');
          bindings.push(loai);
        }
        if (nguoiNhap) {
          conditions.push('created_by LIKE ?');
          bindings.push(`%${nguoiNhap}%`);
        }
        if (tuNgay) {
          conditions.push('receive_date >= ?');
          bindings.push(tuNgay);
        }
        if (denNgay) {
          conditions.push('receive_date <= ?');
          bindings.push(denNgay);
        }

        if (conditions.length) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ` ORDER BY created_at DESC`;

        const { results } = await env.DB.prepare(query).bind(...bindings).all();

        // Lấy số file cho từng chứng từ
        const { results: fileCounts } = await env.DB.prepare(`
          SELECT voucher_code, COUNT(id) as cnt FROM chung_tu_file GROUP BY voucher_code
        `).all();
        const fileMap = {};
        for (const f of fileCounts) {
          fileMap[f.voucher_code] = f.cnt;
        }

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

      // ----------------------------------------------------------------------
      // 9. POST /api/voucher - Lưu chứng từ giao nhận & file
      // ----------------------------------------------------------------------
      if (pathname === '/api/voucher' && request.method === 'POST') {
        const body = await request.json();
        const {
          site, loaiHoaDon, ngayXuat, ngayNhan, nguoiGiao, nguoiNhan,
          nhaCungCap, ghiChu, nguoiNhap, files, linkFile
        } = body;

        const maCT = generateCode('CT', site);
        const nowStr = formatDate(new Date());

        const primaryLink = linkFile || (files && files[0] ? files[0].url : '');

        await env.DB.prepare(`
          INSERT INTO chung_tu (
            voucher_code, site_name, invoice_type, invoice_date, receive_date,
            deliverer_name, receiver_name, supplier_name, note,
            attachment_link, created_at, created_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          maCT, site, loaiHoaDon, ngayXuat || nowStr, ngayNhan || nowStr,
          nguoiGiao || '', nguoiNhan || '', nhaCungCap || '', ghiChu || '',
          primaryLink, nowStr, nguoiNhap || 'Người dùng'
        ).run();

        if (files && files.length) {
          const fileStmts = files.map(f => env.DB.prepare(`
            INSERT INTO chung_tu_file (voucher_code, file_name, file_link, file_type, upload_date)
            VALUES (?, ?, ?, ?, ?)
          `).bind(maCT, f.name || 'Tài liệu', f.url || '', f.type || 'IMAGE', nowStr));
          await env.DB.batch(fileStmts);
        }

        return new Response(JSON.stringify({ success: true, data: { maCT } }), { headers: corsHeaders });
      }

      // ----------------------------------------------------------------------
      // 10. GET /api/voucher-detail - Chi tiết chứng từ & file đính kèm
      // ----------------------------------------------------------------------
      if (pathname === '/api/voucher-detail' && request.method === 'GET') {
        const maCT = searchParams.get('maCT');
        const voucher = await env.DB.prepare(`SELECT * FROM chung_tu WHERE voucher_code = ?`).bind(maCT).first();
        if (!voucher) {
          return new Response(JSON.stringify({ success: false, error: 'Không tìm thấy chứng từ' }), {
            status: 404,
            headers: corsHeaders
          });
        }

        const { results: files } = await env.DB.prepare(`
          SELECT file_name, file_link, file_type, upload_date FROM chung_tu_file WHERE voucher_code = ?
        `).bind(maCT).all();

        return new Response(JSON.stringify({
          success: true,
          data: {
            ...voucher,
            files
          }
        }), { headers: corsHeaders });
      }

      // ----------------------------------------------------------------------
      // 11. GET /api/inventory-audit - Kiểm kê tồn kho
      // ----------------------------------------------------------------------
      if (pathname === '/api/inventory-audit' && request.method === 'GET') {
        const site = searchParams.get('site') || '';
        let query = `SELECT * FROM kiemke_tonkho`;
        const bindings = [];

        if (site) {
          query += ` WHERE site_code = ? OR site_name = ? OR full_site_name LIKE ?`;
          bindings.push(site, site, `%${site}%`);
        }

        query += ` ORDER BY item_code LIMIT 300`;
        const { results } = await env.DB.prepare(query).bind(...bindings).all();

        return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
      }

      // ----------------------------------------------------------------------
      // 12. POST /api/inventory-audit - Lưu kết quả kiểm kê tồn kho
      // ----------------------------------------------------------------------
      if (pathname === '/api/inventory-audit' && request.method === 'POST') {
        const body = await request.json();
        const { items } = body; // [{ id, usage_t11, closing_t11 }]

        if (items && items.length) {
          const stmts = items.map(it => env.DB.prepare(`
            UPDATE kiemke_tonkho
            SET usage_t11 = ?, closing_t11 = ?
            WHERE id = ?
          `).bind(it.usage, it.closing, it.id));
          await env.DB.batch(stmts);
        }

        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // ----------------------------------------------------------------------
      // 13. POST /api/report - Báo cáo vận hành suất ăn
      // ----------------------------------------------------------------------
      if (pathname === '/api/report' && request.method === 'POST') {
        const body = await request.json();
        const { branchCode, reportDate, plannedMeals, actualMeals, wastedMeals, staffActual, foodQualityNote, feedback } = body;
        const nowStr = formatDate(new Date());

        const id = 'RPT-' + Date.now();
        await env.DB.prepare(`
          INSERT INTO daily_catering_reports (
            id, branch_id, report_date, planned_meals, actual_meals, wasted_meals,
            staff_actual, food_quality_note, customer_feedback, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id, branchCode || 'K001', reportDate || nowStr,
          Number(plannedMeals) || 0, Number(actualMeals) || 0, Number(wastedMeals) || 0,
          Number(staffActual) || 0, foodQualityNote || '', feedback || '', nowStr
        ).run();

        return new Response(JSON.stringify({ success: true, data: { id } }), { headers: corsHeaders });
      }

      // ----------------------------------------------------------------------
      // 14. POST /api/auth/login - Đăng nhập tài khoản Admin
      // ----------------------------------------------------------------------
      if (pathname === '/api/auth/login' && request.method === 'POST') {
        const body = await request.json();
        const { email, password } = body;

        const user = await env.DB.prepare(`
          SELECT * FROM admin_users WHERE email = ? LIMIT 1
        `).bind(email).first();

        if (!user) {
          return new Response(JSON.stringify({ success: false, error: 'Email hoặc mật khẩu không đúng' }), {
            status: 401,
            headers: corsHeaders
          });
        }

        if (user.status !== 'Đã duyệt') {
          return new Response(JSON.stringify({ success: false, error: 'Tài khoản chưa được duyệt bởi Quản trị viên' }), {
            status: 403,
            headers: corsHeaders
          });
        }

        const computedHash = await sha256(`${user.salt}::${password}`);
        if (computedHash !== user.password_hash && password !== user.password_raw) {
          return new Response(JSON.stringify({ success: false, error: 'Mật khẩu không chính xác' }), {
            status: 401,
            headers: corsHeaders
          });
        }

        return new Response(JSON.stringify({
          success: true,
          data: {
            email: user.email,
            fullName: user.full_name,
            role: user.role,
            phone: user.phone
          }
        }), { headers: corsHeaders });
      }

      // ----------------------------------------------------------------------
      // 15. POST /api/auth/register - Đăng ký tài khoản Admin
      // ----------------------------------------------------------------------
      if (pathname === '/api/auth/register' && request.method === 'POST') {
        const body = await request.json();
        const { email, fullName, phone, role, password } = body;

        const existing = await env.DB.prepare(`SELECT email FROM admin_users WHERE email = ?`).bind(email).first();
        if (existing) {
          return new Response(JSON.stringify({ success: false, error: 'Email này đã tồn tại trên hệ thống' }), {
            status: 400,
            headers: corsHeaders
          });
        }

        const salt = crypto.randomUUID();
        const hash = await sha256(`${salt}::${password}`);
        const nowStr = formatDate(new Date());

        await env.DB.prepare(`
          INSERT INTO admin_users (email, full_name, phone, role, password_raw, password_hash, salt, status, registered_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(email, fullName, phone, role || 'Quản lý Site', password, hash, salt, 'Chờ duyệt', nowStr).run();

        return new Response(JSON.stringify({
          success: true,
          message: 'Đăng ký thành công. Vui lòng chờ Ban Quản trị phê duyệt.'
        }), { headers: corsHeaders });
      }

      // Nếu không khớp endpoint nào trong /api, fallback sang env.ASSETS (static files)
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }

      return new Response(JSON.stringify({ error: 'Endpoint Not Found' }), {
        status: 404,
        headers: corsHeaders
      });

    } catch (err) {
      return new Response(JSON.stringify({
        success: false,
        error: err.message,
        stack: err.stack
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
