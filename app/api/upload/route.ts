import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { put } from '@vercel/blob';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const fileName = formData.get('fileName') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'فایلی ارسال نشده است' },
                { status: 400 }
            );
        }

        if (!fileName) {
            return NextResponse.json(
                { error: 'نام فایل ارسال نشده است' },
                { status: 400 }
            );
        }

        // ایجاد پوشه uploads/properties اگر وجود ندارد
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        const blob = await put(file.name, file, {
      access: 'public',
    });
        
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (mkdirError) {
            console.error('Error creating directory:', mkdirError);
        }
        
        // خواندن فایل
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // ذخیره فایل
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        console.log('File uploaded successfully:', fileName);

        return NextResponse.json({
            success: true,
            fileName: fileName,
            path: `/uploads/${fileName}`
        });

    } catch (error) {
        console.error('Upload error details:', error);
        return NextResponse.json(
            { 
                error: 'خطا در آپلود فایل',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
