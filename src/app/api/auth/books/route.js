import BookService from "@/domain/services/book.service";
import MongoBookRepository from "@/infrastructure/repositories/mongo.book.repository";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getClient } from "@/infrastructure/database/mongoDB";

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
    console.log("BOOK SELLER:", books[0]?.sellerId);
    const repo = new MongoBookRepository();
    const service = new BookService(repo);

    // 🔹 เพิ่ม sellerId เข้าไป
    const result = await service.addBook({
      sellerId,
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sellerId = decoded.userId;

    const client = await getClient();
    const db = client.db("DB_Server");

    const books = await db
      .collection("books")
      .find({ sellerId })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      data: books,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
