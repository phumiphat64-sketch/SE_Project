"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Caveat, Afacad } from "next/font/google";
import styles from "./oD.module.css";
import BacktoOrder from "@/app/components/BacktoOrder";
// 🔥 1. import Suspense เพิ่มเข้ามา
import { useEffect, useState, Suspense } from "react";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// 🔥 2. เปลี่ยนชื่อฟังก์ชันเดิมเป็น Component ย่อย (เช่น OrderDetailContent)
function OrderDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("id");
  const [book, setBook] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const ordersRes = await fetch("/api/auth/orders");
        const booksRes = await fetch("/api/auth/books");

        const ordersData = await ordersRes.json();
        const booksData = await booksRes.json();

        const foundOrder = ordersData.data.find(
          (o) => String(o._id) === String(orderId),
        );

        setOrder(foundOrder);

        if (!foundOrder) return;

        const foundBook = booksData.data.find(
          (b) => String(b._id) === String(foundOrder.bookId),
        );

        setBook(foundBook);
      } catch (err) {
        console.error(err);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const handleAddTracking = () => {
    router.push("/seller/addTracking");
  };

  if (!order || !orderId) {
    return <div>Loading...</div>;
  }

  return (
    <main className={`${afacad.className} ${styles.page}`}>
      <BacktoOrder />
      <section className={styles.content}>
        <h2 className={styles.title}>Order Detail</h2>

        <div className={styles.cardsWrapper}>
          <div className={styles.cardsRow}>
            {/* --- Order Info --- */}
            <div className={styles.infoCard}>
              <div className={styles.infoTop}>
                <h3 className={styles.cardTitle}>Order Information</h3>

                <div className={styles.infoLine}>
                  <b>Order:</b> {order.id}
                </div>
                <div className={styles.infoLine}>
                  <b>Payment:</b> {order.paymentMethod}
                </div>
                <div className={styles.infoLine}>
                  <b>Status:</b>{" "}
                  <span className={styles.toShipBadge}>To Ship</span>
                </div>
              </div>

              <div className={styles.infoBottom}>
                <button
                  className={styles.trackButton}
                  onClick={handleAddTracking}
                >
                  Add Tracking
                </button>
              </div>
            </div>

            {/* --- Product Card --- */}
            <div className={styles.productCard}>
              <div className={styles.productHeader}>
                <div>
                  <div className={styles.productOrderId}>Order {order.id}</div>
                  <div className={styles.placedDate}>Placed on 20/3/2026</div>
                </div>
              </div>

              <div className={styles.productBody}>
                <img
                  src={book?.images?.[0] || "/placeholder.png"}
                  className={styles.bookThumb}
                />

                <div>
                  <div className={styles.bookName}>{order.bookName}</div>
                  <div className={styles.byAuthor}>by {order.author}</div>
                  <div className={styles.buyerName}>{order.buyerName}</div>
                </div>
              </div>

              <div className={styles.priceSection}>
                <div className={styles.priceBox}>
                  <div>฿{order.price}</div>
                  <div className={styles.qtyText}>
                    Quantity: {order.quantity}
                  </div>
                </div>
              </div>

              <div className={styles.totalRow}>Total: ฿{order.total}</div>
            </div>

            {/* --- Address Card --- */}
            <div className={styles.addressCard}>
              <h3 className={styles.cardTitle}>Shipping Address</h3>

              <div className={styles.addressSection}>
                {order.address?.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>

              <div className={styles.buyerSection}>
                <h4 className={styles.cardTitle}>Buyer</h4>
                <div>{order.buyerName}</div>
                <div>Tel : {order.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// 🔥 3. สร้าง Component หลัก (export default) แล้วเอา Suspense มาครอบ
export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <OrderDetailContent />
    </Suspense>
  );
}
