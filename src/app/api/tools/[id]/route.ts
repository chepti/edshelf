import { NextRequest, NextResponse } from 'next/server';
import { getToolByIdFromSheet } from '@/lib/google-sheets';

export async function GET(
  request: NextRequest, // Changed from Request to NextRequest
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: 'Tool ID is required' }, { status: 400 });
    }

    const tool = await getToolByIdFromSheet(id);

    if (!tool) {
      return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
    }

    return NextResponse.json(tool);
  } catch (error) {
    console.error(`Failed to get tool with id ${params.id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch tool', error: (error as Error).message }, { status: 500 });
  }
} 