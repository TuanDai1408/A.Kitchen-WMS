import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

const targetModals = [
  'generalModal',
  'createReceiptModal',
  'modalManualReceipt',
  'createWasteModal',
  'modalInventoryDetail',
  'modalWhItemHistory',
  'modalWhItemBatches',
  'modalEditItem',
  'siteSelectorModal',
  'addUserModal',
  'adminApprovalModal'
];

for (const id of targetModals) {
  const p = html.indexOf('id="' + id + '"');
  if (p === -1) continue;
  // Get first 1500 chars of this modal
  console.log(`\n================== ${id} ==================`);
  console.log(html.slice(p, p + 1200));
}
