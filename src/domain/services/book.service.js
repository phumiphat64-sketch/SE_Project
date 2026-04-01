import Book from "../entities/book.entity";

//Dependency Injection + Service Pattern

export default class BookService {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async addBook(data) {
    // 🔹 ยุบรวมการสร้าง Entity (new Book) และส่งให้ Repository ไว้ในบรรทัดเดียว
    return await this.bookRepository.addBook(new Book(data));
  }

  async updateBook(bookId, data) {
    return await this.bookRepository.updateBook(bookId, data);
  }

  async deleteBook(bookId) {
    return await this.bookRepository.deleteBook(bookId);
  }
}
