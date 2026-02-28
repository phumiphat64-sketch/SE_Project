"use client";

/*
 * LAYER: Presentation Layer (UI)
 * ARCHITECTURE: Client–Server Architecture (Client Side)
 * PRINCIPLE: Separation of Concerns
 *
 * หน้าที่:
 * - รับ input จาก user
 * - เรียกใช้ AuthService
 * - ไม่ควรมี business logic
 */


"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./login.module.css";
import Link from "next/link";
import { useEffect } from "react";

import { Crimson_Text, Caveat } from "next/font/google";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // mock ชั่วคราว
    if (email && password) {
      alert("Login success (mock)");
    } else {
      alert("Please fill in all fields");
    }
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Image
            src="/K - 1.svg"
            alt="ReRead Logo"
            width={220}
            height={220}
            priority
          />
        </div>

        <h2 className={`${styles.title} ${crimson.className}`}>
          Welcome to <span className={styles.brandBold}>ReRead</span>
        </h2>

        <input
          type="email"
          placeholder="Email Address"
          className={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className={styles.forgotWrapper}>
          <span className={`${styles.forgot} ${crimson.className}`}>
            Forgot Password ?
          </span>
        </div>

        <button
          className={`${styles.button} ${crimson.className}`}
          onClick={handleLogin}
        >
          Login
        </button>

        <p className={styles.signup}>
          Don’t have an account?{" "}
          <Link href="/register" className={styles.link}>
            Sign up
          </Link>
        </p>

        <p className={styles.terms}>
          By creating an account, you confirm that you are at least 20 years old{" "}
          <span className={styles.noWrap}>
            (or have received consent from a legal guardian)
          </span>{" "}
          and agree to the Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
