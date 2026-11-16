// ============================================================================
// AKITCHEN - CLOUDFLARE WORKER BACKEND API ROUTER (LIVE D1 BACKEND)
// ============================================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    // CORS Headers
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
      // 1. GET /api/branches
      if (pathname === '/api/branches' && request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM branches WHERE is_active = 1 ORDER BY code').all();
        return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
      }

      // 2. GET /api/dashboard-summary (KPIs tổng quan lấy trực tiếp từ D1)
      if (pathname === '/api/dashboard-summary' && request.method === 'GET') {
        const branchCode = searchParams.get('branch') || 'k505';
        const upperCode = branchCode.toUpperCase();

        // 2a. Đếm lô cận date <= 7 ngày
        const criticalExpQuery = `
          SELECT COUNT(*) as critical_count
          FROM inventory_batches b
          JOIN branches br ON b.branch_id = br.id
          WHERE br.code = ? AND b.qty > 0 AND (julianday(b.exp_date) - julianday('now')) <= 7
        `;
        const critRow = await env.DB.prepare(criticalExpQuery).bind(upperCode).first();

        // 2b. Đếm mặt hàng dưới ngưỡng ROP
        const ropQuery = `
          SELECT COUNT(*) as rop_count FROM (
            SELECT i.sku
            FROM items i
            LEFT JOIN branches br ON br.code = ?
            LEFT JOIN inventory_batches b ON i.sku = b.sku AND b.branch_id = br.id AND b.qty > 0
            WHERE i.category = 'Gia vị'
            GROUP BY i.sku
            HAVING COALESCE(SUM(b.qty), 0) < ((i.daily_usage * (i.lead_time_hours / 24.0)) + i.safety_stock)
          )
        `;
        const ropRow = await env.DB.prepare(ropQuery).bind(upperCode).first();

        // 2c. Tính Lead time trung bình
        const leadTimeQuery = `
          SELECT ROUND(AVG(lead_time_hours), 1) as avg_lead_time, COUNT(*) as total_orders
          FROM purchase_orders
          WHERE lead_time_hours IS NOT NULL
        `;
        const leadRow = await env.DB.prepare(leadTimeQuery).first();

        // 2d. Tổng mặt hàng và tổng tồn kho
        const totalStockQuery = `
          SELECT COUNT(DISTINCT i.sku) as total_skus, ROUND(COALESCE(SUM(b.qty), 0), 1) as total_qty
          FROM items i
          JOIN inventory_batches b ON i.sku = b.sku
          JOIN branches br ON b.branch_id = br.id
          WHERE br.code = ? AND b.qty > 0
        `;
        const stockRow = await env.DB.prepare(totalStockQuery).bind(upperCode).first();

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

      // 3. GET /api/stock (Danh mục tồn kho gia vị & tính hạn dùng FEFO)
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
            statusText = 'Cận Date (< 7 ngày)';
          } else if (r.days_remaining <= 15) {
            dangerLevel = 'orange';
            statusText = 'Chú ý (8-15 ngày)';
          }
          return {
            ...r,
            fefo_rank: idx + 1,
            danger_level: dangerLevel,
            status_text: statusText
          };
        });

        return new Response(JSON.stringify({ success: true, data: enriched }), { headers: corsHeaders });
      }

      // 4. POST /api/stock/receipt (Nhập kho lô mới)
      if (pathname === '/api/stock/receipt' && request.method === 'POST') {
        const body = await request.json();
        const { branch_code, sku, batch_code, mfg_date, exp_date, qty, storage_loc } = body;
        
        const branch = await env.DB.prepare('SELECT id FROM branches WHERE code = ?').bind((branch_code || 'K505').toUpperCase()).first();
        if (!branch) throw new Error('Không tìm thấy chi nhánh');

        const batchId = 'bat_' + Date.now();
        await env.DB.prepare(`
          INSERT INTO inventory_batches (id, branch_id, sku, batch_code, mfg_date, exp_date, qty, storage_loc)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(batchId, branch.id, sku, batch_code, mfg_date, exp_date, parseFloat(qty), storage_loc || 'Kho chuẩn').run();

        await env.DB.prepare(`
          INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note)
          VALUES (?, ?, ?, ?, 'NHAP_KHO', ?, 'Nhập kho lô mới')
        `).bind('tx_' + Date.now(), branch.id, sku, batchId, parseFloat(qty)).run();

        return new Response(JSON.stringify({ success: true, message: 'Nhập kho thành công', batch_id: batchId }), { headers: corsHeaders });
      }

      // 5. POST /api/stock/issue (Xuất bếp chuẩn FEFO)
      if (pathname === '/api/stock/issue' && request.method === 'POST') {
        const body = await request.json();
        const { batch_id, qty, reason } = body;
        const numQty = parseFloat(qty);

        const batch = await env.DB.prepare('SELECT * FROM inventory_batches WHERE id = ?').bind(batch_id).first();
        if (!batch) throw new Error('Không tìm thấy lô hàng');
        if (batch.qty < numQty) throw new Error('Số lượng xuất vượt quá tồn kho thực tế của lô');

        await env.DB.prepare('UPDATE inventory_batches SET qty = qty - ? WHERE id = ?').bind(numQty, batch_id).run();
        
        await env.DB.prepare(`
          INSERT INTO stock_transactions (id, branch_id, sku, batch_id, trans_type, qty, note)
          VALUES (?, ?, ?, ?, 'XUAT_BEP', ?, ?)
        `).bind('tx_' + Date.now(), batch.branch_id, batch.sku, batch_id, numQty, reason || 'Xuất nấu ca bếp').run();

        return new Response(JSON.stringify({ success: true, message: 'Xuất kho FEFO thành công' }), { headers: corsHeaders });
      }

      // 6. GET /api/reorder (Tính toán ngưỡng ROP & Đề xuất đặt hàng)
      if (pathname === '/api/reorder' && request.method === 'GET') {
        const branchCode = searchParams.get('branch') || 'k505';
        const query = `
          SELECT 
            i.sku,
            i.name as item_name,
            i.unit,
            i.daily_usage,
            i.safety_stock,
            i.lead_time_hours,
            i.standard_cost_sap,
            ROUND((i.daily_usage * (i.lead_time_hours / 24.0)) + i.safety_stock, 1) as rop_threshold,
            COALESCE(SUM(b.qty), 0) as current_stock
          FROM items i
          LEFT JOIN branches br ON br.code = ?
          LEFT JOIN inventory_batches b ON i.sku = b.sku AND b.branch_id = br.id AND b.qty > 0
          WHERE i.category = 'Gia vị'
          GROUP BY i.sku
          ORDER BY (COALESCE(SUM(b.qty), 0) - ((i.daily_usage * (i.lead_time_hours / 24.0)) + i.safety_stock)) ASC
        `;
        const { results } = await env.DB.prepare(query).bind(branchCode.toUpperCase()).all();

        const reorders = results.map(r => {
          const isUnderRop = r.current_stock < r.rop_threshold;
          const suggestedQty = isUnderRop ? Math.ceil((r.rop_threshold * 2) - r.current_stock) : 0;
          return {
            ...r,
            is_under_rop: isUnderRop,
            suggested_reorder_qty: suggestedQty,
            status_text: isUnderRop ? 'Dưới ngưỡng an toàn' : 'Tồn đầy đủ'
          };
        });

        return new Response(JSON.stringify({ success: true, data: reorders }), { headers: corsHeaders });
      }

      // 7. GET /api/leadtime (Lead Time giao hàng & SLA Nhà Cung Cấp)
      if (pathname === '/api/leadtime' && request.method === 'GET') {
        const { results } = await env.DB.prepare(`
          SELECT * FROM purchase_orders ORDER BY order_time DESC LIMIT 15
        `).all();
        return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
      }

      // 8. GET /api/po-sap (Đối soát giá PO vs Giá S SAP)
      if (pathname === '/api/po-sap' && request.method === 'GET') {
        const query = `
          SELECT 
            i.sku,
            i.name as item_name,
            i.unit,
            i.standard_cost_sap,
            i.old_cost_sap,
            i.last_cost_date,
            ROUND(((i.standard_cost_sap - i.old_cost_sap) / i.old_cost_sap) * 100, 1) as price_change_pct,
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

      // 9. GET /api/vouchers & POST /api/vouchers
      if (pathname === '/api/vouchers') {
        if (request.method === 'GET') {
          const { results } = await env.DB.prepare('SELECT * FROM vouchers ORDER BY doc_date DESC').all();
          return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
        }
        if (request.method === 'POST') {
          const body = await request.json();
          const { voucher_code, invoice_number, vendor_name, doc_date, amount, po_number } = body;
          const id = 'vc_' + Date.now();
          await env.DB.prepare(`
            INSERT INTO vouchers (id, voucher_code, invoice_number, vendor_name, doc_date, amount, po_number)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(id, voucher_code || ('CT-' + Date.now()), invoice_number, vendor_name, doc_date, parseFloat(amount), po_number).run();
          return new Response(JSON.stringify({ success: true, message: 'Đã lưu chứng từ thành công', id }), { headers: corsHeaders });
        }
      }

      // 10. GET /api/audit & POST /api/audit (Kiểm kê kỳ)
      if (pathname === '/api/audit') {
        if (request.method === 'GET') {
          const branchCode = searchParams.get('branch') || 'k505';
          const period = searchParams.get('period') || '11/2026';
          const query = `
            SELECT 
              sa.id,
              sa.period_month,
              sa.opening_qty,
              sa.used_qty,
              (sa.opening_qty - sa.used_qty) as closing_qty,
              sa.note,
              i.sku,
              i.name as item_name,
              i.unit
            FROM stock_audits sa
            JOIN items i ON sa.sku = i.sku
            JOIN branches br ON sa.branch_id = br.id
            WHERE br.code = ? AND sa.period_month = ?
          `;
          const { results } = await env.DB.prepare(query).bind(branchCode.toUpperCase(), period).all();
          return new Response(JSON.stringify({ success: true, data: results }), { headers: corsHeaders });
        }
        if (request.method === 'POST') {
          const body = await request.json();
          const { branch_code, period_month, items } = body;
          const branch = await env.DB.prepare('SELECT id FROM branches WHERE code = ?').bind((branch_code || 'K505').toUpperCase()).first();
          
          for (const it of items) {
            await env.DB.prepare(`
              INSERT INTO stock_audits (id, branch_id, period_month, sku, opening_qty, used_qty, note)
              VALUES (?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET used_qty = excluded.used_qty, updated_at = CURRENT_TIMESTAMP
            `).bind(it.id || ('sa_' + it.sku + '_' + Date.now()), branch.id, period_month, it.sku, parseFloat(it.opening_qty), parseFloat(it.used_qty), it.note || '').run();
          }
          return new Response(JSON.stringify({ success: true, message: 'Đã lưu kiểm kê thành công' }), { headers: corsHeaders });
        }
      }

      // 11. POST /api/daily-report (Báo cáo suất ăn)
      if (pathname === '/api/daily-report' && request.method === 'POST') {
        const body = await request.json();
        const { branch_code, report_date, planned_meals, actual_meals, wasted_meals, staff_actual, staff_standard, notes } = body;
        const branch = await env.DB.prepare('SELECT id FROM branches WHERE code = ?').bind((branch_code || 'K505').toUpperCase()).first();
        const id = 'dcr_' + Date.now();
        await env.DB.prepare(`
          INSERT INTO daily_catering_reports (id, branch_id, report_date, planned_meals, actual_meals, wasted_meals, staff_actual, staff_standard, food_quality_note)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(id, branch.id, report_date, parseInt(planned_meals), parseInt(actual_meals), parseInt(wasted_meals || 0), parseInt(staff_actual || 0), parseInt(staff_standard || 0), notes).run();
        return new Response(JSON.stringify({ success: true, message: 'Đã lưu báo cáo suất ăn', id }), { headers: corsHeaders });
      }

      // 12. Static assets fallback
      if (env.ASSETS) {
        return await env.ASSETS.fetch(request);
      }

      return new Response('404 Not Found', { status: 404 });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
