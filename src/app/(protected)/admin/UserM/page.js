"use client";

import { useMemo, useState , useEffect } from "react";
import styles from "./Um.module.css";

const ITEMS_PER_PAGE = 8;

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/auth/users"); // 👈 endpoint
        const data = await res.json();

        // map ให้ตรงกับ UI
        const formatted = data.map((u) => ({
          id: u._id,
          account: u.name,
          email: u.email,
          role: u.role === "seller" ? "Seller" : "Buyer",

          // ⭐ fix ตามที่ขอ: default Active
          status: u.status === "inactive" ? "Inactive" : "Active",
        }));

        setUsers(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const toggleStatus = async (id) => {
  try {
    const res = await fetch(`/api/auth/users/${id}/toggle`, {
      method: "PATCH",
    });

    console.log("calling toggle:", id);

    const data = await res.json();

    // update UI
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: data.status === "inactive" ? "Inactive" : "Active" }
          : u
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  // 🔍 filter
  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase();
    return users.filter(
      (u) =>
        u.account.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword),
    );
  }, [users, search]);

  // 📄 pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <main className={styles.page}>
      <div className={styles.subBar} />

      <section className={styles.container}>
        <h1 className={styles.pageTitle}>Users management</h1>

        <div className={styles.contentWrap}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search by Account...."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.filterRow}>
            <div className={styles.leftControls}>
              <select className={styles.dropdown} defaultValue="">
                <option value="" disabled hidden>
                  User role
                </option>
                <option value="Seller">Seller</option>
                <option value="Buyer">Buyer</option>
              </select>

              <select className={styles.dropdown} defaultValue="">
                <option value="" disabled hidden>
                  Status
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button className={styles.addUserBtn}>+ add user</button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.account}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <span
                          className={`${styles.status} ${
                            user.status === "Active"
                              ? styles.active
                              : styles.inactive
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className={styles.actionCell}>
                        <div className={styles.actionInner}>
                          <img
                            src="/icons/visibility.svg"
                            className={styles.icon}
                          />
                          <img src="/icons/edit.svg" className={styles.icon} />

                          <img
                            src={
                              user.status === "Active"
                                ? "/icons/toggle_on.svg"
                                : "/icons/toggle_off.svg"
                            }
                            className={styles.icon}
                            onClick={() => toggleStatus(user.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: 20 }}
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className={styles.vline3}></div>
            <div className={styles.vline4}></div>
          </div>
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
    </main>
  );
}
