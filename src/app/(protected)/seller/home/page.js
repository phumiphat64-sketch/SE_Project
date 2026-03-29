"use client";

import styles from "./home.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crimson_Text, Caveat, Afacad, IBM_Plex_Mono } from "next/font/google";

export const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

export default function SellerHome() {
  const router = useRouter();
  const stats = [
    { icon: "/icons/ew.svg", number: 3, label: "Pending Payment" },
    { icon: "/icons/3dc.svg", number: 5, label: "To Ship" },
    { icon: "/icons/tf.svg", number: 2, label: "In Transit" },
    { icon: "/icons/br.svg", number: 1, label: "Cancel Items" },
    { icon: "/icons/mq.svg", number: 0, label: "Restricted Items" },
    { icon: "/icons/bk.svg", number: 4, label: "Out of Stock" },
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

  const handleAddBook = () => {
    router.push("/seller/addbooks");
  };

  return (
    <div className={`${styles.container} ${afacad.className}`}>
      {/* HERO */}
      <div className={`${styles.hero} ${styles.heroFull}`}>
        <div className={styles.heroText}>
          <h1 className={crimson.className}>ReRead Resell Relove.</h1>
          <p className={crimson.className}>Give Your Books a Second Life.</p>

          <button
            className={`${styles.addBtn} ${afacad.className}`}
            onClick={handleAddBook}
          >
            + Add New Book
          </button>
        </div>

        {/* เว้นให้คุณใส่รูปเอง */}
        <div className={styles.heroImageWrapper}>
          <img src="/Group 53.svg" className={styles.heroImage} />
        </div>
      </div>

      {/* DASHBOARD */}
      <h2 className={styles.sectionTitle}>Seller Dashboard</h2>

      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.statIcon}>
                <img src={s.icon} alt="icon" />
              </div>
              <h3>{s.number}</h3>
            </div>

            <p className={styles.statLabel}>{s.label}</p>
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
