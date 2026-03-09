"use client";
import styles from "./NavBar.module.css";
import Link from "next/link";
import { Caveat, Afacad } from "next/font/google";

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Navbar() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  return (
    <div className={styles.navbar}>
      {/* Logo */}
      <h1 className={`${styles.logo} ${caveat.className}`}>ReRead</h1>

      {/* Menu */}
      <div className={`${styles.menu} ${afacad.className}`}>
        <Link href="/home" className={styles.menuItem}>
          <img src="/icons/1.svg" className={styles.icon} />
          Home
        </Link>

        <Link href="/profile" className={`${styles.menuItem} ${afacad.className}`}>
          <img src="/icons/4.svg" className={styles.icon} />
          Profile
        </Link>

        <Link href="/orders" className={`${styles.menuItem} ${afacad.className}`}>
          <img src="/icons/3.svg" className={styles.icon} />
          Orders
        </Link>

        <button onClick={handleLogout} className={`${styles.menuItem} ${afacad.className}`}>
          <img src="/icons/2.svg" className={styles.icon} />
          Logout
        </button>
      </div>
    </div>
  );
}
