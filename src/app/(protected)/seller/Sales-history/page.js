"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Caveat, Afacad } from "next/font/google";
import styles from "./Sh.module.css";
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

export default function SalesHistoryPage() {
  const router = useRouter();

  // 1. เพิ่ม State สำหรับเก็บข้อมูลและสถานะการโหลด
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // 2. ใช้ useEffect ดึงข้อมูลประวัติการขายเมื่อเปิดหน้า
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));

        // ถ้าไม่มีไอดี user ให้หยุดทำงาน
        if (!user?.id) {
          console.error("User not found in localStorage");
          setIsLoading(false);
          return;
        }

        // ดึงข้อมูลจาก API ประวัติการขาย (อ้างอิงจากหน้า WalletPage เดิมของคุณ)
        const res = await fetch(`/api/auth/salesHistory/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch sales history");

        const data = await res.json();

        // 3. แปลงข้อมูลให้ตรงกับตาราง และเรียงวันที่ล่าสุดขึ้นบน
        const formattedData = data.map((item) => {
          const dateObj = new Date(item.createdAt);

          return {
            date: dateObj.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            book: item.bookName || "-", // ชื่อหนังสือ
            buyer: item.buyer?.name || "-", // ชื่อคนซื้อ
            amount: Number(item.total || 0), // ยอดเงิน
            orderNumber: item.id || item.orderNumber || "-", // หมายเลขคำสั่งซื้อ
            status: "Completed", // สถานะ
            rawDate: dateObj, // เก็บไว้ใช้เรียงลำดับ
          };
        });

        // เรียงลำดับวันที่ (มากไปน้อย = ล่าสุดอยู่บน)
        formattedData.sort((a, b) => b.rawDate - a.rawDate);

        setSales(formattedData);
      } catch (error) {
        console.error("Error fetching sales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  // 4. ระบบค้นหา (Search)
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
  }, [search, sales]); // อย่าลืมใส่ sales เป็น dependency

  // 5. ระบบแบ่งหน้า (Pagination)
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

  return (
    <main className={`${afacad.className} ${styles.page}`}>
      <PageHeader />
      <section className={styles.frame}>
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Sales History</h1>

          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              placeholder="Search by Date, Book or Order number...."
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
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyTd}>
                      Loading history...
                    </td>
                  </tr>
                ) : paginatedSales.length > 0 ? (
                  paginatedSales.map((item, i) => (
                    <tr key={i}>
                      <td className={styles.td}>{item.date}</td>
                      <td className={styles.td}>{item.book}</td>
                      <td className={styles.td}>{item.buyer}</td>
                      <td className={styles.td}>+฿{item.amount.toFixed(2)}</td>
                      <td className={styles.td}>{item.orderNumber}</td>
                      <td className={`${styles.td} ${styles.noBorder}`}>
                        <span className={styles.statusText}>{item.status}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={styles.emptyTd}>
                      No sales records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.paginationRow}>
            <span className={styles.pageText}>
              Page {Math.min(page, totalPages)} of {totalPages}
            </span>

            <div className={styles.paginationButtons}>
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
        </div>
      </section>
    </main>
  );
}
