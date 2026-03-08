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

import { Crimson_Text, Caveat, Afacad, IBM_Plex_Mono } from "next/font/google";

export const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // 🔥 เพิ่มบรรทัดนี้
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("Login successful");

      // เก็บ user ลง localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // ตรวจ role
      if (data.user.role === "buyer") {
        window.location.href = "/buyer/firstpage";
      } else if (data.user.role === "seller") {
        const resSeller = await fetch(
          `/api/auth/seller/verified?userId=${data.user.id}`,
        );
        const sellerCheck = await resSeller.json();

        if (sellerCheck.isSeller) {
          window.location.href = "/seller/profilehide";
        } else {
          window.location.href = "/seller/selleregis";
        }
      } else {
        alert("Invalid user role");
        window.location.href = "/login";
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("src/app/api/auth/login/route.js", {
          credentials: "include",
        });

        if (!res.ok) {
          localStorage.removeItem("user");
          setCheckingAuth(false);
          return;
        }

        const user = localStorage.getItem("user");

        if (!user) {
          setCheckingAuth(false);
          return;
        }

        const parsed = JSON.parse(user);

        if (parsed.role === "seller") {
          window.location.replace("/seller");
          return;
        }

        if (parsed.role === "buyer") {
          window.location.replace("/buyer");
          return;
        }

        setCheckingAuth(false);
      } catch {
        localStorage.removeItem("user");
        setCheckingAuth(false);
      }
    };

    checkSession();
  }, []);

  if (checkingAuth) return null;

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
          className={`${styles.input} ${crimson.className}`}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className={`${styles.input} ${crimson.className}`}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className={styles.forgotWrapper}>
          <Link
            href="/forgot-pass"
            className={`${styles.forgot} ${crimson.className}`}
          >
            Forgot Password ?
          </Link>
        </div>

        <button
          className={`${styles.button} ${crimson.className}`}
          onClick={handleLogin}
        >
          Login
        </button>

        <p className={`${styles.signup} ${crimson.className}`}>
          Don’t have an account?{" "}
          <Link
            href="/register"
            className={`${styles.Link} ${crimson.className}`}
          >
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
