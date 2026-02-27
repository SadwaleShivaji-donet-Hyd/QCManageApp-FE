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