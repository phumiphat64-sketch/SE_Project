"use client";
import styles from "./BackBar.module.css";
import { useRouter } from "next/navigation";
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

export default function BackBar({
  text = "Back to All Books",
  link = "/seller/inventory",
}) {
  const router = useRouter();

  return (
    <div
      className={`${styles.backBar} ${afacad.className}`}
      onClick={() => router.push(link)}
    >
      <span className={styles.arrow}>⬅   </span>
      {text}
    </div>
  );
}
