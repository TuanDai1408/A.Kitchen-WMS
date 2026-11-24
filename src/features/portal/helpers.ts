import { escapeHtml } from '@/ts/utils/formatters';

export function fmtDate(val: any): string {
  if (!val || val === '—' || val === 'null' || val === 'undefined') return '—';
  const s = String(val).trim();
  if (!s) return '—';
  const m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (m) {
    const [, y, mth, d] = m;
    return `${d.padStart(2, '0')}/${mth.padStart(2, '0')}/${y}`;
  }
  const dObj = new Date(s);
  if (!isNaN(dObj.getTime())) {
    const d = String(dObj.getDate()).padStart(2, '0');
    const mth = String(dObj.getMonth() + 1).padStart(2, '0');
    const y = dObj.getFullYear();
    return `${d}/${mth}/${y}`;
  }
  return s;
}

export function cellCode(v: any): string {
  if (!v || v === '—' || v === 'null') return '<span class="text-gray-400">—</span>';
  return `<span class="code text-brand-600 dark:text-brand-400 font-semibold font-mono text-xs">${escapeHtml(String(v))}</span>`;
}

export function cellDate(v: any): string {
  return `<span class="num whitespace-nowrap font-mono text-xs">${fmtDate(v)}</span>`;
}

export function cellBadge(kind: string, text: any): string {
  if (!text || text === '—' || text === 'null') return '<span class="text-gray-400">—</span>';
  return `<span class="badge badge-${kind || 'neutral'} text-xs">${escapeHtml(String(text))}</span>`;
}

export function cellFiles(n: any): string {
  const count = parseInt(n, 10) || 0;
  if (!count) return '<span class="text-gray-400">—</span>';
  return `<span class="file-chip font-mono text-xs" title="${count} tệp đính kèm"><svg class="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg><span>${count}</span></span>`;
}

export function cellPerson(v: any): string {
  if (!v || v === 'unknown' || v === 'N/A' || v === 'undefined' || v === 'null' || String(v).trim() === '') {
    return '<span class="text-gray-400">—</span>';
  }
  return `<span class="text-gray-700 dark:text-gray-300 text-xs">${escapeHtml(String(v))}</span>`;
}

export function cellSite(code: string, name?: string): string {
  const display = name || code || '—';
  return `<span class="text-gray-900 dark:text-white font-medium truncate block max-w-[140px] text-xs" title="${escapeHtml(display)}">${escapeHtml(display)}</span>`;
}
