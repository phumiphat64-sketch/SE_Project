"use client";

import styles from "./orders.module.css";
import { Afacad } from "next/font/google";
import { useEffect, useState } from "react";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function OrdersPage() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
      const data = localStorage.getItem("orders");
      if (data) {
        setOrders(JSON.parse(data));
      }
    }, []);

  return (
    <main className={`${styles.page} ${afacad.className}`}>
      <section className={styles.container}>
        <h2 className={styles.sectionTitle}>My Orders</h2>

        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </section>
    </main>
  );
}

function OrderCard({ order }) {
  const colors = getStatusColors(order.status);

  function formatOrderId(id) {
    const clean = id.replace("#", "");
    return "#" + clean.match(/.{1,3}/g)?.join("-");
  }

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <div>
          <div className={styles.orderId}>{formatOrderId(order.id)}</div>
          <div className={styles.placedOn}>Placed on {order.placedOn}</div>
        </div>

        <div className={styles.badge} style={{ backgroundColor: colors.badge }}>
          {order.status}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.productRow}>
        <div className={styles.productLeft}>
          <img
            src={order.images?.[0] || order.image || "/images/book-cover.png"}
            alt="Book Cover"
            className={styles.bookThumb}
          />

          <div className={styles.bookInfo}>
            <div className={styles.bookName}>{order.bookName}</div>
            <div className={styles.infoText}>{order.author}</div>
            <div className={styles.infoText}>Store: {order.store}</div>
            <div className={styles.infoText}>Status: {order.status}</div>
          </div>
        </div>

        <div className={styles.productRight}>
          <div className={styles.priceText}>฿{order.price.toFixed(2)}</div>
          <div className={styles.qtyText}>Quantity: {order.quantity}</div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottomRow}>
        <div>
          <div className={styles.addressTitle}>Shipping Address</div>

          {order.address.map((line, i) => (
            <div key={i} className={styles.addressText}>
              {line}
            </div>
          ))}
        </div>

        <div className={styles.summaryBlock}>
          <div className={styles.summaryLabel}>Order Summary</div>

          <div className={styles.summaryText}>
            Subtotal: ฿{order.subtotal.toFixed(2)}
          </div>

          <div className={styles.totalText}>
            Total: ฿{order.total.toFixed(2)}
          </div>
        </div>
      </div>
    </article>
  );
}

function getStatusColors(status) {
  switch (status) {
    case "Pending":
      return { badge: "#D9C64C" };
    case "Paid":
      return { badge: "#6D91B9" };
    case "Shipped":
      return { badge: "#D28C59" };
    case "Completed":
      return { badge: "#6A9073" };
    case "Canceled":
      return { badge: "#B35C59" };
    default:
      return { badge: "#999" };
  }
}
