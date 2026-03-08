"use client";
export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { useState , useEffect} from "react";
import styles from "./OTP.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import { Afacad } from "next/font/google";

export const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function NewOTPContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      alert("Please enter the 6-digit code");
      return;
    }

    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("OTP verified");

      router.push(`/new-pass?email=${email}`);
    } catch (err) {
      setError("Incorrect verification code. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await fetch("/api/auth/forgotpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setTimer(30);
      setCanResend(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className={styles.wrapper}>
      {/* Content */}
      <div className={styles.container}>
        <div className={styles.formBox}>
          <h2 className={`${styles.title} ${afacad.className}`}>
            Enter Verification Code
          </h2>

          <p className={`${styles.subtitle} ${afacad.className}`}>
            We sent a 6-digit verification code to example@email.com
          </p>

          <label className={`${styles.label} ${afacad.className}`}>
            Verification Code <span className={styles.required}>*</span>
          </label>

          <p className={`${styles.description} ${afacad.className}`}>
            Please enter the 6-digit code sent to your email.
          </p>

          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                className={styles.otpInput}
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
              />
            ))}
          </div>

          <p className={`${styles.resend} ${afacad.className}`}>
            Didn’t receive the code?
          </p>

          <p
            className={`${styles.resendLink} ${afacad.className}`}
            onClick={handleResend}
          >
            {canResend ? "Resend Code" : `Resend Code (${timer}s)`}
          </p>
        </div>

        {error && (
          <p className={`${styles.errorText} ${afacad.className}`}>{error}</p>
        )}

        <button
          className={`${styles.button} ${afacad.className}`}
          onClick={handleVerify}
        >
          Verify Code
        </button>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={null}>
      <NewOTPContent />
    </Suspense>
  );
}
