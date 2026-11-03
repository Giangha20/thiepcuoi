"use client";

import React, { useState } from "react";
import { Save, QrCode, Upload, CheckCircle2, Sparkles } from "lucide-react";

interface GiftBoxEditorProps {
  wedding: any;
  onSave: (data: any) => Promise<void>;
}

export default function GiftBoxEditor({ wedding, onSave }: GiftBoxEditorProps) {
  const [formData, setFormData] = useState({
    groomBankName: wedding.groomBankName || "",
    groomBankAccount: wedding.groomBankAccount || "",
    groomBankOwner: wedding.groomBankOwner || "",
    groomBankQr: wedding.groomBankQr || "",

    brideBankName: wedding.brideBankName || "",
    brideBankAccount: wedding.brideBankAccount || "",
    brideBankOwner: wedding.brideBankOwner || "",
    brideBankQr: wedding.brideBankQr || "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Helper to generate quick VietQR API URL
  const generateVietQR = (
    bankCode: string,
    accountNo: string,
    accountName: string,
    isGroom: boolean
  ) => {
    if (!accountNo) {
      alert("Vui lòng nhập số tài khoản trước");
      return;
    }
    const encodedName = encodeURIComponent(accountName.toUpperCase());
    const qrUrl = `https://api.vietqr.io/image/970436-${accountNo}-compact2.jpg?accountName=${encodedName}&amount=0`;

    if (isGroom) {
      setFormData((prev) => ({ ...prev, groomBankQr: qrUrl }));
    } else {
      setFormData((prev) => ({ ...prev, brideBankQr: qrUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...wedding, ...formData });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Lỗi lưu thông tin: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#2D2A26]">
            Hộp Mừng Cưới &amp; Mã QR Ngân Hàng
          </h2>
          <p className="text-xs font-sans text-gray-500 mt-0.5">
            Cấu hình số tài khoản và mã VietQR để khách mời gửi lì xì mừng cưới online
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B88E5B] hover:bg-[#997343] text-white text-xs font-sans font-medium transition-all shadow-md disabled:opacity-60"
        >
          {saving ? (
            <span>Đang lưu...</span>
          ) : success ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Đã lưu thành công!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu tài khoản</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Groom Bank */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#DFC5A8]/50 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B88E5B]" />
            <h3 className="font-serif text-lg font-medium text-[#2D2A26]">
              Tài Khoản Mừng Cưới Chú Rể
            </h3>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Tên Ngân hàng (Ví dụ: Vietcombank, Techcombank, MB...)
            </label>
            <input
              type="text"
              value={formData.groomBankName}
              onChange={(e) =>
                setFormData({ ...formData, groomBankName: e.target.value })
              }
              placeholder="Vietcombank"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Số tài khoản ngân hàng
            </label>
            <input
              type="text"
              value={formData.groomBankAccount}
              onChange={(e) =>
                setFormData({ ...formData, groomBankAccount: e.target.value })
              }
              placeholder="10123456789"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Tên chủ tài khoản (Viết hoa không dấu)
            </label>
            <input
              type="text"
              value={formData.groomBankOwner}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  groomBankOwner: e.target.value.toUpperCase(),
                })
              }
              placeholder="NGUYEN HOANG NAM"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-sans font-medium text-gray-700">
                Đường dẫn mã QR (VietQR)
              </label>
              <button
                type="button"
                onClick={() =>
                  generateVietQR(
                    formData.groomBankName,
                    formData.groomBankAccount,
                    formData.groomBankOwner,
                    true
                  )
                }
                className="text-[11px] font-sans text-[#B88E5B] hover:text-[#997343] font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Tự động tạo VietQR</span>
              </button>
            </div>
            <input
              type="text"
              value={formData.groomBankQr}
              onChange={(e) =>
                setFormData({ ...formData, groomBankQr: e.target.value })
              }
              placeholder="https://api.vietqr.io/..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>

          {formData.groomBankQr && (
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#DFC5A8]/40 text-center">
              <img
                src={formData.groomBankQr}
                alt="QR Chú Rể"
                className="w-32 h-32 object-contain mx-auto rounded-xl bg-white p-1"
              />
              <span className="text-[10px] text-gray-400 font-sans mt-1 block">
                Xem trước mã QR Chú Rể
              </span>
            </div>
          )}
        </div>

        {/* Bride Bank */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#DFC5A8]/50 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C67667]" />
            <h3 className="font-serif text-lg font-medium text-[#2D2A26]">
              Tài Khoản Mừng Cưới Cô Dâu
            </h3>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Tên Ngân hàng (Ví dụ: MB Bank, ACB, VPBank...)
            </label>
            <input
              type="text"
              value={formData.brideBankName}
              onChange={(e) =>
                setFormData({ ...formData, brideBankName: e.target.value })
              }
              placeholder="MB Bank"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Số tài khoản ngân hàng
            </label>
            <input
              type="text"
              value={formData.brideBankAccount}
              onChange={(e) =>
                setFormData({ ...formData, brideBankAccount: e.target.value })
              }
              placeholder="9876543210"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-gray-700 mb-1">
              Tên chủ tài khoản (Viết hoa không dấu)
            </label>
            <input
              type="text"
              value={formData.brideBankOwner}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  brideBankOwner: e.target.value.toUpperCase(),
                })
              }
              placeholder="TRAN LE MINH ANH"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-sans font-medium text-gray-700">
                Đường dẫn mã QR (VietQR)
              </label>
              <button
                type="button"
                onClick={() =>
                  generateVietQR(
                    formData.brideBankName,
                    formData.brideBankAccount,
                    formData.brideBankOwner,
                    false
                  )
                }
                className="text-[11px] font-sans text-[#B88E5B] hover:text-[#997343] font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Tự động tạo VietQR</span>
              </button>
            </div>
            <input
              type="text"
              value={formData.brideBankQr}
              onChange={(e) =>
                setFormData({ ...formData, brideBankQr: e.target.value })
              }
              placeholder="https://api.vietqr.io/..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-sans"
            />
          </div>

          {formData.brideBankQr && (
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#DFC5A8]/40 text-center">
              <img
                src={formData.brideBankQr}
                alt="QR Cô Dâu"
                className="w-32 h-32 object-contain mx-auto rounded-xl bg-white p-1"
              />
              <span className="text-[10px] text-gray-400 font-sans mt-1 block">
                Xem trước mã QR Cô Dâu
              </span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
