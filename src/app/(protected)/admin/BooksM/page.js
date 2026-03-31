"use client";

import { useMemo, useState, useEffect} from "react";
import styles from "../UserM/Um.module.css"; // ⭐ reuse CSS เดิม

export default function BooksManagementPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/auth/admin/books"); // 👈 endpoint ของคุณ
        const data = await res.json();

        console.log(data);

        const formatted = (data.data || data).map((b) => ({
          id: b._id,
          name: b.title,
          dateAdded: new Date(b.createdAt).toLocaleDateString(),
          price: b.price,
          status: b.status,
          sellerName: b.sellerName || "-", // ⭐ เพิ่มตรงนี้
        }));

        setBooks(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return (Array.isArray(books) ? books : []).filter((b) => {
      const matchSearch = (b.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        !statusFilter ||
        (statusFilter === "Approved" && b.status === "Published") ||
        b.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [books, search, statusFilter]);

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

   const paginatedBooks = filteredBooks.slice(
     (currentPage - 1) * itemsPerPage,
     currentPage * itemsPerPage,
   );

  return (
    <main className={styles.page}>
      <div className={styles.subBar} />

      <section className={styles.container}>
        <h1 className={styles.pageTitle}>Books management</h1>

        <div className={styles.contentWrap}>
          {/* 🔍 Search */}
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search by Book..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 🔽 Filter */}
          <div className={styles.filterRow}>
            <div className={styles.leftControls}>
              <select
                className={styles.dropdown}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status</option>
                <option value="Approved">Approved</option>
                <option value="Restrict">Restrict</option>
              </select>
            </div>
          </div>

          {/* 📊 Table */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Date Added</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedBooks.map((book) => {
                  const displayStatus =
                    book.status === "Published" ? "Approved" : book.status;

                  return (
                    <tr key={book.id}>
                      <td>{book.name}</td>
                      <td>{book.dateAdded}</td>
                      <td>฿{book.price}</td>

                      <td>
                        <span
                          className={`${styles.status} ${
                            displayStatus === "Approved"
                              ? styles.active
                              : styles.inactive
                          }`}
                        >
                          {displayStatus}
                        </span>
                      </td>

                      <td className={styles.actionCell}>
                        <div className={styles.actionInner}>
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedBook(book);
                              setIsDetailOpen(true);
                            }}
                          >
                            Details
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className={styles.vline3}></div>
            <div className={styles.vline4}></div>
          </div>

          {/* 📄 Pagination */}
          <div className={styles.paginationRow}>
            <span className={styles.pageText}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              className={styles.pageButton}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              {"<"}
            </button>

            <button
              className={styles.pageButton}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              {">"}
            </button>
          </div>
        </div>
      </section>

      {isDetailOpen && selectedBook && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h2>Book Details</h2>
            </div>

            <button
              className={styles.closeBtn}
              onClick={() => setIsDetailOpen(false)}
            >
              <img src="/cross.png" alt="close" />
            </button>

            {/* Section */}
            <div className={styles.sectionHeader}>
              <span>Book Information</span>
            </div>

            <div className={styles.formGrid}>
              {/* Image */}
              <div className={styles.avatarBox}>
                <div style={{ width: 120, height: 120, background: "#ccc" }} />
              </div>

              {/* Info */}
              <div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Book Name:</label>
                    <input value={selectedBook.name} readOnly />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Price:</label>
                    <input value={`฿${selectedBook.price}`} readOnly />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>By:</label>
                    <input value={"Author"} readOnly />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Date:</label>
                    <input value={selectedBook.dateAdded} readOnly />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Seller:</label>
                    <input value={selectedBook.sellerName || "-"} readOnly />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Status:</label>

                    <select
                      className={`${styles.statusDropdown} ${
                        selectedBook.status === "Published"
                          ? styles.active
                          : styles.inactive
                      }`}
                      value={
                        selectedBook.status === "Published"
                          ? "Approved"
                          : selectedBook.status
                      }
                      onChange={(e) => {
                        const newStatus =
                          e.target.value === "Approved"
                            ? "Published"
                            : "Restrict";

                        setSelectedBook({
                          ...selectedBook,
                          status: newStatus,
                        });
                      }}
                    >
                      <option value="Approved">Approved</option>
                      <option value="Restrict">Restrict</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={styles.sectionHeader}>
              <span>About this book:</span>
            </div>

            <div style={{ padding: "10px 0", color: "#3f312a" }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit...
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
