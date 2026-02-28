"use client";
import styles from "./TopBar.module.css";
import { Crimson_Text, Caveat } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function TopBar() {
  const pathname = usePathname();

  return (
    <div className={styles.topBar}>
      <h2 className={`${styles.logo} ${caveat.className}`}>ReRead</h2>

      {/* เพิ่มปุ่ม Login แบบไม่กระทบของเดิม */}
      {pathname === "/register" && (
        <Link href="/login" className={`${styles.loginBtn} ${crimson.className}`}>
          Login
        </Link>
      )}
    </div>
  );
}
