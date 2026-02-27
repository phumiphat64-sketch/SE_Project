import Image from "next/image";

export default function Home() {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1>ReRead</h1>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h2 className="hero-title">ReRead</h2>
        <p className="hero-sub">Give books a second life.</p>
        <p className="hero-sub2">BUY & SELL YOUR BOOKS</p>

        <div className="hero-buttons">
          <button className="btn-outline">Browse Books</button>
          <button className="btn-filled">Join Now</button>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured">
        <h2 className="section-title">
          ReRead <span>Where books find new homes.</span>
        </h2>

        <div className="book-grid">
          {books.map((book, index) => (
            <div key={index} className="book-card">
              <Image
                src={book.image}
                alt={book.title}
                width={150}
                height={220}
                className="book-img"
              />
              <h4>{book.title}</h4>
              <p className="author">{book.author}</p>
              <p className="seller">🟢 {book.seller}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <h1>ReRead</h1>
        <div className="footer-links">
          <span>About</span>
          <span>Support</span>
          <span>FAQ</span>
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
    image: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
    seller: "Sellername",
    image: "https://covers.openlibrary.org/b/id/8231996-L.jpg",
  },
  {
    title: "Harry Potter and the Prisoner of Azkaban",
    author: "J.K. Rowling",
    seller: "Sellername",
    image: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
  },
  {
    title: "Harry Potter and the Goblet of Fire",
    author: "J.K. Rowling",
    seller: "Sellername",
    image: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
  },
];
