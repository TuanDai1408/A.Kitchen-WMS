/**
 * Standard API Response Structures for Cloudflare Workers & D1 Backend
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  site_code?: string;
  status?: string;
}
