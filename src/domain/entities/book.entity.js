// domain/entities/book.entity.js
// Entity Pattern

export default class Book {
  constructor({
    bookId,
    sellerId,
    title,
    author,
    description,
    price,
    stock,
    status,
    images,
  }) {
    // 1. ตรวจสอบข้อมูลเบื้องต้น (เผื่อเพิ่มกฎเกณฑ์ในอนาคต)
    this.#validate(sellerId, title, price);

    // 2. กำหนดค่าพื้นฐานที่รับเข้ามา
    this.bookId = bookId;
    this.sellerId = sellerId;
    this.title = title;
    this.author = author;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.images = images || [];

    // 3. กำหนดค่าสถานะที่ผ่านการกรองแล้ว และเวลาสร้าง
    this.status = this.#validateStatus(status);
    this.createdAt = new Date();
  }

  // 🔹 Private Method สำหรับจัดการ Business Rules (สามารถนำคอมเมนต์ออกเพื่อใช้งานได้)
  #validate(sellerId, title, price) {
    // if (!sellerId) throw new Error("Seller ID is required");
    // if (!title) throw new Error("Book title is required");
    // if (price < 0) throw new Error("Price cannot be negative");
  }

  // 🔹 Private Method สำหรับกรองสถานะหนังสือ (Encapsulation)
  #validateStatus(status) {
    const validStatus = ["Published", "Out of Stock", "Inactive"];
    return validStatus.includes(status) ? status : "Published";
  }
}
