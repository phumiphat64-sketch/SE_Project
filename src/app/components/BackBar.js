"use client";
import styles from "./BackBar.module.css";
import { useRouter } from "next/navigation";

export default function BackBar({
  text = "Back to All Books",
  link = "/seller/inventory",
}) {
  const router = useRouter();

  return (
    <div className={styles.backBar} onClick={() => router.push(link)}>
      ⬅ {text}
    </div>
  );
}
