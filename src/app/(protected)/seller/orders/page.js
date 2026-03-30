"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Caveat, Afacad } from "next/font/google";
import styles from "./order.module.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const tabs = [
  "All",
  "Pending",
  "To Ship",
  "In Transit",
  "Completed",
  "Canceled",
];

const ITEMS_PER_PAGE = 6;

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersData, setOrdersData] = useState([]);
  const [booksData, setBooksData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await fetch("/api/auth/orders");
        const booksRes = await fetch("/api/auth/books");

        const ordersJson = await ordersRes.json();
        const booksJson = await booksRes.json();

        setOrdersData(ordersJson.data || []);
        setBooksData(booksJson.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const sellerBookIds = booksData.map((b) => String(b._id));

  const sellerOrders = ordersData.filter((order) =>
    sellerBookIds.includes(String(order.bookId)),
  );

  const ordersWithBook = sellerOrders.map((order) => {
    const book = booksData.find((b) => String(b._id) === String(order.bookId));

    return {
      ...order,
      book,
    };
  });

  const filteredOrders = useMemo(() => {
    return ordersWithBook.filter((order) => {
      const matchesTab =
        activeTab === "All" ? true : order.status === activeTab;

      const keyword = search.trim().toLowerCase();

      const matchesSearch =
        keyword === ""
          ? true
          : order.id?.toLowerCase().includes(keyword) ||
            order.book?.title?.toLowerCase().includes(keyword);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, search, ordersWithBook]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
  );

  useEffect(() => setCurrentPage(1), [activeTab, search]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const formatStatus = (status) => {
    switch (status) {
      case "Pending":
        return "Pending";
      case "Paid":
        return "To Ship";
      case "Shipped":
        return "In Transit";
      case "Completed":
        return "Completed";
      case "Canceled":
        return "Canceled";
      default:
        return status;
    }
  };
  
  return (
    <main className={`${afacad.className} ${styles.page}`}>
      <section className={styles.content}>
        <h2 className={styles.title}>All Orders</h2>

        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${styles.tab} ${
                activeTab === tab ? styles.tabActive : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <input
          className={styles.search}
          placeholder="Search by Order Number or Book Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.tableCard}>
          <div className={styles.headerRow}>
            <div>Order Number</div>
            <div>Book Name</div>
            <div>Buyer</div>
            <div>Payment</div>
            <div>Status</div>
          </div>

          {paginatedOrders.map((o, i) => (
            <div key={i} className={styles.row}>
              <div>
                <div className={styles.orderId}>{o.id}</div>
                <div className={styles.date}>
                  {new Date(o.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className={styles.book}>
                <img
                  src={o.book?.images?.[0] || "/placeholder.png"}
                  className={styles.thumb}
                />

                <div className={styles.bookInfo}>
                  <div className={styles.bookTitle}>
                    {o.book?.title || "No title"}
                  </div>

                  <div className={styles.quantity}>Quantity : {o.quantity}</div>
                </div>
              </div>

              <div>{o.buyerName}</div>
              <div>฿ {o.total}</div>

              <div className={styles.statusColumn}>
                <button
                  className={`${styles.status} ${
                    styles[formatStatus(o.status).replace(" ", "")]
                  }`}
                >
                  {formatStatus(o.status)}
                </button>

                {formatStatus(o.status) === "To Ship" && (
                  <button
                    className={styles.tracking}
                    onClick={() =>
                      router.push(`/seller/orderDetail?id=${o._id}`)
                    }
                  >
                    + Add Tracking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.paginationRow}>
          <span className={styles.pageText}>
            Page {Math.min(currentPage, totalPages)} of {totalPages}
          </span>

          <div className={styles.paginationButtons}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              {"<"}
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              {">"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
