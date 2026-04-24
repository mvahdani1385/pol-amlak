import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { pathname } = new URL(request.url);
        const slug = pathname.split('/').pop();

        if (!slug) {
            return NextResponse.json({ message: 'slug is required' }, { status: 400 });
        }

        const article = await prisma.article.findFirst({
            where: {
                slug: slug,
            },
        });

        if (!article) {
            return NextResponse.json({ message: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json({ message: 'Failed to fetch article' }, { status: 500 });
    }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
    try {
        // const { pathname } = new URL(request.url);
        // const slug = pathname.split('/').pop();
        const { slug } = await params;
        const body = await request.json();

        // اگر title اجباری است، همچنان بررسی شود. اگر title هم اختیاری است، این شرط را حذف کنید.
        // if (!body.title) {
        //     return NextResponse.json({ message: 'Title is required for update' }, { status: 400 });
        // }

        const existingArticle = await prisma.article.findUnique({
            where: { slug: slug },
        });

        if (!existingArticle) {
            return NextResponse.json({ message: 'Article not found' }, { status: 404 });
        }

        const updatedArticle = await prisma.article.update({
            where: { slug: slug },
            data: {
                title: body.title !== undefined ? body.title : existingArticle.title,
                content: body.content !== undefined ? body.content : existingArticle.content,
                slug: body.slug !== undefined ? body.slug : existingArticle.slug,
                coverImage: body.coverImageName !== undefined ? body.coverImageName : existingArticle.coverImage,
                categories: body.categories !== undefined ? body.categories : existingArticle.categories,
                active: body.active !== undefined ? body.active : existingArticle.active,
                redirect: body.redirect !== undefined ? body.redirect : existingArticle.redirect,
                // --- seo ---
                seoTitle: body.seoTitle,
                seoMeta: body.seoMeta,
                seoCanonikalOrigin: body.seoCanonikalOrigin,
                seoCanonikalDestination: body.seoCanonikalDestination,
                // indexed: body.indexed,
                seoOrigin: body.seoOrigin,
                seoDestination: body.seoDestination,
                seoRedirect: body.seoRedirect,
            },
        });

        return NextResponse.json(updatedArticle, { status: 200 });

    } catch (error) {
        console.error('Error updating article:', error);

        if (error instanceof Error && error.message.includes('Unique constraint failed')) {
            return NextResponse.json({ message: 'An article with this title/slug already exists.' }, { status: 409 });
        }

        return NextResponse.json({ message: 'Failed to update article' }, { status: 500 });
    }
}




export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
    try {
        // const { pathname } = new URL(request.url);
        // const slug = pathname.split('/').pop();
        const { slug } = await params;


        const existingArticle = await prisma.article.findUnique({
            where: { slug: slug },
        });

        if (!existingArticle) {
            return NextResponse.json({ message: 'Article not found' }, { status: 404 });
        }


        await prisma.article.delete({
            where: { slug: slug },
        });


        return new Response(null, { status: 204 });

    } catch (error) {
        console.error('Error deleting article:', error);

        return NextResponse.json({ message: 'Failed to delete article' }, { status: 500 });
    }
}