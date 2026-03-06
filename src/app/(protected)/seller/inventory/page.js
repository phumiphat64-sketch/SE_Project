"use client";
import styles from "./inventory.module.css";

export default function InventoryPage() {
  const books = [
    {
      id: 1,
      title: "Book name",
      author: "by author",
      price: 190,
      stock: 1,
      date: "Jan 13, 2026",
      status: "Published",
    },
    {
      id: 2,
      title: "Book name",
      author: "by author",
      price: 190,
      stock: 1,
      date: "Jan 13, 2026",
      status: "Out Of Stock",
    },
    {
      id: 3,
      title: "Book name",
      author: "by author",
      price: 190,
      stock: 1,
      date: "Jan 13, 2026",
      status: "Inactive",
    },
    {
      id: 4,
      title: "Book name",
      author: "by author",
      price: 190,
      stock: 1,
      date: "Jan 13, 2026",
      status: "Published",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>All Books</h2>

        <button className={styles.addBtn}>+ Add New Book</button>
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
            {books.map((book) => (
              <tr key={book.id}>
                <td className={styles.bookCell}>
                  <div className={styles.bookInfo}>
                    <div className={styles.bookImage}></div>

                    <div>
                      <div className={styles.bookTitle}>{book.title}</div>

                      <div className={styles.bookAuthor}>{book.author}</div>
                    </div>
                  </div>
                </td>

                <td>฿ {book.price}.00</td>

                <td>{book.stock}</td>

                <td>{book.date}</td>

                <td>
                  <span className={styles.status}>{book.status}</span>
                </td>

                <td>
                  <button className={styles.editBtn}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>Page 1 of 2</div>
    </div>
  );
}
