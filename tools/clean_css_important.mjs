import fs from 'fs';

const filePath = 'src/css/style.css';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove font-weight !important
content = content.replace(
  `.font-bold,\n.font-extrabold,\n.font-black {\n  font-weight: 600 !important;\n}`,
  `.font-bold,\n.font-extrabold,\n.font-black {\n  font-weight: 600;\n}`
);

// 2. Remove font-size 12px !important forcing rule
content = content.replace(
  `caption,\nsmall,\n.caption,\n.text-caption,\n.text-xs,\n.text-\\[9px\\],\n.text-\\[9\\.5px\\],\n.text-\\[10px\\],\n.text-\\[10\\.5px\\],\n.text-\\[11px\\] {\n  font-size: 12px !important;\n}`,
  `caption,\nsmall,\n.caption,\n.text-caption {\n  font-size: 12px;\n}`
);

// 3. Remove KPI value 27px !important and 600 !important
content = content.replace(
  `.kpi-value,\n.kpi-stat,\n.stat-value,\n.kpi-card-hero-num,\n.kpi-card-standard-num,\n.kpi-card-compact-num,\n.kpi-value-hero,\n.kpi-value-compact {\n  font-size: 27px !important;\n  font-weight: 600 !important;\n  font-variant-numeric: normal;\n  font-feature-settings: normal;\n}`,
  `.kpi-value,\n.kpi-stat,\n.stat-value,\n.kpi-card-hero-num,\n.kpi-card-standard-num,\n.kpi-card-compact-num,\n.kpi-value-hero,\n.kpi-value-compact {\n  font-size: 26px;\n  font-weight: 600;\n  font-variant-numeric: normal;\n  font-feature-settings: normal;\n}`
);

// 4. Clean .btn-sm
content = content.replace(
  `.btn-sm {\n  height: 2rem !important; /* 32px (h-8) */\n  min-height: 32px !important;\n  padding-left: 0.75rem !important;\n  padding-right: 0.75rem !important;\n  font-size: 13px !important;\n}`,
  `.btn-sm {\n  height: 2rem; /* 32px (h-8) */\n  min-height: 32px;\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n  font-size: 13px;\n}`
);

// 5. Clean KPI dark mode !important (lines 1038 to 1246)
content = content.replace(/(:is\(\.dark \*\) \.kpi-[\s\S]*?\.dark \.kpi-skeleton\s*\{\s*background-color: #1f2937) !important;/g, (match) => {
  return match.replace(/ !important;/g, ';');
});

// Clean .dark input surface !important (lines 1420 to 1452)
const darkInputBlockStart = content.indexOf('.dark input:not([type="checkbox"])');
const darkInputBlockEnd = content.indexOf('.dark input[type="date"]::-webkit-calendar-picker-indicator', darkInputBlockStart);
if (darkInputBlockStart !== -1 && darkInputBlockEnd !== -1) {
  let block = content.substring(darkInputBlockStart, darkInputBlockEnd);
  block = block.replace(/ !important;/g, ';');
  content = content.substring(0, darkInputBlockStart) + block + content.substring(darkInputBlockEnd);
}

// Clean tailadmin dark bg-white surfaces (lines 1616 to 1628)
content = content.replace(
  `:is(.dark *) .dark\\:bg-white\\/3,\n.dark .dark\\:bg-white\\/3 {\n  background-color: rgba(255, 255, 255, 0.03) !important;\n}\n:is(.dark *) .dark\\:bg-white\\/2,\n.dark .dark\\:bg-white\\/2 {\n  background-color: rgba(255, 255, 255, 0.02) !important;\n}\n:is(.dark *) .dark\\:bg-white\\/5,\n.dark .dark\\:bg-white\\/5 {\n  background-color: rgba(255, 255, 255, 0.05) !important;\n}`,
  `:is(.dark *) .dark\\:bg-white\\/3,\n.dark .dark\\:bg-white\\/3 {\n  background-color: rgba(255, 255, 255, 0.03);\n}\n:is(.dark *) .dark\\:bg-white\\/2,\n.dark .dark\\:bg-white\\/2 {\n  background-color: rgba(255, 255, 255, 0.02);\n}\n:is(.dark *) .dark\\:bg-white\\/5,\n.dark .dark\\:bg-white\\/5 {\n  background-color: rgba(255, 255, 255, 0.05);\n}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleaned legacy !important in style.css');
