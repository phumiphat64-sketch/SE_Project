import Image from "next/image";
import Link from "next/link";
import "./globals.css";

import { Crimson_Text, Caveat } from "next/font/google";
import BookCarousel from "./components/BookCarousel";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Home() {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className={`logo-text ${caveat.className}`}>ReRead</h1>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h2 className={`hero-title ${caveat.className}`}>ReRead</h2>
        <p className={`hero-sub ${caveat.className}`}>
          Give books a second life.
        </p>
        <p className={`hero-sub2 ${caveat.className}`}>BUY & SELL YOUR BOOKS</p>

        <div className="hero-search-wrapper">
          {/* Search Box */}
          <div className="search-box ${caveat.className}">
            <input
              type="text"
              placeholder="Browse Books"
              className={`${caveat.className} search-input`}
            />
            <button className="search-btn">🔍</button>
          </div>

          {/* Join Button */}
          <Link href="/login" className={`btn-filled ${caveat.className}`}>
            Join Now
          </Link>
        </div>
      </section>

      {/* Featured Books */}
      <section className="featured">
        <h2 className="section-title">
          <span
            className={caveat.className}
            style={{
              fontSize: "4.5rem",
              color: "#5b3d31",
              fontWeight: 700,
            }}
          >
            ReRead
          </span>
          <span
            className={`hero-sub2 ${caveat.className}`}
            style={{ fontSize: "2.8rem" }}
          >
            Where books find new homes.
          </span>
        </h2>

        <BookCarousel books={books} />
      </section>

      {/* Why Readers Love Us */}
      <section className="why">
        <h2 className="section-title">Why Readers Love Us</h2>

        <div className="why-grid">
          <div className="why-card">Affordable Second-Hand Books</div>
          <div className="why-card">Safe & Easy Transactions</div>
          <div className="why-card">Support Sustainable Reading</div>
        </div>
      </section>

      {/* Get Started */}
      <section className="get-started">
        <h2 className="section-title">Get Started with ReRead</h2>

        <div className="start-grid">
          <div className="start-card">
            <h3>For Buyers</h3>
            <p>Search, compare, and buy second-hand books easily.</p>
          </div>
          <div className="start-card">
            <h3>For Sellers</h3>
            <p>List your books and reach readers everywhere.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          {/* Left Section */}
          <div className="footer-left">
            <Image src="/books/-_5.png" alt="books" width={400} height={260} />

            <div className="footer-about">
              <h3>About Us</h3>

              <div className="email-row">
                <Image
                  src="/icons/mail.png"
                  alt="mail"
                  width={22}
                  height={22}
                />
                <span>reread.secondhandbook@gmail.com</span>
              </div>

              <div className="social-icons">
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
          <div className="footer-column">
            <h3>Support</h3>
            <p>Contact Customer Service</p>
            <p>Terms and Conditions of Use</p>
            <p>Privacy Policy</p>
            <p>How to Use</p>
          </div>

          {/* Right Section */}
          <div className="footer-column">
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

const books = [
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    seller: "Sellername",
    image: "/books/rectangle-1.webp",
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
    seller: "Sellername",
    image: "/books/rectangle-2.webp",
  },
  {
    title: "Harry Potter and the Prisoner of Azkaban",
    author: "J.K. Rowling",
    seller: "Sellername",
    image: "/books/rectangle-3.webp",
  },
  {
    title: "Harry Potter and the Goblet of Fire",
    author: "J.K. Rowling",
    seller: "Sellername",
    image: "/books/rectangle-4.webp",
  },
  {
    title: "Harry Potter and the Order of the Phoenix",
    author: "J.K. Rowling",
    seller: "Sellername",
    image: "/books/rectangle-5.webp",
  },
  {
    title: "Harry Potter and the Half-Blood Prince",
    author: "J.K. Rowling",
    seller: "Sellername",
    image: "/books/rectangle-6.webp",
  },
  {
    title: "Harry Potter and the Deathly Hallows",
    author: "J.K. Rowling",
    seller: "Sellername",
    image: "/books/rectangle-7.webp",
  },
  {
    title: "Fantastic Beasts: The Crimes of Grindelwald",
    author: "J.K. Rowling",
    seller: "Sellername",
    image: "/books/rectangle-10.webp",
  },
  {
    title: "Fantastic Beasts and Where to Find Them",
    author: "J.K. Rowling",
    seller: "Sellername",
    image: "/books/rectangle-11.webp",
  },
];
