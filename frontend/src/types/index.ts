export interface User {
  userId: number;
  email: string;
  fullName: string;
  storageUsed: number;
  storageQuota: number;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  storageUsed: number;
  storageQuota: number;
}

export interface FileItem {
  id: number;
  originalName: string;
  contentType: string;
  size: number;
  folderId: number | null;
  folderName: string | null;
  publiclyShared: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  subFolders: Folder[];
  createdAt: string;
}

export interface ShareLink {
  id: number;
  token: string;
  shareUrl: string;
  fileId: number;
  fileName: string;
  expiresAt: string | null;
  downloadCount: number;
  active: boolean;
  createdAt: string;
}
