export interface CoreApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}
 
export interface LoginResponse {
  access_token: string;
  role: string;
}
 
export interface Session {
  access_token: string;
  role: string;
}

// Batch API Types
export interface CreateSampleResponse {
  sample_id: string;
  error?: string;
  details?: string;
}

export interface CreateSlideResponse {
  slide_id: string;
  sample_id: string;
}

export interface CreateBatchResponse {
  batch_id: string;
  slide_count: number;
  error?: string;
  details?: string;
}