import { TabMetadata } from './types';

declare const lucide: any;
declare const switchTab: (tabId: string) => void;
declare const canAccessTab: (tabId: string) => boolean;

export const TAB_META: Record<string, TabMetadata> = {
  // Nhóm 1: Hiệu Quả & Doanh Thu -> mobTab: 'fnb-chain'
  'fnb-chain': { title: 'Toàn Chuỗi & Xếp Hạng', mobTab: 'fnb-chain' },
  'fnb-pl': { title: 'Báo Cáo P&L Điểm Bán', mobTab: 'fnb-chain' },
  'fnb-pos': { title: 'Doanh Thu POS & Bán Lẻ', mobTab: 'fnb-chain' },

  // Nhóm 2: Vận Hành Kho Bếp -> mobTab: 'wh-dashboard'
  'wh-dashboard': { title: 'Tổng Quan Kho Vận', mobTab: 'wh-dashboard' },
  'fnb-counts': { title: 'Kiểm Kê Hằng Ngày', mobTab: 'wh-dashboard' },
  'fnb-receipts': { title: 'Nhập kho tại site', mobTab: 'wh-dashboard' },
  'fnb-kitchen-issue': { title: 'Xuất Kho Sử Dụng', mobTab: 'wh-dashboard' },
  'fnb-waste': { title: 'Hủy Hàng & Hao Hụt', mobTab: 'wh-dashboard' },

  // Nhóm 3: Kho Vận & WMS -> mobTab: 'wh-dashboard'
  'wh-stock': { title: 'Hạn Dùng & Xuất FEFO', mobTab: 'wh-dashboard' },
  'wh-reorder': { title: 'Cảnh Báo Tồn ROP', mobTab: 'wh-dashboard' },
  'wh-leadtime': { title: 'Lead Time & NCC', mobTab: 'wh-dashboard' },
  'wh-posap': { title: 'Tồn Kho & Quản Lý Lô', mobTab: 'wh-dashboard' },

  // Nhóm 4: Cổng Thông Tin & Đặt Hàng -> mobTab: 'portal-voucher' hoặc 'portal-baocao'
  'portal-voucher': { title: 'Tạo & Duyệt Chứng Từ', mobTab: 'portal-voucher' },
  'portal-search': { title: 'Tra Cứu Chứng Từ', mobTab: 'portal-voucher' },
  'portal-order': { title: 'Đặt Hàng Vật Tư Bếp', mobTab: 'portal-voucher' },
  'portal-history': { title: 'Lịch Sử Đặt Hàng', mobTab: 'portal-voucher' },
  'portal-baocao': { title: 'Báo Cáo Suất Ăn Ca', mobTab: 'portal-baocao' },
  'portal-kiemke': { title: 'Kiểm Kê Tồn Kho Kỳ', mobTab: 'portal-voucher' },

  // Nhóm 5: Hệ Thống & Danh Mục -> mobTab: 'hub'
  'fnb-sites': { title: 'Danh Mục 14 Điểm Bán', mobTab: 'hub' },
  'user-matrix': { title: 'Phân Quyền User Matrix', mobTab: 'hub' },
  'sys-config': { title: 'Cấu Hình Hệ Thống', mobTab: 'hub' }
};

export function openMobileMenuHub(): void {
  const hub = document.getElementById('mobileMenuHub');
  if (!hub) return;

  const curTabId = localStorage.getItem('orbit_active_tab') || 'fnb-chain';
  document.querySelectorAll('.hub-item').forEach(item => {
    const tabId = item.getAttribute('data-tab');
    const icWrap = item.querySelector('.hub-icon-wrap');
    if (tabId === curTabId) {
      item.classList.add('border-brand-500', 'bg-brand-50/50', 'dark:bg-brand-950/30');
      if (icWrap) {
        icWrap.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-400');
        icWrap.classList.add('bg-brand-500/10', 'text-brand-600', 'dark:text-brand-400');
      }
    } else {
      item.classList.remove('border-brand-500', 'bg-brand-50/50', 'dark:bg-brand-950/30');
      if (icWrap) {
        icWrap.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-400');
        icWrap.classList.remove('bg-brand-500/10', 'text-brand-600', 'dark:text-brand-400');
      }
    }
  });
  hub.classList.remove('hidden');
  hub.classList.add('flex');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hub.classList.add('active');
    });
  });
  document.body.classList.add('overflow-hidden');
  const input = document.getElementById('mobileHubSearchInput') as HTMLInputElement | null;
  if (input) {
    input.value = '';
    filterMobileHubFeatures('');
    setTimeout(() => {
      try { input.focus(); } catch (e) {}
    }, 250);
  }
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeMobileMenuHub(): void {
  const hub = document.getElementById('mobileMenuHub');
  if (!hub) return;
  hub.classList.remove('active');
  document.body.classList.remove('overflow-hidden');
  setTimeout(() => {
    hub.classList.remove('flex');
    hub.classList.add('hidden');
  }, 320);
}

export function filterMobileHubFeatures(val: string): void {
  const q = String(val || '').toLowerCase().trim();
  document.querySelectorAll('.hub-item').forEach(el => {
    const onclickStr = el.getAttribute('onclick') || '';
    const m = onclickStr.match(/switchFromHub\('([^']+)'\)/) || onclickStr.match(/switchTab\('([^']+)'\)/);
    const tabId = m ? m[1] : '';
    if (tabId && typeof (window as any).canAccessTab === 'function' && !(window as any).canAccessTab(tabId)) {
      (el as HTMLElement).style.display = 'none';
      el.classList.add('hidden');
      return;
    }
    if (!q || el.textContent?.toLowerCase().includes(q)) {
      (el as HTMLElement).style.display = 'flex';
      el.classList.remove('hidden');
    } else {
      (el as HTMLElement).style.display = 'none';
      el.classList.add('hidden');
    }
  });

  // Ẩn nhóm danh mục nếu không còn mục con nào khớp tìm kiếm
  document.querySelectorAll('#mobileMenuHub .mobile-hub-category').forEach(cat => {
    const visible = cat.querySelectorAll('.hub-item:not(.hidden)');
    if (visible.length === 0) {
      (cat as HTMLElement).style.display = 'none';
      cat.classList.add('hidden');
    } else {
      (cat as HTMLElement).style.display = '';
      cat.classList.remove('hidden');
    }
  });
}

