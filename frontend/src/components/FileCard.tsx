"use client";

import { useEffect, useRef, useState } from "react";
import { FileItem } from "@/types";
import { deleteFile, renameFile, downloadFile, createShareLink } from "@/lib/api";
import toast from "react-hot-toast";
import bytes from "bytes";
import { format } from "date-fns";

interface FileCardProps {
  file: FileItem;
  onDeleted: () => void;
  onRenamed: () => void;
}

interface FileTypeStyle { bg: string; text: string; label: string; }

function getFileType(contentType: string, name: string): FileTypeStyle {
  const ext = name.split(".").pop()?.toUpperCase() ?? "FILE";
  if (contentType.startsWith("image/")) return { bg: "bg-purple-50", text: "text-purple-600", label: ext };
  if (contentType.startsWith("video/")) return { bg: "bg-rose-50", text: "text-rose-600", label: ext };
  if (contentType.startsWith("audio/")) return { bg: "bg-orange-50", text: "text-orange-600", label: ext };
  if (contentType.includes("pdf")) return { bg: "bg-red-50", text: "text-red-600", label: "PDF" };
  if (contentType.includes("zip") || contentType.includes("compressed") || contentType.includes("archive")) return { bg: "bg-yellow-50", text: "text-yellow-600", label: "ZIP" };
  if (contentType.includes("spreadsheet") || contentType.includes("excel") || ext === "CSV") return { bg: "bg-emerald-50", text: "text-emerald-600", label: ext };
  if (contentType.includes("word") || contentType.includes("document")) return { bg: "bg-blue-50", text: "text-blue-600", label: ext };
  if (contentType.startsWith("text/")) return { bg: "bg-slate-50", text: "text-slate-500", label: ext };
  return { bg: "bg-gray-50", text: "text-gray-500", label: ext };
}

export default function FileCard({ file, onDeleted, onRenamed }: FileCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(file.originalName);
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const typeStyle = getFileType(file.contentType, file.originalName);

  // Click-outside closes the menu
  useEffect(() => {
    if (!showMenu) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showMenu]);

  const handleDownload = async () => {
    try {
      const res = await downloadFile(file.id);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url; a.download = file.originalName; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error("Download failed"); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${file.originalName}"?`)) return;
    try { await deleteFile(file.id); toast.success("File deleted"); onDeleted(); }
    catch { toast.error("Delete failed"); }
  };

  const handleRename = async () => {
    if (!newName.trim()) return;
    try { await renameFile(file.id, newName.trim()); toast.success("Renamed"); setRenaming(false); onRenamed(); }
    catch { toast.error("Rename failed"); }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const link = await createShareLink(file.id);
      const url = `${window.location.origin}/shared/${link.token}`;
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied!");
    } catch { toast.error("Failed to create share link"); }
    finally { setSharing(false); }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 p-4 flex flex-col gap-3">
      {/* Header: icon + name + menu */}
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 ${typeStyle.bg} rounded-xl flex items-center justify-center shrink-0`}>
          <span className={`text-[9px] font-bold ${typeStyle.text} tracking-wider`}>
            {typeStyle.label.slice(0, 4)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          {renaming ? (
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") { setRenaming(false); setNewName(file.originalName); }
              }}
              className="w-full border border-primary-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-800 truncate leading-snug" title={file.originalName}>
              {file.originalName}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">{bytes(file.size)}</p>
        </div>

        {/* 3-dot menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-2xl border border-gray-100 shadow-xl z-30 w-44 overflow-hidden py-1">
              <button onClick={() => { handleDownload(); setShowMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                Download
              </button>
              <button onClick={() => { setRenaming(true); setShowMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                Rename
              </button>
              <button onClick={() => { handleShare(); setShowMenu(false); }} disabled={sharing}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                {sharing ? "Creatingâ€¦" : "Share link"}
              </button>
              <div className="my-1 h-px bg-gray-100 mx-3" />
              <button onClick={() => { handleDelete(); setShowMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share URL */}
      {shareUrl && (
        <div className="flex items-center gap-2 bg-primary-50 rounded-xl px-3 py-2 border border-primary-100">
          <svg className="w-3.5 h-3.5 text-primary-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
          <p className="text-xs text-primary-700 font-medium truncate flex-1">{shareUrl}</p>
          <button onClick={async () => { await navigator.clipboard.writeText(shareUrl); toast.success("Copied!"); }} className="text-primary-500 hover:text-primary-700 shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>
          </button>
        </div>
      )}

      {/* Rename actions */}
      {renaming && (
        <div className="flex gap-2">
          <button onClick={handleRename} className="flex-1 bg-primary-600 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-700 transition-colors">Save</button>
          <button onClick={() => { setRenaming(false); setNewName(file.originalName); }} className="flex-1 border border-gray-200 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <span className="text-xs text-gray-400">{format(new Date(file.createdAt), "MMM d, yyyy")}</span>
        {file.publiclyShared && (
          <span className="text-[10px] bg-primary-50 text-primary-600 font-semibold px-2 py-0.5 rounded-full border border-primary-100">Shared</span>
        )}
      </div>
    </div>
  );
}

