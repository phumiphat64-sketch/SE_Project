import SellerRepositoryMongo from "@/infrastructure/repositories/seller.repository.mongo";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const repo = new SellerRepositoryMongo();
    const seller = await repo.getSellerByUserId(userId);

    return Response.json({
      isSeller: !!seller,
    });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}
