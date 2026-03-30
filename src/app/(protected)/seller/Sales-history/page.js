"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Caveat, Afacad } from "next/font/google";
import styles from "./Sh.module.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sales = [
  {
    date: "18 Feb 2026",
    book: "Atomic Habits",
    buyer: "Emma",
    amount: 200,
    orderNumber: "#zzz-zzzzzz-0001",
    status: "Completed",
  },
  {
    date: "17 Feb 2026",
    book: "Harry Potter and the Philosopher's Stone",
    buyer: "Sharron",
    amount: 180,
    orderNumber: "#zzz-zzzzzz-0002",
    status: "Canceled",
  },
  {
    date: "16 Feb 2026",
    book: "The Alchemist",
    buyer: "Michael",
    amount: 250,
    orderNumber: "#zzz-zzzzzz-0003",
    status: "Pending",
  },
];

const ITEMS_PER_PAGE = 10;

export default function SalesHistoryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredSales = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return sales;

    return sales.filter((item) =>
      [
        item.date,
        item.book,
        item.buyer,
        item.orderNumber,
        item.status,
        item.amount.toFixed(2),
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSales.length / ITEMS_PER_PAGE),
  );

  const paginatedSales = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredSales.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSales, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const getStatusClass = (status) => {
    if (status === "Completed") return styles.completed;
    if (status === "Canceled") return styles.canceled;
    if (status === "Pending") return styles.pending;
    return "";
  };

  return (
    <main className={`${afacad.className} ${styles.page}`}>
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={`${caveat.className} ${styles.logo}`}>ReRead</div>
        </div>
      </header>

      <div className={styles.backBar}>
        <div className={styles.backBarInner}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/seller/Wallet")}
          >
            ← Back To Wallet
          </button>
        </div>
      </div>

      <section className={styles.frame}>
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Sales History</h1>

          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Book</th>
                  <th className={styles.th}>Buyer</th>
                  <th className={styles.th}>Amount</th>
                  <th className={styles.th}>Order</th>
                  <th className={`${styles.th} ${styles.noBorder}`}>Status</th>
                </tr>
              </thead>

              <tbody>
                {paginatedSales.length > 0 ? (
                  paginatedSales.map((item, i) => (
                    <tr key={i}>
                      <td className={styles.td}>{item.date}</td>
                      <td className={styles.td}>{item.book}</td>
                      <td className={styles.td}>{item.buyer}</td>
                      <td className={styles.td}>+฿{item.amount}</td>
                      <td className={styles.td}>{item.orderNumber}</td>
                      <td className={`${styles.td} ${styles.noBorder}`}>
                        <span
                          className={`${styles.badge} ${getStatusClass(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={styles.emptyTd}>
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.paginationRow}>
            <span>
              Page {page} / {totalPages}
            </span>

            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              {"<"}
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              {">"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
