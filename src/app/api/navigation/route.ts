import { NextResponse } from 'next/server';
import { STATIC_NAVIGATION } from '@/lib/navigation';

export async function GET() {
  try {
    return NextResponse.json(STATIC_NAVIGATION);
  } catch (error) {
    console.error('Failed to get navigation:', error);
    return NextResponse.json({ error: 'Failed to get navigation' }, { status: 500 });
  }
}