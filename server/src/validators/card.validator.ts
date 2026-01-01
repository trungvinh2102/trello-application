import { z } from 'zod';

export const cardCreateSchema = z.object({
  name: z.string().min(1, 'Card name is required').max(200, 'Card name must be at most 200 characters'),
  description: z.string().max(5000, 'Description must be at most 5000 characters').optional(),
  due_date: z.coerce.date().optional(),
  position: z.number().int().min(0, 'Position must be a non-negative integer').optional(),
});

export const cardUpdateSchema = z.object({
  name: z.string().min(1, 'Card name is required').max(200, 'Card name must be at most 200 characters').optional(),
  description: z.string().max(5000, 'Description must be at most 5000 characters').optional(),
  due_date: z.coerce.date().nullable().optional(),
  completed: z.boolean().optional(),
  position: z.number().int().min(0, 'Position must be a non-negative integer').optional(),
  column_id: z.number().int().positive('Column ID must be a positive integer').optional(),
});

export const cardMoveSchema = z.object({
  target_column_id: z.number().int().positive('Target column ID must be a positive integer'),
  position: z.number().int().min(0, 'Position must be a non-negative integer').optional(),
});

export const cardDuplicateSchema = z.object({
  target_column_id: z.number().int().positive('Target column ID must be a positive integer').optional(),
  name: z.string().min(1, 'Card name is required').max(200, 'Card name must be at most 200 characters').optional(),
});

export const cardArchiveSchema = z.object({
  archived: z.boolean(),
});

export const addMemberSchema = z.object({
  user_id: z.number().int().positive('User ID must be a positive integer').optional(),
  email: z.string().email('Invalid email address').optional(),
}).refine((data) => data.user_id || data.email, {
  message: 'Either user_id or email is required',
});

export const batchAddMembersSchema = z.object({
  userIds: z.array(z.number().int().positive('User ID must be a positive integer')).optional(),
  emails: z.array(z.string().email('Invalid email address')).optional(),
}).refine((data) => data.userIds || data.emails, {
  message: 'Either userIds or emails is required',
});

export type CardCreateInput = z.infer<typeof cardCreateSchema>;
export type CardUpdateInput = z.infer<typeof cardUpdateSchema>;
export type CardMoveInput = z.infer<typeof cardMoveSchema>;
export type CardDuplicateInput = z.infer<typeof cardDuplicateSchema>;
export type CardArchiveInput = z.infer<typeof cardArchiveSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type BatchAddMembersInput = z.infer<typeof batchAddMembersSchema>;
