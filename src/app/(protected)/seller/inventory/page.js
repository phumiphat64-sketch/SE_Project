"use client";
import styles from "./inventory.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function InventoryPage() {
    const router = useRouter();
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const getStatusClass = (status) => {
    if (status === "Published") return styles.published;
    if (status === "Out of Stock") return styles.out;
    if (status === "Inactive") return styles.inactive;
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    const res = await fetch("/api/auth/books", {
      cache: "no-store",
    });

    const data = await res.json();

    if (data.success) {
      setBooks(data.data);
    }
  }

  const booksPerPage = 5;

  const sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title));

  const last = page * booksPerPage;
  const first = last - booksPerPage;

  const filteredBooks = search
    ? binarySearch(sortedBooks, search.toLowerCase())
    : sortedBooks;

  const currentBooks = filteredBooks.slice(first, last);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    const results = [];

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      let title = arr[mid].title.toLowerCase();

      if (title.includes(target)) {
        results.push(arr[mid]);

        let l = mid - 1;
        while (l >= 0 && arr[l].title.toLowerCase().includes(target)) {
          results.push(arr[l]);
          l--;
        }

        let r = mid + 1;
        while (r < arr.length && arr[r].title.toLowerCase().includes(target)) {
          results.push(arr[r]);
          r++;
        }

        break;
      }

      if (title < target) left = mid + 1;
      else right = mid - 1;
    }

    return results;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.header} ${afacad.className}`}>
        <h2>All Books</h2>

        <button
          className={`${styles.addBtn} ${afacad.className}`}
          onClick={() => router.push("/seller/addbooks")}
        >
          + Add New Book
        </button>
      </div>

      <input
        className={`${styles.search} ${afacad.className}`}
        placeholder="Search Book..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={`${styles.tableContainer} ${afacad.className}`}>
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
                  <button
                    className={`${styles.editBtn} ${afacad.className}`}
                    onClick={() => router.push(`/seller/editbook/${book._id}`)}
                  >
                    <img src="/icons/pen.svg" className={styles.editIcon} />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`${styles.pagination} ${afacad.className}`}>
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
