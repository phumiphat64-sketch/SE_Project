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

const BankTransferPage = ({ order, selectedBank, setShowBankTransfer }) => {
  const bankData = banks.find((b) => b.id === selectedBank);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [copiedField, setCopiedField] = useState("");
  const router = useRouter();

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 1500);
  };

  return (
    <div className={css.transferContainer}>
      <div className={css.transferWrapper}>
        {/* 🔙 Back */}
        <button
          className={`${css.transferBack} ${afacad.className}`}
          onClick={() => setShowBankTransfer(false)}
        >
          ← Back
        </button>
        {/* 📦 Card */}
        <div className={css.transferCard}>
          {/* HEADER */}
          <div className={css.transferHeader}>
            <div>
              <p className={css.label}>Order Number</p>
              <p className={css.orderText}>Order {order?.id}</p>
              <p className={css.subText}>
                Please transfer the exact amount with the trailing digits, since
                it will be verified using our system.
              </p>
            </div>

            <div className={css.amountBox}>
              <span>Total Amount</span>
              <div className={css.amountValueBox}>
                ฿ {order?.total?.toFixed(2)}
                <Copy
                  size={16}
                  className={css.copyIcon}
                  onClick={() => handleCopy(order?.total?.toFixed(2), "amount")}
                />
              </div>
            </div>
          </div>

          {/* Bank */}
          <div className={css.field}>
            <p className={css.fieldLabel}>Bank Name</p>
            <div className={css.fieldBox}>
              <div className={css.fieldLeft}>
                <img src={bankData?.logo} className={css.bankIcon} />
                <span>{bankData?.name}</span>
              </div>
              <Copy
                size={18}
                className={css.copyIcon}
                onClick={() => handleCopy(bankData?.name, "bank")}
              />
            </div>
          </div>

          {/* Account Number */}
          <div className={css.field}>
            <p className={css.fieldLabel}>Account Number</p>
            <div className={css.fieldBox}>
              <input
                className={css.inputField}
                placeholder="Enter account number"
                value={accountNumber}
                maxLength={15} /* 👈 กันยาวเกิน */
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ""); // 👈 เอาเฉพาะเลข
                  setAccountNumber(value);
                }}
              />
              <Copy
                size={18}
                className={css.copyIcon}
                onClick={() => handleCopy(accountNumber, "acc")}
              />
            </div>
          </div>

          {/* Account Name */}
          <div className={css.field}>
            <p className={css.fieldLabel}>Account Name</p>
            <div className={css.fieldBox}>
              <input
                className={css.inputField}
                placeholder="Enter account name"
                value={accountName}
                onChange={(e) => {
                  let value = e.target.value;

                  // ❌ กัน emoji / symbol
                  value = value.replace(/[^a-zA-Zก-๙\s]/g, "");

                  setAccountName(value);
                }}
              />
              <Copy
                size={18}
                className={css.copyIcon}
                onClick={() => handleCopy(accountName, "name")}
              />
            </div>
          </div>

          {/* Copied */}
          {copiedField && <p className={css.copiedText}>Copied!</p>}

          {/* Warning */}
          <div className={css.warning}>
            <div className={css.warningRow}>
              <span className={css.warningIcon}>⚠️</span>
              <div>
                <p>
                  Please transfer the exact amount of{" "}
                  <b>฿ {order?.total?.toFixed(2)}</b>
                </p>
                <p className={css.warningSub}>
                  If the transferred amount does not exactly match the total
                  order amount, our system may be unable to automatically verify
                  your payment.
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            className={`${css.transferButton} ${afacad.className}`}
            disabled={
              accountNumber.length < 10 || accountName.trim().length < 2
            }
            onClick={async () => {
              try {
                // ❗ validate ก่อน
                if (accountNumber.length < 10) {
                  alert("Account number must be at least 10 digits");
                  return;
                }

                if (!accountName.trim() || accountName.trim().length < 2) {
                  alert("Invalid account name");
                  return;
                }

                if (!order?._id) {
                  alert("Order not loaded");
                  return;
                }

                // 🔥 ยิง API (เหมือน PromptPay + Card)
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

                // 👉 redirect
                router.push("/buyer/firstpage");
              } catch (err) {
                console.error(err);
                alert("Something went wrong");
              }
            }}
          >
            I’ve Completed the Payment
          </button>

          <p className={css.footerText}>
            Please click this button after completing your bank transfer. Our
            team will verify your payment and update your order status shortly.
          </p>
        </div>
      </div>
    </div> 
  );
};

