import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ========================
// POST - ثبت مقدار فیلد برای ملک
// ========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    /*
      body example:
      {
        propertyId: 1,
        values: [
          { fieldId: 2, value: "true" },
          { fieldId: 5, value: "پارکینگ اختصاصی" }
        ]
      }
    */

    const createdValues = await prisma.$transaction(
      body.values.map((item: any) =>
        prisma.propertyFieldValue.create({
          data: {
            propertyId: body.propertyId,
            fieldId: item.fieldId,
            value: item.value,
          },
        })
      )
    );

    return NextResponse.json(createdValues);
  } catch (error) {
    return NextResponse.json(
      { error: "خطا در ثبت ویژگی‌ها" },
      { status: 500 }
    );
  }
}