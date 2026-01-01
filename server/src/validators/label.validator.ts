import { z } from 'zod';
import { PREDEFINED_COLORS } from '../types/label';

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
const predefinedColorNames = PREDEFINED_COLORS.map((c) => c.name);

export const labelCreateSchema = z.object({
  name: z.string().min(1, 'Label name is required').max(50, 'Label name must be at most 50 characters'),
  color: z
    .string()
    .refine((val) => hexColorRegex.test(val) || predefinedColorNames.includes(val), {
      message: 'Color must be a valid hex code (#RRGGBB) or predefined color name',
    }),
});

export const labelUpdateSchema = z.object({
  name: z.string().min(1, 'Label name is required').max(50, 'Label name must be at most 50 characters').optional(),
  color: z
    .string()
    .refine((val) => hexColorRegex.test(val) || predefinedColorNames.includes(val), {
      message: 'Color must be a valid hex code (#RRGGBB) or predefined color name',
    })
    .optional(),
});

export const assignLabelSchema = z.object({
  labelId: z.number().int().positive('Label ID must be a positive integer'),
});

export const batchUpdateLabelsSchema = z.object({
  labelIds: z.array(z.number().int().positive('Label ID must be a positive integer')),
});

export type LabelCreateInput = z.infer<typeof labelCreateSchema>;
export type LabelUpdateInput = z.infer<typeof labelUpdateSchema>;
export type AssignLabelInput = z.infer<typeof assignLabelSchema>;
export type BatchUpdateLabelsInput = z.infer<typeof batchUpdateLabelsSchema>;
