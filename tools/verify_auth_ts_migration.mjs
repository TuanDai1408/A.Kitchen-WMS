import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

async function main() {
  console.log('--- STARTING MODULE 13 VERIFICATION: AUTH & DYNAMIC RBAC ENGINE ---');
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
    await page.waitForTimeout(1000);

    // 2. Test Google Auth Modal
    console.log('2. Testing openGoogleAuthModal() & closeGoogleAuthModal() ...');
    const authModalState = await page.evaluate(() => {
      window.openGoogleAuthModal(false);
      const modal = document.getElementById('googleAuthModal');
      const isVisible = modal && !modal.classList.contains('hidden');
      return { isVisible };
    });
    console.log('Google Auth Modal state:', authModalState);
    if (!authModalState.isVisible) {
      throw new Error('Google Auth Modal did not open!');
    }

    const authModalShot = path.join(ARTIFACT_DIR, 'ts_auth_login_modal.png');
    await page.screenshot({ path: authModalShot });
    console.log('Google auth modal screenshot saved to:', authModalShot);

    await page.evaluate(() => {
      window.closeGoogleAuthModal(true);
    });
    await page.waitForTimeout(300);

    // 3. Test Multi-Account Operations & Profile Modal
    console.log('3. Testing Multi-Account operations & User Profile Modal ...');
    const multiAccResult = await page.evaluate(() => {
      window.saveAccountToList({
        id: 999,
        email: 'test.user@akitchen.vn',
        fullName: 'Nguyễn Văn Test',
        role: 'BEP_TRUONG',
        roleName: 'Bếp Trưởng',
        assignedSite: 'K001'
      });
      const saved = window.getSavedAccounts();
      const hasTestUser = saved.some(a => a.email === 'test.user@akitchen.vn');

      window.openUserProfileModal();
      const modal = document.getElementById('userProfileModal');
      const isVisible = modal && !modal.classList.contains('hidden');
      const emailText = document.getElementById('profModalEmail')?.textContent || '';

      return {
        hasTestUser,
        savedCount: saved.length,
        profileModalVisible: isVisible,
        emailText
      };
    });
    console.log('Multi-Account Result:', multiAccResult);
    if (!multiAccResult.hasTestUser || !multiAccResult.profileModalVisible) {
      throw new Error('Multi-account or profile modal failed!');
    }

    const profileModalShot = path.join(ARTIFACT_DIR, 'ts_auth_user_profile_modal.png');
    await page.screenshot({ path: profileModalShot });
    console.log('User profile modal screenshot saved to:', profileModalShot);

    await page.evaluate(() => {
      window.closeUserProfileModal();
      window.removeSavedAccount('test.user@akitchen.vn');
    });
    await page.waitForTimeout(300);

    // 4. Test Sites Selector Modal
    console.log('4. Testing Sites Selector Modal ...');
    const sitesModalResult = await page.evaluate(() => {
      window.openSiteSelectorModal();
      const modal = document.getElementById('siteSelectorModal');
      const isVisible = modal && !modal.classList.contains('hidden');
      const cardCount = document.querySelectorAll('.site-option-card').length;
      window.filterSiteOptionCards('Hùng Vương');
      const visibleFiltered = document.querySelectorAll('.site-option-card:not(.hidden)').length;
      window.selectSiteOption('K001');
      window.saveSiteSelection();
      return {
        isVisible,
        cardCount,
        visibleFiltered
      };
    });
    console.log('Sites Selector Result:', sitesModalResult);
    if (!sitesModalResult.isVisible || sitesModalResult.cardCount < 10) {
      throw new Error('Sites selector modal did not render properly!');
    }

    const siteSelectorShot = path.join(ARTIFACT_DIR, 'ts_auth_site_selector_modal.png');
    await page.screenshot({ path: siteSelectorShot });
    console.log('Site selector modal screenshot saved to:', siteSelectorShot);

    // 5. Test Role Switcher Modal
    console.log('5. Testing Role Switcher Modal ...');
    const roleSwitcherResult = await page.evaluate(() => {
      window.openRoleSwitcherModal();
      const modal = document.getElementById('roleSwitcherModal');
      const isVisible = modal && !modal.classList.contains('hidden');
      const roleItems = document.querySelectorAll('#roleSwitcherList > div').length;
      return { isVisible, roleItems };
    });
    console.log('Role Switcher Result:', roleSwitcherResult);
    if (!roleSwitcherResult.isVisible || roleSwitcherResult.roleItems < 5) {
      throw new Error('Role switcher modal failed to render 5 roles!');
    }

    const roleSwitcherShot = path.join(ARTIFACT_DIR, 'ts_auth_role_switcher_modal.png');
    await page.screenshot({ path: roleSwitcherShot });
    console.log('Role switcher screenshot saved to:', roleSwitcherShot);

    await page.evaluate(() => {
      window.closeRoleSwitcherModal();
    });
    await page.waitForTimeout(300);

    // 6. Test Request Access Modal
    console.log('6. Testing Request Access Modal ...');
    const reqAccessResult = await page.evaluate(() => {
      window.openRequestAccessModal('fnb-chain');
      const modal = document.getElementById('requestAccessModal');
      const isVisible = modal && !modal.classList.contains('hidden');
      const featName = document.getElementById('reqFeatureName')?.textContent || '';
      return { isVisible, featName };
    });
    console.log('Request Access Result:', reqAccessResult);
    if (!reqAccessResult.isVisible) {
      throw new Error('Request access modal failed to open!');
    }

    const reqAccessShot = path.join(ARTIFACT_DIR, 'ts_auth_request_access_modal.png');
    await page.screenshot({ path: reqAccessShot });
    console.log('Request access modal screenshot saved to:', reqAccessShot);

    await page.evaluate(() => {
      window.closeRequestAccessModal();
    });
    await page.waitForTimeout(300);

    // 7. Test Dynamic RBAC access logic
    console.log('7. Testing Dynamic RBAC canAccessTab() ...');
    const rbacCheck = await page.evaluate(() => {
      const adminCanChain = window.canAccessTab('fnb-chain');
      const adminCanWh = window.canAccessTab('wh-dashboard');

      // Test mock chef user
      const originalUser = window.gCurrentUser;
      window.gCurrentUser = {
        email: 'bep.k001@akitchen.vn',
        role: 'BEP_TRUONG'
      };
      const chefCanChain = window.canAccessTab('fnb-chain');
      const chefCanCounts = window.canAccessTab('fnb-counts');

      // Restore admin
      window.gCurrentUser = originalUser;
      return {
        adminCanChain,
        adminCanWh,
        chefCanChain,
        chefCanCounts
      };
    });
    console.log('RBAC Check Result:', rbacCheck);
    if (!rbacCheck.adminCanChain || !rbacCheck.adminCanWh || rbacCheck.chefCanChain || !rbacCheck.chefCanCounts) {
      throw new Error(`RBAC permissions test failed! Result: ${JSON.stringify(rbacCheck)}`);
    }

    // 8. Check console errors
    console.log('8. Checking console errors ...');
    if (consoleErrors.length > 0) {
      console.warn('Console errors detected:', consoleErrors);
      throw new Error('Fatal console errors occurred: ' + consoleErrors.join('; '));
    }

    console.log('=== MODULE 13 VERIFICATION COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('VERIFICATION FAILED:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
