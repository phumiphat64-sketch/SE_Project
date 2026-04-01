// infrastructure/database/mongoDB.js
// Singleton Pattern - Mongo Native Driver (Docker-safe & Next.js HMR Safe)

import { MongoClient } from "mongodb";

let client;
let clientPromise;

export async function getClient() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  // 🔹 เพิ่มเงื่อนไขเพื่อจัดการ Next.js Hot Module Replacement (HMR) ในโหมด Dev
  if (process.env.NODE_ENV === "development") {
    // ใช้ global variable เพื่อเก็บ cache ของ connection ไว้ ไม่ให้ถูกลบตอนเซฟไฟล์
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // ในโหมด Production (เซิร์ฟเวอร์จริง) ทำงานตาม Logic เดิมของคุณได้เลย
    if (!clientPromise) {
      client = new MongoClient(uri);
      clientPromise = client.connect();
    }
  }

  return clientPromise;
}
