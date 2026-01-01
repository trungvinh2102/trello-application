export interface Attachment {
  id: number;
  card_id: number;
  name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_at: Date;
}

export interface AttachmentCreateInput {
  name?: string;
}
