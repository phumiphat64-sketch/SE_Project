"use client";
import styles from "./register.module.css";
import { Crimson_Text, Caveat } from "next/font/google";
import { useState } from "react";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RegisterPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img
            src="/K - 1.svg"
            alt="ReRead Logo"
            className={`${styles.logo} ${crimson.className}`}
          />
          <h1 className={`${styles.title} ${crimson.className}`}>
            Create Your Account
          </h1>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name *</label>
            <input type="text" placeholder="Enter your full name" />
          </div>

          <div className={styles.inputGroup}>
            <label>Email Address *</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className={styles.inputGroup}>
            <label>Phone Number *</label>
            <input type="text" placeholder="Enter your phone number" />
          </div>

          <div className={styles.inputGroup}>
            <label>Date of Birth *</label>
            <input type="date" />
          </div>

          <div className={styles.inputGroup}>
            <label>Password *</label>
            <input type="password" placeholder="At least 8 characters" />
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm Password *</label>
            <input type="password" placeholder="At least 8 characters" />
          </div>

          <div className={`${styles.roleSection} ${crimson.className}`}>
            <p>What would you like to use ReRead for? *</p>

            <div className={styles.roleOptions}>
              <div
                className={`${styles.roleCard} ${
                  selected === "buy" ? styles.active : ""
                }`}
                onClick={() => setSelected("buy")}
              >
                <h4>Buy Books</h4>
                <p>Choose the books you love</p>
              </div>

              <div
                className={`${styles.roleCard} ${
                  selected === "sell" ? styles.active : ""
                }`}
                onClick={() => setSelected("sell")}
              >
                <h4>Sell Books</h4>
                <p>Sell your books to others</p>
              </div>
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" />

              <span>
                I accept the Terms of Service and Privacy Policy{" "}
                <span className={styles.required}>*</span>
                <br />
                By checking this box, you agree to our{" "}
                <span className={styles.linkText}>
                  Terms of Service
                </span> and{" "}
                <span className={styles.linkText}>Privacy Policy</span>.
              </span>
            </label>
          </div>

          <button className={styles.submitBtn}>Create Account</button>
          <p className={styles.footerText}>
            By continuing, you confirm that you are at least 20 years old or
            have obtained parental consent, and you accept our Terms of Service
            and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}
