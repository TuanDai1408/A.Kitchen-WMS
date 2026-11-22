import fs from 'fs';

const filePath = fs.existsSync('public/index.html') ? 'public/index.html' : 'kho_gia_vi_cloudflare/public/index.html';
const html = fs.readFileSync(filePath, 'utf8');

// Find all modal IDs
const modalIds = [
  'generalModal',
  'addUserModal',
  'editUserModal',
  'createReceiptModal',
  'modalManualReceipt',
  'createWasteModal',
  'googleAuthModal',
  'userProfileModal',
  'siteSelectorModal',
  'requestAccessModal',
  'adminApprovalModal',
  'roleSwitcherModal',
  'modalInventoryDetail',
  'modalWhItemHistory',
  'modalWhItemBatches',
  'modalEditItem',
  'modalFastReceipt',
  'modalFastIssue'
];

for (const id of modalIds) {
  const p = html.indexOf('id="' + id + '"');
  if (p === -1) continue;
  console.log(`\n=================== #${id} ===================`);
  // Look for title tag inside modal
  const headerSlice = html.slice(p, p + 1000);
  const titleMatch = headerSlice.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i);
  if (titleMatch) {
    console.log('Title element:', titleMatch[0].replace(/\s+/g, ' '));
  }
  // Look for body or content tag
  const bodyMatch = headerSlice.match(/<(?:div|form)[^>]*id="[^"]*body[^"]*"[^>]*>/i);
  if (bodyMatch) {
    console.log('Body element:', bodyMatch[0]);
  }
}
