import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

async function main() {
  console.log('--- STARTING MODULE 14 VERIFICATION: APP SHELL & NAVIGATION SYSTEM ---');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('orbit_user', JSON.stringify({
      email: 'admin@akitchen.vn',
      fullName: 'System Admin',
      role: 'ADMIN',
      roleName: 'Ban Quản Trị Hệ Thống',
      assignedSite: 'K001'
    }));
    localStorage.setItem('orbit_user_site', 'K001');
    localStorage.setItem('orbit_active_tab', 'wh-dashboard');
  });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      if (!txt.includes('favicon') && !txt.includes('404') && !txt.includes('GSI_LOGGER') && !txt.includes('403')) {
        consoleErrors.push(txt);
      }
    }
  });

  try {
    console.log('1. Navigating to http://localhost:8787 ...');
    await page.goto('http://localhost:8787', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);

    // 2. Test Initial App Shell State & Dashboard
    console.log('2. Testing App Shell State & Dashboard ...');
    const shellState = await page.evaluate(() => {
      const activePanel = document.querySelector('.tab-panel.active');
      const activeTabId = activePanel ? activePanel.id : '';
      const hasApp = typeof window.App === 'object' && window.App !== null;
      const sitesCount = window.App?.siteObjs?.length || 0;
      return {
        activeTabId,
        hasApp,
        sitesCount
      };
    });
    console.log('Shell Initial State:', shellState);

    const dashShot = path.join(ARTIFACT_DIR, 'ts_app_shell_dashboard.png');
    await page.screenshot({ path: dashShot });
    console.log('Dashboard screenshot saved to:', dashShot);

    // 3. Test Tab Switching
    console.log('3. Testing Tab Switching across modules ...');
    const tabSwitchResult = await page.evaluate(() => {
      window.switchTab('fnb-chain');
      const chainActive = document.getElementById('fnb-chain')?.classList.contains('active');
      const navBtnActive = document.querySelector('.nav-btn[data-tab="fnb-chain"]')?.classList.contains('active');
      
      window.switchTab('portal-order');
      const orderActive = document.getElementById('portal-order')?.classList.contains('active');

      window.switchTab('wh-dashboard');
      const whActive = document.getElementById('wh-dashboard')?.classList.contains('active');

      return { chainActive, navBtnActive, orderActive, whActive };
    });
    console.log('Tab Switch Result:', tabSwitchResult);
    if (!tabSwitchResult.chainActive || !tabSwitchResult.orderActive || !tabSwitchResult.whActive) {
      throw new Error('Tab switching failed!');
    }

    // 4. Test Global Branch & Month Filters
    console.log('4. Testing Global Branch & Month change handlers ...');
    const branchResult = await page.evaluate(() => {
      window.onGlobalBranchChange('K002');
      const curBranch = window.App?.currentBranch;
      const pillName = document.getElementById('taskbarSiteName')?.textContent || '';
      const hiddenSelectVal = document.getElementById('globalBranchSelect')?.value;

      window.onGlobalMonthChange('2026-12');
      const orderMonthVal = document.getElementById('orderMonth')?.value;

      // Revert branch to K001
      window.onGlobalBranchChange('K001');

      return { curBranch, pillName, hiddenSelectVal, orderMonthVal };
    });
    console.log('Branch Filter Result:', branchResult);
    if (branchResult.curBranch !== 'k002' || !branchResult.pillName.includes('K002')) {
      throw new Error('onGlobalBranchChange failed to update app state or pill!');
    }

    // 5. Test Theme Toggle
    console.log('5. Testing Theme Toggle (Dark/Light Mode) ...');
    const themeResult = await page.evaluate(() => {
      const wasDark = window.isDarkModeActive();
      window.toggleTheme();
      const isDarkNow = window.isDarkModeActive();
      window.toggleTheme();
      const isReverted = window.isDarkModeActive();
      return { wasDark, isDarkNow, isReverted };
    });
    console.log('Theme Result:', themeResult);
    if (themeResult.wasDark === themeResult.isDarkNow) {
      throw new Error('toggleTheme() did not change dark mode state!');
    }

    // 6. Test Sidebar Toggle
    console.log('6. Testing Sidebar open/close/toggle ...');
    const sidebarResult = await page.evaluate(() => {
      window.openSidebar();
      const afterOpen = document.body.classList.contains('sidebar-collapsed');
      window.toggleSidebar();
      const afterToggle = document.body.classList.contains('sidebar-collapsed');
      window.closeSidebar();
      const afterClose = document.body.classList.contains('sidebar-collapsed');
      return { afterOpen, afterToggle, afterClose };
    });
    console.log('Sidebar Result:', sidebarResult);

    // 7. Test Mobile Hub Menu
    console.log('7. Testing Mobile Menu Hub ...');
    const hubResult = await page.evaluate(() => {
      window.openMobileMenuHub();
      const hubEl = document.getElementById('mobileMenuHub');
      const isOpen = hubEl && !hubEl.classList.contains('hidden');
      window.filterMobileHubFeatures('Kho Vận');
      const visibleItems = document.querySelectorAll('.hub-item:not(.hidden)').length;
      return { isOpen, visibleItems };
    });
    console.log('Mobile Hub Result:', hubResult);
    if (!hubResult.isOpen) {
      throw new Error('Mobile Menu Hub failed to open!');
    }

    const hubShot = path.join(ARTIFACT_DIR, 'ts_app_shell_mobile_hub.png');
    await page.screenshot({ path: hubShot });
    console.log('Mobile hub screenshot saved to:', hubShot);

    await page.evaluate(() => {
      window.closeMobileMenuHub();
    });
    await page.waitForTimeout(300);

    // 8. Test Trend Period Change
    console.log('8. Testing changeTrendPeriod() ...');
    await page.evaluate(() => {
      window.changeTrendPeriod('month');
      window.changeTrendPeriod('quarter');
      window.changeTrendPeriod('week');
    });

    // 9. Switch to fnb-chain and capture screenshot
    console.log('9. Capturing F&B Chain Screenshot ...');
    await page.evaluate(() => {
      window.switchTab('fnb-chain');
    });
    await page.waitForTimeout(600);
    const chainShot = path.join(ARTIFACT_DIR, 'ts_app_shell_fnb_chain.png');
    await page.screenshot({ path: chainShot });
    console.log('F&B Chain screenshot saved to:', chainShot);

    // 10. Check Console Errors
    console.log('10. Checking console errors ...');
    if (consoleErrors.length > 0) {
      console.warn('Console errors detected:', consoleErrors);
      throw new Error('Fatal console errors occurred: ' + consoleErrors.join('; '));
    }

    console.log('=== MODULE 14 VERIFICATION COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('VERIFICATION FAILED:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
