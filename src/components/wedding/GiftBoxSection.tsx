"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Copy, Check, QrCode, X, Heart } from "lucide-react";
import { ThemeConfig } from "@/lib/theme";

interface GiftBoxSectionProps {
  groomName: string;
  groomBankName?: string;
  groomBankAccount?: string;
  groomBankOwner?: string;
  groomBankQr?: string;

  brideName: string;
  brideBankName?: string;
  brideBankAccount?: string;
  brideBankOwner?: string;
  brideBankQr?: string;

  theme: ThemeConfig;
}

export default function GiftBoxSection({
  groomName,
  groomBankName,
  groomBankAccount,
  groomBankOwner,
  groomBankQr,

  brideName,
  brideBankName,
  brideBankAccount,
  brideBankOwner,
  brideBankQr,

  theme,
}: GiftBoxSectionProps) {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [activeQrModal, setActiveQrModal] = useState<{
    title: string;
    qrUrl: string;
    bankName: string;
    accountNumber: string;
    owner: string;
  } | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const hasGroomBank = groomBankAccount && groomBankName;
  const hasBrideBank = brideBankAccount && brideBankName;

  if (!hasGroomBank && !hasBrideBank) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#B88E5B] font-semibold">
          Hộp Mừng Cưới
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2A26] mt-2 mb-4 font-normal">
          Gửi Quà Mừng Chúc Phúc
        </h2>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-12 h-px bg-[#DFC5A8]" />
          <Gift className="w-4 h-4 text-[#B88E5B]" />
          <span className="w-12 h-px bg-[#DFC5A8]" />
        </div>
        <p className="font-sans text-sm text-[#5D4426]/80 leading-relaxed">
          Sự hiện diện và lời chúc phúc của bạn là món quà trân quý nhất. Nếu muốn gửi tặng một chút lì xì chúc phúc từ xa, bạn có thể gửi qua tài khoản bên dưới.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Groom Bank Box */}
        {hasGroomBank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 sm:p-7 shadow-wedding-card border border-[#DFC5A8]/50 flex flex-col justify-between text-center relative overflow-hidden"
          >
            <div>
              <span className="text-xs font-sans uppercase tracking-wider text-[#7A5B33] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#DFC5A8]/40">
                Mừng cưới Chú Rể {groomName}
              </span>

              {/* QR Image Preview if available */}
              {groomBankQr && (
                <div
                  onClick={() =>
                    setActiveQrModal({
                      title: `Mừng cưới Chú rể ${groomName}`,
                      qrUrl: groomBankQr,
                      bankName: groomBankName || "",
                      accountNumber: groomBankAccount || "",
                      owner: groomBankOwner || "",
                    })
                  }
                  className="my-5 w-40 h-40 mx-auto p-2 bg-[#FAF7F2] rounded-2xl border border-[#DFC5A8]/60 cursor-pointer group hover:border-[#B88E5B] transition-all"
                >
                  <img
                    src={groomBankQr}
                    alt="Mã QR Chú Rể"
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <p className="text-[10px] text-[#7A5B33]/80 mt-1 font-sans group-hover:text-[#B88E5B]">
                    Chạm để phóng to mã QR
                  </p>
                </div>
              )}

              <div className="space-y-1.5 my-4 text-sm font-sans text-[#2D2A26]">
                <p className="text-xs text-[#7A5B33]">Ngân hàng:</p>
                <p className="font-semibold">{groomBankName}</p>

                <p className="text-xs text-[#7A5B33] pt-1">Số tài khoản:</p>
                <p className="font-mono text-base font-bold text-[#B88E5B]">
                  {groomBankAccount}
                </p>

                {groomBankOwner && (
                  <>
                    <p className="text-xs text-[#7A5B33] pt-1">Chủ tài khoản:</p>
                    <p className="font-medium text-xs tracking-wider uppercase">
                      {groomBankOwner}
                    </p>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(groomBankAccount!, "groom")}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium transition-colors border border-[#DFC5A8]/50 flex items-center justify-center gap-2"
            >
              {copiedAccount === "groom" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700">Đã sao chép số tài khoản!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#B88E5B]" />
                  <span>Sao chép số tài khoản</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Bride Bank Box */}
        {hasBrideBank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 sm:p-7 shadow-wedding-card border border-[#DFC5A8]/50 flex flex-col justify-between text-center relative overflow-hidden"
          >
            <div>
              <span className="text-xs font-sans uppercase tracking-wider text-[#8B4134] bg-[#FDF8F7] px-3 py-1 rounded-full border border-[#F3DDD8]">
                Mừng cưới Cô Dâu {brideName}
              </span>

              {/* QR Image Preview if available */}
              {brideBankQr && (
                <div
                  onClick={() =>
                    setActiveQrModal({
                      title: `Mừng cưới Cô dâu ${brideName}`,
                      qrUrl: brideBankQr,
                      bankName: brideBankName || "",
                      accountNumber: brideBankAccount || "",
                      owner: brideBankOwner || "",
                    })
                  }
                  className="my-5 w-40 h-40 mx-auto p-2 bg-[#FAF7F2] rounded-2xl border border-[#DFC5A8]/60 cursor-pointer group hover:border-[#B88E5B] transition-all"
                >
                  <img
                    src={brideBankQr}
                    alt="Mã QR Cô Dâu"
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <p className="text-[10px] text-[#7A5B33]/80 mt-1 font-sans group-hover:text-[#B88E5B]">
                    Chạm để phóng to mã QR
                  </p>
                </div>
              )}

              <div className="space-y-1.5 my-4 text-sm font-sans text-[#2D2A26]">
                <p className="text-xs text-[#7A5B33]">Ngân hàng:</p>
                <p className="font-semibold">{brideBankName}</p>

                <p className="text-xs text-[#7A5B33] pt-1">Số tài khoản:</p>
                <p className="font-mono text-base font-bold text-[#C67667]">
                  {brideBankAccount}
                </p>

                {brideBankOwner && (
                  <>
                    <p className="text-xs text-[#7A5B33] pt-1">Chủ tài khoản:</p>
                    <p className="font-medium text-xs tracking-wider uppercase">
                      {brideBankOwner}
                    </p>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(brideBankAccount!, "bride")}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A5B33] text-xs font-sans font-medium transition-colors border border-[#DFC5A8]/50 flex items-center justify-center gap-2"
            >
              {copiedAccount === "bride" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700">Đã sao chép số tài khoản!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#B88E5B]" />
                  <span>Sao chép số tài khoản</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>

      {/* QR Modal Lightbox */}
      <AnimatePresence>
        {activeQrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveQrModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative"
            >
              <button
                onClick={() => setActiveQrModal(null)}
                className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="font-serif text-lg font-medium text-[#2D2A26] mb-1">
                {activeQrModal.title}
              </h4>
              <p className="text-xs text-[#7A5B33] font-sans mb-4">
                Quét mã qua ứng dụng ngân hàng bất kỳ
              </p>

              <div className="w-56 h-56 mx-auto p-2 border border-gray-200 rounded-2xl bg-white shadow-sm mb-4">
                <img
                  src={activeQrModal.qrUrl}
                  alt="QR Code"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <div className="text-xs font-sans text-[#5D4426] space-y-1 bg-[#FAF7F2] p-3 rounded-xl border border-[#DFC5A8]/40">
                <p>
                  <span className="text-gray-500">Ngân hàng:</span>{" "}
                  <strong>{activeQrModal.bankName}</strong>
                </p>
                <p>
                  <span className="text-gray-500">STK:</span>{" "}
                  <strong className="font-mono text-[#B88E5B]">
                    {activeQrModal.accountNumber}
                  </strong>
                </p>
                <p>
                  <span className="text-gray-500">Tên:</span>{" "}
                  <strong>{activeQrModal.owner}</strong>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
