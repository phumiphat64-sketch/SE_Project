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

export async function PUT(req) {
  try {
    const body = await req.json();
    console.log("ข้อมูลที่รับมาจาก Frontend:", body);
    // 1. แยก id ออกมาจากข้อมูลที่จะอัปเดต (name, phone, address)
    const { id, ...data } = body;

    if (!id) {
      return Response.json({ error: "User id missing" }, { status: 400 });
    }

    const userRepo = new MongoUserRepository();

    // 2. ส่ง id และข้อมูลไปอัปเดต
    const updatedUser = await userRepo.update(id, data);

    if (!updatedUser) {
      return Response.json(
        { error: "User not found or update failed" },
        { status: 404 },
      );
    }

    return Response.json(
      { message: "Update success", user: updatedUser },
      { status: 200 },
    );
  } catch (err) {
    console.error("API PUT Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
