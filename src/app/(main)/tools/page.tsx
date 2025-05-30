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
    throw new Error('Failed to fetch tools');
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
    tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <p>Loading tools...</p>;
  if (error) return <p>Error loading tools: {error}</p>;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Tools</h1>
        <Link href="/add-tool">
          <Button>Add New Tool</Button>
        </Link>
      </div>
      <Input
        type="text"
        placeholder="Search tools by name, description, or tag..."
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        className="mb-6"
      />
      {filteredTools.length === 0 && !loading && (
        <p>No tools found matching your criteria. Try a different search or <Link href="/add-tool" className="text-blue-500 hover:underline">add a new one</Link>!</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <Card key={tool.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                {tool.name}
                <a href={tool.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                  <ExternalLink size={20} />
                </a>
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <strong>Created by:</strong> {tool.createdBy}
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
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 