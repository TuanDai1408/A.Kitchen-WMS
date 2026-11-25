import { KitchenIssueSlip } from './types';

declare const XLSX: any;
declare const showToast: (msg: string, type?: string) => void;

/**
 * Xuất Phiếu Xuất Kho Sử Dụng ra file Excel chuyên nghiệp kèm thương hiệu A.KITCHEN
 * Tuân thủ tuyệt đối quy chuẩn: Font Aptos, Header Navy #1F4E79, Freeze Panes, AutoFilter, Căn lề chuẩn WMS
 */
export function exportKitchenIssueExcel(issue: KitchenIssueSlip): void {
  if (!issue || !issue.lines || issue.lines.length === 0) {
    if (typeof showToast === 'function') {
      showToast('Không có dữ liệu mặt hàng để xuất Excel', 'warning');
    }
    return;
  }

  try {
    if (typeof XLSX === 'undefined') {
      if (typeof showToast === 'function') showToast('Lỗi: Thư viện xuất Excel (XLSX) chưa sẵn sàng', 'error');
      return;
    }

    const wb = XLSX.utils.book_new();

    // 1. Cấu trúc nội dung bảng tính
    const aoa: any[][] = [];

    // Header Công ty (Branding & Logo text)
    aoa.push(['A.KITCHEN', 'CÔNG TY TNHH A.KITCHEN - HỆ THỐNG SUẤT ĂN CÔNG NGHIỆP & F&B CHUỖI', '', '', '', '', '', '', '']);
    aoa.push(['', 'Bộ phận: Bếp Trung Tâm & Quản Trị Kho Vận Vận Hành WMS', '', '', '', '', '', '', '']);
    aoa.push(['', 'Địa chỉ: Hệ thống vận hành điểm bán toàn quốc | Hotline: 1900 633 818', '', '', '', '', '', '', '']);
    aoa.push([]); // Dòng trống

    // Tiêu đề Phiếu Xuất Kho
    aoa.push(['', '', 'PHIẾU XUẤT KHO NGUYÊN VẬT LIỆU SỬ DỤNG', '', '', '', '', '', '']);
    aoa.push(['', '', `Mã số: ${issue.issue_code}  •  Ngày xuất: ${issue.issue_date}`, '', '', '', '', '', '']);
    aoa.push([]); // Dòng trống

    // Khối thông tin nghiệp vụ phiếu
    aoa.push([
      'Điểm bán / Bếp:', issue.site_code, '',
      'Ca nấu / Mục đích:', issue.meal_shift || 'Nấu ăn ca trưa', '',
      'Ngày lập phiếu:', issue.issue_date
    ]);
    aoa.push([
      'Người lập phiếu:', issue.issuer_name || 'Bếp trưởng', '',
      'Người nhận hàng:', issue.receiver_name || 'Ca trưởng bếp', '',
      'Trạng thái:', 'ĐÃ XUẤT KHO THỰC TẾ'
    ]);
    aoa.push([
      'Ghi chú nghiệp vụ:', issue.notes || 'Xuất định lượng phục vụ bếp ca theo thực đơn', '', '', '', '', '', '', ''
    ]);
    aoa.push([]); // Dòng trống

    // Header Bảng Chi Tiết (Dòng 12, index 11)
    const tableHeaderIndex = aoa.length;
    aoa.push([
      'STT',
      'Mã Hàng (SKU)',
      'Tên Nguyên Vật Liệu / Thực Phẩm',
      'Đơn Vị Tính',
      'Tồn Trước Xuất',
      'Định Lượng Xuất',
      'Đơn Giá (VNĐ)',
      'Thành Tiền (VNĐ)',
      'Ghi Chú Ca Nấu'
    ]);

    // Dữ liệu từng mặt hàng
    let sumQty = 0;
    let sumAmount = 0;

    issue.lines.forEach((item, idx) => {
      const qty = Number(item.qty) || 0;
      const unitPrice = Number(item.unit_price) || 0;
      const amount = Number(item.amount) || (qty * unitPrice);
      const stockBefore = Number(item.stock_before) || 0;

      sumQty += qty;
      sumAmount += amount;

      aoa.push([
        idx + 1,
        item.item_code,
        item.item_name || item.item_code,
        item.unit || 'Phần',
        stockBefore,
        qty,
        unitPrice,
        amount,
        item.notes || ''
      ]);
    });

    // Dòng Tổng Cộng
    const totalRowIndex = aoa.length;
    aoa.push([
      'TỔNG CỘNG',
      '',
      `Tổng cộng ${issue.lines.length} mặt hàng xuất kho`,
      '',
      '',
      sumQty,
      '',
      sumAmount,
      ''
    ]);

    aoa.push([]); // Dòng trống
    aoa.push([]); // Dòng trống

    // Khối Ký Tên 4 Bên
    const signHeaderRow = aoa.length;
    aoa.push([
      'NGƯỜI LẬP PHIẾU',
      '',
      'NGƯỜI NHẬN HÀNG',
      '',
      '',
      'THỦ KHO ĐIỂM BÁN',
      '',
      'BẾP TRƯỞNG / QUẢN LÝ SITE',
      ''
    ]);
    aoa.push([
      '(Ký, ghi rõ họ tên)',
      '',
      '(Ký, ghi rõ họ tên)',
      '',
      '',
      '(Ký, ghi rõ họ tên)',
      '',
      '(Ký, đóng dấu duyệt)',
      ''
    ]);
    aoa.push([]); // Khoảng trống cho chữ ký
    aoa.push([]);
    aoa.push([]);
    aoa.push([
      issue.issuer_name || 'Trần Tuấn Đại',
      '',
      issue.receiver_name || 'Bếp trưởng ca',
      '',
      '',
      'Thủ kho điểm',
      '',
      'Ban Quản Lý Bếp',
      ''
    ]);

    // 2. Chuyển đổi thành Sheet
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // 3. Định dạng Style theo Quy Chuẩn User Rules (Aptos 11, Navy Header #1F4E79, Căn lề chuẩn)
    const brandBadgeStyle = {
      font: { name: 'Aptos', sz: 12, bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '19723C' } }, // Brand Emerald A.Kitchen
      alignment: { vertical: 'center', horizontal: 'center' }
    };
    const brandSubStyle = {
      font: { name: 'Aptos', sz: 11, bold: true, color: { rgb: '1F4E79' } },
      alignment: { vertical: 'center', horizontal: 'left' }
    };
    const titleStyle = {
      font: { name: 'Aptos', sz: 16, bold: true, color: { rgb: '1F4E79' } },
      alignment: { vertical: 'center', horizontal: 'center' }
    };
    const subTitleStyle = {
      font: { name: 'Aptos', sz: 10, italic: true, color: { rgb: '555555' } },
      alignment: { vertical: 'center', horizontal: 'center' }
    };
    const metaLabelStyle = {
      font: { name: 'Aptos', sz: 10, bold: true, color: { rgb: '333333' } },
      alignment: { vertical: 'center', horizontal: 'left' }
    };
    const metaValStyle = {
      font: { name: 'Aptos', sz: 10, color: { rgb: '1F4E79' } },
      alignment: { vertical: 'center', horizontal: 'left' }
    };

    // Table Header Style (Navy #1F4E79, Chữ Trắng, Bold 11)
    const tableHeaderStyle = {
      font: { name: 'Aptos', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1F4E79' } },
      alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
      border: {
        top: { style: 'thin', color: { rgb: 'D0D7DE' } },
        bottom: { style: 'medium', color: { rgb: '1F4E79' } },
        left: { style: 'thin', color: { rgb: 'D0D7DE' } },
        right: { style: 'thin', color: { rgb: 'D0D7DE' } }
      }
    };

    // Table Data Styles
    const cellBorder = {
      top: { style: 'thin', color: { rgb: 'E1E4E8' } },
      bottom: { style: 'thin', color: { rgb: 'E1E4E8' } },
      left: { style: 'thin', color: { rgb: 'E1E4E8' } },
      right: { style: 'thin', color: { rgb: 'E1E4E8' } }
    };
    const regTextLeft = {
      font: { name: 'Aptos', sz: 11 },
      alignment: { vertical: 'center', horizontal: 'left' },
      border: cellBorder
    };
    const regTextCenter = {
      font: { name: 'Aptos', sz: 11 },
      alignment: { vertical: 'center', horizontal: 'center' },
      border: cellBorder
    };
    const regNumRight = {
      font: { name: 'Aptos', sz: 11 },
      alignment: { vertical: 'center', horizontal: 'right' },
      numFmt: '#,##0.##',
      border: cellBorder
    };
    const regCurrencyRight = {
      font: { name: 'Aptos', sz: 11, bold: true, color: { rgb: '19723C' } },
      alignment: { vertical: 'center', horizontal: 'right' },
      numFmt: '#,##0" ₫"',
      border: cellBorder
    };

    // Total Row Style
    const totalRowStyle = {
      font: { name: 'Aptos', sz: 11, bold: true, color: { rgb: '1F4E79' } },
      fill: { fgColor: { rgb: 'F2F4F7' } },
      alignment: { vertical: 'center', horizontal: 'right' },
      border: {
        top: { style: 'medium', color: { rgb: '1F4E79' } },
        bottom: { style: 'medium', color: { rgb: '1F4E79' } }
      }
    };

    // Signatures Styles
    const signHeaderStyle = {
      font: { name: 'Aptos', sz: 10, bold: true, color: { rgb: '1F4E79' } },
      alignment: { vertical: 'center', horizontal: 'center' }
    };
    const signSubStyle = {
      font: { name: 'Aptos', sz: 9, italic: true, color: { rgb: '777777' } },
      alignment: { vertical: 'center', horizontal: 'center' }
    };
    const signNameStyle = {
      font: { name: 'Aptos', sz: 10, bold: true, color: { rgb: '333333' } },
      alignment: { vertical: 'center', horizontal: 'center' }
    };

    // Duyệt qua các cell và áp dụng style
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;

        if (R === 0 && C === 0) ws[cellRef].s = brandBadgeStyle;
        else if (R === 0 && C === 1) ws[cellRef].s = brandSubStyle;
        else if (R === 4) ws[cellRef].s = titleStyle;
        else if (R === 5) ws[cellRef].s = subTitleStyle;
        else if (R >= 7 && R <= 9) {
          if (C % 3 === 0) ws[cellRef].s = metaLabelStyle;
          else ws[cellRef].s = metaValStyle;
        } else if (R === tableHeaderIndex) {
          ws[cellRef].s = tableHeaderStyle;
        } else if (R > tableHeaderIndex && R < totalRowIndex) {
          if (C === 0 || C === 1 || C === 3) ws[cellRef].s = regTextCenter;
          else if (C === 2 || C === 8) ws[cellRef].s = regTextLeft;
          else if (C === 4 || C === 5 || C === 6) ws[cellRef].s = regNumRight;
          else if (C === 7) ws[cellRef].s = regCurrencyRight;
        } else if (R === totalRowIndex) {
          ws[cellRef].s = totalRowStyle;
          if (C === 7) ws[cellRef].numFmt = '#,##0" ₫"';
          if (C === 5) ws[cellRef].numFmt = '#,##0.##';
        } else if (R === signHeaderRow) {
          ws[cellRef].s = signHeaderStyle;
        } else if (R === signHeaderRow + 1) {
          ws[cellRef].s = signSubStyle;
        } else if (R === signHeaderRow + 5) {
          ws[cellRef].s = signNameStyle;
        }
      }
    }

    // 4. Merge Cells cho tiêu đề & branding
    ws['!merges'] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 8 } }, // Công ty
      { s: { r: 1, c: 1 }, e: { r: 1, c: 8 } }, // Bộ phận
      { s: { r: 2, c: 1 }, e: { r: 2, c: 8 } }, // Địa chỉ
      { s: { r: 4, c: 2 }, e: { r: 4, c: 6 } }, // Tiêu đề Phiếu
      { s: { r: 5, c: 2 }, e: { r: 5, c: 6 } }, // Mã & ngày
      { s: { r: totalRowIndex, c: 0 }, e: { r: totalRowIndex, c: 1 } }, // TỔNG CỘNG
      // Ký tên
      { s: { r: signHeaderRow, c: 0 }, e: { r: signHeaderRow, c: 1 } },
      { s: { r: signHeaderRow, c: 2 }, e: { r: signHeaderRow, c: 3 } },
      { s: { r: signHeaderRow, c: 5 }, e: { r: signHeaderRow, c: 6 } },
      { s: { r: signHeaderRow, c: 7 }, e: { r: signHeaderRow, c: 8 } },
      { s: { r: signHeaderRow + 1, c: 0 }, e: { r: signHeaderRow + 1, c: 1 } },
      { s: { r: signHeaderRow + 1, c: 2 }, e: { r: signHeaderRow + 1, c: 3 } },
      { s: { r: signHeaderRow + 1, c: 5 }, e: { r: signHeaderRow + 1, c: 6 } },
      { s: { r: signHeaderRow + 1, c: 7 }, e: { r: signHeaderRow + 1, c: 8 } },
      { s: { r: signHeaderRow + 5, c: 0 }, e: { r: signHeaderRow + 5, c: 1 } },
      { s: { r: signHeaderRow + 5, c: 2 }, e: { r: signHeaderRow + 5, c: 3 } },
      { s: { r: signHeaderRow + 5, c: 5 }, e: { r: signHeaderRow + 5, c: 6 } },
      { s: { r: signHeaderRow + 5, c: 7 }, e: { r: signHeaderRow + 5, c: 8 } }
    ];

    // 5. Freeze Panes & AutoFilter
    const tableHeaderRef = `A${tableHeaderIndex + 1}:I${totalRowIndex}`;
    ws['!autofilter'] = { ref: tableHeaderRef };
    ws['!freeze'] = {
      xSplit: 0,
      ySplit: tableHeaderIndex + 1,
      topLeftCell: `A${tableHeaderIndex + 2}`,
      activePane: 'bottomLeft',
      state: 'frozen'
    };

    // 6. Độ rộng cột chuẩn
    ws['!cols'] = [
      { wch: 6 },  // STT
      { wch: 15 }, // Mã hàng SKU
      { wch: 34 }, // Tên NVL / Thực phẩm
      { wch: 12 }, // ĐVT
      { wch: 15 }, // Tồn trước xuất
      { wch: 16 }, // Định lượng xuất
      { wch: 15 }, // Đơn giá
      { wch: 18 }, // Thành tiền
      { wch: 24 }  // Ghi chú
    ];

    // 7. Ghi file Excel
    XLSX.utils.book_append_sheet(wb, ws, 'Phieu_Xuat_Kho');
    const safeDate = (issue.issue_date || '').replace(/-/g, '');
    const fileName = `A.Kitchen_PhieuXuatKho_${issue.issue_code}_${safeDate}.xlsx`;
    XLSX.writeFile(wb, fileName);

    if (typeof showToast === 'function') {
      showToast(`Đã xuất file Excel phiếu xuất kho: ${fileName} (Font Aptos)`, 'success');
    }
  } catch (err: any) {
    console.error('exportKitchenIssueExcel error:', err);
    if (typeof showToast === 'function') {
      showToast('Lỗi khi xuất file Excel phiếu xuất kho: ' + err.message, 'error');
    }
  }
}
