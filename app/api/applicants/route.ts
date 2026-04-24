import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    interface PrismaFilter {
      [key: string]: any;
    }

    const whereClause: PrismaFilter = {};

    const simpleFields = [
      "city",
      "dealType",
      "propertyType",
      "status",
      "fullName",
      "province",
      "district",
      "propertyUnit",
      "propertydirection",
      "categoryTitle",
    ];

    const arrayFields = [
      "utilities",
      "propertySpecs",
      "commonAreas",
      "heatingCooling",
      "kitchenFeatures",
      "otherFeatures",
      "wallCeiling",
      "parkingTypes",
      "buildingFacade",
      "floorCovering",
    ];

    const rangeFields = [
      "budgetMin",
      "budgetMax",
      "minLandArea",
      "maxLandArea",
      "minBuildingArea",
      "maxBuildingArea",
      "minRoomNumber",
      "maxRoomNumber",
    ];

    // --- Process simple fields ---
    simpleFields.forEach((field) => {
      const value = searchParams.get(field);
      if (value !== null && value !== undefined) {
        if (value === "true" || value === "false") {
          whereClause[field] = value === "true";
        } else {
          whereClause[field] = value;
        }
      }
    });

    // --- Process array fields ---
    arrayFields.forEach((field) => {
      const rawValue = searchParams.get(field);

      if (rawValue !== null && rawValue !== undefined) {
        let parsedValue = null;
        try {
          parsedValue = JSON.parse(rawValue);
        } catch (e) {
          try {
            if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
              const contentInsideBrackets = rawValue.substring(
                1,
                rawValue.length - 1,
              );
              const quotedItems = contentInsideBrackets
                .split(",")
                .map((item) => `"${item.trim()}"`)
                .join(",");
              parsedValue = JSON.parse(`[${quotedItems}]`);
            }
          } catch (manualParseError) {
            console.error(
              `Error parsing field "${field}" with raw value "${rawValue}":`,
              manualParseError,
            );
          }
        }

        if (
          parsedValue &&
          Array.isArray(parsedValue) &&
          (parsedValue as any[]).length > 0
        ) {
          whereClause[field] = { hasSome: parsedValue };
        }
      }
    });

    // --- Process range fields ---
    rangeFields.forEach((field) => {
      const value = searchParams.get(field);
      if (value !== null && value !== undefined) {
        const numericValue = parseInt(value, 10);

        if (!isNaN(numericValue)) {
          if (field.startsWith("min")) {
            const actualField = field.substring(3).toLowerCase();
            if (!whereClause[actualField]) whereClause[actualField] = {};
            whereClause[actualField].gte = numericValue;
          } else if (field.startsWith("max")) {
            const actualField = field.substring(3).toLowerCase();
            if (!whereClause[actualField]) whereClause[actualField] = {};
            whereClause[actualField].lte = numericValue;
          } else {
            whereClause[field] = numericValue;
          }
        }
      }
    });

    // Process budget range specifically
    const minBudget = searchParams.get("minBudget");
    if (minBudget !== null) {
      const numericMinBudget = parseInt(minBudget, 10);
      if (!isNaN(numericMinBudget)) {
        if (!whereClause.budgetMin) whereClause.budgetMin = {};
        whereClause.budgetMin.gte = numericMinBudget;
      }
    }

    const maxBudget = searchParams.get("maxBudget");
    if (maxBudget !== null) {
      const numericMaxBudget = parseInt(maxBudget, 10);
      if (!isNaN(numericMaxBudget)) {
        if (!whereClause.budgetMax) whereClause.budgetMax = {};
        whereClause.budgetMax.lte = numericMaxBudget;
      }
    }

    console.log(
      "Generated Applicant Where Clause:",
      JSON.stringify(whereClause, null, 2),
    );

    const applicants = await prisma.applicant.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert BigInt to Number for JSON serialization
    const serializedApplicants = applicants.map((applicant: any) => ({
      ...applicant,
      budgetMin: applicant.budgetMin ? Number(applicant.budgetMin) : null,
      budgetMax: applicant.budgetMax ? Number(applicant.budgetMax) : null,
      minLandArea: applicant.minLandArea ? Number(applicant.minLandArea) : null,
      maxLandArea: applicant.maxLandArea ? Number(applicant.maxLandArea) : null,
      minBuildingArea: applicant.minBuildingArea ? Number(applicant.minBuildingArea) : null,
      maxBuildingArea: applicant.maxBuildingArea ? Number(applicant.maxBuildingArea) : null,
    }));

    return NextResponse.json(serializedApplicants);
  } catch (error) {
    console.error("GET applicants error:", error);
    let errorMessage = "Error fetching applicants";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("=== APPLICANT SUBMISSION DEBUG ===");
    console.log("Raw body:", JSON.stringify(body, null, 2));
    console.log("Title:", body.title);
    console.log("PropertyType:", body.propertyType);
    console.log("DealType:", body.dealType);
    console.log("================================");

    // Validate required fields
    if (!body.title || !body.propertyType || !body.dealType) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Required fields (title, propertyType, dealType) must be filled" },
        { status: 400 },
      );
    }

    // Check for duplicate slug
    if (body.slug) {
      const existingApplicant = await prisma.applicant.findUnique({
        where: { slug: body.slug },
        select: { id: true, slug: true }
      });

      if (existingApplicant) {
        console.log("Duplicate slug found:", body.slug);
        return NextResponse.json(
          { error: "Slug is duplicate", code: "DUPLICATE_SLUG" },
          { status: 409 }
        );
      }
    }

    // Generate slug from title if not provided
    const slug = body.slug || 
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        + '-' + Date.now();

    const newApplicant = await prisma.applicant.create({
      data: {
        title: body.title,
        slug: slug,
        description: body.description,
        fullName: body.fullName,
        mobile: body.mobile,
        phone: body.phone,
        email: body.email,
        propertyType: body.propertyType,
        dealType: body.dealType,
        status: body.status || "active",
        budgetMin: body.budgetMin ? BigInt(body.budgetMin) : null,
        budgetMax: body.budgetMax ? BigInt(body.budgetMax) : null,
        province: body.province,
        city: body.city,
        district: body.district,
        address: body.address,
        postalCode: body.postalCode,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        categoryTitle: body.categoryTitle,
        propertydirection: body.propertydirection,
        propertyUnit: body.propertyUnit,
        propertyFloors: body.propertyFloors,
        floor: body.floor,
        unitInFloor: body.unitInFloor,
        allUnit: body.allUnit,
        minLandArea: body.minLandArea ? BigInt(body.minLandArea) : null,
        maxLandArea: body.maxLandArea ? BigInt(body.maxLandArea) : null,
        minBuildingArea: body.minBuildingArea ? BigInt(body.minBuildingArea) : null,
        maxBuildingArea: body.maxBuildingArea ? BigInt(body.maxBuildingArea) : null,
        minRoomNumber: body.minRoomNumber ? parseInt(body.minRoomNumber) : null,
        maxRoomNumber: body.maxRoomNumber ? parseInt(body.maxRoomNumber) : null,
        // --- seo ---
        seoTitle: body.seoTitle,
        seoMeta: body.seoMeta,
        seoCanonikalOrigin: body.seoCanonikalOrigin,
        seoCanonikalDestination: body.seoCanonikalDestination,
        seoOrigin: body.seoOrigin,
        seoDestination: body.seoDestination,
        seoRedirect: body.seoRedirect,
        // --- seo ---
        // Array fields
        buildingFacade: body.buildingFacade || [],
        floorCovering: body.floorCovering || [],
        utilities: body.utilities || [],
        propertySpecs: body.propertySpecs || [],
        commonAreas: body.commonAreas || [],
        heatingCooling: body.heatingCooling || [],
        kitchenFeatures: body.kitchenFeatures || [],
        otherFeatures: body.otherFeatures || [],
        wallCeiling: body.wallCeiling || [],
        parkingTypes: body.parkingTypes || [],
      },
    });

    console.log("Applicant created successfully:", newApplicant.id);

    // Convert BigInt to Number for JSON serialization
    const serializedApplicant = {
      ...newApplicant,
      budgetMin: newApplicant.budgetMin ? Number(newApplicant.budgetMin) : null,
      budgetMax: newApplicant.budgetMax ? Number(newApplicant.budgetMax) : null,
      minLandArea: newApplicant.minLandArea ? Number(newApplicant.minLandArea) : null,
      maxLandArea: newApplicant.maxLandArea ? Number(newApplicant.maxLandArea) : null,
      minBuildingArea: newApplicant.minBuildingArea ? Number(newApplicant.minBuildingArea) : null,
      maxBuildingArea: newApplicant.maxBuildingArea ? Number(newApplicant.maxBuildingArea) : null,
    };

    return NextResponse.json(serializedApplicant);
  } catch (error) {
    console.error("Applicant creation error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    return NextResponse.json(
      {
        error: "Error creating applicant",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
