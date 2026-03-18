import Cookies from "js-cookie";
import { AuthResponse } from "@/types";

const TOKEN_KEY = "fs_token";
const USER_KEY  = "fs_user";

export function saveSession(data: AuthResponse) {
  Cookies.set(TOKEN_KEY, data.accessToken, { expires: 1, sameSite: "strict" });
  localStorage.setItem(USER_KEY, JSON.stringify({
    userId: data.userId,
    email: data.email,
    fullName: data.fullName,
    storageUsed: data.storageUsed,
    storageQuota: data.storageQuota,
  }));
}

export function clearSession() {
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
