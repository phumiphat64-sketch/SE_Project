import { NextResponse } from "next/server";
import { createOrder } from "@/infrastructure/repositories/order.repository";
import { getClient } from "@/infrastructure/database/mongoDB";

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await createOrder(body);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const client = await getClient();
    const database = client.db("DB_Server"); // ✅ ต้องมีบรรทัดนี้

    const orders = await database
      .collection("orders")
      .find({})
      .sort({ _id: -1 })
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
