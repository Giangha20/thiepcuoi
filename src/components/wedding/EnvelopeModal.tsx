"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, MailOpen } from "lucide-react";
import { ThemeConfig } from "@/lib/theme";

interface EnvelopeModalProps {
  groomName: string;
  brideName: string;
  weddingDate: string | Date;
  weddingLunarDate?: string;
  envelopeTitle?: string;
  envelopeSubtitle?: string;
  theme: ThemeConfig;
  onOpen: () => void;
}

export default function EnvelopeModal({
  groomName,
  brideName,
  weddingDate,
  weddingLunarDate,
  envelopeTitle = "Wedding Invitation",
  envelopeSubtitle,
  theme,
  onOpen,
}: EnvelopeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const formattedDate = new Date(weddingDate).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    onOpen();
    setTimeout(() => {
      setIsDismissed(true);
    }, 1200);
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B18]/70 backdrop-blur-md overflow-hidden"
        >
          {/* Ambient golden dust particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#B88E5B]/15 blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#D4AF37]/15 blur-3xl animate-pulse" />
          </div>

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-full max-w-lg mx-auto"
          >
            {/* The Outer Envelope Container */}
            <div className="relative bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 shadow-envelope border border-[#DFC5A8]/50 text-center overflow-hidden">
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-3 left-3 text-[#B88E5B]/40 text-xs font-serif select-none">
                ✦ ───────
              </div>
              <div className="absolute top-3 right-3 text-[#B88E5B]/40 text-xs font-serif select-none">
                ─────── ✦
              </div>
              <div className="absolute bottom-3 left-3 text-[#B88E5B]/40 text-xs font-serif select-none">
                ✦ ───────
              </div>
              <div className="absolute bottom-3 right-3 text-[#B88E5B]/40 text-xs font-serif select-none">
                ─────── ✦
              </div>

              {/* Envelope Flap Animation Wrapper */}
              <motion.div
                animate={
                  isOpen
                    ? {
                        rotateX: 180,
                        opacity: 0,
                        transition: { duration: 0.8, ease: "easeInOut" },
                      }
                    : { rotateX: 0, opacity: 1 }
                }
                style={{ transformOrigin: "top center" }}
                className="space-y-4"
              >
                {/* Header Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans tracking-widest uppercase border border-[#DFC5A8]/40">
                  <Sparkles className="w-3.5 h-3.5 text-[#B88E5B]" />
                  <span>{envelopeTitle}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#B88E5B]" />
                </div>

                {/* Subtitle / Calling */}
                <p className="text-xs uppercase tracking-[0.25em] text-[#7A5B33]/80 font-sans">
                  {envelopeSubtitle || "Trân trọng kính mời"}
                </p>

                {/* Couple Names */}
                <div className="py-2">
                  <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#B88E5B] leading-tight">
                    {groomName}
                  </h1>
                  <div className="flex items-center justify-center gap-3 my-1">
                    <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#DFC5A8]" />
                    <Heart className="w-4 h-4 text-[#C67667] fill-[#C67667]/40" />
                    <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#DFC5A8]" />
                  </div>
                  <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#B88E5B] leading-tight">
                    {brideName}
                  </h1>
                </div>

                {/* Date preview */}
                <div className="font-serif text-sm text-[#5D4426] border-y border-[#DFC5A8]/40 py-2.5 max-w-xs mx-auto">
                  <p className="font-medium tracking-wide">{formattedDate}</p>
                  {weddingLunarDate && (
                    <p className="text-xs text-[#7A5B33]/80 mt-0.5 italic">
                      ({weddingLunarDate})
                    </p>
                  )}
                </div>

                {/* Wax Seal / Interactive Open Button */}
                <div className="pt-4 pb-1">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenEnvelope}
                    className="relative group inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-white font-serif tracking-wider shadow-lg transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, #B88E5B 0%, #D4AF37 50%, #997343 100%)",
                      boxShadow: "0 8px 25px rgba(184, 142, 91, 0.4)",
                    }}
                  >
                    <MailOpen className="w-5 h-5 text-amber-100 group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-semibold tracking-widest uppercase">
                      Chạm để mở thiệp
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                  </motion.button>
                  <p className="text-[11px] text-[#7A5B33]/70 font-sans mt-2.5">
                    ♫ Bấm để mở thiệp & hòa cùng giai điệu tình yêu
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
