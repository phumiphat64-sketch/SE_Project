"use client";
import { useEffect, useState } from "react";
import styles from "./buyer.module.css";
import { Crimson_Text, Caveat, Afacad, IBM_Plex_Mono } from "next/font/google";
import { useRouter } from "next/navigation";

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
  // เพิ่มในส่วน Hook ด้านบน
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const router = useRouter();

  // ฟังก์ชันเลื่อนไปรูปถัดไป (Next Image)
  

  // Function สำหรับเปิด Modal
  const openModal = (book) => {
    setSelectedBook(book);
    setActiveImage(0);
    setShowModal(true);
  };

  // Function สำหรับปิด Modal
  const closeModal = () => {
    setSelectedBook(null);
    setShowModal(false);
  };

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
    if (selectedBook) {
      setBuyQuantity(1);
    }
  }, [selectedBook]);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const stockAvailable = selectedBook?.Quantity || selectedBook?.quantity || 1;

  const handleDecrease = () => setBuyQuantity((prev) => Math.max(1, prev - 1));

  const handleIncrease = () =>
    setBuyQuantity((prev) => Math.min(stockAvailable, prev + 1));

  const handleInputChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > stockAvailable) val = stockAvailable; // ห้ามกรอกเกินสต๊อก
    setBuyQuantity(val);
  };

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
            <div
              key={book._id}
              className={styles.bookCard}
              onClick={() => openModal(book)}
              style={{ cursor: "pointer" }}
            >
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

      {showModal && selectedBook && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ส่วนหัวที่มีขีดคั่นด้านล่าง */}
            <div className={styles.modalHeader}>
              <button className={styles.closeButton} onClick={closeModal}>
                {/* 🔹 ใส่รูปไอคอนกากบาทของคุณที่นี่ */}
                <img src="/cross.png" alt="close" />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* ฝั่งซ้าย: Gallery รูปภาพ */}
              <div className={styles.imageGallery}>
                <div className={styles.mainImage}>
                  <img
                    src={selectedBook.images?.[activeImage || 0]}
                    alt={selectedBook.title}
                  />
                </div>

                {/* ส่วน "รูปมุมอื่น" จะแสดงตามจำนวนรูปใน DB */}
                <div className={styles.thumbnailRow}>
                  {selectedBook.images?.map((img, index) => (
                    <div
                      key={index}
                      className={`${styles.thumbnail} ${activeImage === index ? styles.activeThumb : ""}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={img} alt={`view ${index}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* ฝั่งขวา: รายละเอียด (ยืดตามเนื้อหา) */}
              <div className={styles.bookDetails}>
                <div className={styles.detailHeader}>
                  <h2 className={afacad.className}>{selectedBook.title}</h2>
                  {/* ฿ ย้ายมาอยู่ตรงนี้ เพื่อให้อยู่บรรทัดเดียวกับชื่อ */}
                  <span className={`${styles.detailPrice} ${afacad.className}`}>
                    ฿{selectedBook.price}
                  </span>
                </div>
                <p className={`${styles.detailAuthor} ${afacad.className}`}>
                  By {selectedBook.author || "Unknown Author"}
                </p>

                <div className={`${styles.descriptionBox} ${afacad.className}`}>
                  {selectedBook.description}
                </div>

                <div
                  className={`${styles.quantitySection} ${afacad.className}`}
                >
                  <span className={styles.quantityLabel}>Quantity:</span>
                  <div className={styles.quantityControl}>
                    <button className={styles.qtyBtn} onClick={handleDecrease}>
                      -
                    </button>
                    <input
                      type="number"
                      className={`${styles.qtyInput} ${afacad.className}`}
                      value={buyQuantity}
                      onChange={handleInputChange}
                    />
                    <button className={styles.qtyBtn} onClick={handleIncrease}>
                      +
                    </button>
                  </div>
                  <span className={styles.stockLabel}>
                    ({stockAvailable} in stock)
                  </span>
                </div>

                <div className={`${styles.sellerInfo} ${afacad.className}`}>
                  <span className={styles.sellerLabel}>Seller</span>
                  <div className={styles.sellerNameText}>
                    {selectedBook.sellerName}
                  </div>
                </div>
              </div>
            </div>

            {/* ส่วนท้ายที่มีขีดคั่นด้านบนก่อนถึงปุ่ม Buy Now */}
            <div className={styles.modalFooter}>
              <button
                className={`${styles.buyButton} ${afacad.className}`}
                onClick={() => {
                  // 👈 แก้ไขการส่งข้อมูล: พ่วงจำนวนที่เลือกซื้อ (buyQuantity) ไปด้วย!
                  const checkoutData = {
                    ...selectedBook,
                    buyQuantity: buyQuantity,
                  };
                  localStorage.setItem(
                    "checkoutBook",
                    JSON.stringify(checkoutData),
                  );
                  router.push("/buyer/shopbook");
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
