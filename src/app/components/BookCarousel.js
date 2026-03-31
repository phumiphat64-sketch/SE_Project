"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import styles from "./BookCarousel.module.css";

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
                <img src={book.images?.[0]} alt={book.title} />
              </div>

              <div className={styles.info}>
                <h4>{book.title}</h4>
                <p>{book.author}</p>

                <div className={styles.sellerRow}>
                  <img
                    src={sellerImages[index % sellerImages.length]}
                    className={styles.avatar}
                  />
                  <span>{book.sellerInfo?.fullName}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
