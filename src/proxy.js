import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// 🔹 Strategy Pattern: สร้าง Map เก็บการตั้งค่าของแต่ละ Role ไว้ที่เดียว
const roleConfig = {
  admin: { prefix: "/admin", home: "/admin/home" },
  seller: { prefix: "/seller", home: "/seller/profile" },
  buyer: { prefix: "/buyer", home: "/buyer/profilebuyer" },
};

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
  for (const [key, config] of Object.entries(roleConfig)) {
    if (pathname.startsWith(config.prefix) && role !== key) {
      return "/";
    }
  }
  return null;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  let payload = null;
  if (token) {
    payload = await verifyToken(token);
  }

  if (pathname === "/login") {
    if (payload && roleConfig[payload.role]) {
      const redirectUrl = roleConfig[payload.role].home;
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  if (!token || !payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Check role
  const redirectPath = checkRole(pathname, payload.role);
  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // 4. Check status
  if (payload?.status === "inactive") {
    const roleHome = roleConfig[payload.role]?.home || "/";

    if (!pathname.startsWith("/suspended")) {
      return NextResponse.redirect(new URL(roleHome, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/buyer/:path*",
    "/seller/:path*",
    "/admin/:path*",
    "/login",
    "/suspended",
  ],
};
