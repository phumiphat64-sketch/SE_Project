"use client";

import styles from "./home.module.css";
import Link from "next/link";

export default function SellerHome() {
  const stats = [
    { icon: "🚚", number: 3, label: "Pending Payment" },
    { icon: "📦", number: 5, label: "To Ship" },
    { icon: "🚛", number: 2, label: "In Transit" },
    { icon: "📦", number: 1, label: "Cancel Items" },
    { icon: "❓", number: 0, label: "Restricted Items" },
    { icon: "📚", number: 4, label: "Out of Stock" },
  ];

  const orders = [
    {
      id: "#zz-zzzzz-zzz",
      book: "book name",
      buyer: "Buyername",
      status: "Pending",
      date: "20/02/2026",
    },
    {
      id: "#zz-zzzzz-zzz",
      book: "book name",
      buyer: "Buyername",
      status: "To Ship",
      date: "20/02/2026",
    },
    {
      id: "#zz-zzzzz-zzz",
      book: "book name",
      buyer: "Buyername",
      status: "In Transit",
      date: "20/02/2026",
    },
    {
      id: "#zz-zzzzz-zzz",
      book: "book name",
      buyer: "Buyername",
      status: "To Ship",
      date: "20/02/2026",
    },
    {
      id: "#zz-zzzzz-zzz",
      book: "book name",
      buyer: "Buyername",
      status: "Pending",
      date: "20/02/2026",
    },
    {
      id: "#zz-zzzzz-zzz",
      book: "book name",
      buyer: "Buyername",
      status: "Cancelled",
      date: "20/02/2026",
    },
    {
      id: "#zz-zzzzz-zzz",
      book: "book name",
      buyer: "Buyername",
      status: "Completed",
      date: "20/02/2026",
    },
  ];

  return (
    <div className={styles.container}>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1>ReRead Resell Relove.</h1>
          <p>Give Your Books a Second Life.</p>

          <button className={styles.addBtn}>+ Add New Book</button>
        </div>

        <img src="/books.png" className={styles.heroImage} />
      </div>

      {/* DASHBOARD */}
      <h2 className={styles.sectionTitle}>Seller Dashboard</h2>

      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div>
              <h3>{s.number}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ORDERS */}
      <div className={styles.ordersHeader}>
        <h2>Recent Orders</h2>
        <Link href="#">View All →</Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Book Name</th>
              <th>Buyer</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o, i) => (
              <tr key={i}>
                <td>{o.id}</td>
                <td>{o.book}</td>
                <td>{o.buyer}</td>
                <td>
                  <span
                    className={`${styles.status} ${styles[o.status.replace(" ", "")]}`}
                  >
                    {o.status}
                  </span>
                </td>
                <td>{o.date}</td>
                <td>›</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
