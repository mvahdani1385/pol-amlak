import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import * as mm from "music-metadata";
import fs from 'fs/promises';
import { Buffer } from 'buffer';

// export async function GET() {
//     const uploadsDir = path.join(process.cwd(), "public", "uploads");

//     try {
//         const files = await readdir(uploadsDir);

//         const imageExts = new Set([".mp3", ".wav", ".aac"]);
//         const names = files
//             .filter((f) => imageExts.has(path.extname(f).toLowerCase()))
//             .map((f) => f);

//         return NextResponse.json({ files: names });
//     } catch (err) {
//         return NextResponse.json(
//             { files: [], error: "Failed to read uploads directory" },
//             { status: 500 }
//         );
//     }
// }


export async function GET() {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    try {
        const files = await readdir(uploadsDir);

        const audioExts = new Set([".mp3", ".wav", ".aac"]);

        const results: { filename: string; cover: string | null }[] = [];

        for (const f of files) {
            const ext = path.extname(f).toLowerCase();
            if (!audioExts.has(ext)) continue;

            const filePath = path.join(uploadsDir, f);
            let coverBase64: string | null = null;

            try {
                const metadata = await mm.parseFile(filePath);

                if (metadata.common.picture && metadata.common.picture.length > 0) {
                    const cover = metadata.common.picture[0];
                    coverBase64 = `data:${cover.format};base64,${Buffer.from(cover.data).toString('base64')}`;
                }
            } catch (err) {
                console.error("Metadata read error:", err);
            }

            results.push({
                filename: f,
                cover: coverBase64, // یا null اگر کاوری وجود نداشت
            });
        }

        return NextResponse.json({ files: results });
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