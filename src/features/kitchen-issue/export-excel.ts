import { KitchenIssueSlip } from './types';
import { getSiteFullLabel } from './helpers';

declare const XLSX: any;
declare const ExcelJS: any;
declare const showToast: (msg: string, type?: string) => void;

/**
 * Xuất Phiếu Xuất Kho Sử Dụng ra file Excel chuyên nghiệp kèm Logo A.KITCHEN & Thông Tin Doanh Nghiệp
 * Quy chuẩn:
 * - Logo công ty từ thanh Sidebar (/assets/brand/logo-horizontal.png)
 * - Tên công ty: CÔNG TY CỔ PHẦN SUẤT ĂN CÔNG NGHIỆP A.KITCHEN
 * - Bộ phận: Quản Trị Kho Vận Vận Hành WMS
 * - Địa chỉ: Tầng 2, Tòa nhà Oxygen, 628C Võ Nguyên Giáp, Phường An Khánh, TP. Hồ Chí Minh.
 * - Điểm bán / Bếp: Đầy đủ mã site và tên site (VD: K001 - MN Bếp Ăn Đại Học Hùng Vương)
 * - Bỏ gridlines (showGridLines: false)
 * - Font: Aptos 11 toàn bộ, Navy Header #1F4E79, Freeze Panes, AutoFilter, Căn lề chuẩn
 */
export async function exportKitchenIssueExcel(issue: KitchenIssueSlip): Promise<void> {
  if (!issue || !issue.lines || issue.lines.length === 0) {
    if (typeof showToast === 'function') {
      showToast('Không có dữ liệu mặt hàng để xuất Excel', 'warning');
    }
    return;
  }

  const safeDate = (issue.issue_date || '').replace(/-/g, '');
  const fileName = `A.Kitchen_PhieuXuatKho_${issue.issue_code}_${safeDate}.xlsx`;
  const siteFullLabel = getSiteFullLabel(issue.site_code);

  try {
    // 1. Kiểm tra thư viện ExcelJS
    if (typeof ExcelJS !== 'undefined') {
      await exportWithExcelJS(issue, fileName, siteFullLabel);
      return;
    }

    // 2. Fallback: Nếu ExcelJS chưa tải, dùng XLSX (xlsx-js-style)
    if (typeof XLSX !== 'undefined') {
      exportWithXlsxFallback(issue, fileName, siteFullLabel);
      return;
    }

    if (typeof showToast === 'function') {
      showToast('Lỗi: Thư viện xuất Excel chưa sẵn sàng', 'error');
    }
  } catch (err: any) {
    console.error('exportKitchenIssueExcel error:', err);
    if (typeof showToast === 'function') {
      showToast('Lỗi khi xuất file Excel phiếu xuất kho: ' + err.message, 'error');
    }
  }
}

/**
 * Xuất Excel chuẩn chuyên nghiệp với ExcelJS (Hỗ trợ chèn Logo ảnh thực tế và Bỏ Gridlines)
 */
