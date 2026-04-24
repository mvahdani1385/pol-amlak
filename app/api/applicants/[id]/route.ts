import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updatedApplicant = await prisma.applicant.update({
      where: { id: Number(id) },
      data: {
        ...body,
        budgetMin: body.budgetMin ? BigInt(body.budgetMin) : undefined,
        budgetMax: body.budgetMax ? BigInt(body.budgetMax) : undefined,
        minLandArea: body.minLandArea ? BigInt(body.minLandArea) : undefined,
        maxLandArea: body.maxLandArea ? BigInt(body.maxLandArea) : undefined,
        minBuildingArea: body.minBuildingArea ? BigInt(body.minBuildingArea) : undefined,
        maxBuildingArea: body.maxBuildingArea ? BigInt(body.maxBuildingArea) : undefined,
      },
    });

    // Convert BigInt to Number for JSON serialization
    const serializedApplicant = {
      ...updatedApplicant,
      budgetMin: updatedApplicant.budgetMin ? Number(updatedApplicant.budgetMin) : null,
      budgetMax: updatedApplicant.budgetMax ? Number(updatedApplicant.budgetMax) : null,
      minLandArea: updatedApplicant.minLandArea ? Number(updatedApplicant.minLandArea) : null,
      maxLandArea: updatedApplicant.maxLandArea ? Number(updatedApplicant.maxLandArea) : null,
      minBuildingArea: updatedApplicant.minBuildingArea ? Number(updatedApplicant.minBuildingArea) : null,
      maxBuildingArea: updatedApplicant.maxBuildingArea ? Number(updatedApplicant.maxBuildingArea) : null,
    };

    return NextResponse.json(serializedApplicant);
  } catch (error) {
    console.error("Error updating applicant:", error);
    return NextResponse.json(
      { error: "Error updating applicant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.applicant.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Applicant deleted successfully" });
  } catch (error) {
    console.error("Error deleting applicant:", error);
    return NextResponse.json(
      { error: "Error deleting applicant" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const applicant = await prisma.applicant.findUnique({
      where: { id: Number(id) },
    });

    if (!applicant) {
      return NextResponse.json(
        { error: "Applicant not found" },
        { status: 404 }
      );
    }

    // Convert BigInt to Number for JSON serialization
    const serializedApplicant = {
      ...applicant,
      budgetMin: applicant.budgetMin ? Number(applicant.budgetMin) : null,
      budgetMax: applicant.budgetMax ? Number(applicant.budgetMax) : null,
      minLandArea: applicant.minLandArea ? Number(applicant.minLandArea) : null,
      maxLandArea: applicant.maxLandArea ? Number(applicant.maxLandArea) : null,
      minBuildingArea: applicant.minBuildingArea ? Number(applicant.minBuildingArea) : null,
      maxBuildingArea: applicant.maxBuildingArea ? Number(applicant.maxBuildingArea) : null,
    };

    return NextResponse.json(serializedApplicant);
  } catch (error) {
    console.error("Error fetching applicant:", error);
    return NextResponse.json(
      { error: "Error fetching applicant" },
      { status: 500 }
    );
  }
}
