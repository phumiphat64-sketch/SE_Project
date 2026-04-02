"use client";

import { useEffect, useState } from "react";
import TopBar from "../../../components/TopBar";
import SuspendedGuard from "../../../components/SuspendedGuard";
import { Crimson_Text, Caveat, Afacad } from "next/font/google";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
    <div
      className={afacad.className} // 👈 เพิ่มตรงนี้
      style={{ backgroundColor: "#FFFEFA", minHeight: "100vh" }}
    >
      <SuspendedGuard user={user} />

      <TopBar />

      {children}
    </div>
  );
}
