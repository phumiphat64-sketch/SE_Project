"use client";
import { useState } from "react";
import styles from "./seller2.module.css";

export default function ProfilePage() {
    const [showBank, setShowBank] = useState(false);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* LEFT SIDEBAR */}
        <div className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}></div>

              <div>
                <p className={styles.name}>Daenerys Targaryen</p>
                <p className={styles.email}>daenerys@gmail.com</p>
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
                <input defaultValue="Daenerys Targaryen" />
              </div>

              <div>
                <label>Email</label>
                <input defaultValue="daenerys@gmail.com" />
              </div>
            </div>

            <div className={styles.phoneField}>
              <label>Phone Number</label>
              <input defaultValue="012 123 1234" />

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
                  {showBank ? "👁" : "🙈"}
                </button>
              </div>
            </div>

            <div className={styles.bankFields}>
              <label>Bank Name</label>
              <input
                type={showBank ? "text" : "password"}
                placeholder="************"
              />

              <label>Account Name</label>
              <input
                type={showBank ? "text" : "password"}
                placeholder="************"
              />

              <label>Account Number</label>
              <input
                type={showBank ? "text" : "password"}
                placeholder="************"
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
