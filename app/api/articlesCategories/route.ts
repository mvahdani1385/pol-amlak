import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

// GET → گرفتن همه دسته‌ها
export async function GET() {
    try {
        const categories = await prisma.articlesCategories.findMany({
            orderBy: { id: "desc" }
        });

        return NextResponse.json({
            success: true,
            data: categories,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// POST → ساخت دسته جدید
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            name,
            slug,
            description,
            seoTitle,
            seoMeta,
            seoCanonikalOrigin,
            seoCanonikalDestination,
            indexed,
            seoOrigin,
            seoDestination,
            seoRedirect,
        } = body;

        const existingCategory = await prisma.articlesCategories.findUnique({
            where: {
                slug: slug,
            },
        });

        if (existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'این نامک قبلاً استفاده شده است. لطفاً یک نامک دیگر انتخاب کنید.',
                },
                { status: 409 }
            );
        }

        const newCategory = await prisma.articlesCategories.create({
            data: {
                name,
                slug,
                description,
                seoTitle,
                seoMeta,
                seoCanonikalOrigin,
                seoCanonikalDestination,
                indexed,
                seoOrigin,
                seoDestination,
                seoRedirect,
            },
        });

        return NextResponse.json({
            success: true,
            data: newCategory,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}



// PUT → آپدیت یک دسته (ID از Body گرفته می‌شود)
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const id = typeof body.id === 'string' ? parseInt(body.id) : body.id;

        if (id === undefined || isNaN(id)) {
            return NextResponse.json(
                { success: false, message: "ID is required in the request body and must be a number." },
                { status: 400 }
            );
        }
        const { id: extractedId, ...dataToUpdate } = body;
        const updatedCategory = await prisma.articlesCategories.update({
            where: { id: extractedId },
            data: dataToUpdate,
        });
        return NextResponse.json({ success: true, data: updatedCategory });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { success: false, message: "Category not found for update" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// DELETE → حذف یک دسته (ID از Body گرفته می‌شود)
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const id = typeof body.id === 'string' ? parseInt(body.id) : body.id;
        if (id === undefined || isNaN(id)) {
            return NextResponse.json(
                { success: false, message: "ID is required in the request body and must be a number." },
                { status: 400 }
            );
        }
        await prisma.articlesCategories.delete({
            where: { id },
        });
        return NextResponse.json(
            { success: true, message: "Category deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { success: false, message: "Category not found for deletion" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}