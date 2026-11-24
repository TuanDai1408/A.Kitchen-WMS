/**
 * Typed API Client for A.Kitchen WMS with SWR Memory Cache
 */

import type { ApiResponse, PurchaseOrder, POLine, GoodsReceipt, InventoryItem, ManualReceiptItem } from '@/types';

class ApiClient {
  private cache = new Map<string, { timestamp: number; data: unknown }>();
  private defaultTtl = 30000; // 30s cache

  public async get<T>(url: string, ttlMs = this.defaultTtl): Promise<ApiResponse<T>> {
    const now = Date.now();
    const cached = this.cache.get(url);

    if (cached && now - cached.timestamp < ttlMs) {
      // Revalidate in background if older than 10s
      if (now - cached.timestamp > 10000) {
        fetch(url)
          .then((r) => r.json() as Promise<ApiResponse<T>>)
          .then((res) => {
            if (res.success) this.cache.set(url, { timestamp: Date.now(), data: res });
          })
          .catch(() => {});
      }
      return cached.data as ApiResponse<T>;
    }

    try {
      const res = await fetch(url);
      const json = (await res.json()) as ApiResponse<T>;
      if (json.success) {
        this.cache.set(url, { timestamp: now, data: json });
      }
      return json;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ';
      return { success: false, error: errorMsg };
    }
  }

  public async post<T, B = unknown>(url: string, body: B): Promise<ApiResponse<T>> {
    // Invalidate cache on mutations
    this.cache.clear();

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return (await res.json()) as ApiResponse<T>;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ';
      return { success: false, error: errorMsg };
    }
  }

  public invalidate(urlPattern?: string): void {
    if (!urlPattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.includes(urlPattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Typed Domain Methods
  public async getPoList(siteCode: string, status = 'OPEN'): Promise<ApiResponse<PurchaseOrder[]>> {
    return this.get<PurchaseOrder[]>(`/api/fnb/po-list?site_code=${encodeURIComponent(siteCode)}&status=${encodeURIComponent(status)}`);
  }

  public async getPoDetails(poNumber: string): Promise<ApiResponse<POLine[]>> {
    return this.get<POLine[]>(`/api/fnb/po-details?po_number=${encodeURIComponent(poNumber)}`);
  }

  public async getReceiptHistory(siteCode: string): Promise<ApiResponse<GoodsReceipt[]>> {
    return this.get<GoodsReceipt[]>(`/api/fnb/receipts-history?site_code=${encodeURIComponent(siteCode)}`);
  }

  public async getInventory(siteCode: string): Promise<ApiResponse<InventoryItem[]>> {
    return this.get<InventoryItem[]>(`/api/wh/inventory?site=${encodeURIComponent(siteCode)}`);
  }

  public async submitManualReceipt(data: { site_code: string; lines: ManualReceiptItem[]; note?: string }): Promise<ApiResponse> {
    return this.post('/api/fnb/manual-receipt', data);
  }
}

export const api = new ApiClient();
