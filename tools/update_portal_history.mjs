import fs from 'fs';

let html = fs.readFileSync('public/index.html', 'utf8');

const startStr = 'window.renderHsOrdersList = function';
const startIdx = html.indexOf(startStr);
if (startIdx === -1) {
  console.error('startStr not found');
  process.exit(1);
}

const mobIdx = html.indexOf('// Mobile Cards', startIdx);
const endMarker = "`).join('');\r\n  }";
let endIdx = html.indexOf(endMarker, mobIdx);
let endLen = endMarker.length;
if (endIdx === -1) {
  const endMarkerLF = "`).join('');\n  }";
  endIdx = html.indexOf(endMarkerLF, mobIdx);
  endLen = endMarkerLF.length;
}

if (mobIdx === -1 || endIdx === -1) {
  console.error('mobIdx or endIdx not found');
  process.exit(1);
}

const replacement = `  // Mobile Cards
  if (mob) {
    mob.innerHTML = items.map(o => \`
      <div class="data-card space-y-3">
        <div class="flex items-center justify-between gap-2">
          \${cellCode(o.maDon)}
          \${cellBadge('neutral', o.trangThai || 'Mới tạo')}
        </div>
        <div class="font-medium text-sm text-gray-900 dark:text-white leading-snug">\${o.site}</div>
        <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
          <div>Ngày đặt: <b class="num text-gray-900 dark:text-white whitespace-nowrap">\${fmtDate(o.ngayDat)}</b></div>
          <div>Người đặt: <b>\${cellPerson(o.nguoiDat)}</b></div>
          <div>Số mặt hàng: <b class="num text-gray-900 dark:text-white">\${o.soDong} dòng</b></div>
          <div>Tổng SL: <b class="num text-gray-900 dark:text-white">\${fmtNum(o.tongSL)}</b></div>
          <div class="col-span-2 flex justify-between items-center pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-500 font-medium">Tổng giá trị đơn:</span>
            <span class="num font-semibold text-sm text-brand-600 dark:text-brand-400">\${fmtVND(o.tongTien)}</span>
          </div>
        </div>
        <button onclick="viewOrderDetail('\${o.maDon}')" class="btn btn-secondary w-full">
          <svg class="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span>Xem chi tiết</span>
        </button>
      </div>
    \`).join('');
  }`;

html = html.slice(0, mobIdx) + replacement.replace(/\n/g, '\r\n') + html.slice(endIdx + endLen);
fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Successfully updated portal-history mobile cards!');
