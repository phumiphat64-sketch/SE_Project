"use client";

import React from "react";
import Link from "next/link";
import styles from "./h.module.css";
import { Playfair_Display, Poppins } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const menuItems = [
  {
    title: "Users management",
    href: "/admin/users",
    icon: <UsersIcon />,
  },
  {
    title: "Books management",
    href: "/admin/books",
    icon: <BooksIcon />,
  },
  {
    title: "Orders management",
    href: "/admin/orders",
    icon: <OrdersIcon />,
  },
  {
    title: "Payment management",
    href: "/admin/payment",
    icon: <PaymentIcon />,
  },
];

export default function AdminHomePage() {
  return (
    <main className={`${styles.page} ${poppins.className}`}>
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={`${styles.brand} ${playfair.className}`}>ReRead</div>

          <nav className={styles.navRight}>
            <Link href="/admin/home" className={styles.navLink}>
              <HomeIcon />
              <span>Home</span>
            </Link>

            <Link href="/login" className={styles.navLink}>
              <LogoutIcon />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </header>

      <div className={styles.subBar} />

      <section className={styles.container}>
        <div className={styles.menuStack}>
          {menuItems.map((item) => (
            <Link key={item.title} href={item.href} className={styles.menuCard}>
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuText}>{item.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

/* ===== Icons (เหมือนเดิมทุกตัว) ===== */

function HomeIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H4" />
      <path d="M20 4h-6v4" />
      <path d="M20 20h-6v-4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3" />
      <path d="M17 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M18 14.5l.6 1.2 1.3.2-.9 1 .2 1.4-1.2-.6-1.2.6.2-1.4-.9-1 1.3-.2.6-1.2Z" />
    </svg>
  );
}

function BooksIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3Z" />
      <path d="M5 4v16a3 3 0 0 1 3-3h11" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 7h11l4 4v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M14 7v4h4" />
      <path d="M20 7h1a1 1 0 0 1 1 1v7" />
      <path d="M8 12h4" />
      <path d="M8 15h6" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 3h8l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M15 3v5h5" />
      <path d="M12 9v7" />
      <path d="M9.5 11.5c0-1.1 1-2 2.5-2s2.5.9 2.5 2-1 2-2.5 2-2.5.9-2.5 2 1 2 2.5 2 2.5-.9 2.5-2" />
    </svg>
  );
}
