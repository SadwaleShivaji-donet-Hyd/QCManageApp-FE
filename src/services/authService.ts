import type { CoreApiResponse, LoginResponse } from '../types';
 
const BASE_URL = import.meta.env.VITE_API_URL;
 
export const authService = {
  login: async (
    username: string,
    password: string,
  ): Promise<CoreApiResponse<LoginResponse>> => {
    try {
      const resp = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
 
      const data = await resp.json();
 
      if (!resp.ok) {
        return {
          ok: false,
          status: resp.status,
          error: data?.error || data?.message || 'Authentication failed',
        };
      }
 
      // data = { access_token, role } from your backend
      return { ok: true, status: resp.status, data };
 
    } catch (err) {
      return {
        ok: false,
        status: 0,
        error: err instanceof Error ? err.message : 'Network error',
      };
    }
  },
};