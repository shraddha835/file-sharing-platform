"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, isAuthenticated } from "@/lib/auth";
import { listFiles, listFolders, getMe } from "@/lib/api";
import { FileItem, Folder, User } from "@/types";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import FileUpload from "@/components/FileUpload";
import FileCard from "@/components/FileCard";
import bytes from "bytes";

interface BreadcrumbSegment { id: number | null; name: string; }

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folderPath, setFolderPath] = useState<BreadcrumbSegment[]>([{ id: null, name: "My Files" }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }
    setUser(getUser());
    fetchContents(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchContents = async (folderId: number | null) => {
    setLoading(true);
    try {
      const [f, d] = await Promise.all([listFiles(folderId), listFolders(folderId)]);
      setFiles(f);
      setFolders(d);
      setCurrentFolderId(folderId);
    } finally {
      setLoading(false);
    }
  };

  const openFolder = (folder: Folder) => {
    setFolderPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
    fetchContents(folder.id);
  };

  const navigateToBreadcrumb = (index: number) => {
    const newPath = folderPath.slice(0, index + 1);
    setFolderPath(newPath);
    fetchContents(newPath[newPath.length - 1].id);
  };

  const handleSidebarFolderClick = (folderId: number | null) => {
    if (folderId === null) {
      setFolderPath([{ id: null, name: "My Files" }]);
      fetchContents(null);
    } else {
      const folder = folders.find((f) => f.id === folderId);
      setFolderPath([{ id: null, name: "My Files" }, { id: folderId, name: folder?.name ?? "Folder" }]);
      fetchContents(folderId);
    }
  };

  const currentSegment = folderPath[folderPath.length - 1];
  const storagePercent = user ? Math.min(100, Math.round((user.storageUsed / user.storageQuota) * 100)) : 0;
  const refreshUser = () => getMe().then(setUser).catch(() => {});

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          folders={folders}
          currentFolderId={currentFolderId}
          onFolderClick={handleSidebarFolderClick}
          onFolderCreated={() => fetchContents(currentFolderId)}
        />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page header */}
          <div className="mb-6">
            <nav className="flex items-center gap-1 text-sm mb-1" aria-label="Breadcrumb">
              {folderPath.map((seg, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>}
                  {i < folderPath.length - 1 ? (
                    <button onClick={() => navigateToBreadcrumb(i)} className="text-gray-400 hover:text-primary-600 font-medium transition-colors">{seg.name}</button>
                  ) : (
                    <span className="text-gray-900 font-semibold">{seg.name}</span>
                  )}
                </span>
              ))}
            </nav>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{currentSegment.name}</h1>
              {currentFolderId !== null && (
                <button
                  onClick={() => navigateToBreadcrumb(folderPath.length - 2)}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                  Back
                </button>
              )}
            </div>
          </div>

          {/* Storage bar */}
          {user && (
            <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Storage</span>
                <span className="text-gray-400 text-xs">{bytes(user.storageUsed)} of {bytes(user.storageQuota)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    storagePercent > 90 ? "bg-red-500" : storagePercent > 70 ? "bg-amber-500" : "bg-gradient-to-r from-primary-500 to-indigo-500"
                  }`}
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">{storagePercent}% used · {bytes(user.storageQuota - user.storageUsed)} free</p>
            </div>
          )}

          {/* Upload */}
          <div className="mb-6">
            <FileUpload folderId={currentFolderId} onUploaded={() => { fetchContents(currentFolderId); refreshUser(); }} />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Loading…</p>
            </div>
          ) : (
            <>
              {/* Folders grid */}
              {folders.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Folders</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => openFolder(folder)}
                        className="group flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-700 truncate w-full text-center">{folder.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Files grid */}
              {files.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Files</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        onDeleted={() => { fetchContents(currentFolderId); refreshUser(); }}
                        onRenamed={() => fetchContents(currentFolderId)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {folders.length === 0 && files.length === 0 && (
                <div className="flex flex-col items-center justify-center py-28 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-5">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25m19.5 0A2.25 2.25 0 0 1 19.5 18h-15a2.25 2.25 0 0 1-2.25-2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 18.91a2.25 2.25 0 0 1-1.07-1.916V15.75" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-700 mb-2">This folder is empty</h3>
                  <p className="text-sm text-gray-400">Upload files or create a new folder to get started.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
