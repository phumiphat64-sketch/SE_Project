"use client";
import { useEffect, useState } from "react";
import styles from "./buyer.module.css";

export default function BuyerPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    setMounted(true);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!mounted) return null;
  if (!user) return null;

  const orders = [
    { id: 1, status: "pending", price: 180 },
    { id: 2, status: "paid", price: 170 },
    { id: 3, status: "shipped", price: 200 },
    { id: 4, status: "completed", price: 210 },
    { id: 5, status: "cancelled", price: 150 },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>Hi {user.name} !</div>

      <div className={styles.sectionTitle}>Recently added books</div>

      <div className={styles.booksRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.bookCard}></div>
        ))}
      </div>

      <div className={styles.ordersHeader}>
        <div className={styles.sectionTitle}>Recent orders</div>
        <div className={styles.viewAll}>View All →</div>
      </div>

      {orders.map((order) => (
        <div
          key={order.id}
          className={styles.orderCard}
          onClick={() =>
            setOpenOrderId(openOrderId === order.id ? null : order.id)
          }
        >
          {/* ===== ข้อมูลหลัก ===== */}
          <div className={styles.orderInfo}>
            <p className={styles.orderNumber}>Order #zzz-zzzzzz-zzzz</p>
            <p>Book name</p>
            <p>by author</p>
            <p>Quantity : 1</p>
            <p>Seller name</p>
          </div>

          <div className={styles.orderRight}>
            <span className={`${styles.status} ${styles[order.status]}`}>
              {order.status}
            </span>
            <div className={styles.price}>฿ {order.price}.00</div>
          </div>

          {/* ===== ส่วนที่โผล่ตอนคลิกบล็อก ===== */}
          {openOrderId === order.id && (
            <div className={styles.expandedSection}>
              <div className={styles.expandedButtons}>
                <button
                  type="button"
                  className={styles.cancelLarge}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Cancel clicked");
                  }}
                >
                  Cancel Order
                </button>

                <button
                  type="button"
                  className={styles.payLarge}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Make Payment clicked");
                  }}
                >
                  Make Payment
                </button>
              </div>

              <div
                className={styles.viewDetails}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("View Order Details clicked");
                }}
              >
                View Order Details
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
