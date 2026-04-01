import { getClient } from "@/infrastructure/database/mongoDB";
import { ObjectId } from "mongodb";
import crypto from "crypto";
// Repository Pattern
// Helper function ทำหน้าที่สร้าง Book ID แยกส่วนออกมาถูกต้องแล้วครับ
function generateBookId() {
  return "BK-" + crypto.randomBytes(3).toString("hex").toUpperCase();
}

export default class MongoBookRepository {
  // 🔹 สร้าง Private Method เพื่อลดความซ้ำซ้อน
  async #getDb() {
    const client = await getClient();
    return client.db("DB_Server");
  }

  async addBook(book) {
    const db = await this.#getDb();

    return await db.collection("books").insertOne({
      ...book,
      bookId: generateBookId(),
    });
  }

  async findById(id) {
    const db = await this.#getDb();

    const book = await db.collection("books").findOne({
      _id: new ObjectId(id),
    });

    return book;
  }

  async update(id, data) {
    const db = await this.#getDb();

    const updateData = { ...data };

    delete updateData._id;
    delete updateData.sellerId;
    delete updateData.bookId;

    await db
      .collection("books")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return await db.collection("books").findOne({
      _id: new ObjectId(id),
    });
  }
}
