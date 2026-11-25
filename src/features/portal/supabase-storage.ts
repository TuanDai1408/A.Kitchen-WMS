/**
 * Supabase Storage Helper cho Chứng Từ & Hình Ảnh Nghiệp Vụ
 * Bucket: vouchers (Public read/upload trên project AkitchenOperations)
 */

export const SUPABASE_STORAGE_URL = 'https://alqcojnxshfylheovdgw.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWNvam54c2hmeWxoZW92ZGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NzgzMDUsImV4cCI6MjEwNjM1NDMwNX0.OVSgKhAMzXYmUDHTv4a8JwkfpaK_k9Q3p2HOjEM8MAk';
export const VOUCHERS_BUCKET = 'vouchers';

export interface UploadedSupabaseFile {
  name: string;
  url: string;
  type: string;
  size: number;
  storagePath: string;
}

function sanitizeFileName(name: string): string {
  const normalized = (name || 'file')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
  return normalized.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_');
}

export function isImageFile(fileName?: string, fileType?: string, fileLink?: string): boolean {
  if (fileType && fileType.toLowerCase().startsWith('image/')) return true;
  const imgExtRegex = /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i;
  if (fileName && imgExtRegex.test(fileName)) return true;
  if (fileLink && imgExtRegex.test(fileLink)) return true;
  return false;
}

export function resolveVoucherImageThumbUrl(file: {
  file_name?: string;
  file_type?: string;
  file_link?: string;
}): string {
  const link = (file.file_link || '').trim();
  if (!link || link === 'https://drive.google.com/sample') return '';

  const isImg = isImageFile(file.file_name, file.file_type, link);
  if (!isImg) return '';

  const driveMatch = link.match(/\/d\/([^/?]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w600`;
  }

  return link;
}

export async function uploadVoucherFileToSupabase(
  file: File,
  folderPrefix?: string
): Promise<UploadedSupabaseFile> {
  const now = new Date();
  const dateFolder = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const cleanFolder = sanitizeFileName(folderPrefix || 'chung-tu').replace(/\.+/g, '') || 'chung-tu';
  const rand = Math.random().toString(36).slice(2, 8);
  const safeName = sanitizeFileName(file.name);
  const storagePath = `${cleanFolder}/${dateFolder}/${Date.now()}_${rand}_${safeName}`;

  const uploadUrl = `${SUPABASE_STORAGE_URL}/storage/v1/object/${VOUCHERS_BUCKET}/${storagePath}`;
  const resp = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'true'
    },
    body: file
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`Upload Supabase Storage thất bại (${resp.status}): ${errText || resp.statusText}`);
  }

  const publicUrl = `${SUPABASE_STORAGE_URL}/storage/v1/object/public/${VOUCHERS_BUCKET}/${storagePath}`;
  return {
    name: file.name,
    url: publicUrl,
    type: file.type || 'application/octet-stream',
    size: file.size,
    storagePath
  };
}
