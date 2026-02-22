import { NextRequest, NextResponse } from 'next/server';
import { getCharacterById, updateCharacter, deleteCharacter } from '@/lib/store/memory';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const character = await getCharacterById(id);
  if (!character) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ character });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  await updateCharacter(id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteCharacter(id);
  return NextResponse.json({ success: true });
}
