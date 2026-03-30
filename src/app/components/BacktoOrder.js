"use client";

import { useRouter } from "next/navigation";
import styles from "./BacktoOrder.module.css";

export default function BackToOrder({ title }) {
  const router = useRouter();

  return (
    <>
      {/* แทรก afacad.className เข้าไปที่ div คลุมด้านนอกสุด */}
      <div className={styles.backBar}>
        <button
          className={styles.back}
          onClick={() => {
            router.push("/seller/orders");
            router.refresh();
          }}
        >
          ← Back To All Orders
        </button>
      </div>
    </>
  );
}
