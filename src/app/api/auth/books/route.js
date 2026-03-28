import BookService from "@/domain/services/book.service";
import MongoBookRepository from "@/infrastructure/repositories/mongo.book.repository";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getClient } from "@/infrastructure/database/mongoDB";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    // 🔹 อ่าน token จาก cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("Unauthorized");
    }

    // 🔹 decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const sellerId = decoded.userId;
    console.log("JWT USER:", sellerId);

    const client = await getClient();
    const db = client.db("DB_Server");

    const seller = await db
      .collection("users")
      .findOne({ userId: sellerId });

    const sellerName = seller?.fullName || "";
    
    const repo = new MongoBookRepository();
    const service = new BookService(repo);

    // 🔹 เพิ่ม sellerId เข้าไป
    const result = await service.addBook({
      sellerId,
      sellerName,
      ...body,
    });

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("Unauthorized");
    }

    // ✅ 1. decode ก่อน
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sellerId = decoded.userId;

    // ✅ 2. สร้าง db ก่อนใช้
    const client = await getClient();
    const db = client.db("DB_Server");

    // ✅ 3. debug ตรงนี้
    console.log("JWT sellerId:", sellerId);

    const allBooks = await db.collection("books").find().toArray();
    console.log(
      "All sellerIds:",
      allBooks.map((b) => b.sellerId),
    );

    // 1. ดึงรายการหนังสือที่ Published ทั้งหมด
    const books = await db
      .collection("books")
      .find({
        status: "Published",
        sellerId: sellerId, // ✅ ใส่ตรงนี้เลย
      })
      .sort({ createdAt: -1 })
      .toArray();

    // 2. เปลี่ยนมาดึงข้อมูลจาก collection 'seller_profiles' แทน 'users'
    const sellerProfiles = await db
      .collection("seller_profiles")
      .find()
      .toArray();

    // 3. Map ข้อมูลโดยใช้ userId เป็นตัวเชื่อม
    const booksWithSeller = books.map((book) => {
      const profile = sellerProfiles.find(
        (p) => String(p.userId) === String(book.sellerId),
      );

      return {
        ...book,
        // ใช้ fullName จาก seller_profiles ถ้าไม่มีให้ใช้ "Unknown Seller"
        sellerName: profile?.fullName || "Unknown Seller",
      };
    });

    return Response.json({
      success: true,
      data: booksWithSeller,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
