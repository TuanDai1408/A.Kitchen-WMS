import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

const p29 = 675804;
console.log('=== JS Table Generator around 675804 ===');
console.log(html.slice(p29 - 150, p29 + 600));

const p30 = 707435;
console.log('=== JS Table Generator around 707435 ===');
console.log(html.slice(p30 - 150, p30 + 600));

const p31 = 735682;
console.log('=== JS Table Generator around 735682 ===');
console.log(html.slice(p31 - 150, p31 + 600));
