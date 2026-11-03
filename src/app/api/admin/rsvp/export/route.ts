import { NextRequest, NextResponse } from "next/server";
import { verifyAuthRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  const admin = await verifyAuthRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rsvps = await prisma.rsvp.findMany({
      orderBy: { createdAt: "desc" },
    });

    const dataRows = rsvps.map((item, idx) => ({
      STT: idx + 1,
      "Họ và tên khách mời": item.name,
      "Số điện thoại": item.phone || "Không để lại",
      "Số người tham dự": item.isAttending ? item.guestCount : 0,
      "Tham dự": item.isAttending ? "Có tham dự" : "Không thể đến",
      "Khách của bên":
        item.side === "groom" ? "Nhà Trai" : item.side === "bride" ? "Nhà Gái" : "Cả hai bên",
      "Lời nhắn / Ghi chú": item.notes || "",
      "Thời gian xác nhận": new Date(item.createdAt).toLocaleString("vi-VN"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);

    // Auto fit column widths
    const colWidths = [
      { wch: 6 },  // STT
      { wch: 26 }, // Ho ten
      { wch: 16 }, // So dien thoai
      { wch: 18 }, // So nguoi
      { wch: 16 }, // Tham du
      { wch: 16 }, // Ben
      { wch: 40 }, // Ghi chu
      { wch: 22 }, // Thoi gian
    ];
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh Sách Khách Mời");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new Response(excelBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="Danh_sach_khach_moi_cuoi_${Date.now()}.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error: any) {
    console.error("Export RSVP error:", error);
    return NextResponse.json({ error: "Lỗi xuất file Excel: " + error.message }, { status: 500 });
  }
}
