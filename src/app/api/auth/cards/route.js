import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getClient } from "@/infrastructure/database/mongoDB";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, card } = body;

    if (!userId || !card) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    const client = await getClient();
    const db = client.db();

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $push: {
          savedCards: card,
        },
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save card error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const client = await getClient();
    const db = client.db();

    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    return NextResponse.json({
      cards: user?.savedCards || [],
    });
  } catch (error) {
    console.error("Fetch cards error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}