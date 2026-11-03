"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, CheckCircle2, HeartHandshake, Send, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { ThemeConfig } from "@/lib/theme";

interface RsvpSectionProps {
  weddingId: string;
  theme: ThemeConfig;
}

export default function RsvpSection({ weddingId, theme }: RsvpSectionProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [side, setSide] = useState<"groom" | "bride" | "both">("groom");
  const [isAttending, setIsAttending] = useState(true);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên của bạn");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingId,
          name: name.trim(),
          phone: phone.trim(),
          guestCount: isAttending ? Number(guestCount) : 0,
          side,
          isAttending,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể gửi xác nhận");
      }

      setSubmitted(true);
      setSuccessMessage(data.message || "Xác nhận thành công!");

      if (isAttending) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#B88E5B] font-semibold">
          RSVP
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2A26] mt-2 mb-4 font-normal">
          Xác Nhận Tham Dự
        </h2>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-12 h-px bg-[#DFC5A8]" />
          <UserCheck className="w-4 h-4 text-[#B88E5B]" />
          <span className="w-12 h-px bg-[#DFC5A8]" />
        </div>
        <p className="font-sans text-sm text-[#5D4426]/80 leading-relaxed">
          Để giúp gia đình chuẩn bị đón tiếp chu đáo nhất, xin vui lòng gửi phản hồi trước ngày cưới.
        </p>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl p-6 sm:p-10 shadow-wedding-card border border-[#DFC5A8]/50 relative overflow-hidden"
      >
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border-2 border-[#B88E5B] flex items-center justify-center mx-auto text-[#B88E5B]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-[#2D2A26] font-medium">
              Gửi Phản Hồi Thành Công!
            </h3>
            <p className="font-sans text-sm text-[#5D4426]/80 max-w-md mx-auto leading-relaxed">
              {successMessage}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName("");
                setPhone("");
                setNotes("");
              }}
              className="mt-4 px-6 py-2.5 rounded-full text-xs font-sans text-[#7A5B33] bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#DFC5A8]/50 transition-colors"
            >
              Gửi thêm phản hồi khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-sans">
                {errorMessage}
              </div>
            )}

            {/* Attendance Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsAttending(true)}
                className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-sans font-medium border transition-all duration-200 flex items-center justify-center gap-2 ${
                  isAttending
                    ? "bg-[#FAF7F2] border-[#B88E5B] text-[#7A5B33] shadow-sm ring-1 ring-[#B88E5B]"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-[#B88E5B]" />
                <span>Tôi sẽ tham dự</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAttending(false)}
                className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-sans font-medium border transition-all duration-200 flex items-center justify-center gap-2 ${
                  !isAttending
                    ? "bg-[#FAF7F2] border-[#C67667] text-[#8B4134] shadow-sm ring-1 ring-[#C67667]"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <span>Rất tiếc không thể đến</span>
              </button>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-sans font-medium text-[#2D2A26] mb-1.5">
                Họ và tên của bạn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn Tuấn"
                className="w-full px-4 py-3 rounded-xl border border-[#DFC5A8]/60 bg-[#FAF7F2]/50 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#B88E5B]/40 focus:border-[#B88E5B]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-sans font-medium text-[#2D2A26] mb-1.5">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 678"
                className="w-full px-4 py-3 rounded-xl border border-[#DFC5A8]/60 bg-[#FAF7F2]/50 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#B88E5B]/40 focus:border-[#B88E5B]"
              />
            </div>

            {/* Side selection */}
            <div>
              <label className="block text-xs font-sans font-medium text-[#2D2A26] mb-1.5">
                Bạn là khách của ai?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "groom", label: "Nhà Trai" },
                  { id: "bride", label: "Nhà Gái" },
                  { id: "both", label: "Cả Hai Bên" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSide(item.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-sans transition-all ${
                      side === item.id
                        ? "bg-[#FAF7F2] border border-[#B88E5B] text-[#7A5B33] font-medium"
                        : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Count (only if attending) */}
            {isAttending && (
              <div>
                <label className="block text-xs font-sans font-medium text-[#2D2A26] mb-1.5">
                  Số lượng người tham dự (bao gồm bạn)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setGuestCount(count)}
                      className={`flex-1 py-2 rounded-xl text-xs font-sans transition-all ${
                        guestCount === count
                          ? "bg-[#B88E5B] text-white font-semibold shadow-sm"
                          : "bg-[#FAF7F2] text-[#7A5B33] border border-[#DFC5A8]/50 hover:bg-[#F5EFE6]"
                      }`}
                    >
                      {count} người
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-sans font-medium text-[#2D2A26] mb-1.5">
                Lời nhắn cho cô dâu chú rể (hoặc yêu cầu ăn uống)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Mình ăn chay / Hẹn gặp lại hai bạn trong ngày vui..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFC5A8]/60 bg-[#FAF7F2]/50 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#B88E5B]/40 focus:border-[#B88E5B] resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full text-white font-serif tracking-wider uppercase text-sm shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #B88E5B 0%, #D4AF37 50%, #997343 100%)",
                boxShadow: "0 4px 18px rgba(184, 142, 91, 0.35)",
              }}
            >
              {loading ? (
                <span>Đang gửi thông tin...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-amber-100" />
                  <span>Xác nhận gửi phản hồi</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
