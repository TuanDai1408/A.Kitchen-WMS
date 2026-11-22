import fs from 'fs';

let html = fs.readFileSync('public/index.html', 'utf8');

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F100}-\u{1F1FF}\u{1FA00}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{200D}\u{2B50}\u{203C}\u{2049}\u{2194}-\u{21AA}]/gu;

let cleanedCount = 0;
html = html.replace(/(<option[^>]*>)([^<]*)(<\/option>)/gi, (match, openTag, text, closeTag) => {
  if (emojiRegex.test(text)) {
    cleanedCount++;
    const cleanText = text.replace(emojiRegex, '').trim();
    return `${openTag}${cleanText}${closeTag}`;
  }
  return match;
});

console.log('Cleaned options count:', cleanedCount);
fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Saved public/index.html with cleaned options!');
