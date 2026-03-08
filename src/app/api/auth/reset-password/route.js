import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email and new password are required" },
        { status: 400 },
      );
    }

    const client = await getClient();
    const db = client.db("DB_Server");

    // hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await db.collection("users").updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetOTP: "",
          otpExpire: "",
        },
      },
    );

    if (!result.matchedCount) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
