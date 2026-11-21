import worker from '../../src/index.js';

const PG_DSN = 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';

async function run() {
  console.log('Testing Group 5 (orders/quota/vouchers/dinh_muc) against Supabase Postgres...');

  const env = {
    DB_BACKEND: 'supabase',
    HYPERDRIVE_URL: PG_DSN,
    HYPERDRIVE: { connectionString: PG_DSN }
  };

  const tests = [
    {
      name: 'GET /api/quota?site=K001&thang=11/2026&no-cache=1',
      req: new Request('http://localhost/api/quota?site=K001&thang=11/2026&no-cache=1', { method: 'GET' })
    },
    {
      name: 'GET /api/orders?site=K001&no-cache=1',
      req: new Request('http://localhost/api/orders?site=K001&no-cache=1', { method: 'GET' })
    },
    {
      name: 'GET /api/vouchers?site=K001&no-cache=1',
      req: new Request('http://localhost/api/vouchers?site=K001&no-cache=1', { method: 'GET' })
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
    if (t.name.includes('/api/quota')) {
      console.log(`Site: ${data.data?.site}, Budget: ${data.data?.nganSach}, Items count: ${data.data?.items?.length}`);
    } else if (t.name.includes('/api/orders')) {
      console.log(`Orders count: ${data.data?.length}`);
    } else if (t.name.includes('/api/vouchers')) {
      console.log(`Vouchers count: ${data.data?.length}`);
    }
  }

  console.log('\nAll Group 5 tests PASSED on Supabase Postgres!');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
