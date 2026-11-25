import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');
const lines = html.split('\n');

const modals = [];
lines.forEach((line, idx) => {
  if (line.includes('fixed inset-0') && line.includes('id=')) {
    const idMatch = line.match(/id="([^"]+)"/);
    const id = idMatch ? idMatch[1] : 'unknown';
    // look ahead for inner modal card
    let innerCard = '';
    for (let j = idx + 1; j < Math.min(idx + 10, lines.length); j++) {
      if (lines[j].includes('max-w-')) {
        innerCard = lines[j].trim();
        break;
      }
    }
    const maxW = innerCard.match(/max-w-[a-zA-Z0-9_-]+/)?.[0] || 'no max-w';
    modals.push({ line: idx + 1, id, maxW, innerCard: innerCard.slice(0, 100) });
  }
});

console.log(JSON.stringify(modals, null, 2));
