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
  const [showTerms, setShowTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = (phone) => {
    const regex = /^0[689]\d{8}$/; // เบอร์มือถือไทย
    return regex.test(phone);
  };

  const isStrongPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const passwordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  const isOver20 = (date) => {
    const today = new Date();
    const birthDate = new Date(date);

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 20;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selected) {
      alert("Please select Buyer or Seller");
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!isValidPhone(formData.phone)) {
      alert("Please enter a valid Thai phone number");
      return;
    }

    if (!isOver20(formData.dateOfBirth)) {
      alert("You must be at least 20 years old or have parental consent.");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      alert("Password must contain at least 1 uppercase letter and 1 number");
      return;
    }

    if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      alert("Passwords do not match");
      return;
    }

    if (!formData.acceptedTerms) {
      alert("You must accept the Terms and Privacy Policy");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
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
            <label>
              Full Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              Email Address <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              Phone Number <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setFormData({
                  ...formData,
                  phone: value,
                });
              }}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              Date of Birth <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>
              Password <span className={styles.required}>*</span>
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                maxLength={20}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
              />

              <img
                src={showPassword ? "EyeC.svg" : "EyeO.svg"}
                className={styles.passwordIcon}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>
              Confirm Password <span className={styles.required}>*</span>
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
              />

              <img
                src={showConfirmPassword ? "EyeC.svg" : "EyeO.svg"}
                className={styles.passwordIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          </div>

          <div className={`${styles.roleSection} ${crimson.className}`}>
            <p>
              What would you like to use ReRead for?{" "}
              <span className={styles.required}>*</span>
            </p>

            <div className={styles.roleOptions}>
              <div
                className={`${styles.roleCard} ${
                  selected === "buy" ? styles.active : ""
                }`}
                onClick={() => setSelected("buy")}
              >
                <img src="/regis_1.png" className={styles.roleIcon} />
              </div>

              <div
                className={`${styles.roleCard} ${
                  selected === "sell" ? styles.active : ""
                }`}
                onClick={() => setSelected("sell")}
              >
                <img src="/regis_2.png" className={styles.roleIcon} />
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
                <br />
                By checking this box, you agree to our{" "}
                <span>
                  I accept the{" "}
                  <span
                    className={styles.linkText}
                    onClick={() => setShowTerms(true)}
                  >
                    Terms of Service and Privacy Policy
                  </span>
                </span>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!formData.acceptedTerms || !selected}
          >
            Create Account
          </button>

          <p className={styles.footerText}>
            By continuing, you confirm that you are at least 20 years old or
            have obtained parental consent.
          </p>
        </form>
      </div>

      {showTerms && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeBtn}
              onClick={() => setShowTerms(false)}
            >
              ✕
            </button>

            <h2>Terms of Service and Privacy Policy</h2>

            <div className={styles.modalContent}>
              <h3>Terms and Conditions</h3>

              <p>
                <b>การยอมรับข้อกำหนด</b>
              </p>
              <p>
                การสมัครสมาชิกหรือใช้งานเว็บไซต์ ถือว่าท่านได้อ่าน เข้าใจ
                และตกลงผูกพันตามข้อกำหนดและเงื่อนไขฉบับนี้ทุกประการ
              </p>

              <p>
                <b>บทบาทของแพลตฟอร์ม</b>
              </p>
              <p>
                เว็บไซต์ ReRead ทำหน้าที่เป็นตัวกลาง (Marketplace Platform)
                เพื่ออำนวยความสะดวกในการซื้อ–ขายหนังสือมือสอง
              </p>

              <p>
                <b>หน้าที่ของผู้ใช้งาน</b>
              </p>
              <ul>
                <li>ให้ข้อมูลที่ถูกต้องและเป็นปัจจุบัน</li>
                <li>ไม่กระทำการอันผิดกฎหมายหรือขัดต่อศีลธรรม</li>
                <li>ไม่จำหน่ายสินค้าที่ละเมิดลิขสิทธิ์</li>
              </ul>

              <p>
                <b>การระงับบัญชี</b>
              </p>
              <p>
                บริษัทขอสงวนสิทธิ์ในการระงับบัญชี หากพบพฤติกรรมที่ฝ่าฝืนข้อกำหนด
              </p>

              <hr />

              <h3>Privacy Policy (PDPA)</h3>

              <p>
                <b>ผู้ควบคุมข้อมูลส่วนบุคคล</b>
              </p>
              <p>
                เว็บไซต์ ReRead
                <br />
                Email: support@reread.co.th
              </p>

              <p>
                <b>ประเภทข้อมูลที่เก็บรวบรวม</b>
              </p>
              <ul>
                <li>ชื่อ–นามสกุล</li>
                <li>อีเมล</li>
                <li>ข้อมูลบัญชีผู้ใช้งาน</li>
                <li>ข้อมูลคำสั่งซื้อ</li>
                <li>Log Data / IP Address</li>
              </ul>

              <p>
                <b>วัตถุประสงค์ในการใช้ข้อมูล</b>
              </p>
              <ul>
                <li>สมัครสมาชิก</li>
                <li>ยืนยันตัวตน</li>
                <li>บริหารจัดการคำสั่งซื้อ</li>
                <li>ปรับปรุงความปลอดภัยของระบบ</li>
              </ul>

              <p>
                <b>สิทธิของเจ้าของข้อมูล</b>
              </p>
              <ul>
                <li>เข้าถึงข้อมูล</li>
                <li>แก้ไขข้อมูล</li>
                <li>ลบข้อมูล</li>
                <li>ถอนความยินยอม</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
