import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 },
      );
    }

    const client = await getClient();
    const db = client.db("DB_Server");

    const user = await db.collection("users").findOne({
      email,
      resetOTP: otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: "OTP verified",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
