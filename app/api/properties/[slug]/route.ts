import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // const { pathname } = new URL(request.url);
    // const slug = pathname.split("/").pop();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 },
      );
    }

    const property = await prisma.property.findUnique({
      where: {
        slug: slug,
      },
      include: {
        images: true,
        fieldValues: {
          include: {
            field: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 },
      );
    }

    const serializedProperty = {
      ...property,
      price: property.price ? Number(property.price) : null,
      meterPrice: property.meterPrice ? Number(property.meterPrice) : null,
      createYear: property.createYear ? Number(property.createYear) : null,
      depositPrice: property.depositPrice
        ? Number(property.depositPrice)
        : null,
      rentPrice: property.rentPrice ? Number(property.rentPrice) : null,
      pricePerMeter: property.pricePerMeter
        ? Number(property.pricePerMeter)
        : null,
      buildingArea: property.buildingArea
        ? Number(property.buildingArea)
        : null,
      landArea: property.landArea ? Number(property.landArea) : null,
    };

    return NextResponse.json(serializedProperty);
  } catch (error) {
    console.error("GET property by slug error:", error);
    return NextResponse.json(
      { message: "Failed to fetch property" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // const { pathname } = new URL(request.url);
    // const slug = pathname.split("/").pop();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 },
      );
    }

    const existingProperty = await prisma.property.findUnique({
      where: { slug: slug },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 },
      );
    }

    await prisma.property.delete({
      where: {
        slug: slug,
      },
    });

    return NextResponse.json(
      { message: `Property with slug '${slug}' deleted successfully.` },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE property by slug error:", error);
    return NextResponse.json(
      { message: "Failed to delete property" },
      { status: 500 },
    );
  }
}

