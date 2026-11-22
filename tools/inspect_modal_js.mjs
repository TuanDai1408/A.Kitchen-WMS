import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

const functionsToInspect = [
  'viewVoucherDetail',
  'viewOrderDetail',
  'openItemDetailModal',
  'openWhHistoryModal',
  'openWhBatchesModal',
  'renderReceiptLinesTable',
  'renderManualReceiptLines',
  'renderAdminRequestsTable'
];

for (const fn of functionsToInspect) {
  const p = html.indexOf(fn);
  if (p === -1) {
    console.log(`Function ${fn} NOT FOUND`);
    continue;
  }
  const chunk = html.slice(p, p + 2500);
  const tinys = chunk.match(/text-\[(?:9|9\.5|10|10\.5|11)px\]/g) || [];
  const textXs = chunk.match(/text-xs/g) || [];
  console.log(`\n================== Function: ${fn} ==================`);
  console.log('Tinys (<12px):', tinys.length, [...new Set(tinys)]);
  console.log('text-xs:', textXs.length);
  // print first 500 chars
  console.log(chunk.slice(0, 450));
}
