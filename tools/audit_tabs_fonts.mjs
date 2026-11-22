import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

// Find all tab sections
const sectionRegex = /<section\s+id="([^"]+)"[^>]*class="[^"]*tab-panel[^"]*"/gi;
const tabs = [];
let match;
while ((match = sectionRegex.exec(html)) !== null) {
  tabs.push(match[1]);
}

console.log(`Found ${tabs.length} tabs:`, tabs);

for (const tabId of tabs) {
  const startIdx = html.indexOf(`id="${tabId}"`);
  if (startIdx === -1) continue;
  const nextSectionIdx = html.indexOf('<section', startIdx + 10);
  const endIdx = nextSectionIdx !== -1 ? nextSectionIdx : startIdx + 8000;
  const content = html.slice(startIdx, endIdx);

  const textTiny = content.match(/text-\[(?:9|10|11)px\]/g) || [];
  const textXs = content.match(/text-xs/g) || [];
  const textSm = content.match(/text-sm/g) || [];
  const textBase = content.match(/text-base/g) || [];
  const textLg = content.match(/text-lg/g) || [];
  const textXl = content.match(/text-(?:xl|2xl)/g) || [];

  console.log(`\nTab: #${tabId}`);
  console.log(` - Tiny (<12px): ${textTiny.length} (${[...new Set(textTiny)].join(', ')})`);
  console.log(` - text-xs (12px): ${textXs.length}`);
  console.log(` - text-sm (14px): ${textSm.length}`);
  console.log(` - text-base (16px): ${textBase.length}`);
  console.log(` - headings (>=18px): ${textLg.length + textXl.length}`);
}
