import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

// List of all tabs
const tabRegex = /<section\s+id="([^"]+)"[^>]*class="[^"]*tab-panel[^"]*"/gi;
const tabs = [];
let match;
while ((match = tabRegex.exec(html)) !== null) {
  tabs.push(match[1]);
}

console.log(`Auditing ${tabs.length} tabs for Mobile Table & Card Optimization:\n`);

const report = [];

for (const tabId of tabs) {
  const startIdx = html.indexOf(`id="${tabId}"`);
  if (startIdx === -1) continue;
  const nextSectionIdx = html.indexOf('<section', startIdx + 10);
  const endIdx = nextSectionIdx !== -1 ? nextSectionIdx : startIdx + 10000;
  const tabHtml = html.slice(startIdx, endIdx);

  const tables = [...tabHtml.matchAll(/<table[^>]*>/gi)];
  const hasTable = tables.length > 0;
  
  // Check if table is hidden on mobile: hidden lg:block or hidden md:block
  const hasHiddenDesktopTable = /class="[^"]*(?:hidden\s+(?:lg|md):block|(?:lg|md):block\s+hidden)[^"]*"[^>]*>\s*<table/i.test(tabHtml) ||
    /<div[^>]*class="[^"]*(?:hidden\s+(?:lg|md):block|(?:lg|md):block\s+hidden)[^"]*"[\s\S]*?<table/i.test(tabHtml);

  // Check mobile cards container
  const mobileCardContainerMatch = tabHtml.match(/id="([^"]*mob(?:ile)?[^"]*cards?[^"]*)"/i) ||
    tabHtml.match(/id="([^"]*cards?[^"]*)"[^>]*class="[^"]*(?:block\s+lg:hidden|lg:hidden)[^"]*"/i);
  const mobileCardId = mobileCardContainerMatch ? mobileCardContainerMatch[1] : null;

  // Check overflow container
  const hasOverflowScroll = tabHtml.includes('table-scroll') || tabHtml.includes('overflow-x-auto');

  // Check in JS if mobile container is populated
  let jsPopulatesMobile = false;
  if (mobileCardId) {
    const jsRegex = new RegExp(`document\\.getElementById\\(['"\`]${mobileCardId}['"\`]\\)`, 'i');
    jsPopulatesMobile = jsRegex.test(html);
  }

  report.push({
    tabId,
    hasTable,
    tableCount: tables.length,
    hasHiddenDesktopTable,
    mobileCardId,
    jsPopulatesMobile,
    hasOverflowScroll
  });
}

console.table(report);
