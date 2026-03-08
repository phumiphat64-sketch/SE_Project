export const dynamic = "force-dynamic";

import MongoUserRepository from "@/infrastructure/repositories/user.repository.mongo";
import AuthService from "@/domain/services/auth.service";

function validateInput(body) {
  const { name, email, phone, password, role, acceptedTerms } = body;

  if (!name || !email || !phone || !password || !role) {
    throw new Error("Missing required fields");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  const phoneRegex = /^0[689]\d{8}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid phone number");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (!["buyer", "seller"].includes(role)) {
    throw new Error("Invalid role");
  }

  if (!acceptedTerms) {
    throw new Error("You must accept the terms");
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    validateInput(body);

    const userRepo = new MongoUserRepository();
    const authService = new AuthService(userRepo);

    await authService.register(body);

    return Response.json({ message: "User created" });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 400 });
  }
}
