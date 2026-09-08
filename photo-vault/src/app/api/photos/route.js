import { NextResponse } from "next/server";
import { getCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

function uploadBuffer(cloudinary, buffer, fileName) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "photo-vault",
        public_id: `${Date.now()}-${fileName?.replace(/\.[^/.]+$/, "") || "photo"}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function GET() {
  try {
    const cloudinary = getCloudinary();
    const result = await cloudinary.search
      .expression("folder:photo-vault")
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    const photos = result.resources.map((item) => ({
      publicId: item.public_id,
      url: item.secure_url,
      createdAt: item.created_at,
      width: item.width,
      height: item.height,
      bytes: item.bytes,
    }));

    return NextResponse.json({ photos });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch photos." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const cloudinary = getCloudinary();
    const formData = await request.formData();
    const file = formData.get("photo");

    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await uploadBuffer(cloudinary, buffer, file.name);

    return NextResponse.json({
      photo: {
        publicId: result.public_id,
        url: result.secure_url,
        createdAt: result.created_at,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Upload failed." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const cloudinary = getCloudinary();
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json({ message: "publicId is required." }, { status: 400 });
    }

    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ message: "Photo deleted." });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Delete failed." },
      { status: 500 }
    );
  }
}
