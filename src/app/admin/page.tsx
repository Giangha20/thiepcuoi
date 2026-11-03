"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardOverview from "@/components/admin/DashboardOverview";
import WeddingInfoEditor from "@/components/admin/WeddingInfoEditor";
import EventsEditor from "@/components/admin/EventsEditor";
import TimelineEditor from "@/components/admin/TimelineEditor";
import GalleryEditor from "@/components/admin/GalleryEditor";
import ThemeCustomizer from "@/components/admin/ThemeCustomizer";
import GiftBoxEditor from "@/components/admin/GiftBoxEditor";
import WishesManager from "@/components/admin/WishesManager";
import RsvpManager from "@/components/admin/RsvpManager";
import LinkSettings from "@/components/admin/LinkSettings";
import {
  LayoutDashboard,
  Heart,
  Calendar,
  History,
  Image as ImageIcon,
  Palette,
  Gift,
  MessageCircleHeart,
  Users,
  Link2,
  Menu,
  X,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [wedding, setWedding] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load Admin Data
  const loadData = async () => {
    try {
      // Check auth
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push("/admin/login");
        return;
      }

      // Load Dashboard Stats
      const dashRes = await fetch("/api/admin/dashboard");
      const dashData = await dashRes.json();
      if (dashData?.stats) {
        setStats(dashData.stats);
        setRecentActivity(dashData.recentActivity);
      }

      // Load Full Wedding Info
      const wedRes = await fetch("/api/admin/wedding");
      const wedData = await wedRes.json();
      if (wedData?.id) {
        setWedding(wedData);
      }
    } catch (e) {
      console.error("Admin load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveWedding = async (updateData: any) => {
    const res = await fetch("/api/admin/wedding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Lỗi lưu thông tin");

    setWedding(data.wedding);
    loadData();
  };

  const navItems = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "info", label: "Thông tin cưới", icon: Heart },
    { id: "events", label: "Sự kiện & Bản đồ", icon: Calendar },
    { id: "timeline", label: "Story Timeline", icon: History },
    { id: "gallery", label: "Album ảnh cưới", icon: ImageIcon },
    { id: "theme", label: "Giao diện & Nhạc", icon: Palette },
    { id: "gift", label: "Hộp mừng cưới", icon: Gift },
    { id: "wishes", label: "Quản lý Lời chúc", icon: MessageCircleHeart, badge: stats?.wishes?.pending },
    { id: "rsvp", label: "Quản lý Khách mời", icon: Users, badge: stats?.rsvp?.attendingCount },
    { id: "link", label: "Đường link & QR", icon: Link2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#B88E5B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm text-[#7A5B33]">Đang kết nối trang quản trị...</p>
        </div>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#DFC5A8]">
          <p className="font-serif text-lg text-gray-800 mb-2">Chưa tìm thấy dữ liệu thiệp cưới</p>
          <p className="text-xs text-gray-500 mb-4">Vui lòng kiểm tra cơ sở dữ liệu đã seed chưa.</p>
          <button
            onClick={() => loadData()}
            className="px-4 py-2 rounded-xl bg-[#B88E5B] text-white text-xs"
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans">
      {/* Top Header */}
      <AdminHeader
        weddingTitle={wedding.title}
        slug={wedding.slug}
        adminEmail="admin@wedding.com"
      />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow flex flex-col md:flex-row gap-6">
        {/* Mobile Navigation Bar Toggle */}
        <div className="md:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#DFC5A8]/50 shadow-sm">
          <span className="font-serif font-medium text-sm text-[#2D2A26]">
            {navItems.find((n) => n.id === activeTab)?.label}
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#FAF7F2] text-[#7A5B33]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <aside
          className={`md:w-64 shrink-0 space-y-1 bg-white md:bg-transparent p-4 md:p-0 rounded-3xl md:rounded-none border md:border-none border-[#DFC5A8]/50 shadow-sm md:shadow-none ${
            mobileMenuOpen ? "block" : "hidden md:block"
          }`}
        >
          <div className="bg-white rounded-3xl p-3 shadow-sm border border-[#DFC5A8]/40 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-sans transition-all ${
                    isActive
                      ? "bg-[#FAF7F2] text-[#B88E5B] font-semibold border border-[#DFC5A8]/60 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#B88E5B]" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && Number(item.badge) > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow min-w-0">
          {activeTab === "overview" && (
            <DashboardOverview
              stats={stats}
              recentActivity={recentActivity}
              onNavigateTab={(tab) => setActiveTab(tab)}
              slug={wedding.slug}
            />
          )}

          {activeTab === "info" && (
            <WeddingInfoEditor
              wedding={wedding}
              onSave={handleSaveWedding}
            />
          )}

          {activeTab === "events" && (
            <EventsEditor
              weddingId={wedding.id}
              initialEvents={wedding.events || []}
              onRefresh={loadData}
            />
          )}

          {activeTab === "timeline" && (
            <TimelineEditor
              weddingId={wedding.id}
              initialTimeline={wedding.timeline || []}
              onRefresh={loadData}
            />
          )}

          {activeTab === "gallery" && (
            <GalleryEditor
              weddingId={wedding.id}
              initialGallery={wedding.gallery || []}
              onRefresh={loadData}
            />
          )}

          {activeTab === "theme" && (
            <ThemeCustomizer
              wedding={wedding}
              onSave={handleSaveWedding}
            />
          )}

          {activeTab === "gift" && (
            <GiftBoxEditor
              wedding={wedding}
              onSave={handleSaveWedding}
            />
          )}

          {activeTab === "wishes" && <WishesManager />}

          {activeTab === "rsvp" && <RsvpManager />}

          {activeTab === "link" && (
            <LinkSettings
              wedding={wedding}
              onSave={handleSaveWedding}
            />
          )}
        </main>
      </div>
    </div>
  );
}
