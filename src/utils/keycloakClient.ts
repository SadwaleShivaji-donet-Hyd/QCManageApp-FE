import Keycloak from 'keycloak-js';

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL      ?? 'http://localhost:8080';
const REALM        = import.meta.env.VITE_KEYCLOAK_REALM    ?? 'qcmanage';
const CLIENT_ID    = import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'qcmanage-app';

const KEY_TOKEN   = 'kc_token';
const KEY_REFRESH = 'kc_refresh_token';
const KEY_ID      = 'kc_id_token';

const TOKEN_URL  = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;
const LOGOUT_URL = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`;

// ── Singleton Keycloak instance ───────────────────────────────────────────────
let keycloakInstance: Keycloak | null = null;

export interface UserData {
  id: string;
  email: string;
  name: string;
  username: string;
  role: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
}

// ── Init Keycloak JS — but do NOT trigger any redirect ────────────────────────
// We pass existing tokens so keycloak-js can manage them (refresh, events, etc.)
// onLoad is intentionally omitted to prevent any redirect behaviour
export const initKeycloak = async (): Promise<Keycloak> => {
  if (keycloakInstance) return keycloakInstance;

  const kc = new Keycloak({ url: KEYCLOAK_URL, realm: REALM, clientId: CLIENT_ID });

  const storedToken   = localStorage.getItem(KEY_TOKEN)   ?? undefined;
  const storedRefresh = localStorage.getItem(KEY_REFRESH) ?? undefined;
  const storedId      = localStorage.getItem(KEY_ID)      ?? undefined;

  // init WITHOUT onLoad — this means keycloak-js will NOT redirect anywhere.
  // It will just set up the instance and load tokens we pass in.
  await kc.init({
    // No onLoad property = no redirect, no SSO check
    token:        storedToken,
    refreshToken: storedRefresh,
    idToken:      storedId,
    checkLoginIframe: false, // disable iframe SSO check — we handle session ourselves
  });

  keycloakInstance = kc;
  return kc;
};

export const getKeycloak = (): Keycloak | null => keycloakInstance;

// ── Login: Direct Access Grant (username + password → tokens) ─────────────────
// This calls Keycloak's token endpoint directly — no browser redirect at all.
export const keycloakDirectLogin = async (
  username: string,
  password: string,
): Promise<{ ok: boolean; data?: TokenResponse; error?: string }> => {
  try {
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id:  CLIENT_ID,
      username,
      password,
    });

    const res  = await fetch(TOKEN_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    body.toString(),
    });

    const data = await res.json() as Record<string, string | number>;

    if (!res.ok) {
      const msg =
        data.error_description === 'Invalid user credentials'
          ? 'Incorrect username or password.'
          : (data.error_description as string) ?? (data.error as string) ?? 'Login failed.';
      return { ok: false, error: msg };
    }

    const tokens = data as unknown as TokenResponse;

    // Store in localStorage
    localStorage.setItem(KEY_TOKEN,   tokens.access_token);
    localStorage.setItem(KEY_REFRESH, tokens.refresh_token);
    if (tokens.id_token) localStorage.setItem(KEY_ID, tokens.id_token);

    // Re-init Keycloak JS with the new tokens so it can manage refresh/events
    keycloakInstance = null; // reset singleton so initKeycloak re-runs
    await initKeycloak();

    return { ok: true, data: tokens };
  } catch {
    return { ok: false, error: 'Network error. Please try again.' };
  }
};

// ── Logout: revoke token server-side via Keycloak JS ─────────────────────────
export const keycloakDirectLogout = async (): Promise<void> => {
  const refreshToken = localStorage.getItem(KEY_REFRESH);

  // Try Keycloak JS logout first (cleanest)
  if (keycloakInstance?.authenticated) {
    try {
      // clearToken() + local clear without redirect
      keycloakInstance.clearToken();
    } catch {
      // ignore
    }
  }

  // Also revoke refresh token on server
  if (refreshToken) {
    try {
      const body = new URLSearchParams({
        client_id:     CLIENT_ID,
        refresh_token: refreshToken,
      });
      await fetch(LOGOUT_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    body.toString(),
      });
    } catch {
      // Silently ignore — tokens will be cleared locally regardless
    }
  }

  clearStoredTokens();
  keycloakInstance = null;
};

// ── Refresh token using Keycloak JS updateToken ───────────────────────────────
export const ensureFreshToken = async (): Promise<string | undefined> => {
  const kc = keycloakInstance;

  // If Keycloak JS instance is ready and authenticated, use its updateToken
  if (kc?.authenticated) {
    try {
      await kc.updateToken(30); // refresh if < 30s left
      if (kc.token) {
        localStorage.setItem(KEY_TOKEN, kc.token);
        if (kc.refreshToken) localStorage.setItem(KEY_REFRESH, kc.refreshToken);
      }
      return kc.token;
    } catch {
      clearStoredTokens();
      return undefined;
    }
  }

  // Fallback: manual refresh via fetch if Keycloak JS not ready
  const storedToken   = localStorage.getItem(KEY_TOKEN);
  const storedRefresh = localStorage.getItem(KEY_REFRESH);
  if (!storedToken) return undefined;

  // Check if expired (with 30s buffer)
  try {
    const payload = JSON.parse(atob(storedToken.split('.')[1])) as { exp?: number };
    const expired = (payload.exp ?? 0) < Math.floor(Date.now() / 1000) + 30;
    if (!expired) return storedToken;
  } catch {
    return undefined;
  }

  // Token expired — refresh manually
  if (!storedRefresh) {
    clearStoredTokens();
    return undefined;
  }

  try {
    const body = new URLSearchParams({
      grant_type:    'refresh_token',
      client_id:     CLIENT_ID,
      refresh_token: storedRefresh,
    });
    const res  = await fetch(TOKEN_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    body.toString(),
    });
    if (!res.ok) { clearStoredTokens(); return undefined; }
    const data = await res.json() as TokenResponse;
    localStorage.setItem(KEY_TOKEN,   data.access_token);
    localStorage.setItem(KEY_REFRESH, data.refresh_token);
    return data.access_token;
  } catch {
    clearStoredTokens();
    return undefined;
  }
};

// ── Extract user info from JWT payload ────────────────────────────────────────
export const extractUserFromToken = (token: string): UserData | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
    const roles   = (payload.realm_access as { roles?: string[] })?.roles ?? [];
    const role    =
      roles.includes('admin')       ? 'admin'       :
      roles.includes('lab-manager') ? 'lab-manager' :
      roles.includes('lab-tech')    ? 'lab-tech'    : 'user';

    return {
      id:       (payload.sub               as string) ?? '',
      email:    (payload.email             as string) ?? '',
      name:     (payload.name              as string)
             ?? (payload.preferred_username as string) ?? '',
      username: (payload.preferred_username as string) ?? '',
      role,
    };
  } catch {
    return null;
  }
};

export const getStoredToken = (): string | null =>
  localStorage.getItem(KEY_TOKEN);

export const clearStoredTokens = (): void => {
  localStorage.removeItem(KEY_TOKEN);
  localStorage.removeItem(KEY_REFRESH);
  localStorage.removeItem(KEY_ID);
  localStorage.removeItem('access_token');
  localStorage.removeItem('role');
};