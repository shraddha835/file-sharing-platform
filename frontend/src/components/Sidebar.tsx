"use client";

import { useState } from "react";
import { Folder } from "@/types";
import { createFolder } from "@/lib/api";
import toast from "react-hot-toast";

interface SidebarProps {
  folders: Folder[];
  currentFolderId: number | null;
  onFolderClick: (id: number | null) => void;
  onFolderCreated: () => void;
}

export default function Sidebar({
  folders,
  currentFolderId,
  onFolderClick,
  onFolderCreated,
}: SidebarProps) {
  const [newFolderName, setNewFolderName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleCreate = async () => {
    if (!newFolderName.trim()) return;
    setCreating(true);
    try {
      await createFolder(newFolderName.trim(), currentFolderId);
      toast.success("Folder created");
      setNewFolderName("");
      setShowInput(false);
      onFolderCreated();
    } catch {
      toast.error("Failed to create folder");
    } finally {
      setCreating(false);
    }
  };

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-100 hidden md:flex flex-col">
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <button
          onClick={() => onFolderClick(null)}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentFolderId === null
              ? "bg-primary-50 text-primary-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <svg className={`w-4 h-4 shrink-0 ${currentFolderId === null ? "text-primary-500" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          My Files
        </button>

        {folders.length > 0 && (
          <>
            <div className="px-3 pt-4 pb-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Folders</p>
            </div>
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => onFolderClick(folder.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  currentFolderId === folder.id
                    ? "bg-amber-50 text-amber-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <svg className={`w-4 h-4 shrink-0 ${currentFolderId === folder.id ? "text-amber-500" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
                </svg>
                <span className="truncate">{folder.name}</span>
              </button>
            ))}
          </>
        )}
      </div>

      <div className="p-3 border-t border-gray-100">
        {showInput ? (
          <div className="space-y-2">
            <input
              autoFocus
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") { setShowInput(false); setNewFolderName(""); }
              }}
              placeholder="Folder nameâ€¦"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50 focus:bg-white"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 bg-primary-600 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors"
              >
                {creating ? "Creatingâ€¦" : "Create"}
              </button>
              <button
                onClick={() => { setShowInput(false); setNewFolderName(""); }}
                className="flex-1 border border-gray-200 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New folder
          </button>
        )}
      </div>
    </aside>
  );
}

