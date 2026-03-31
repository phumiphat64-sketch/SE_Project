import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";

export async function GET() {
  try {
    const client = await getClient();
    const db = client.db("DB_Server");

    const books = await db
      .collection("books")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const sellerProfiles = await db
      .collection("seller_profiles")
      .find({})
      .toArray();

    const booksWithSeller = books.map((book) => {
      const profile = sellerProfiles.find(
        (p) => String(p.userId) === String(book.sellerId),
      );

      return {
        ...book,
        sellerName: profile?.fullName || "-",
      };
    });

    return NextResponse.json({
      success: true,
      data: booksWithSeller,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
