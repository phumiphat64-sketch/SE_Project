// infrastructure/database/mongoDB.js
// Singleton Pattern - Mongo Native Driver (Docker-safe)

import { MongoClient } from "mongodb";

let client;
let clientPromise;

export async function getClient() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  return clientPromise;
}
