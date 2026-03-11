"use client";
import { useState, useEffect } from "react";
import styles from "./pfpb.module.css"; // เปลี่ยนชื่อไฟล์ css ให้แยกกัน
import { Afacad } from "next/font/google";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function BuyerProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  // ดึงข้อมูล User มาแสดงผลเบื้องต้น
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setProfile((prev) => ({
        ...prev,
        fullName: userData.fullName,
        email: userData.email,
      }));
    }
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Sidebar ทางซ้ายตามรูป */}
        <aside className={styles.sidebar}>
          <div className={`${styles.sidebarMenu} ${afacad.className}`}>
            <button className={styles.activeMenu}>Profile</button>
            <button>Order History</button>
            <button>Favorite Books</button>
            <button className={styles.logoutBtn}>Log Out</button>
          </div>
        </aside>

        {/* Content ทางขวา: Profile Settings */}
        <main className={styles.content}>
          <div className={styles.profileCard}>
            <h1 className={afacad.className}>Profile Settings</h1>

            <div className={`${styles.formGroup} ${afacad.className}`}>
              <div className={styles.inputBox}>
                <label>Full Name</label>
                {/* <input type="text" value={profile.fullName} readOnly /> */}
              </div>

              <div className={styles.inputBox}>
                <label>Email Address</label>
                <input type="email" value={profile.email} readOnly />
              </div>

              <div className={styles.inputBox}>
                <label>Phone Number</label>
                <input type="text" placeholder="Add your phone number" />
              </div>

              <div className={styles.inputBox}>
                <label>Shipping Address</label>
                <textarea placeholder="Enter your address" rows="4" />
              </div>
            </div>

            <div className={styles.actionArea}>
              <button className={`${styles.saveBtn} ${afacad.className}`}>
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
