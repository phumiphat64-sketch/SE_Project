"use client";

import styles from "./Td.module.css";
import { Afacad } from "next/font/google";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import PH from "@/app/components/BackToMyOrders";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Page() {
  return (
    <div className={styles.container}>
      <PH />
      <h1 className={styles.title}>Track Delivery</h1>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.orderId}>Order #zzz-zzzzz-zzzz</p>

            <div className={styles.kerryBox}>
              <div className={styles.logo}></div>

              <div>
                <h3>Kerry Express</h3>
                <p className={styles.tracking}>KR123456789</p>
                <p className={styles.date}>Placed on 20/2/2026</p>
              </div>
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

          <button className={styles.copyBtn}>copy</button>
        </div>

        {/* Timeline */}
        <div className={styles.timeline}>
          <div className={styles.step}>
            <div className={`${styles.circle} ${styles.done}`}></div>
            <p>Order Confirmed</p>
          </div>

          <div className={styles.step}>
            <div className={`${styles.circle} ${styles.done}`}></div>
            <p>Payment Completed</p>
          </div>

          <div className={styles.step}>
            <div className={`${styles.circle} ${styles.shipped}`}></div>
            <p>Shipped</p>
          </div>

          <div className={styles.step}>
            <div className={`${styles.circle} ${styles.active}`}></div>
            <p className={styles.activeText}>In Transit</p>
          </div>

          <div className={styles.step}>
            <div className={styles.circle}></div>
            <p>Our for Delivery</p>
          </div>

          <div className={styles.step}>
            <div className={styles.circle}></div>
            <p>Delivered</p>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.backBtn}>Back To My Orders</button>
        <button className={styles.supportBtn}>Contact Support</button>
      </div>
    </div>
  );
}
