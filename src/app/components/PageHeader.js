"use client";

import { useRouter } from "next/navigation";
import styles from "./PageHeader.module.css";

export default function PageHeader({ title }) {
  const router = useRouter();

  return (
    <>
      <div className={styles.backBar}>
        <button className={styles.back} onClick={() => router.back()}>
          ← Back
        </button>
      </div>

      <div className={styles.title}>{title}</div>
    </>
  );
}