async function exportWithExcelJS(issue: KitchenIssueSlip, fileName: string, siteFullLabel: string): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'A.KITCHEN WMS';
  wb.lastModifiedBy = issue.issuer_name || 'Bếp trưởng';
  wb.created = new Date();
  wb.modified = new Date();

  const ws = wb.addWorksheet('Phieu_Xuat_Kho', {
    views: [
      {
        showGridLines: false, // Bỏ gridlines theo yêu cầu
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

  // Tải hình ảnh logo công ty từ Sidebar webapp
  let logoBuffer: ArrayBuffer | null = null;
  try {
    const res = await fetch('/assets/brand/logo-horizontal.png');
    if (res.ok) {
      logoBuffer = await res.arrayBuffer();
    }
  } catch (e) {
    console.warn('Không thể tải logo-horizontal.png, tiếp tục không có logo ảnh:', e);
  }

  if (logoBuffer) {
    const imageId = wb.addImage({
      buffer: logoBuffer,
      extension: 'png'
    });
    ws.addImage(imageId, {
      tl: { col: 0.1, row: 0.2 },
      ext: { width: 176, height: 40 }
    });
  }

  // 1. Header công ty (Branding & Địa chỉ)
  ws.mergeCells('C1:I1');
  const c1 = ws.getCell('C1');
  c1.value = 'CÔNG TY CỔ PHẦN SUẤT ĂN CÔNG NGHIỆP A.KITCHEN';
  c1.font = { name: 'Aptos', size: 11, bold: true, color: { argb: 'FF1F4E79' } };
  c1.alignment = { vertical: 'middle', horizontal: 'left' };

  ws.mergeCells('C2:I2');
  const c2 = ws.getCell('C2');
  c2.value = 'Bộ phận: Quản Trị Kho Vận Vận Hành WMS';
  c2.font = { name: 'Aptos', size: 10, bold: true, color: { argb: 'FF374151' } };
  c2.alignment = { vertical: 'middle', horizontal: 'left' };

  ws.mergeCells('C3:I3');
  const c3 = ws.getCell('C3');
  c3.value = 'Địa chỉ: Tầng 2, Tòa nhà Oxygen, 628C Võ Nguyên Giáp, Phường An Khánh, TP. Hồ Chí Minh.';
  c3.font = { name: 'Aptos', size: 9.5, italic: true, color: { argb: 'FF6B7280' } };
  c3.alignment = { vertical: 'middle', horizontal: 'left' };

  ws.getRow(1).height = 20;
  ws.getRow(2).height = 18;
  ws.getRow(3).height = 18;
  ws.getRow(4).height = 10;

  // 2. Tiêu đề Phiếu
  ws.mergeCells('B5:H5');
  const c5 = ws.getCell('B5');
  c5.value = 'PHIẾU XUẤT KHO NGUYÊN VẬT LIỆU SỬ DỤNG';
  c5.font = { name: 'Aptos', size: 16, bold: true, color: { argb: 'FF1F4E79' } };
  c5.alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getRow(5).height = 28;

  ws.mergeCells('B6:H6');
  const c6 = ws.getCell('B6');
  c6.value = `Mã số: ${issue.issue_code}   •   Ngày xuất kho: ${issue.issue_date}`;
  c6.font = { name: 'Aptos', size: 10, italic: true, color: { argb: 'FF4B5563' } };
  c6.alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getRow(6).height = 18;
  ws.getRow(7).height = 10;

  // 3. Khối thông tin nghiệp vụ
  ws.getRow(8).values = [
    'Điểm bán / Bếp:',
    siteFullLabel,
    '',
    '',
    'Ca nấu / Mục đích:',
    issue.meal_shift || 'Nấu ăn ca trưa',
    '',
    'Ngày lập phiếu:',
    issue.issue_date
  ];
  ws.mergeCells('B8:D8');
  ws.mergeCells('F8:G8');

  ws.getRow(9).values = [
    'Người lập phiếu:',
    issue.issuer_name || 'Bếp trưởng',
    '',
    '',
    'Người nhận hàng:',
    issue.receiver_name || 'Ca trưởng bếp',
    '',
    'Trạng thái:',
    'ĐÃ XUẤT KHO THỰC TẾ'
  ];
  ws.mergeCells('B9:D9');
  ws.mergeCells('F9:G9');

  ws.getRow(10).values = [
    'Ghi chú nghiệp vụ:',
    issue.notes || 'Xuất định lượng phục vụ bếp ca theo thực đơn',
    '', '', '', '', '', '', ''
  ];
  ws.mergeCells('B10:I10');

  // Format các ô thông tin nghiệp vụ
  [8, 9, 10].forEach(rIdx => {
    const row = ws.getRow(rIdx);
    row.height = 20;
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      cell.font = { name: 'Aptos', size: 10 };
      cell.alignment = { vertical: 'middle' };
      if ([1, 5, 8].includes(colNumber)) {
        cell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: 'FF374151' } };
      } else if (rIdx === 9 && colNumber === 9) {
        cell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: 'FF15803D' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
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
    'Đơn Vị Tính',
    'Tồn Trước Xuất',
    'Định Lượng Xuất',
    'Đơn Giá (VNĐ)',
    'Thành Tiền (VNĐ)',
    'Ghi Chú Ca Nấu'
  ];

  const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F4E79' } // Navy #1F4E79
  };
  const headerFont = {
    name: 'Aptos',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' }
  };
  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    bottom: { style: 'medium', color: { argb: 'FF1F4E79' } },
    right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
  };

  headerRow.eachCell((cell) => {
    cell.fill = headerFill as any;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = thinBorder as any;
  });

  // 5. Thêm dữ liệu các mặt hàng
  let sumQty = 0;
  let sumAmount = 0;
  let currentRowIndex = 13;

  const dataBorder = {
    top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
  };

  issue.lines.forEach((item, idx) => {
    const qty = Number(item.qty) || 0;
    const unitPrice = Number(item.unit_price) || 0;
    const amount = Number(item.amount) || (qty * unitPrice);
    const stockBefore = Number(item.stock_before) || 0;

    sumQty += qty;
    sumAmount += amount;

    const row = ws.getRow(currentRowIndex);
    row.height = 22;
    row.values = [
      idx + 1,
      item.item_code,
      item.item_name || item.item_code,
      item.unit || 'Phần',
      stockBefore,
      qty,
      unitPrice,
      amount,
      item.notes || ''
    ];

    // Áp dụng định dạng và căn lề
    row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(5).alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell(6).alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell(8).alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell(9).alignment = { vertical: 'middle', horizontal: 'left' };

    row.getCell(5).numFmt = '#,##0.##';
    row.getCell(6).numFmt = '#,##0.##';
    row.getCell(7).numFmt = '#,##0" ₫"';
    row.getCell(8).numFmt = '#,##0" ₫"';

    row.getCell(8).font = { name: 'Aptos', size: 11, bold: true, color: { argb: 'FF15803D' } };

    for (let col = 1; col <= 9; col++) {
      const cell = row.getCell(col);
      if (col !== 8) cell.font = { name: 'Aptos', size: 11 };
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
    `Tổng cộng ${issue.lines.length} mặt hàng xuất kho`,
    '',
    '',
    sumQty,
    '',
    sumAmount,
    ''
  ];
  ws.mergeCells(`A${currentRowIndex}:B${currentRowIndex}`);
  ws.mergeCells(`C${currentRowIndex}:E${currentRowIndex}`);

  totalRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
  totalRow.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };
  totalRow.getCell(6).alignment = { vertical: 'middle', horizontal: 'right' };
  totalRow.getCell(8).alignment = { vertical: 'middle', horizontal: 'right' };

  totalRow.getCell(6).numFmt = '#,##0.##';
  totalRow.getCell(8).numFmt = '#,##0" ₫"';

  const totalFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF3F4F6' }
  };
  const totalBorder = {
    top: { style: 'medium', color: { argb: 'FF1F4E79' } },
    bottom: { style: 'double', color: { argb: 'FF1F4E79' } },
    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
  };

  for (let col = 1; col <= 9; col++) {
    const cell = totalRow.getCell(col);
    cell.fill = totalFill as any;
    cell.border = totalBorder as any;
    cell.font = { name: 'Aptos', size: 11, bold: true, color: { argb: 'FF1F4E79' } };
  }
  totalRow.getCell(8).font = { name: 'Aptos', size: 11, bold: true, color: { argb: 'FF15803D' } };

  // 7. AutoFilter trên bảng dữ liệu
  ws.autoFilter = {
    from: { row: 12, column: 1 },
    to: { row: currentRowIndex - 1, column: 9 }
  };

  // 8. Khối ký tên 4 bên
  const signRow = currentRowIndex + 3;
  ws.getRow(signRow).values = [
    'NGƯỜI LẬP PHIẾU', '',
    'NGƯỜI NHẬN HÀNG', '', '',
    'THỦ KHO ĐIỂM BÁN', '',
    'BẾP TRƯỞNG / QUẢN LÝ SITE', ''
  ];
  ws.mergeCells(`A${signRow}:B${signRow}`);
  ws.mergeCells(`C${signRow}:D${signRow}`);
  ws.mergeCells(`F${signRow}:G${signRow}`);
  ws.mergeCells(`H${signRow}:I${signRow}`);

  ws.getRow(signRow + 1).values = [
    '(Ký, ghi rõ họ tên)', '',
    '(Ký, ghi rõ họ tên)', '', '',
    '(Ký, ghi rõ họ tên)', '',
    '(Ký, đóng dấu duyệt)', ''
  ];
  ws.mergeCells(`A${signRow + 1}:B${signRow + 1}`);
  ws.mergeCells(`C${signRow + 1}:D${signRow + 1}`);
  ws.mergeCells(`F${signRow + 1}:G${signRow + 1}`);
  ws.mergeCells(`H${signRow + 1}:I${signRow + 1}`);

  ws.getRow(signRow + 5).values = [
    issue.issuer_name || 'Trần Tuấn Đại', '',
    issue.receiver_name || 'Ca trưởng bếp', '', '',
    'Thủ kho điểm', '',
    'Ban Quản Lý Bếp', ''
  ];
  ws.mergeCells(`A${signRow + 5}:B${signRow + 5}`);
  ws.mergeCells(`C${signRow + 5}:D${signRow + 5}`);
  ws.mergeCells(`F${signRow + 5}:G${signRow + 5}`);
  ws.mergeCells(`H${signRow + 5}:I${signRow + 5}`);

  [signRow, signRow + 1, signRow + 5].forEach((r, offset) => {
    const row = ws.getRow(r);
    row.height = offset === 0 ? 20 : offset === 1 ? 16 : 22;
    row.eachCell({ includeEmpty: false }, (cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (offset === 0) cell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: 'FF1F4E79' } };
      else if (offset === 1) cell.font = { name: 'Aptos', size: 9, italic: true, color: { argb: 'FF6B7280' } };
      else if (offset === 2) cell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: 'FF111827' } };
    });
  });

  // 9. Cấu hình độ rộng các cột
  ws.columns = [
    { width: 6 },  // STT
    { width: 16 }, // Mã SKU
    { width: 36 }, // Tên NVL / Thực phẩm
    { width: 12 }, // ĐVT
    { width: 15 }, // Tồn trước xuất
    { width: 16 }, // Định lượng xuất
    { width: 16 }, // Đơn giá
    { width: 19 }, // Thành tiền
    { width: 25 }  // Ghi chú
  ];

  // 10. Ghi và kích hoạt tải file trên trình duyệt
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
    showToast(`Đã xuất file Excel phiếu xuất kho: ${fileName} (Logo A.Kitchen, Font Aptos, Không Gridlines)`, 'success');
  }
}

