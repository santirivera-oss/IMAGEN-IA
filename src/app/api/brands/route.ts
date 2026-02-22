import { NextRequest, NextResponse } from 'next/server';
import { createBrand, getBrands, countImagesForBrand } from '@/lib/store/memory';

export async function GET() {
  try {
    const brands = await getBrands();
    const withCounts = await Promise.all(
      brands.map(async (brand) => ({
        ...brand,
        imageCount: await countImagesForBrand(brand.id),
      }))
    );
    return NextResponse.json({ brands: withCounts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, primaryColor, secondaryColor, accentColor, styleGuide, moodKeywords } = body;
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
    const brand = await createBrand({
      name,
      description,
      primaryColor,
      secondaryColor,
      accentColor,
      styleGuide,
      moodKeywords,
    });
    return NextResponse.json({ success: true, brand });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
