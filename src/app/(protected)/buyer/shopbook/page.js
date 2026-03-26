"use client";
import styles from "./orderSummary.module.css";
import { useRouter } from "next/navigation";

export default function OrderSummaryPage() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      {/* STEP BAR */}
      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={`${styles.circle} ${styles.circleBlue}`}>
            {/* แก้ Path รูปภาพให้ตรงกับไฟล์ของคุณ */}
            <img
              src="/icons/t2.svg"
              alt="Shopping"
              className={styles.stepIcon}
            />
          </div>
          <span className={styles.stepText}>Shopping</span>
        </div>

        {/* Connection arrow */}
        <div className={styles.connectionArrow}>
          <div className={styles.arrowHead} />
        </div>

        <div className={styles.step}>
          <div className={`${styles.circle} ${styles.circleDarkBlue}`}>
            <img
              src="/icons/t1.svg"
              alt="Order Summary"
              className={styles.stepIcon}
            />
          </div>
          <span className={`${styles.stepText} ${styles.stepTextBold}`}>
            Order Summary
          </span>
        </div>

        {/* Connection arrow */}
        <div className={styles.connectionArrow}>
          <div className={styles.arrowHead} />
        </div>

        <div className={styles.step}>
          <div className={`${styles.circle} ${styles.circleBeige}`}>
            {/* ใส่รูป Payment ไอคอนของคุณ */}
            <img
              src="/icons/t3.svg"
              alt="Payment"
              className={styles.stepIcon}
            />
          </div>
          <span className={styles.stepText}>Payment</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.pageTitle}>Order Summary</h2>

          <div className={styles.cardsRow}>
            {/* LEFT CARD */}
            <div className={styles.card}>
              <h3 className={styles.cardHeaderTitle}>Shipping Address</h3>
              <p className={styles.cardSubHeader}>Select Shipping Address</p>

              <div className={styles.addressBox}>
                <div className={styles.addressBoxHeader}>
                  <img
                    src="/icons/home.svg"
                    alt="Home"
                    className={styles.addressBoxIcon}
                  />
                  <span className={styles.addressBoxType}>Home</span>
                  <span className={styles.badge}>Default</span>
                  <img
                    src="/check.svg"
                    alt="Checked"
                    className={styles.checkedIcon}
                  />
                </div>

                <div className={styles.addressBoxBody}>
                  <p className={styles.addressName}>Klein Moretti</p>
                  <p className={styles.addressText}>
                    4, ซอยพรีเว็ต, เมืองลิตเติลวิงกิง, มณฑลเซอร์เรย์, 100000,
                    ประเทศอังกฤษ
                  </p>
                  <p className={styles.addressPhone}>Phone : 012 123 1234</p>
                </div>
              </div>

              <button className={styles.addBtn}>
                <img
                  src="/icons/add_circle.svg"
                  alt="Add"
                  className={styles.addIcon}
                />
                Add New Address
              </button>
            </div>

            {/* RIGHT CARD */}
            <div className={styles.card}>
              <h3 className={styles.cardHeaderTitle}>
                <img
                  src="/icons/t3.svg"
                  alt="Summary"
                  className={styles.rightCardIcon}
                />
                Order Summary
              </h3>

              <div className={styles.productListing}>
                <img
                  src="/images/book-cover.png"
                  alt="book"
                  className={styles.bookCover}
                />
                <div className={styles.productDetails}>
                  <div className={styles.productInfoTop}>
                    <p className={styles.sellerName}>Seller name</p>
                    <p className={styles.bookPriceTop}>฿ 190.00</p>
                  </div>
                  <div className={styles.productInfoMiddle}>
                    <p className={styles.bookName}>Book name</p>
                    <p className={styles.quantityLabel}>Quantity</p>
                    <p className={styles.quantityCount}>1</p>
                  </div>
                  <div className={styles.productInfoBottom}>
                    <p className={styles.subtotalLabel}>Subtotal</p>
                    <p className={styles.subtotalPrice}>฿ 190.00</p>
                  </div>
                </div>
              </div>

              <div className={styles.totalRow}>
                <p className={styles.totalLabel}>Total</p>
                <p className={styles.totalPrice}>฿ 190.00</p>
              </div>

              <button className={styles.placeOrder}>Place Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
