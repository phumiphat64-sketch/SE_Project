export default class Book {
  constructor({
    bookId,
    sellerId,
    title,
    category,
    description,
    price,
    condition,
    status,
    images,
  }) {
    this.bookId = bookId;
    this.sellerId = sellerId;
    this.title = title;
    this.category = category;
    this.description = description;
    this.price = price;
    this.condition = condition;
    this.status = status || "available";
    this.images = images || [];
    this.createdAt = new Date();
  }
}
