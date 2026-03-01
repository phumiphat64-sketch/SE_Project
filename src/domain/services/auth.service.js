// Service Layer Pattern

import bcrypt from "bcryptjs"
import User from "../entities/user.entity.js"

export default class AuthService {

  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async register(data) {
    const existing = await this.userRepository.findByEmail(data.email)

    if (existing) {
      throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = new User({
      ...data,
      password: hashedPassword
    })

    return this.userRepository.create(user)
  }

}