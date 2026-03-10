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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [books, setBooks] = useState([]);

  const filteredBooks = books.filter((book) => {
    const title = book.title?.toLowerCase() || "";
    const author = book.author?.toLowerCase() || "";
    const query = activeQuery.toLowerCase();
    return title.includes(query) || author.includes(query);
  });

  // 🔹 สร้าง Function สำหรับกดปุ่ม
  const handleSearch = () => {
    setActiveQuery(searchQuery);
  };

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch("/api/auth/books");
      const data = await res.json();
      setBooks(data.data);
    };

    fetchBooks();
  }, []);

  if (!mounted) return null;
  if (!user) return null;

  
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
          <button
            className={`${styles.searchButton} ${afacad.className}`}
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div className={styles.greetingRow}>
        <div className={styles.avatar}>
          <img src="/boy.png" alt="profile" />
        </div>
        <div className={`${styles.greeting} ${afacad.className}`}>
          Hi {user.name} !
        </div>
      </div>

      {/* Recently Added Books */}
      <div className={`${styles.sectionTitle} ${afacad.className}`}>
        Recently Added Books
      </div>
      <div className={styles.booksGrid}>
        {/* 🔹 เช็คว่ามีข้อมูลที่กรองออกมาไหม */}
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book._id} className={styles.bookCard}>
              {/* ... ไส้ใน Card เหมือนเดิมของคุณ ... */}
              <div className={styles.bookCover}>
                <img src={book.images?.[0]} alt={book.title} />
              </div>
              <div className={styles.bookInfo}>
                <p className={`${styles.bookTitle} ${afacad.className}`}>
                  {book.title}
                </p>
                <p className={`${styles.bookAuthor} ${afacad.className}`}>
                  By {book.author || "Unknown Author"}
                </p>
                <p className={`${styles.bookSeller} ${afacad.className}`}>
                  Seller: {book.sellerName}
                </p>
                <p className={`${styles.bookPrice} ${afacad.className}`}>
                  ฿{book.price}
                </p>
              </div>
            </div>
          ))
        ) : (
          /* 🔹 แสดงส่วนนี้เมื่อ Search แล้วไม่เจออะไรเลย */
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>📚🔍</div>
            <h3 className={afacad.className}>Oops! No books found</h3>
            <p className={afacad.className}>
              We couldn't find any books matching "
              <strong>{searchQuery}</strong>"
            </p>
            <button
              className={`${styles.clearButton} ${afacad.className}`}
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
