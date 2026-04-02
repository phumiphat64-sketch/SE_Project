import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");

    const orderId = segments[segments.length - 2];
    console.log("orderId:", orderId);

    const client = await getClient();
    const db = client.db();

    const order = await db.collection("orders").findOne({
      _id: new ObjectId(orderId),
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.status !== "Pending") {
      return NextResponse.json(
        { message: "Only pending orders can be cancelled" },
        { status: 400 },
      );
    }

    await db
      .collection("orders")
      .updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: "Canceled" } },
      );

    return NextResponse.json({ message: "Cancelled successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
