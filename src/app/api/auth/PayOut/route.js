import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";

export async function POST(req) {
  const body = await req.json();
  const { sellerId, amount } = body;

  const client = await getClient();
  const db = client.db("DB_Server");

  // 🔥 คำนวณ balance ก่อน
  const orders = await db
    .collection("orders")
    .find({
      sellerId,
      status: "Paid",
    })
    .toArray();

  const payouts = await db
    .collection("payouts")
    .find({
      sellerId,
    })
    .toArray();

  const income = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const expense = payouts.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const balance = income - expense;

  // ❗ กันถอนเกิน
  if (amount > balance) {
    return NextResponse.json({ message: "เงินไม่พอ" }, { status: 400 });
  }

  // ✅ บันทึกการถอน
  await db.collection("payouts").insertOne({
    sellerId,
    amount,
    createdAt: new Date(),
  });

  return NextResponse.json({ message: "ถอนสำเร็จ" });
}
