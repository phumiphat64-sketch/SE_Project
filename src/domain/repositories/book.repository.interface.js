// domain/repositories/book.repository.interface.js
// Repository Pattern + Dependency Inversion Principle
// Repository Interface (Abstraction Layer)

export default class BookRepository {
  async addBook(book) {
    throw new Error("Method 'addBook()' must be implemented");
  }

  async updateBook(bookId, data) {
    throw new Error("Method 'updateBook()' must be implemented");
  }

  async deleteBook(bookId) {
    throw new Error("Method 'deleteBook()' must be implemented");
  }

  async getBooksBySeller(sellerId) {
    throw new Error("Method 'getBooksBySeller()' must be implemented");
  }
}
