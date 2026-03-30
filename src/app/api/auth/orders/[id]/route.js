import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const client = await getClient();
    const db = client.db("DB_Server");

    const order = await db.collection("orders").findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ UPDATE tracking
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const body = await req.json();

    const client = await getClient();
    const db = client.db("DB_Server");

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: body.status,
          trackingNumber: body.trackingNumber,
          carrier: body.carrier,
        },
      },
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err) {
    console.error("PUT ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
