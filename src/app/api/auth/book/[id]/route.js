import { getClient } from "@/infrastructure/database/mongoDB";
import MongoBookRepository from "@/infrastructure/repositories/mongo.book.repository";

export async function GET(request, context) {
  const { id } = await context.params;

  console.log("PARAM ID:", id);

  const repo = new MongoBookRepository();

  const book = await repo.findById(id);

  console.log("BOOK FOUND:", book);

  return Response.json({
    success: true,
    data: book,
  });
}

export async function PUT(req, context) {
  const { id } = await context.params;

  const body = await req.json();

  const repo = new MongoBookRepository();

  const updated = await repo.update(id, body);

  return Response.json({
    success: true,
    data: updated,
  });
}
