import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

const p = html.indexOf('id="invDetailModal"');
console.log('=== invDetailModal ===');
console.log(html.slice(p, p + 1500));
