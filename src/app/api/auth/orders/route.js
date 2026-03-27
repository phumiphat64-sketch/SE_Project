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

    // 🔥 สร้างเงื่อนไข Query: ถ้ามี userId ให้หาเฉพาะออเดอร์ของ userId นั้น
    let query = {};
    if (userId) {
      query = { userId: userId }; // สมมติว่าใน DB คุณเก็บฟิลด์ชื่อ 'userId'
    }

    const orders = await database
      .collection("orders")
      .find(query) // ✅ เปลี่ยนจาก {} เป็นตัวแปร query
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
