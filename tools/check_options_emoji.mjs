import fs from 'fs';

const html = fs.readFileSync('public/index.html', 'utf8');
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F100}-\u{1F1FF}\u{1FA00}-\u{1FAFF}\u{2B50}\u{203C}\u{2049}\u{2194}-\u{21AA}]/gu;

const optionMatches = [...html.matchAll(/(<option[^>]*>)([^<]*)(<\/option>)/gi)];
console.log('Total options:', optionMatches.length);

const dirtyOptions = [];
optionMatches.forEach((m, idx) => {
  const text = m[2];
  if (emojiRegex.test(text)) {
    const cleanText = text.replace(emojiRegex, '').trim();
    dirtyOptions.push({
      full: m[0],
      clean: `${m[1]}${cleanText}${m[3]}`,
      originalText: text,
      cleanText
    });
  }
});

console.log('Options with emoji:', dirtyOptions.length);
dirtyOptions.slice(0, 10).forEach(d => console.log(`"${d.originalText}" -> "${d.cleanText}"`));
