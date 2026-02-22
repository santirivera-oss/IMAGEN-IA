import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { createImage, getCharacterById, getBrandById } from '@/lib/store/memory';

export const maxDuration = 60;

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;
async function getZAI() {
  if (!zaiInstance) zaiInstance = await ZAI.create();
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, size = '1024x1024', style, mood, lighting, characterId, brandId, type = 'text-to-image' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const validSizes = ['1024x1024', '768x1344', '864x1152', '1344x768', '1152x864', '1440x720', '720x1440'];
    if (!validSizes.includes(size)) {
      return NextResponse.json({ error: `Invalid size` }, { status: 400 });
    }

    let enhancedPrompt = prompt;

    if (characterId) {
      const char = await getCharacterById(characterId);
      if (char) {
        enhancedPrompt = `${char.basePrompt}, ${prompt}`;
        if (char.styleNotes) enhancedPrompt += `, ${char.styleNotes}`;
      }
    }

    if (brandId) {
      const brand = await getBrandById(brandId);
      if (brand) {
        if (brand.styleGuide) enhancedPrompt += `, ${brand.styleGuide}`;
        if (brand.moodKeywords) enhancedPrompt += `, ${brand.moodKeywords}`;
      }
    }

    if (style) enhancedPrompt += `, ${style} style`;
    if (mood) enhancedPrompt += `, ${mood} mood`;
    if (lighting) enhancedPrompt += `, ${lighting} lighting`;
    enhancedPrompt += ', high quality, detailed, professional';

    const zai = await getZAI();
    const response = await zai.images.generations.create({
      prompt: enhancedPrompt,
      size: size as '1024x1024',
    });

    if (!response.data?.[0]?.base64) {
      throw new Error('Invalid response from API');
    }

    const image = await createImage({
      prompt,
      enhancedPrompt,
      imageBase64: response.data[0].base64,
      size,
      style,
      mood,
      lighting,
      type,
      characterId,
      brandId,
    });

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}
