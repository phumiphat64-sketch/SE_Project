// Service Layer Pattern + Dependency Injection + Guard Clause

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../entities/user.entity.js";

export default class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(data) {
    // 1. Guard Clause: เช็คว่ามีอีเมลนี้หรือยัง
    if (await this.userRepository.findByEmail(data.email)) {
      throw new Error("User already exists");
    }

    // 2. Hash Password & สร้าง Entity
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new User({
      ...data,
      password: hashedPassword,
    });

    return await this.userRepository.create(user);
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);

    // 1. Guard Clauses: รวมการเช็ค User และ Password ไว้ด้วยกันให้กระชับ
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    // 2. 🔐 Generate JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        status: user.status || "active", // 🔥 เพิ่มบรรทัดนี้
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // 3. Return Payload
    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        status: user.status || "active",
        role: user.role,
        addresses: user.addresses || [], // 👈 1. เพิ่มบรรทัดนี้ เพื่อส่งออกจาก Service
      },
    };
  }
}
