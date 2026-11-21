import worker from '../../src/index.js';

const PG_DSN = 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';

async function run() {
  console.log('Testing Group 4 (fnb stock/counts/receipts/waste) against Supabase Postgres...');

  const env = {
    DB_BACKEND: 'supabase',
    HYPERDRIVE_URL: PG_DSN,
    HYPERDRIVE: { connectionString: PG_DSN }
  };

  const tests = [
    {
      name: 'GET /api/fnb/stock?regionId=all&no-cache=1',
      req: new Request('http://localhost/api/fnb/stock?regionId=all&no-cache=1', { method: 'GET' })
    },
    {
      name: 'GET /api/fnb/stock/items-for-site?site_code=K001&no-cache=1',
      req: new Request('http://localhost/api/fnb/stock/items-for-site?site_code=K001&no-cache=1', { method: 'GET' })
    },
    {
      name: 'GET /api/fnb/counts?site_code=K001&no-cache=1',
      req: new Request('http://localhost/api/fnb/counts?site_code=K001&no-cache=1', { method: 'GET' })
    },
    {
      name: 'GET /api/fnb/receipts?site_code=K001&no-cache=1',
      req: new Request('http://localhost/api/fnb/receipts?site_code=K001&no-cache=1', { method: 'GET' })
    },
    {
      name: 'GET /api/fnb/wastes?site_code=K001&no-cache=1',
      req: new Request('http://localhost/api/fnb/wastes?site_code=K001&no-cache=1', { method: 'GET' })
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
    if (t.name.includes('/api/fnb/stock?')) {
      console.log(`Matrix rows: ${data.data?.rows?.length}, sites: ${data.data?.sites?.length}`);
    } else if (t.name.includes('items-for-site')) {
      console.log(`Site items count: ${data.data?.items?.length}`);
    } else if (t.name.includes('counts')) {
      console.log(`Counts count: ${data.data?.counts?.length}`);
    } else if (t.name.includes('receipts')) {
      console.log(`Receipts count: ${data.data?.receipts?.length}`);
    } else if (t.name.includes('wastes')) {
      console.log(`Wastes count: ${data.data?.wastes?.length}`);
    }
  }

  console.log('\nAll Group 4 tests PASSED on Supabase Postgres!');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
