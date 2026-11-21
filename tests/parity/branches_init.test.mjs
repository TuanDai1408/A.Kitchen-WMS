import worker from '../../src/index.js';

const PG_DSN = 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';

async function run() {
  console.log('Testing Group 2 (branches/sites/init) against Supabase Postgres...');

  const env = {
    DB_BACKEND: 'supabase',
    HYPERDRIVE_URL: PG_DSN,
    HYPERDRIVE: {
      connectionString: PG_DSN
    }
  };

  const tests = [
    {
      name: 'GET /api/branches?no-cache=1',
      req: new Request('http://localhost/api/branches?no-cache=1', { method: 'GET' })
    },
    {
      name: 'GET /api/init?no-cache=1',
      req: new Request('http://localhost/api/init?no-cache=1', { method: 'GET' })
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
    if (t.name.includes('/api/branches')) {
      console.log(`Branches count: ${data.data?.length}`);
      console.log('Sample branch:', data.data?.[0]);
    } else if (t.name.includes('/api/init')) {
      console.log(`Sites count: ${data.data?.sites?.length}, SiteObjs: ${data.data?.siteObjs?.length}`);
      console.log('Sample siteObj:', data.data?.siteObjs?.[0]);
    }
  }

  console.log('\nAll Group 2 tests PASSED on Supabase Postgres!');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
