import fs from 'fs';

const content = fs.readFileSync('public/index.html', 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('kkBody') || line.includes('kkMobileCards') || line.includes('function renderAudit') || line.includes('renderKkRows') || line.includes('filterAuditItems')) {
    console.log(`${idx + 1}: ${line.trim().slice(0, 100)}`);
  }
});
