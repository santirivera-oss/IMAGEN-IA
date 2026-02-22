import { NextRequest, NextResponse } from 'next/server';
import { getImages, deleteImage } from '@/lib/store/memory';

export async function GET() {
  try {
    const images = await getImages();
    return NextResponse.json({ images, total: images.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await deleteImage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
