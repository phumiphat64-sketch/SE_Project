import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Logged out successfully",
  });

  // ลบ cookie token
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // ทำให้หมดอายุทันที
    path: "/",
  });

  return response;
}
