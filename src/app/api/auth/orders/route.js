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
    const {
      orderId,
      status,
      cancelReason,
      paymentMethod,
      paymentDetail,
      userId,
    } = await request.json();

    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json({ message: "Invalid orderId" }, { status: 400 });
    }

    const objectId = new ObjectId(orderId);
    
    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 },
      );
    }

    const client = await getClient();
    const database = client.db("DB_Server");
    const collection = database.collection("orders");

    const order = await collection.findOne({
      _id: objectId,
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.status === "Paid") {
      return NextResponse.json({ message: "Already paid" }, { status: 400 });
    }

    if (status === "Paid") {
      const booksCollection = database.collection("books");

      if (order.bookId) {
        if (!ObjectId.isValid(order.bookId)) {
          return NextResponse.json(
            { message: "Invalid bookId" },
            { status: 400 },
          );
        }

        const bookObjectId = new ObjectId(order.bookId);

        const book = await booksCollection.findOne({
          _id: bookObjectId,
        });

        if (!book) {
          return NextResponse.json(
            { message: "Book not found" },
            { status: 404 },
          );
        }

        if (book.stock < order.quantity) {
          return NextResponse.json(
            { message: "Not enough stock" },
            { status: 400 },
          );
        }

        await booksCollection.updateOne(
          { _id: bookObjectId },
          {
            $inc: { stock: -Number(order.quantity) },
          },
        );
      } else {
        // fallback
        await booksCollection.updateOne(
          { title: order.bookName },
          {
            $inc: { stock: -Number(order.quantity) },
          },
        );
      }
    }

    let phone = null;

    if (userId && ObjectId.isValid(userId)) {
      const user = await database.collection("users").findOne({
        _id: new ObjectId(userId),
      });

      if (user) {
        phone = user.phone;
      }
    }

    const result = await collection.updateOne(
      { _id: objectId },
      {
        $set: {
          status: status,
          cancelReason: cancelReason,
          paymentMethod: paymentMethod || null,
          paymentDetail: paymentDetail || null,

          ...(phone && { phone }), 

          paidAt: status === "Paid" ? new Date() : null,
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order updated successfully" },
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
