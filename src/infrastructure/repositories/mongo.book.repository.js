import { getClient } from "@/infrastructure/database/mongoDB";
import { ObjectId } from "mongodb";
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

  async findById(id) {
    const client = await getClient();
    const db = client.db("DB_Server");

    const book = await db.collection("books").findOne({
      _id: new ObjectId(id),
    });

    return book;
  }

  async update(id, data) {
    const client = await getClient();
    const db = client.db("DB_Server");

    await db
      .collection("books")
      .updateOne({ _id: new ObjectId(id) }, { $set: data });

    return await db.collection("books").findOne({
      _id: new ObjectId(id),
    });
  }
}
