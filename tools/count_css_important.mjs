import fs from 'fs';

const content = fs.readFileSync('src/css/style.css', 'utf8');
const lines = content.split(/\r?\n/);
let count = 0;
lines.forEach((line, idx) => {
  if (line.includes('!important')) {
    count++;
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
console.log(`Total !important in src/css/style.css: ${count}`);
