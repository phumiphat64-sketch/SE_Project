// src/app/api/auth/me/route.js

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getClient } from "@/infrastructure/database/mongoDB";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const client = await getClient();
    const db = client.db("DB_Server");

    const user = await db.collection("users").findOne({
      _id: new ObjectId(payload.userId),
    });

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status || "active",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
