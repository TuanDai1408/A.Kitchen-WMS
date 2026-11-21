import worker from '../../src/index.js';

const pgEnv = {
  DB_BACKEND: 'supabase',
  DATABASE_URL: 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
  ADMIN_KEY: 'test-admin-secret-key-123'
};

async function testRoute(name, path, options = {}) {
  console.log(`\n--- Testing ${name} (${path}) ---`);
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const req = new Request(`https://worker.local${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const res = await worker.fetch(req, pgEnv);
  console.log(`Status: ${res.status}`);
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

async function run() {
  try {
    // 1. Security Check: Access without Admin Key should be 403 Forbidden
    const unauth = await testRoute('GET /api/admin/db-status (Unauthorized)', '/api/admin/db-status');
    if (unauth.status !== 403) {
      throw new Error(`Expected status 403 for unauthorized admin access, got ${unauth.status}`);
    }
    console.log(` Security Check passed (403 Forbidden as expected)`);

    // 2. GET /api/admin/db-status with X-Admin-Key
    const authHeaders = { 'X-Admin-Key': 'test-admin-secret-key-123' };
    const dbStatus = await testRoute('GET /api/admin/db-status (Authorized)', '/api/admin/db-status', { headers: authHeaders });
    if (dbStatus.status !== 200) throw new Error(`db-status failed with status ${dbStatus.status}`);
    console.log(`db-status backend:`, dbStatus.json.backend);
    console.log(`db-status indexesCount:`, dbStatus.json.indexesCount);
    console.log(`db-status tableCounts (transactions):`, dbStatus.json.tableCounts?.transactions);
    console.log(`db-status tableCounts (app_users):`, dbStatus.json.tableCounts?.app_users);

    // 3. POST /api/admin/sync-monthly-summary?month=2026-11
    const syncSum = await testRoute('POST /api/admin/sync-monthly-summary', '/api/admin/sync-monthly-summary?month=2026-11', {
      method: 'POST',
      headers: authHeaders
    });
    if (syncSum.status !== 200) throw new Error(`sync-monthly-summary failed with status ${syncSum.status}`);
    console.log(`sync-monthly-summary message:`, syncSum.json.message, `count:`, syncSum.json.count);

    // 4. POST /api/admin/sync-dim-article-stock
    const testItems = [
      {
        site: 'K001',
        site_name: 'Bếp Đại Học Hùng Vương',
        nganh_hang: 'Gia vị',
        nhom_hang: 'Tiêu',
        material: 'MAT_TEST_999',
        material_desc: 'Tiêu Đen Xay Test',
        entry_unit: 'KG',
        price: 150000
      }
    ];
    const syncDim = await testRoute('POST /api/admin/sync-dim-article-stock', '/api/admin/sync-dim-article-stock', {
      method: 'POST',
      headers: authHeaders,
      body: { items: testItems }
    });
    if (syncDim.status !== 200) throw new Error(`sync-dim-article-stock failed with status ${syncDim.status}`);
    console.log(`sync-dim-article-stock message:`, syncDim.json.message, `count:`, syncDim.json.count);

    // 5. GET /api/admin/clean-demo-data
    const cleanDemo = await testRoute('GET /api/admin/clean-demo-data', '/api/admin/clean-demo-data', {
      headers: authHeaders
    });
    if (cleanDemo.status !== 200) throw new Error(`clean-demo-data failed with status ${cleanDemo.status}`);
    console.log(`clean-demo-data message:`, cleanDemo.json.message, `remainingUsers:`, cleanDemo.json.remainingUsers?.length);

    console.log(`\n ALL GROUP 7 ADMIN TESTS PASSED!`);
    process.exit(0);
  } catch (err) {
    console.error(`Group 7 Test failed:`, err);
    process.exit(1);
  }
}

run();
