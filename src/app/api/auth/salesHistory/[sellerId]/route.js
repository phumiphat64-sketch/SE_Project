import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";

export async function GET(req, { params }) {
  const { sellerId } = await params;

  const client = await getClient();
  const db = client.db("DB_Server");

  const orders = await db
    .collection("orders")
    .aggregate([
      {
        $match: {
          sellerId,
          status: "Paid",
        },
      },
      {
        // 🔥 แปลง userId (string → ObjectId)
        $addFields: {
          userObjectId: { $toObjectId: "$userId" },
        },
      },
      {
        // 🔥 join กับ users
        $lookup: {
          from: "users",
          localField: "userObjectId",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: {
          path: "$buyer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ])
    .toArray();

  return NextResponse.json(orders);
}
