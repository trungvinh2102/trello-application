import type { Label } from './label';
import type { CardMemberWithUser } from './cardMember';

export interface Card {
  id: number;
  name: string;
  description: string | null;
  board_id: number;
  column_id: number;
  due_date: string | null;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  is_overdue?: boolean;
}

export interface CardWithDetails extends Card {
  members: CardMemberWithUser[];
  labels: Label[];
  checklists_count?: number;
  comments_count?: number;
  attachments_count?: number;
}

export interface CardCreateInput {
  name: string;
  description?: string;
  due_date?: string;
  position?: number;
}

export interface CardUpdateInput {
  name?: string;
  description?: string;
  due_date?: string | null;
  completed?: boolean;
  position?: number;
  column_id?: number;
}

export interface CardMoveInput {
  target_column_id: number;
  position?: number;
}

export interface CardDuplicateInput {
  target_column_id?: number;
  name?: string;
}

export interface CardArchiveInput {
  archived: boolean;
}
