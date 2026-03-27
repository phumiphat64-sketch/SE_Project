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
  const [editingId, setEditingId] = useState(null);

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
      try {
        const data = JSON.parse(storedUser);
        setUser(data);

        setProfile({
          fullName: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
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
  const handleUpdate = async (addresses) => {
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
          address: finalAddress,
          addresses: addresses || user?.addresses || [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Profile updated successfully!");

        // สร้าง Object ใหม่ที่รวมข้อมูลเดิมกับข้อมูลใหม่
        const updatedUser = {
          ...user,
          ...data.user, // ตรวจสอบว่า API ส่ง data.user กลับมาจริงไหม
        };

        // ✅ บันทึกลง LocalStorage ทันที
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // ✅ อัปเดต State ทันทีเพื่อให้หน้าจอเปลี่ยนตาม
        setUser(updatedUser);
        setProfile({
          fullName: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          address: updatedUser.address || "",
        });
      } else {
        // ลองสั่ง console.log ดูว่า backend ส่ง error อะไรมา
        const errorData = await response.json().catch(() => ({}));
        console.log("Error from API:", errorData);
        alert(
          `Failed to update: ${errorData.message || errorData.error || "Unknown error"}`,
        );
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

  const handleOpenAddAddress = () => {
    setAddr({
      addressLabel: "",
      fullName: "",
      phone: "",
      country: "",
      province: "",
      city: "",
      zipCode: "",
      detail: "",
      isDefault: false,
    });
    setEditingId(null);
    setIsEditingAddress(true);
  };

  const handleEditAddress = (addressItem, index) => {
    setAddr(addressItem); // ดึงข้อมูลเดิมมาใส่ฟอร์ม
    setEditingId(addressItem._id || index); // จำไว้ว่ากำลังแก้อันไหน
    setIsEditingAddress(true);
  };

  const handleDeleteAddress = async (addressItem, index) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    const targetId = addressItem._id || index;
    const updatedAddresses = (user.addresses || []).filter(
      (a, i) => (a._id || i) !== targetId,
    );

    await handleUpdate(updatedAddresses); // อัปเดตขึ้นฐานข้อมูล

    const newUser = { ...user, addresses: updatedAddresses };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
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

  const addresses = user?.addresses ?? [];
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
                  {user?.name || ""}
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
                    onClick={() => handleUpdate()}
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
                    {addresses.length > 0 ? (
                      <>
                        {addresses.map((a, index) => (
                          <div
                            key={a._id || index}
                            className={styles.addressCard}
                          >
                            <div className={styles.addressHeader}>
                              <div className={styles.addressHeaderLeft}>
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                <span
                                  className={`${styles.addressLabel} ${afacad.className}`}
                                >
                                  {a.label || "Home"}
                                </span>
                                {a.isDefault && (
                                  <span
                                    className={`${styles.defaultBadge} ${afacad.className}`}
                                  >
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className={styles.addressActions}>
                                {/* 🔹 ไอคอนแก้ไข: กดแล้วจะเรียกฟังก์ชัน handleEditAddress */}
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleEditAddress(a, index)}
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>

                                {/* 🔹 ไอคอนลบ: กดแล้วจะเรียกฟังก์ชัน handleDeleteAddress */}
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{
                                    cursor: "pointer",
                                    color: "#d93025",
                                  }}
                                  onClick={() => handleDeleteAddress(a, index)}
                                >
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </div>
                            </div>

                            <div
                              className={`${styles.addressBody} ${afacad.className}`}
                            >
                              <div className={styles.addressName}>
                                {a.fullName}
                              </div>
                              <div className={styles.addressText}>
                                {[
                                  a.detail,
                                  a.city,
                                  a.province,
                                  a.zipCode,
                                  a.country,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                              <div className={styles.addressPhone}>
                                Phone : {a.phone}
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          className={`${styles.addNewAddressBtn} ${afacad.className}`}
                          onClick={handleOpenAddAddress}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                          </svg>
                          Add New Address
                        </button>
                      </>
                    ) : (
                      <div
                        onClick={handleOpenAddAddress}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "40px 20px",
                          border: "1px solid #EAEAEA",
                          borderRadius: "12px",
                          backgroundColor: "#FAFAFA",
                          cursor: "pointer",
                          transition: "0.2s",
                        }}
                      >
                        <span
                          className={afacad.className}
                          style={{
                            fontSize: "16px",
                            color: "#555",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                          Add New Address
                        </span>
                      </div>
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
                        onClick={() => {
                          setIsEditingAddress(false);
                          setEditingId(null); // เคลียร์สถานะแก้
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        className={`${styles.updateBtn} ${afacad.className}`}
                        onClick={async () => {
                          if (!validateAddress()) return;

                          let updatedAddresses = [...(user.addresses || [])];

                          if (addr.isDefault) {
                            updatedAddresses = updatedAddresses.map((item) => ({
                              ...item,
                              isDefault: false,
                            }));
                          }

                          if (editingId !== null) {
                            // ✏️ กรณี: กดแก้ไขของเดิม (นำข้อมูลใหม่ไปแทนที่ของเดิม)
                            updatedAddresses = updatedAddresses.map(
                              (item, i) => {
                                if ((item._id || i) === editingId) {
                                  return {
                                    ...item,
                                    ...addr,
                                    label: addr.addressLabel,
                                  };
                                }
                                return item;
                              },
                            );
                          } else {
                            // ➕ กรณี: เพิ่มที่อยู่ใหม่
                            if (updatedAddresses.length >= 5) {
                              alert("Maximum 5 addresses allowed");
                              return;
                            }
                            const newAddress = {
                              _id: Date.now().toString(),
                              ...addr,
                              label: addr.addressLabel,
                            };
                            updatedAddresses.push(newAddress);
                          }

                          await handleUpdate(updatedAddresses);

                          const newUser = {
                            ...user,
                            addresses: updatedAddresses,
                          };

                          setUser(newUser);
                          localStorage.setItem("user", JSON.stringify(newUser));

                          setIsEditingAddress(false);
                          setEditingId(null); // รีเซ็ตกลับ
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
