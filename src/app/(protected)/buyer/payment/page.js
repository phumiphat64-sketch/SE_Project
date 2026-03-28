// page.js

"use client";
import { useEffect, useState } from "react";
import { Caveat, Afacad } from "next/font/google";
import styles from "../shopbook/orderSummary.module.css";
export const dynamic = "force-dynamic";
import { Hourglass } from "lucide-react";
import { useRouter } from "next/navigation";

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

const PromptPayQR = ({
  order,
  setShowPromptPayQR,
  timeLeft,
  formatTime,
  setTimeLeft,
  router,
}) => (
  <div className={css.qrContainer}>
    <div className={css.qrCard}>
      {/* ✅ ย้ายมาอยู่ตรงนี้ */}
      <button
        className={css.backButton + " " + afacad.className}
        onClick={() => {
          setShowPromptPayQR(false);
          setTimeLeft(900); // 👈 รีเซ็ต 15 นาที
        }}
      >
        ← Back
      </button>

      <img src="/PP.png" className={css.qrLogo} />

      <p className={css.qrTitle}>Scan the QR Code to complete payment</p>

      <img src="/myQr.jpg" alt="QR Code" className={css.qrImage} />

      <p className={css.qrAmount}>
        Amount :{" "}
        <span className={css.amountValue}>
          ฿ {order?.total?.toFixed(2) || "0.00"}
        </span>
      </p>

      <p className={css.qrOrder}>Order {order?.id || "------"}</p>

      <p className={css.qrExpire}>
        <Hourglass size={18} className={css.expireIcon} />
        This QR Code will expire in <span>{formatTime(timeLeft)}</span>
      </p>

      {timeLeft === 0 && (
        <p style={{ color: "red", fontWeight: 600 }}>
          QR Code Expired. Redirecting...
        </p>
      )}
    </div>
    <button
      className={`${css.qrDoneButton} ${afacad.className}`}
      onClick={async () => {
        try {
          const res = await fetch("/api/auth/orders", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: order._id,
              status: "Paid",
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Payment failed");
          }

          alert("Payment successful!");

          // 👉 redirect กลับหน้า orders
          router.push("/buyer/firstpage");
        } catch (error) {
          console.error(error);
          alert("Something went wrong");
        }
      }}
    >
      I've Completed the Payment
    </button>
  </div>
);

export default function BuyerPaymentPage() {
  const [method, setMethod] = useState("internetBanking");
  const [selectedBank, setSelectedBank] = useState("krungthai");
  const [order, setOrder] = useState(null);
  const [showPromptPayQR, setShowPromptPayQR] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 นาที = 900 วิ
  const router = useRouter();

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

  useEffect(() => {
    if (!showPromptPayQR) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showPromptPayQR]);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeout(() => {
        router.push("/buyer/firstpage");
      }, 1000); // หน่วง 1 วิ
    }
  }, [timeLeft, router]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };


  // ✅ ส่วนสรุปยอดออเดอร์
  const OrderSummary = ({ order }) => (
    <div className={css.orderSummaryCard}>
      <div className={css.orderSummaryHeader}>
        {/* ✅ Order Number */}
        <div className={css.orderNumberBox}>
          <span className={css.orderNumberLabel}>Order Number</span>
          <span className={css.orderNumberText}>
            {order ? `Order ${order.id}` : "Loading..."}
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
        <img src="/PP.png" alt="PromptPay" className={css.promptPayIcon} />
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

        {showPromptPayQR ? (
          <PromptPayQR
            order={order}
            setShowPromptPayQR={setShowPromptPayQR}
            timeLeft={timeLeft}
            formatTime={formatTime}
            setTimeLeft={setTimeLeft}
            router={router}
          />
        ) : (
          <>
            <h2 className={css.title}>Complete Your Payment</h2>

            <OrderSummary order={order} />

            <div className={css.paymentCard}>
              <PaymentMethodsSelector />

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

              <button
                className={`${css.confirmButton} ${afacad.className}`}
                onClick={() => {
                  if (method === "promptPay") {
                    setShowPromptPayQR(true);
                  } else {
                    alert("Handle other payment...");
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
