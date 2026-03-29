"use client";

import { useRouter } from "next/navigation";
import styles from "./BackforWallet.module.css";
import { Crimson_Text, Caveat, Afacad, IBM_Plex_Mono } from "next/font/google";

export const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

export default function BackforWallet({ title }) {
  const router = useRouter();

  return (
    <>
      {/* แทรก afacad.className เข้าไปที่ div คลุมด้านนอกสุด */}
      <div className={`${styles.backBar} ${afacad.className}`}>
        <button className={styles.back} onClick={() => router.back()}>
          ← Back To Wallet
        </button>
      </div>
    </>
  );
}
