import Image from "next/image";
import Link from "next/link";
import BookCarousel from "../components/BookCarousel";
import styles from "./main.module.css";
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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getBooks() {
  const res = await fetch(`${baseUrl}/api/auth/books/random`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data.data || [];
}

export default async function Home() {
  const books = await getBooks();

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainContent}>
        <section className={styles.hero}>
          <h2 className={`${styles.heroTitle} ${caveat.className}`}>ReRead</h2>

          <p className={`${styles.heroSub} ${caveat.className}`}>
            Give books a second life.
          </p>

          <p className={`${styles.heroSub2} ${caveat.className}`}>
            BUY & SELL YOUR BOOKS
          </p>

          <div className={styles.heroSearchWrapper}>
            <div className={styles.searchBox}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Browse Books"
                  className={`${styles.searchInput} ${caveat.className}`}
                />
                <button className={styles.searchBtn}>
                  <img src="search.svg" alt="search" />
                </button>
              </div>

              <Link
                href="/login"
                className={`${styles.btnFilled} ${caveat.className}`}
              >
                Join Now
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Books */}
        <section>
          <h2 className={styles.sectionTitle}>
            <span className={`${styles.brand} ${caveat.className}`}>
              ReRead
            </span>

            <span className={`${styles.tagline} ${caveat.className}`}>
              Where books find new homes.
            </span>
          </h2>

          <div className={styles.carouselWrapper}>
            <BookCarousel books={books} />
          </div>
        </section>

        {/* Reviews Section */}
        <section className={styles.reviewSection}>
          <h2 className={styles.sectionTitle}>Why Readers Love Us</h2>

          <div className={styles.reviewGrid}>
            <div className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <div className={styles.stars}>★★★★★</div>
                <div className={styles.date}>Jan 2026</div>
              </div>

              <div className={styles.reviewUser}>
                <img
                  className={styles.avatar}
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Mint"
                  alt="Mint"
                />
                <div className={styles.reviewName}>Mint</div>
              </div>

              <p className={styles.reviewText}>
                คนรักหนังสือแบบเราชอบมาก
                <br />
                บางเล่มเลิกผลิตไปแล้ว
                <br />
                แต่มีคนเอามาลงขาย ดีใจ
              </p>
            </div>

            <div className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <div className={styles.stars}>★★★★★</div>
                <div className={styles.date}>Jan 2026</div>
              </div>

              <div className={styles.reviewUser}>
                <img
                  className={styles.avatar}
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Sharron"
                  alt="Sharron"
                />
                <div className={styles.reviewName}>Sharron</div>
              </div>

              <p className={styles.reviewText}>
                เริ่ดมากคุณน้า
                <br />
                ตามหาหนังสือมานานมาก
                <br />
                สั่งวันนี้พรุ่งนี้ได้ ไม่มีงงี ไม่งอกตา
              </p>
            </div>

            <div className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <div className={styles.stars}>★★★★☆</div>
                <div className={styles.date}>Jan 2026</div>
              </div>

              <div className={styles.reviewUser}>
                <img
                  className={styles.avatar}
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Audrey"
                  alt="Audrey"
                />
                <div className={styles.reviewName}>Audrey</div>
              </div>

              <p className={styles.reviewText}>
                เว็บไซต์ใช้งานง่าย ขายได้สะดวก
                <br />
                ลูกค้ายืนยันปุ๊บ เงินเข้าเลย
              </p>
            </div>
          </div>
        </section>

        {/* Get Started */}
        <section className={styles.startSectionNew}>
          <h2 className={styles.sectionTitle}>Get Started with ReRead</h2>

          <div className={styles.startGridNew}>
            <div className={styles.startCardNew}>
              <div>
                <h3 className={styles.startHeading}>For Buyers</h3>
                <ul className={styles.startList}>
                  <li>Search for books by title, author, or category</li>
                  <li>View price and book condition</li>
                  <li>Add to cart and order easily</li>
                  <li>Track your order status</li>
                  <li>Read reviews before buying</li>
                </ul>
              </div>

              <div className={styles.cardImageWrap}>
                <img src="2_2.svg" alt="buyers" />
              </div>
            </div>

            <div className={styles.startCardNew}>
              <div>
                <h3 className={styles.startHeading}>For Sellers</h3>
                <ul className={styles.startList}>
                  <li>Post books quickly</li>
                  <li>Add details, images, and price</li>
                  <li>Manage listings anytime</li>
                  <li>Update shipping status</li>
                  <li>Reach more buyers online</li>
                </ul>
              </div>

              <div className={styles.cardImageWrap}>
                <img src="1_1.svg" alt="sellers" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          {/* Left Section */}
          <div className={styles.footerLeft}>
            <Image src="/books/-_5.png" alt="books" width={120} height={120} />

            <div className={styles.footerAbout}>
              <h3>About Us</h3>

              <div className={styles.emailRow}>
                <Image
                  src="/icons/mail.png"
                  alt="mail"
                  width={20}
                  height={20}
                />
                <span>reread.secondhandbook@gmail.com</span>
              </div>

              <div className={styles.socialIcons}>
                <Image
                  src="/icons/facebook.png"
                  alt="facebook"
                  width={24}
                  height={24}
                />
                <Image
                  src="/icons/instagram.png"
                  alt="instagram"
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className={styles.footerColumn}>
            <h3>Support</h3>
            <p>Contact Customer Service</p>
            <p>Terms and Conditions of Use</p>
            <p>Privacy Policy</p>
            <p>How to Use</p>
          </div>

          {/* Right Section */}
          <div className={styles.footerColumn}>
            <h3>ติดต่อเรา</h3>
            <p>ReRead.SecondHandBook</p>
            <p>เลขที่ 1518 ถนนประชาราษฎร์ 1</p>
            <p>แขวงบางซื่อ เขตบางซื่อ</p>
            <p>กรุงเทพ 10800</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
