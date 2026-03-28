import { getClient } from "@/infrastructure/database/mongoDB";

export async function GET() {
  try {
    const client = await getClient();
    const db = client.db("DB_Server");

    const books = await db
      .collection("books")
      .find({ status: "Published" }) // ✅ เอาทุกคน
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
