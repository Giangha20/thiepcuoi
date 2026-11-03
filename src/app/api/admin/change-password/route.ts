import { NextRequest, NextResponse } from "next/server";
import { verifyAuthRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const admin = await verifyAuthRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Mật khẩu mới phải có ít nhất 6 ký tự" }, { status: 400 });
    }

    const currentAdmin = await prisma.admin.findUnique({
      where: { id: admin.id },
    });

    if (!currentAdmin) {
      return NextResponse.json({ error: "Tài khoản không tồn tại" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, currentAdmin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Mật khẩu hiện tại không chính xác" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: hashed },
    });

    return NextResponse.json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi đổi mật khẩu: " + error.message }, { status: 500 });
  }
}
