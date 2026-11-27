import { getSiteFullLabel } from '@/features/kitchen-issue/helpers';
import { formatReceiptDateYMD } from './helpers';

declare const XLSX: any;
declare const ExcelJS: any;
declare const showToast: (msg: string, type?: string) => void;

export interface ReceiptExportLine {
  item_code: string;
  item_name?: string;
  unit?: string;
  qty: number;
  unit_price: number;
  amount: number;
  batch_code?: string;
  exp_date?: string | null;
  mfg_date?: string | null;
  note?: string;
}

export interface ReceiptExportSlip {
  id?: string | number;
  receipt_code: string;
  site_code: string;
  receipt_date: string;
  supplier?: string;
  invoice_no?: string;
  total_amount?: number;
  notes?: string;
  created_by?: string;
  lines: ReceiptExportLine[];
}

/**
 * Xuất Phiếu Nhập Kho Tại Site ra file Excel chuẩn A.KITCHEN (Font Aptos, Logo, Navy Header, không gridlines)
 */
export async function exportReceiptExcel(receipt: ReceiptExportSlip): Promise<void> {
  if (!receipt || !receipt.lines || receipt.lines.length === 0) {
    if (typeof showToast === 'function') {
      showToast('Không có dữ liệu mặt hàng để xuất Excel', 'warning');
    }
    return;
  }

  const safeDate = formatReceiptDateYMD(receipt.receipt_date).replace(/-/g, '') || new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const safeCode = String(receipt.receipt_code || `PNK_${receipt.id || ''}`).replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `A.Kitchen_PhieuNhapKho_${safeCode}_${safeDate}.xlsx`;
  const siteFullLabel = getSiteFullLabel(receipt.site_code);

  try {
    if (typeof ExcelJS !== 'undefined') {
      await exportReceiptWithExcelJS(receipt, fileName, siteFullLabel);
      return;
    }

    if (typeof XLSX !== 'undefined') {
      exportReceiptWithXlsxFallback(receipt, fileName, siteFullLabel);
      return;
    }

    if (typeof showToast === 'function') {
      showToast('Lỗi: Thư viện xuất Excel chưa sẵn sàng', 'error');
    }
  } catch (err: any) {
    console.error('exportReceiptExcel error:', err);
    if (typeof showToast === 'function') {
      showToast('Lỗi khi xuất file Excel phiếu nhập kho: ' + err.message, 'error');
    }
  }
}

