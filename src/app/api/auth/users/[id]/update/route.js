import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    const client = await getClient();
    const db = client.db("DB_Server");

    const body = await req.json();

    // ⭐ ดึง id จาก URL
    const id = req.nextUrl.pathname.split("/")[4];
    // /api/auth/users/[id]/update → index 4

    console.log("PATCH ID:", id);

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          role: body.role.toLowerCase(),
        },
      },
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
