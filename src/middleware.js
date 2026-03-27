import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

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
  if (pathname.startsWith("/buyer") && role !== "buyer") return "/";
  if (pathname.startsWith("/seller") && role !== "seller") return "/";
  return null;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  let payload = null;
  if (token) {
    payload = await verifyToken(token);
  }

  // 1. ถ้ามาหน้า /login แต่ดันมี token (ล็อกอินอยู่แล้ว) ให้เด้งไปหน้าตัวเองเลย
  if (pathname === "/login") {
    if (payload) {
      const redirectUrl =
        payload.role === "seller" ? "/seller/profile" : "/buyer/profilebuyer";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next(); // ถ้ายังไม่ล็อกอิน ปล่อยให้เข้าหน้า login ได้
  }

  // 2. ถ้าเข้าหน้าอื่นที่ต้องการสิทธิ์ แต่ไม่มี Token → เด้งไป login
  if (!token || !payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Check role
  const redirectPath = checkRole(pathname, payload.role);
  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

// ❗ อย่าลืมเพิ่ม "/login" เข้าไปใน matcher ด้วย ไม่งั้น middleware จะไม่ทำงานหน้า login
export const config = {
  matcher: ["/buyer/:path*", "/seller/:path*", "/login"],
};
