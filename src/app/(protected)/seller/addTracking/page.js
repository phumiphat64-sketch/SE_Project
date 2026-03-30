"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Caveat, Afacad } from "next/font/google";
import styles from "./aT.module.css";
import BacktoOrder from "@/app/components/BacktoOrder";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const carriers = [
  {
    value: "thailand-post",
    label: "Thailand Post",
    image: "/thailand-post-seeklogo.svg",
  },
  {
    value: "kerry-express",
    label: "Kerry Express",
    image: "/Kerrry_Express.svg",
  },
  {
    value: "flash-express",
    label: "Flash Express",
    image: "/Flash_Express_Logo.svg",
  },
];

export default function AddTrackPage() {
  const router = useRouter();

  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCarrierData = useMemo(() => {
    return carriers.find((c) => c.value === selectedCarrier) || null;
  }, [selectedCarrier]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (!selectedCarrier || !trackingNumber.trim()) {
      alert("Please select carrier and enter tracking number.");
      return;
    }

    alert("Tracking added successfully.");
    router.push("/seller/orders");
  };

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
                <span className={styles.orderNumberValue}>#zzz-zzzzz-zzzz</span>
              </div>
              <span className={styles.toShipBadge}>To Ship</span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.bookThumb} />

              <div className={styles.orderInfo}>
                <div className={styles.bookName}>Book name</div>

                <div className={styles.addressRow}>
                  <span className={styles.addressLabel}>Shipping Address:</span>
                  <div>
                    <div className={styles.addressText}>
                      4 Privet Drive, Little Whinging, Surrey
                    </div>
                    <div className={styles.addressText}>
                      100000, United Kingdom
                    </div>
                  </div>
                </div>

                <div className={styles.buyerRow}>
                  <span className={styles.buyerLabel}>Buyer:</span> Buyer name
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
                      <img
                        src={c.image}
                        className={styles.carrierLogo}
                        alt=""
                      />
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
              onChange={(e) => setTrackingNumber(e.target.value)}
            />

            <div className={styles.buttonWrap}>
              <button className={styles.submitButton} onClick={handleSubmit}>
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
