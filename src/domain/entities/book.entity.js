export default class Book {
  constructor({
    bookId,
    sellerId,
    title,
    author,
    description,
    price,
    stock,
    status,
    images,
  }) {
    this.bookId = bookId;
    this.sellerId = sellerId;
    this.title = title;
    this.author = author;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.images = images || [];

    const validStatus = ["Published", "Out of Stock", "Inactive"];
    this.status = validStatus.includes(status) ? status : "Published";

    this.createdAt = new Date();
  }
}
