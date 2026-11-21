import worker from '../../src/index.js';

const PG_DSN = 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';

async function run() {
  console.log('Testing Group 3 (stock/FEFO/dashboard-summary) against Supabase Postgres...');

  const env = {
    DB_BACKEND: 'supabase',
    HYPERDRIVE_URL: PG_DSN,
    HYPERDRIVE: {
      connectionString: PG_DSN
    }
  };

  const tests = [
    {
      name: 'GET /api/dashboard-summary?branch=k505&no-cache=1',
      req: new Request('http://localhost/api/dashboard-summary?branch=k505&no-cache=1', { method: 'GET' })
    },
    {
      name: 'GET /api/stock?branch=k505&no-cache=1',
      req: new Request('http://localhost/api/stock?branch=k505&no-cache=1', { method: 'GET' })
    },
    {
      name: 'GET /api/reorder?branch=k505',
      req: new Request('http://localhost/api/reorder?branch=k505', { method: 'GET' })
    },
    {
      name: 'GET /api/leadtime',
      req: new Request('http://localhost/api/leadtime', { method: 'GET' })
    },
    {
      name: 'GET /api/po-sap',
      req: new Request('http://localhost/api/po-sap', { method: 'GET' })
    },
    {
      name: 'GET /api/inventory-audit?site=K001',
      req: new Request('http://localhost/api/inventory-audit?site=K001', { method: 'GET' })
    },
    {
      name: 'GET /api/daily-report?branch=k505',
      req: new Request('http://localhost/api/daily-report?branch=k505', { method: 'GET' })
    }
  ];

  for (const t of tests) {
    console.log(`\n--- Running test: ${t.name} ---`);
    const res = await worker.fetch(t.req, env);
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log(`Success: ${data.success}`);
    if (!data.success) {
      console.error('Test failed with error:', data);
      process.exit(1);
    }
    if (t.name.includes('dashboard-summary')) {
      console.log('Summary metrics:', {
        critical_exp: data.data?.critical_exp_count,
        rop_reorder: data.data?.rop_reorder_count,
        total_skus: data.data?.total_skus,
        total_qty: data.data?.total_qty,
        total_value: data.data?.total_value,
        alerts_count: data.data?.alerts?.length
      });
    } else if (t.name.includes('/api/stock')) {
      console.log(`Batches count: ${data.data?.length}`);
      if (data.data?.length) console.log('Sample batch:', data.data[0]);
    } else if (t.name.includes('/api/reorder')) {
      console.log(`Reorder items count: ${data.data?.length}`);
    } else if (t.name.includes('/api/leadtime')) {
      console.log(`Leadtime POs count: ${data.data?.length}`);
    } else if (t.name.includes('/api/po-sap')) {
      console.log(`PO SAP items count: ${data.data?.length}`);
    } else if (t.name.includes('/api/inventory-audit')) {
      console.log(`Audit items count: ${data.data?.length}`);
    } else if (t.name.includes('/api/daily-report')) {
      console.log(`Reports count: ${data.data?.length}`);
    }
  }

  console.log('\nAll Group 3 tests PASSED on Supabase Postgres!');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
