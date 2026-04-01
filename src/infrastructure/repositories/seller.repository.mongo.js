import { getClient } from "../database/mongoDB";

export default class SellerRepositoryMongo {
  // 🔹 สร้าง Private Method เพื่อลดยอดการเขียนบรรทัดเรียก DB ซ้ำๆ
  async #getDb() {
    const client = await getClient();
    return client.db("DB_Server");
  }

  async createSellerProfile(data) {
    const db = await this.#getDb();
    return await db.collection("seller_profiles").insertOne(data);
  }

  async getSellerByUserId(userId) {
    const db = await this.#getDb();
    return await db.collection("seller_profiles").findOne({ userId });
  }

  async updateSellerByUserId(userId, data) {
    const db = await this.#getDb();
    return await db
      .collection("seller_profiles")
      .updateOne({ userId }, { $set: data });
  }
}
