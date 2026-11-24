import { showLoading, hideLoading, showToast } from './ui-feedback';

declare const XLSX: any;

export function openGeneralModal(title: string, bodyHtml: string): void {
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalBody');
  const modalEl = document.getElementById('generalModal');
  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.innerHTML = bodyHtml;
  if (modalEl) modalEl.classList.remove('hidden');
}

export function closeGeneralModal(): void {
  document.getElementById('generalModal')?.classList.add('hidden');
}

export function openAuthModal(type: 'login' | 'reg' = 'login'): void {
  const html = type === 'login' ? `
    <div class="space-y-3">
      <div><label class="font-bold block mb-1">Email:</label><input type="email" id="authEmail" value="" placeholder="user@gmail.com" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg"></div>
      <div><label class="font-bold block mb-1">Mật khẩu:</label><input type="password" id="authPass" value="123456" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg"></div>
      <div class="flex justify-between items-center pt-2">
        <button onclick="openAuthModal('reg')" class="text-brand-600 font-bold">Chưa có tài khoản? Đăng ký</button>
        <button onclick="doLogin()" class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold">Đăng nhập</button>
      </div>
    </div>
  ` : `
    <div class="space-y-2.5">
      <div><label class="font-bold block mb-1">Họ tên:</label><input type="text" id="regName" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg"></div>
      <div><label class="font-bold block mb-1">Email:</label><input type="email" id="regEmail" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg"></div>
      <div><label class="font-bold block mb-1">SĐT:</label><input type="tel" id="regPhone" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg"></div>
      <div><label class="font-bold block mb-1">Mật khẩu:</label><input type="password" id="regPass" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg"></div>
      <div class="flex justify-between items-center pt-2">
        <button onclick="openAuthModal('login')" class="text-brand-600 font-bold">Đã có tài khoản? Đăng nhập</button>
        <button onclick="doRegister()" class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold">Gửi đăng ký</button>
      </div>
    </div>
  `;
  openGeneralModal(type === 'login' ? 'Đăng nhập Ban Quản Trị' : 'Đăng ký tài khoản', html);
}

export async function doLogin(): Promise<void> {
  showLoading('Xác thực...');
  try {
    const emailEl = document.getElementById('authEmail') as HTMLInputElement | null;
    const passEl = document.getElementById('authPass') as HTMLInputElement | null;
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailEl?.value || '',
        password: passEl?.value || ''
      })
    });
    const json = await res.json();
    if (json.success) {
      const w = typeof window !== 'undefined' ? (window as any) : {};
      if (w.App) w.App.user = json.data;
      document.getElementById('adminLoggedOut')?.classList.add('hidden');
      document.getElementById('adminLoggedIn')?.classList.remove('hidden');
      const adnEl = document.getElementById('adName'); if (adnEl) adnEl.textContent = json.data.fullName;
      if (document.getElementById('sidebarUserName')) (document.getElementById('sidebarUserName') as HTMLElement).textContent = json.data.fullName;
      const adsEl = document.getElementById('adStatus'); if (adsEl) adsEl.textContent = json.data.role || 'Admin';
      if (document.getElementById('sidebarUserRole')) (document.getElementById('sidebarUserRole') as HTMLElement).textContent = json.data.role || 'Admin';
      const adaEl = document.getElementById('adAva'); if (adaEl) adaEl.textContent = json.data.fullName[0].toUpperCase();
      if (document.getElementById('userAvatar')) (document.getElementById('userAvatar') as HTMLElement).textContent = json.data.fullName[0].toUpperCase();
      closeGeneralModal();
      showToast(`Xin chào, ${json.data.fullName}!`);
    } else {
      showToast('Lỗi: ' + json.error);
    }
  } catch (e: any) {
    showToast('Lỗi: ' + e.message);
  } finally {
    hideLoading();
  }
}

