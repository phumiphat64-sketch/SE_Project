import Image from "next/image";
import Link from "next/link";
import BookCarousel from "../components/BookCarousel";
import styles from "./main.module.css";
import {
  Crimson_Text,
  Caveat,
  Afacad,
  IBM_Plex_Sans_Thai,
} from "next/font/google";
import TypingInput from "../components/TypingInput";

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

export const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai"],
  weight: ["400", "500", "600"],
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
                <TypingInput
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
          <h2 className={`${styles.sectionTitle} ${caveat.className}`}>
            Why Readers Love Us
          </h2>

          <div className={styles.reviewGrid}>
            <div className={`${styles.reviewCard} ${afacad.className}`}>
              <div className={styles.reviewTop}>
                <div className={styles.stars}>★★★★★</div>
                <div className={styles.date}>Jan 2026</div>
              </div>

              <div className={styles.reviewUser}>
                <div
                  className={styles.avatarWrap}
                  style={{ background: "#fde2e4" }} // 👈 ใส่ตรงนี้
                >
                  <img
                    className={styles.avatar}
                    src="https://api.dicebear.com/7.x/adventurer/svg?seed=Mint"
                    alt="Mint"
                  />
                </div>

                <div className={styles.reviewName}>Mint</div>
              </div>

              <p className={`${styles.reviewText} ${ibmPlexThai.className}`}>
                คนรักหนังสือแบบเราชอบมาก
                <br />
                บางเล่มเลิกผลิตไปแล้ว
                <br />
                แต่มีคนเอามาลงขาย ดีใจ
              </p>
            </div>

            <div className={`${styles.reviewCard} ${afacad.className}`}>
              <div className={styles.reviewTop}>
                <div className={styles.stars}>★★★★★</div>
                <div className={styles.date}>Jan 2026</div>
              </div>

              <div className={styles.reviewUser}>
                <div
                  className={styles.avatarWrap}
                  style={{ background: "#e0f7fa" }}
                >
                  <img
                    className={styles.avatar}
                    src="https://api.dicebear.com/7.x/adventurer/svg?seed=Sharron"
                    alt="Sharron"
                  />
                </div>

                <div className={styles.reviewName}>Sharron</div>
              </div>

              <p className={`${styles.reviewText} ${ibmPlexThai.className}`}>
                เริ่ดมากคุณน้า
                <br />
                ตามหาหนังสือมานานมาก
                <br />
                สั่งวันนี้พรุ่งนี้ได้ ไม่มิจจี้ ไม่จกตา
              </p>
            </div>

            <div className={`${styles.reviewCard} ${afacad.className}`}>
              <div className={styles.reviewTop}>
                <div className={styles.stars}>★★★★☆</div>
                <div className={styles.date}>Jan 2026</div>
              </div>

              <div className={styles.reviewUser}>
                <div
                  className={styles.avatarWrap}
                  style={{ background: "#fff3cd" }}
                >
                  <img
                    className={styles.avatar}
                    src="https://api.dicebear.com/7.x/adventurer/svg?seed=Audrey"
                    alt="Audrey"
                  />
                </div>

                <div className={styles.reviewName}>Audrey</div>
              </div>

              <p className={`${styles.reviewText} ${ibmPlexThai.className}`}>
                เว็บไซต์ใช้งานง่าย ขายได้สะดวก
                <br />
                ลูกค้ายืนยันปุ๊บ เงินเข้าเลย
              </p>
            </div>
          </div>
        </section>

        {/* Get Started */}
        <section className={styles.startSectionNew}>
          <h2 className={`${styles.sectionTitle} ${caveat.className}`}>
            Get Started with ReRead
          </h2>

          <div className={styles.startGridNew}>
            <div className={styles.startCardNew}>
              <div>
                <h3 className={`${styles.startHeading} ${crimson.className}`}>
                  For Buyers
                </h3>
                <ul className={`${styles.startList} ${crimson.className}`}>
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
                <h3 className={`${styles.startHeading} ${crimson.className}`}>
                  For Sellers
                </h3>
                <ul className={`${styles.startList} ${crimson.className}`}>
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
          {/* Column 1: Book Image */}
          {/* Column 1: Book Image */}
          <div className={styles.bookAbsolute}>
            <Image
              src="/books/NewBook.png" /* 👈 เปลี่ยนเป็นชื่อไฟล์ใหม่ของคุณ (ระวังเรื่อง Path ด้วยนะครับ) */
              alt="books"
              width={280} /* 👈 ขนาดจะเท่ากับตัวหนังสือจริงๆ แล้ว */
              height={280}
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Column 2: About Us */}
          <div className={styles.footerColumn}>
            <div className={`${styles.footerColumn} ${crimson.className}`}>
              <h3>About Us</h3>

              <div className={styles.emailRow}>
                <Image src="/mail.svg" alt="mail" width={26} height={26} />
                <span>reread.secondhandbook@gmail.com</span>
              </div>

              <div className={styles.socialIcons}>
                <Image src="/fb.svg" alt="facebook" width={36} height={36} />
                <Image src="/ig.svg" alt="instagram" width={36} height={36} />
              </div>
            </div>
          </div>

          {/* Column 3: Support */}
          <div className={styles.footerColumn}>
            <h3 className={crimson.className}>Support</h3>
            <p>Contact Customer Service</p>
            <p>Terms and Conditions of Use</p>
            <p>Privacy Policy</p>
            <p>How to Use</p>
          </div>

          {/* Column 4: ติดต่อเรา */}
          <div className={styles.footerColumn}>
            <h3>ติดต่อเรา</h3>
            <p>ReRead.SecondHandBook</p>
            <p>เลขที่ 1518 ถนนประชาราษฎร์ 1</p>
            <p>แขวงวงศ์สว่าง เขตบางซื่อ</p> {/* แก้ไขให้ตรงตามรูป */}
            <p>กรุงเทพฯ 10800</p> {/* แก้ไขให้ตรงตามรูป */}
          </div>
        </div>
      </footer>
    </div>
  );
}
