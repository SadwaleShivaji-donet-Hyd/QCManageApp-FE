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


export interface Slide {
  slide_id: string;
  sample_id: string;
  current_state: string;
  created_at: string;
  created_by: string;
}

export interface SlideEvent {
  event_id: string;
  event_type: string;
  slide_id: string;
  batch_id: string | null;
  sample_id: string;
  previous_state: string | null;
  new_state: string | null;
  triggered_by: string;
  timestamp: string;
  correlation_id: string;
  error_category: string | null;
  error_detail: string | null;
  metadata: Record<string, unknown> | null;
}