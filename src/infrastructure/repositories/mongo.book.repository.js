import { getClient } from "@/infrastructure/database/mongoDB";

function generateBookId() {
  return "BK-" + Math.floor(100000 + Math.random() * 900000);
}

export default class MongoBookRepository {
  async addBook(book) {
    const client = await getClient();
    const db = client.db("DB_Server");

    return await db.collection("books").insertOne({
      bookId: generateBookId(),
      ...book,
    });
  }
}
