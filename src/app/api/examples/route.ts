import { NextResponse } from 'next/server';
import { Example } from '@/types';
// import { getExamplesFromSheet, addExampleToSheet } from '@/lib/google-sheets';

let examples: Example[] = []; // Mock data

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const toolId = searchParams.get('toolId');

  try {
    if (toolId) {
      // const toolExamples = await getExamplesFromSheet(toolId);
      const toolExamples = examples.filter(example => example.toolId === toolId);
      return NextResponse.json(toolExamples);
    }
    return NextResponse.json(examples);
  } catch (error) {
    console.error("Failed to get examples:", error);
    return NextResponse.json({ message: 'Failed to fetch examples', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: Handle file uploads if included, this is a simplified version for JSON data
    const { toolId, userId, title, description, fileUrl, link } = body as Omit<Example, 'id' | 'createdAt'>;

    if (!toolId || !userId || !title || !description) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newExample: Example = {
      id: String(Date.now()),
      toolId,
      userId, // Get from session
      title,
      description,
      fileUrl,
      link,
      createdAt: new Date().toISOString(),
    };

    // await addExampleToSheet(newExample);
    examples.push(newExample);

    return NextResponse.json(newExample, { status: 201 });
  } catch (error) {
    console.error("Failed to add example:", error);
    return NextResponse.json({ message: 'Failed to add example', error: (error as Error).message }, { status: 500 });
  }
} 