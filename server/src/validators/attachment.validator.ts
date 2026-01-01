import { z } from 'zod';

export const attachmentUploadSchema = z.object({
  name: z.string().optional(),
});

export type AttachmentUploadInput = z.infer<typeof attachmentUploadSchema>;
