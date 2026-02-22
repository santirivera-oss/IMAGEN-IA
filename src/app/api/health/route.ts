import { NextResponse } from 'next/server';
import { queryDocs, COLLECTIONS } from '@/lib/firebase/firestore';

export async function GET() {
  try {
    const images = await queryDocs(COLLECTIONS.IMAGES, { limit: 1 });
    return NextResponse.json({
      success: true,
      message: 'Firestore REST API working',
      projectId: 'imagina-ia',
      testResult: images
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
