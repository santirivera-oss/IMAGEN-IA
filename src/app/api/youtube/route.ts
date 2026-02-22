import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { createThumbnail, getThumbnails } from '@/lib/store/memory';

export const maxDuration = 60;

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;
async function getZAI() {
  if (!zaiInstance) zaiInstance = await ZAI.create();
  return zaiInstance;
}

export async function GET() {
  try {
    const thumbnails = await getThumbnails();
    return NextResponse.json({ thumbnails });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch thumbnails' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, style, textColor } = body;
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

    let prompt = `YouTube thumbnail, eye-catching, vibrant colors, "${title}" text prominently displayed,`;

    const styleMap: Record<string, string> = {
      gaming: 'gaming aesthetic, neon colors, dynamic action',
      tech: 'tech review style, clean modern, futuristic',
      lifestyle: 'lifestyle vlog, warm colors, friendly',
      educational: 'educational style, clean, professional',
      entertainment: 'entertainment style, fun, exciting',
      dramatic: 'dramatic style, high contrast, cinematic',
      minimalist: 'minimalist design, clean, simple',
    };
    if (style) prompt += ` ${styleMap[style] || style},`;
    if (textColor) prompt += ` ${textColor} accent colors,`;
    prompt += ' high quality, attention-grabbing';
    if (description) prompt += `, ${description}`;

    const zai = await getZAI();
    const response = await zai.images.generations.create({ prompt, size: '1344x768' });

    if (!response.data?.[0]?.base64) throw new Error('Invalid API response');

    const thumbnail = await createThumbnail({
      title,
      description,
      prompt,
      imageBase64: response.data[0].base64,
      size: '1344x768',
      style,
      textColor,
    });

    return NextResponse.json({ success: true, thumbnail });
  } catch (error) {
    console.error('YouTube thumbnail error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 });
  }
}
