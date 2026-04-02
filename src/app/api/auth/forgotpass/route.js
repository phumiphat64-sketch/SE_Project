import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    // connect MongoDB
    const client = await getClient();
    const db = client.db();

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // expire 10 minutes
    const otpExpire = Date.now() + 10 * 60 * 1000;

    // update user
    const result = await db.collection("users").updateOne(
      { email },
      {
        $set: {
          resetOTP: otp,
          otpExpire: otpExpire,
        },
      },
    );

    console.log("matched:", result.matchedCount);
    console.log("modified:", result.modifiedCount);
    console.log("OTP for", email, ":", otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "ReRead Password Reset OTP",
      text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
    });

    return NextResponse.json({
      message: "If the email exists, a reset code has been sent.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
