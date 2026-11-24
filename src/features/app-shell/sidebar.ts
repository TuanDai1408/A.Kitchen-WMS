declare const closeMobileMenuHub: () => void;

export function openSidebar(): void {
  if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
    document.body.classList.remove('sidebar-collapsed');
    return;
  }
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const bottomNav = document.getElementById('mobileBottomNav');
  if (sidebar) sidebar.classList.remove('-translate-x-full');
  if (overlay) overlay.classList.remove('hidden');
  if (bottomNav) bottomNav.classList.add('hidden');
  document.body.classList.add('overflow-hidden');
  if (typeof (window as any).closeMobileMenuHub === 'function') {
    (window as any).closeMobileMenuHub();
  }
}

export function closeSidebar(): void {
  if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
    document.body.classList.add('sidebar-collapsed');
    return;
  }
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const bottomNav = document.getElementById('mobileBottomNav');
  if (sidebar) sidebar.classList.add('-translate-x-full');
  if (overlay) overlay.classList.add('hidden');
  if (bottomNav) bottomNav.classList.remove('hidden');
  document.body.classList.remove('overflow-hidden');
}

export function toggleSidebar(): void {
  if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
    document.body.classList.toggle('sidebar-collapsed');
  } else {
    const sidebar = document.getElementById('sidebar');
    const isClosed = !sidebar || sidebar.classList.contains('-translate-x-full');
    if (isClosed) {
      openSidebar();
    } else {
      closeSidebar();
    }
  }
}

if (typeof window !== 'undefined') {
  // Auto-clean responsive sidebar on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1280) {
      closeSidebar();
      document.getElementById('sidebar')?.classList.remove('-translate-x-full');
    }
  });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeSidebar();
      if (typeof (window as any).closeMobileMenuHub === 'function') {
        (window as any).closeMobileMenuHub();
      }
    }
  });
}
