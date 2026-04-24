import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Check if slug exists
    const existingApplicant = await prisma.applicant.findUnique({
      where: { slug },
      select: { id: true, slug: true }
    });

    return NextResponse.json({
      available: !existingApplicant,
      slug: slug
    });

  } catch (error) {
    console.error("Error checking applicant slug:", error);
    return NextResponse.json(
      { error: "Error checking slug availability" },
      { status: 500 }
    );
  }
}
