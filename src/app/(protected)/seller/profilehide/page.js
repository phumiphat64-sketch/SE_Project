"use client";
import { useState } from "react";
import styles from "./seller2.module.css";
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

export default function ProfilePage() {
    const [showBank, setShowBank] = useState(false);
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

    useEffect(() => {
      const loadProfile = async () => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const user = JSON.parse(storedUser);

        const res = await fetch(`/api/auth/seller/profile?userId=${user.id}`);
        const data = await res.json();

        setProfile(data);
      };

      loadProfile();
    }, []);

    const handleChange = (e) => {
      const { name, value } = e.target;

      setProfile((prev) => ({
        ...prev,
        [name]: value.trimStart(),
      }));
    };

    const handleUpdate = async () => {
      if (!profile?.fullName || !profile?.phone) {
        alert("Please fill required fields");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/auth/seller/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            ...profile,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Profile updated successfully");
        } else {
          alert(data.error || "Update failed");
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* LEFT SIDEBAR */}
        <div className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <img
                  src="/profile.png"
                  alt="profile"
                  className={styles.avatarImg}
                />
              </div>

              <div>
                <p className={styles.name + " " + afacad.className}>
                  {user?.name || ""}
                </p>
                <p className={styles.email + " " + afacad.className}>
                  {user?.email || ""}
                </p>
              </div>
            </div>

            <button className={styles.buyerBtn + " " + afacad.className}>
              <img src="/shopping_bag.svg" className={styles.btnIcon} />
              Buyer Mode
            </button>

            <button className={styles.sellerBtn + " " + afacad.className}>
              <img src="/storefront.svg" className={styles.btnIcon} />
              Seller Mode
              <span className={styles.activeTag + " " + afacad.className}>
                Active
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className={styles.content}>
          <div className={styles.formCard}>
            <div className={styles.sectionHeaderWrapper}>
              <div className={styles.sectionHeader + " " + afacad.className}>
                Basic Information
              </div>
            </div>

            <div className={styles.formGrid + " " + afacad.className}>
              <div>
                <label>Name</label>
                <input
                  name="fullName"
                  maxLength={100}
                  value={profile?.fullName || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Email</label>
                <input value={user?.email || ""} readOnly />
              </div>
            </div>

            <div className={styles.phoneField}>
              <label>Phone Number</label>
              <input
                name="phone"
                maxLength={10}
                pattern="[0-9]*"
                inputMode="numeric"
                value={profile?.phone || ""}
                onChange={handleChange}
              />

              <p className={styles.helper}>
                Thai phone number format: 0XXXXXXXXX (10 digits)
              </p>
            </div>

            <div className={styles.sectionHeaderWrapper}>
              <div className={styles.sectionHeader + " " + afacad.className}>
                Bank Account Information
                <button
                  className={styles.eyeBtn}
                  onClick={() => setShowBank(!showBank)}
                >
                  <img
                    src={
                      showBank ? "/icons/Eye close.svg" : "/icons/Eye open.svg"
                    }
                    alt="toggle"
                  />
                </button>
              </div>
            </div>

            <div className={styles.bankFields + " " + afacad.className}>
              <label>Bank Name</label>
              <input
                name="bankName"
                maxLength={50}
                type={showBank ? "text" : "password"}
                value={profile?.bankName || ""}
                onChange={handleChange}
              />

              <label>Account Name</label>
              <input
                name="accountName"
                maxLength={100}
                type={showBank ? "text" : "password"}
                value={profile?.accountName || ""}
                onChange={handleChange}
              />

              <label>Account Number</label>
              <input
                name="accountNumber"
                maxLength={15}
                pattern="[0-9]*"
                inputMode="numeric"
                type={showBank ? "text" : "password"}
                value={profile?.accountNumber || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.updateBtnWrapper}>
              <button
                onClick={handleUpdate}
                className={styles.updateBtn + " " + afacad.className}
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
