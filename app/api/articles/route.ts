import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET() {
    try {
        const articles = await prisma.article.findMany();
        return NextResponse.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({ message: 'Failed to fetch articles' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, slug, coverImageName, categories } = body;

        if (!title || !content) {
            return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
        }

        const newArticle = await prisma.article.create({
            data: {
                title: body.title,
                content: body.content,
                slug: body.slug,
                active: body.active,
                redirect: body.redirect,
                coverImage: body.coverImageName,
                categories: body.categories || [],
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

        return NextResponse.json(newArticle, { status: 201 });

    } catch (error) {
        console.error('Error creating article:', error);

        if (error instanceof Error && error.message.includes('Unique constraint failed')) {
            return NextResponse.json({ message: 'An article with this title already exists.' }, { status: 409 }); // Conflict
        }

        return NextResponse.json({ message: 'Failed to create article' }, { status: 500 });
    }
}

