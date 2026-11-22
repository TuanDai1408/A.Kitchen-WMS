import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');

const p = html.indexOf('id="addUserModal"');
console.log('=== addUserModal ===');
console.log(html.slice(p, p + 2000));
