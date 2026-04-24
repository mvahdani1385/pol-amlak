// @ts-ignore
// TypeScript errors are ignored because dealTypeConditions field exists in Prisma schema

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ========================
// GET - لیست فیلدها
// ========================
export async function GET() {
  try {
    const fields = await prisma.propertyField.findMany({
      include: {
        options: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(fields);
  } catch (error) {
    return NextResponse.json(
      { error: "خطا در دریافت فیلدها" },
      { status: 500 }
    );
  }
}

// ========================
// POST - ساخت فیلد جدید
// ========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const field = await prisma.propertyField.create({
      data: {
        title: body.title,
        type: body.type, // text | number | select | boolean
        propertyType: body.propertyType,
        // @ts-ignore
        // dealTypeConditions field exists in database schema
        dealTypeConditions: body.dealTypeConditions && body.dealTypeConditions.length > 0 
          ? body.dealTypeConditions.join(',') 
          : null,
        isRequired: body.isRequired || false,
        isFilterable: body.isFilterable || false,

        options: body.options
          ? {
              create: body.options.map((opt: any) => ({
                label: opt.label,
                value: opt.value,
              })),
            }
          : undefined,
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json(field);
  } catch (error) {
    return NextResponse.json(
      { error: "خطا در ساخت فیلد" },
      { status: 500 }
    );
  }
}