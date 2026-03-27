"use client"; // 👈 สำคัญมาก ต้องมีเพื่อให้ใช้ useEffect ได้

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IdleTimer() {
  const router = useRouter();

  useEffect(() => {
    let timeoutId;

    const logoutUser = () => {
      // 1. ล้างข้อมูล User ใน LocalStorage
      localStorage.removeItem("user");

      // 2. ล้าง Cookie (เผื่อไว้กรณีที่ Cookie ไม่ใช่ HttpOnly)
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 3. เด้งกลับหน้า Login
      router.push("/login");
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // ตั้งเวลา 20 นาที (20 * 60 * 1000 = 1,200,000 มิลลิวินาที)
      // *ถ้าอยากทดสอบ แนะนำให้แก้เป็น 5000 (5 วินาที) ดูก่อนครับว่าเด้งไหม
      timeoutId = setTimeout(logoutUser, 1200000);
    };

    // เหตุการณ์ที่ถือว่าผู้ใช้ยัง "Active" อยู่
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    // เริ่มดักจับเหตุการณ์
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // เริ่มนับเวลาครั้งแรกทันทีที่โหลดเสร็จ
    resetTimer();

    // Cleanup: ถอด Event ออกเมื่อเปลี่ยนหน้าหรือปิดเว็บ
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [router]);

  // Component นี้ทำงานอยู่เบื้องหลังเงียบๆ ไม่ต้องแสดง UI อะไรออกมา
  return null;
}
