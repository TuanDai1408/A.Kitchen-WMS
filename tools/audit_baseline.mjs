import fs from 'fs';
import path from 'path';

const htmlPath = 'public/index.html';
const cssPath = 'src/css/style.css';

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

// 1. Số !important trong style.css
const importantMatches = css.match(/!important/g) || [];

// 2. Class patterns
function extractClassVariants(regex) {
  const matches = [...html.matchAll(regex)];
  const classSet = new Set();
  let totalCount = 0;
  for (const m of matches) {
    totalCount++;
    const classAttr = m[1] || '';
    const normalized = classAttr.trim().split(/\s+/).sort().join(' ');
    classSet.add(normalized);
  }
  return { total: totalCount, unique: classSet.size };
}

// Select
const selectStats = extractClassVariants(/<select[^>]*class=["']([^"']*)["'][^>]*>/gi);

// Input (text, number, date, month, etc.)
const inputStats = extractClassVariants(/<input[^>]*class=["']([^"']*)["'][^>]*>/gi);

// Button
const buttonStats = extractClassVariants(/<button[^>]*class=["']([^"']*)["'][^>]*>/gi);

// Th
const thStats = extractClassVariants(/<th[^>]*class=["']([^"']*)["'][^>]*>/gi);

// Td
const tdStats = extractClassVariants(/<td[^>]*class=["']([^"']*)["'][^>]*>/gi);

// Badge: rounded-full + px-2 / px-2.5 / badge
const badgeStats = extractClassVariants(/class=["']([^"']*(?:rounded-full|badge)[^"']*)["']/gi);

// 3. Emojis
// Matches common emoji unicode ranges
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F100}-\u{1F1FF}\u{1FA00}-\u{1FAFF}\u{2B50}\u{203C}\u{2049}\u{2194}-\u{21AA}]/gu;
const allEmojis = html.match(emojiRegex) || [];

const optionMatches = [...html.matchAll(/<option[^>]*>([^<]*)<\/option>/gi)];
let optionEmojiTotal = 0;
let optionsWithEmoji = 0;
for (const opt of optionMatches) {
  const text = opt[1];
  const m = text.match(emojiRegex);
  if (m) {
    optionEmojiTotal += m.length;
    optionsWithEmoji++;
  }
}

// 4. Số nút bg-emerald
const emeraldButtons = [...html.matchAll(/<button[^>]*class=["'][^"']*bg-emerald-[^"']*["'][^>]*>/gi)];

// 5. Số tracking-wider
const trackingWiderMatches = html.match(/tracking-wider/gi) || [];

// 6. Số input type=month & type=date
const dateInputs = [...html.matchAll(/<input[^>]*type=["']date["'][^>]*>/gi)];
const monthInputs = [...html.matchAll(/<input[^>]*type=["']month["'][^>]*>/gi)];

// 7. Tabular-nums occurrences in HTML
const tabularNumsMatches = html.match(/tabular-nums/gi) || [];

const report = {
  selectStats,
  inputStats,
  buttonStats,
  thStats,
  tdStats,
  badgeStats,
  importantCount: importantMatches.length,
  totalEmojisInHtml: allEmojis.length,
  optionsWithEmoji,
  optionEmojiTotal,
  emeraldButtonsCount: emeraldButtons.length,
  trackingWiderCount: trackingWiderMatches.length,
  dateInputsCount: dateInputs.length,
  monthInputsCount: monthInputs.length,
  tabularNumsCount: tabularNumsMatches.length
};

console.log(JSON.stringify(report, null, 2));
