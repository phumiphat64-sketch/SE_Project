"use client";
import styles from "./seller1.module.css";

export default function SellerPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.bookLeft}></div>

        <div>
          <h1 className={styles.title}>Become a Seller</h1>
          <p className={styles.subtitle}>
            Fill in the details below to start selling on ReRead.
          </p>
        </div>

        <div className={styles.bookRight}></div>
      </div>

      {/* Personal Info */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.icon}></div>
          <span>Personal Information</span>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.fullRow}>
            <label>
              Full name <span className={styles.required}>*</span>
            </label>
            <input type="text" placeholder="Daenerys Targaryen" />
          </div>

          <div className={styles.row}>
            <div style={{ flex: "0 0 35%" }}>
              <label>
                Date of Birth <span className={styles.required}>*</span>
              </label>
              <input type="date" />
            </div>

            <div style={{ flex: "0 0 35%" }}>
              <label>
                Phone Number <span className={styles.required}>*</span>
              </label>
              <input type="text" placeholder="098 987 9876" />
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.icon}></div>
          <span>Store Information</span>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.fullRow}>
            <label>
              Store Name <span className={styles.required}>*</span>
            </label>
            <input type="text" placeholder="Store Name" />
          </div>

          <div className={styles.fullRow}>
            <label>
              Store Description <span className={styles.required}>*</span>
            </label>
            <textarea placeholder="Tell buyer about your store"></textarea>
          </div>
        </div>
      </div>

      {/* Payout */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.icon}></div>
          <span>Payout Information</span>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.row}>
            <div className={`${styles.bankWrapper} ${styles.bankField}`}>
              <label>
                Bank Name <span className={styles.required}>*</span>
              </label>

              <div className={styles.bankSelect}>
                {/* <div className={styles.bankLogo}></div> */}

                <select>
                  <option>Select a Bank</option>
                  <option>Bangkok Bank</option>
                  <option>Krung Thai Bank</option>
                  <option>Kasikornbank</option>
                  <option>Siam Commercial Bank</option>
                </select>
              </div>
            </div>

            <div className={styles.row1}>
              <label>
                Account Name <span className={styles.required}>*</span>
              </label>
              <input type="text" />
            </div>
          </div>

          <div className={styles.fullRow}>
            <label>
              Account Number <span className={styles.required}>*</span>
            </label>
            <input type="text" />
          </div>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <button className={styles.button}>Start Selling</button>
      </div>
    </div>
  );
}
