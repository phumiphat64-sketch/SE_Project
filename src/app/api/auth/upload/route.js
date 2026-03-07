import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  console.log("UPLOAD API CALLED");
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

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        cloudinary.uploader
          .upload_stream({ folder: "books" }, (error, result) => {
            if (error) {
              console.log("CLOUDINARY ERROR:", error);
              reject(error);
            } else {
              console.log("UPLOAD SUCCESS:", result);
              resolve(result);
            }
          })
          .end(buffer);
    });

    return Response.json({
      success: true,
      path: uploadResult.secure_url,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
