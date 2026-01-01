import { z } from 'zod';

export const checklistCreateSchema = z.object({
  name: z.string().min(1, 'Checklist name is required').max(100, 'Checklist name must be at most 100 characters'),
  position: z.number().int().min(0, 'Position must be a non-negative integer').optional(),
});

export const checklistUpdateSchema = z.object({
  name: z.string().min(1, 'Checklist name is required').max(100, 'Checklist name must be at most 100 characters').optional(),
  position: z.number().int().min(0, 'Position must be a non-negative integer').optional(),
});

export const checklistItemCreateSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(200, 'Item name must be at most 200 characters'),
  position: z.number().int().min(0, 'Position must be a non-negative integer').optional(),
});

export const checklistItemUpdateSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(200, 'Item name must be at most 200 characters').optional(),
  completed: z.boolean().optional(),
  position: z.number().int().min(0, 'Position must be a non-negative integer').optional(),
});

export const reorderItemsSchema = z.object({
  itemIds: z
    .array(z.number().int().positive('Item ID must be a positive integer'))
    .min(1, 'At least one item ID is required'),
});

export const batchCreateItemsSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required').max(200, 'Item name must be at most 200 characters'),
        position: z.number().int().min(0, 'Position must be a non-negative integer').optional(),
      })
    )
    .min(1, 'At least one item is required'),
});

export type ChecklistCreateInput = z.infer<typeof checklistCreateSchema>;
export type ChecklistUpdateInput = z.infer<typeof checklistUpdateSchema>;
export type ChecklistItemCreateInput = z.infer<typeof checklistItemCreateSchema>;
export type ChecklistItemUpdateInput = z.infer<typeof checklistItemUpdateSchema>;
export type ReorderItemsInput = z.infer<typeof reorderItemsSchema>;
export type BatchCreateItemsInput = z.infer<typeof batchCreateItemsSchema>;
