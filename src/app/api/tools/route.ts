import { NextResponse } from 'next/server';
import { AiTool } from '@/types';
import { getToolsFromSheet, addToolToSheet } from '@/lib/google-sheets';

// Mock data for now - replace with Google Sheets integration
// const tools: AiTool[] = [
//   {
//     id: '1',
//     name: 'Cool AI Tool 1',
//     description: 'This is a great tool for teachers.',
//     link: 'https://example.com/tool1',
//     tags: ['productivity', 'ai'],
//     createdBy: 'user123',
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: '2',
//     name: 'Amazing AI Assistant',
//     description: 'Helps with lesson planning.',
//     link: 'https://example.com/tool2',
//     tags: ['planning', 'assistant'],
//     createdBy: 'user456',
//     createdAt: new Date().toISOString(),
//   },
// ];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: Request) {
  try {
    const toolsFromSheet = await getToolsFromSheet();
    return NextResponse.json(toolsFromSheet);
  } catch (error) {
    console.error("Failed to get tools:", error);
    return NextResponse.json({ message: 'Failed to fetch tools', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate body if necessary using a library like Zod, or manually
    const { name, description, link, tags, createdBy } = body as Omit<AiTool, 'id' | 'createdAt'>;

    if (!name || !description || !link) {
      return NextResponse.json({ message: 'Missing required fields (name, description, link)' }, { status: 400 });
    }

    // Prepare the data for addToolToSheet, it will generate id and createdAt if not provided
    const toolDataForSheet: Omit<AiTool, 'id' | 'createdAt'> & { createdBy: string } = {
      name,
      description,
      link,
      tags: tags || [],
      createdBy: createdBy || 'anonymous', // Ensure createdBy is always a string
    };

    const newTool = await addToolToSheet(toolDataForSheet);
    // tools.push(newTool); // Mock: add to in-memory array - No longer needed

    return NextResponse.json(newTool, { status: 201 });
  } catch (error) {
    console.error("Failed to add tool:", error);
    return NextResponse.json({ message: (error as Error).message || 'Failed to add tool' }, { status: 500 });
  }
} 