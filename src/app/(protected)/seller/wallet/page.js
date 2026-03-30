"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/components/BackforWallet";
import styles from "./request-payout.module.css";

const MIN_PAYOUT = 100;
const TRANSACTION_FEE = 0;

const getBankLogo = (bankName) => {
  if (!bankName) return "/default.png";

  const name = bankName.toLowerCase();

  if (name.includes("bangkok")) return "/Bk.png";
  if (name.includes("krung thai")) return "/Ks.png";
  if (name.includes("kasikorn")) return "/Kb.png";
  if (name.includes("siam")) return "/SCBR.png";

  return "/default.png";
};

export default function RequestPayoutPage() {
  const router = useRouter();
  const [amountInput, setAmountInput] = useState("");
  const [bankAccount, setBankAccount] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    const sellerId = user.id;

    fetch(`/api/auth/walletSeller/${sellerId}`)
      .then((res) => res.json())
      .then(setWallet);

    fetch(`/api/auth/seller/profile?userId=${sellerId}`)
      .then((res) => res.json())
      .then(setBankAccount);
  }, []);

  const payoutAmount = useMemo(() => {
    const cleaned = amountInput.replace(/,/g, "").trim();
    if (cleaned === "") return 0;
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [amountInput]);

  const maskedAccountNumber = useMemo(() => {
    if (!bankAccount?.accountNumber) return "-";
    const visibleStart = bankAccount.accountNumber.slice(0, 3);
    const visibleEnd = bankAccount.accountNumber.slice(-2);
    return `${visibleStart}-XXXXX-${visibleEnd}`;
  }, [bankAccount?.accountNumber]);

  const handlePayout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const sellerId = user.id;

    const res = await fetch("/api/auth/PayOut", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sellerId,
        amount: Number(payoutAmount),
      }),
    });

    const data = await res.json();
    alert(data.message);

    window.location.reload();
  };

  const isEmpty = amountInput.trim() === "";
  const isBelowMinimum = payoutAmount < MIN_PAYOUT;
  const isOverBalance = payoutAmount > (wallet?.availableBalance || 0);
  const hasError = isEmpty || isBelowMinimum || isOverBalance;

  const fee = TRANSACTION_FEE;
  const netAmount = Math.max(payoutAmount - fee, 0);
  const remainingBalance = Math.max(
    (wallet?.availableBalance || 0) - payoutAmount,
    0,
  );

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setAmountInput(value);
    }
  };

  const handlePayoutAll = () => {
    if (wallet?.availableBalance) {
      setAmountInput(wallet.availableBalance.toFixed(2));
    }
  };

  const helperText = isOverBalance
    ? "Amount exceeds available balance"
    : `Minimum payout amount: ฿${MIN_PAYOUT}`;

  return (
    <main className={styles.page}>
      <PageHeader />

      <div className={styles.frame}>
        <div className={styles.mainContainer}>
          <section className={styles.contentCardStack}>
            <h1 className={styles.pageTitle}>Request Payout</h1>

            {/* Available Balance */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>Available Balance</div>
              <div className={styles.cardBody}>
                <div className={styles.balanceAmount}>
                  ฿ {wallet?.availableBalance?.toFixed(2) || "0.00"}
                </div>
                <div className={styles.balanceSubtext}>
                  Balance available for payout
                </div>
              </div>
            </section>

            {/* Payout Amount */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>Payout Amount</div>
              <div className={styles.cardBody}>
                <div className={styles.amountRow}>
                  <div
                    className={`${styles.amountInputWrap} ${
                      hasError ? styles.error : ""
                    }`}
                  >
                    <div className={styles.currencyBox}>฿</div>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={amountInput}
                      onChange={handleAmountChange}
                      placeholder="100.00"
                      className={`${styles.amountInput} ${
                        hasError ? styles.error : ""
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePayoutAll}
                    className={styles.payoutAllButton}
                  >
                    Payout All
                  </button>
                </div>

                <div className={styles.helperText}>{helperText}</div>
              </div>
            </section>

            {/* Bank */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>Bank Account</div>

              <div>
                <div className={styles.bankTopRow}>
                  <div className={styles.bankLogoBox}>
                    <img
                      src={getBankLogo(bankAccount?.bankName)}
                      className={styles.bankLogoImage}
                    />
                  </div>

                  <div>
                    <div className={styles.bankName}>
                      {bankAccount?.bankName || "-"}
                    </div>

                    <div className={styles.bankMeta}>
                      Account Name: {bankAccount?.accountName || "-"}
                    </div>
                  </div>
                </div>

                <div className={styles.bankBottomRow}>
                  <span className={styles.bankNumberLabel}>
                    Account Number:
                  </span>{" "}
                  <span className={styles.bankNumberValue}>
                    {maskedAccountNumber}
                  </span>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>Summary</div>

              <div className={styles.summaryBody}>
                <SummaryRow
                  label="Payout Amount"
                  value={`฿${payoutAmount.toFixed(2)}`}
                />
                <SummaryRow
                  label="Transaction Fee"
                  value={`฿${fee.toFixed(2)}`}
                />
                <SummaryRow
                  label="Net Amount to Receive"
                  value={`฿${netAmount.toFixed(2)}`}
                />
                <SummaryRow
                  label="Remaining Balance"
                  value={`฿${remainingBalance.toFixed(2)}`}
                  noBorder
                />

                <button
                  type="button"
                  onClick={handlePayout}
                  disabled={hasError}
                  className={`${styles.confirmButton} ${
                    hasError ? styles.disabled : ""
                  }`}
                >
                  Confirm Payout
                </button>

                <div className={styles.summaryNote}>
                  Funds will be transferred within 1-3 business days.
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

function SummaryRow({ label, value, noBorder = false }) {
  return (
    <div className={`${styles.summaryRow} ${noBorder ? styles.noBorder : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
