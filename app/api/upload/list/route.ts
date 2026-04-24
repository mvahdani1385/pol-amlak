import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import fs from 'fs/promises';

export async function GET() {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    try {
        const files = await readdir(uploadsDir);

        const imageExts = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
        const names = files
            .filter((f) => imageExts.has(path.extname(f).toLowerCase()))
            .map((f) => f);

        return NextResponse.json({ files: names });
    } catch (err) {
        return NextResponse.json(
            { files: [], error: "Failed to read uploads directory" },
            { status: 500 }
        );
    }
}


export async function DELETE(request: Request) {
    let fileName: string | null = null;
    try {
        const body = await request.json();
        fileName = body.fileName;

        if (!fileName || typeof fileName !== 'string') {
            return NextResponse.json(
                { message: "نام فایل معتبر نیست یا ارسال نشده است." },
                { status: 400 } 
            );
        }
    } catch (error) {
        console.error("Error parsing request body:", error);
        return NextResponse.json(
            { message: "خطا در پردازش درخواست." },
            { status: 400 }
        );
    }
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, fileName);
    try {
        
        await fs.unlink(filePath);
        return NextResponse.json({ message: `فایل ${fileName} با موفقیت حذف شد.` });
    } catch (error: any) {
        console.error(`Error deleting file ${fileName}:`, error);
        if (error.code === 'ENOENT') {
            return NextResponse.json(
                { message: `فایل ${fileName} یافت نشد.` },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "خطا در حذف فایل." },
            { status: 500 }
        );
    }
}