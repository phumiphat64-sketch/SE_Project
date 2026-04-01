import { NextResponse } from "next/server";
import { getClient } from "@/infrastructure/database/mongoDB";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const client = await getClient();
    const db = client.db("DB_Server");

    // เช็คว่ามีการส่ง sellerId มาใน URL ไหม (เช่น /api/auth/PayOut?sellerId=123)
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    // สร้างเงื่อนไขการค้นหา
    const query = {};
    if (sellerId) {
      query.sellerId = sellerId; // ดึงเฉพาะของ seller คนนั้น
    }

    // ดึงข้อมูลจาก collection payouts และเรียงล่าสุดขึ้นบน (createdAt: -1)
    const payouts = await db
      .collection("payouts")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(payouts, { status: 200 });
  } catch (error) {
    console.error("Error fetching payouts:", error);
    return NextResponse.json(
      { message: "ดึงข้อมูลประวัติไม่สำเร็จ" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  const body = await req.json();
  const { sellerId, amount } = body;

  const client = await getClient();
  const db = client.db("DB_Server");

  console.log("sellerId:", sellerId);

  // 🔥 เช็คทั้งหมดใน DB
  const allOrders = await db.collection("orders").find({}).toArray();
  console.log("ALL ORDERS:", allOrders.length);

  // 🔥 เช็คเฉพาะ sellerId
  const debugOrders = await db
    .collection("orders")
    .find({ sellerId })
    .toArray();
  console.log("MATCH ORDERS:", debugOrders.length);

  const orders = await db
    .collection("orders")
    .find({
      sellerId,
      status: { $in: ["Paid", "In Transit", "Delivered"] },
    })
    .toArray();

  const payouts = await db
    .collection("payouts")
    .find({
      sellerId,
      status: { $ne: "Canceled" }, // สมมติว่าไม่เอารายการที่ยกเลิกมาหักลบ
    })
    .toArray();

  const withdrawAmount = Number(amount);

  const income = orders.reduce((sum, o) => {
    const value = o.total ?? o.subtotal ?? 0;
    return sum + Number(value);
  }, 0);

  const expense = payouts.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const balance = income - expense;

  console.log({ income, expense, balance, withdrawAmount });

  if (withdrawAmount > balance) {
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
