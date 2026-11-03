import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "wedding-invitation-super-secret-key-2026";
const key = new TextEncoder().encode(JWT_SECRET);

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
}

export async function signAdminToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as AdminPayload;
  } catch (error) {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function verifyAuthRequest(req: NextRequest): Promise<AdminPayload | null> {
  const cookieToken = req.cookies.get("admin_session")?.value;
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  const token = cookieToken || bearerToken;
  if (!token) return null;
  return await verifyAdminToken(token);
}
