"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import styles from "./BookCarousel.module.css";
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

const sellerImages = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"];

export default function BookCarousel({ books }) {
  return (
    <div className={styles.carouselContainer}>
      <Swiper
        className={styles.mySwiper} /* 👈 เพิ่ม className ตรงนี้ */
        modules={[Autoplay]}
        slidesPerView={5}
        spaceBetween={55}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        speed={800}
      >
        {/* ... โค้ดด้านในเหมือนเดิม ... */}
        {books.map((book, index) => (
          <SwiperSlide key={index}>
            <div className={styles.bookCard}>
              <div className={styles.imageWrapper}>
                <img
                  src={book.images?.[0]}
                  alt={book.title}
                  width={300}
                  height={220}
                  className={styles.bookImage}
                  quality={100}
                />
              </div>

              <div className={styles.info}>
                <h4 className={crimson.className}>{book.title}</h4>

                <p className={afacad.className}>{book.author}</p>

                <div className={styles.sellerRow}>
                  <div
                    className={styles.avatarWrap}
                    style={{
                      background: [
                        "#f2c94c", // เหลือง
                        "#f28b82", // ชมพู/แดงอ่อน
                        "#a7d7c5", // เขียวมิ้น
                        "#d1c4e9", // ม่วงอ่อน
                        "#f7c59f", // ส้มพีช 👈 เพิ่มใหม่
                      ][index % 5],
                    }}
                  >
                    <img
                      src={sellerImages[index % sellerImages.length]}
                      className={styles.avatar}
                    />
                  </div>
                  <span className={afacad.className}>
                    {book.sellerInfo?.fullName}
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