const normalizeSlug = (input: string) => {
  const normalized = String(input)
    .trim()
    .normalize("NFC")
    // Arabic -> Persian
    .replace(/ك/g, "ک")
    .replace(/ي/g, "ی")
    .replace(/ى/g, "ی")
    // remove ZWNJ / ZWJ
    .replace(/[\u200C\u200D]/g, "")
    // normalize different hyphen characters
    .replace(/[‐‑‒–—―]/g, "-")
    // whitespace -> dash
    .replace(/\s+/g, "-")
    // keep Persian/Arabic letters, Latin letters, digits, dash
    .replace(/[^0-9A-Za-z\u0600-\u06FF-]+/g, "")
    // collapse repeated dashes
    .replace(/-+/g, "-")
    // trim dashes
    .replace(/^-+|-+$/g, "");

  return normalized;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
    // const { pathname } = new URL(request.url);
    // const slug = pathname.split("/").pop();
    const { slug } = await params;
  
  try {

    if (!slug) {
      console.error("Missing slug for PUT request");
      return NextResponse.json(
        { error: "شناسه ملک (slug) برای به‌روزرسانی الزامی است." },
        { status: 400 },
      );
    }

    const body = await request.json();

    console.log(`=== PROPERTY UPDATE DEBUG (Slug: ${slug}) ===`);
    console.log("Raw body:", JSON.stringify(body, null, 2));
    console.log("Title:", body.title);
    console.log("PropertyType:", body.propertyType);
    console.log("DealType:", body.dealType);
    console.log("Images array:", body.images);
    console.log("MainImageIndex:", body.mainImageIndex);
    console.log("Latitude:", body.latitude);
    console.log("Longitude:", body.longitude);
    console.log("==========================================");

    // اعتبارسنجی فیلدهای الزامی در صورت نیاز به اجبار در به‌روزرسانی
    // اگر می‌خواهید فیلدهای خاصی در آپدیت الزامی باشند، اینجا بررسی کنید.
    // مثال:
    // if (!body.title || !body.propertyType || !body.dealType) {
    //   console.error("Missing required fields for update");
    //   return NextResponse.json(
    //     { error: "فیلدهای الزامی (عنوان، نوع ملک، نوع معامله) باید در درخواست به‌روزرسانی پر شوند" },
    //     { status: 400 }
    //   );
    // }

    // بررسی وجود ملک قبل از به‌روزرسانی
    const existingProperty = await prisma.property.findUnique({
      where: { slug: slug },
    });

    if (!existingProperty) {
      console.error(`Property with slug '${slug}' not found for update.`);
      return NextResponse.json(
        { error: `ملک با شناسه '${slug}' یافت نشد.` },
        { status: 404 },
      );
    }

    // آماده‌سازی داده‌ها برای به‌روزرسانی
    const updateData: any = {};

    // اگر فیلدی در بدنه درخواست وجود دارد، آن را به داده‌های به‌روزرسانی اضافه کنید
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.ownerName !== undefined) updateData.ownerName = body.ownerName;
    if (body.ownerMobile !== undefined)
      updateData.ownerMobile = body.ownerMobile;
    if (body.ownerPhone !== undefined) updateData.ownerPhone = body.ownerPhone;
    if (body.guardName !== undefined) updateData.guardName = body.guardName;
    if (body.guardPhone !== undefined) updateData.guardPhone = body.guardPhone;
    if (body.propertyType !== undefined)
      updateData.propertyType = body.propertyType;
    if (body.dealType !== undefined) updateData.dealType = body.dealType;
    if (body.categoryTitle !== undefined) updateData.categoryTitle = body.categoryTitle;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.occupancyStatus !== undefined)
      updateData.occupancyStatus = body.occupancyStatus;
    if (body.isConvertible !== undefined)
      updateData.isConvertible = body.isConvertible;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.price !== undefined)
      updateData.price = body.price !== null ? BigInt(body.price) : null;
    if (body.depositPrice !== undefined)
      updateData.depositPrice =
        body.depositPrice !== null ? BigInt(body.depositPrice) : null;
    if (body.rentPrice !== undefined)
      updateData.rentPrice =
        body.rentPrice !== null ? BigInt(body.rentPrice) : null;
    if (body.pricePerMeter !== undefined)
      updateData.pricePerMeter =
        body.pricePerMeter !== null ? BigInt(body.pricePerMeter) : null;
    if (body.province !== undefined) updateData.province = body.province;
    if (body.city !== undefined) updateData.city = body.city;
    // --- seo ---
    if (body.seoTitle !== undefined) updateData.seoTitle = body.seoTitle;
    if (body.seoMeta !== undefined) updateData.seoMeta = body.seoMeta;
    if (body.seoCanonikalOrigin !== undefined) updateData.seoCanonikalOrigin = body.seoCanonikalOrigin;
    if (body.seoCanonikalDestination !== undefined) updateData.seoCanonikalDestination = body.seoCanonikalDestination;
    if (body.seoOrigin !== undefined) updateData.seoOrigin = body.seoOrigin;
    if (body.seoDestination !== undefined) updateData.seoDestination = body.seoDestination;
    if (body.seoRedirect !== undefined) updateData.seoRedirect = body.seoRedirect;
    // --- seo ---
    if (body.district !== undefined) updateData.district = body.district;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.postalCode !== undefined) updateData.postalCode = body.postalCode;
    if (body.latitude !== undefined) updateData.latitude = parseFloat(body.latitude);
    if (body.longitude !== undefined) updateData.longitude = parseFloat(body.longitude);
    if (body.roomNumber !== undefined) updateData.roomNumber = body.roomNumber;
    if (body.propertydirection !== undefined)
      updateData.propertydirection = body.propertydirection;
    if (body.propertyUnit !== undefined)
      updateData.propertyUnit = body.propertyUnit;
    if (body.propertyFloors !== undefined)
      updateData.propertyFloors = body.propertyFloors;
    if (body.floor !== undefined) updateData.floor = body.floor;
    if (body.meterPrice !== undefined)
      updateData.meterPrice =
        body.meterPrice !== null ? BigInt(body.meterPrice) : null;
    if (body.createYear !== undefined)
      updateData.createYear =
        body.createYear !== null ? BigInt(body.createYear) : null;
    if (body.parkingnum !== undefined) updateData.parkingnum = body.parkingnum;
    if (body.statusfile !== undefined) updateData.statusfile = body.statusfile;
    if (body.unitInFloor !== undefined)
      updateData.unitInFloor = body.unitInFloor;
    if (body.allUnit !== undefined) updateData.allUnit = body.allUnit;
    if (body.landArea !== undefined)
      updateData.landArea =
        body.landArea !== null ? BigInt(body.landArea) : null;
    if (body.buildingArea !== undefined)
      updateData.buildingArea =
        body.buildingArea !== null ? BigInt(body.buildingArea) : null;

    // مدیریت فیلدهای آرایه‌ای - تبدیل به رشته اگر آرایه است
    if (body.buildingFacade !== undefined) {
      updateData.buildingFacade = Array.isArray(body.buildingFacade)
        ? body.buildingFacade.join(", ")
        : body.buildingFacade;
    }
    if (body.floorCovering !== undefined) {
      updateData.floorCovering = Array.isArray(body.floorCovering)
        ? body.floorCovering.join(", ")
        : body.floorCovering;
    }
    if (body.utilities !== undefined)
      updateData.utilities = body.utilities || [];
    if (body.propertySpecs !== undefined)
      updateData.propertySpecs = body.propertySpecs || [];
    if (body.commonAreas !== undefined)
      updateData.commonAreas = body.commonAreas || [];
    if (body.heatingCooling !== undefined)
      updateData.heatingCooling = body.heatingCooling || [];
    if (body.kitchenFeatures !== undefined)
      updateData.kitchenFeatures = body.kitchenFeatures || [];
    if (body.bathroomFeatures !== undefined)
      updateData.bathroomFeatures = body.bathroomFeatures || [];
    if (body.wallCeiling !== undefined)
      updateData.wallCeiling = body.wallCeiling || [];
    if (body.parkingTypes !== undefined)
      updateData.parkingTypes = body.parkingTypes || [];
    if (body.otherFeatures !== undefined)
      updateData.otherFeatures = body.otherFeatures || [];

    // مدیریت تصاویر: حذف تصاویر مشخص شده و افزودن تصاویر جدید
    // ابتدا تصاویری که باید حذف شوند را حذف می‌کنیم
    if (
      body.deletedImageIds &&
      Array.isArray(body.deletedImageIds) &&
      body.deletedImageIds.length > 0
    ) {
      await prisma.propertyImage.deleteMany({
        where: {
          id: {
            in: body.deletedImageIds,
          },
        },
      });
    }

    // سپس تصاویر جدید را اضافه می‌کنیم
    if (body.newImageFileNames && Array.isArray(body.newImageFileNames)) {
      if (body.newImageFileNames.length > 0) {
        // دریافت تعداد تصاویر فعلی برای ادامه شماره‌گذاری sortOrder
        const existingImagesCount = await prisma.propertyImage.count({
          where: { propertyId: existingProperty.id },
        });

        // افزودن تصاویر جدید
        await prisma.propertyImage.createMany({
          data: body.newImageFileNames.map(
            (fileName: string, index: number) => ({
              propertyId: existingProperty.id,
              imageUrl: `/uploads/${fileName}`,
              isMain:
                existingImagesCount + index === (body.mainImageIndex || 0),
              sortOrder: existingImagesCount + index,
            }),
          ),
        });
      }
      // اگر آرایه خالی ارسال شد، کاری انجام نمی‌دهیم (تصاویر موجود حفظ می‌شوند)
    }

    // Check for duplicate slug if slug is being updated
    if (body.slug !== undefined && body.slug !== existingProperty.slug) {
      const duplicateProperty = await prisma.property.findUnique({
        where: { slug: body.slug },
        select: { id: true, slug: true }
      });

      if (duplicateProperty) {
        console.log("Duplicate slug found during update:", body.slug);
        return NextResponse.json(
          { error: "نامک تکراری است", code: "DUPLICATE_SLUG" },
          { status: 409 }
        );
      }
    }

    const updatedProperty = await prisma.property.update({
      where: {
        slug: slug,
      },
      data: updateData,
      include: {
        images: true, // در صورت نیاز، تصاویر را هم برگردانید
      },
    });

    console.log(`✅ Property with slug '${slug}' updated successfully.`);

    // تبدیل BigInt به Number برای JSON serialization
    const serializedProperty = {
      ...updatedProperty,
      price: updatedProperty.price ? Number(updatedProperty.price) : null,
      meterPrice: updatedProperty.meterPrice
        ? Number(updatedProperty.meterPrice)
        : null,
      createYear: updatedProperty.createYear
        ? Number(updatedProperty.createYear)
        : null,
      depositPrice: updatedProperty.depositPrice
        ? Number(updatedProperty.depositPrice)
        : null,
      rentPrice: updatedProperty.rentPrice
        ? Number(updatedProperty.rentPrice)
        : null,
      pricePerMeter: updatedProperty.pricePerMeter
        ? Number(updatedProperty.pricePerMeter)
        : null,
      buildingArea: updatedProperty.buildingArea
        ? Number(updatedProperty.buildingArea)
        : null,
      landArea: updatedProperty.landArea
        ? Number(updatedProperty.landArea)
        : null,
    };

    return NextResponse.json(serializedProperty);
  } catch (error) {
    console.error(
      `❌ Error updating property with slug '${slug || "unknown"}':`,
      error,
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    // برای خطاهای مربوط به عدم وجود ملک، پیام مناسب‌تری برگردانید
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { error: `ملک با شناسه '${slug || "unknown"}' یافت نشد.` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        error: "خطا در به‌روزرسانی ملک",
        details: error instanceof Error ? error.message : "Unknown error",
        // stack: error instanceof Error ? error.stack : undefined // معمولاً استک تریس را در محیط پروداکشن برنمی‌گردانیم
      },
      { status: 500 },
    );
  }
}