async function exportReceiptWithExcelJS(receipt: ReceiptExportSlip, fileName: string, siteFullLabel: string): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'A.KITCHEN WMS';
  wb.lastModifiedBy = receipt.created_by || 'Thủ kho';
  wb.created = new Date();
  wb.modified = new Date();

  const ws = wb.addWorksheet('Phieu_Nhap_Kho', {
    views: [
      {
        showGridLines: false,
        state: 'frozen',
        xSplit: 0,
        ySplit: 12
      }
    ],
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0
    }
  });

  // Tải logo công ty
  let logoBuffer: ArrayBuffer | null = null;
  try {
    const res = await fetch('/assets/brand/logo-horizontal.png');
    if (res.ok) logoBuffer = await res.arrayBuffer();
  } catch (e) {}

  if (logoBuffer) {
    const imageId = wb.addImage({ buffer: logoBuffer, extension: 'png' });
    ws.addImage(imageId, {
      tl: { col: 0.1, row: 0.2 },
      ext: { width: 176, height: 40 }
    });
  }

  // 1. Header công ty
  ws.mergeCells('C1:J1');
  const c1 = ws.getCell('C1');
  c1.value = 'CÔNG TY CỔ PHẦN SUẤT ĂN CÔNG NGHIỆP A.KITCHEN';
  c1.font = { name: 'Aptos', size: 11, bold: true, color: { argb: 'FF1F4E79' } };
  c1.alignment = { vertical: 'middle', horizontal: 'left' };

  ws.mergeCells('C2:J2');
  const c2 = ws.getCell('C2');
  c2.value = 'Bộ phận: Quản Trị Kho Vận & Vận Hành WMS';
  c2.font = { name: 'Aptos', size: 10, bold: true, color: { argb: 'FF374151' } };
  c2.alignment = { vertical: 'middle', horizontal: 'left' };

  ws.mergeCells('C3:J3');
  const c3 = ws.getCell('C3');
  c3.value = 'Địa chỉ: Tầng 2, Tòa nhà Oxygen, 628C Võ Nguyên Giáp, Phường An Khánh, TP. Hồ Chí Minh.';
  c3.font = { name: 'Aptos', size: 9.5, italic: true, color: { argb: 'FF6B7280' } };
  c3.alignment = { vertical: 'middle', horizontal: 'left' };

  ws.getRow(1).height = 20;
  ws.getRow(2).height = 18;
  ws.getRow(3).height = 18;
  ws.getRow(4).height = 10;

  // 2. Tiêu đề Phiếu
  const receiptDateStr = formatReceiptDateYMD(receipt.receipt_date) || '—';
  ws.mergeCells('B5:I5');
  const c5 = ws.getCell('B5');
  c5.value = 'PHIẾU NHẬP KHO NGUYÊN VẬT LIỆU TẠI SITE';
  c5.font = { name: 'Aptos', size: 16, bold: true, color: { argb: 'FF1F4E79' } };
  c5.alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getRow(5).height = 28;

  ws.mergeCells('B6:I6');
  const c6 = ws.getCell('B6');
  c6.value = `Mã phiếu nhập: ${receipt.receipt_code}   •   Ngày nhập: ${receiptDateStr}`;
  c6.font = { name: 'Aptos', size: 10, italic: true, color: { argb: 'FF4B5563' } };
  c6.alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getRow(6).height = 18;
  ws.getRow(7).height = 10;

  // 3. Khối thông tin nghiệp vụ
  ws.getRow(8).values = [
    'Điểm bán / Bếp:',
    siteFullLabel,
    '',
    'Nhà cung cấp / Nguồn:',
    receipt.supplier || 'Bếp Trung Tâm Siba',
    '',
    'Số đơn PO / HĐ:',
    receipt.invoice_no || 'Nhập ngoài PO/PR',
    '',
    ''
  ];
  ws.mergeCells('B8:C8');
  ws.mergeCells('E8:F8');
  ws.mergeCells('H8:J8');

  ws.getRow(9).values = [
    'Người nhập kho:',
    receipt.created_by || 'Thủ kho',
    '',
    'Ngày nhập thực tế:',
    receiptDateStr,
    '',
    'Trạng thái:',
    'ĐÃ NHẬP KHO & CẬP NHẬT TỒN',
    '',
    ''
  ];
  ws.mergeCells('B9:C9');
  ws.mergeCells('E9:F9');
  ws.mergeCells('H9:J9');

  ws.getRow(10).values = [
    'Ghi chú phiếu:',
    receipt.notes || 'Phiếu nhập kho nguyên vật liệu tại điểm bán theo quy trình kiểm soát chất lượng WMS',
    '', '', '', '', '', '', '', ''
  ];
  ws.mergeCells('B10:J10');

  [8, 9, 10].forEach(rIdx => {
    const row = ws.getRow(rIdx);
    row.height = 20;
    row.eachCell({ includeEmpty: false }, (cell: any, colNumber: number) => {
      cell.font = { name: 'Aptos', size: 10 };
      cell.alignment = { vertical: 'middle' };
      if ([1, 4, 7].includes(colNumber)) {
        cell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: 'FF374151' } };
      } else if (rIdx === 9 && colNumber === 8) {
        cell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: 'FF047857' } };
      } else if (colNumber === 2 && rIdx === 8) {
        cell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: 'FF1F4E79' } };
      }
    });
  });
  ws.getRow(11).height = 10;

  // 4. Header Bảng Chi Tiết (Dòng 12)
  const headerRow = ws.getRow(12);
  headerRow.height = 26;
  headerRow.values = [
    'STT',
    'Mã Hàng (SKU)',
    'Tên Nguyên Vật Liệu / Thực Phẩm',
    'ĐVT',
    'SL Nhập',
    'Mã Lô SX',
    'Hạn Dùng (EXP)',
    'Đơn Giá (VNĐ)',
    'Thành Tiền (VNĐ)',
    'Ghi Chú'
  ];

  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
  const headerFont = { name: 'Aptos', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    bottom: { style: 'medium', color: { argb: 'FF1F4E79' } },
    right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
  };

  headerRow.eachCell((cell: any) => {
    cell.fill = headerFill as any;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = thinBorder as any;
  });

  // 5. Dữ liệu mặt hàng
  let sumQty = 0;
  let sumAmount = 0;
  let currentRowIndex = 13;

  const dataBorder = {
    top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
  };

  const lines = receipt.lines || [];
  lines.forEach((item, idx) => {
    const qty = Number(item.qty) || 0;
    const unitPrice = Number(item.unit_price) || 0;
    const amount = Number(item.amount) || (qty * unitPrice);
    const expStr = item.exp_date ? String(item.exp_date).slice(0, 10) : '--';

    sumQty += qty;
    sumAmount += amount;

    const row = ws.getRow(currentRowIndex);
    row.height = 22;
    row.values = [
      idx + 1,
      item.item_code,
      item.item_name || item.item_code,
      item.unit || 'Phần',
      qty,
      item.batch_code || '--',
      expStr,
      unitPrice,
      amount,
      item.note || ''
    ];

    row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(5).alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(8).alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell(9).alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell(10).alignment = { vertical: 'middle', horizontal: 'left' };

    row.getCell(5).numFmt = '#,##0.##';
    row.getCell(8).numFmt = '#,##0" ₫"';
    row.getCell(9).numFmt = '#,##0" ₫"';

    for (let col = 1; col <= 10; col++) {
      const cell = row.getCell(col);
      cell.font = col === 9
        ? { name: 'Aptos', size: 11, bold: true, color: { argb: 'FF1F4E79' } }
        : { name: 'Aptos', size: 11 };
      cell.border = dataBorder as any;
    }

    currentRowIndex++;
  });

  // 6. Dòng Tổng Cộng
  const totalRow = ws.getRow(currentRowIndex);
  totalRow.height = 25;
  totalRow.values = [
    'TỔNG CỘNG',
    '',
    `Tổng cộng ${lines.length} mặt hàng nhập kho`,
    '',
    sumQty,
    '',
    '',
    '',
    sumAmount,
    ''
  ];
  ws.mergeCells(`A${currentRowIndex}:B${currentRowIndex}`);
  ws.mergeCells(`C${currentRowIndex}:D${currentRowIndex}`);

  totalRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
  totalRow.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };
  totalRow.getCell(5).alignment = { vertical: 'middle', horizontal: 'right' };
  totalRow.getCell(9).alignment = { vertical: 'middle', horizontal: 'right' };

  totalRow.getCell(5).numFmt = '#,##0.##';
  totalRow.getCell(9).numFmt = '#,##0" ₫"';

  const totalFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
  const totalBorder = {
    top: { style: 'medium', color: { argb: 'FF1F4E79' } },
    bottom: { style: 'double', color: { argb: 'FF1F4E79' } },
    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
  };

  for (let col = 1; col <= 10; col++) {
    const cell = totalRow.getCell(col);
    cell.fill = totalFill as any;
    cell.border = totalBorder as any;
    cell.font = { name: 'Aptos', size: 11, bold: true, color: { argb: 'FF1F4E79' } };
  }

  // 7. AutoFilter
  ws.autoFilter = {
    from: { row: 12, column: 1 },
    to: { row: currentRowIndex - 1, column: 10 }
  };

  // 8. Khối ký tên 4 bên
  const signRow = currentRowIndex + 3;
  ws.getRow(signRow).values = [
    'NGƯỜI LẬP PHIẾU', '',
    'NGƯỜI GIAO HÀNG / NCC', '', '',
    'THỦ KHO ĐIỂM BÁN', '',
    'BẾP TRƯỞNG / QUẢN LÝ SITE', '', ''
  ];
  ws.mergeCells(`A${signRow}:B${signRow}`);
  ws.mergeCells(`C${signRow}:E${signRow}`);
  ws.mergeCells(`F${signRow}:G${signRow}`);
  ws.mergeCells(`H${signRow}:J${signRow}`);

  const signSubRow = signRow + 1;
  ws.getRow(signSubRow).values = [
    '(Ký & ghi rõ họ tên)', '',
    '(Ký & ghi rõ họ tên)', '', '',
    '(Ký & ghi rõ họ tên)', '',
    '(Ký & đóng dấu xác nhận)', '', ''
  ];
  ws.mergeCells(`A${signSubRow}:B${signSubRow}`);
  ws.mergeCells(`C${signSubRow}:E${signSubRow}`);
  ws.mergeCells(`F${signSubRow}:G${signSubRow}`);
  ws.mergeCells(`H${signSubRow}:J${signSubRow}`);

  [signRow, signSubRow].forEach((r, idx) => {
    const row = ws.getRow(r);
    row.height = 18;
    for (let col = 1; col <= 10; col++) {
      const cell = row.getCell(col);
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.font = idx === 0
        ? { name: 'Aptos', size: 10, bold: true, color: { argb: 'FF1F4E79' } }
        : { name: 'Aptos', size: 9, italic: true, color: { argb: 'FF6B7280' } };
    }
  });

  // 9. Độ rộng cột
  ws.columns = [
    { width: 7 },   // A: STT
    { width: 16 },  // B: SKU
    { width: 36 },  // C: Tên mặt hàng
    { width: 12 },  // D: ĐVT
    { width: 15 },  // E: SL Nhập
    { width: 16 },  // F: Mã Lô SX
    { width: 15 },  // G: Hạn Dùng (EXP)
    { width: 16 },  // H: Đơn giá
    { width: 19 },  // I: Thành tiền
    { width: 26 }   // J: Ghi chú
  ];

  // 10. Xuất tải xuống
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (typeof showToast === 'function') {
    showToast(`Đã xuất file Excel: ${fileName}`, 'success');
  }
}