const AddCardModal = ({ onClose, onSave, savedCards }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [loading, setLoading] = useState(false);

  const isValidExpiry = (exp) => {
    if (!/^\d{2}\/\d{2}$/.test(exp)) return false;

    const [month, year] = exp.split("/").map(Number);

    if (month < 1 || month > 12) return false;

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  const isValidCVV = (cvv) => {
    return /^\d{3}$/.test(cvv);
  };

  const isValidLuhn = (num) => {
    let sum = 0;
    let shouldDouble = false;

    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  return (
    <div
      className={css.modalOverlay}
      onClick={onClose} // 👈 กดพื้นหลังปิดได้
    >
      <div
        className={css.modalCard}
        onClick={(e) => e.stopPropagation()} // 👈 กันคลิกทะลุ
      >
        <h2 className={css.modalTitle}>Add Credit/Debit Card</h2>

        <p className={css.modalDesc}>
          To verify that you are the real cardholder. The system will
          temporarily charge a small amount and refund it later
        </p>

        {/* Card Number */}
        <div className={css.formGroup}>
          <label>Card Number</label>
          <input
            placeholder="Enter card number"
            value={cardNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 16);
              setCardNumber(value);
            }}
          />
        </div>

        {/* Name */}
        <div className={css.formGroup}>
          <label>Cardholder Name</label>
          <input
            placeholder="Enter cardholder name"
            value={cardName}
            maxLength={40}
            onChange={(e) => setCardName(e.target.value)}
          />
        </div>

        {/* Expiry + CVV */}
        <div className={css.row}>
          <div className={css.formGroup}>
            <label>Expiry Date</label>
            <input
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "").slice(0, 4);

                if (value.length >= 3) {
                  value = value.slice(0, 2) + "/" + value.slice(2);
                }

                setExpiry(value);
              }}
            />
          </div>

          <div className={css.formGroup}>
            <label>CVV</label>
            <input
              placeholder="Enter CVV"
              value={cvv}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 3);
                setCvv(value);
              }}
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className={css.checkboxRow}>
          <input
            type="checkbox"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            className={css.bankCheckboxInput}
          />
          <span>Save card information</span>
        </div>

        {/* Buttons */}
        <div className={css.modalButtons}>
          <button
            disabled={loading || savedCards.length >= 3}
            className={`${css.modalConfirm} ${afacad.className}`}
            onClick={async () => {
              if (loading) return;

              try {
                if (!cardNumber || !cardName || !expiry || !cvv) {
                  alert("Please fill all fields");
                  return;
                }

                const name = cardName.trim();
                const isValidName = /^[A-Za-z\s]+$/.test(name);

                if (!isValidName) {
                  alert("Name must contain only letters");
                  return;
                }

                if (name.length < 2) {
                  alert("Name must be at least 2 characters");
                  return;
                }

                if (name.length > 40) {
                  alert("Name must be less than 40 characters");
                  return;
                }

                if (!isValidLuhn(cardNumber)) {
                  alert("Invalid card number");
                  return;
                }

                if (cardNumber.length !== 16) {
                  alert("Card number must be 16 digits");
                  return;
                }

                if (!isValidExpiry(expiry)) {
                  alert("Invalid expiry date (MM/YY)");
                  return;
                }

                if (expiry.length !== 5) {
                  alert("Expiry must be in MM/YY format");
                  return;
                }

                if (!isValidCVV(cvv)) {
                  alert("Invalid CVV");
                  return;
                }

                if (savedCards.length >= 3) {
                  alert("You can add up to 3 cards only");
                  return;
                }

                const isDuplicate = savedCards.some(
                  (c) => c.last4 === cardNumber.slice(-4),
                );

                if (isDuplicate) {
                  alert("This card is already added");
                  return;
                }

                const last4 = cardNumber.slice(-4);

                let brand = null;

                if (/^4/.test(cardNumber)) {
                  brand = "VISA";
                } else if (/^5[1-5]/.test(cardNumber)) {
                  brand = "Mastercard";
                } else {
                  alert("Only VISA and Mastercard are supported");
                  return;
                }

                setLoading(true);

                const newCard = {
                  id: Date.now().toString(),
                  brand,
                  last4,
                  expiry,
                  cardholderName: cardName,
                };

                const userStorage = localStorage.getItem("user");
                const userData = userStorage ? JSON.parse(userStorage) : null;

                // ✅ ถ้าติ๊ก → ค่อย save DB
                if (saveCard && userData?.id) {
                  await fetch("/api/auth/cards", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userId: userData.id,
                      card: newCard,
                    }),
                  });
                }

                // ✅ localStorage (เฉพาะ saveCard)
                if (userData && saveCard) {
                  userData.savedCards = [
                    ...(userData.savedCards || []),
                    newCard,
                  ];
                  localStorage.setItem("user", JSON.stringify(userData));
                }

                // 🔥 สำคัญ: เรียกแค่ครั้งเดียว
                onSave(newCard);

                onClose();
              } catch (err) {
                console.error(err);
                alert("Something went wrong");
              } finally {
                setTimeout(() => setLoading(false), 500);
              }
            }}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>

          <button
            className={`${css.modalCancel} ${afacad.className}`}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function BuyerPaymentPage() {
  const [method, setMethod] = useState("internetBanking");
  const [selectedBank, setSelectedBank] = useState(null);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [order, setOrder] = useState(null);
  const [showPromptPayQR, setShowPromptPayQR] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 นาที = 900 วิ
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
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

  useEffect(() => {
    const fetchCards = async () => {
      const userStorage = localStorage.getItem("user");
      const userData = userStorage ? JSON.parse(userStorage) : null;

      if (!userData?.id) return;

      try {
        const res = await fetch(`/api/auth/cards?userId=${userData.id}`);
        const data = await res.json();

        if (res.ok) {
          setSavedCards(data.cards.slice(0, 3)); // 👈 ใช้จาก DB
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCards();
  }, []);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSaveCard = (card) => {
    setSavedCards((prev) => [...prev, card]);
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

          <Copy
            size={16}
            className={css.copyIcon}
            onClick={() => {
              if (!order) return;

              const text = `${order.total?.toFixed(2)}`;
              navigator.clipboard.writeText(text);

              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          />
          {copied && <span className={css.copiedText}>Copied!</span>}
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
        <span
          className={`${css.methodText} ${
            method === "card" ? css.selectedOptionText : ""
          }`}
        >
          Credit / Debit Card
        </span>
      </label>

      {method === "card" && (
        <div style={{ marginLeft: "34px", marginTop: "0px" }}>
          {savedCards.length > 0 && (
            <p className={css.selectCardTitle}>Select card for payment</p>
          )}

          <div className={css.cardList}>
            {savedCards.map((card) => (
              <div
                key={card.id}
                className={`${css.cardItem} ${
                  selectedCard === card.id ? css.selectedCard : ""
                }`}
                onClick={() => setSelectedCard(card.id)}
              >
                {/* logo */}
                <div className={css.cardLogo}>
                  {card.brand === "VISA" ? (
                    <img src="/Visa.svg" />
                  ) : (
                    <img src="/MC.svg" />
                  )}
                </div>

                {/* text */}
                <div className={css.cardInfo}>
                  <span className={css.cardType}>Credit Card</span>
                  <span className={css.cardNumber}>
                    **** **** **** {card.last4}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {savedCards.length < 3 && (
            <button
              className={`${css.addCardButton} ${afacad.className}`}
              onClick={() => setShowAddCardModal(true)}
            >
              + Add credit/debit card
            </button>
          )}
        </div>
      )}

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
        ) : showBankTransfer ? (
          <BankTransferPage
            order={order}
            selectedBank={selectedBank}
            setShowBankTransfer={setShowBankTransfer}
          />
        ) : (
          <>
            <h2 className={css.title}>Complete Your Payment</h2>

            <OrderSummary order={order} />

            <div className={css.paymentCard}>
              <PaymentMethodsSelector />

              {/* ของเดิม */}
              {method === "internetBanking" && (
                <div className={css.internetBankingContainer}>
                  <BankList />
                </div>
              )}
            </div>

            <div className={css.bottomButtons}>
              <button
                className={`${css.cancelButton} ${afacad.className}`}
                onClick={() => router.push("/buyer/orderpage")}
              >
                Cancel
              </button>

              <button
                className={`${css.confirmButton} ${afacad.className}`}
                disabled={
                  (method === "card" && !selectedCard) ||
                  (method === "internetBanking" && !selectedBank)
                }
                onClick={async () => {
                  try {
                    // ✅ PromptPay (เหมือนเดิม)
                    if (method === "promptPay") {
                      setShowPromptPayQR(true);
                      return;
                    }

                    // ✅ Credit Card
                    if (method === "card") {
                      if (!selectedCard) {
                        alert("Please select a card first");
                        return;
                      }

                      if (!order?._id) {
                        alert("Order not loaded");
                        return;
                      }

                      if (loading) return;
                      setLoading(true);

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
                        router.push("/buyer/firstpage");
                      } catch (err) {
                        console.error(err);
                        alert("Something went wrong");
                      } finally {
                        setLoading(false);
                      }
                    }

                    if (method === "internetBanking") {
                      if (!selectedBank) {
                        alert("Please select a bank first");
                        return;
                      }

                      setShowBankTransfer(true);
                      return;
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Something went wrong");
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </>
        )}

        {showAddCardModal && (
          <AddCardModal
            onClose={() => setShowAddCardModal(false)}
            onSave={handleSaveCard}
            savedCards={savedCards}
          />
        )}
      </section>
    </main>
  );
}
