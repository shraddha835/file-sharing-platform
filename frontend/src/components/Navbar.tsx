"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/auth";
import { User } from "@/types";

interface NavbarProps {
  user: User | null;
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
        </div>
        <span className="text-lg font-bold text-gray-900 tracking-tight">FileShare</span>
      </Link>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{user.fullName}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
              {getInitials(user.fullName)}
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
