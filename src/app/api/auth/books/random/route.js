import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";

export async function GET() {
  const client = await getClient();
  const db = client.db("DB_Server");

  const books = await db
    .collection("books")
    .aggregate([
      {
        $lookup: {
          from: "seller_profiles",
          let: { sid: { $toString: "$sellerId" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$sid"],
                },
              },
            },
          ],
          as: "sellerInfo",
        },
      },
      {
        $unwind: {
          path: "$sellerInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .toArray();

    console.log(JSON.stringify(books[0], null, 2));

  return NextResponse.json({ data: books });
}
