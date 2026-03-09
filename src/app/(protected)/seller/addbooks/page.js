"use client";
import styles from "./addbook.module.css";
import { useRef, useState } from "react";
import PageHeader from "@/app/components/PageHeader";
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

export default function AddBookPage() {
  const fileInput = useRef(null);
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(1);

  const handleUploadClick = () => {
    fileInput.current.click();
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handlePublish = async () => {
    if (!title || !author || !price) {
      alert("Please fill required fields");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    try {

        const uploadedImages = [];

        for (const img of images) {
          const formData = new FormData();
          formData.append("file", img.file);

          const uploadRes = await fetch("/api/auth/upload", {
            method: "POST",
            body: formData,
          });

          const uploadData = await uploadRes.json();

          if (uploadData.success) {
            uploadedImages.push(uploadData.path);
          }
        }
      const bookData = {
        title,
        author,
        description,
        price: Number(price),
        stock: Number(stock),
        images: uploadedImages,
      };

      const res = await fetch("/api/auth/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Failed to publish book");
        return;
      }

      alert("Book published successfully!");

      setTitle("");
      setAuthor("");
      setDescription("");
      setPrice("");
      setStock(1);
      setImages([]);
    } catch (error) {
      console.error(error);
    }

  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      {/* Back */}
      <PageHeader title="Add Book" />

      {/* BOOK IMAGES */}
      <div className={`${styles.card} ${afacad.className}`}>
        <div className={`${styles.cardHeader} ${afacad.className}`}>Book Images</div>

        <div className={styles.cardBody}>
          <p className={`${styles.uploadText} ${afacad.className}`}>
            Upload book cover and sample images PNG,JPG
          </p>

          <div
            className={styles.uploadBox}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              ref={fileInput}
              multiple
              accept="image/png,image/jpeg"
              hidden
              onChange={handleFiles}
            />

            <button className={`${styles.uploadBtn} ${afacad.className}`} onClick={handleUploadClick}>
              <img src="/icons/upload.svg" alt="upload" />
              Upload images
            </button>

            <span className={`${styles.dragText} ${afacad.className}`}>Drag & Drop images here</span>
          </div>
          {images.length > 0 && (
            <div className={styles.previewGrid}>
              {images.map((img, index) => (
                <div key={index} className={styles.previewCard}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => removeImage(index)}
                  >
                    <img src="/icons/trash.svg" alt="delete" />
                  </button>
                  <img src={img.url} />

                  <p>{img.file.name}</p>
                  <span>{(img.file.size / 1024).toFixed(1)} KB</span>
                </div>
              ))}

              <div className={styles.addMore} onClick={handleUploadClick}>
                +
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOOK INFORMATION */}
      <div className={styles.card}>
        <div className={`${styles.cardHeader} ${afacad.className}`}>Book Information</div>

        <div className={`${styles.cardBody} ${afacad.className}`}>
          <div className={styles.formGroup}>
            <label>
              Book Title <span>*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              Author <span>*</span>
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>About this book</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>
                Price <span>*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                Stock <span>*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={stock}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 1) setStock(value);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Publish Button */}
      <div className={styles.publishWrap}>
        <button className={`${styles.publishBtn} ${afacad.className}`} onClick={handlePublish}>
          Publish Book
        </button>
      </div>
    </div>
  );
}
