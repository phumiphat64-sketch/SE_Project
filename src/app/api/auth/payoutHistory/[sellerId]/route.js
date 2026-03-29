import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";

export async function GET(req, { params }) {
  const { sellerId } = await params;

  const client = await getClient();
  const db = client.db("DB_Server");

  await db.collection("payouts").updateMany(
    {
      status: "Pending",
      completeAt: { $lte: new Date() },
    },
    {
      $set: { status: "Success" },
    },
  );

  const payouts = await db
    .collection("payouts")
    .find({ sellerId })
    .sort({ createdAt: -1 })
    .limit(3)
    .toArray();

  return NextResponse.json(payouts);
}
