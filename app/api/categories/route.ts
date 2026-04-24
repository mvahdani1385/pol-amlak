import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all categories
export async function GET() {
  try {
    const categories = await (prisma as any).filesCategory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
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

    // Debug: Check if slug field is recognized
    console.log('Creating category with data:', {
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
    });

    const category = await (prisma as any).filesCategory.create({
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

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}