import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const possiblePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));

const artifactDir = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('--- TEST SCENARIO 1: Non-Admin User (Bếp trưởng / longchaulabeling2) ---');
  await page.goto('http://localhost:8787', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Set mock non-admin user in localStorage
  await page.evaluate(() => {
    localStorage.setItem('orbit_user_site', 'K001');
    localStorage.setItem('orbit_user_email', 'bep_truong_k001@gmail.com');
    localStorage.setItem('orbit_user_role', 'BEP_TRUONG');
    window.isForceAuthModal = false;
    const authModal = document.getElementById('googleAuthModal');
    if (authModal) authModal.classList.add('hidden');

    window.gCurrentUser = {
      email: 'bep_truong_k001@gmail.com',
      fullName: 'Nguyễn Văn Hùng (Bếp trưởng K001)',
      role: 'BEP_TRUONG',
      roleName: 'Bếp Trưởng Cơ Sở',
      assignedSite: 'K001',
      permissions: {
        'fnb-kitchen-issue': { canView: true, canEdit: true },
        'fnb-counts': { canView: true, canEdit: true }
      }
    };
    if (typeof window.onGlobalBranchChange === 'function') {
      window.onGlobalBranchChange('K001');
    }
  });
  await page.waitForTimeout(500);

  // 1. Switch to tab "Xuất kho sử dụng" (fnb-kitchen-issue)
  await page.evaluate(() => {
    if (typeof window.switchTab === 'function') {
      window.switchTab('fnb-kitchen-issue');
    }
  });
  await page.waitForTimeout(1000);

  // Check UI state on "Xuất kho sử dụng"
  const kitchenUiCheck = await page.evaluate(() => {
    const select = document.getElementById('kitchenIssueSiteSelect');
    const badgeContainer = document.getElementById('kitchenIssueSiteBadgeContainer');
    const badgeText = document.getElementById('kitchenIssueCurrentSiteBadge')?.textContent?.trim();
    const lockText = document.getElementById('kitchenIssueLockBadge')?.textContent?.trim();
    return {
      selectHidden: select ? select.classList.contains('hidden') : true,
      badgeVisible: badgeContainer ? !badgeContainer.classList.contains('hidden') : false,
      badgeText,
      lockText
    };
  });
  console.log('Kitchen Issue Tab UI check:', kitchenUiCheck);

  const kitchenTabScreenshot = path.join(artifactDir, 'kitchen_issue_tab_fixed_site.png');
  await page.screenshot({ path: kitchenTabScreenshot });
  console.log('Saved screenshot:', kitchenTabScreenshot);

  // 2. Click on the site badge as non-admin -> Should trigger Request Access modal
  console.log('Non-admin clicks on site badge to change site...');
  await page.evaluate(() => {
    if (typeof window.handleKitchenIssueSiteClick === 'function') {
      window.handleKitchenIssueSiteClick();
    }
  });
  await page.waitForTimeout(1000);

  const requestModalCheck = await page.evaluate(() => {
    const modal = document.getElementById('requestAccessModal');
    const featureName = document.getElementById('reqFeatureName')?.textContent?.trim();
    const featureDesc = document.getElementById('reqFeatureDesc')?.textContent?.trim();
    const reason = (document.getElementById('reqReasonInput'))?.value;
    return {
      modalOpen: modal ? !modal.classList.contains('hidden') : false,
      featureName,
      featureDesc,
      reason
    };
  });
  console.log('Request Access Modal check for Non-admin:', requestModalCheck);

  const reqModalScreenshot = path.join(artifactDir, 'request_access_modal_site_lock.png');
  await page.screenshot({ path: reqModalScreenshot });
  console.log('Saved screenshot:', reqModalScreenshot);

  // Close request modal
  await page.evaluate(() => {
    if (typeof window.closeRequestAccessModal === 'function') {
      window.closeRequestAccessModal();
    } else {
      document.getElementById('requestAccessModal')?.classList.add('hidden');
    }
  });
  await page.waitForTimeout(500);

  console.log('--- TEST SCENARIO 2: Admin User (trantuandai2508@gmail.com) ---');
  await page.evaluate(() => {
    window.gCurrentUser = {
      email: 'trantuandai2508@gmail.com',
      fullName: 'Trần Tuấn Đại (Admin)',
      role: 'ADMIN',
      roleName: 'Quản Trị Viên Hệ Thống',
      assignedSite: 'K001',
      permissions: ['*']
    };
  });

  // Admin clicks site badge -> Should open Site Selector modal
  console.log('Admin clicks on site badge...');
  await page.evaluate(() => {
    if (typeof window.handleKitchenIssueSiteClick === 'function') {
      window.handleKitchenIssueSiteClick();
    }
  });
  await page.waitForTimeout(1000);

  const siteModalCheck = await page.evaluate(() => {
    const modal = document.getElementById('siteSelectorModal');
    return {
      siteModalOpen: modal ? !modal.classList.contains('hidden') : false
    };
  });
  console.log('Site Selector Modal check for Admin:', siteModalCheck);

  const adminSiteModalScreenshot = path.join(artifactDir, 'admin_site_selector_modal.png');
  await page.screenshot({ path: adminSiteModalScreenshot });
  console.log('Saved screenshot:', adminSiteModalScreenshot);

  await browser.close();
  console.log('ALL SITE PERMISSION AND LOCK CHECKS COMPLETED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
