export default class Seller {
  constructor({
    userId,
    fullName,
    dateOfBirth,
    phone,
    storeName,
    storeDescription,
    bankName,
    accountName,
    accountNumber,
  }) {
    this.userId = userId;
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
    this.phone = phone;
    this.storeName = storeName;
    this.storeDescription = storeDescription;
    this.bankName = bankName;
    this.accountName = accountName;
    this.accountNumber = accountNumber;
    this.createdAt = new Date();
  }
}
