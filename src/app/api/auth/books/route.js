import BookService from "@/domain/services/book.service";
import MongoBookRepository from "@/infrastructure/repositories/mongo.book.repository";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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
