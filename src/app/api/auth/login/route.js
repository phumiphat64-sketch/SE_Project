export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import MongoUserRepository from "@/infrastructure/repositories/user.repository.mongo";
import AuthService from "@/domain/services/auth.service";

export async function POST(req) {
  try {
    const body = await req.json();

    const userRepo = new MongoUserRepository();
    const authService = new AuthService(userRepo);

    const { token, user } = await authService.login(body);

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        addresses: user.addresses || [], 
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }
}
