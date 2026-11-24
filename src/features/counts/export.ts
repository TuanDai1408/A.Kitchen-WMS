import { getActiveFnbCountSite } from './helpers';
import type { FnbCountItem } from './types';

declare const window: any;
declare const XLSX: any;

export function exportCountSheetExcel(): void {
  const currentItems: FnbCountItem[] = window.gCurrentCountItems || [];
  if (!currentItems || !currentItems.length) {
    if (typeof window.showToast === 'function') {
      window.showToast('Không có dữ liệu mặt hàng để xuất phiếu kiểm!');
    }
    return;
  }
  const siteCode = getActiveFnbCountSite();
  const countDate = (document.getElementById('fnbCountDatePicker') as HTMLInputElement | null)?.value || new Date().toISOString().slice(0, 10);

  const headers = [
    'STT',
    'Mã Hàng',
    'Tên Hàng',
    'Ngành Hàng',
    'Nhóm Hàng',
    'ĐVT',
    'Đơn Giá (đ)',
    'Tồn Sổ Sách',
    'Số Đếm Thực Tế',
    'Chênh Lệch',
    'Ghi Chú'
  ];

  const rows: any[][] = [headers];

  currentItems.forEach((i, idx) => {
    const book = Number(i.book_qty) || 0;
    const count = (i.userCount !== undefined) ? Number(i.userCount) : (i.last_count_qty !== null && i.last_count_qty !== undefined ? Number(i.last_count_qty) : book);
    const diff = count - book;
    rows.push([
      idx + 1,
      i.code,
      i.name,
      i.nganh_hang || '',
      i.nhom_hang || i.item_group || '',
      i.unit,
      Number(i.unit_price) || 0,
      book,
      count,
      diff,
      i.userNote || ''
    ]);
  });

  if (typeof XLSX === 'undefined') {
    if (typeof window.showToast === 'function') {
      window.showToast('Thư viện XLSX chưa sẵn sàng!');
    }
    return;
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    { wch: 6 },
    { wch: 15 },
    { wch: 32 },
    { wch: 20 },
    { wch: 22 },
    { wch: 8 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 14 },
    { wch: 25 }
  ];

  // Enable AutoFilter on header row
  ws['!autofilter'] = { ref: `A1:K${rows.length}` };

  // Enable Freeze Panes for header row
  ws['!views'] = [{ state: 'frozen', ySplit: 1, xSplit: 0 }];

  // Styling conforming to User Standards (Aptos font, Navy header #1F4E79, White text)
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:K1');
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellRef]) continue;

      if (R === 0) {
        // Header styling: Navy, White Bold text, Aptos 11
        ws[cellRef].s = {
          font: { name: 'Aptos', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '1F4E79' } },
          alignment: { vertical: 'center', horizontal: C === 0 || C === 1 ? 'center' : (C >= 6 && C <= 9 ? 'right' : 'left'), wrapText: false }
        };
      } else {
        // Data styling: Aptos 11 Regular, Proper alignment
        const isNumeric = C === 0 || (C >= 6 && C <= 9);
        const isCenter = C === 1 || C === 5;
        ws[cellRef].s = {
          font: { name: 'Aptos', sz: 11, regular: true, color: { rgb: '000000' } },
          alignment: {
            vertical: 'center',
            horizontal: isNumeric ? 'right' : (isCenter ? 'center' : 'left')
          }
        };
      }
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PhieuKiemKe');
  XLSX.writeFile(wb, `Phieu_Kiem_Ke_${siteCode}_${countDate}.xlsx`);

  if (typeof window.showToast === 'function') {
    window.showToast('Đã xuất phiếu kiểm kê Excel theo quy chuẩn Aptos!');
  }
}
