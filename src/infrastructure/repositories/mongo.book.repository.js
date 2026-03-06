import { getClient } from "@/infrastructure/database/mongoDB";
import crypto from "crypto";

function generateBookId() {
  return "BK-" + crypto.randomBytes(3).toString("hex").toUpperCase();
}

export default class MongoBookRepository {
  async addBook(book) {
    const client = await getClient();
    const db = client.db("DB_Server");

    return await db.collection("books").insertOne({
      ...book,
      bookId: generateBookId(),
    });
  }
}
