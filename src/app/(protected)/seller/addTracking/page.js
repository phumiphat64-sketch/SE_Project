"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Afacad } from "next/font/google";
import styles from "./aT.module.css";
import BacktoOrder from "@/app/components/BacktoOrder";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const carriers = [
  {
    value: "thailand-post",
    label: "Thailand Post",
    image: "/T.png",
  },
  {
    value: "kerry-express",
    label: "Kerry Express",
    image: "/K.jpg",
  },
  {
    value: "flash-express",
    label: "Flash Express",
    image: "/F.jpg",
  },
];

const validateTracking = (carrier, number) => {
  if (!number) return "";

  switch (carrier) {
    case "thailand-post":
      return /^[A-Z]{2}[0-9]{9}TH$/i.test(number)
        ? ""
        : "Invalid format. Example: EF123456789TH";

    case "flash-express":
      return /^TH[A-Z0-9]{11,13}$/i.test(number)
        ? ""
        : "Invalid format. Example: TH012345678912A";

    case "kerry-express":
      return /^[A-Z0-9]{10,15}$/i.test(number)
        ? ""
        : "Invalid format. Usually 10-15 characters.";

    default:
      return "";
  }
};

// 🔥 👉 แยก logic เดิมมาไว้ตรงนี้ (ไม่แก้แม้แต่บรรทัดเดียว)
function AddTrackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [trackingError, setTrackingError] = useState("");

  const isFormValid =
    selectedCarrier !== "" &&
    trackingNumber.trim() !== "" &&
    trackingError === "";

  const selectedCarrierData = useMemo(() => {
    return carriers.find((c) => c.value === selectedCarrier) || null;
  }, [selectedCarrier]);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/auth/orders/${orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    if (!selectedCarrier || !trackingNumber.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch(`/api/auth/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "In Transit",
          carrier: selectedCarrier,
          trackingNumber: trackingNumber.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Tracking number already exists") {
          alert("❌ Tracking number นี้ถูกใช้ไปแล้ว");
        } else {
          alert("Something went wrong");
        }
        setIsSubmitting(false);
        return;
      }

      alert("Order status updated to In Transit!");
      router.push("/seller/home");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <main className={`${afacad.className} ${styles.page}`}>
      <BacktoOrder />

      <section className={styles.content}>
        <div className={styles.centerWrap}>
          <h2 className={styles.title}>Update Order</h2>

          <div className={styles.card}>
            <div className={styles.cardTopBar}>
              <div className={styles.orderNumberWrap}>
                <span className={styles.orderNumberLabel}>Order Number</span>
                <span className={styles.orderNumberValue}>{order.id}</span>
              </div>

              <span className={styles.toShipBadge}>
                {order.status === "Paid" ? "To Ship" : order.status}
              </span>
            </div>

            <div className={styles.cardBody}>
              <img src={order.images?.[0]} className={styles.bookThumb} />

              <div className={styles.orderInfo}>
                <div className={styles.bookName}>{order.bookName}</div>

                <div className={styles.addressRow}>
                  <span className={styles.addressLabel}>Shipping Address:</span>
                  <div>
                    <div className={styles.addressText}>
                      {order.address?.slice(0, 3).join(", ")}
                    </div>
                    <div className={styles.addressText}>
                      {order.address?.slice(3).join(", ")}
                    </div>
                  </div>
                </div>

                <div className={styles.buyerRow}>
                  <span className={styles.buyerLabel}>Buyer:</span>{" "}
                  {order.buyerName}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Shipping Provider (Carrier)</h3>

            <label className={styles.label}>
              Select Carrier <span className={styles.required}>*</span>
            </label>

            <div className={styles.dropdownWrapper} ref={dropdownRef}>
              <button
                className={styles.selectButton}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <div className={styles.leftContent}>
                  {selectedCarrierData ? (
                    <div className={styles.selectedContent}>
                      <img
                        src={selectedCarrierData.image}
                        className={styles.carrierLogo}
                      />
                      <span>{selectedCarrierData.label}</span>
                    </div>
                  ) : (
                    <span className={styles.placeholderText}>Select...</span>
                  )}
                </div>

                <span className={styles.arrow}>
                  {isDropdownOpen ? "▲" : "▼"}
                </span>
              </button>

              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {carriers.map((c) => (
                    <button
                      key={c.value}
                      className={`${styles.dropdownOption} ${
                        selectedCarrier === c.value ? styles.active : ""
                      }`}
                      onClick={() => {
                        setSelectedCarrier(c.value);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <img src={c.image} className={styles.carrierLogo} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <label className={`${styles.label} ${styles.mt}`}>
              Tracking Number <span className={styles.required}>*</span>
            </label>

            <input
              type="text"
              className={styles.input}
              value={trackingNumber}
              maxLength={50}
              onChange={(e) => {
                setTrackingNumber(e.target.value);
                setTrackingError(
                  validateTracking(selectedCarrier, e.target.value),
                );
              }}
            />

            {trackingError && (
              <p
                style={{
                  color: "red",
                  fontSize: "14px",
                  marginTop: "4px",
                  marginBottom: "0",
                }}
              >
                {trackingError}
              </p>
            )}

            <div className={styles.buttonWrap}>
              <button
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
              >
                Update to “In Transit”
              </button>
            </div>

            <p className={styles.note}>
              This will move the order to the In Transit list and notify the
              Buyer
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

// 🔥 👉 ตัวนี้คือ fix Vercel (สำคัญ)
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddTrackInner />
    </Suspense>
  );
}
