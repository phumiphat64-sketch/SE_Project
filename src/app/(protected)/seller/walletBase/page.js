"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./wb.module.css";


export default function WalletPage() {
  const router = useRouter();
  const [walletData, setWalletData] = useState(null);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    fetch(`/api/auth/walletSeller/${user.id}`)
      .then((res) => res.json())
      .then((data) => setWalletData(data));

    fetch(`/api/auth/payoutHistory/${user.id}`)
      .then((res) => res.json())
      .then((data) => setPayoutHistory(data));

    fetch(`/api/auth/salesHistory/${user.id}`)
      .then((res) => res.json())
      .then((data) => setSalesHistory(data));
  }, [router]);

  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        <section className={styles.content}>
          <h1 className={styles.pageTitle}>Wallet</h1>

          <section className={styles.balanceCard}>
            <div className={styles.balanceHeader}>Available Balance</div>

            <div className={styles.balanceBody}>
              <div className={styles.balanceAmount}>
                ฿ {walletData?.availableBalance?.toFixed(2) || "0.00"}
              </div>
              <div className={styles.balanceSubtext}>Balance available for payout</div>

              <button
                className={styles.requestButton}
                onClick={() => router.push("/seller/wallet")}
              >
                Request Payout
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Earnings Summary</h2>

            <div className={styles.summaryRow}>
              <SummaryBox
                title="Total Earnings"
                value={`฿ ${(walletData?.totalEarnings || 0).toFixed(2)}`}
              />

              <SummaryBox
                title="Available Balance"
                value={`฿ ${(walletData?.availableBalance || 0).toFixed(2)}`}
              />

              <SummaryBox
                title="Total Payouts"
                value={`฿ ${(walletData?.totalPayouts || 0).toFixed(2)}`}
              />
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Payout History</h2>
              <button
                className={styles.viewAll}
                onClick={() => router.push("/seller/Payout-history")}
              >
                View All <span className={styles.viewArrow}>→</span>
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Date</th>
                    <th className={styles.th}>Payment Method</th>
                    <th className={styles.th}>Amount</th>
                    <th className={styles.th}>Transaction ID</th>
                    <th className={styles.th + " " + styles.noBorder}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutHistory.map((item, index) => (
                    <tr key={index}>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>
                        {item.bankName ? item.bankName.split("(")[0] : "Bank"}
                      </td>
                      <td>-฿{item.amount.toFixed(2)}</td>
                      <td>{item.transactionId}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Sales History</h2>
              <button
                className={styles.viewAll}
                onClick={() => router.push("/seller/Sales-history")}
              >
                View All <span className={styles.viewArrow}>→</span>
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Date</th>
                    <th className={styles.th}>Book</th>
                    <th className={styles.th}>Buyer</th>
                    <th className={styles.th}>Amount</th>
                    <th className={styles.th}>Order Number</th>
                    <th className={styles.th + " " + styles.noBorder}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salesHistory.map((item, index) => (
                    <tr key={index}>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>{item.bookName}</td>
                      <td>{item.buyer?.name || "-"}</td>
                      <td>+฿{item.total.toFixed(2)}</td>
                      <td>{item.id}</td>
                      <td>Complete</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function SummaryBox({ title, value }) {
  return (
    <div className={styles.summaryBox}>
      <div className={styles.summaryTitle}>{title}</div>
      <div className={styles.summaryValue}>{value}</div>
    </div>
  );
}
