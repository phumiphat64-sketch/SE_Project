"use client";
import styles from "./editbook.module.css";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BackBar from "@/app/components/BackBar";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();

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

      router.push("/seller/inventory");
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

        <div className={styles.uploadBox}>
          {book?.images?.length > 0 && (
            <img src={book.images[0]} className={styles.imagePreview} />
          )}

          {book?.images?.slice(1, 4).map((img, index) => (
            <img key={index} src={img} className={styles.smallImage} />
          ))}

          {book?.images?.length < 4 && <div className={styles.addImage}>+</div>}
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
              <option>Inactive</option>
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
