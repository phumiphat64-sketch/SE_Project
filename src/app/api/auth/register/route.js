import MongoUserRepository from "@/infrastructure/repositories/user.repository.mongo";
import AuthService from "@/domain/services/auth.service";

export async function POST(req) {
  try {
    const body = await req.json();

    const userRepo = new MongoUserRepository();
    const authService = new AuthService(userRepo);

    await authService.register(body);

    return Response.json({ message: "User created" });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 400 });
  }
}
