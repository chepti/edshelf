import * as z from 'zod';

export const toolSchema = z.object({
  name: z.string().min(2, { message: 'שם הכלי חייב להכיל לפחות 2 תווים.' }).max(100, { message: 'שם הכלי יכול להכיל עד 100 תווים.' }),
  link: z.string().url({ message: 'יש להזין כתובת URL חוקית.' }),
  logo: z.string().url({ message: 'כתובת הלוגו חייבת להיות URL חוקי.' }).optional().or(z.literal('')),
  description: z.string().min(10, { message: 'התיאור חייב להכיל לפחות 10 תווים.' }).max(2000, { message: 'התיאור יכול להכיל עד 2000 תווים.' }),
  generalRating: z.preprocess(
    (val) => (val === '' || val === undefined || val === null) ? undefined : parseFloat(String(val)),
    z.number().min(1, { message: 'הדירוג חייב להיות לפחות 1.' }).max(5, { message: 'הדירוג יכול להיות לכל היותר 5.' }).optional()
  ),
  pros: z.string().max(1000, { message: 'יתרונות יכולים להכיל עד 1000 תווים.' }).optional(),
  cons: z.string().max(1000, { message: 'חסרונות יכולים להכיל עד 1000 תווים.' }).optional(),
  limitations: z.string().max(1000, { message: 'מגבלות יכולות להכיל עד 1000 תווים.' }).optional(),
});

export type ToolFormData = z.infer<typeof toolSchema>; 