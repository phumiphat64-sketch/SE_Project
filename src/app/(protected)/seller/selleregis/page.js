"use client";
import styles from "./seller1.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

export default function SellerPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bankOpen, setBankOpen] = useState(false);
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
    const requiredFields = [
      "fullName",
      "dateOfBirth",
      "phone",
      "storeName",
      "storeDescription",
      "bankName",
      "accountName",
      "accountNumber",
    ];

    if (form.phone.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (form.accountNumber.length > 15) {
      alert("Account number cannot exceed 15 digits");
      return;
    }

    for (let field of requiredFields) {
      if (!form[field] || form[field].trim() === "") {
        alert("Please fill in all required fields.");
        return;
      }
    }

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
    const checkSeller = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);

      try {
        const res = await fetch(
          `/api/auth/seller/verified?userId=${userData.id}`,
        );
        const data = await res.json();

        if (data.isSeller) {
          router.replace("/seller/profilehide");
          return;
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    checkSeller();
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
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // allow only numbers
                  setForm({
                    ...form,
                    phone: value,
                  });
                }}
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
                <div className={styles.bankDropdown}>
                  <div
                    className={styles.bankSelected}
                    onClick={() => setBankOpen(!bankOpen)}
                  >
                    {form.bankName || "Select a Bank"}
                  </div>

                  {bankOpen && (
                    <div className={styles.bankList}>
                      <div
                        className={styles.bankOption}
                        onClick={() => {
                          setForm({ ...form, bankName: "Bangkok Bank (BBL)" });
                          setBankOpen(false);
                        }}
                      >
                        <img
                          src="/icons/Bangkokbank.png"
                          width="30"
                          height="30"
                        />
                        Bangkok Bank (BBL)
                      </div>

                      <div
                        className={styles.bankOption}
                        onClick={() => {
                          setForm({
                            ...form,
                            bankName: "Krung Thai Bank (KTB)",
                          });
                          setBankOpen(false);
                        }}
                      >
                        <img
                          src="/icons/Khungthai.png"
                          width="30"
                          height="30"
                        />
                        Krung Thai Bank (KTB)
                      </div>

                      <div
                        className={styles.bankOption}
                        onClick={() => {
                          setForm({
                            ...form,
                            bankName: "Kasikornbank (KBank)",
                          });
                          setBankOpen(false);
                        }}
                      >
                        <img src="/icons/KBank.png" width="30" height="30" />
                        Kasikornbank (KBank)
                      </div>

                      <div
                        className={styles.bankOption}
                        onClick={() => {
                          setForm({
                            ...form,
                            bankName: "Siam Commercial Bank (SCB)",
                          });
                          setBankOpen(false);
                        }}
                      >
                        <img src="/icons/SCB.png" width="30" height="30" />
                        Siam Commercial Bank (SCB)
                      </div>
                    </div>
                  )}
                </div>
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
              maxLength={15}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setForm({
                  ...form,
                  accountNumber: value,
                });
              }}
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