/**
 * Fallback: Xuất bằng xlsx-js-style nếu trình duyệt không hỗ trợ ExcelJS
 */
function exportWithXlsxFallback(issue: KitchenIssueSlip, fileName: string, siteFullLabel: string): void {
  const wb = XLSX.utils.book_new();
  const aoa: any[][] = [];

  // Header công ty
  aoa.push(['A.KITCHEN', 'CÔNG TY CỔ PHẦN SUẤT ĂN CÔNG NGHIỆP A.KITCHEN', '', '', '', '', '', '', '']);
  aoa.push(['', 'Bộ phận: Quản Trị Kho Vận Vận Hành WMS', '', '', '', '', '', '', '']);
  aoa.push(['', 'Địa chỉ: Tầng 2, Tòa nhà Oxygen, 628C Võ Nguyên Giáp, Phường An Khánh, TP. Hồ Chí Minh.', '', '', '', '', '', '', '']);
  aoa.push([]);

  // Tiêu đề
  aoa.push(['', '', 'PHIẾU XUẤT KHO NGUYÊN VẬT LIỆU SỬ DỤNG', '', '', '', '', '', '']);
  aoa.push(['', '', `Mã số: ${issue.issue_code}   •   Ngày xuất: ${issue.issue_date}`, '', '', '', '', '', '']);
  aoa.push([]);

  // Nghiệp vụ
  aoa.push(['Điểm bán / Bếp:', siteFullLabel, '', 'Ca nấu / Mục đích:', issue.meal_shift || 'Nấu ăn ca trưa', '', 'Ngày lập phiếu:', issue.issue_date]);
  aoa.push(['Người lập phiếu:', issue.issuer_name || 'Bếp trưởng', '', 'Người nhận hàng:', issue.receiver_name || 'Ca trưởng bếp', '', 'Trạng thái:', 'ĐÃ XUẤT KHO THỰC TẾ']);
  aoa.push(['Ghi chú nghiệp vụ:', issue.notes || 'Xuất định lượng phục vụ bếp ca theo thực đơn', '', '', '', '', '', '', '']);
  aoa.push([]);

  const tableHeaderIndex = aoa.length;
  aoa.push(['STT', 'Mã Hàng (SKU)', 'Tên Nguyên Vật Liệu / Thực Phẩm', 'Đơn Vị Tính', 'Tồn Trước Xuất', 'Định Lượng Xuất', 'Đơn Giá (VNĐ)', 'Thành Tiền (VNĐ)', 'Ghi Chú Ca Nấu']);

  let sumQty = 0;
  let sumAmount = 0;
  issue.lines.forEach((item, idx) => {
    const qty = Number(item.qty) || 0;
    const unitPrice = Number(item.unit_price) || 0;
    const amount = Number(item.amount) || (qty * unitPrice);
    const stockBefore = Number(item.stock_before) || 0;
    sumQty += qty;
    sumAmount += amount;
    aoa.push([idx + 1, item.item_code, item.item_name || item.item_code, item.unit || 'Phần', stockBefore, qty, unitPrice, amount, item.notes || '']);
  });

  const totalRowIndex = aoa.length;
  aoa.push(['TỔNG CỘNG', '', `Tổng cộng ${issue.lines.length} mặt hàng xuất kho`, '', '', sumQty, '', sumAmount, '']);
  aoa.push([]);
  aoa.push([]);

  const signHeaderRow = aoa.length;
  aoa.push(['NGƯỜI LẬP PHIẾU', '', 'NGƯỜI NHẬN HÀNG', '', '', 'THỦ KHO ĐIỂM BÁN', '', 'BẾP TRƯỞNG / QUẢN LÝ SITE', '']);
  aoa.push(['(Ký, ghi rõ họ tên)', '', '(Ký, ghi rõ họ tên)', '', '', '(Ký, ghi rõ họ tên)', '', '(Ký, đóng dấu duyệt)', '']);
  aoa.push([]);
  aoa.push([]);
  aoa.push([]);
  aoa.push([issue.issuer_name || 'Trần Tuấn Đại', '', issue.receiver_name || 'Ca trưởng bếp', '', '', 'Thủ kho điểm', '', 'Ban Quản Lý Bếp', '']);

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Bỏ gridlines trên views
  ws['!views'] = [{ showGridLines: false, state: 'frozen', ySplit: tableHeaderIndex + 1 }];
  ws['!sheetViews'] = [{ showGridLines: false }];

  // Freeze & Col width
  ws['!cols'] = [
    { wch: 6 }, { wch: 16 }, { wch: 36 }, { wch: 12 },
    { wch: 15 }, { wch: 16 }, { wch: 16 }, { wch: 19 }, { wch: 25 }
  ];
  ws['!autofilter'] = { ref: `A${tableHeaderIndex + 1}:I${totalRowIndex}` };

  XLSX.utils.book_append_sheet(wb, ws, 'Phieu_Xuat_Kho');
  XLSX.writeFile(wb, fileName);

  if (typeof showToast === 'function') {
    showToast(`Đã xuất file Excel phiếu xuất kho: ${fileName}`, 'success');
  }
}
