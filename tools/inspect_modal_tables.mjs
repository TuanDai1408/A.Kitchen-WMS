import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

// Find all modal tables and print their exact snippet
const tableMatches = [...html.matchAll(/<table[^>]*>/gi)];
console.log('Tables 20-31:');
tableMatches.slice(20).forEach((m, idx) => {
  console.log(`\n--- Table ${idx + 21} at index ${m.index} ---`);
  console.log(html.slice(m.index - 100, m.index + 250).replace(/\r?\n/g, ' '));
});
