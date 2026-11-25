import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');
const lines = html.split('\n');

const siteSelects = [];
lines.forEach((line, idx) => {
  if (line.includes('<select') && (line.toLowerCase().includes('site') || line.toLowerCase().includes('branch'))) {
    const idMatch = line.match(/id="([^"]+)"/);
    if (idMatch) {
      siteSelects.push({ line: idx + 1, id: idMatch[1], html: line.trim() });
    }
  }
});

console.log(JSON.stringify(siteSelects, null, 2));
