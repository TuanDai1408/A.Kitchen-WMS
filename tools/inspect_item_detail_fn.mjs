import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

const p = html.indexOf('async function openItemDetailModal');
console.log('=== openItemDetailModal ===');
console.log(html.slice(p, p + 1500));
