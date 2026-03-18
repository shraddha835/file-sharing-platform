"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getShareInfo } from "@/lib/api";
import { ShareLink } from "@/types";
import { format } from "date-fns";
import Link from "next/link";

export default function SharedFilePage() {
  const { token } = useParams<{ token: string }>();
  const [link, setLink] = useState<ShareLink | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShareInfo(token)
      .then(setLink)
      .catch(() => setError("This link is invalid or has expired."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Link unavailable</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link href="/" className="btn-primary">Go to FileShare</Link>
        </div>
      </div>
    );
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const fileExt = link?.fileName?.split(".").pop()?.toUpperCase() ?? "FILE";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" /></svg>
            </div>
            <span className="text-base font-bold text-gray-900">FileShare</span>
          </Link>
          <Link href="/register" className="btn-primary text-xs">Get started free</Link>
        </div>
      </header>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full">
          {/* File icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600 tracking-wider">{fileExt.slice(0, 4)}</span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-1 text-center break-all">{link?.fileName}</h1>

          {/* Meta */}
          <div className="flex items-center justify-center gap-4 flex-wrap mt-3 mb-6">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              {link?.downloadCount ?? 0} download{link?.downloadCount !== 1 ? "s" : ""}
            </span>
            {link?.expiresAt && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Expires {format(new Date(link.expiresAt), "PPp")}
              </span>
            )}
          </div>

          <a
            href={`${apiUrl}/api/share/download/${token}`}
            className="flex items-center justify-center gap-2 w-full bg-primary-600 text-white py-3.5 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-md shadow-primary-100 active:scale-[0.99]"
            download
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Download file
          </a>

          <p className="text-center text-xs text-gray-400 mt-4">
            Shared via{" "}
            <Link href="/" className="text-primary-600 hover:underline font-medium">FileShare</Link>
          </p>
        </div>
      </div>
    </div>
  );
}


