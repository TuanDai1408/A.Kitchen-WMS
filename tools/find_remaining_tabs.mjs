import fs from 'fs';

const content = fs.readFileSync('public/index.html', 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('id="wh-dashboard"') || line.includes('id="fnb-chain"') || line.includes('id="fnb-pl"') || line.includes('id="fnb-pos"')) {
    console.log(`${idx + 1}: ${line.trim().slice(0, 80)}`);
  }
});
