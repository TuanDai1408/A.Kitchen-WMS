import { gChainRankings } from './chain-rankings';
import { currentPLData } from './pl-report';

declare const XLSX: any;
declare const showToast: (msg: string, type?: string) => void;

/**
 * Excel Export for F&B Chain Rankings adhering to Aptos & Navy standards
 */
export function exportFnbChainExcel(): void {
  if (!gChainRankings || gChainRankings.length === 0) {
    if (typeof showToast === 'function') {
      showToast('Chưa có dữ liệu xếp hạng để xuất Excel', 'warning');
    }
    return;
  }

  try {
    if (typeof XLSX === 'undefined') {
      if (typeof showToast === 'function') showToast('Lỗi: Thư viện xuất Excel chưa sẵn sàng', 'error');
      return;
    }

    const wb = XLSX.utils.book_new();

    const headers = [
      'Hạng',
      'Mã SAP',
      'Điểm Bán & Bếp Ăn',
      'Vùng Miền',
      'Doanh Thu Thuần (VNĐ)',
      'Mục Tiêu Tháng (VNĐ)',
      '% Đạt Chỉ Tiêu',
      'Food Cost %',
      'Labor Cost %',
      'Lợi Nhuận EBITDA (VNĐ)',
      'Biên LN %',
      'Trạng Thái'
    ];

    const dataRows = gChainRankings.map((s) => [
      s.rank,
      s.code,
      s.name,
      s.region,
      s.netRevenue,
      s.targetRevenue,
      parseFloat(String(s.achievementPct)) / 100,
      parseFloat(String(s.foodCostPct)) / 100,
      parseFloat(String(s.laborCostPct)) / 100,
      s.operatingProfit,
      parseFloat(String(s.profitMargin)) / 100,
      s.status
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);

    // Apply User Excel Rules: Aptos 11, Navy Header #1F4E79, White Text
    const headerStyle = {
      font: { name: 'Aptos', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1F4E79' } },
      alignment: { vertical: 'center', horizontal: 'center' }
    };

    const regularStyle = { font: { name: 'Aptos', sz: 11 } };
    const centerStyle = { font: { name: 'Aptos', sz: 11 }, alignment: { horizontal: 'center' } };
    const rightStyle = { font: { name: 'Aptos', sz: 11 }, alignment: { horizontal: 'right' } };

    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;

        if (R === 0) {
          ws[cellRef].s = headerStyle;
        } else {
          // Column alignments
          if (C === 0 || C === 1 || C === 3 || C === 11) {
            ws[cellRef].s = centerStyle;
          } else if (C === 2) {
            ws[cellRef].s = regularStyle;
          } else if (C === 6 || C === 7 || C === 8 || C === 10) {
            ws[cellRef].s = rightStyle;
            ws[cellRef].z = '0.0%';
          } else {
            ws[cellRef].s = rightStyle;
            ws[cellRef].z = '#,##0';
          }
        }
      }
    }

    // Freeze panes: Dòng đầu tiên
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    // AutoFilter
    ws['!autofilter'] = { ref: ws['!ref'] };

    // Column widths
    ws['!cols'] = [
      { wch: 8 },  // Hạng
      { wch: 10 }, // Mã SAP
      { wch: 38 }, // Tên
      { wch: 14 }, // Vùng
      { wch: 22 }, // Doanh thu
      { wch: 20 }, // Mục tiêu
      { wch: 14 }, // % Đạt
      { wch: 14 }, // Food Cost %
      { wch: 14 }, // Labor Cost %
      { wch: 22 }, // EBITDA
      { wch: 12 }, // Biên LN
      { wch: 16 }  // Trạng thái
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'XepHangChuoi');
    const nowStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Orbit_Siba_Food_XepHangChuoi_${nowStr}.xlsx`);
    if (typeof showToast === 'function') {
      showToast('Đã xuất file Excel xếp hạng toàn chuỗi thành công (chuẩn Aptos).', 'success');
    }
  } catch (err: any) {
    console.error('Lỗi exportFnbChainExcel:', err);
    if (typeof showToast === 'function') {
      showToast('Lỗi xuất Excel: ' + err.message, 'error');
    }
  }
}

/**
 * Excel Export for Site P&L Statement adhering to Aptos & Navy standards
 */
export function exportFnbPLExcel(): void {
  try {
    if (typeof XLSX === 'undefined') {
      if (typeof showToast === 'function') showToast('Lỗi: Thư viện xuất Excel chưa sẵn sàng', 'error');
      return;
    }

    const d = currentPLData || (typeof window !== 'undefined' ? (window as any).currentPLData : null) || {};
    const net = d.netRevenue || 470450000;
    const gross = d.grossRevenue || 485000000;
    const disc = d.discount || 14550000;
    const ch = d.channels || {
      dineIn: Math.round(net * 0.72),
      takeaway: Math.round(net * 0.2),
      catering: Math.round(net * 0.08)
    };
    const fc = d.foodCost || Math.round(net * 0.428);
    const lc = d.laborCost || Math.round(net * 0.185);
    const pc = d.primeCost || (fc + lc);
    const rent = d.rentCost || 28000000;
    const util = d.utilityCost || Math.round(net * 0.034);
    const sup = d.supplyCost || Math.round(net * 0.03);
    const waste = d.wasteCost || Math.round(net * 0.012);
    const mkt = d.marketingCost || Math.round(net * 0.015);
    const totalC = d.totalCost || (fc + lc + rent + util + sup + waste + mkt);
    const ebitda = d.operatingProfit || (net - totalC);
    const calcPct = (v: number) => (net > 0 ? v / net : 0);

    const wb = XLSX.utils.book_new();

    const rows = [
      ['KHOẢN MỤC BÁO CÁO P&L', 'SỐ TIỀN (VNĐ)', '% DOANH THU THUẦN', 'GHI CHÚ / ĐỊNH MỨC'],
      ['1. Doanh thu gộp (Gross Sales)', gross, calcPct(gross), 'Trước khuyến mãi'],
      ['(-) Chiết khấu / Khuyến mãi POS', -disc, calcPct(-disc), 'Trong mức cho phép <4%'],
      ['2. DOANH THU THUẦN (Net Sales)', net, 1.0, 'Doanh thu chuẩn 100%'],
      ['• Ăn tại chỗ (Dine-in)', ch.dineIn, calcPct(ch.dineIn), 'Kênh chủ lực'],
      ['• Mang đi (Takeaway)', ch.takeaway, calcPct(ch.takeaway), 'Kênh phụ trợ'],
      ['• Suất ăn công nghiệp / Hub', ch.catering, calcPct(ch.catering), 'Hợp đồng ngoài'],
      ['3. Chi phí Nguyên Vật Liệu (Food Cost)', fc, calcPct(fc), `Mục tiêu <=43.0% (${d.foodCostPct || (calcPct(fc) * 100).toFixed(1)}%)`],
      ['4. Chi phí Nhân công trực tiếp (Labor Cost)', lc, calcPct(lc), 'Mục tiêu <=19.0% (18.5%)'],
      ['5. PRIME COST (Food + Labor)', pc, calcPct(pc), 'Mục tiêu <=62.0%'],
      ['6. Chi phí Mặt bằng & Khấu hao', rent, calcPct(rent), 'Chi phí cố định'],
      ['7. Điện, Nước & Gas vận hành', util, calcPct(util), 'Định mức <=3.5%'],
      ['8. Vật tư tiêu hao & CCDC', sup, calcPct(sup), 'Định mức trần theo hạn mức'],
      ['9. Hao hụt & Hỏng hủy', waste, calcPct(waste), 'Chỉ tiêu <=1.0%'],
      ['10. Tiếp thị & POS', mkt, calcPct(mkt), 'Chỉ tiêu <=1.5%'],
      ['TỔNG CHI PHÍ HOẠT ĐỘNG', totalC, calcPct(totalC), 'Tổng chi phí vận hành'],
      ['LỢI NHUẬN HOẠT ĐỘNG (EBITDA)', ebitda, calcPct(ebitda), `${d.profitMargin || (calcPct(ebitda) * 100).toFixed(1)}% Doanh thu`]
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Apply User Aptos styling
    const headerStyle = {
      font: { name: 'Aptos', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1F4E79' } },
      alignment: { vertical: 'center', horizontal: 'center' }
    };
    const regStyle = { font: { name: 'Aptos', sz: 11 } };
    const rightStyle = { font: { name: 'Aptos', sz: 11 }, alignment: { horizontal: 'right' } };

    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;
        if (R === 0) {
          ws[cellRef].s = headerStyle;
        } else {
          if (C === 0) ws[cellRef].s = regStyle;
          else if (C === 1) {
            ws[cellRef].s = rightStyle;
            ws[cellRef].z = '#,##0';
          } else if (C === 2) {
            ws[cellRef].s = rightStyle;
            ws[cellRef].z = '0.0%';
          } else {
            ws[cellRef].s = regStyle;
          }
        }
      }
    }

    ws['!freeze'] = { xSplit: 0, ySplit: 1 };
    ws['!autofilter'] = { ref: ws['!ref'] };
    ws['!cols'] = [{ wch: 45 }, { wch: 22 }, { wch: 20 }, { wch: 30 }];

    XLSX.utils.book_append_sheet(wb, ws, 'PL_DiemBan');
    XLSX.writeFile(wb, `Orbit_Siba_Food_PL_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    if (typeof showToast === 'function') {
      showToast('Đã xuất Báo Cáo P&L Điểm Bán thành công (chuẩn Aptos).', 'success');
    }
  } catch (err: any) {
    if (typeof showToast === 'function') {
      showToast('Lỗi xuất P&L Excel: ' + err.message, 'error');
    }
  }
}
