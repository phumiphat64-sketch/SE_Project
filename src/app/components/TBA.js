"use client";
import styles from "./TBA.module.css";
import { Caveat } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function TBA() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error("Invalid user in localStorage");
      }
    }

    setReady(true);
  }, []);

  if (!ready) return null;

  // ❗ ไม่ต้องแสดง TopBar ในหน้า login/register
  const isPublicPage = ["/login", "/register"].includes(pathname);
  if (isPublicPage) return null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className={styles.topBar}>
      {/* Logo */}
      <h2 className={`${styles.logo} ${caveat.className}`}>ReRead</h2>

      {/* Menu */}
      <div className={styles.menu}>
        <Link href="/admin/home" className={styles.menuItem}>
          <img src="/icons/1.svg" className={styles.icon} />
          Home
        </Link>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <img src="/icons/2.svg" className={styles.icon} />
          Logout
        </button>
      </div>
    </div>
  );
}