export function switchFromHub(tabId: string): void {
  closeMobileMenuHub();
  if (typeof (window as any).switchTab === 'function') {
    (window as any).switchTab(tabId);
  }
}

const MOBILE_GROUP_TABS: Record<string, string[]> = {
  'fnb': ['fnb-chain', 'fnb-pl', 'fnb-pos'],
  'kho-van': ['wh-dashboard', 'fnb-receipts', 'fnb-kitchen-issue', 'fnb-counts', 'fnb-stock', 'fnb-waste', 'wh-stock', 'wh-reorder', 'wh-leadtime', 'wh-posap'],
  'chung-tu': ['portal-voucher', 'portal-search'],
  'suat-an': ['portal-baocao', 'portal-order', 'portal-history', 'portal-kiemke']
};

export function switchMobileGroupTab(groupKey: string): void {
  const w = typeof window !== 'undefined' ? (window as any) : {};
  const candidates = MOBILE_GROUP_TABS[groupKey] || [];
  const canAccess = typeof w.canAccessTab === 'function' ? w.canAccessTab : () => true;
  const target = candidates.find(t => canAccess(t));

  if (target) {
    if (typeof w.switchTab === 'function') {
      w.switchTab(target);
    }
    return;
  }

  if (typeof w.showToast === 'function') {
    w.showToast('Bạn không có quyền truy cập nhóm chức năng này', 'warning');
  }
}

export function updateMobileNavState(tabId: string): void {
  // Update mobile header title badge
  const titleEl = document.getElementById('mobileHeaderTitle');
  if (titleEl && TAB_META[tabId]) {
    titleEl.textContent = TAB_META[tabId].title;
  }

  // Update bottom navigation bar
  document.querySelectorAll('.mob-nav-btn').forEach(btn => {
    btn.classList.remove('active', 'text-brand-500', 'dark:text-brand-400', 'font-bold');
    btn.classList.add('text-gray-400', 'dark:text-gray-500', 'font-medium');
  });

  // 1. Direct match: Check if a visible bottom button is explicitly bound to this tab
  const directBtn = document.querySelector(`.mob-nav-btn[onclick*="'${tabId}'"]`);
  if (directBtn && !directBtn.classList.contains('hidden')) {
    directBtn.classList.remove('text-gray-400', 'dark:text-gray-500', 'font-medium');
    directBtn.classList.add('active', 'text-brand-500', 'dark:text-brand-400', 'font-bold');
    return;
  }

  // 2. Group match via TAB_META fallback
  const activeMobGroup = TAB_META[tabId]?.mobTab || 'hub';
  const activeBtn = document.getElementById(`mobTab-${activeMobGroup}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-gray-400', 'dark:text-gray-500', 'font-medium');
    activeBtn.classList.add('active', 'text-brand-500', 'dark:text-brand-400', 'font-bold');
  }
}

// Image / File Lightbox Engine
export function openImageLightbox(fileLink: string, fileName?: string, fileType?: string): void {
  const lb = document.getElementById('imageLightbox');
  if (!lb) {
    window.open(fileLink, '_blank');
    return;
  }
  const img = document.getElementById('lightboxImg') as HTMLImageElement | null;
  const iframe = document.getElementById('lightboxIframe') as HTMLIFrameElement | null;
  const titleEl = document.getElementById('lightboxFileName');
  if (titleEl) titleEl.textContent = fileName || 'Xem tệp đính kèm';

  const driveMatch = fileLink && fileLink.match(/\/d\/([^/\?]+)/);
  const driveId = driveMatch ? driveMatch[1] : null;

  const isImg = (fileType && fileType.startsWith('image/')) ||
    /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(fileName || '') ||
    /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(fileLink || '');

  if (driveId) {
    if (isImg) {
      if (img) {
        img.src = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`;
        img.classList.remove('hidden');
      }
      if (iframe) {
        iframe.classList.add('hidden');
        iframe.src = '';
      }
    } else {
      if (iframe) {
        iframe.src = `https://drive.google.com/file/d/${driveId}/preview`;
        iframe.classList.remove('hidden');
      }
      if (img) {
        img.classList.add('hidden');
        img.src = '';
      }
    }
  } else {
    if (isImg) {
      if (img) {
        img.src = fileLink;
        img.classList.remove('hidden');
      }
      if (iframe) {
        iframe.classList.add('hidden');
        iframe.src = '';
      }
    } else {
      window.open(fileLink, '_blank');
      return;
    }
  }
  lb.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function closeImageLightbox(): void {
  const lb = document.getElementById('imageLightbox');
  if (lb) lb.classList.add('hidden');
  const img = document.getElementById('lightboxImg') as HTMLImageElement | null;
  const iframe = document.getElementById('lightboxIframe') as HTMLIFrameElement | null;
  if (img) img.src = '';
  if (iframe) iframe.src = '';
  document.body.style.overflow = '';
}

if (typeof window !== 'undefined') {
  (window as any).switchMobileGroupTab = switchMobileGroupTab;
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      const hub = document.getElementById('mobileMenuHub');
      if (hub && !hub.classList.contains('hidden')) {
        closeMobileMenuHub();
      }
      closeImageLightbox();
    }
  });
}
