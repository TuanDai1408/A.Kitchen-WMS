import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

// Find all modal IDs
const modalRegex = /id="([^"]*modal[^"]*)"/gi;
const modals = new Set();
let match;
while ((match = modalRegex.exec(html)) !== null) {
  modals.add(match[1]);
}

// Find fixed inset-0 overlays
const overlayRegex = /id="([^"]+)"[^>]*class="[^"]*(?:fixed inset-0|fixed top-0)[^"]*"/gi;
while ((match = overlayRegex.exec(html)) !== null) {
  modals.add(match[1]);
}

console.log('Modals and Popups found (' + modals.size + '):');
for (const id of modals) {
  console.log(' - ' + id);
}

// Let's inspect text classes inside modals
for (const id of modals) {
  const startIdx = html.indexOf('id="' + id + '"');
  if (startIdx === -1) continue;
  // Get rough slice of the modal
  const slice = html.slice(startIdx, startIdx + 3000);
  const textClasses = slice.match(/text-(?:\[\d+px\]|xs|sm|base|lg|xl)/g) || [];
  const textCounts = {};
  textClasses.forEach(tc => textCounts[tc] = (textCounts[tc] || 0) + 1);
  console.log(`\nModal: #${id}`);
  console.log(' Text classes used:', textCounts);
}
