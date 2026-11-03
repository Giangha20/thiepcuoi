"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut, Heart, Sparkles } from "lucide-react";

interface AdminHeaderProps {
  weddingTitle: string;
  slug: string;
  adminEmail?: string;
}

export default function AdminHeader({
  weddingTitle,
  slug,
  adminEmail,
}: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <header className="bg-white border-b border-[#DFC5A8]/50 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#DFC5A8] flex items-center justify-center text-[#B88E5B] shadow-sm">
            <Heart className="w-5 h-5 text-[#C67667] fill-[#C67667]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-medium text-[#2D2A26]">
                Quản Trị Thiệp Cưới
              </span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#7A5B33] border border-[#DFC5A8]/40">
                PRO VIP
              </span>
            </div>
            <p className="text-xs font-sans text-gray-500 truncate max-w-[200px] sm:max-w-xs">
              {weddingTitle}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Preview Button */}
          <a
            href={`/thiep-cuoi/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium transition-colors border border-[#DFC5A8]/60 shadow-sm"
          >
            <span>Xem thiệp thực tế</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#B88E5B]" />
          </a>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sans text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
}
