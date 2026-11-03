"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleHeart, Heart, Send, Sparkles, Pin, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { Wish } from "@/lib/types";
import { ThemeConfig } from "@/lib/theme";

interface WishesSectionProps {
  weddingId: string;
  initialWishes: Wish[];
  requireWishApproval?: boolean;
  theme: ThemeConfig;
}

const EMOJIS = ["❤️", "🥂", "💐", "💍", "🎉", "🕊️", "🥰", "✨"];

export default function WishesSection({
  weddingId,
  initialWishes,
  requireWishApproval = false,
  theme,
}: WishesSectionProps) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes || []);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("Bạn bè");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("❤️");
  const [honeypot, setHoneypot] = useState(""); // Bot spam trap
  const [loading, setLoading] = useState(false);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      setErrorStatus("Vui lòng nhập tên và lời chúc của bạn");
      return;
    }

    setLoading(true);
    setErrorStatus(null);
    setSuccessStatus(null);

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingId,
          name: name.trim(),
          relationship: relationship.trim(),
          message: message.trim(),
          emoji: selectedEmoji,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể gửi lời chúc");
      }

      setSuccessStatus(data.message);
      setName("");
      setMessage("");

      // If approved, prepend to the list immediately
      if (data.wish && data.wish.isApproved) {
        setWishes((prev) => [data.wish, ...prev]);
      }

      // Celebrate
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.75 },
      });
    } catch (err: any) {
      setErrorStatus(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (wishId: string) => {
    if (likedMap[wishId]) return;

    // Optimistic UI update
    setLikedMap((prev) => ({ ...prev, [wishId]: true }));
    setWishes((prev) =>
      prev.map((w) => (w.id === wishId ? { ...w, likes: w.likes + 1 } : w))
    );

    try {
      await fetch(`/api/wishes/${wishId}/like`, { method: "POST" });
    } catch (e) {
      console.error("Like error:", e);
    }
  };

  // Format relative time (e.g. "Vừa xong", "2 giờ trước", "Hôm qua")
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 2) return "Vừa xong";
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "";
    }
  };

  return (
    <section id="wishes-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#B88E5B] font-semibold">
          Sổ Lưu Bút
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2A26] mt-2 mb-4 font-normal">
          Gửi Lời Chúc Phúc
        </h2>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-12 h-px bg-[#DFC5A8]" />
          <MessageCircleHeart className="w-4 h-4 text-[#C67667] fill-[#C67667]" />
          <span className="w-12 h-px bg-[#DFC5A8]" />
        </div>
        <p className="font-sans text-sm text-[#5D4426]/80 leading-relaxed">
          Từng lời chúc, từng tình cảm chân thành của quý bạn bè và người thân sẽ là hành trang quý giá nhất cho tổ ấm nhỏ của chúng mình.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-wedding-card border border-[#DFC5A8]/50 sticky top-6">
          <h3 className="font-serif text-xl text-[#2D2A26] font-medium mb-4 flex items-center gap-2">
            <span>Viết lời chúc mừng</span>
            <Sparkles className="w-4 h-4 text-[#B88E5B]" />
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field (hidden from humans, catches bots) */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {successStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-sans flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
                <span>{successStatus}</span>
              </motion.div>
            )}

            {errorStatus && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-sans">
                {errorStatus}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-sans font-medium text-[#2D2A26] mb-1">
                Tên của bạn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Thùy Linh & Gia Bảo"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFC5A8]/60 bg-[#FAF7F2]/50 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#B88E5B]/40 focus:border-[#B88E5B]"
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-xs font-sans font-medium text-[#2D2A26] mb-1">
                Mối quan hệ
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFC5A8]/60 bg-[#FAF7F2]/50 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#B88E5B]/40 focus:border-[#B88E5B]"
              >
                <option value="Bạn thân">Bạn thân</option>
                <option value="Bạn cô dâu">Bạn cô dâu</option>
                <option value="Bạn chú rể">Bạn chú rể</option>
                <option value="Đồng nghiệp">Đồng nghiệp</option>
                <option value="Người thân gia đình">Người thân gia đình</option>
                <option value="Bạn bè">Bạn bè</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-sans font-medium text-[#2D2A26] mb-1">
                Lời chúc gửi gắm <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Chúc hai bạn trăm năm hạnh phúc, răng long đầu bạc..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFC5A8]/60 bg-[#FAF7F2]/50 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#B88E5B]/40 focus:border-[#B88E5B] resize-none"
              />
            </div>

            {/* Emoji selector */}
            <div>
              <label className="block text-xs font-sans font-medium text-[#2D2A26] mb-1.5">
                Gắn biểu tượng cảm xúc
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "bg-[#FAF7F2] border-2 border-[#B88E5B] scale-110 shadow-sm"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-white font-serif tracking-wider uppercase text-sm shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              style={{
                background: "linear-gradient(135deg, #B88E5B 0%, #D4AF37 50%, #997343 100%)",
                boxShadow: "0 4px 18px rgba(184, 142, 91, 0.35)",
              }}
            >
              {loading ? (
                <span>Đang gửi lời chúc...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-amber-100" />
                  <span>Gửi lời chúc ngay</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Wishes Cards Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="font-serif text-base text-[#2D2A26] font-medium">
              Sổ lưu bút ({wishes.length} lời chúc)
            </span>
            <span className="text-xs font-sans text-[#7A5B33]/80">
              Sắp xếp mới nhất
            </span>
          </div>

          {wishes.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#DFC5A8]/40 shadow-sm text-[#7A5B33]">
              <MessageCircleHeart className="w-10 h-10 text-[#B88E5B] mx-auto mb-3 opacity-60" />
              <p className="font-serif text-lg">Chưa có lời chúc nào.</p>
              <p className="font-sans text-xs mt-1 text-[#5D4426]/70">
                Hãy là người đầu tiên gửi những lời chúc ngọt ngào nhất cho cặp đôi nhé!
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
              <AnimatePresence>
                {wishes.map((wish) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl p-5 shadow-wedding-card border border-[#DFC5A8]/40 relative group hover:border-[#B88E5B]/60 transition-all duration-300"
                  >
                    {/* Pinned badge */}
                    {wish.isPinned && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-sans font-medium text-[#B88E5B] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#DFC5A8]/50">
                        <Pin className="w-3 h-3 rotate-45" />
                        <span>Lời chúc ghim</span>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Avatar Emoji */}
                      <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#DFC5A8] flex items-center justify-center text-xl shrink-0 shadow-sm">
                        {wish.emoji || "❤️"}
                      </div>

                      {/* Header details */}
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-serif font-medium text-base text-[#2D2A26]">
                            {wish.name}
                          </h4>
                          {wish.relationship && (
                            <span className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-[#F5EFE6] text-[#7A5B33]">
                              {wish.relationship}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-sans text-[#7A5B33]/70">
                          {formatTime(wish.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Message Body */}
                    <p className="font-serif text-sm text-[#5D4426] mt-3 leading-relaxed whitespace-pre-line pl-1">
                      {wish.message}
                    </p>

                    {/* Like Button */}
                    <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-[#DFC5A8]/20">
                      <button
                        onClick={() => handleLike(wish.id)}
                        disabled={likedMap[wish.id]}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans transition-all ${
                          likedMap[wish.id]
                            ? "text-[#C67667] bg-[#FDF8F7] font-medium"
                            : "text-[#7A5B33]/80 hover:text-[#C67667] hover:bg-[#FDF8F7]"
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            likedMap[wish.id] ? "fill-[#C67667] text-[#C67667]" : ""
                          }`}
                        />
                        <span>{wish.likes || 0}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
