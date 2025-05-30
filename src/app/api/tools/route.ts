import { NextResponse } from 'next/server';
import { AiTool } from '@/types';
// import { getToolsFromSheet, addToolToSheet } from '@/lib/google-sheets'; // Placeholder for actual functions

// Mock data for now - replace with Google Sheets integration
let tools: AiTool[] = [
  {
    id: '1',
    name: 'Cool AI Tool 1',
    description: 'This is a great tool for teachers.',
    link: 'https://example.com/tool1',
    tags: ['productivity', 'ai'],
    createdBy: 'user123',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Amazing AI Assistant',
    description: 'Helps with lesson planning.',
    link: 'https://example.com/tool2',
    tags: ['planning', 'assistant'],
    createdBy: 'user456',
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    // In the future, this will call a function like getToolsFromSheet()
    // const toolsFromSheet = await getToolsFromSheet();
    // return NextResponse.json(toolsFromSheet);
    return NextResponse.json(tools);
  } catch (error) {
    console.error("Failed to get tools:", error);
    return NextResponse.json({ message: 'Failed to fetch tools', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, link, tags, createdBy } = body as Omit<AiTool, 'id' | 'createdAt'>;

    if (!name || !description || !link) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newTool: AiTool = {
      id: String(Date.now()), // Simple ID generation for now
      name,
      description,
      link,
      tags: tags || [],
      createdBy: createdBy || 'anonymous', // Handle anonymous or get from session
      createdAt: new Date().toISOString(),
    };

    // In the future, this will call a function like addToolToSheet(newTool)
    // await addToolToSheet(newTool);
    tools.push(newTool); // Mock: add to in-memory array

    return NextResponse.json(newTool, { status: 201 });
  } catch (error) {
    console.error("Failed to add tool:", error);
    return NextResponse.json({ message: 'Failed to add tool', error: (error as Error).message }, { status: 500 });
  }
} 