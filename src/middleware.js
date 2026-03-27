import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

//Design Pattern : Guard & Middleware Pattern

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// 🔹 Auth Guard
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// 🔹 Role Guard
function checkRole(pathname, role) {
  if (pathname.startsWith("/buyer") && role !== "buyer") {
    return "/";
  }

  if (pathname.startsWith("/seller") && role !== "seller") {
    return "/";
  }

  return null;
}

// 🔹 Main Proxy (Middleware)
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // ❗ ไม่ยุ่งกับ login
  if (pathname === "/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  // 🔸 No token → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔸 Verify token
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔸 Check role
  const redirectPath = checkRole(pathname, payload.role);
  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/buyer/:path*", "/seller/:path*"],
};
