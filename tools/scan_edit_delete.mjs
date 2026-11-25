import fs from 'fs';
import path from 'path';

// 1. Scan index.html for onclick handlers
const html = fs.readFileSync('public/index.html', 'utf8');
const onclickRegex = /onclick\s*=\s*["']([^"']+)["']/gi;
let m;
const htmlActions = new Set();
while ((m = onclickRegex.exec(html)) !== null) {
  const code = m[1].trim();
  if (/(edit|delete|xoa|sua|huy|cancel|remove|lock|unlock|update)/i.test(code)) {
    htmlActions.add(code);
  }
}

// 2. Scan src/features for template strings containing onclick or buttons with edit/delete
function walkDir(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walkDir(full));
    } else if (full.endsWith('.ts') || full.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

const allSrc = walkDir('src');
const tsActions = new Set();
for (const file of allSrc) {
  const content = fs.readFileSync(file, 'utf8');
  while ((m = onclickRegex.exec(content)) !== null) {
    const code = m[1].trim();
    if (/(edit|delete|xoa|sua|huy|cancel|remove|lock|unlock|update)/i.test(code)) {
      tsActions.add({ file, code });
    }
  }
}

// 3. Scan API routes in src/index.js for DELETE / PUT / PATCH / POST with edit/delete
const backendCode = fs.readFileSync('src/index.js', 'utf8');
const apiRegex = /(pathname|request\.method|method)\s*(===|==)\s*['"]([^'"]+)['"]/g;
const apiEndpoints = [];
const routeRegex = /pathname\s*===\s*['"]([^'"]+)['"]\s*(&&\s*request\.method\s*===\s*['"]([A-Z]+)['"])?/g;
while ((m = routeRegex.exec(backendCode)) !== null) {
  const route = m[1];
  const method = m[3] || 'ALL';
  if (/(edit|delete|update|xoa|sua|huy|cancel|toggle|reset|lock)/i.test(route) || method === 'DELETE' || method === 'PUT') {
    apiEndpoints.push({ route, method });
  }
}

console.log('=== HTML ACTIONS ===');
console.log(Array.from(htmlActions));

console.log('\n=== TS ACTIONS ===');
console.log(Array.from(tsActions));

console.log('\n=== BACKEND API ROUTES ===');
console.log(apiEndpoints);
