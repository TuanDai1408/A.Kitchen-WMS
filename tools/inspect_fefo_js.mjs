import fs from 'fs';

const content = fs.readFileSync('public/index.html', 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('fefoTableBody') || line.includes('fefoMobileCards') || line.includes('function renderStockTable') || line.includes('renderFefo')) {
    console.log(`${idx + 1}: ${line.trim().slice(0, 100)}`);
  }
});
