import { getClient } from "../database/mongoDB";
import { ObjectId } from "mongodb";

export async function createOrder(orderData) {
  const client = await getClient();
  const db = client.db("DB_Server");

  const collection = db.collection("orders");

  // 🔥 1. หา book จาก bookId (string เช่น BK-xxxx)
  let sellerId = null;

  if (orderData.bookId) {
    const book = await db.collection("books").findOne({
      _id: new ObjectId(orderData.bookId), // ✅ แก้ตรงนี้
    });

    console.log("BOOK FOUND:", book); // debug

    if (book) {
      sellerId = book.sellerId;
    }
  }

  // 🔥 2. สร้าง order ใหม่
  const newOrder = {
    ...orderData,
    sellerId: sellerId, // ✅ ต้องไม่ null
    createdAt: new Date(),
  };

  const result = await collection.insertOne(newOrder);
  return result;
}
