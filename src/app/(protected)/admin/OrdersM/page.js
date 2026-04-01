"use client";

import { useMemo, useState, useEffect} from "react";
import styles from "./OrM.module.css";


export default function OrdersManagementPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/auth/admin/orders");
        const result = await res.json();

        const ordersArray = Array.isArray(result.orders)
          ? result.orders
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result)
              ? result
              : [];

        const formatted = ordersArray.map((item) => ({
          id: item._id.toString(),
          orderNumber: item.id,
          bookName: item.bookName,
          buyer: item.buyerName || "Unknown",
          date: item.placedOn,
          status: convertStatus(item.status),
          price: item.price,
          images: item.images,
        }));

        setOrders(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  const convertStatus = (status) => {
    const s = status?.toLowerCase();

    const map = {
      pending: "Pending",
      paid: "To Ship",
      "in transit": "In Transit",
      delivered: "Complete",
      cancelled: "Cancel",
      canceled: "Cancel", // ✅ รองรับทั้ง 2 แบบ
    };

    return map[s] || "Pending";
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const term = search.toLowerCase();
      const match =
        order.orderNumber.toLowerCase().includes(term) ||
        order.bookName.toLowerCase().includes(term) ||
        order.buyer.toLowerCase().includes(term);

      const statusMatch = !statusFilter || order.status === statusFilter;

      return match && statusMatch;
    });
  }, [orders, search, statusFilter]);

   const totalPages = Math.max(
     1,
     Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
   );

   const paginatedOrders = useMemo(() => {
     const start = (page - 1) * ITEMS_PER_PAGE;
     return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
   }, [filteredOrders, page]);

   const goPrev = () => setPage((p) => Math.max(1, p - 1));
   const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

   const handleCancel = async (order) => {
     try {
       // ✅ ถ้าเป็น Pending → ยิง DB
       if (order.status === "Pending") {
         const res = await fetch(`/api/auth/admin/orders/${order.id}/cancel`, {
           method: "PATCH",
         });

         if (!res.ok) {
           alert("Cancel failed");
           return;
         }

         const data = await res.json(); 


         if (!res.ok) {
           alert("Cancel failed");
           return;
         }
       }

       // ✅ update UI (ทุกกรณี)
       setOrders((prev) =>
         prev.map((o) => (o.id === order.id ? { ...o, status: "Cancel" } : o)),
       );

       setSelectedOrder((prev) => ({
         ...prev,
         status: "Cancel",
       }));
     } catch (err) {
       console.error(err);
     }
   };

  return (
    <main className={styles.page}>
      <div className={styles.subBar} />

      <section className={styles.container}>
        <h1 className={styles.pageTitle}>Orders management</h1>

        {/* SEARCH */}
        <div className={styles.searchWrapper}>
          <input
            className={styles.searchInput}
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value); // ✅ แก้ตรงนี้
              setPage(1);
            }}
          />
        </div>

        {/* FILTER */}
        <div className={styles.filterRow}>
          <select
            className={styles.dropdown}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="" disabled hidden>
              Status
            </option>

            <option value="Pending">Pending</option>
            <option value="To Ship">To Ship</option>
            <option value="In Transit">In Transit</option>
            <option value="Complete">Complete</option>
            <option value="Cancel">Cancel</option>
          </select>
        </div>

        {/* TABLE */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Book Name</th>
                <th>Buyer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.bookName}</td>
                  <td>{order.buyer}</td>
                  <td>{order.date}</td>

                  <td>
                    <span
                      className={`${styles.statusText} ${
                        order.status === "Pending"
                          ? styles.pending
                          : order.status === "To Ship"
                            ? styles.toShip
                            : order.status === "In Transit"
                              ? styles.inTransit
                              : order.status === "Cancel"
                                ? styles.cancel
                                : styles.complete
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      Detail
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.paginationRow}>
          <span className={styles.pageText}>
            Page {Math.min(page, totalPages)} of {totalPages}
          </span>

          <button onClick={goPrev} className={styles.pageButton}>
            {"<"}
          </button>

          <button onClick={goNext} className={styles.pageButton}>
            {">"}
          </button>
        </div>
      </section>

      {/* MODAL */}
      {selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            {/* HEADER */}
            <div className={styles.modalHeader}>
              <h2>Order Details</h2>

              <button
                className={styles.closeBtn}
                onClick={() => setSelectedOrder(null)}
              >
                {/* 👉 ใส่ icon ของคุณตรงนี้ */}
                <img src="/cross.png" alt="close" />
              </button>
            </div>

            {/* SECTION */}
            <div className={styles.sectionHeader}>
              <span>Order Information</span>
            </div>

            <div className={styles.formGrid}>
              {/* LEFT (รูปหนังสือ) */}
              <div className={styles.avatarBox}>
                <img
                  src={selectedOrder.images?.[0] || "/book-placeholder.png"}
                  alt="book"
                />
              </div>

              {/* RIGHT (ข้อมูล) */}
              <div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Book Name:</label>
                    <input value={selectedOrder.bookName} readOnly />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Price:</label>
                    <input value={`฿${selectedOrder.price || "-"}`} readOnly />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Order Number:</label>
                    <input value={selectedOrder.orderNumber} readOnly />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Status:</label>
                    <span
                      className={`${styles.statusText} ${
                        selectedOrder.status === "Pending"
                          ? styles.pending
                          : selectedOrder.status === "To Ship"
                            ? styles.toShip
                            : selectedOrder.status === "In Transit"
                              ? styles.inTransit
                              : selectedOrder.status === "Cancel"
                                ? styles.cancel
                                : styles.complete
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Buyer:</label>
                    <input value={selectedOrder.buyer} readOnly />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Date:</label>
                    <input value={selectedOrder.date} readOnly />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className={styles.modalActions}>
              <button
                className={`${styles.actionBtn} ${styles.cancelBtn}`}
                onClick={() => handleCancel(selectedOrder)}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
