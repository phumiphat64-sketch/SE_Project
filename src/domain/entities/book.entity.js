export default class Book {
  constructor({
    bookId,
    sellerId,
    title,
    description,
    price,
    stock,
    status,
    images,
  }) {
    this.bookId = bookId;
    this.sellerId = sellerId;
    this.title = title;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.status = status || "available";
    this.images = images || [];
    this.createdAt = new Date();
  }
}
