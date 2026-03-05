import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const pathname = request.nextUrl.pathname;

    // buyer route
    if (pathname.startsWith("/buyer") && payload.role !== "buyer") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // seller route
    if (pathname.startsWith("/seller/selleregis") && payload.role !== "seller") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/buyer/:path*", "/seller/:path*"],
};
