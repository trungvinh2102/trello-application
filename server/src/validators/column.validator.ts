import { z } from 'zod';

export const columnCreateSchema = z.object({
  name: z.string().min(1, 'Column name is required').max(100, 'Column name must be at most 100 characters'),
  position: z.number().int().min(0, 'Position must be a non-negative integer').optional(),
});

export const columnUpdateSchema = z.object({
  name: z.string().min(1, 'Column name is required').max(100, 'Column name must be at most 100 characters').optional(),
  position: z.number().int().min(0, 'Position must be a non-negative integer').optional(),
});

export const columnReorderSchema = z.object({
  columnIds: z
    .array(z.number().int().positive('Column ID must be a positive integer'))
    .min(1, 'At least one column ID is required'),
});

export const columnMoveSchema = z.object({
  targetBoardId: z.number().int().positive('Target board ID must be a positive integer'),
  position: z.number().int().min(0, 'Position must be a non-negative integer').optional(),
});

export const columnDuplicateSchema = z.object({
  newName: z.string().min(1, 'New column name is required').max(100, 'Column name must be at most 100 characters').optional(),
});

export type ColumnCreateInput = z.infer<typeof columnCreateSchema>;
export type ColumnUpdateInput = z.infer<typeof columnUpdateSchema>;
export type ColumnReorderInput = z.infer<typeof columnReorderSchema>;
export type ColumnMoveInput = z.infer<typeof columnMoveSchema>;
export type ColumnDuplicateInput = z.infer<typeof columnDuplicateSchema>;
