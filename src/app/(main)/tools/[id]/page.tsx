'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// import Link from 'next/link'; // Removed
import { AiTool, Review, Example } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { ExternalLink, MessageSquare, Star, PlusCircle, FileText, Users } from 'lucide-react'; // Modified
import { ExternalLink, MessageSquare, Star, PlusCircle, FileText } from 'lucide-react'; // Modified

// Mock fetching functions - replace with actual API calls
async function fetchToolById(id: string): Promise<AiTool | null> {
  const res = await fetch(`/api/tools/${id}`); // Fetch the specific tool by ID
  if (!res.ok) {
    if (res.status === 404) return null; // Tool not found
    throw new Error('שגיאה באחזור הכלי'); // Translated
  }
  return res.json();
}

async function fetchReviewsByToolId(toolId: string): Promise<Review[]> {
  const res = await fetch(`/api/reviews?toolId=${toolId}`);
  if (!res.ok) throw new Error('שגיאה באחזור הביקורות'); // Translated
  return res.json();
}

async function fetchExamplesByToolId(toolId: string): Promise<Example[]> {
  const res = await fetch(`/api/examples?toolId=${toolId}`);
  if (!res.ok) throw new Error('שגיאה באחזור הדוגמאות'); // Translated
  return res.json();
}

export default function ToolDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [tool, setTool] = useState<AiTool | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [examples, setExamples] = useState<Example[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      Promise.all([
        fetchToolById(id),
        fetchReviewsByToolId(id),
        fetchExamplesByToolId(id),
      ]).then(([toolData, reviewsData, examplesData]) => {
        setTool(toolData);
        setReviews(reviewsData);
        setExamples(examplesData);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setError("שגיאה בטעינת פרטי הכלי. " + err.message); // Translated
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <p>טוען פרטי כלי...</p>; // Translated
  if (error) return <p>שגיאה: {error}</p>; // Translated
  if (!tool) return <p>הכלי לא נמצא.</p>; // Translated

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-3xl font-bold">{tool.name}</CardTitle>
            <a href={tool.link} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-2xl transition-colors duration-150"><ExternalLink size={20} className="ms-2" />מעבר לכלי</Button>
            </a>
          </div>
          <CardDescription className="text-lg">{tool.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <strong>נוצר על ידי:</strong> {tool.createdBy} <br /> {/* Translated */}
            <strong>נוסף בתאריך:</strong> {new Date(tool.createdAt).toLocaleDateString()} {/* Translated */}
          </div>
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tool.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 text-yellow-500 mb-6">
            <Star fill="currentColor" /> 
            <span>{averageRating > 0 ? `${averageRating.toFixed(1)}/5 כוכבים` : 'אין עדיין ביקורות'} ({reviews.length} ביקורות)</span> {/* Translated */}
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold flex items-center"><MessageSquare className="ms-2" />ביקורות</h2>
          <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-2xl transition-colors duration-150"><PlusCircle className="ms-2"/>הוספת ביקורת</Button>
        </div>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <Card key={review.id} className="bg-gray-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">משתמש: {review.userId}</span> {/* Translated */}
                    <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} fill={i < review.rating ? "currentColor" : "none"} />)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>אין עדיין ביקורות. רוצה להוסיף את הביקורת הראשונה?</p>
        )}
      </section>

      {/* Examples & Tutorials Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold flex items-center"><FileText className="ms-2" />דוגמאות ומדריכים</h2>
          <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-2xl transition-colors duration-150"><PlusCircle className="ms-2"/>הוסף דוגמה / מדריך</Button>
        </div>
        {examples.length > 0 ? (
          <div className="space-y-4">
            {examples.map(example => (
              <Card key={example.id} className="bg-gray-50">
                <CardHeader>
                  <CardTitle>{example.title}</CardTitle>
                  <CardDescription>על ידי: {example.userId} בתאריך {new Date(example.createdAt).toLocaleDateString()}</CardDescription> {/* Translated */}
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{example.description}</p>
                  {example.link && 
                    <a href={example.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      <Button variant="link" size="sm"><ExternalLink size={16} className="ms-1"/>צפייה בקישור</Button> {/* Translated & RTL margin */}
                    </a>}
                  {example.fileUrl && 
                    <a href={example.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-2">
                       <Button variant="link" size="sm"><FileText size={16} className="ms-1"/>צפייה בקובץ</Button> {/* Translated & RTL margin */}
                    </a>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>אין עדיין דוגמאות או מדריכים. רוצה לשתף מהידע שלך?</p>
        )}
      </section>

      {/* TODO: Collections Section - ability for logged in user to add to their collection */}
      {/* <section>
        <h2 className="text-2xl font-semibold flex items-center"><Users className="mr-2"/>Add to Collection</h2>
         TODO: Implement this part 
      </section> */}
    </div>
  );
} 