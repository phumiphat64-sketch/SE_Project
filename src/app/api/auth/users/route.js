import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";

export async function GET() {
  try {
    const client = await getClient();
    const db = client.db("DB_Server");

    const users = await db.collection("users").find({}).toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
