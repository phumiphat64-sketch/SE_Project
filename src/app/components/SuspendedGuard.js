"use client";

import { Afacad } from "next/font/google";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function SuspendedGuard({ user }) {
  if (user?.status !== "inactive") return null;

  return (
    <>
      {/* 1. แผ่น Overlay ใสๆ ที่ใช้ล็อกหน้าจอ (ปรับปรุงใหม่) */}
      <div style={lockScreenOverlay} />

      {/* 2. แถบแบนเนอร์แจ้งเตือนสีแดง */}
      <div className={afacad.className} style={bannerStyle}>
        <div>
          <div style={{ fontSize: "28px", fontWeight: "500" }}>
            Your account has been suspended
          </div>
          <div style={{ fontSize: "18px", fontWeight: "50", opacity: 0.9 }}>
            Please contact admin
          </div>
        </div>
      </div>
    </>
  );
}

// สไตล์สำหรับล็อกหน้าจอ (ห้ามคลิกเนื้อหา แต่ยกเว้น Top Bar)
const lockScreenOverlay = {
  position: "fixed",
  top: "70px" /* 👈 1. ขยับตัวล็อกลงมาเริ่มที่ใต้ Top Bar พอดี (ไม่คลุม 0-70px ข้างบน) */,
  left: 0,
  width: "100vw",
  height:
    "calc(100vh - 70px)" /* 👈 2. คำนวณความสูงใหม่: จอทั้งหมดลบด้วยความสูง Top Bar */,
  backgroundColor: "rgba(0, 0, 0, 0.05)" /* สีดำจางๆ เพื่อบอกว่าจอถูกล็อก */,
  zIndex: 9998 /* อยู่ใต้ Banner นิดนึง แต่ทับ Content ทั้งหมด */,
  cursor: "not-allowed" /* Cursor รูปห้ามคลิก */,
};

// สไตล์สำหรับแถบแบนเนอร์สีแดง
const bannerStyle = {
  position: "fixed",
  top: "70px" /* อยู่ใต้ Top Bar พอดี */,
  left: 0,
  width: "100%",
  backgroundColor: "#984E4E",
  color: "#ffffff",
  padding: "12px 20px",
  paddingLeft: "44px",
  textAlign: "left",
  fontSize: "18px",
  fontWeight: "500",
  zIndex: 9999 /* อยู่บนสุด فوقตัวล็อก */,
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  letterSpacing: "0.5px",
};
