import SellerRepositoryMongo from "@/infrastructure/repositories/seller.repository.mongo";
import SellerService from "@/domain/services/seller.service";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.userId) {
      return Response.json({ message: "User ID is required" }, { status: 400 });
    }

    const sellerRepo = new SellerRepositoryMongo();
    const sellerService = new SellerService(sellerRepo);

    const result = await sellerService.registerSeller(body);

    return Response.json({
      message: "Seller profile created",
      sellerId: result.insertedId,
    });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 400 });
  }
}
