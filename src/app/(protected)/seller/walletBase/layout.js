"use client";

import { useEffect, useState } from "react";
import TopBar from "../../../components/TopBar";
import SuspendedGuard from "../../../components/SuspendedGuard";

export default function ProtectedLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div style={{ backgroundColor: "#FFFEFA", minHeight: "100vh" }}>
      {/* 🔥 ใส่ตรงนี้ */}
      <SuspendedGuard user={user} />

      <TopBar/>

      {children}
    </div>
  );
}
