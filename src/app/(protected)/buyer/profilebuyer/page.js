"use client";
import { useState, useEffect } from "react";
import styles from "./pfpb.module.css";
import { Afacad } from "next/font/google";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function BuyerProfilePage() {
  const [tab, setTab] = useState("basic");
  

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [addr, setAddr] = useState({
    addressLabel: "", // 🔹 เพิ่มบรรทัดนี้ (เช่น บ้าน, ที่ทำงาน)
    fullName: "",
    phone: "",
    country: "", // 🔹 เพิ่มบรรทัดนี้ (ประเทศ)
    province: "",
    city: "",
    zipCode: "",
    detail: "",
    isDefault: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const data = JSON.parse(storedUser);
      setUser(data);

      setProfile({
        fullName: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ดักจับเฉพาะช่องเบอร์โทร: ให้กรอกได้แค่ตัวเลขและไม่เกิน 10 ตัว
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length > 10) return;

      setProfile((prev) => ({
        ...prev,
        [name]: onlyNums,
      }));
      return;
    }

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 ฟังก์ชันนี้แหละครับที่หายไป! (ดึงข้อมูลไปเซฟลง DB)
  // 🔹 ฟังก์ชันที่แก้บั๊กเรียบร้อยแล้ว
  const handleUpdate = async () => {
    if (!user) return;

    const trimmedName = (profile.fullName || "").trim();
    const trimmedPhone = (profile.phone || "").trim();

    // 🔹 รองรับ Address ทั้งแบบเก่า(ข้อความ) และแบบใหม่(ออบเจกต์)
    const finalAddress =
      typeof profile.address === "string"
        ? profile.address.trim()
        : profile.address;

    if (!trimmedName) {
      alert("Name cannot be empty.");
      return;
    }

    setIsLoading(true);

    try {
      const userId = user._id || user.id;

      const response = await fetch(`/api/auth/register`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          name: trimmedName,
          phone: trimmedPhone,
          address: finalAddress, // 🔹 ส่งแบบแพ็กเกจไปเลย
        }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        const updatedUser = {
          ...user,
          name: trimmedName,
          phone: trimmedPhone,
          address: finalAddress,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to update: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 1. ฟังก์ชันจัดการตอนผู้ใช้พิมพ์ข้อมูลลงฟอร์มที่อยู่
  const handleChangeAddress = (e) => {
    // 🔹 ต้องวางไว้บรรทัดแรกสุดเลยครับ! ระบบจะได้ไม่พังถ้าค่าที่ส่งมาผิด
    if (!e || !e.target) {
      console.warn("ส่งค่ามาผิดรูปแบบ ไม่ใช่ Event Object:", e);
      return;
    }

    // 🔹 บรรทัดที่ 66 (ที่เคยพัง) จะปลอดภัยแล้ว
    const { name, value, type, checked } = e.target;

    setAddr((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateAddress = () => {
    if (!addr.fullName.trim()) {
      alert("Full Name is required.");
      return false;
    }

    if (!addr.phone.trim()) {
      alert("Phone is required.");
      return false;
    }

    if (!/^0\d{9}$/.test(addr.phone)) {
      alert("Phone must be 10 digits and start with 0.");
      return false;
    }

    if (!addr.country.trim()) {
      alert("Country is required.");
      return false;
    }

    if (!addr.province.trim()) {
      alert("Province is required.");
      return false;
    }

    if (!addr.city.trim()) {
      alert("City is required.");
      return false;
    }

    if (!addr.zipCode.trim()) {
      alert("Zip Code is required.");
      return false;
    }

    if (!/^\d{5}$/.test(addr.zipCode)) {
      alert("Zip Code must be 5 digits.");
      return false;
    }

    if (!addr.detail.trim()) {
      alert("Address detail is required.");
      return false;
    }

    return true;
  };

  // 🔹 2. ตัวแปรช่วยเช็คว่ามีที่อยู่หรือยัง และดึงข้อมูลมาเตรียมโชว์
  const displayAddr =
    typeof profile.address === "object"
      ? profile.address
      : { detail: profile.address || "" };
  const hasAddress =
    typeof profile.address === "object"
      ? Object.values(profile.address).some((val) => val && val.trim() !== "")
      : !!profile.address;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* SIDEBAR */}
        <div className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <img src="/boy.png" className={styles.avatarImg} alt="Avatar" />
              </div>

              <div>
                <p className={`${styles.name} ${afacad.className}`}>
                  {user?.name}
                </p>
                <p className={`${styles.email} ${afacad.className}`}>
                  {user?.email}
                </p>
              </div>
            </div>

            <button className={`${styles.buyerBtn} ${afacad.className}`}>
              <img
                src="/shopping_bag.svg"
                className={styles.btnIcon}
                alt="Buyer"
              />
              Buyer Mode
              <span className={`${styles.activeTag} ${afacad.className}`}>
                Active
              </span>
            </button>

            <button className={`${styles.sellerBtn} ${afacad.className}`}>
              <img
                src="/storefront.svg"
                className={styles.btnIcon}
                alt="Seller"
              />
              Seller Mode
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className={styles.content}>
          <div className={styles.formCard}>
            {/* TAB */}
            <div className={styles.tabsContainer}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${tab === "basic" ? styles.tabActive : ""} ${afacad.className}`}
                  onClick={() => setTab("basic")}
                >
                  Basic Information
                </button>

                <button
                  className={`${styles.tab} ${tab === "shipping" ? styles.tabActive : ""} ${afacad.className}`}
                  onClick={() => setTab("shipping")}
                >
                  Shipping Addresses
                </button>
              </div>
            </div>

            {/* BASIC INFO */}
            {tab === "basic" && (
              <>
                <div className={`${styles.formGrid} ${afacad.className}`}>
                  <div>
                    <label>Name</label>
                    <input
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>Email</label>
                    <input value={profile.email} readOnly />
                  </div>
                </div>

                <div className={`${styles.phoneField} ${afacad.className}`}>
                  <label>Phone Number</label>

                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />

                  <p className={styles.helper}>
                    Thai phone number format: 0XXXXXXXXX (10 digits)
                  </p>
                </div>

                <div className={styles.updateBtnWrapper}>
                  <button
                    className={`${styles.updateBtn} ${afacad.className}`}
                    onClick={handleUpdate}
                    disabled={isLoading}
                    style={{
                      opacity: isLoading ? 0.6 : 1,
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </>
            )}

            {/* SHIPPING */}
            {tab === "shipping" && (
              <div className={`${styles.shippingField} ${afacad.className}`}>
                <label className={styles.shippingTitle}>Shipping Address</label>

                {!isEditingAddress ? (
                  <div className={styles.addressDisplayBox}>
                    {hasAddress ? (
                      <>
                        {/* 🔹 หน้าตาตอนมีที่อยู่แล้ว */}
                        <div className={styles.addressCard}>
                          <p className={styles.addressName}>
                            {addr.fullName || "-"} | {addr.phone || "-"}
                            {/* แสดงป้าย [Default] ถ้า Checkbox ถูกติ๊ก */}
                            {addr.isDefault && (
                              <span className={styles.defaultTag}>
                                [Default]
                              </span>
                            )}
                          </p>
                          <p className={styles.addressDetail}>
                            {addr.detail} {addr.city} {addr.province}{" "}
                            {addr.zipCode}
                          </p>
                        </div>
                        <button
                          className={`${styles.addNewBtn} ${afacad.className}`}
                          onClick={() => setIsEditingAddress(true)}
                        >
                          Edit Address
                        </button>
                      </>
                    ) : (
                      <>
                        {/* 🔹 หน้าตาตอนยังไม่มีที่อยู่ */}
                        <button
                          className={`${styles.addNewBtn} ${afacad.className}`}
                          onClick={() => setIsEditingAddress(true)}
                        >
                          + Add New Address
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className={styles.shippingFormWrapper}>
                    {/* 🔹 ฟอร์ม 2 คอลัมน์ */}
                    <div className={styles.shippingFormGrid}>
                      {/* 🔹 แถว 1: ข้อมูลผู้รับ */}
                      <div className={styles.inputGroup}>
                        <label>Address Label</label>
                        <input
                          name="addressLabel"
                          value={addr.addressLabel || ""}
                          onChange={handleChangeAddress}
                          placeholder="e.g., Home, Work"
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.required}>Full Name</label>
                        <input
                          name="fullName"
                          value={addr.fullName}
                          onChange={handleChangeAddress}
                          placeholder="e.g., John Doe"
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.required}>Phone</label>
                        <input
                          name="phone"
                          value={addr.phone}
                          onChange={handleChangeAddress}
                          placeholder="e.g., 0812345678"
                          inputMode="numeric"
                          maxLength={10}
                          required
                        />
                      </div>

                      {/* 🔹 แถว 2: สถานที่หลัก */}
                      <div className={styles.inputGroup}>
                        <label className={styles.required}>Country</label>
                        <input
                          name="country"
                          value={addr.country || ""}
                          onChange={handleChangeAddress}
                          placeholder="e.g., Thailand"
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.required}>Province</label>
                        <input
                          name="province"
                          value={addr.province}
                          onChange={handleChangeAddress}
                          placeholder="e.g., Bangkok"
                          required
                        />
                      </div>

                      {/* 🔹 แถว 3: สถานที่รอง */}
                      <div className={styles.inputGroup}>
                        <label className={styles.required}>City</label>
                        <input
                          name="city"
                          value={addr.city}
                          onChange={handleChangeAddress}
                          placeholder="e.g., Pathum Wan"
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.required}>Zip Code</label>
                        <input
                          name="zipCode"
                          value={addr.zipCode}
                          onChange={handleChangeAddress}
                          placeholder="e.g., 10330"
                          inputMode="numeric"
                          maxLength={5}
                          required
                        />
                      </div>

                      {/* 🔹 แถว 4: รายละเอียดที่อยู่ & ป้ายชื่อที่อยู่ */}
                    </div>

                    {/* 🔹 กล่อง Address ด้านล่างสุด (เต็มบรรทัด) */}
                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                      <label className={styles.required}>Address</label>
                      <textarea
                        name="detail"
                        rows="3"
                        value={addr.detail || ""}
                        onChange={handleChangeAddress}
                        placeholder="House no., Building, Street, etc."
                        required
                      />
                    </div>

                    {/* 🔹 Checkbox: Set as default address */}
                    {/* 🔹 Checkbox: Set as default address */}
                    <div className={styles.defaultAddressWrapper}>
                      <label htmlFor="isDefault">Set as Default Address</label>

                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          id="isDefault"
                          name="isDefault"
                          checked={addr.isDefault || false}
                          onChange={handleChangeAddress}
                          required
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    {/* 🔹 ปุ่ม Cancel & Save */}
                    <div className={styles.formActionButtons}>
                      <button
                        className={`${styles.cancelBtn} ${afacad.className}`}
                        onClick={() => setIsEditingAddress(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${styles.updateBtn} ${afacad.className}`}
                        onClick={async () => {
                          if (!validateAddress()) return;
                          await handleUpdate();
                          setIsEditingAddress(false);
                        }}
                        disabled={isLoading}
                        style={{
                          opacity: isLoading ? 0.6 : 1,
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }}
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
