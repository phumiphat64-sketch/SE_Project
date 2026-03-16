// Repository Pattern

import { getClient } from "../database/mongoDB";
import UserRepository from "@/domain/repositories/user.repository.interface";
import { ObjectId } from "mongodb";

export default class MongoUserRepository extends UserRepository {
  async create(user) {
    const client = await getClient();
    const db = client.db(process.env.MONGODB_DB);

    return db.collection("users").insertOne(user);
  }

  async findByEmail(email) {
    const client = await getClient();
    const db = client.db(process.env.MONGODB_DB);

    return db.collection("users").findOne({ email });
  }

  async update(id, data) {
    try {
      const client = await getClient();
      const db = client.db(process.env.MONGODB_DB);

      const result = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: data },
          { returnDocument: "after" },
        );

      // รองรับ MongoDB Driver ทั้งเวอร์ชันเก่า (result.value) และใหม่ (result ตัวมันเอง)
      return result?.value || result?.document || null;
    } catch (error) {
      console.error("MongoDB Update Error:", error);
      return null;
    }
  }
}


