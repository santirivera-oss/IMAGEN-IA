import { NextRequest, NextResponse } from 'next/server';
import { getImageById, updateImage, deleteImage } from '@/lib/store/memory';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const image = await getImageById(id);
  if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ image });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  await updateImage(id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteImage(id);
  return NextResponse.json({ success: true });
}
