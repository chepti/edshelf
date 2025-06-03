'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ToolForm } from '@/components/forms/ToolForm'; // ToolFormData removed from this import
import { ToolFormData } from '@/lib/validators/toolSchema'; // Import ToolFormData from its definition file
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AiTool } from '@/types'; // For the return type of the API

export default function AddToolPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false); // Renamed from isSubmitting for clarity in page context

  const handleSubmit = async (values: ToolFormData) => {
    if (!user) {
      toast.error('עליך להיות מחובר כדי להוסיף כלי.');
      return;
    }

    setIsLoading(true);
    // Construct the data payload, ensuring generalRating is a number if present, or undefined
    const payload = {
      ...values,
      generalRating: values.generalRating !== undefined ? Number(values.generalRating) : undefined,
      uploadedBy: user.id, 
    };

    try {
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      setIsLoading(false);
      if (response.ok) {
        const newTool: AiTool = await response.json();
        toast.success('הכלי נוסף בהצלחה!');
        router.push(`/tools/${newTool.id}`); // Navigate to the new tool's page
      } else {
        const errorData = await response.json();
        console.error('Failed to add tool:', errorData);
        toast.error(errorData.message || 'שגיאה בהוספת הכלי. נסה שוב.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('An unexpected error occurred:', error);
      toast.error('שגיאה לא צפויה. בדוק את החיבור שלך ונסה שוב.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-brand-primary">הוספת כלי AI חדש למאגר</CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400 pt-2">
            שתף את הקהילה בכלי שמצאת ושיכול לעזור למורים אחרים!
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          {/* Pass isLoading to the form to potentially disable its own submit button if needed, or use ToolForm's internal isSubmitting */} 
          <ToolForm onSubmit={handleSubmit} submitButtonText={isLoading ? 'מוסיף כלי...' : 'הוסף כלי למאגר'} />
        </CardContent>
      </Card>
    </div>
  );
} 