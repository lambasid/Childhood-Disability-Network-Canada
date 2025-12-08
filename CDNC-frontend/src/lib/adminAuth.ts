const ADMIN_EMAIL = "admin@cdnc.local";
const ADMIN_PASSWORD = (import.meta.env.NEXT_PUBLIC_ADMIN_PASSWORD as string) || (import.meta.env.VITE_NEXT_PUBLIC_ADMIN_PASSWORD as string) || "admin123";

export const AUTH_TOKEN_KEY = "authToken";
export const AUTH_TOKEN_VALUE = "admin-logged-in";

export const validateAdminCredentials = (email: string, password: string) => {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
};

export const setAdminSession = () => {
  localStorage.setItem(AUTH_TOKEN_KEY, AUTH_TOKEN_VALUE);
};

export const clearAdminSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAdminAuthenticated = () => {
  return typeof window !== "undefined" && localStorage.getItem(AUTH_TOKEN_KEY) === AUTH_TOKEN_VALUE;
};

export const getAdminEmail = () => ADMIN_EMAIL;
