import Book from "../entities/book.entity";

export default class BookService {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async addBook(data) {
    const book = new Book(data);

    return await this.bookRepository.addBook(book);
  }

  async updateBook(bookId, data) {
    return await this.bookRepository.updateBook(bookId, data);
  }

  async deleteBook(bookId) {
    return await this.bookRepository.deleteBook(bookId);
  }
}
