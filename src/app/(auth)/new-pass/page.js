"use client";
export const dynamic = "force-dynamic"; 
import { useState } from "react";
import styles from "./newp.module.css";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("Password reset success");

      router.push("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.formBox}>
          <h2 className={`${styles.title} ${afacad.className}`}>
            Create New Password
          </h2>

          <p className={`${styles.subtitle} ${afacad.className}`}>
            Please enter your new password below.
          </p>

          <label className={`${styles.label} ${afacad.className}`}>
            New Password <span className={styles.required}>*</span>
          </label>

          <input
            type="password"
            placeholder="enter your new password"
            className={`${styles.input} ${afacad.className}`}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className={`${styles.label} ${afacad.className}`}>
            Confirm New Password <span className={styles.required}>*</span>
          </label>

          <input
            type="password"
            placeholder="re-enter new password"
            className={`${styles.input} ${afacad.className}`}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className={`${styles.button} ${afacad.className}`} onClick={handleReset}>
          Reset Password
        </button>
      </div>
    </div>
  );
}
