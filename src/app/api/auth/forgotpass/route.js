import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { email } = await req.json();

  const client = await clientPromise;
  const db = client.db("reread");

  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "Email not found" }, { status: 404 });
  }

  const token = crypto.randomBytes(32).toString("hex");

  await db.collection("users").updateOne(
    { email },
    {
      $set: {
        resetToken: token,
        resetExpire: Date.now() + 1000 * 60 * 15,
      },
    },
  );

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  console.log("Reset Link:", resetLink);

  return NextResponse.json({
    message: "Reset link generated",
  });
}
