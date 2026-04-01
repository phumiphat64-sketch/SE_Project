"use client";

import { useRouter } from "next/navigation";
import styles from "./BackToMyOrders.module.css";

export default function BackToOrder({ title }) {
  const router = useRouter();

  return (
    <>
      {/* แทรก afacad.className เข้าไปที่ div คลุมด้านนอกสุด */}
      <div className={styles.backBar}>
        <button
          className={styles.back}
          onClick={() => {
            router.push("/buyer/orderpage");
            router.refresh();
          }}
        >
          ← Back To My Orders
        </button>
      </div>
    </>
  );
}
