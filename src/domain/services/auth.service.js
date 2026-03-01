// Service Layer Pattern

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../entities/user.entity.js";

export default class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(data) {
    const existing = await this.userRepository.findByEmail(data.email);

    if (existing) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new User({
      ...data,
      password: hashedPassword,
    });

    return this.userRepository.create(user);
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    // 🔐 Generate JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
