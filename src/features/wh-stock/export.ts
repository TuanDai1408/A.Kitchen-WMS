import type { StockFefoItem } from './types';
import { selectedStockSkus } from './fefo-table';
import { formatBatchCode, formatUnit, parseQty } from './helpers';

declare const XLSX: any;
declare const App: { fefoItems?: StockFefoItem[]; [key: string]: any };
declare function showToast(msg: string): void;

/**
 * Common styled Excel exporter strictly compliant with User Preferences:
 * - Font: Aptos (all cells)
 * - Header: Font Aptos, Size 11, Bold, Navy (#1F4E79) background, White text, centered.
 * - Data: Font Aptos, Size 11, Regular.
 * - Alignment: Numbers right, Codes / Dates / Status center, Text left.
 * - Features: Freeze panes on row 1, AutoFilter on all columns.
 */
function exportStyledFefoWorkbook(fileName: string, sheetName: string, items: StockFefoItem[]): void {
  const headers = [
    'Ưu Tiên FEFO',
    'Mã SKU',
    'Tên Mặt Hàng',
    'Mã Lô',
    'Hạn Dùng (EXP)',
    'Số Lượng Tồn',
    'Đơn Vị',
    'Số Ngày Còn',
    'Trạng Thái'
  ];

  const dataAOA: any[][] = [headers];

  items.forEach(r => {
    const priority = r.fefo_priority ?? 1;
    const sku = r.sku || '';
    const itemName = r.item_name || '';
    const batchCode = formatBatchCode(r);
    const expDate = r.exp_date ? r.exp_date.slice(0, 10) : '—';
    const qty = parseQty(r.qty);
    const unit = formatUnit(r);
    const daysLeft = r.days_remaining !== undefined ? r.days_remaining : (r.days_left !== undefined ? r.days_left : 45);
    const statusText = r.status_text || 'An toàn';

    dataAOA.push([
      priority,
      sku,
      itemName,
      batchCode,
      expDate,
      qty,
      unit,
      daysLeft,
      statusText
    ]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(dataAOA);
  const range = XLSX.utils.decode_range(ws['!ref']);

  // Set explicit column widths
  ws['!cols'] = [
    { wch: 14 }, // Ưu Tiên FEFO
    { wch: 14 }, // Mã SKU
    { wch: 34 }, // Tên Mặt Hàng
    { wch: 16 }, // Mã Lô
    { wch: 16 }, // Hạn Dùng
    { wch: 14 }, // Số Lượng Tồn
    { wch: 10 }, // Đơn Vị
    { wch: 14 }, // Số Ngày Còn
    { wch: 16 }, // Trạng Thái
  ];

  // Apply styling
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellRef]) continue;

      if (R === 0) {
        // Navy Header
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

        // C: 0=Priority(center), 1=SKU(center), 2=Name(left), 3=Batch(center), 4=EXP(center), 5=Qty(right), 6=Unit(center), 7=Days(right), 8=Status(center)
        if (C === 0 || C === 1 || C === 3 || C === 4 || C === 6 || C === 8) {
          alignH = 'center';
        } else if (C === 5 || C === 7) {
          alignH = 'right';
          if (C === 5) numFmt = '#,##0.00';
          if (C === 7) numFmt = '#,##0';
        }

        const isNegative = (C === 5 && typeof ws[cellRef].v === 'number' && ws[cellRef].v < 0);

        ws[cellRef].s = {
          font: {
            name: 'Aptos',
            sz: 11,
            bold: false,
            color: { rgb: isNegative ? 'C00000' : '000000' }
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

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
}

/**
 * Export full FEFO list to Excel
 */
export function exportFefoToExcel(): void {
  const fefoItems = (typeof App !== 'undefined' && App.fefoItems) ? App.fefoItems : [];
  if (!fefoItems || !fefoItems.length) {
    if (typeof showToast === 'function') showToast('Chưa có dữ liệu tồn kho để xuất Excel!');
    return;
  }
  exportStyledFefoWorkbook('Danh_Sach_Ton_Kho_FEFO.xlsx', 'TonKhoFEFO', fefoItems);
}

/**
 * Export only selected stock items to Excel
 */
export function exportSelectedStockExcel(): void {
  if (selectedStockSkus.size === 0) {
    if (typeof showToast === 'function') showToast('Vui lòng chọn ít nhất 1 mặt hàng để xuất Excel!');
    return;
  }
  const fefoItems = (typeof App !== 'undefined' && App.fefoItems) ? App.fefoItems : [];
  const selectedItems = fefoItems.filter(i => selectedStockSkus.has(i.sku));
  exportStyledFefoWorkbook('Ton_Kho_Duoc_Chon.xlsx', 'DuocChon', selectedItems);
}
