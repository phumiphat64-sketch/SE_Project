import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";

export async function GET() {
  try {
    const client = await getClient();
    const database = client.db("DB_Server");

    const orders = await database
      .collection("orders")
      .aggregate([
        {
          $addFields: {
            userIdObj: { $toObjectId: "$userId" }, // 👈 แปลงตรงนี้
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userIdObj", // 👈 ใช้ตัวใหม่
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            buyerName: "$user.name",
          },
        },
        {
          $project: {
            user: 0,
            userIdObj: 0, // ลบทิ้ง
          },
        },
        {
          $sort: { _id: -1 },
        },
      ])
      .toArray();

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
