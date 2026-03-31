import Image from "next/image";
import Link from "next/link";
import { Crimson_Text, Caveat } from "next/font/google";
import BookCarousel from "../components/BookCarousel";
import styles from "./main.module.css";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

async function getBooks() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/books/random`,
    {
      cache: "no-store",
    },
  );

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
                <button className={styles.searchBtn}>🔍</button>
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

        {/* Why Readers Love Us */}
        <section>
          <div className={styles.blockone}>
            <h2 className={styles.sectionTitle}>Why Readers Love Us</h2>

            <div className={styles.whyGrid}>
              <div className={styles.whyCard}>Affordable Second-Hand Books</div>
              <div className={styles.whyCard}>Safe & Easy Transactions</div>
              <div className={styles.whyCard}>Support Sustainable Reading</div>
            </div>
          </div>
        
          <div className={styles.getStartedBlock}>
            <h2 className={styles.sectionTitle}>Get Started with ReRead</h2>

            <div className={styles.startGrid}>
              <div className={styles.startCard}>
                <h3>For Buyers</h3>
                <p>Search, compare, and buy second-hand books easily.</p>
              </div>

              <div className={styles.startCard}>
                <h3>For Sellers</h3>
                <p>List your books and reach readers everywhere.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          {/* Left Section */}
          <div className={styles.footerLeft}>
            <Image src="/books/-_5.png" alt="books" width={400} height={260} />

            <div>
              <h3>About Us</h3>

              <div className={styles.emailRow}>
                <Image
                  src="/icons/mail.png"
                  alt="mail"
                  width={22}
                  height={22}
                />
                <span>reread.secondhandbook@gmail.com</span>
              </div>

              <div className={styles.socialIcons}>
                <Image
                  src="/icons/facebook.png"
                  alt="facebook"
                  width={28}
                  height={28}
                />
                <Image
                  src="/icons/instagram.png"
                  alt="instagram"
                  width={28}
                  height={28}
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
