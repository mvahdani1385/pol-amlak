import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dynamicOptions = await prisma.dynamicOptions.findMany();
    return NextResponse.json(dynamicOptions);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { message: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, 
      Province, 
      city, 
      ContactPage, 
      aboutPage,
      siteName,
      logo,
      siteTarget,
      sitePhone,
      siteEmail,
      address,
      coptright,
      footerText,
      certificates
    } = body;

    if (id === undefined || id === null) {
      return NextResponse.json(
        { message: "ID is required for update" },
        { status: 400 },
      );
    }

    const updateData: any = {};
    
    // تمام فیلدها رو بدون شرط اضافه کن
    if (Province !== undefined) updateData.Province = Province;
    if (city !== undefined) updateData.city = city;
    if (ContactPage !== undefined) updateData.ContactPage = ContactPage;
    if (aboutPage !== undefined) updateData.aboutPage = aboutPage;
    if (siteName !== undefined) updateData.siteName = siteName;
    if (logo !== undefined) updateData.logo = logo;
    if (siteTarget !== undefined) updateData.siteTarget = siteTarget;
    if (sitePhone !== undefined) updateData.sitePhone = sitePhone;
    if (siteEmail !== undefined) updateData.siteEmail = siteEmail;
    if (address !== undefined) updateData.address = address;
    if (coptright !== undefined) updateData.coptright = coptright;
    if (footerText !== undefined) updateData.footerText = footerText;
    if (certificates !== undefined) {
      updateData.certificates = certificates;
    }

    // این خط رو برای دیباگ اضافه کن ببین چی میاد
    console.log("updateData:", updateData);
    console.log("body:", body);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No fields to update provided" },
        { status: 400 },
      );
    }

    const updatedDynamicOption = await prisma.dynamicOptions.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedDynamicOption);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to update dynamic option" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { 
      id, 
      Province, 
      city, 
      ContactPage, 
      aboutPage,
      siteName,
      logo,
      siteTarget,
      sitePhone,
      siteEmail,
      address,
      coptright,
      footerText,
      certificates
    } = body;
    if (!Province || !city) {
      return NextResponse.json(
        { message: "Province and city are required" },
        { status: 400 },
      );
    }

    const newDynamicOption = await prisma.dynamicOptions.create({
      data: {
        Province: Province,
        city: city,
      },
    });
    return NextResponse.json(newDynamicOption, { status: 201 });
  } catch (error) {
    console.error("Error creating dynamic option:", error);
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed")
    ) {
      return NextResponse.json(
        {
          message:
            "A dynamic option with this province and city already exists.",
        },
        { status: 409 },
      ); // 409 Conflict
    }
    return NextResponse.json(
      { message: "Failed to create dynamic option" },
      { status: 500 },
    );
  }
}



export async function DELETE(request: Request) {
  try {
    // برای متد DELETE، معمولاً ID را از path parameter یا query parameter می‌گیریم.
    // اگر قرار است ID را از body درخواست دریافت کنیم، این رویکرد کمی غیر معمول است
    // اما اگر اصرار دارید که فقط با دادن ID در body کار کند، به این صورت عمل می‌کنیم:

    const body = await request.json();
    const { id } = body;

    if (id === undefined || id === null) {
      return NextResponse.json({ message: 'ID is required for deletion' }, { status: 400 });
    }

    // اطمینان از اینکه ID عددی است (اگر فیلد id در دیتابیس از نوع عددی است)
    const numericId = Number(id);
    if (isNaN(numericId)) {
        return NextResponse.json({ message: 'ID must be a number' }, { status: 400 });
    }

    const deletedDynamicOption = await prisma.dynamicOptions.delete({
      where: {
        id: numericId,
      },
    });

    // اگر حذف موفقیت آمیز باشد، معمولاً پاسخ خالی با status 204 (No Content) یا
    // پیام تایید با status 200 برگردانده می‌شود.
    // برگرداندن رکورد حذف شده نیز گاهی مفید است.
    return NextResponse.json(
      { message: `Dynamic option with ID ${numericId} deleted successfully.`, deletedItem: deletedDynamicOption },
      { status: 200 }
    );

  } catch (error: any) { // استفاده از any برای دسترسی به error.code و error.message
    console.error("Error deleting dynamic option:", error);

    // مدیریت خطای P2025 (رکورد یافت نشد)
    if (error.code === 'P2025') {
      // error.meta.target معمولاً نام فیلدی که باعث خطا شده را نشان می‌دهد،
      // مثلاً 'id' در این مورد.
      return NextResponse.json(
        { message: `Dynamic option with ID ${error.meta?.target} not found.` },
        { status: 404 }
      );
    }

    // مدیریت خطاهای عمومی دیگر
    return NextResponse.json(
      { message: "Failed to delete dynamic option" },
      { status: 500 }
    );
  }
}