import type { RopItem } from './types';

declare const XLSX: any;
declare const App: { ropItems?: RopItem[]; [key: string]: any };
declare function showToast(msg: string): void;

/**
 * Excel Exporter for ROP Reorder Suggestions
 * Strictly compliant with User Preferences:
 * - Font: Aptos (all cells)
 * - Header: Font Aptos, Size 11, Bold, Navy (#1F4E79) background, White text.
 * - Data: Font Aptos, Size 11, Regular.
 * - Alignment: Numbers right, Codes / Dates / Status center, Text left.
 * - Freeze panes on row 1, AutoFilter on all columns.
 */
export function downloadRopExcel(): void {
  const ropItems = (typeof App !== 'undefined' && App.ropItems) ? App.ropItems : [];
  if (!ropItems || !ropItems.length) {
    if (typeof showToast === 'function') showToast('Chưa có dữ liệu cảnh báo ROP để xuất Excel!');
    return;
  }

  const headers = [
    'Mã SKU',
    'Tên Gia Vị / Mặt Hàng',
    'ĐVT',
    'Tiêu Thụ/Ngày',
    'Lead Time (ngày)',
    'Tồn An Toàn',
    'Tồn Hiện Tại',
    'Ngưỡng ROP',
    'Đề Xuất Đặt',
    'Trạng Thái'
  ];

  const dataAOA: any[][] = [headers];

  ropItems.forEach(r => {
    const sku = r.sku || '';
    const itemName = r.item_name || sku;
    const unit = r.unit || r.uom || 'Phần';
    const dailyUsage = parseFloat(String(r.daily_usage !== undefined ? r.daily_usage : 10));
    const leadTimeDays = r.lead_time_days !== undefined
      ? parseFloat(String(r.lead_time_days))
      : (r.lead_time_hours ? Math.round(parseFloat(String(r.lead_time_hours)) / 24) : 2);
    const safetyStock = parseFloat(String(r.safety_stock !== undefined ? r.safety_stock : 5));
    const currentStock = parseFloat(String(r.current_stock !== undefined ? r.current_stock : 0));
    const rop = parseFloat(String(r.rop !== undefined ? r.rop : (r.rop_threshold !== undefined ? r.rop_threshold : 25)));
    const suggestedOrder = parseFloat(String(r.suggested_order !== undefined
      ? r.suggested_order
      : (r.suggested_order_qty !== undefined ? r.suggested_order_qty : (currentStock < rop ? Math.max(0, 35 - currentStock) : 0))));
    const status = r.status || (currentStock <= 0 ? 'HẾT HÀNG' : (currentStock < rop ? 'CẦN ĐẶT' : 'AN TOÀN'));

    dataAOA.push([
      sku,
      itemName,
      unit,
      dailyUsage,
      leadTimeDays,
      safetyStock,
      currentStock,
      rop,
      suggestedOrder,
      status
    ]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(dataAOA);
  const range = XLSX.utils.decode_range(ws['!ref']);

  // Set explicit column widths
  ws['!cols'] = [
    { wch: 14 }, // Mã SKU
    { wch: 34 }, // Tên Mặt Hàng
    { wch: 10 }, // ĐVT
    { wch: 14 }, // Tiêu Thụ/Ngày
    { wch: 16 }, // Lead Time (ngày)
    { wch: 14 }, // Tồn An Toàn
    { wch: 14 }, // Tồn Hiện Tại
    { wch: 14 }, // Ngưỡng ROP
    { wch: 14 }, // Đề Xuất Đặt
    { wch: 16 }, // Trạng Thái
  ];

  // Apply Aptos styling
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellRef]) continue;

      if (R === 0) {
        // Navy Header (#1F4E79)
        ws[cellRef].s = {
          font: { name: 'Aptos', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '1F4E79' } },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
          border: {
            top: { style: 'thin', color: { rgb: 'D0D5DD' } },
            bottom: { style: 'medium', color: { rgb: '0F2842' } },
            left: { style: 'thin', color: { rgb: 'D0D5DD' } },
            right: { style: 'thin', color: { rgb: 'D0D5DD' } }
          }
        };
      } else {
        // Data row
        let alignH = 'left';
        let numFmt: string | undefined = undefined;

        // C: 0=SKU(center), 1=Name(left), 2=Unit(center), 3..8=Numbers(right), 9=Status(center)
        if (C === 0 || C === 2 || C === 9) {
          alignH = 'center';
        } else if (C >= 3 && C <= 8) {
          alignH = 'right';
          numFmt = '#,##0.0';
          if (C === 4 || C === 8) numFmt = '#,##0';
        }

        const isNegativeOrZeroStock = (C === 6 && typeof ws[cellRef].v === 'number' && ws[cellRef].v <= 0);

        ws[cellRef].s = {
          font: {
            name: 'Aptos',
            sz: 11,
            bold: (C === 6 || C === 8),
            color: { rgb: isNegativeOrZeroStock ? 'C00000' : '000000' }
          },
          alignment: { horizontal: alignH, vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: 'E4E7EC' } },
            bottom: { style: 'thin', color: { rgb: 'E4E7EC' } },
            left: { style: 'thin', color: { rgb: 'E4E7EC' } },
            right: { style: 'thin', color: { rgb: 'E4E7EC' } }
          }
        };

        if (numFmt) {
          ws[cellRef].z = numFmt;
        }
      }
    }
  }

  // Freeze header row & apply AutoFilter
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  ws['!autofilter'] = { ref: ws['!ref'] };

  XLSX.utils.book_append_sheet(wb, ws, 'ROP');
  XLSX.writeFile(wb, 'De_Xuat_Dat_Hang_ROP.xlsx');
}
