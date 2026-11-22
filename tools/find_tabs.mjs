import fs from 'fs';

const content = fs.readFileSync('public/index.html', 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  const match = line.match(/id="(wh-[a-z0-9_-]+|fnb-[a-z0-9_-]+|portal-[a-z0-9_-]+)"/);
  if (match) {
    console.log(`${idx + 1}: ${match[0]}`);
  }
});
