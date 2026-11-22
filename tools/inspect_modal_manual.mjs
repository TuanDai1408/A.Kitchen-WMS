import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

const p = html.indexOf('id="modalManualReceipt"');
console.log('=== modalManualReceipt ===');
console.log(html.slice(p, p + 2500));

const p2 = html.indexOf('id="createReceiptModal"');
console.log('=== createReceiptModal ===');
console.log(html.slice(p2, p2 + 2500));
