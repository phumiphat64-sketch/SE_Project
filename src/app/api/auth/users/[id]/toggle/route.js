import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";
import { ObjectId } from "mongodb";

export async function PATCH(req, context) {
  try {
    console.log("context:", context);

    // 🔥 สำคัญมาก
    const params = await context.params;

    console.log("params:", params);

    if (!params?.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const userId = params.id;

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const client = await getClient();
    const db = client.db("DB_Server");

    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentStatus = user.status || "active";

    const newStatus = currentStatus === "inactive" ? "active" : "inactive";

    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { status: newStatus } },
      );

    return NextResponse.json({ status: newStatus });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
