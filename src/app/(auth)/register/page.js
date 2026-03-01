"use client";

// LAYER: Presentation Layer (UI)

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selected) {
      alert("Please select Buyer or Seller");
      return;
    }

    if (!formData.acceptedTerms) {
      alert("You must accept Terms and Privacy Policy");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          password: formData.password,
          role: selected === "buy" ? "buyer" : "seller",
          acceptedTerms: formData.acceptedTerms,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert("Account created successfully!");
      console.log(result);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

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

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Phone Number *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="At least 8 characters"
            />
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
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
              />
              <span>
                I accept the Terms of Service and Privacy Policy{" "}
                <span className={styles.required}>*</span>
              </span>
            </label>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create Account
          </button>

          <p className={styles.footerText}>
            By continuing, you confirm that you are at least 20 years old or
            have obtained parental consent.
          </p>
        </form>
      </div>
    </div>
  );
}
