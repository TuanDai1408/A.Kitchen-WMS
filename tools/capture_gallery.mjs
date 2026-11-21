import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

async function main() {
  const artifactDir = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17/screenshots';
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const localScreenshotsDir = 'd:/Query/kho_gia_vi_cloudflare/tools/screenshots';
  if (!fs.existsSync(localScreenshotsDir)) {
    fs.mkdirSync(localScreenshotsDir, { recursive: true });
  }

  // Find Chrome executable on Windows
  const possiblePaths = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
  ];
  let executablePath = possiblePaths.find(p => fs.existsSync(p));
  console.log('Using browser executable:', executablePath);

  const browser = await chromium.launch({
    headless: true,
    executablePath
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  const filePath = 'file:///' + path.resolve('tools/kpi-gallery.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle' });

  // Wait for Lucide and ApexCharts to finish rendering
  await page.waitForTimeout(1000);

  // 1. Full page comparison (shows both Light & Dark galleries)
  const fullPathArtifact = path.join(artifactDir, 'kpi_gallery_overview.png');
  const fullPathLocal = path.join(localScreenshotsDir, 'kpi_gallery_overview.png');
  await page.screenshot({ path: fullPathArtifact, fullPage: true });
  await page.screenshot({ path: fullPathLocal, fullPage: true });
  console.log('Saved overview screenshot:', fullPathArtifact);

  // 2. Light mode viewport capture (Desktop 1440x900)
  const lightSection = page.locator('section:nth-of-type(1)');
  await lightSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const lightPathArtifact = path.join(artifactDir, 'kpi_gallery_light.png');
  await lightSection.screenshot({ path: lightPathArtifact });
  console.log('Saved light mode screenshot:', lightPathArtifact);

  // 3. Dark mode viewport capture (Desktop 1440x900)
  const darkSection = page.locator('section:nth-of-type(2)');
  await darkSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const darkPathArtifact = path.join(artifactDir, 'kpi_gallery_dark.png');
  await darkSection.screenshot({ path: darkPathArtifact });
  console.log('Saved dark mode screenshot:', darkPathArtifact);

  // 4. Mobile 390px capture (Testing responsiveness & no truncation)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);

  const mobileLightPath = path.join(artifactDir, 'kpi_gallery_mobile_light.png');
  await page.screenshot({ path: mobileLightPath, fullPage: false });
  console.log('Saved mobile screenshot:', mobileLightPath);

  await browser.close();
  console.log('All gallery screenshots captured successfully!');
}

main().catch(err => {
  console.error('Error running gallery capture:', err);
  process.exit(1);
});
