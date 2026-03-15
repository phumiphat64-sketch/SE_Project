"use client";
import { useState, useEffect } from "react";
import styles from "./pfpb.module.css";
import { Afacad } from "next/font/google";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function BuyerProfilePage() {
  const [tab, setTab] = useState("basic");

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const data = JSON.parse(storedUser);
      setUser(data);

      setProfile({
        fullName: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ดักจับเฉพาะช่องเบอร์โทร: ให้กรอกได้แค่ตัวเลขและไม่เกิน 10 ตัว
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length > 10) return;

      setProfile((prev) => ({
        ...prev,
        [name]: onlyNums,
      }));
      return;
    }

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 ฟังก์ชันนี้แหละครับที่หายไป! (ดึงข้อมูลไปเซฟลง DB)
  // 🔹 ฟังก์ชันที่แก้บั๊กเรียบร้อยแล้ว
  const handleUpdate = async () => {
    if (!user) return;

    // 1. เตรียมข้อมูล
    const trimmedName = (profile.fullName || "").trim();
    const trimmedPhone = (profile.phone || "").trim();
    const trimmedAddress = (profile.address || "").trim();

    if (!trimmedName) {
      alert("Name cannot be empty.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. ดึง ID ของ User ออกมา (ดักไว้ทั้งแบบมีขีดล่างและไม่มี)
      const userId = user._id || user.id;

      // 3. ยิงไปที่ API เดียวกับไฟล์ route.js ที่คุณมี
      const response = await fetch(`/api/auth/register`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId, // ส่ง ID ไปใน Body
          name: trimmedName,
          phone: trimmedPhone,
          address: trimmedAddress,
        }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        // 4. อัปเดตข้อมูลบนหน้าจอ
        const updatedUser = {
          ...user,
          name: trimmedName,
          phone: trimmedPhone,
          address: trimmedAddress,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to update: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* SIDEBAR */}
        <div className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <img src="/boy.png" className={styles.avatarImg} alt="Avatar" />
              </div>

              <div>
                <p className={`${styles.name} ${afacad.className}`}>
                  {user?.name}
                </p>
                <p className={`${styles.email} ${afacad.className}`}>
                  {user?.email}
                </p>
              </div>
            </div>

            <button className={`${styles.buyerBtn} ${afacad.className}`}>
              <img
                src="/shopping_bag.svg"
                className={styles.btnIcon}
                alt="Buyer"
              />
              Buyer Mode
              <span className={`${styles.activeTag} ${afacad.className}`}>
                Active
              </span>
            </button>

            <button className={`${styles.sellerBtn} ${afacad.className}`}>
              <img
                src="/storefront.svg"
                className={styles.btnIcon}
                alt="Seller"
              />
              Seller Mode
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className={styles.content}>
          <div className={styles.formCard}>
            {/* TAB */}
            <div className={styles.tabsContainer}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${tab === "basic" ? styles.tabActive : ""} ${afacad.className}`}
                  onClick={() => setTab("basic")}
                >
                  Basic Information
                </button>

                <button
                  className={`${styles.tab} ${tab === "shipping" ? styles.tabActive : ""} ${afacad.className}`}
                  onClick={() => setTab("shipping")}
                >
                  Shipping Addresses
                </button>
              </div>
            </div>

            {/* BASIC INFO */}
            {tab === "basic" && (
              <>
                <div className={`${styles.formGrid} ${afacad.className}`}>
                  <div>
                    <label>Name</label>
                    <input
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>Email</label>
                    <input value={profile.email} readOnly />
                  </div>
                </div>

                <div className={`${styles.phoneField} ${afacad.className}`}>
                  <label>Phone Number</label>

                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />

                  <p className={styles.helper}>
                    Thai phone number format: 0XXXXXXXXX (10 digits)
                  </p>
                </div>

                <div className={styles.updateBtnWrapper}>
                  <button
                    className={`${styles.updateBtn} ${afacad.className}`}
                    onClick={handleUpdate}
                    disabled={isLoading}
                    style={{
                      opacity: isLoading ? 0.6 : 1,
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </>
            )}

            {/* SHIPPING */}
            {tab === "shipping" && (
              <div className={afacad.className}>
                <label>Shipping Address</label>

                <textarea
                  name="address"
                  rows="4"
                  value={profile.address}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />

                <div className={styles.updateBtnWrapper}>
                  <button
                    className={`${styles.updateBtn} ${afacad.className}`}
                    onClick={handleUpdate}
                    disabled={isLoading}
                    style={{
                      opacity: isLoading ? 0.6 : 1,
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoading ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
