"use client";

import styles from "./home.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crimson_Text, Caveat, Afacad, IBM_Plex_Mono } from "next/font/google";
import { useEffect, useState } from "react";

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
  const [ordersData, setOrdersData] = useState([]);
  const [booksData, setBooksData] = useState([]);

  console.log("ORDERS:", ordersData);
  console.log("BOOKS:", booksData);

  const sellerBookIds = booksData.map((b) => String(b._id));

  // 2. filter order ให้เหลือของเรา
  const sellerOrders = ordersData.filter((order) =>
    sellerBookIds.includes(String(order.bookId)),
  );

  // 3. debug
  console.log("SELLER ORDERS:", sellerOrders);

  const pendingCount = sellerOrders.filter(
    (o) => o.status === "Pending",
  ).length;

  const cancelCount = sellerOrders.filter(
    (o) => o.status === "Cancelled",
  ).length;

  const toShipCount = sellerOrders.filter((o) => o.status === "Paid").length;

  const outOfStockCount = booksData.filter((b) => b.stock === 0).length;

  const inTransitCount = sellerOrders.filter(
    (o) => o.status === "In Transit",
  ).length;

  // 🔥 แปลง status ให้ตรง UI
  const formatStatus = (status) => {
    switch (status) {
      case "Pending":
        return "Pending";
      case "Paid":
        return "To Ship";
      case "Shipped":
        return "In Transit";
      case "Completed":
        return "Completed";
      case "Canceled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const stats = [
    { icon: "/icons/ew.svg", number: pendingCount, label: "Pending Payment" },
    { icon: "/icons/3dc.svg", number: toShipCount, label: "To Ship" },
    { icon: "/icons/tf.svg", number: inTransitCount, label: "In Transit" },
    { icon: "/icons/br.svg", number: cancelCount, label: "Cancel Items" },
    { icon: "/icons/mq.svg", number: 0, label: "Restricted Items" },
    { icon: "/icons/bk.svg", number: outOfStockCount, label: "Out of Stock" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const ordersRes = await fetch("/api/auth/orders");
        const booksRes = await fetch("/api/auth/books");

        const ordersJson = await ordersRes.json();
        const booksJson = await booksRes.json();

        setOrdersData(ordersJson.data || []);
        setBooksData(booksJson.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

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
        <Link href="/seller/orders">View All →</Link>
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
            {sellerOrders.slice(0, 10).map((o, i) => (
              <tr key={i}>
                <td>{o.id}</td>
                <td>{o.bookName}</td>
                <td>{o.buyerName || "Unknown"}</td>
                <td>
                  <span
                    className={`${styles.status} ${styles[formatStatus(o.status).replace(" ", "")]}`}
                  >
                    {formatStatus(o.status)}
                  </span>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>›</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
