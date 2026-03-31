import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const client = await getClient();
    const db = client.db("DB_Server");

    const id = req.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    let user = null;

    // ✅ รองรับทั้ง ObjectId และ string
    if (ObjectId.isValid(id)) {
      user = await db.collection("users").findOne({
        _id: new ObjectId(id),
      });
    }

    if (!user) {
      user = await db.collection("users").findOne({
        _id: id,
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // =========================
    // 🔥 HANDLE BANK DATA
    // =========================
    let bankName = "-";
    let accountName = "-";
    let accountNumber = "-";

    if (user.role === "seller") {
      // ⭐ ดึงจาก seller_profiles
      const sellerProfile = await db
        .collection("seller_profiles")
        .findOne({ userId: user._id.toString() });

      if (sellerProfile) {
        bankName = sellerProfile.bankName || "-";
        accountName = sellerProfile.accountName || "-";
        accountNumber = sellerProfile.accountNumber || "-";
      }
    } else {
      // ⭐ buyer → savedCards
      const card = user.savedCards?.[0];
      if (card) {
        bankName = card.bankName || "-";
        accountName = card.accountName || "-";
        accountNumber = card.cardNumber || "-";
      }
    }

    // =========================
    // ✅ RETURN FINAL DATA
    // =========================
    return NextResponse.json({
      ...user,
      bankName,
      accountName,
      accountNumber,
    });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
