import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

// Find all occurrences of text-[9px], text-[10px], text-[11px] in public/index.html
const tinyMatches = [...html.matchAll(/text-\[(?:9|9\.5|10|10\.5|11)px\]/g)];
console.log(`Total tiny text classes in index.html: ${tinyMatches.length}`);

// Group by surrounding 100 chars
const snippets = tinyMatches.map(m => {
  const start = Math.max(0, m.index - 40);
  const end = Math.min(html.length, m.index + 60);
  return html.slice(start, end).replace(/\s+/g, ' ');
});

console.log('Sample occurrences:');
snippets.slice(0, 25).forEach((s, idx) => console.log(`${idx + 1}. ${s}`));
