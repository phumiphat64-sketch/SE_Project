"use client";
import styles from "./editbook.module.css";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BackBar from "@/app/components/BackBar";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [newImages, setNewImages] = useState([]);

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

      <h2 className={styles.title}>Edit Book</h2>

      {/* Book Images */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Book Images</div>
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
          {/* OLD IMAGES */}
          {book?.images?.map((img, index) => (
            <div className={styles.imageItem}>
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
          {book.images.length + newImages.length < 6 && (
            <div
              className={styles.addImage}
              onClick={() => document.getElementById("imageUpload").click()}
            >
              +
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.sectionTitle}>Book Information</div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Book Title *</label>
            <input name="title" value={book.title} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label>Author *</label>
            <input
              name="author"
              value={book.author || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>About this book</label>
          <textarea
            name="description"
            value={book.description}
            onChange={handleChange}
          />
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.field}>
            <label>Price *</label>
            <input
              type="number"
              name="price"
              value={book.price}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Stock *</label>
            <input name="stock" value={book.stock} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label>Status *</label>
            <select name="status" value={book.status} onChange={handleChange}>
              <option>Published</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => router.push("/seller/inventory")}
          >
            Cancel
          </button>

          <button type="submit" className={styles.saveBtn}>
            Save Change
          </button>
        </div>
      </form>
    </div>
  );
}
