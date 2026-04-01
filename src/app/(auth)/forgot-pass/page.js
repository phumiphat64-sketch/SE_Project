"use client";
import { useState , useEffect} from "react";
import styles from "./fp.module.css";
import { useRouter } from "next/navigation";
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

export default function ForgotPass() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const res = await fetch("/api/auth/forgotpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      router.push(`/otp?email=${email}`);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const allowed = sessionStorage.getItem("allowForgot");

    if (!allowed) {
      router.replace("/login");
      return;
    }

    // ไม่ต้อง remove ทันที
    setTimeout(() => {
      sessionStorage.removeItem("allowForgot");
    }, 0);
  }, [router]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.formBox}>
          <h2 className={`${styles.title} ${afacad.className}`}>
            Forgot your password?
          </h2>

          <p className={`${styles.subtitle} ${afacad.className}`}>
            Enter your registered email address and we'll send you an OTP to
            reset your password.
          </p>

          <label className={`${styles.label} ${afacad.className}`}>
            Email Address <span className={styles.required}>*</span>
          </label>

          <input
            className={`${styles.input} ${afacad.className}`}
            type="email"
            placeholder="enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <p className={`${styles.description} ${afacad.className}`}>
            We will send an OTP to this email to reset your password.
          </p>
        </div>

        <button
          className={`${styles.button} ${afacad.className}`}
          onClick={handleForgotPassword}
        >
          Send Reset OTP
        </button>
      </div>
    </div>
  );
}