"use client";
import { useState } from "react";
import styles from "./seller2.module.css";
import { useEffect } from "react";

export default function ProfilePage() {
    const [showBank, setShowBank] = useState(false);
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

    useEffect(() => {
      const loadProfile = async () => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const user = JSON.parse(storedUser);

        const res = await fetch(`/api/auth/seller/profile?userId=${user.id}`);
        const data = await res.json();

        setProfile(data);
      };

      loadProfile();
    }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* LEFT SIDEBAR */}
        <div className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}></div>

              <div>
                <p className={styles.name}>{user?.name || ""}</p>
                <p className={styles.email}>{user?.email || ""}</p>
              </div>
            </div>

            <button
              className={styles.buyerBtn}
              onClick={() => console.log("Buyer mode")}
            >
              Buyer Mode
            </button>

            <button
              className={styles.sellerBtn}
              onClick={() => console.log("Seller mode")}
            >
              Seller Mode
              <span className={styles.activeTag}>Active</span>
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className={styles.content}>
          <div className={styles.formCard}>
            <div className={styles.sectionHeaderWrapper}>
              <div className={styles.sectionHeader}>Basic Information</div>
            </div>

            <div className={styles.formGrid}>
              <div>
                <label>Name</label>
                <input value={profile?.fullName || ""} readOnly />
              </div>

              <div>
                <label>Email</label>
                <input value={user?.email || ""} readOnly />
              </div>
            </div>

            <div className={styles.phoneField}>
              <label>Phone Number</label>
              <input value={profile?.phone || ""} readOnly />

              <p className={styles.helper}>
                Thai phone number format: 0XXXXXXXXX (10 digits)
              </p>
            </div>

            <div className={styles.sectionHeaderWrapper}>
              <div className={styles.sectionHeader}>
                Bank Account Information
                <button
                  className={styles.eyeBtn}
                  onClick={() => setShowBank(!showBank)}
                >
                  <img
                    src={
                      showBank ? "/icons/Eye close.svg" : "/icons/Eye open.svg"
                    }
                    alt="toggle"
                  />
                </button>
              </div>
            </div>

            <div className={styles.bankFields}>
              <label>Bank Name</label>
              <input
                type={showBank ? "text" : "password"}
                value={profile?.bankName || ""}
                readOnly
              />

              <label>Account Name</label>
              <input
                type={showBank ? "text" : "password"}
                value={profile?.accountName || ""}
                readOnly
              />

              <label>Account Number</label>
              <input
                type={showBank ? "text" : "password"}
                value={profile?.accountNumber || ""}
                readOnly
              />
            </div>

            <div className={styles.updateBtnWrapper}>
              <button className={styles.updateBtn}>Update Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
