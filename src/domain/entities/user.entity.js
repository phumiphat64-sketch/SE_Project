// domain/entities/user.entity.js

// Entity Pattern
// Represent business object (No DB logic here)

export default class User {
  constructor({
    name,
    email,
    password,
    phone,
    dateOfBirth,
    role,
    acceptedTerms,
  }) {
    // 1. เรียกใช้สมการตรวจสอบข้อมูล (Validation)
    this.#validate(email, password, acceptedTerms);

    // 2. กำหนดค่าพื้นฐานที่รับเข้ามา
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
    this.role = role; // buyer | seller

    // 3. กำหนดค่าที่ระบบสร้างขึ้นอัตโนมัติ (Auto-generated fields)
    this.acceptedTerms = true;
    this.acceptedAt = new Date();
    this.createdAt = new Date();
  }

  // 🔹 Private Method สำหรับเก็บ Business Rules โดยเฉพาะ
  // ทำให้ Constructor ด้านบนคลีนและอ่านจากบนลงล่างได้ง่ายขึ้น
  #validate(email, password, acceptedTerms) {
    if (!email) {
      throw new Error("Email is required");
    }
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    if (!acceptedTerms) {
      throw new Error("Terms must be accepted");
    }
  }
}
