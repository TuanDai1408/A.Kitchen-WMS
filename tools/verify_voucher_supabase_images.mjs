import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const possiblePaths = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));
const ARTIFACT_DIR = 'C:/Users/TLG/.gemini/antigravity/brain/f68f16c1-0634-4041-802c-7cdb7f1ccf17';

// 1x1 red PNG and 1x1 blue PNG for test uploads
const PNG_1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC', 'base64');
const PNG_2 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC', 'base64');

async function run() {
  console.log('🚀 Starting Voucher Supabase Storage E2E verification...');
  const browser = await chromium.launch({ headless: true, executablePath });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    const adminUser = {
      email: 'trantuandai2508@gmail.com',
      full_name: 'Trần Tuấn Đại',
      role: 'ADMIN',
      role_code: 'ADMIN',
      assignedSite: 'K001',
      status: 'ACTIVE'
    };
    localStorage.setItem('orbit_user', JSON.stringify(adminUser));
    localStorage.setItem('orbit_user_site', 'K001');
  });

  await page.goto('http://127.0.0.1:8787', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Switch to Tạo & duyệt chứng từ (portal-voucher)
  await page.evaluate(() => window.switchTab && window.switchTab('portal-voucher'));
  await page.waitForTimeout(500);

  // Attach PNG_1 to #ctFile
  const tmpFile1 = path.join(ARTIFACT_DIR, 'scratch_test_voucher_1.png');
  const tmpFile2 = path.join(ARTIFACT_DIR, 'scratch_test_voucher_2.png');
  fs.writeFileSync(tmpFile1, PNG_1);
  fs.writeFileSync(tmpFile2, PNG_2);

  await page.setInputFiles('#ctFile', tmpFile1);
  await page.waitForTimeout(400);

  // Fill form fields
  await page.evaluate(() => {
    const siteEl = document.getElementById('ctSite');
    if (siteEl && siteEl.options.length > 0 && !siteEl.value) siteEl.selectedIndex = 0;
    const loaiEl = document.getElementById('ctLoai');
    if (loaiEl) loaiEl.value = 'Hóa đơn GTGT';
    const nx = document.getElementById('ctNgayXuat');
    const nn = document.getElementById('ctNgayNhan');
    if (nx && !nx.value) nx.value = '2026-11-25';
    if (nn && !nn.value) nn.value = '2026-11-25';
    const ncc = document.getElementById('ctNCC');
    if (ncc) ncc.value = 'NCC Test Supabase Storage';
  });

  // Save voucher
  await page.click('#btnLuuCT');
  await page.waitForSelector('#generalModal:not(.hidden)', { timeout: 15000 });
  await page.waitForTimeout(400);

  const modalText = await page.textContent('#generalModal');
  const match = modalText && modalText.match(/Mã chứng từ:\s*([A-Z0-9-]+)/);
  if (!match) {
    throw new Error('Could not find created voucher code in modal: ' + modalText);
  }
  const maCT = match[1];
  console.log('✅ Created voucher:', maCT);

  // Close general modal and verify detail via API
  await page.evaluate(() => window.closeGeneralModal && window.closeGeneralModal());
  const detail1 = await page.evaluate(async (code) => {
    const r = await fetch(`/api/voucher-detail?maCT=${encodeURIComponent(code)}`);
    return await r.json();
  }, maCT);
  console.log('Detail files after create:', detail1.data?.files);
  const firstLink = detail1.data?.files?.[0]?.file_link || '';
  if (!firstLink.includes('supabase.co/storage/v1/object/public/vouchers/')) {
    throw new Error('Expected Supabase public URL in chung_tu_file, got: ' + firstLink);
  }

  // 2. Switch to Tra cứu chứng từ (portal-search) and open detail modal
  await page.evaluate(() => window.switchTab && window.switchTab('portal-search'));
  await page.waitForTimeout(800);
  await page.evaluate((code) => window.viewVoucherDetail && window.viewVoucherDetail(code), maCT);
  await page.waitForSelector('#generalModal:not(.hidden)', { timeout: 10000 });
  await page.waitForTimeout(1200);

  const imgLoaded = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('#generalModal img'));
    return imgs.some(img => img.src.includes('supabase.co/storage/v1/object/public/vouchers/') && img.complete && img.naturalWidth > 0);
  });
  console.log('Detail modal Supabase image loaded?:', imgLoaded);
  if (!imgLoaded) {
    throw new Error('Image thumbnail did not load in viewVoucherDetail modal!');
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'voucher_detail_supabase_image.png') });

  // 3. Open Edit Voucher Modal and add a 2nd image
  await page.evaluate((code) => {
    window.closeGeneralModal && window.closeGeneralModal();
    window.openEditVoucherModal && window.openEditVoucherModal(code);
  }, maCT);
  await page.waitForSelector('#modalEditVoucher:not(.hidden)', { timeout: 10000 });
  await page.waitForTimeout(400);

  await page.setInputFiles('#editVoucherNewFilesInput', tmpFile2);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'voucher_edit_add_image.png') });

  await page.click('#btnSaveEditVoucher');
  await page.waitForFunction(() => {
    const el = document.getElementById('modalEditVoucher');
    return el && el.classList.contains('hidden');
  }, { timeout: 15000 });
  await page.waitForTimeout(500);

  const detail2 = await page.evaluate(async (code) => {
    const r = await fetch(`/api/voucher-detail?maCT=${encodeURIComponent(code)}`);
    return await r.json();
  }, maCT);
  console.log('Detail files after edit:', detail2.data?.files);
  if (!detail2.data?.files || detail2.data.files.length !== 2) {
    throw new Error('Expected 2 files after editing voucher, got: ' + (detail2.data?.files?.length || 0));
  }

  // Cleanup test voucher from DB and temp files
  await page.evaluate(async (code) => {
    await fetch('/api/voucher', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maCT: code })
    });
  }, maCT);
  try { fs.unlinkSync(tmpFile1); fs.unlinkSync(tmpFile2); } catch {}

  console.log('✅ ALL VOUCHER SUPABASE STORAGE TESTS PASSED!');
  await browser.close();
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
