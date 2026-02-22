import { NextRequest, NextResponse } from 'next/server';
import { getBrandById, updateBrand, deleteBrand } from '@/lib/store/memory';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const brand = await getBrandById(id);
  if (!brand) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ brand });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  await updateBrand(id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteBrand(id);
  return NextResponse.json({ success: true });
}
