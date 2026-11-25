/**
 * Global UX Enhancements for PC & Mobile:
 * 1. Esc key closes the topmost open modal / lightbox.
 * 2. Enter key inside table/card numeric inputs jumps to the next numeric input.
 * 3. Auto-applies inputmode="decimal" to all <input type="number"> for Mobile numeric keyboards.
 * 4. Unsaved changes guard (beforeunload) when editing counts / kitchen-issue / audit / vouchers.
 */

const DIRTY_TAB_SELECTORS = ['#fnb-counts', '#fnb-kitchen-issue', '#portal-kiemke', '#portal-voucher'];
let _hasUnsavedFormChanges = false;

export function markUnsavedChanges(dirty: boolean = true): void {
  _hasUnsavedFormChanges = dirty;
}

export function hasUnsavedChanges(): boolean {
  return _hasUnsavedFormChanges;
}

function applyDecimalInputMode(root: ParentNode = document): void {
  const inputs = root.querySelectorAll('input[type="number"]:not([inputmode])');
  inputs.forEach((el) => {
    el.setAttribute('inputmode', 'decimal');
  });
}

function closeTopmostOpenModal(): boolean {
  const lb = document.getElementById('imageLightbox');
  if (lb && !lb.classList.contains('hidden')) {
    if (typeof (window as any).closeImageLightbox === 'function') {
      (window as any).closeImageLightbox();
      return true;
    }
  }

  const modals = Array.from(
    document.querySelectorAll<HTMLElement>('[id$="Modal"]:not(.hidden), [id^="modal"]:not(.hidden)')
  );
  if (!modals.length) return false;

  // Pick modal with highest z-index (or last in DOM)
  modals.sort((a, b) => {
    const za = parseInt(getComputedStyle(a).zIndex || '0', 10) || 0;
    const zb = parseInt(getComputedStyle(b).zIndex || '0', 10) || 0;
    return za - zb;
  });
  const topModal = modals[modals.length - 1];
  const closeBtn = topModal.querySelector<HTMLElement>(
    'button[onclick*="close"], button[onclick*="Close"]'
  );
  if (closeBtn) {
    closeBtn.click();
    return true;
  }
  topModal.classList.add('hidden');
  return true;
}

export function initGlobalUxEnhancements(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const w = window as any;
  if (w._uxEnhancementsInitialized) return;
  w._uxEnhancementsInitialized = true;

  // 1. Apply inputmode="decimal" initially and on dynamic DOM updates
  applyDecimalInputMode();
  let rafScheduled = false;
  const observer = new MutationObserver(() => {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      applyDecimalInputMode();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // 2. Global keyboard shortcuts (Esc to close modal, Enter to advance number inputs)
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (closeTopmostOpenModal()) {
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'Enter') {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.tagName === 'INPUT' &&
        (target as HTMLInputElement).type === 'number' &&
        target.closest('.data-table, .data-card, #editCountLinesBody, #kitchenIssueItemsBody')
      ) {
        e.preventDefault();
        const container = target.closest('section, [id$="Modal"], [id^="modal"]') || document;
        const allNumInputs = Array.from(
          container.querySelectorAll<HTMLInputElement>('input[type="number"]:not(:disabled):not([readonly])')
        ).filter(el => el.offsetParent !== null);
        const idx = allNumInputs.indexOf(target as HTMLInputElement);
        if (idx >= 0 && idx + 1 < allNumInputs.length) {
          allNumInputs[idx + 1].focus();
          allNumInputs[idx + 1].select();
        }
      }
    }
  });

  // 3. Track unsaved edits in entry tabs & clear on submit/reset
  document.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    if (DIRTY_TAB_SELECTORS.some(sel => target.closest(sel))) {
      const id = target.id || '';
      if (!id.toLowerCase().includes('search') && !id.toLowerCase().includes('filter')) {
        _hasUnsavedFormChanges = true;
      }
    }
  });

  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement | null;
    const btn = target?.closest('button');
    if (!btn) return;
    const onclickAttr = btn.getAttribute('onclick') || '';
    if (/(save|submit|reset|luu|xuat)/i.test(onclickAttr) || /(save|submit|luu|btnLuu)/i.test(btn.id || '')) {
      _hasUnsavedFormChanges = false;
    }
  });

  window.addEventListener('beforeunload', (e: BeforeUnloadEvent) => {
    if (_hasUnsavedFormChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  w.markUnsavedChanges = markUnsavedChanges;
  w.hasUnsavedChanges = hasUnsavedChanges;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalUxEnhancements);
  } else {
    initGlobalUxEnhancements();
  }
}
