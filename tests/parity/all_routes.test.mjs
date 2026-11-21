import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFiles = [
  { name: 'Group 1: Auth & Permissions', file: 'auth.test.mjs' },
  { name: 'Group 2: Branches & Init', file: 'branches_init.test.mjs' },
  { name: 'Group 3: Stock & FEFO & Dashboard', file: 'stock_fefo.test.mjs' },
  { name: 'Group 4: FnB Stock & Counts & Receipts', file: 'fnb_stock.test.mjs' },
  { name: 'Group 5: Orders, Quota & Vouchers', file: 'orders_vouchers.test.mjs' },
  { name: 'Group 6: FnB PL, Chain & POS Realtime', file: 'fnb_pl_chain_pos.test.mjs' },
  { name: 'Group 7: Admin & Diagnostics & Summaries', file: 'admin.test.mjs' }
];

async function runTest(test) {
  const startTime = Date.now();
  return new Promise(resolve => {
    const child = spawn(process.execPath, [path.join(__dirname, test.file)], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', data => { stdout += data.toString(); });
    child.stderr.on('data', data => { stderr += data.toString(); });

    child.on('close', code => {
      const durationMs = Date.now() - startTime;
      resolve({
        name: test.name,
        file: test.file,
        passed: code === 0,
        code,
        durationMs,
        stdout,
        stderr
      });
    });
  });
}

async function main() {
  console.log('='.repeat(70));
  console.log('   FULL END-TO-END PARITY TEST SUITE (CLOUDFLARE D1 -> SUPABASE PG)');
  console.log('='.repeat(70));

  const results = [];
  for (const test of testFiles) {
    process.stdout.write(`Running ${test.name}... `);
    const res = await runTest(test);
    results.push(res);
    if (res.passed) {
      console.log(`PASSED (${res.durationMs}ms)`);
    } else {
      console.log(`FAILED (${res.durationMs}ms)`);
      console.error(res.stderr || res.stdout);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('TEST SUITE SUMMARY');
  console.log('='.repeat(70));

  let allPassed = true;
  for (const r of results) {
    const status = r.passed ? 'PASS [200]' : 'FAIL';
    console.log(`- ${r.name.padEnd(45)}: ${status} in ${r.durationMs}ms`);
    if (!r.passed) allPassed = false;
  }
  console.log('='.repeat(70));

  if (allPassed) {
    console.log(' ALL 7 ROUTE GROUPS PASSED WITH ZERO REGRESSIONS!');
    process.exit(0);
  } else {
    console.error(' SOME TESTS FAILED. PLEASE REVIEW LOGS ABOVE.');
    process.exit(1);
  }
}

main();
