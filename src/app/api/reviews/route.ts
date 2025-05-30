import { NextResponse } from 'next/server';
import { Review } from '@/types';
// import { getReviewsFromSheet, addReviewToSheet } from '@/lib/google-sheets';

let reviews: Review[] = []; // Mock data

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const toolId = searchParams.get('toolId');

  try {
    if (toolId) {
      // const toolReviews = await getReviewsFromSheet(toolId);
      const toolReviews = reviews.filter(review => review.toolId === toolId);
      return NextResponse.json(toolReviews);
    }
    // Potentially return all reviews if no toolId, or handle as an error/bad request
    return NextResponse.json(reviews); // Or filter as needed
  } catch (error) {
    console.error("Failed to get reviews:", error);
    return NextResponse.json({ message: 'Failed to fetch reviews', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toolId, userId, rating, comment } = body as Omit<Review, 'id' | 'createdAt'>;

    if (!toolId || !userId || rating === undefined || !comment) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const newReview: Review = {
      id: String(Date.now()),
      toolId,
      userId, // In a real app, get this from the authenticated session (e.g., Clerk)
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    // await addReviewToSheet(newReview);
    reviews.push(newReview);

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Failed to add review:", error);
    return NextResponse.json({ message: 'Failed to add review', error: (error as Error).message }, { status: 500 });
  }
} 