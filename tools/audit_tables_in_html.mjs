import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

const tableMatches = [...html.matchAll(/<table[^>]*>/gi)];
console.log(`Total <table> elements in index.html: ${tableMatches.length}\n`);

tableMatches.forEach((m, idx) => {
  // Find which tab or modal contains this table
  const before = html.slice(0, m.index);
  const lastSection = before.lastIndexOf('<section');
  const lastModal = before.lastIndexOf('id="modal') !== -1 ? before.lastIndexOf('id="modal') : before.lastIndexOf('id="generalModal');
  
  let container = 'unknown';
  if (lastSection !== -1) {
    const sectionMatch = html.slice(lastSection, lastSection + 80).match(/id="([^"]+)"/);
    if (sectionMatch) container = '#' + sectionMatch[1];
  }
  
  console.log(`${idx + 1}. Container: ${container}`);
  console.log(`   Tag: ${m[0]}`);
});
