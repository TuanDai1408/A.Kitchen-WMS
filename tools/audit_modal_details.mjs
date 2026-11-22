import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

const targetModals = [
  'generalModal',
  'modalInventoryDetail',
  'modalWhItemHistory',
  'modalWhItemBatches',
  'modalEditItem',
  'modalFastReceipt',
  'modalFastIssue',
  'createReceiptModal',
  'modalManualReceipt',
  'createWasteModal',
  'siteSelectorModal',
  'userProfileModal',
  'roleSwitcherModal',
  'adminApprovalModal',
  'addUserModal',
  'editUserModal'
];

for (const id of targetModals) {
  const p = html.indexOf('id="' + id + '"');
  if (p === -1) continue;
  // Get text sizes inside this modal
  const chunk = html.slice(p, p + 4000);
  const tinys = chunk.match(/text-\[(?:9|9\.5|10|10\.5|11)px\]/g) || [];
  const textXs = chunk.match(/text-xs/g) || [];
  const titles = chunk.match(/<h[2-5][^>]*>[\s\S]*?<\/h[2-5]>/g) || [];
  console.log(`\n================== ${id} ==================`);
  console.log('Tinys (<12px):', tinys.length, [...new Set(tinys)]);
  console.log('text-xs:', textXs.length);
  console.log('Titles:', titles.map(t => t.replace(/<[^>]+>/g, '').trim()));
}
