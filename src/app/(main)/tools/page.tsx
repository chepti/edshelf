'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AiTool } from '@/types';
import { Input } from "@/components/ui/input"; // Assuming shadcn/ui input is installed
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from 'lucide-react';

async function fetchTools(): Promise<AiTool[]> {
  const res = await fetch('/api/tools');
  if (!res.ok) {
    throw new Error('שגיאה באחזור הכלים');
  }
  return res.json();
}

export default function ToolsPage() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTools()
      .then(data => {
        setTools(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (loading) return <p>טוען כלים...</p>;
  if (error) return <p>שגיאה בטעינת הכלים: {error}</p>;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">מאגר הכלים</h1>
        <Link href="/add-tool">
          <Button className="bg-brand-accent hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-5xl transition-colors duration-150 shadow hover:shadow-md">הוספת כלי חדש</Button>
        </Link>
      </div>
      <Input
        type="text"
        placeholder="חיפוש כלים לפי שם, תיאור או תגית..."
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        className="mb-6"
      />
      {filteredTools.length === 0 && !loading && (
        <p>לא נמצאו כלים התואמים את החיפוש שלך. נסה חיפוש אחר או <Link href="/add-tool" className="text-blue-500 hover:underline">הוסף כלי חדש</Link>!</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <Card key={tool.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                {tool.name}
                <a href={tool.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700" title="פתח קישור בכרטיסיה חדשה">
                  <ExternalLink size={20} />
                </a>
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <strong>נוצר על ידי:</strong> {tool.createdBy}
              </div>
              {tool.tags && tool.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href={`/tools/${tool.id}`} className="w-full">
                <Button variant="outline" className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-2xl transition-colors duration-150">פרטים נוספים</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 