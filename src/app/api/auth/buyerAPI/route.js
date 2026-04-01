import { getClient } from "@/infrastructure/database/mongoDB";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await getClient();
    const db = client.db("DB_Server");

    const books = await db
      .collection("books")
      .aggregate([
        {
          $match: { status: "Published" },
        },
        {
          $lookup: {
            from: "seller_profiles",
            let: { sellerId: "$sellerId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$userId", "$$sellerId"],
                  },
                },
              },
            ],
            as: "seller",
          },
        },
        {
          $unwind: {
            path: "$seller",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            sellerName: "$seller.fullName",
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray();

    return Response.json({
      success: true,
      data: books,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
