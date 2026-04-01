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

// 🔹 Strategy Pattern (Lookup Map) สำหรับจัดการ Route และ Redirect
// ถ้าระบบมี Role ใหม่ในอนาคต แค่มาเพิ่มใน Object นี้ที่เดียว โค้ดส่วนอื่นไม่ต้องแก้เลย
const roleConfig = {
  admin: { path: "/admin", redirect: "/admin/home" },
  seller: { path: "/seller", redirect: "/seller/profile" },
  buyer: { path: "/buyer", redirect: "/buyer/profilebuyer" },
};

// 🔹 Role Guard
function checkRole(pathname, role) {
  // วนลูปเช็คตาม config ด้านบนแทนการใช้ if หลายๆ บรรทัด
  for (const [key, config] of Object.entries(roleConfig)) {
    if (pathname.startsWith(config.path) && role !== key) {
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

  // 1. ถ้ามาหน้า /login แต่ดันมี token (ล็อกอินอยู่แล้ว) ให้เด้งไปหน้าตัวเองเลย
  if (pathname === "/login") {
    if (payload) {
      // ใช้ Lookup Map ดึง URL เป้าหมายตาม Role (ถ้าไม่เจอให้ไป "/") ลด if-else
      const redirectUrl = roleConfig[payload.role]?.redirect || "/";
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

  // 4. Check status (ยุบรวมเงื่อนไข if ให้เหลือบรรทัดเดียว)
  if (payload?.status === "inactive" && !pathname.startsWith("/suspended")) {
    return NextResponse.redirect(new URL("/suspended", request.url));
  }

  return NextResponse.next();
}

// ❗ อย่าลืมเพิ่ม "/login" เข้าไปใน matcher ด้วย ไม่งั้น middleware จะไม่ทำงานหน้า login
export const config = {
  matcher: [
    "/buyer/:path*",
    "/seller/:path*",
    "/admin/:path*",
    "/login",
    "/suspended",
  ],
};
