import { NextResponse } from "next/server";
import { createOrder } from "@/infrastructure/repositories/order.repository";
import { getClient } from "@/infrastructure/database/mongoDB";
import { ObjectId } from "mongodb";

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

export async function PATCH(request) {
  try {
    const { orderId, status, cancelReason } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 },
      );
    }

    // ✅ 1. เรียกใช้ Database ด้วย getClient แบบเดียวกับฟังก์ชัน GET
    const client = await getClient();
    const database = client.db("DB_Server");
    const collection = database.collection("orders");

    // ✅ 2. อัปเดตข้อมูลด้วย .updateOne()
    const result = await collection.updateOne(
      { _id: new ObjectId(orderId) }, // ค้นหาด้วย _id
      {
        $set: {
          status: status,
          cancelReason: cancelReason,
        },
      },
    );

    // เช็คว่าหาออเดอร์เจอและอัปเดตสำเร็จไหม
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order cancelled successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
