import type { WhInventoryItem, WhTransactionHistoryItem } from './types';
import { gWhFilteredInventory, gWhInventoryData } from './inventory-table';
import { gWhActiveHistory } from './item-modals';

declare const XLSX: any;
declare function showToast(msg: string, type?: string): void;

/**
 * Excel Exporter for WMS Inventory Balance
 * Compliant with User Rules: Font Aptos, Navy Header (#1F4E79), AutoFilter, Freeze Panes.
 */
export function exportWhInventoryToExcel(): void {
  const list: WhInventoryItem[] = (gWhFilteredInventory && gWhFilteredInventory.length)
    ? gWhFilteredInventory
    : gWhInventoryData;

  if (!list || !list.length) {
    if (typeof showToast === 'function') showToast('Không có dữ liệu tồn kho để xuất Excel!', 'error');
    return;
  }

  const site = (document.getElementById('whInvSiteSelect') as HTMLSelectElement | null)?.value || 'ALL';
  const headers = [
    'STT',
    'Mã SKU',
    'Tên Mặt Hàng',
    'Nhóm Ngành Hàng',
    'Đơn Vị Tính',
    'Số Lượng Đã Nhập',
    'Số Lượng Tồn Sổ Sách',
    'Đơn Giá Chuẩn (VNĐ)',
    'Tổng Giá Trị Tồn (VNĐ)',
    'Số Lô Quản Lý',
    'Ngày Nhập Gần Nhất',
    'Ngày Kiểm Kê Gần Nhất'
  ];

  const dataAOA: any[][] = [headers];

  list.forEach((r, idx) => {
    dataAOA.push([
      idx + 1,
      r.sku || '',
      r.name || '',
      r.category || '',
      r.unit || '',
      parseFloat(String(r.receipt_qty || 0)),
      parseFloat(String(r.book_qty || 0)),
      parseFloat(String(r.unit_price || 0)),
      parseFloat(String(r.total_value || 0)),
      parseInt(String(r.batch_count || 0), 10),
      r.last_receipt_date ? String(r.last_receipt_date).split('T')[0] : '',
      r.last_count_date ? String(r.last_count_date).split('T')[0] : ''
    ]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(dataAOA);
  const range = XLSX.utils.decode_range(ws['!ref']);

  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Mã SKU
    { wch: 34 }, // Tên Mặt Hàng
    { wch: 18 }, // Nhóm Ngành Hàng
    { wch: 10 }, // Đơn Vị Tính
    { wch: 16 }, // Số Lượng Đã Nhập
    { wch: 18 }, // Số Lượng Tồn Sổ Sách
    { wch: 18 }, // Đơn Giá Chuẩn
    { wch: 20 }, // Tổng Giá Trị Tồn
    { wch: 14 }, // Số Lô Quản Lý
    { wch: 16 }, // Ngày Nhập Gần Nhất
    { wch: 18 }  // Ngày Kiểm Kê Gần Nhất
  ];

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellRef]) continue;

      if (R === 0) {
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
        let alignH = 'left';
        let numFmt: string | undefined = undefined;

        if (C === 0 || C === 1 || C === 4 || C === 9 || C === 10 || C === 11) {
          alignH = 'center';
        } else if (C === 5 || C === 6) {
          alignH = 'right';
          numFmt = '#,##0.0';
        } else if (C === 7 || C === 8) {
          alignH = 'right';
          numFmt = '#,##0';
        }

        const isNegativeStock = (C === 6 && typeof ws[cellRef].v === 'number' && ws[cellRef].v < 0);

        ws[cellRef].s = {
          font: {
            name: 'Aptos',
            sz: 11,
            bold: (C === 6 || C === 8),
            color: { rgb: isNegativeStock ? 'C00000' : '000000' }
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

  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  ws['!autofilter'] = { ref: ws['!ref'] };

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fileName = `Ton_Kho_WMS_${site}_${today}.xlsx`;

  XLSX.utils.book_append_sheet(wb, ws, 'TonKhoWMS');
  XLSX.writeFile(wb, fileName);
  if (typeof showToast === 'function') showToast(`Đã xuất báo cáo tồn kho ${site} thành công!`, 'success');
}

/**
 * Excel Exporter for Item Stock Card (Thẻ Kho)
 */
export function exportWhItemHistoryToExcel(): void {
  if (!gWhActiveHistory || !gWhActiveHistory.history) {
    if (typeof showToast === 'function') showToast('Chưa có dữ liệu thẻ kho để xuất Excel!', 'error');
    return;
  }

  const data = gWhActiveHistory;
  const hist: WhTransactionHistoryItem[] = data.history || [];
  if (!hist.length) {
    if (typeof showToast === 'function') showToast('Không có phát sinh giao dịch nào để xuất Excel!', 'error');
    return;
  }

  const headers = [
    'STT',
    'Ngày Chứng Từ',
    'Số Chứng Từ',
    'Loại Nghiệp Vụ',
    'Mã Lô',
    'Hạn Dùng (HSD)',
    'Số Lượng Nhập (+)',
    'Số Lượng Xuất (-)',
    'Đơn Giá (VNĐ)',
    'Thành Tiền (VNĐ)',
    'Đối Tác / Nhà Cung Cấp',
    'Ghi Chú / Diễn Giải'
  ];

  const dataAOA: any[][] = [headers];

  hist.forEach((h, idx) => {
    dataAOA.push([
      idx + 1,
      h.doc_date ? String(h.doc_date).split('T')[0] : '',
      h.doc_no || '',
      h.trans_name || h.trans_type || '',
      h.batch_code || '',
      h.exp_date ? String(h.exp_date).split('T')[0] : '',
      parseFloat(String(h.qty_in || 0)),
      parseFloat(String(h.qty_out || 0)),
      parseFloat(String(h.unit_price || 0)),
      parseFloat(String(h.amount || 0)),
      h.partner_name || '',
      h.notes || ''
    ]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(dataAOA);
  const range = XLSX.utils.decode_range(ws['!ref']);

  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Ngày Chứng Từ
    { wch: 16 }, // Số Chứng Từ
    { wch: 16 }, // Loại Nghiệp Vụ
    { wch: 14 }, // Mã Lô
    { wch: 14 }, // Hạn Dùng
    { wch: 16 }, // Nhập (+)
    { wch: 16 }, // Xuất (-)
    { wch: 16 }, // Đơn Giá
    { wch: 18 }, // Thành Tiền
    { wch: 28 }, // Đối Tác
    { wch: 30 }  // Ghi Chú
  ];

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellRef]) continue;

      if (R === 0) {
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
        let alignH = 'left';
        let numFmt: string | undefined = undefined;

        if (C === 0 || C === 1 || C === 2 || C === 3 || C === 4 || C === 5) {
          alignH = 'center';
        } else if (C === 6 || C === 7) {
          alignH = 'right';
          numFmt = '#,##0.0';
        } else if (C === 8 || C === 9) {
          alignH = 'right';
          numFmt = '#,##0';
        }

        ws[cellRef].s = {
          font: { name: 'Aptos', sz: 11, bold: (C === 6 || C === 7), color: { rgb: '000000' } },
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

  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  ws['!autofilter'] = { ref: ws['!ref'] };

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fileName = `The_Kho_${data.sku}_${data.site}_${today}.xlsx`;

  XLSX.utils.book_append_sheet(wb, ws, 'TheKho');
  XLSX.writeFile(wb, fileName);
  if (typeof showToast === 'function') showToast(`Đã xuất thẻ kho mã ${data.sku} thành công!`, 'success');
}
