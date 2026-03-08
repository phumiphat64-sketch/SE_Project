import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 },
      );
    }

    const client = await getClient();
    const db = client.db();

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection("users").updateOne(
      { email },
      {
        $set: { password: hashedPassword },
        $unset: { resetOTP: "", otpExpire: "" },
      },
    );

    return NextResponse.json({ message: "Password updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
