'use client';

import { useEffect, useState } from 'react';
import { AiTool } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ExternalLink, MessageSquare, Star, BookText, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock fetching functions - replace with actual API calls
async function fetchToolById(id: string): Promise<AiTool | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tools/${id}`);
  if (!res.ok) {
    console.error('Failed to fetch tool', res.status, await res.text());
    return null;
  }
  try {
    return await res.json();
  } catch (e) {
    console.error('Failed to parse tool JSON', e);
    return null;
  }
}

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const [tool, setTool] = useState<AiTool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      const loadTool = async () => {
        setLoading(true);
        try {
          const fetchedTool = await fetchToolById(params.id);
          if (fetchedTool) {
            setTool(fetchedTool);
          } else {
            setError('כלי לא נמצא.'); // Tool not found
          }
        } catch (e) {
          console.error('Error fetching tool details:', e);
          setError('שגיאה בטעינת פרטי הכלי.'); // Error loading tool details
        }
        setLoading(false);
      };
      loadTool();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg">טוען פרטי כלי...</p> {/* Loading tool details... */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">שגיאה</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">{error}</p>
        <Link href="/tools" className="mt-6 inline-block bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
          חזרה לרשימת הכלים
        </Link>
      </div>
    );
  }
  
  if (!tool) {
    // This case should ideally be handled by the error state above if fetchToolById returns null
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-brand-primary mb-4">אופס! כלי לא נמצא</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          לא הצלחנו למצוא את הכלי שחיפשת. ייתכן שהוא הוסר או שהכתובת אינה נכונה.
        </p>
        <Link href="/tools" className="mt-6 inline-block bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
          חזרה לרשימת הכלים
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {tool.logo && (
            <Image 
              src={tool.logo} 
              alt={`${tool.name} logo`} 
              width={80} 
              height={80} 
              className="rounded-lg object-contain aspect-square border p-1"
            />
          )}
          <div className="flex-1">
            <CardTitle className="text-3xl font-bold text-brand-primary mb-2">{tool.name}</CardTitle>
            {tool.generalRating && (
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="text-lg font-semibold">{String(tool.generalRating)}</span>
              </div>
            )}
          </div>
          {tool.link && (
            <Button asChild className="md:ml-auto bg-brand-accent hover:bg-brand-accent/90 text-white rounded-2xl">
              <a href={tool.link} target="_blank" rel="noopener noreferrer">
                מעבר לכלי <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">תיאור הכלי:</h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{tool.description}</p>
          </div>

          {tool.pros && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-400">יתרונות:</h3>
              <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-md shadow-sm">
                <p className="whitespace-pre-wrap">{tool.pros}</p>
              </div>
            </div>
          )}

          {tool.cons && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-red-700 dark:text-red-400">חסרונות:</h3>
              <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-md shadow-sm">
                <p className="whitespace-pre-wrap">{tool.cons}</p>
              </div>
            </div>
          )}

          {tool.limitations && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-yellow-700 dark:text-yellow-400">מגבלות:</h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 p-4 rounded-md shadow-sm">
                <p className="whitespace-pre-wrap">{tool.limitations}</p>
              </div>
            </div>
          )}
          
          {tool.uploadedBy && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">הועלה על ידי: {tool.uploadedBy}</p>
          )}
          {tool.timestamp && (
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">נוסף בתאריך: {new Date(tool.timestamp).toLocaleDateString('he-IL')}</p>
          )}

        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 pt-6 border-t">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">קהילה ומשאבים נוספים:</h3>
            <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-2xl">
                    <MessageSquare className="ml-2 h-4 w-4" /> הוספת ביקורת
                </Button>
                <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-2xl">
                    <BookText className="ml-2 h-4 w-4" /> הוסף דוגמה / פרומפט
                </Button>
                <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-2xl">
                    <GraduationCap className="ml-2 h-4 w-4" /> הוסף מדריך
                </Button>
            </div>
            {/* Sections for displaying reviews, examples, tutorials will go here */}
        </CardFooter>
      </Card>
    </div>
  );
} 