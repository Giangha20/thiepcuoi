"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Sparkles, Heart, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@wedding.com");
  const [password, setPassword] = useState("admin123456");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Đăng nhập thất bại");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Tài khoản hoặc mật khẩu không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7F2] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#B88E5B]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-wedding-card border border-[#DFC5A8]/50 relative z-10">
        {/* Seal Icon */}
        <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border-2 border-[#DFC5A8] flex items-center justify-center mx-auto mb-4 text-[#B88E5B] shadow-sm">
          <Heart className="w-6 h-6 text-[#C67667] fill-[#C67667]" />
        </div>

        <div className="text-center mb-8">
          <span className="text-xs font-sans tracking-[0.25em] uppercase text-[#B88E5B] font-semibold">
            Wedding Administration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#2D2A26] font-medium mt-1">
            Quản Trị Thiệp Cưới
          </h1>
          <p className="text-xs font-sans text-[#7A5B33]/80 mt-1.5">
            Đăng nhập để tùy chỉnh thông tin, album ảnh &amp; quản lý lời chúc
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-sans">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-medium text-[#2D2A26] mb-1">
              Email đăng nhập
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wedding.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DFC5A8]/60 bg-[#FAF7F2]/40 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#B88E5B]/40 focus:border-[#B88E5B]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-[#2D2A26] mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DFC5A8]/60 bg-[#FAF7F2]/40 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#B88E5B]/40 focus:border-[#B88E5B]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DFC5A8]/30 text-[11px] font-sans text-[#7A5B33]">
            <p className="font-semibold mb-0.5">Tài khoản mặc định được tạo sẵn:</p>
            <p>Email: <code className="text-[#B88E5B]">admin@wedding.com</code></p>
            <p>Mật khẩu: <code className="text-[#B88E5B]">admin123456</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full text-white font-serif tracking-wider uppercase text-xs sm:text-sm font-medium shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
            style={{
              background: "linear-gradient(135deg, #B88E5B 0%, #D4AF37 50%, #997343 100%)",
              boxShadow: "0 4px 18px rgba(184, 142, 91, 0.35)",
            }}
          >
            {loading ? (
              <span>Đang đăng nhập...</span>
            ) : (
              <>
                <span>Vào trang quản trị</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs font-sans text-[#7A5B33] hover:text-[#B88E5B] transition-colors"
          >
            ← Trở về trang thiệp cưới
          </a>
        </div>
      </div>
    </div>
  );
}
