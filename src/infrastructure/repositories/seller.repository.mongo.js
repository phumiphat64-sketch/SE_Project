import { getClient } from "../database/mongoDB";

export default class SellerRepositoryMongo {
  async createSellerProfile(data) {
    const client = await getClient();
    const db = client.db("DB_Server");

    const result = await db.collection("seller_profiles").insertOne(data);

    return result;
  }

  async getSellerByUserId(userId) {
    const client = await getClient();
    const db = client.db("DB_Server");

    return await db.collection("seller_profiles").findOne({ userId });
  }
}
