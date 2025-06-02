import { NextRequest, NextResponse } from 'next/server';
import { getToolByIdFromSheet } from '@/lib/google-sheets';

// Define an interface for the route context
interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  context: RouteContext // Use the defined interface for the second argument
) {
  try {
    const id = context.params.id; // Access id from context.params
    if (!id) {
      return NextResponse.json({ message: 'Tool ID is required' }, { status: 400 });
    }

    const tool = await getToolByIdFromSheet(id);

    if (!tool) {
      return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
    }

    return NextResponse.json(tool);
  } catch (error) {
    // Safely access id for logging, in case context.params itself is problematic
    const errorId = context?.params?.id || "unknown";
    console.error(`Failed to get tool with id ${errorId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch tool', error: (error as Error).message }, { status: 500 });
  }
} 