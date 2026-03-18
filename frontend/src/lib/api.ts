import axios from "axios";
import { getToken, clearSession } from "@/lib/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  timeout: 0,
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearSession();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ----- Auth -----

export const register = (data: { fullName: string; email: string; password: string }) =>
  api.post("/auth/register", data).then((r) => r.data);

export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data).then((r) => r.data);

// ----- Files -----

export const uploadFile = (file: File, folderId?: number | null, onProgress?: (pct: number) => void) => {
  const form = new FormData();
  form.append("file", file);
  if (folderId) form.append("folderId", String(folderId));
  return api.post("/files/upload", form, {
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  }).then((r) => r.data);
};

export const listFiles = (folderId?: number | null) =>
  api.get("/files", { params: folderId != null ? { folderId } : {} }).then((r) => r.data);

export const downloadFile = (id: number) =>
  api.get(`/files/${id}/download`, { responseType: "blob" }).then((r) => r);

export const renameFile = (id: number, name: string) =>
  api.patch(`/files/${id}/rename`, { name }).then((r) => r.data);

export const deleteFile = (id: number) =>
  api.delete(`/files/${id}`);

// ----- Folders -----

export const createFolder = (name: string, parentId?: number | null) =>
  api.post("/files/folders", { name, parentId }).then((r) => r.data);

export const listFolders = (parentId?: number | null) =>
  api.get("/files/folders", { params: parentId != null ? { parentId } : {} }).then((r) => r.data);

export const deleteFolder = (id: number) =>
  api.delete(`/files/folders/${id}`);

// ----- Share -----

export const createShareLink = (fileId: number, expiresAt?: string | null) =>
  api.post("/share", { fileId, expiresAt }).then((r) => r.data);

export const getShareInfo = (token: string) =>
  api.get(`/share/${token}`).then((r) => r.data);

// ----- Users -----

export const getMe = () =>
  api.get("/users/me").then((r) => r.data);

export const getMyLinks = () =>
  api.get("/share/my").then((r) => r.data);

export const deactivateLink = (id: number) =>
  api.delete(`/share/${id}`);

export default api;
