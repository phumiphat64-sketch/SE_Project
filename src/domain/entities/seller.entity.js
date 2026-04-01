// domain/entities/seller.entity.js
// Entity Pattern

export default class Seller {
  constructor({
    userId,
    fullName,
    dateOfBirth,
    phone,
    storeName,
    storeDescription,
    bankName,
    accountName,
    accountNumber,
  }) {
    // 1. ตรวจสอบข้อมูลเบื้องต้น (ถ้ามีกฎเกณฑ์เพิ่มเติมในอนาคต)
    this.#validate(userId, storeName);

    // 2. กำหนดค่าพื้นฐานที่รับเข้ามา
    this.userId = userId;
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
    this.phone = phone;
    this.storeName = storeName;
    this.storeDescription = storeDescription;
    this.bankName = bankName;
    this.accountName = accountName;
    this.accountNumber = accountNumber;

    // 3. กำหนดค่าที่ระบบสร้างขึ้นอัตโนมัติ
    this.createdAt = new Date();
  }

  // 🔹 Private Method สำหรับจัดการ Business Rules ของ Seller โดยเฉพาะ
  #validate(userId, storeName) {
    if (!userId) {
      throw new Error("User ID is required to create a Seller profile");
    }
    // ตัวอย่างการเพิ่ม Guard Clause สำหรับบังคับใส่ชื่อร้าน (เอาคอมเมนต์ออกได้ถ้าต้องการใช้)
    // if (!storeName) {
    //   throw new Error("Store name is required");
    // }
  }
}
