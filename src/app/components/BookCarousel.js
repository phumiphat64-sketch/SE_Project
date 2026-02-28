"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function BookCarousel({ books }) {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={30}
      slidesPerView={4}
      loop
      autoplay={{ delay: 2500 }}
      breakpoints={{
        0: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
      }}
    >
      {books.map((book, index) => (
        <SwiperSlide key={index}>
          <div className="book-card">
            <Image src={book.image} alt={book.title} width={150} height={220} />
            <h4>{book.title}</h4>
            <p>{book.author}</p>
            <p className="seller">🟢 {book.seller}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
