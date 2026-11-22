import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

const p = html.indexOf('id="modalInventoryDetail"');
console.log('=== modalInventoryDetail ===');
console.log(html.slice(p, p + 2500));
