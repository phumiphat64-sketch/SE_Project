"use client";

import { useMemo, useState , useEffect } from "react";
import styles from "./Um.module.css";

const ITEMS_PER_PAGE = 8;

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [addFormData, setAddFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: "Seller",
  });

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

    return users.filter((u) => {
      const matchSearch =
        u.account.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword);

      const matchRole = !roleFilter || u.role === roleFilter;

      const matchStatus = !statusFilter || u.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

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

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = (phone) => {
    const regex = /^0[689]\d{8}$/;
    return regex.test(phone);
  };

  const isStrongPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };
  
  const bank = userDetail?.savedCards?.[0];

  const bankName = bank?.bankName || userDetail?.bankName || "-";

  const accountName = bank?.accountName || userDetail?.accountName || "-";

  const accountNumber = bank?.cardNumber || userDetail?.accountNumber || "-";

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
              <select
                className={styles.dropdown}
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1); // รีเซ็ตหน้า
                }}
              >
                <option value="">User role</option>
                <option value="Seller">Seller</option>
                <option value="Buyer">Buyer</option>
              </select>

              <select
                className={styles.dropdown}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button
              className={styles.addUserBtn}
              onClick={() =>
                setIsAddModalOpen(true)
              } /* 👈 ต้องมีบรรทัดนี้ เพื่อสั่งให้ Popup เปิด */
            >
              + Add User
            </button>
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
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  `/api/auth/userDetail/${user.id}`,
                                );
                                const data = await res.json();

                                setSelectedUser(user);
                                setUserDetail(data); // ⭐ ตัวจริงจาก DB
                                setIsDetailOpen(true);
                              } catch (err) {
                                console.error(err);
                              }
                            }}
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
      {isAddModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h2>Add User</h2>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setIsAddModalOpen(false)}
            >
              <img src="/cross.png" alt="close" />
            </button>

            <div className={styles.sectionHeader}>
              <span>User Information</span>
            </div>

            {/* ใช้ Grid แบ่ง 2 คอลัมน์ */}
            <div className={styles.formGrid}>
              {/* LEFT: Avatar */}
              <div className={styles.avatarBox}>
                <img src="/profile.png" alt="avatar" />
              </div>

              {/* RIGHT: Form */}
              <div>
                {/* แถวบน: Name + Role */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Name:</label>
                    <input
                      type="text"
                      placeholder="Enter User Name"
                      value={addFormData.name}
                      maxLength={100}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Role:</label>
                    <select
                      value={addFormData.role}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          role: e.target.value,
                        })
                      }
                    >
                      <option value="Seller">Seller</option>
                      <option value="Buyer">Buyer</option>
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div className={styles.formGroup}>
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    placeholder="Enter Phone Number"
                    value={addFormData.phoneNumber}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setAddFormData({
                        ...addFormData,
                        phoneNumber: value,
                      });
                    }}
                  />
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                  <label>Email:</label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={addFormData.email}
                    maxLength={50}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Password */}
                <div className={styles.formGroup}>
                  <label>Password:</label>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={addFormData.password}
                    maxLength={20}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                disabled={
                  !addFormData.name.trim() ||
                  !addFormData.email.trim() ||
                  !addFormData.phoneNumber.trim() ||
                  !addFormData.password.trim()
                }
                onClick={async () => {
                  // 🔒 validation
                  if (!addFormData.name.trim()) {
                    alert("Please enter name");
                    return;
                  }

                  if (!isValidEmail(addFormData.email)) {
                    alert("Invalid email format");
                    return;
                  }

                  if (!isValidPhone(addFormData.phoneNumber)) {
                    alert("Invalid Thai phone number");
                    return;
                  }

                  if (addFormData.password.length < 8) {
                    alert("Password must be at least 8 characters");
                    return;
                  }

                  if (!isStrongPassword(addFormData.password)) {
                    alert("Password must contain uppercase and number");
                    return;
                  }

                  try {
                    const res = await fetch("/api/auth/register", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: addFormData.name.trim(), // ✅ trim ตรงนี้
                        email: addFormData.email.trim(), // ✅ trim ตรงนี้
                        phone: addFormData.phoneNumber,
                        password: addFormData.password,
                        role: addFormData.role.toLowerCase(),
                        acceptedTerms: true,
                      }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                      alert(data.message);
                      return;
                    }

                    alert("User created successfully!");
                    window.location.reload();
                    setIsAddModalOpen(false);
                  } catch (err) {
                    console.error(err);
                    alert("Something went wrong");
                  }
                }}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailOpen && selectedUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h2>User Detail</h2>
            </div>

            <button
              className={styles.closeBtn}
              onClick={() => setIsDetailOpen(false)}
            >
              <img src="/cross.png" alt="close" />
            </button>

            <div className={styles.sectionHeader}>
              <span>Profile</span>
            </div>

            <div className={styles.formGrid}>
              {/* Avatar */}
              <div className={styles.avatarBox}>
                <img src="/profile.png" alt="avatar" />
              </div>

              {/* Info */}
              <div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Name:</label>
                    <input value={selectedUser.account} readOnly />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Role:</label>
                    <input value={selectedUser.role} readOnly />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Email:</label>
                  <input value={selectedUser.email} readOnly />
                </div>

                <div className={styles.formGroup}>
                  <label>Status:</label>

                  <span
                    className={`${styles.status} ${
                      selectedUser.status === "Active"
                        ? styles.active
                        : styles.inactive
                    }`}
                    style={{ width: "fit-content" }}
                  >
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Bank section (optional ตามรูปคุณ) */}
            <div className={styles.sectionHeader}>
              <span>Bank Account Information</span>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Bank Name:</label>
                <input value={bankName} readOnly />
              </div>

              <div className={styles.formGroup}>
                <label>Account Name:</label>
                <input value={accountName} readOnly />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Account Number:</label>
              <input value={accountNumber} readOnly />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
