"use client";
import { useEffect, useState } from "react";
import styles from "./buyer.module.css";
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

export default function BuyerPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!mounted) return null;
  if (!user) return null;

  const books = [
    {
      id: 1,
      title: "ราชันโลกเวทมนตร์ เล่ม 01",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 2,
      title: "ราชันโลกเวทมนตร์ เล่ม 02",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 3,
      title: "ราชันโลกเวทมนตร์ เล่ม 03",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 4,
      title: "ราชันโลกเวทมนตร์ เล่ม 04",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 5,
      title: "ราชันโลกเวทมนตร์ เล่ม 05",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 6,
      title: "ราชันโลกเวทมนตร์ เล่ม 01",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 7,
      title: "ราชันโลกเวทมนตร์ เล่ม 02",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 8,
      title: "ราชันโลกเวทมนตร์ เล่ม 03",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 9,
      title: "ราชันโลกเวทมนตร์ เล่ม 04",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 10,
      title: "ราชันโลกเวทมนตร์ เล่ม 05",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 11,
      title: "ราชันโลกเวทมนตร์ เล่ม 01",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 12,
      title: "ราชันโลกเวทมนตร์ เล่ม 02",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 13,
      title: "ราชันโลกเวทมนตร์ เล่ม 03",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 14,
      title: "ราชันโลกเวทมนตร์ เล่ม 04",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
    {
      id: 15,
      title: "ราชันโลกเวทมนตร์ เล่ม 05",
      author: "โดย ผู้แต่งชื่อดัง",
      price: 190,
    },
  ];

  const orders = [
    { id: 1, status: "pending", price: 180 },
    { id: 2, status: "paid", price: 170 },
    { id: 3, status: "shipped", price: 200 },
    { id: 4, status: "completed", price: 210 },
    { id: 5, status: "cancelled", price: 150 },
  ];

  return (
    <div className={styles.page}>
      {/* Search Bar */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            className={`${styles.searchInput} ${afacad.className}`}
            placeholder="Search by title, author"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className={`${styles.searchButton} ${afacad.className}`}>Search</button>
        </div>
      </div>

      {/* Greeting */}
      <div className={styles.greetingRow}>
        <div className={styles.avatar}>
          <img src="/boy.png" alt="profile" />
        </div>
        <div className={`${styles.greeting} ${afacad.className}`}>Hi {user.name} !</div>
      </div>

      {/* Recently Added Books */}
      <div className={`${styles.sectionTitle} ${afacad.className}`}>Recently Added Books</div>
      <div className={styles.booksGrid}>
        {books.map((book) => (
          <div key={book.id} className={styles.bookCard}>
            <div className={styles.bookCover}></div>
            <div className={styles.bookInfo}>
              <p className={`${styles.bookTitle} ${afacad.className}`}>{book.title}</p>
              <p className={`${styles.bookAuthor} ${afacad.className}`}>{book.author}</p>
              <p className={`${styles.bookPrice} ${afacad.className}`}>฿{book.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
