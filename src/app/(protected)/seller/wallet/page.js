"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Caveat, Afacad } from "next/font/google";
import PageHeader from "@/app/components/BackforWallet";
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

const wallet = {
  availableBalance: 2450,
};

const bankAccount = {
  bankName: "Krung Thai Bank",
  accountName: "Daenerys Targaryen",
  accountNumber: "222-XXXXX-22",
};

export default function RequestPayoutPage() {
  const router = useRouter();
  const [amountInput, setAmountInput] = useState("99.00");

  const payoutAmount = useMemo(() => {
    const cleaned = amountInput.replace(/,/g, "").trim();
    if (cleaned === "") return 0;
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [amountInput]);

  const isEmpty = amountInput.trim() === "";
  const isBelowMinimum = payoutAmount < MIN_PAYOUT;
  const isOverBalance = payoutAmount > wallet.availableBalance;
  const hasError = isEmpty || isBelowMinimum || isOverBalance;

  const fee = TRANSACTION_FEE;
  const netAmount = Math.max(payoutAmount - fee, 0);
  const remainingBalance = Math.max(wallet.availableBalance - payoutAmount, 0);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setAmountInput(value);
    }
  };

  const handlePayoutAll = () => {
    setAmountInput(wallet.availableBalance.toFixed(2));
  };

  const helperText = isOverBalance
    ? "Amount exceeds available balance"
    : `Minimum payout amount: ฿${MIN_PAYOUT}`;

  return (
    <main className={`${afacad.className} page`}>
      <PageHeader/>

      <div className="frame">
        <div className="mainContainer">
          <section className="contentCardStack">
            <h1 className="pageTitle">Request Payout</h1>

            {/* Available Balance */}
            <section className="card">
              <div className="cardHeader">Available Balance</div>
              <div className="cardBody">
                <div className="balanceAmount">
                  ฿ {wallet.availableBalance.toFixed(2)}
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
                      placeholder="0.00"
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
                      src="/Ks.png"
                      alt="Krungthai Bank"
                      className="bankLogoImage"
                    />
                  </div>

                  <div>
                    <div className="bankName">{bankAccount.bankName}</div>
                    <div className="bankMeta">
                      Account Name: {bankAccount.accountName}
                    </div>
                  </div>
                </div>

                <div className="bankBottomRow">
                  <span className="bankNumberLabel">Account Number:</span>{" "}
                  <span className="bankNumberValue">
                    {bankAccount.accountNumber}
                  </span>
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
