"use client";
import styles from "./editbook.module.css";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BackBar from "@/app/components/BackBar";
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

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [newImages, setNewImages] = useState([]);
  const [open, setOpen] = useState(false);

  const [book, setBook] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    stock: "",
    status: "",
    images: [],
  });

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  async function fetchBook() {
    const res = await fetch(`/api/auth/book/${id}`);

    if (!res.ok) {
      console.error("API ERROR", res.status);
      return;
    }

    const data = await res.json();
    console.log("API RESULT:", data);

    console.log(data);

    if (data.success && data.data) {
      setBook(data.data);
    }
  }

  function handleChange(e) {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
        const uploaded = [];

        for (const img of newImages) {
          const formData = new FormData();
          formData.append("file", img.file);

          const res = await fetch("/api/auth/upload", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (data.success) {
            uploaded.push(data.path);
          }
        }

        book.images = [...book.images, ...uploaded];

      const res = await fetch(`/api/auth/book/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      if (!res.ok) {
        console.error("UPDATE ERROR", res.status);
        return;
      }

      const data = await res.json();

      console.log("UPDATE SUCCESS", data);

      router.replace("/seller/inventory");
      router.refresh();
    } catch (err) {
      console.error("UPDATE FAILED", err);
    }
  }

  return (
    <div className={styles.container}>
      <BackBar text="Back to All Books" link="/seller/inventory" />

      <h2 className={`${styles.title} ${afacad.className}`}>Edit Book</h2>

      {/* Book Images */}
      <div className={styles.section}>
        <div className={`${styles.sectionTitle} ${afacad.className}`}>
          Book Images
        </div>
        <input
          type="file"
          multiple
          accept="image/png,image/jpeg"
          hidden
          id="imageUpload"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            const imgs = files.map((file) => ({
              file,
              url: URL.createObjectURL(file),
            }));

            setNewImages((prev) => [...prev, ...imgs]);
          }}
        />

        <div className={styles.uploadBox}>
          <p className={`${styles.uploadText} ${afacad.className}`}>
            Upload book cover and sample images PNG,JPG
          </p>
          <div className={styles.uploadImages}>
            {/* OLD IMAGES */}
            {book?.images?.map((img, index) => (
              <div key={"old" + index} className={styles.imageItem}>
                <img src={img} className={styles.imagePreview} />

                <button className={styles.trashBtn}>
                  <img src="/icons/trash.svg" />
                </button>

                <div className={styles.checkMark}>✓</div>
              </div>
            ))}

            {/* NEW IMAGES */}
            {newImages.map((img, index) => (
              <div key={"new" + index} className={styles.imageItem}>
                <img src={img.url} className={styles.imagePreview} />

                <button
                  className={styles.trashBtn}
                  onClick={() =>
                    setNewImages((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  <img src="/icons/trash.svg" />
                </button>

                <div className={styles.checkMark}>✓</div>
              </div>
            ))}

            {/* ADD BUTTON */}
            {book.images.length + newImages.length < 9 && (
              <div
                className={styles.addImage}
                onClick={() => document.getElementById("imageUpload").click()}
              >
                +
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={`${styles.sectionTitle} ${afacad.className}`}>
          Book Information
        </div>
        <div className={styles.row}>
          <div className={`${styles.field} ${afacad.className}`}>
            <label>
              Book Title <span className={styles.required}>*</span>
            </label>
            <input
              name="title"
              value={book.title}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className={`${styles.field} ${afacad.className}`}>
            <label>
              Author <span className={styles.required}>*</span>
            </label>
            <input
              name="author"
              value={book.author || ""}
              onChange={handleChange}
              maxLength={60}
              required
            />
          </div>
        </div>

        <div className={`${styles.field} ${afacad.className}`}>
          <label>About this book</label>
          <textarea
            name="description"
            value={book.description}
            onChange={(e) => {
              handleChange(e);

              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            maxLength={1000}
          />
        </div>

        <div className={styles.bottomRow}>
          <div className={`${styles.field} ${afacad.className}`}>
            <label>
              Price <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              name="price"
              value={book.price}
              onChange={handleChange}
              min="0"
              max="99999"
              required
            />
          </div>

          <div className={`${styles.field} ${afacad.className}`}>
            <label>
              Stock <span className={styles.required}>*</span>
            </label>
            <input
              name="stock"
              value={book.stock}
              onChange={handleChange}
              min="0"
              max="999"
              required
            />
          </div>

          <div className={`${styles.field} ${afacad.className}`}>
            <label>
              Status <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.statusSelect}
              name="status"
              value={book.status}
              onChange={handleChange}
            >
              <option value="Published">Published</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.cancelBtn} ${afacad.className}`}
            onClick={() => router.push("/seller/inventory")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={`${styles.saveBtn} ${afacad.className}`}
          >
            Save Change
          </button>
        </div>
      </form>
    </div>
  );
}
