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
    // Basic Validation (Business Rule)
    if (!email) {
      throw new Error("Email is required");
    }

    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    if (!acceptedTerms) {
      throw new Error("Terms must be accepted");
    }

    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;

    this.role = role; // buyer | seller
    this.acceptedTerms = true;
    this.acceptedAt = new Date();

    this.createdAt = new Date();
  }
}
