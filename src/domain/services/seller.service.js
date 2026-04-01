import Seller from "../entities/seller.entity";

//Dependency Injection + Service Pattern + Guard Clause

export default class SellerService {
  constructor(sellerRepository) {
    this.sellerRepository = sellerRepository;
  }

  async registerSeller(data) {
    const { userId } = data;

    // 1. Guard Clauses: ตรวจสอบความถูกต้องเบื้องต้น
    if (!userId) throw new Error("User not authenticated");

    // 2. Business Logic: เช็คว่า user นี้เป็น seller แล้วหรือยัง
    const existing = await this.sellerRepository.getSellerByUserId(userId);
    if (existing) throw new Error("Seller already exists");

    // 3. Entity Creation & Persist: สร้าง object และบันทึก
    const seller = new Seller(data);
    return await this.sellerRepository.createSellerProfile(seller);
  }
}
