"use client";

import { useRouter } from "next/navigation";
import styles from "./PageHeader.module.css";
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

export default function PageHeader({ title }) {
  const router = useRouter();

  return (
    <>
      <div className={styles.backBar}>
        <button className={styles.back} onClick={() => router.back()}>
          ← Back
        </button>
      </div>

      <div className={`${styles.title} ${afacad.className}`}>{title}</div>
    </>
  );
}
