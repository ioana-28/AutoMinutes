const AUTH_TOKEN_STORAGE_KEY = 'authToken';
const USER_EMAIL_STORAGE_KEY = 'userEmail';
const LEGACY_USER_ID_STORAGE_KEY = 'userId';

type JwtPayload = {
  userId?: number | string;
  exp?: number;
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = atob(paddedBase64);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

export const getStoredAuthToken = (): string | null => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

export const setStoredAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  localStorage.removeItem(LEGACY_USER_ID_STORAGE_KEY);
};

export const getStoredUserEmail = (): string | null => localStorage.getItem(USER_EMAIL_STORAGE_KEY);

export const setStoredUserEmail = (email: string): void => {
  localStorage.setItem(USER_EMAIL_STORAGE_KEY, email);
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(LEGACY_USER_ID_STORAGE_KEY);
  localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
};

export const isStoredAuthTokenValid = (): boolean => {
  const token = getStoredAuthToken();
  if (!token) {
    return false;
  }

  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 > Date.now();
};

export const getStoredUserIdFromToken = (): number | null => {
  const token = getStoredAuthToken();
  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);
  const userId = payload?.userId;

  if (typeof userId === 'number' && Number.isFinite(userId)) {
    return userId;
  }

  if (typeof userId === 'string') {
    const parsedUserId = Number(userId);
    return Number.isFinite(parsedUserId) ? parsedUserId : null;
  }

  return null;
};