export async function doRegister(): Promise<void> {
  showLoading('Gửi thông tin đăng ký...');
  try {
    const nameEl = document.getElementById('regName') as HTMLInputElement | null;
    const emailEl = document.getElementById('regEmail') as HTMLInputElement | null;
    const phoneEl = document.getElementById('regPhone') as HTMLInputElement | null;
    const passEl = document.getElementById('regPass') as HTMLInputElement | null;
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: nameEl?.value || '',
        email: emailEl?.value || '',
        phone: phoneEl?.value || '',
        password: passEl?.value || ''
      })
    });
    const json = await res.json();
    if (json.success) {
      closeGeneralModal();
      showToast(json.message);
    } else {
      showToast('Lỗi: ' + json.error);
    }
  } catch (e: any) {
    showToast('Lỗi: ' + e.message);
  } finally {
    hideLoading();
  }
}

export function logoutAdmin(): void {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  if (w.App) w.App.user = null;
  document.getElementById('adminLoggedIn')?.classList.add('hidden');
  document.getElementById('adminLoggedOut')?.classList.remove('hidden');
  showToast('Đã đăng xuất.');
}

/**
 * Standard Excel Export (Aptos font, Navy header #1F4E79, freeze panes, autofilter)
 */
export function exportStyledExcel(
  fileName: string,
  sheetName: string,
  headers: string[],
  dataRows: any[][],
  numCols: number[] = [],
  codeCols: number[] = []
): void {
  if (typeof XLSX === 'undefined') {
    showToast('Thư viện Excel chưa được tải xong');
    return;
  }
  const wb = XLSX.utils.book_new();
  const wsData = [headers, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;

      if (R === 0) {
        ws[cellAddress].s = {
          font: { name: 'Aptos', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '1F4E79' } },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
        };
      } else {
        const isNum = numCols.includes(C);
        const isCode = codeCols.includes(C);
        ws[cellAddress].s = {
          font: { name: 'Aptos', sz: 11, bold: false, color: { rgb: '000000' } },
          alignment: {
            horizontal: isNum ? 'right' : (isCode ? 'center' : 'left'),
            vertical: 'center'
          }
        };
      }
    }
  }

  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  ws['!autofilter'] = { ref: ws['!ref'] };

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
}

export function exportVouchersExcel(): void {
  fetch('/api/vouchers')
    .then(r => r.json())
    .then(json => {
      if (json.success && json.data) {
        const headers = ['Mã chứng từ', 'Site', 'Loại chứng từ', 'Ngày xuất', 'Ngày nhận', 'Nhà cung cấp', 'Người giao', 'Người nhận', 'Người nhập', 'Ghi chú'];
        const rows = json.data.map((v: any) => [v.maCT, v.site, v.loaiHoaDon, v.ngayXuat, v.ngayNhan, v.nhaCungCap, v.nguoiGiao, v.nguoiNhan, v.nguoiNhap, v.ghiChu]);
        exportStyledExcel('Danh_Sach_Chung_Tu.xlsx', 'ChungTu', headers, rows, [], [0, 3, 4]);
      }
    })
    .catch(e => {
      showToast('Lỗi xuất Excel: ' + e.message);
    });
}

export function exportSingleOrderExcel(orderCode: string): void {
  fetch(`/api/order-detail?orderCode=${encodeURIComponent(orderCode)}`)
    .then(r => r.json())
    .then(json => {
      if (json.success && json.data && json.data.items) {
        const headers = ['Mã hàng', 'Tên sản phẩm', 'ĐVT', 'Số lượng đặt', 'Đơn giá', 'Thành tiền', 'Ghi chú'];
        const rows = json.data.items.map((it: any) => [it.maHang, it.tenSP, it.dvt, it.soLuong, it.donGia, it.thanhTien, it.ghiChu || '']);
        exportStyledExcel(`Phieu_Dat_Hang_${orderCode}.xlsx`, 'DonHang', headers, rows, [3, 4, 5], [0, 2]);
      }
    })
    .catch(e => {
      showToast('Lỗi xuất Excel: ' + e.message);
    });
}
