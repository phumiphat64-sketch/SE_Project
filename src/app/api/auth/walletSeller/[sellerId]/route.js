import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";

export async function GET(req, context) {
  const { sellerId } = await context.params;

  const client = await getClient();
  const db = client.db("DB_Server");

  // ✅ เงินเข้า
  const orders = await db
    .collection("orders")
    .find({
      sellerId: sellerId,
      status: "Paid",
    })
    .toArray();

  // 🔥 เพิ่มตรงนี้ (เงินออก)
  const payouts = await db
    .collection("payouts")
    .find({
      sellerId: sellerId,
    })
    .toArray();

  // ✅ รวมเงินเข้า
  const income = orders.reduce((sum, o) => {
    return sum + Number(o.total || 0);
  }, 0);

  // 🔥 รวมเงินออก
  const expense = payouts.reduce((sum, p) => {
    return sum + Number(p.amount || 0);
  }, 0);

  // 🔥 balance จริง
  const balance = income - expense;

  return NextResponse.json({
    availableBalance: balance,
    totalEarnings: income,
    totalPayouts: expense,
  });
}

