import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    const body = await request.json();
    const { 
      title, 
      slug, 
      description, 
      imageUrl,
      seoTitle,
      seoMeta,
      seoCanonikalOrigin,
      seoCanonikalDestination,
      indexed,
      seoOrigin,
      seoDestination,
      seoRedirect
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const category = await (prisma as any).filesCategory.update({
      where: { id: categoryId },
      data: {
        title,
        slug,
        description,
        imageUrl,
        seoTitle,
        seoMeta,
        seoCanonikalOrigin,
        seoCanonikalDestination,
        indexed,
        seoOrigin,
        seoDestination,
        seoRedirect
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    await (prisma as any).filesCategory.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}