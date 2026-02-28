import connectDB from "@/infrastructure/database/mongoDB";
import User from "@/domain/user.model";

export async function GET() {
  await connectDB();

  await User.create({
    email: "test@test.com",
    password: "123456",
  });

  return Response.json({ message: "User created" });
}
