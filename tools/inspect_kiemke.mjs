import fs from 'fs';

const content = fs.readFileSync('public/index.html', 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('id="portal-kiemke"') || line.includes('id="audit') || line.includes('function renderAuditRows') || line.includes('function loadAudit')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
