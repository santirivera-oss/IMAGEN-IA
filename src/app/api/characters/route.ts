import { NextRequest, NextResponse } from 'next/server';
import { createCharacter, getCharacters, countImagesForCharacter } from '@/lib/store/memory';

export async function GET() {
  try {
    const characters = await getCharacters();
    const withCounts = await Promise.all(
      characters.map(async (char) => ({
        ...char,
        imageCount: await countImagesForCharacter(char.id),
      }))
    );
    return NextResponse.json({ characters: withCounts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, basePrompt, traits, styleNotes } = body;
    if (!name || !basePrompt) {
      return NextResponse.json({ error: 'Name and basePrompt required' }, { status: 400 });
    }
    const character = await createCharacter({
      name,
      description: description || '',
      basePrompt,
      traits,
      styleNotes,
    });
    return NextResponse.json({ success: true, character });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create character' }, { status: 500 });
  }
}
