import { z } from 'zod';

export const boardCreateSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100, 'Board name must be at most 100 characters'),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional(),
  visibility: z.enum(['private', 'workspace', 'public']).optional().default('private'),
  background_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code')
    .optional(),
});

export const boardUpdateSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100, 'Board name must be at most 100 characters').optional(),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional(),
  visibility: z.enum(['private', 'workspace', 'public']).optional(),
  background_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code')
    .optional(),
});

export const addMemberSchema = z
  .object({
    user_id: z.number().optional(),
    email: z.string().email('Invalid email address').optional(),
    role: z.enum(['admin', 'member', 'observer']).default('member'),
  })
  .refine((data) => data.user_id || data.email, {
    message: 'Either user_id or email is required',
  });

export const updateMemberRoleSchema = z.object({
  role: z.enum(['admin', 'member', 'observer']),
});

export type BoardCreateInput = z.infer<typeof boardCreateSchema>;
export type BoardUpdateInput = z.infer<typeof boardUpdateSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
