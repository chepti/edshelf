'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, ControllerRenderProps } from 'react-hook-form';
// import * as z from 'zod'; // Removed as z is not directly used here
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  // FormDescription, // Removed as it was unused
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toolSchema, ToolFormData } from '@/lib/validators/toolSchema';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ToolFormProps {
  onSubmit: (values: ToolFormData) => Promise<void>;
  initialData?: Partial<ToolFormData>; // For editing later, not used for add-tool page initially
  submitButtonText?: string;
}

export function ToolForm({ 
  onSubmit,
  initialData = {},
  submitButtonText = 'הוספת כלי' 
}: ToolFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: initialData?.name || '',
      link: initialData?.link || '',
      logo: initialData?.logo || '',
      description: initialData?.description || '',
      generalRating: initialData?.generalRating || undefined,
      pros: initialData?.pros || '',
      cons: initialData?.cons || '',
      limitations: initialData?.limitations || '',
    },
  });

  async function handleFormSubmit(values: ToolFormData) {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      // Form reset can be handled by the parent component after successful submission if navigation occurs
      // form.reset(); // Optionally reset form here or manage state in parent
    } catch (error) {
      console.error("Submission error", error);
      // Error handling (e.g., toast notification) can be done in the parent or here
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: ControllerRenderProps<ToolFormData, 'name'> }) => (
            <FormItem>
              <FormLabel>שם הכלי <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="לדוגמה: Canva, ChatGPT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }: { field: ControllerRenderProps<ToolFormData, 'link'> }) => (
            <FormItem>
              <FormLabel>קישור לאתר הכלי <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} dir="ltr"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo"
          render={({ field }: { field: ControllerRenderProps<ToolFormData, 'logo'> }) => (
            <FormItem>
              <FormLabel>קישור ללוגו (אופציונלי)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} dir="ltr"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }: { field: ControllerRenderProps<ToolFormData, 'description'> }) => (
            <FormItem>
              <FormLabel>תיאור הכלי <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="תארו את הכלי, מה הוא מאפשר, למי הוא מתאים..."
                  className="resize-y min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="generalRating"
          render={({ field }: { field: ControllerRenderProps<ToolFormData, 'generalRating'> }) => (
            <FormItem>
              <FormLabel>דירוג כללי (1-5, אופציונלי)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="לדוגמה: 4.5" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} value={field.value === undefined ? '' : field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pros"
          render={({ field }: { field: ControllerRenderProps<ToolFormData, 'pros'> }) => (
            <FormItem>
              <FormLabel>יתרונות (אופציונלי)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="מהם היתרונות הבולטים של הכלי? (כל יתרון בשורה חדשה או מופרד בפסיק)"
                  className="resize-y min-h-[60px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cons"
          render={({ field }: { field: ControllerRenderProps<ToolFormData, 'cons'> }) => (
            <FormItem>
              <FormLabel>חסרונות (אופציונלי)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="מהם החסרונות או האתגרים בשימוש בכלי?"
                  className="resize-y min-h-[60px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="limitations"
          render={({ field }: { field: ControllerRenderProps<ToolFormData, 'limitations'> }) => (
            <FormItem>
              <FormLabel>מגבלות (אופציונלי)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="האם יש מגבלות טכניות, במודל החינמי, וכדומה?"
                  className="resize-y min-h-[60px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold py-3 rounded-xl text-lg" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'שולח...' : submitButtonText}
        </Button>
      </form>
    </Form>
  );
} 