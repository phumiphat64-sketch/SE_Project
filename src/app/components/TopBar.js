"use client";
import styles from "./TopBar.module.css";
import { Crimson_Text, Caveat } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function TopBar({ showBack = false }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error("Invalid user in localStorage");
        }
      }

      setReady(true);
    }
  }, []);

  if (!ready) return null;

  const isBuyerRoot = pathname === "/buyer";

  const forceMenuPages = [
    "/seller/profilehide",
    "/seller/home",
    "/seller/products",
  ];

  const forceMenu = forceMenuPages.includes(pathname);

  const shouldShowBack = showBack && !isBuyerRoot && !forceMenu;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const handleBack = () => {
    window.location.href = "/";
  };

  // 🔥 หน้า public ที่ไม่ควรแสดง menu
  const publicPages = ["/", "/login", "/register"];

  const isPublicPage = publicPages.includes(pathname);

  return (
    <div className={styles.topBar}>
      <h2 className={`${styles.logo} ${caveat.className}`}>ReRead</h2>
      {shouldShowBack && (
        <button onClick={handleBack} className={styles.backBtn}>
          ← Back
        </button>
      )}

      {/* 🔹 ถ้าเป็นหน้า public */}
      {isPublicPage && pathname === "/register" && (
        <Link
          href="/login"
          className={`${styles.loginBtn} ${crimson.className}`}
        >
          Login
        </Link>
      )}

      {/* 🔹 แสดงเมนูเฉพาะหน้า protected เท่านั้น */}
      {!isPublicPage && user && !shouldShowBack && (
        <div className={styles.menu}>
          <Link href="/seller/home" className={styles.menuItem}>
            <img src="/icons/1.svg" className={styles.icon} />
            Home
          </Link>

          <Link href="/search" className={styles.menuItem}>
            <img src="/icons/5.svg" className={styles.icon} />
            Search
          </Link>

          <Link href="/seller/profilehide" className={styles.menuItem}>
            <img src="/icons/4.svg" className={styles.icon} />
            Profile
          </Link>

          <Link href="/sell" className={styles.menuItem}>
            <img src="/icons/3.svg" className={styles.icon} />
            Orders
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <img src="/icons/2.svg" className={styles.icon} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
