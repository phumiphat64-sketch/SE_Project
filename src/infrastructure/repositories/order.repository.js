import { getClient } from "../database/mongoDB";

export async function createOrder(orderData) {
  const client = await getClient(); // ได้ MongoClient
  const db = client.db("DB_Server"); // ✅ แปลงเป็น db ตรงนี้

  const collection = db.collection("orders");

  const result = await collection.insertOne(orderData);
  return result;
}
