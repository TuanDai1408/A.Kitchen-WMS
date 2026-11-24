import type { StockData } from './types';

declare const XLSX: any;
declare function showToast(msg: string): void;

/**
 * Excel Exporter for F&B Chain Stock Matrix
 * Compliant with User Rules: Font Aptos, Navy Header (#1F4E79), AutoFilter, Freeze Panes.
 */
export function exportFnbStockExcel(stockData: StockData | null): void {
  if (!stockData || !stockData.rows || stockData.rows.length === 0) {
    if (typeof showToast === 'function') showToast('Chưa có dữ liệu tồn kho để xuất Excel!');
    return;
  }

  try {
    const sites = stockData.sites || [];
    const rows = stockData.rows || [];
    const groupMap = stockData.groups || {};

    // Header row
    const headers = ['STT', 'Mã Hàng', 'Tên Hàng', 'Nhóm Hàng', 'ĐVT', 'Đơn Giá (đ)'];
    sites.forEach(s => {
      headers.push(s.ten || s.name || s.code);
    });

    // Prepare aoa
    const dataAOA: any[][] = [headers];

    rows.forEach((r, idx) => {
      const groupName = groupMap[r.group] || r.group;
      const rowData: any[] = [
        idx + 1,
        r.code,
        r.name,
        groupName,
        r.unit,
        r.price || 0
      ];
      sites.forEach(s => {
        const cell = r.cells ? r.cells[s.id] : undefined;
        rowData.push(cell ? (cell.book || 0) : 0);
      });
      dataAOA.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(dataAOA);
    const range = XLSX.utils.decode_range(ws['!ref']);

    // Set Column Widths
    const colWidths = [
      { wch: 6 },  // STT
      { wch: 14 }, // Mã Hàng
      { wch: 32 }, // Tên Hàng
      { wch: 18 }, // Nhóm Hàng
      { wch: 8 },  // ĐVT
      { wch: 14 }, // Đơn Giá
    ];
    sites.forEach(() => colWidths.push({ wch: 16 }));
    ws['!cols'] = colWidths;

    // Styling all cells according to user preferences: Aptos font, Navy Header (#1F4E79), etc.
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;

        const isHeader = (R === 0);

        if (isHeader) {
          ws[cellRef].s = {
            font: { name: 'Aptos', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '1F4E79' } },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            border: {
              top: { style: 'thin', color: { rgb: 'CCCCCC' } },
              bottom: { style: 'medium', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: 'CCCCCC' } },
              right: { style: 'thin', color: { rgb: 'CCCCCC' } }
            }
          };
        } else {
          // Data rows
          let alignH = 'left';
          let numFmt: string | undefined = undefined;

          if (C === 0 || C === 1 || C === 4) {
            alignH = 'center'; // STT, Mã Hàng, ĐVT
          } else if (C === 5 || C >= 6) {
            alignH = 'right';  // Đơn giá, Số lượng tồn
            numFmt = '#,##0.00';
          }

          // Check if negative stock
          const isNegative = (C >= 6 && typeof ws[cellRef].v === 'number' && ws[cellRef].v < 0);

          ws[cellRef].s = {
            font: {
              name: 'Aptos',
              sz: 11,
              bold: isNegative,
              color: { rgb: isNegative ? 'C00000' : '000000' }
            },
            alignment: { horizontal: alignH, vertical: 'center' },
            border: {
              top: { style: 'thin', color: { rgb: 'E5E5E5' } },
              bottom: { style: 'thin', color: { rgb: 'E5E5E5' } },
              left: { style: 'thin', color: { rgb: 'E5E5E5' } },
              right: { style: 'thin', color: { rgb: 'E5E5E5' } }
            }
          };
          if (numFmt && typeof ws[cellRef].v === 'number') {
            ws[cellRef].z = numFmt;
          }
        }
      }
    }

    // AutoFilter
    ws['!autofilter'] = { ref: ws['!ref'] };

    // Freeze Panes (Freeze Header and Item Code/Name columns)
    ws['!freeze'] = {
      xSplit: 3,
      ySplit: 1,
      topLeftCell: 'D2',
      activePane: 'bottomRight',
      state: 'frozen'
    };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tồn Kho Chuỗi F&B');

    const dStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    XLSX.writeFile(wb, `Ton_Kho_F&B_Chuoi_${dStr}.xlsx`);
    if (typeof showToast === 'function') showToast('Xuất báo cáo tồn kho F&B thành công (Font Aptos)!');
  } catch (err: any) {
    console.error('Export Excel error:', err);
    if (typeof showToast === 'function') showToast('Lỗi xuất Excel: ' + (err?.message || err));
  }
}
