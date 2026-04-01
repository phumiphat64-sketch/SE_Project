// Repository Pattern
import { getClient } from "../database/mongoDB";
import UserRepository from "@/domain/repositories/user.repository.interface";
import { ObjectId } from "mongodb";

export default class MongoUserRepository extends UserRepository {
  // สร้าง Private Method เพื่อลดความซ้ำซ้อนของการเรียก Database
  async #getDb() {
    const client = await getClient();
    return client.db(process.env.MONGODB_DB);
  }

  async create(user) {
    const db = await this.#getDb();
    return db.collection("users").insertOne(user);
  }

  async findByEmail(email) {
    const db = await this.#getDb();
    return db.collection("users").findOne({ email });
  }

  async update(id, data) {
    try {
      const db = await this.#getDb();

      const result = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: data },
          { returnDocument: "after" },
        );

      // รองรับ MongoDB Driver ทั้งเวอร์ชันเก่า (result.value) และใหม่ (result ตัวมันเอง)
      return result?.value || result;
    } catch (error) {
      console.error("MongoDB Update Error:", error);
      return null;
    }
  }
}
