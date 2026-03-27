// page.js

"use client";
import { useEffect, useState } from "react";
import { Caveat, Afacad } from "next/font/google";
import styles from "../shopbook/orderSummary.module.css";
export const dynamic = "force-dynamic";

import css from "./pay.module.css";
import {
  Home,
  User,
  ClipboardList,
  LogOut,
  ShoppingBag,
  Truck,
  CreditCard,
  Plus,
  Copy,
  ArrowLeft,
} from "lucide-react";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const banks = [
  {
    id: "bangkok",
    name: "Bangkok Bank Public Company Limited",
    logo: "/Bk.png",
  },
  {
    id: "krungthai",
    name: "KRUNG THAI BANK Public Company Limited",
    logo: "/Ks.png",
  },
  {
    id: "kasikorn",
    name: "KASIKORNBANK Public Company Limited",
    logo: "/Kb.png",
  },
  {
    id: "scb",
    name: "SIAM COMMERCIAL BANK Public Company Limited",
    logo: "/SCBR.png",
  },
];

export default function BuyerPaymentPage() {
  const [method, setMethod] = useState("internetBanking"); 
  const [selectedBank, setSelectedBank] = useState("krungthai"); 
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("orderId");

    if (!id) return;

    const fetchOrder = async () => {
      try {
        // ✅ ดึง userId เหมือนหน้า Orders
        const userStorage = localStorage.getItem("user");
        const userData = userStorage ? JSON.parse(userStorage) : null;
        const userId = userData?.id;

        const res = await fetch(`/api/auth/orders?userId=${userId}`);
        const data = await res.json();

        console.log("orderId from URL:", id);
        console.log("orders from API:", data.data);

        // ✅ หา order ที่ตรงกับ id
        const foundOrder = data.data.find((o) => String(o._id) === String(id));
        console.log("foundOrder:", foundOrder);

        setOrder(foundOrder);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();
  }, []);

  // ✅ ส่วนสรุปยอดออเดอร์
  const OrderSummary = ({ order }) => (
    <div className={css.orderSummaryCard}>
      <div className={css.orderSummaryHeader}>
        {/* ✅ Order Number */}
        <div className={css.orderNumberBox}>
          <span className={css.orderNumberLabel}>Order Number</span>
          <span className={css.orderNumberText}>
            {order ? `Order #${order.id}` : "Loading..."}
          </span>
        </div>

        {/* ✅ Total */}
        <div className={css.totalAmountContainer}>
          <span className={css.totalAmountLabel}>Total Amount : </span>
          <span className={css.totalAmountValue}>
            {order ? `฿ ${order.total?.toFixed(2)}` : "Loading..."}
          </span>
          <Copy size={16} className={css.copyIcon} />
        </div>
      </div>
    </div>
  );

  // ✅ ส่วนตัวเลือกวิธีการชำระเงินหลัก
  const PaymentMethodsSelector = () => (
    <div className={css.paymentMethodsContainer}>
      {/* PromptPay */}
      <label className={`${css.paymentMethodLabel} ${css.inactiveMethodLabel}`}>
        <input
          type="radio"
          name="paymentMethod"
          value="promptPay"
          checked={method === "promptPay"}
          onChange={() => setMethod("promptPay")}
          className={css.paymentMethodInput}
        />
        <img
          src="/PP.png"
          alt="PromptPay"
          className={css.promptPayIcon}
        />
      </label>

      {/* Credit / Debit Card - ✅ Inactive (สีฟอนต์เทาเข้มปกติ) */}
      <label className={`${css.paymentMethodLabel} ${css.inactiveMethodLabel}`}>
        <input
          type="radio"
          name="paymentMethod"
          value="card"
          checked={method === "card"}
          onChange={() => setMethod("card")}
          className={css.paymentMethodInput}
        />
        <span className={css.methodText}>Credit / Debit Card</span>
      </label>

      {/* Internet Banking - ✅ Active (สีฟอนต์แดงสดและพื้นหลังชมพูอ่อน) */}
      <label
        className={`${css.paymentMethodLabel} ${method === "internetBanking" ? css.activeMethodLabel : css.inactiveMethodLabel}`}
      >
        <input
          type="radio"
          name="paymentMethod"
          value="internetBanking"
          checked={method === "internetBanking"}
          onChange={() => setMethod("internetBanking")}
          className={css.paymentMethodInput}
        />
        <span
          className={`${css.methodText} ${method === "internetBanking" ? css.selectedMethodText : ""}`}
        >
          Internet Banking
        </span>
      </label>
    </div>
  );

  // ✅ ส่วนรายการธนาคาร
  const BankList = () => (
    <div className={css.bankListContainer}>
      {banks.map((bank) => (
        <div key={bank.id} className={css.bankItem}>
          <div className={css.bankLogoContainer}>
            <img src={bank.logo} alt={bank.name} className={css.bankLogo} />
          </div>
          <div className={css.bankInfoContainer}>
            <span
              className={`${css.bankName} ${selectedBank === bank.id ? css.selectedBankName : ""}`}
            >
              {bank.name}
            </span>
          </div>
          <label className={css.bankCheckboxLabel}>
            <input
              type="checkbox"
              value={bank.id}
              checked={selectedBank === bank.id}
              onChange={() => setSelectedBank(bank.id)}
              className={css.bankCheckboxInput}
            />
          </label>
        </div>
      ))}
    </div>
  );

  return (
    <main className={`${afacad.className} ${css.page}`}>
      <section className={css.container}>
        {/* ✅ ขั้นตอนการสั่งซื้อ (Order Steps) - ใช้ Style เดิมของคุณ */}
        <div className={css.steps}>
          <div className={styles.step}>
            <div className={`${styles.circle} ${styles.circleBlue}`}>
              <img src="/icons/t2.svg" className={styles.stepIcon} />
            </div>
            <span className={styles.stepText}>Shopping</span>
          </div>

          <div className={styles.connectionArrow}>
            <div className={styles.arrowHead} />
          </div>

          <div className={styles.step}>
            <div className={`${styles.circle} ${styles.circleDarkBlue}`}>
              <img src="/icons/t1.svg" className={styles.stepIcon} />
            </div>
            <span className={`${styles.stepText} ${css.noWrap}`}>
              Order Summary
            </span>
          </div>

          <div className={`${styles.connectionArrow} ${css.blueArrow}`}>
            <div className={`${styles.arrowHead} ${css.blueArrowHead}`} />
          </div>

          <div className={styles.step}>
            <div className={`${styles.circle} ${css.paymentCircle}`}>
              <img src="/icons/t4.svg" className={styles.stepIcon} />
            </div>
            <span className={`${styles.stepText} ${styles.stepTextBold}`}>
              Payment
            </span>
          </div>
        </div>

        <h2 className={css.title}>Complete Your Payment</h2>

        <OrderSummary order={order} />

        <div className={css.paymentCard}>
          <PaymentMethodsSelector />

          {/* ✅ แสดงรายการธนาคารเมื่อเลือก Internet Banking */}
          {method === "internetBanking" && (
            <div className={css.internetBankingContainer}>
              <BankList />
            </div>
          )}
        </div>

        <div className={css.bottomButtons}>
          <button className={`${css.cancelButton} ${afacad.className}`}>
            Cancel
          </button>

          <button className={`${css.confirmButton} ${afacad.className}`}>
            Confirm
          </button>
        </div>
      </section>
    </main>
  );
}
