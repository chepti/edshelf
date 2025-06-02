import { NextRequest, NextResponse } from 'next/server';
import { getToolByIdFromSheet } from '@/lib/google-sheets';

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any // Using 'any' as a workaround for the persistent type error, ESLint rule disabled for this line
) {
  try {
    // Perform type assertion for params internally
    const params = context.params as { id: string };
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
    // Safely access id for logging, attempting a similar cast if context.params exists
    const errorId = (context?.params as { id: string })?.id || "unknown";
    console.error(`Failed to get tool with id ${errorId}:`, error);
    return NextResponse.json({ message: 'Failed to fetch tool', error: (error as Error).message }, { status: 500 });
  }
} 