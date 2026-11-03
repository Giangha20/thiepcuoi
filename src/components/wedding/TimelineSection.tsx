"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Calendar } from "lucide-react";
import { TimelineMilestone } from "@/lib/types";
import { ThemeConfig } from "@/lib/theme";

interface TimelineSectionProps {
  timeline: TimelineMilestone[];
  theme: ThemeConfig;
}

export default function TimelineSection({ timeline, theme }: TimelineSectionProps) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#B88E5B] font-semibold">
          Love Story
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2A26] mt-2 mb-4 font-normal">
          Câu Chuyện Tình Yêu
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="w-12 h-px bg-[#DFC5A8]" />
          <Heart className="w-4 h-4 text-[#C67667] fill-[#C67667]" />
          <span className="w-12 h-px bg-[#DFC5A8]" />
        </div>
      </div>

      {/* Timeline Tree */}
      <div className="relative">
        {/* Central Vertical Line (hidden on very small mobile, visible on sm+) */}
        <div className="absolute top-4 bottom-4 left-4 md:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#DFC5A8]/30 via-[#B88E5B]/50 to-[#DFC5A8]/30" />

        <div className="space-y-12">
          {timeline.map((item, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={item.id || idx}
                className="relative flex flex-col md:flex-row items-center"
              >
                {/* Center Node (Heart badge) */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-[#FAF7F2] border-2 border-[#B88E5B] flex items-center justify-center shadow-md">
                  <Heart className="w-3.5 h-3.5 text-[#C67667] fill-[#C67667]" />
                </div>

                {/* Content Card Wrapper */}
                <div
                  className={`w-full md:w-1/2 pl-12 md:pl-0 ${
                    isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-3xl p-6 sm:p-7 shadow-wedding-card border border-[#DFC5A8]/40 hover:border-[#B88E5B]/60 transition-all duration-300"
                  >
                    {/* Date Pill */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium mb-3 border border-[#DFC5A8]/40 ${
                        isEven ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      <Calendar className="w-3 h-3 text-[#B88E5B]" />
                      <span>{item.date}</span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-[#2D2A26] font-medium mb-3">
                      {item.title}
                    </h3>

                    {/* Milestone Photo if available */}
                    {item.photo && (
                      <div className="my-4 rounded-2xl overflow-hidden shadow-sm max-h-56">
                        <img
                          src={item.photo}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}

                    <p className="font-sans text-sm text-[#5D4426]/85 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
