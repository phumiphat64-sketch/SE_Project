// Repository Pattern

import clientPromise from "../database/mongoDB";
import UserRepository from "@/domain/repositories/user.repository.interface";

export default class MongoUserRepository extends UserRepository {
  async create(user) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    return db.collection("users").insertOne(user);
  }

  async findByEmail(email) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    return db.collection("users").findOne({ email });
  }
}
