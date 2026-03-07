"use client";
import styles from "./inventory.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
    const router = useRouter();
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);

  const getStatusClass = (status) => {
    if (status === "Published") return styles.published;
    if (status === "Out of Stock") return styles.out;
    if (status === "Inactive") return styles.inactive;
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    const res = await fetch("/api/auth/books");
    const data = await res.json();

    if (data.success) {
      setBooks(data.data);
    }
  }

  const booksPerPage = 5;

  const last = page * booksPerPage;
  const first = last - booksPerPage;

  const currentBooks = books.slice(first, last);

  const totalPages = Math.ceil(books.length / booksPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>All Books</h2>

        <button
          className={styles.addBtn}
          onClick={() => router.push("/seller/addbooks")}
        >
          + Add New Book
        </button>
      </div>

      <input className={styles.search} placeholder="Search Book..." />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Book</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Date Added</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {currentBooks.map((book) => (
              <tr key={book._id}>
                <td className={styles.bookCell}>
                  <div className={styles.bookInfo}>
                    <img
                      src={book.images?.[0] || "/no-image.png"}
                      className={styles.bookImage}
                    />

                    <div>
                      <div className={styles.bookTitle}>{book.title}</div>

                      <div className={styles.bookAuthor}>{book.author}</div>
                    </div>
                  </div>
                </td>

                <td>฿ {book.price}.00</td>

                <td>{book.stock}</td>

                <td>{new Date(book.createdAt).toLocaleDateString()}</td>

                <td className={getStatusClass(book.status)}>{book.status}</td>

                <td>
                  <button className={styles.editBtn}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        Page {page} of {totalPages}
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          {"<"}
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
