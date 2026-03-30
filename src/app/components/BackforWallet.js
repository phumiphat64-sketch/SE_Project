"use client";

import { useRouter } from "next/navigation";
import styles from "./BackforWallet.module.css";

export default function BackforWallet({ title }) {
  const router = useRouter();

  return (
    <>
      {/* แทรก afacad.className เข้าไปที่ div คลุมด้านนอกสุด */}
      <div className={styles.backBar}>
        <button
          className={styles.back}
          onClick={() => {
            router.push("/seller/walletBase");
            router.refresh(); 
          }}
        >
          ← Back To Wallet
        </button>
      </div>
    </>
  );
}