function exportReceiptWithXlsxFallback(receipt: ReceiptExportSlip, fileName: string, siteFullLabel: string): void {
  const wb = XLSX.utils.book_new();
  const receiptDateStr = formatReceiptDateYMD(receipt.receipt_date) || '';
  const rows: any[][] = [
    ['CÔNG TY CỔ PHẦN SUẤT ĂN CÔNG NGHIỆP A.KITCHEN'],
    ['Bộ phận: Quản Trị Kho Vận & Vận Hành WMS'],
    ['Địa chỉ: Tầng 2, Tòa nhà Oxygen, 628C Võ Nguyên Giáp, Phường An Khánh, TP. Hồ Chí Minh.'],
    [],
    ['PHIẾU NHẬP KHO NGUYÊN VẬT LIỆU TẠI SITE'],
    [`Mã phiếu: ${receipt.receipt_code} | Ngày nhập: ${receiptDateStr} | Điểm bán: ${siteFullLabel}`],
    [`NCC: ${receipt.supplier || 'Bếp Trung Tâm Siba'} | Số PO/HĐ: ${receipt.invoice_no || 'Nhập ngoài PO/PR'} | Người nhập: ${receipt.created_by || 'Thủ kho'}`],
    [],
    ['STT', 'Mã Hàng', 'Tên Nguyên Vật Liệu', 'ĐVT', 'SL Nhập', 'Mã Lô SX', 'Hạn Dùng (EXP)', 'Đơn Giá', 'Thành Tiền', 'Ghi Chú']
  ];

  let sumQty = 0;
  let sumAmount = 0;
  (receipt.lines || []).forEach((l, i) => {
    const qty = Number(l.qty) || 0;
    const price = Number(l.unit_price) || 0;
    const amt = Number(l.amount) || (qty * price);
    sumQty += qty;
    sumAmount += amt;
    rows.push([
      i + 1,
      l.item_code,
      l.item_name || l.item_code,
      l.unit || 'Phần',
      qty,
      l.batch_code || '--',
      l.exp_date ? String(l.exp_date).slice(0, 10) : '--',
      price,
      amt,
      l.note || ''
    ]);
  });
  rows.push(['TỔNG CỘNG', '', `${(receipt.lines || []).length} mặt hàng`, '', sumQty, '', '', '', sumAmount, '']);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Phieu_Nhap_Kho');
  XLSX.writeFile(wb, fileName);

  if (typeof showToast === 'function') {
    showToast(`Đã xuất file Excel: ${fileName}`, 'success');
  }
}
