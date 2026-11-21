import worker from '../../src/index.js';

const pgEnv = {
  DB_BACKEND: 'supabase',
  DATABASE_URL: 'postgresql://postgres.alqcojnxshfylheovdgw:supabaseDai%40123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
};

async function testRoute(name, path) {
  console.log(`\n--- Testing ${name} (${path}) ---`);
  const req = new Request(`https://worker.local${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const res = await worker.fetch(req, pgEnv);
  console.log(`Status: ${res.status}`);
  if (res.status !== 200) {
    const text = await res.text();
    console.error(`Error body:`, text);
    throw new Error(`Failed with status ${res.status}`);
  }
  const json = await res.json();
  return json;
}

async function run() {
  try {
    // 1. GET /api/fnb/pl (Site K001)
    const plSiteRes = await testRoute('GET /api/fnb/pl (K001)', '/api/fnb/pl?site=K001&thang=2026-11&no-cache=1');
    const plSite = plSiteRes.data;
    console.log(`PL Site keys:`, Object.keys(plSite));
    console.log(`PL Site: month=${plSite.month}, site=${plSite.site}, netRevenue=${plSite.netRevenue}, operatingProfit=${plSite.operatingProfit}`);

    // 2. GET /api/fnb/pl (Site ALL)
    const plAllRes = await testRoute('GET /api/fnb/pl (ALL)', '/api/fnb/pl?site=ALL&thang=2026-11&no-cache=1');
    const plAll = plAllRes.data;
    console.log(`PL ALL: month=${plAll.month}, netRevenue=${plAll.netRevenue}, operatingProfit=${plAll.operatingProfit}`);

    // 3. GET /api/fnb/chain
    const chainRes = await testRoute('GET /api/fnb/chain', '/api/fnb/chain?month=2026-11&no-cache=1');
    const chain = chainRes.data;
    console.log(`Chain keys:`, Object.keys(chain));
    console.log(`Chain: month=${chain.month}, totalSites=${chain.totalSites}, totalRevenue=${chain.totalRevenue}, rankingCount=${chain.ranking?.length}`);

    // 4. GET /api/fnb/pos (K001)
    const posSiteRes = await testRoute('GET /api/fnb/pos (K001)', '/api/fnb/pos?site=K001&date=2026-11-19&no-cache=1');
    const posSite = posSiteRes.data;
    console.log(`POS Site keys:`, Object.keys(posSite));
    console.log(`POS Site: date=${posSite.date}, todaySales=${posSite.todaySales}, billsToday=${posSite.billsToday}, avgBill=${posSite.avgBill}`);

    // 5. GET /api/fnb/pos (ALL)
    const posAllRes = await testRoute('GET /api/fnb/pos (ALL)', '/api/fnb/pos?site=ALL&date=2026-11-19&no-cache=1');
    const posAll = posAllRes.data;
    console.log(`POS ALL: date=${posAll.date}, todaySales=${posAll.todaySales}, billsToday=${posAll.billsToday}`);

    console.log(`\n ALL GROUP 6 TESTS PASSED WITH VALID DATA!`);
    process.exit(0);
  } catch (err) {
    console.error(`Test failed:`, err);
    process.exit(1);
  }
}

run();
