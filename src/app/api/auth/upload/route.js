import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return Response.json({
        success: false,
        error: "No file uploaded",
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(process.cwd(), "public/uploads", file.name);

    await writeFile(filePath, buffer);

    return Response.json({
      success: true,
      path: `/uploads/${file.name}`,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
