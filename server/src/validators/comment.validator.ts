import { z } from 'zod';

export const commentCreateSchema = z.object({
  content: z.string().min(1, 'Content is required').max(5000, 'Content must be at most 5000 characters'),
});

export const commentUpdateSchema = z.object({
  content: z.string().min(1, 'Content is required').max(5000, 'Content must be at most 5000 characters'),
});

export type CommentCreateInput = z.infer<typeof commentCreateSchema>;
export type CommentUpdateInput = z.infer<typeof commentUpdateSchema>;
