"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Caveat, Afacad } from "next/font/google";
import PageHeader from "@/app/components/BackforWallet";
import { useEffect } from "react";
import "./request-payout.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
    console.log("USER:", user);

    if (!user?.id) {
      console.log("NO USER ID ❌");
      return;
    }

    console.log("HAS USER ID ✅");

    const sellerId = user.id;

    console.log("FETCHING WALLET...");

    fetch(`/api/auth/walletSeller/${sellerId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("WALLET:", data);
        setWallet(data);
      });

    console.log("FETCHING SELLER PROFILE...");
    fetch(`/api/auth/seller/profile?userId=${sellerId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("SELLER PROFILE:", data);
        setBankAccount(data);
      });
  }, []);

  const payoutAmount = useMemo(() => {
    const cleaned = amountInput.replace(/,/g, "").trim();
    if (cleaned === "") return 0;
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [amountInput]);

  // Logic สำหรับซ่อนเลขบัญชี (Censor) ให้เหลือแค่ 3 ตัวหน้า กับ 2 ตัวหลัง
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

    // 🔥 refresh หน้า
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
    <main className={`${afacad.className} page`}>
      <PageHeader />

      <div className="frame">
        <div className="mainContainer">
          <section className="contentCardStack">
            <h1 className="pageTitle">Request Payout</h1>

            {/* Available Balance */}
            <section className="card">
              <div className="cardHeader">Available Balance</div>
              <div className="cardBody">
                <div className="balanceAmount">
                  ฿ {wallet?.availableBalance?.toFixed(2) || "0.00"}
                </div>
                <div className="balanceSubtext">
                  Balance available for payout
                </div>
              </div>
            </section>

            {/* Payout Amount */}
            <section className="card">
              <div className="cardHeader">Payout Amount</div>
              <div className="cardBody">
                <div className="amountRow">
                  <div className={`amountInputWrap ${hasError ? "error" : ""}`}>
                    <div className="currencyBox">฿</div>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={amountInput}
                      onChange={handleAmountChange}
                      placeholder="100.00"
                      className={`amountInput ${hasError ? "error" : ""}`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePayoutAll}
                    className="payoutAllButton"
                  >
                    Payout All
                  </button>
                </div>

                <div className="helperText">{helperText}</div>
              </div>
            </section>

            {/* Bank */}
            <section className="card">
              <div className="cardHeader">Bank Account</div>

              <div>
                <div className="bankTopRow">
                  <div className="bankLogoBox">
                    <img
                      src={getBankLogo(bankAccount?.bankName)}
                      className="bankLogoImage"
                    />
                  </div>

                  <div>
                    <div className="bankName">
                      {bankAccount?.bankName || "-"}
                    </div>

                    <div className="bankMeta">
                      Account Name: {bankAccount?.accountName || "-"}
                    </div>
                  </div>
                </div>

                {/* ของเดิมที่เป็น bankAccount?.accountNumber ให้เปลี่ยนมาเรียกใช้ตัวแปรใหม่ */}
                <div className="bankBottomRow">
                  <span className="bankNumberLabel">Account Number:</span>{" "}
                  <span className="bankNumberValue">{maskedAccountNumber}</span>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="card">
              <div className="cardHeader">Summary</div>

              <div className="summaryBody">
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
                  className={`confirmButton ${hasError ? "disabled" : ""}`}
                >
                  Confirm Payout
                </button>

                <div className="summaryNote">
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
    <div className={`summaryRow ${noBorder ? "noBorder" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
