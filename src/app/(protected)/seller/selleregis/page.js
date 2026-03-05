"use client";
import styles from "./seller1.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

export default function SellerPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    storeName: "",
    storeDescription: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const data = {
        userId: user.id,
        ...form,
      };

      const res = await fetch("/api/auth/seller/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      router.push("/seller/profilehide");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      try {
        const res = await fetch(
          `/api/auth/seller/verified?userId=${parsedUser.id}`,
        );
        const data = await res.json();

        if (data.isSeller) {
          router.push("/seller/profilehide");
          return;
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.bookLeft}></div>

        <div>
          <h1 className={styles.title}>Become a Seller</h1>
          <p className={styles.subtitle}>
            Fill in the details below to start selling on ReRead.
          </p>
        </div>

        <div className={styles.bookRight}></div>
      </div>

      {/* Personal Info */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.icon}></div>
          <span>Personal Information</span>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.fullRow}>
            <label>
              Full name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <div style={{ flex: "0 0 35%" }}>
              <label>
                Date of Birth <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div style={{ flex: "0 0 35%" }}>
              <label>
                Phone Number <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                placeholder="xxx-xxx-xxxx"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.icon}></div>
          <span>Store Information</span>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.fullRow}>
            <label>
              Store Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="Store Name"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.fullRow}>
            <label>
              Store Description <span className={styles.required}>*</span>
            </label>
            <textarea
              placeholder="Tell buyer about your store"
              name="storeDescription"
              value={form.storeDescription}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Payout */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.icon}></div>
          <span>Payout Information</span>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.row}>
            <div className={`${styles.bankWrapper} ${styles.bankField}`}>
              <label>
                Bank Name <span className={styles.required}>*</span>
              </label>

              <div className={styles.bankSelect}>
                <select
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                >
                  <option value="">Select a Bank</option>
                  <option>Bangkok Bank (BBL)</option>
                  <option>Krung Thai Bank (KTB)</option>
                  <option>Kasikornbank (KBank)</option>
                  <option>Siam Commercial Bank (SCB)</option>
                </select>
              </div>
            </div>

            <div className={styles.row1}>
              <label>
                Account Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="accountName"
                value={form.accountName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.fullRow}>
            <label>
              Account Number <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={handleSubmit}>
          Start Selling
        </button>
      </div>
    </div>
  );
}
