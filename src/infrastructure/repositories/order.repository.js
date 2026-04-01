import { getClient } from "../database/mongoDB";
import { ObjectId } from "mongodb";
// Module Pattern + Repository Pattern
// 🔹 สร้าง Helper Function สำหรับเรียก DB (ซ่อนไว้ให้ใช้แค่ในไฟล์นี้เท่านั้น)
// เพื่อให้ฟังก์ชันอื่นๆ ในอนาคต (เช่น updateOrder, getOrder) สามารถเรียกใช้ได้โดยไม่ต้องเขียนซ้ำ
async function getDb() {
  const client = await getClient();
  return client.db("DB_Server");
}

export async function createOrder(orderData) {
  const db = await getDb();

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

  // ยุบรวมตัวแปร result แล้ว return ออกไปโดยตรงเลย
  return await db.collection("orders").insertOne(newOrder);
}
