"use client";

import { useMemo, useState } from "react";
import styles from "./Pm.module.css";

export default function PaymentManagementPage() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      seller: "Daenerys Targaryen",
      amount: 1000,
      method: "Krung Thai Bank (KTB)",
      date: "6 Mar 2026",
      status: "Pending",
    },
    {
      id: 2,
      seller: "Ada Wong",
      amount: 2000,
      method: "Kasikornbank (KBANK)",
      date: "1 Mar 2026",
      status: "Transferred",
    },
    {
      id: 3,
      seller: "Ada Wong",
      amount: 10000,
      method: "Kasikornbank (KBANK)",
      date: "1 Mar 2026",
      status: "Rejected",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch = p.seller.toLowerCase().includes(search.toLowerCase());

      const matchStatus = !statusFilter || p.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [payments, search, statusFilter]);

  return (
    <main className={styles.page}>
      <div className={styles.subBar} />

      <section className={styles.container}>
        <h1 className={styles.pageTitle}>Payment management</h1>

        {/* SEARCH */}
        <div className={styles.searchWrapper}>
          <input
            className={styles.searchInput}
            placeholder="Search by Seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTER */}
        <div className={styles.filterRow}>
          <select
            className={styles.dropdown}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="Transferred">Transferred</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* TABLE */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Seller</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.seller}</td>
                  <td>฿{p.amount}</td>
                  <td>{p.method}</td>
                  <td>{p.date}</td>

                  <td>
                    <span
                      className={`${styles.statusText} ${
                        p.status === "Pending"
                          ? styles.pending
                          : p.status === "Transferred"
                            ? styles.complete
                            : styles.cancel
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className={styles.actionCell}>
                    <span
                      className={styles.detailBtn}
                      onClick={() => {
                        setSelectedPayment(p); // ✅ เอาข้อมูล row นั้น
                        setIsDetailOpen(true);
                      }}
                    >
                      Details
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isDetailOpen && selectedPayment && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              {/* HEADER */}
              <div className={styles.modalHeader}>
                <h2>Payment Details</h2>
              </div>

              <button
                className={styles.closeBtn}
                onClick={() => setIsDetailOpen(false)}
              >
                <img src="/cross.png" alt="close" />
              </button>

              {/* PROFILE */}
              <div className={styles.sectionHeader}>
                <span>Profile</span>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.avatarBox}>
                  <img
                    src={selectedPayment.avatar || "/boy.png"}
                    alt="profile"
                  />
                </div>

                <div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Name:</label>
                      <input value={selectedPayment.seller} readOnly />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Role:</label>
                      <input value="Seller" readOnly />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Phone Number:</label>
                      <input value="012 123 1234" readOnly />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Status:</label>

                      <span
                        className={`${styles.statusText} ${
                          selectedPayment.status === "Pending"
                            ? styles.pending
                            : selectedPayment.status === "Transferred"
                              ? styles.complete
                              : styles.cancel
                        }`}
                      >
                        {selectedPayment.status}
                      </span>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Email:</label>
                      <input value="mock@gmail.com" readOnly />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Date:</label>
                      <input value={selectedPayment.date} readOnly />
                    </div>
                  </div>
                </div>
              </div>

              {/* BANK */}
              <div className={styles.sectionHeader}>
                <span>Bank Account Information</span>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Bank Name:</label>
                  <input value={selectedPayment.method} readOnly />
                </div>

                <div className={styles.formGroup}>
                  <label>Account Name:</label>
                  <input value={selectedPayment.seller} readOnly />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Account Number:</label>
                  <input value="222-22222-22" readOnly />
                </div>
              </div>

              {/* AMOUNT */}
              <div className={styles.divider}></div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Amount:</label>
                  <div className={styles.amountText}>
                    ฿{selectedPayment.amount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* ACTION */}
              <div className={styles.modalActions}>
                <button
                  className={styles.cancelBtn}
                  disabled={selectedPayment.status !== "Pending"}
                  onClick={() => {
                    // ✅ อนุญาตเฉพาะ Pending
                    if (selectedPayment.status !== "Pending") return;

                    // ✅ update table
                    setPayments((prev) =>
                      prev.map((p) =>
                        p.id === selectedPayment.id
                          ? { ...p, status: "Rejected" }
                          : p,
                      ),
                    );

                    // ✅ update modal
                    setSelectedPayment((prev) => ({
                      ...prev,
                      status: "Rejected",
                    }));
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGINATION MOCK */}
        <div className={styles.paginationRow}>
          <span>Page 1 of 1</span>
          <button className={styles.pageButton}>{"<"}</button>
          <button className={styles.pageButton}>{">"}</button>
        </div>
      </section>
    </main>
  );
}
