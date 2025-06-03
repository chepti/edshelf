import { NextResponse } from 'next/server';
// AiTool might not be strictly needed here if addToolToSheet handles the exact type expected
// import { AiTool } from '@/types'; 
import { getToolsFromSheet, addToolToSheet } from '@/lib/google-sheets';
import { toolSchema, ToolFormData } from '@/lib/validators/toolSchema'; // Import Zod schema for validation
import { auth } from '@clerk/nextjs/server'; // To get user ID on server

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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate body using Zod schema
    const validationResult = toolSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const validatedData: ToolFormData = validationResult.data;

    // Prepare the data for addToolToSheet
    // addToolToSheet expects an object that matches Omit<AiTool, 'id' | 'timestamp' | 'generalRating'> & { generalRating?: string | number }
    // It will handle id and timestamp internally.
    // uploadedBy should be part of AiTool and thus passed through.
    const toolDataForSheet = {
      ...validatedData,
      uploadedBy: userId, // Overwrite/ensure uploadedBy is from the authenticated user
      // generalRating is already part of validatedData and correctly typed (number | undefined)
    };

    const newTool = await addToolToSheet(toolDataForSheet);

    return NextResponse.json(newTool, { status: 201 });
  } catch (error) {
    console.error("Failed to add tool:", error);
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
} 