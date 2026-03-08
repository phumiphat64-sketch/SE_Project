import SellerRepositoryMongo from "@/infrastructure/repositories/seller.repository.mongo";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ message: "User ID required" }, { status: 400 });
  }

  const repo = new SellerRepositoryMongo();
  const seller = await repo.getSellerByUserId(userId);

  if (!seller) {
    return Response.json({ message: "Seller not found" }, { status: 404 });
  }

  return Response.json(seller);
}

export async function PUT(req) {
  const body = await req.json();

  const { userId, fullName, phone, bankName, accountName, accountNumber } =
    body;

  if (!userId) {
    return Response.json({ message: "User ID required" }, { status: 400 });
  }

  if (phone.length !== 10) {
    return Response.json({ message: "Invalid phone" }, { status: 400 });
  }

  const repo = new SellerRepositoryMongo();

  await repo.updateSellerByUserId(userId, {
    fullName,
    phone,
    bankName,
    accountName,
    accountNumber,
  });

  return Response.json({ message: "Profile updated" });
}
