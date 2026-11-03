"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { ThemeConfig } from "@/lib/theme";

interface CountdownSectionProps {
  weddingDate: string | Date;
  theme: ThemeConfig;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export default function CountdownSection({ weddingDate, theme }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    const target = new Date(weddingDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        if (!hasCelebrated) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          setHasCelebrated(true);
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [weddingDate, hasCelebrated]);

  return (
    <section className="py-16 px-4 bg-[#F5EFE6]/60 border-y border-[#DFC5A8]/40 relative overflow-hidden">
      {/* Delicate background circles */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#B88E5B]/5 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-[#D4AF37]/5 blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-[#7A5B33] text-xs font-sans tracking-widest uppercase mb-3 shadow-sm border border-[#DFC5A8]/50">
          <Clock className="w-3.5 h-3.5 text-[#B88E5B]" />
          <span>Đếm ngược ngày hạnh phúc</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl text-[#2D2A26] font-normal mb-8">
          {timeLeft.isPast
            ? "Ngày Trọng Đại Đã Đến – Hạnh Phúc Đong Đầy!"
            : "Chỉ còn một chút thời gian nữa thôi..."}
        </h3>

        {timeLeft.isPast ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 rounded-3xl bg-white shadow-wedding-card border border-[#DFC5A8] max-w-lg mx-auto"
          >
            <Sparkles className="w-8 h-8 text-[#B88E5B] mx-auto mb-3 animate-spin" style={{ animationDuration: "8s" }} />
            <h4 className="font-serif text-xl sm:text-2xl text-[#B88E5B] font-medium mb-2">
              Hôm Nay Là Ngày Trọng Đại!
            </h4>
            <p className="font-sans text-sm text-[#5D4426]/80 leading-relaxed">
              Cảm ơn tất cả người thân và bạn bè đã cùng chung vui và chúc phúc cho Hoàng Nam & Minh Anh trong ngày hạnh phúc ngập tràn này.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto">
            {/* Days */}
            <div className="bg-white rounded-2xl p-3 sm:p-5 shadow-wedding-card border border-[#DFC5A8]/50 flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-semibold text-[#B88E5B] tabular-nums">
                {timeLeft.days.toString().padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#7A5B33] font-sans mt-1">
                Ngày
              </span>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-3 sm:p-5 shadow-wedding-card border border-[#DFC5A8]/50 flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-semibold text-[#B88E5B] tabular-nums">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#7A5B33] font-sans mt-1">
                Giờ
              </span>
            </div>

            {/* Minutes */}
            <div className="bg-white rounded-2xl p-3 sm:p-5 shadow-wedding-card border border-[#DFC5A8]/50 flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-semibold text-[#B88E5B] tabular-nums">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#7A5B33] font-sans mt-1">
                Phút
              </span>
            </div>

            {/* Seconds */}
            <div className="bg-white rounded-2xl p-3 sm:p-5 shadow-wedding-card border border-[#DFC5A8]/50 flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-semibold text-[#C67667] tabular-nums">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#7A5B33] font-sans mt-1">
                Giây
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
