import worker from '../../src/index.js';
import pg from 'pg';

const PG_DSN = 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';

async function run() {
  console.log('Testing Group 1 (auth/users/roles) against Supabase Postgres...');

  const env = {
    DB_BACKEND: 'supabase',
    HYPERDRIVE_URL: PG_DSN,
    HYPERDRIVE: {
      connectionString: PG_DSN
    }
  };

  const tests = [
    {
      name: 'GET /api/auth/roles-permissions',
      req: new Request('http://localhost/api/auth/roles-permissions', { method: 'GET' })
    },
    {
      name: 'GET /api/auth/users-matrix',
      req: new Request('http://localhost/api/auth/users-matrix', { method: 'GET' })
    },
    {
      name: 'GET /api/auth/access-requests',
      req: new Request('http://localhost/api/auth/access-requests', { method: 'GET' })
    },
    {
      name: 'POST /api/auth/switch-role (as admin)',
      req: new Request('http://localhost/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'BEP_TRUONG', email: 'trantuandai2508@gmail.com' })
      })
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
    if (t.name.includes('roles-permissions')) {
      console.log(`Roles count: ${data.data?.roles?.length}, Perms count: ${data.data?.perms?.length}, Users count: ${data.data?.users?.length}`);
    } else if (t.name.includes('users-matrix')) {
      console.log(`Users: ${data.data?.users?.length}, Features: ${data.data?.features?.length}`);
    } else if (t.name.includes('switch-role')) {
      console.log(`Switched to: ${data.data?.role}, Permissions count: ${Object.keys(data.data?.permissions || {}).length}`);
    }
  }

  console.log('\nAll Group 1 Auth tests PASSED on Supabase Postgres!');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
