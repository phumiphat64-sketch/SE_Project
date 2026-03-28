"use client";

import styles from "./orders.module.css";
import { Afacad } from "next/font/google";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // ดึงข้อมูลก้อน user ออกมาจาก localStorage แล้วแปลงเป็น Object
        const userStorage = localStorage.getItem("user");
        const userData = userStorage ? JSON.parse(userStorage) : null;

        const userId = userData?.id;

        if (!userId) {
          console.warn("ยังไม่ได้เข้าสู่ระบบ");
          return;
        }

        // 🔥 ส่ง userId ไปพร้อมกับ API (ผ่าน Query String)
        const res = await fetch(`/api/auth/orders?userId=${userId}`);
        const data = await res.json();

        console.log("API DATA:", data);
        setOrders(data?.data || []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className={`${styles.page} ${afacad.className}`}>
      <section className={styles.container}>
        <h2 className={styles.sectionTitle}>My Orders</h2>

        {orders?.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </section>
    </main>
  );
}

function OrderCard({ order }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // เพิ่ม State นี้เพื่อป้องกัน Hydration Error ของ Next.js
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const colors = getStatusColors(currentOrder.status);

  function formatOrderId(id) {
    if (!id) return "";
    const clean = id.replace("#", "");
    return "#" + clean.match(/.{1,3}/g)?.join("-");
  }

  const handleConfirmCancel = async (e) => {
    e.stopPropagation();

    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. ส่งข้อมูลไปอัปเดตที่ Database ผ่าน API (ใช้ Method PATCH)
      const res = await fetch("/api/auth/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: currentOrder._id, // ส่ง _id ของ order ไปอ้างอิง
          status: "Canceled",
          cancelReason: cancelReason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel order");
      }

      // 2. เมื่อ API ตอบกลับว่าสำเร็จ ให้อัปเดต UI ทันที
      setCurrentOrder({
        ...currentOrder,
        status: "Canceled",
        cancelReason: cancelReason,
      });

      setIsCancelModalOpen(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error canceling order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article
      className={styles.card}
      onClick={() => {
        if (currentOrder.status === "Paid") return; // 👈 กันกด
        if (currentOrder.status === "Canceled") return; // (ของเดิมคุณก็กันอยู่แล้ว)
        setIsOpen(!isOpen);
      }}
    >
      {/* ... (โค้ดส่วนแสดงผล Card ด้านบนเหมือนเดิมทุกอย่าง) ... */}
      <div className={styles.cardTop}>
        <div>
          <div className={styles.orderId}>{formatOrderId(currentOrder.id)}</div>
          <div className={styles.placedOn}>
            Placed on {currentOrder.placedOn}
          </div>
        </div>
        <div className={styles.badge} style={{ backgroundColor: colors.badge }}>
          {currentOrder.status}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.productRow}>
        <div className={styles.productLeft}>
          <img
            src={
              currentOrder.images?.[0] ||
              currentOrder.image ||
              "/images/book-cover.png"
            }
            alt="Book Cover"
            className={styles.bookThumb}
          />
          <div className={styles.bookInfo}>
            <div className={styles.bookName}>{currentOrder.bookName}</div>
            <div className={styles.infoText}>{currentOrder.author}</div>
            <div className={styles.infoText}>Store: {currentOrder.store}</div>
            <div className={styles.infoText}>Status: {currentOrder.status}</div>
          </div>
        </div>
        <div className={styles.productRight}>
          <div className={styles.priceText}>
            ฿{Number(currentOrder.price ?? 0).toFixed(2)}
          </div>
          <div className={styles.qtyText}>
            Quantity: {currentOrder.quantity}
          </div>
        </div>
      </div>

      {currentOrder.cancelReason && (
        <>
          <div className={styles.divider} />
          <div
            style={{
              padding: "16px",
              fontSize: "14px",
              color: "#333",
              backgroundColor: "#fafafa",
            }}
          >
            Cancellation reason: {currentOrder.cancelReason}
          </div>
        </>
      )}

      <div className={styles.divider} />

      <div className={styles.bottomRow}>
        <div>
          <div className={styles.addressTitle}>Shipping Address</div>
          {currentOrder.address?.map((line, i) => (
            <div key={i} className={styles.addressText}>
              {line}
            </div>
          ))}
        </div>
        <div className={styles.summaryBlock}>
          <div className={styles.summaryLabel}>Order Summary</div>
          <div className={styles.summaryText}>
            Subtotal: ฿{currentOrder.subtotal?.toFixed(2)}
          </div>
          <div className={styles.totalText}>
            Total: ฿{currentOrder.total?.toFixed(2)}
          </div>
        </div>
      </div>

      {isOpen && currentOrder.status !== "Canceled" && (
        <div className={styles.actionRow}>
          <button
            className={styles.cancelBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsCancelModalOpen(true);
            }}
          >
            Cancel Order
          </button>
          <button
            className={styles.payBtn}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/buyer/payment?orderId=${currentOrder._id}`);
            }}
          >
            Make Payment
          </button>
        </div>
      )}

      {/* --- ใช้ createPortal ดัน Modal ออกไปที่ document.body --- */}
      {isCancelModalOpen &&
        mounted &&
        createPortal(
          <div
            className={afacad.className}
            onClick={(e) => {
              e.stopPropagation();
              setIsCancelModalOpen(false);
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#fff",
                padding: "24px",
                borderRadius: "12px",
                width: "90%",
                maxWidth: "400px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                zIndex: 100000,
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "8px", color: "#333" }}>
                Cancel Order
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "16px",
                }}
              >
                Please tell us why you want to cancel this order:
              </p>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g., Changed my mind, found a better price..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "none",
                  marginBottom: "20px",
                  boxSizing: "border-box",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  className={afacad.className}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCancelModalOpen(false);
                  }}
                  disabled={isSubmitting}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    color: "#555",
                    fontWeight: "500",
                  }}
                >
                  Back
                </button>
                <button
                  className={afacad.className}
                  onClick={handleConfirmCancel}
                  disabled={isSubmitting}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#B35C59",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {isSubmitting ? "Canceling..." : "Confirm Cancel"}
                </button>
              </div>
            </div>
          </div>,
          document.body, // ส่งออกไปเรนเดอร์ที่ body โดยตรง
        )}
    </article>
  );
}

function getStatusColors(status) {
  switch (status) {
    case "Pending":
      return { badge: "#D9C64C" };
    case "Paid":
      return { badge: "#6D91B9" };
    case "Shipped":
      return { badge: "#D28C59" };
    case "Completed":
      return { badge: "#6A9073" };
    case "Canceled":
      return { badge: "#B35C59" };
    default:
      return { badge: "#999" };
  }
}
