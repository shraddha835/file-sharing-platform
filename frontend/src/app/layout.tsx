import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "FileShare – Secure File Sharing",
  description: "Share files securely with anyone, anywhere.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-slate-50 text-gray-900 antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!rounded-xl !shadow-lg !text-sm !font-medium !border !border-gray-100",
            success: { iconTheme: { primary: "#2563eb", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
