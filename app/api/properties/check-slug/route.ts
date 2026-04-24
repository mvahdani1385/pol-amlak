import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug || slug.trim() === '') {
      return NextResponse.json(
        { error: "نامک الزامی است" },
        { status: 400 }
      );
    }

    // Basic slug validation
    if (slug.length < 3) {
      return NextResponse.json({
        available: false,
        message: "نامک باید حداقل ۳ کاراکتر باشد"
      });
    }

    // Check if slug contains only valid characters (alphanumeric and hyphens)
    if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
      return NextResponse.json({
        available: false,
        message: "نامک فقط می‌تواند شامل حروف انگلیسی، اعداد و خط تیره باشد"
      });
    }

    // Check for duplicate slug in database
    const existingProperty = await prisma.property.findUnique({
      where: { slug: slug.trim() },
      select: { id: true, slug: true }
    });

    return NextResponse.json({
      available: !existingProperty,
      message: existingProperty ? "نامک تکراری است" : "نامک آزاد است"
    });

  } catch (error) {
    console.error("Error checking slug availability:", error);
    return NextResponse.json(
      { error: "خطا در بررسی نامک" },
      { status: 500 }
    );
  }
}
