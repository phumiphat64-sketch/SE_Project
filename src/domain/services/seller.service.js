import Seller from "../entities/seller.entity";

export default class SellerService {
  constructor(sellerRepository) {
    this.sellerRepository = sellerRepository;
  }

  async registerSeller(data) {
    const { userId } = data;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // เช็คว่า user นี้เป็น seller แล้วหรือยัง
    const existing = await this.sellerRepository.getSellerByUserId(userId);

    if (existing) {
      throw new Error("Seller already exists");
    }

    const seller = new Seller(data);

    return await this.sellerRepository.createSellerProfile(seller);
  }
}
