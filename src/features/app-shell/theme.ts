declare const lucide: any;

export function isDarkModeActive(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
}

export function toggleTheme(): void {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  if (isDark) {
    html.classList.remove('dark');
    localStorage.setItem('orbit_theme', 'light');
    localStorage.setItem('darkMode', 'false');
    document.documentElement.setAttribute('data-color-scheme', 'light');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.setAttribute('data-lucide', 'moon');
  } else {
    html.classList.add('dark');
    localStorage.setItem('orbit_theme', 'dark');
    localStorage.setItem('darkMode', 'true');
    document.documentElement.setAttribute('data-color-scheme', 'dark');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.setAttribute('data-lucide', 'sun');
  }
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

export function initTheme(): void {
  if (typeof localStorage === 'undefined') return;
  const saved = localStorage.getItem('orbit_theme') || 'light';
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
