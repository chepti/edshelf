import { NextResponse } from 'next/server';
import { Collection } from '@/types';
import { auth } from '@clerk/nextjs/server';

// Mock data for now - in a real app, this would be in a database and scoped by userId
const collections: Collection[] = [];

export async function GET(_request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // const userCollections = await getUserCollectionsFromDb(userId);
    const userCollections = collections.filter(col => col.userId === userId);
    return NextResponse.json(userCollections);
  } catch (error) {
    console.error("Failed to get collections:", error);
    return NextResponse.json({ message: 'Failed to fetch collections', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, toolIds } = body as Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

    if (!name) {
      return NextResponse.json({ message: 'Collection name is required' }, { status: 400 });
    }

    const newCollection: Collection = {
      id: String(Date.now()),
      userId,
      name,
      toolIds: toolIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // await saveUserCollectionToDb(newCollection);
    collections.push(newCollection);

    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    console.error("Failed to create collection:", error);
    return NextResponse.json({ message: 'Failed to create collection', error: (error as Error).message }, { status: 500 });
  }
}

// TODO: Add PUT for updating a collection (e.g., adding/removing tools)
// TODO: Add DELETE for deleting a collection 