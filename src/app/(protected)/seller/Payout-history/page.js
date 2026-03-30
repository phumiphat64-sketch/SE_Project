"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Caveat, Afacad } from "next/font/google";
import styles from "./pO.module.css";
import PageHeader from "@/app/components/BackforWallet";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ITEMS_PER_PAGE = 10;

export default function PayoutHistoryPage() {
  const router = useRouter();

  // 1. เพิ่ม State สำหรับเก็บข้อมูลที่ดึงมาจาก API
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // เพิ่ม Loading state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // 2. ใช้ useEffect ดึงข้อมูลจาก API เมื่อหน้าโหลด
  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));

        // ถ้าไม่มีข้อมูล user ให้หยุดการทำงาน
        if (!user?.id) {
          console.error("User not found in localStorage");
          setIsLoading(false);
          return;
        }
        // *หมายเหตุ: คุณต้องเปลี่ยน URL "/api/payouts" ให้ตรงกับ API Route ของคุณจริงๆ
        const res = await fetch(`/api/auth/PayOut?sellerId=${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        // 3. แปลงข้อมูลจาก DB ให้ตรงกับที่ UI ต้องการ และจัดเรียงล่าสุดขึ้นบน
        const formattedData = data.map((item) => {
          const dateObj = new Date(item.createdAt);

          return {
            // แปลงวันที่เป็นฟอร์แมต "22 Feb 2026"
            date: dateObj.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            paymentMethod: item.bankName || "Unknown Bank", // แมพ bankName มาเป็น paymentMethod
            amount: item.amount,
            transactionId: item.transactionId,
            status: item.status,
            rawDate: dateObj, // เก็บ object วันที่ไว้สำหรับเรียงลำดับ
          };
        });

        // เรียงลำดับเอาวันที่ล่าสุด (มากสุด) ขึ้นก่อน (Descending)
        formattedData.sort((a, b) => b.rawDate - a.rawDate);

        setPayouts(formattedData);
      } catch (error) {
        console.error("Error fetching payouts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayouts();
  }, []);

  const filteredPayouts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return payouts;

    return payouts.filter((item) =>
      [
        item.date,
        item.paymentMethod,
        item.transactionId,
        item.status,
        item.amount.toFixed(2),
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [search, payouts]); // เพิ่ม payouts เป็น dependency

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayouts.length / ITEMS_PER_PAGE),
  );

  const paginatedPayouts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredPayouts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPayouts, page]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <main className={`${afacad.className} ${styles.page}`}>
      <PageHeader />
      <section className={styles.frame}>
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Payout History</h1>

          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              placeholder="Search by Date...."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Payment Method</th>
                  <th className={styles.th}>Amount</th>
                  <th className={styles.th}>Transaction ID</th>
                  <th className={`${styles.th} ${styles.noBorder}`}>Status</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyTd}>
                      Loading history...
                    </td>
                  </tr>
                ) : paginatedPayouts.length > 0 ? (
                  paginatedPayouts.map((item, i) => (
                    <tr key={`${item.transactionId}-${i}`}>
                      <td className={styles.td}>{item.date}</td>
                      <td className={styles.td}>{item.paymentMethod}</td>
                      <td className={styles.td}>-฿{item.amount.toFixed(2)}</td>
                      <td className={styles.td}>{item.transactionId}</td>
                      <td className={`${styles.td} ${styles.noBorder}`}>
                        {item.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className={styles.emptyTd}>
                      No payout records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className={styles.tableFillSpace} />
          </div>

          <div className={styles.paginationRow}>
            <span className={styles.pageText}>
              Page {Math.min(page, totalPages)} of {totalPages}
            </span>

            <button
              onClick={goPrev}
              disabled={page === 1}
              className={styles.pageButton}
            >
              {"<"}
            </button>

            <button
              onClick={goNext}
              disabled={page === totalPages}
              className={styles.pageButton}
            >
              {">"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
