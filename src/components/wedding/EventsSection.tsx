"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Navigation, ExternalLink, CalendarPlus } from "lucide-react";
import { WeddingEvent } from "@/lib/types";
import { ThemeConfig } from "@/lib/theme";

interface EventsSectionProps {
  events: WeddingEvent[];
  theme: ThemeConfig;
}

export default function EventsSection({ events, theme }: EventsSectionProps) {
  const [selectedMapIndex, setSelectedMapIndex] = useState<number | null>(null);

  // Helper to generate Google Calendar link
  const createGoogleCalendarUrl = (event: WeddingEvent) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`Tham dự ${event.title} tại ${event.venueName} - ${event.address}`);
    const location = encodeURIComponent(`${event.venueName}, ${event.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#B88E5B] font-semibold">
          Thời Gian & Địa Điểm
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2A26] mt-2 mb-4 font-normal">
          Sự Kiện Trọng Đại
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="w-12 h-px bg-[#DFC5A8]" />
          <Calendar className="w-4 h-4 text-[#B88E5B]" />
          <span className="w-12 h-px bg-[#DFC5A8]" />
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {events.map((event, idx) => (
          <motion.div
            key={event.id || idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="bg-white rounded-3xl p-6 sm:p-7 shadow-wedding-card border border-[#DFC5A8]/40 flex flex-col justify-between relative overflow-hidden group hover:border-[#B88E5B]/60 transition-all duration-300"
          >
            {/* Top decorative accent */}
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-[#B88E5B] to-[#D4AF37] mb-5" />

            {/* Event Title */}
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#2D2A26] mb-4">
                {event.title}
              </h3>

              {/* Time & Date */}
              <div className="space-y-2.5 text-sm font-sans text-[#5D4426] mb-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#B88E5B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-base text-[#7A5B33]">
                      {event.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#B88E5B] shrink-0 mt-0.5" />
                  <span className="font-serif text-sm text-[#2D2A26]">
                    {event.date}
                  </span>
                </div>

                <div className="flex items-start gap-3 pt-1 border-t border-[#DFC5A8]/30">
                  <MapPin className="w-4 h-4 text-[#C67667] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#2D2A26]">{event.venueName}</p>
                    <p className="text-xs text-[#7A5B33]/80 mt-0.5 leading-relaxed">
                      {event.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Direct Maps & Add to Calendar */}
            <div className="space-y-2 pt-4 border-t border-[#DFC5A8]/30 mt-auto">
              <a
                href={event.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium transition-colors border border-[#DFC5A8]/50"
              >
                <Navigation className="w-3.5 h-3.5 text-[#B88E5B]" />
                <span>Chỉ đường trên Google Maps</span>
                <ExternalLink className="w-3 h-3 text-[#7A5B33]/60 ml-auto" />
              </a>

              <a
                href={createGoogleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#B88E5B] text-xs font-sans transition-colors border border-[#DFC5A8]/30"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#B88E5B]" />
                <span>Lưu vào Google Calendar</span>
              </a>

              {/* Embedded Map Toggle Button if embedUrl provided */}
              {event.mapEmbedUrl && (
                <button
                  onClick={() =>
                    setSelectedMapIndex(selectedMapIndex === idx ? null : idx)
                  }
                  className="w-full text-center text-[11px] text-[#7A5B33]/80 hover:text-[#B88E5B] font-sans underline py-1"
                >
                  {selectedMapIndex === idx ? "Thu gọn bản đồ" : "Xem bản đồ tại đây"}
                </button>
              )}

              {/* Embedded iframe preview */}
              {selectedMapIndex === idx && event.mapEmbedUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 200 }}
                  className="mt-3 rounded-xl overflow-hidden border border-[#DFC5A8]/50"
                >
                  <iframe
                    src={event.mapEmbedUrl}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title={`Bản đồ ${event.venueName}`}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
