import { resolveUserFeaturePermission } from './user-matrix';

declare const XLSX: any;
declare const showToast: (msg: string, type?: string) => void;

export function exportUserMatrixExcel(): void {
  const data = typeof window !== 'undefined' ? (window as any).gUserMatrixData : null;
  if (!data || !data.users || data.users.length === 0) {
    if (typeof showToast === 'function') {
      showToast('Chưa có dữ liệu ma trận để xuất Excel', 'warning');
    }
    return;
  }

  try {
    if (typeof XLSX === 'undefined') {
      if (typeof showToast === 'function') showToast('Lỗi: Thư viện xuất Excel chưa sẵn sàng', 'error');
      return;
    }

    const wb = XLSX.utils.book_new();
    const users = data.users;
    const features = data.features;
    const rolePerms = data.rolePermissions;
    const userPerms = data.userPermissions;

    const headers = [
      'STT',
      'Họ Và Tên',
      'Email Google',
      'Vai Trò Hệ Thống',
      'Trạng Thái',
      'Ngày Tạo'
    ];

    features.forEach((f: any) => {
      headers.push(`${f.name} (${f.code})`);
    });

    const rows = users.map((u: any, idx: number) => {
      const row = [
        idx + 1,
        u.full_name || 'Chưa đặt tên',
        u.email,
        u.role_code,
        u.status === 'LOCKED' ? 'BỊ KHÓA' : 'HOẠT ĐỘNG',
        u.created_at ? String(u.created_at).slice(0, 10) : ''
      ];

      features.forEach((f: any) => {
        const perm = resolveUserFeaturePermission(u, f, rolePerms, userPerms);
        let statusText = 'KHÔNG';
        if (perm.isGranted) {
          statusText = perm.type === 'CUSTOM_GRANT' ? 'CẤP RIÊNG (✓)' : 'THEO ROLE (✓)';
        } else if (perm.type === 'CUSTOM_REVOKE') {
          statusText = 'BỊ KHÓA (✕)';
        }
        row.push(statusText);
      });

      return row;
    });

    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Apply User Excel Rules: Aptos 11, Navy Header #1F4E79, White Text
    const headerStyle = {
      font: { name: 'Aptos', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1F4E79' } },
      alignment: { vertical: 'center', horizontal: 'center' }
    };
    const regStyle = { font: { name: 'Aptos', sz: 11 } };
    const centerStyle = { font: { name: 'Aptos', sz: 11 }, alignment: { horizontal: 'center' } };

    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;
        if (R === 0) {
          ws[cellRef].s = headerStyle;
        } else {
          if (C === 0 || C === 3 || C === 4 || C === 5 || C >= 6) {
            ws[cellRef].s = centerStyle;
          } else {
            ws[cellRef].s = regStyle;
          }
        }
      }
    }

    // Freeze panes and AutoFilter
    ws['!autofilter'] = { ref: ws['!ref'] };
    ws['!freeze'] = { xSplit: 3, ySplit: 1, topLeftCell: 'D2', activePane: 'bottomRight', state: 'frozen' };

    // Column widths
    const colWidths = [
      { wch: 6 },  // STT
      { wch: 24 }, // Họ tên
      { wch: 30 }, // Email
      { wch: 18 }, // Vai trò
      { wch: 14 }, // Trạng thái
      { wch: 16 }  // Ngày tạo
    ];
    features.forEach(() => {
      colWidths.push({ wch: 22 });
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Ma Trận Phân Quyền');
    const fileName = `A.Kitchen_MaTran_PhanQuyen_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
    if (typeof showToast === 'function') {
      showToast('Đã xuất file Excel Ma Trận thành công (Font Aptos)!', 'success');
    }
  } catch (err: any) {
    console.error('Error exportUserMatrixExcel:', err);
    if (typeof showToast === 'function') {
      showToast('Lỗi khi xuất file Excel: ' + err.message, 'error');
    }
  }
}
