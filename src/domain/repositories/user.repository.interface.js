// domain/repositories/user.repository.interface.js
// Repository Pattern
// Repository Interface (Abstraction Layer)

export default class UserRepository {
  async create(user) {
    throw new Error("Method 'create()' must be implemented");
  }

  async findByEmail(email) {
    throw new Error("Method 'findByEmail()' must be implemented");
  }
}
