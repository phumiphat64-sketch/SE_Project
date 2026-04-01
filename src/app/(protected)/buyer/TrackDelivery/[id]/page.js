"use client";

import styles from "./Td.module.css";
import { Afacad } from "next/font/google";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Page() {
  return (
    <div className={`${styles.container} ${afacad.className}`}>
      {/* ถ้ามี Component PH ก็ใส่ไว้ตามเดิมได้ครับ */}
      {/* <PH /> */}

      <h1 className={styles.title}>Track Delivery</h1>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <p className={styles.orderId}>Order #zzz-zzzzz-zzzz</p>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.kerryBox}>
            <div className={styles.logo}></div>

            <div className={styles.kerryInfo}>
              <h3>Kerry Express</h3>
              <p className={styles.tracking}>KR123456789</p>
              <p className={styles.date}>Placed on 20/2/2026</p>
            </div>

            <button className={styles.copyBtn}>
              copy
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>

          <div className={styles.meta}>
            <p>
              Carrier : <strong>Kerry Express</strong>
            </p>
            <p>
              Tracking No. : <span className={styles.link}>KR123456789</span>
            </p>
          </div>
        </div>
      </div>

      {/* Timeline (ย้ายออกมานอก Card) */}
      <div className={styles.timeline}>
        {/* Step 1 */}
        <div className={styles.step}>
          <div className={`${styles.circle} ${styles.bgGreen}`}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className={`${styles.line} ${styles.bgGreen}`}></div>
          <p className={styles.stepText}>Order Confirmed</p>
        </div>

        {/* Step 2 */}
        <div className={styles.step}>
          <div className={`${styles.circle} ${styles.bgGreen}`}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className={`${styles.line} ${styles.bgGreen}`}></div>
          <p className={styles.stepText}>Payment Completed</p>
        </div>

        {/* Step 3 */}
        <div className={styles.step}>
          <div className={`${styles.circle} ${styles.bgBlue}`}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <div className={`${styles.line} ${styles.bgBlue}`}></div>
          <p className={styles.stepText}>Shipped</p>
        </div>

        {/* Step 4 */}
        <div className={styles.step}>
          <div className={`${styles.circle} ${styles.bgBlue}`}></div>
          <div className={`${styles.line} ${styles.bgGray}`}></div>
          <p className={`${styles.stepText} ${styles.activeText}`}>
            In Transit
          </p>
        </div>

        {/* Step 5 */}
        <div className={styles.step}>
          <div className={`${styles.circle} ${styles.bgGray}`}></div>
          <div className={`${styles.line} ${styles.bgGray}`}></div>
          <p className={styles.stepText}>Our For Delivery</p>
        </div>

        {/* Step 6 */}
        <div className={styles.step}>
          <div className={`${styles.circle} ${styles.bgGray}`}></div>
          <p className={styles.stepText}>Delivered</p>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.backBtn}>Back To My Orders</button>
        <button className={styles.supportBtn}>Contact Support</button>
      </div>
    </div>
  );
}
