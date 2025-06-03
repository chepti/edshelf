'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AiTool } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming shadcn/ui textarea
import { Label } from "@/components/ui/label"; // Assuming shadcn/ui label
import { useUser } from '@clerk/nextjs';

const toolSchema = z.object({
  name: z.string().min(3, 'שם הכלי חייב להכיל לפחות 3 תווים'),
  description: z.string().min(10, 'התיאור חייב להכיל לפחות 10 תווים'),
  link: z.string().url('חייבת להיות כתובת URL חוקית'),
  tags: z.string().optional(), // Comma-separated tags
});

type ToolFormValues = z.infer<typeof toolSchema>;

export default function AddToolPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
  });

  const onSubmit: SubmitHandler<ToolFormValues> = async (data) => {
    if (!user) {
      setSubmitError("עליך להתחבר כדי להוסיף כלי.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    const toolData: Omit<AiTool, 'id' | 'createdAt'> = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      createdBy: user.id, // Or user.fullName, user.username etc.
    };

    try {
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toolData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'שגיאה בהוספת הכלי');
      }

      const newTool = await response.json();
      reset();
      router.push(`/tools/${newTool.id}`); // Navigate to the new tool's page
    } catch (error) {
      setSubmitError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">הוספת כלי בינה מלאכותית חדש</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="name">שם הכלי</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">תיאור</Label>
          <Textarea id="description" {...register('description')} />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <Label htmlFor="link">קישור לכלי</Label>
          <Input id="link" type="url" {...register('link')} />
          {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>}
        </div>

        <div>
          <Label htmlFor="tags">תגיות (מופרדות בפסיק)</Label>
          <Input id="tags" {...register('tags')} placeholder="לדוגמה: פרודוקטיביות, כתיבה, יצירת תמונות" />
        </div>

        {submitError && <p className="text-red-500">שגיאה: {submitError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'שולח...' : 'הוסף כלי'}
        </Button>
      </form>
    </div>
  );
} 