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

  // =========================
  // ✅ สุ่ม transactionId
  // =========================
  const random = Math.floor(1000 + Math.random() * 9000);
  const transactionId = `WD-${random}`;

  // =========================
  // ✅ สุ่ม status + วัน
  // =========================
  const isPending = Math.random() < 0.5;

  let status = "Success";
  let completeAt = new Date();

  if (isPending) {
    status = "Pending";

    const days = Math.floor(Math.random() * 3) + 1;
    completeAt = new Date();
    completeAt.setDate(completeAt.getDate() + days);
  }

  // =========================
  // ✅ ดึงข้อมูลธนาคาร
  // =========================
  const sellerProfile = await db.collection("seller_profiles").findOne({
    userId: sellerId,
  });

  // =========================
  // ✅ บันทึก payout
  // =========================
  await db.collection("payouts").insertOne({
    sellerId,
    amount: Number(amount),
    transactionId,
    status,
    createdAt: new Date(),
    completeAt,

    bankName: sellerProfile?.bankName || "",
    accountName: sellerProfile?.accountName || "",
    accountNumber: sellerProfile?.accountNumber || "",
  });

  return NextResponse.json({ message: "ถอนสำเร็จ" });
}
