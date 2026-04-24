import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET() {
    try {
        const ArticleCommetn = await prisma.articleCommetn.findMany();
        return NextResponse.json(ArticleCommetn);
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({ message: 'Failed to fetch articles' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newComment = await prisma.articleCommetn.create({
            data: {
                articleId: body.articleId,
                articleSlug: body.articleSlug,
                user: body.user,
                comment: body.comment,
                replay: body.replay,
                userID: null
            },
        });

        return NextResponse.json(newComment, { status: 201 });

    } catch (error) {
        console.error('Error creating article:', error);

        if (error instanceof Error && error.message.includes('Unique constraint failed')) {
            return NextResponse.json({ message: 'An article with this title already exists.' }, { status: 409 }); // Conflict
        }

        return NextResponse.json({ message: 'Failed to create comment fd:'  + error}, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ message: 'Comment ID is required for update.' }, { status: 400 }); // Bad Request
        }

        const updatedComment = await prisma.articleCommetn.update({
            where: { id: id },
            data: {
                replay: updateData.replay,
                verify: updateData.verify || false,
            },
        });

        return NextResponse.json(updatedComment, { status: 200 }); 

    } catch (error: any) {
        console.error('Error updating comment:', error);
        
        if (error.code === 'P2025') { 
            return NextResponse.json({ message: 'Comment not found.' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Failed to update comment: ' + error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;
        if (!id) {
            return NextResponse.json({ message: 'Comment ID is required for deletion.' }, { status: 400 });
        }
        await prisma.articleCommetn.delete({
            where: { id: id },
        });
        return NextResponse.json({ message: `Comment with ID ${id} deleted successfully.` }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting comment:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ message: 'Comment not found.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Failed to delete comment: ' + error.message }, { status: 500 });
    }
}