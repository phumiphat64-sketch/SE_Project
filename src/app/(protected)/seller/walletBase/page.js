"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Caveat, Afacad } from "next/font/google";
import { useEffect, useState } from "react";
import "./wb.css"; 

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


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
  }, []);

  return (
    <main className={`${afacad.className} page`}>
      <div className="frame">
        <section className="content">
          <h1 className="pageTitle">Wallet</h1>

          <section className="balanceCard">
            <div className="balanceHeader">Available Balance</div>

            <div className="balanceBody">
              <div className="balanceAmount">
                ฿ {walletData?.availableBalance?.toFixed(2) || "0.00"}
              </div>
              <div className="balanceSubtext">Balance available for payout</div>

              <button
                className="requestButton"
                onClick={() => router.push("/seller/wallet")}
              >
                Request Payout
              </button>
            </div>
          </section>

          <section className="section">
            <h2 className="sectionTitle">Earnings Summary</h2>

            <div className="summaryRow">
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

          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">Payout History</h2>
              <button
                className="viewAll"
                onClick={() => router.push("/seller/Payout-history")}
              >
                View All <span className="viewArrow">→</span>
              </button>
            </div>

            <div className="tableCard">
              <table className="table">
                <thead>
                  <tr>
                    <th className="th">Date</th>
                    <th className="th">Payment Method</th>
                    <th className="th">Amount</th>
                    <th className="th">Transaction ID</th>
                    <th className="th noBorder">Status</th>
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

          <section className="section">
            <div className="sectionHeader">
              <h2 className="sectionTitle">Sales History</h2>
              <button
                className="viewAll"
                onClick={() => router.push("/seller/Sales-history")}
              >
                View All <span className="viewArrow">→</span>
              </button>
            </div>

            <div className="tableCard">
              <table className="table">
                <thead>
                  <tr>
                    <th className="th">Date</th>
                    <th className="th">Book</th>
                    <th className="th">Buyer</th>
                    <th className="th">Amount</th>
                    <th className="th">Order Number</th>
                    <th className="th noBorder">Status</th>
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
    <div className="summaryBox">
      <div className="summaryTitle">{title}</div>
      <div className="summaryValue">{value}</div>
    </div>
  );
}
