"use client";
import styles from "./TopBar.module.css";
import { Crimson_Text, Caveat } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // 🔥 หน้า public ที่ไม่ควรแสดง menu
  const publicPages = ["/", "/login", "/register"];

  const isPublicPage = publicPages.includes(pathname);

  return (
    <div className={styles.topBar}>
      <h2 className={`${styles.logo} ${caveat.className}`}>ReRead</h2>

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
      {!isPublicPage && user && (
        <div className={styles.menu}>
          <Link href="/">Home</Link>
          <Link href="/search">Search</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/buyer">Orders</Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
