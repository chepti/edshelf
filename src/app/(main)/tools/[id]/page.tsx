'use client';

import { useEffect, useState } from 'react';
import { AiTool } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ExternalLink, MessageSquare, Star, BookText, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchToolById } from '@/lib/client-utils';

// Using simple inline props for App Router page component
export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const [tool, setTool] = useState<AiTool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      fetchToolById(params.id)
        .then(data => {
          if (data) {
            setTool(data);
          } else {
            setError('כלי לא נמצא או שלא הצלחנו לטעון אותו.');
          }
        })
        .catch(err => {
          console.error('Error in useEffect fetching tool:', err);
          setError('אירעה שגיאה בטעינת הכלי.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>טוען פרטי כלי...</p></div>;
  }

  if (error) {
    return <div className="flex flex-col justify-center items-center h-screen text-red-500">
      <p>{error}</p>
      <Button onClick={() => window.location.reload()} className="mt-4">נסה שוב</Button>
      <Link href="/" passHref className="mt-2">
        <Button variant="outline">חזור לעמוד הראשי</Button>
      </Link>
    </div>;
  }

  if (!tool) {
    return <div className="flex justify-center items-center h-screen"><p>הכלי לא נמצא.</p></div>;
  }

  // Helper to format text with line breaks
  const formatTextWithLineBreaks = (text?: string) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => (
      <span key={index}>{line}<br /></span>
    ));
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl min-h-screen bg-background_color text-text_color font-rubik">
      <Card className="shadow-lg border-brand-primary/50">
        <CardHeader className="bg-brand-primary/10 p-4 md:p-6 rounded-t-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              {tool.logo && (
                <Image 
                  src={tool.logo} 
                  alt={`${tool.name} logo`} 
                  width={64} 
                  height={64} 
                  className="rounded-md mr-4 object-contain h-16 w-16"
                  onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
                />
              )}
              <CardTitle className="text-2xl md:text-3xl font-bold text-brand-primary">{tool.name}</CardTitle>
            </div>
            {tool.link && (
              <Button asChild variant="ghost" className="text-brand-accent hover:text-brand-accent/80 p-0 h-auto">
                <a href={tool.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm">
                  לאתר הכלי <ExternalLink className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0" />
                </a>
              </Button>
            )}
          </div>
          {tool.generalRating && (
            <div className="flex items-center mt-2">
              <Star className="h-5 w-5 text-yellow-400 mr-1 rtl:ml-1 rtl:mr-0" /> 
              <span className="text-lg font-semibold">{tool.generalRating}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-4">
          {tool.description && (
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">תיאור הכלי:</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{formatTextWithLineBreaks(tool.description)}</p>
            </div>
          )}

          {tool.pros && (
            <div className="bg-green-100/50 dark:bg-green-800/30 p-3 rounded-md">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-1">יתרונות:</h3>
              <p className="text-green-800 dark:text-green-300 whitespace-pre-line">{formatTextWithLineBreaks(tool.pros)}</p>
            </div>
          )}

          {tool.cons && (
            <div className="bg-red-100/50 dark:bg-red-800/30 p-3 rounded-md">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-1">חסרונות:</h3>
              <p className="text-red-800 dark:text-red-300 whitespace-pre-line">{formatTextWithLineBreaks(tool.cons)}</p>
            </div>
          )}

          {tool.limitations && (
            <div className="bg-yellow-100/50 dark:bg-yellow-800/30 p-3 rounded-md">
              <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-1">מגבלות:</h3>
              <p className="text-yellow-800 dark:text-yellow-300 whitespace-pre-line">{formatTextWithLineBreaks(tool.limitations)}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-gray-800/30 rounded-b-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
            {tool.uploadedBy && <p>הועלה על ידי: {tool.uploadedBy}</p>}
            {tool.timestamp && <p>תאריך עדכון: {new Date(tool.timestamp).toLocaleDateString('he-IL')}</p>}
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse">
            {/* Placeholder for future actions like adding reviews or examples */}
            <Button variant="outline" disabled>
              <MessageSquare className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> הוסף ביקורת
            </Button>
            <Button variant="outline" disabled>
                <BookText className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> הוסף דוגמה
            </Button>
            <Button variant="outline" disabled>
                <GraduationCap className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> הוסף הדרכה
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 