import type { Label } from './label';
import type { ChecklistWithProgress } from './checklist';

export interface Card {
  id: number;
  name: string;
  description: string | null;
  board_id: number;
  column_id: number;
  due_date: Date | null;
  completed: boolean;
  position: number;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
  is_overdue?: boolean;
}

export interface CardWithDetails extends Card {
  members: CardMemberResponse[];
  labels: Label[];
  checklists: ChecklistWithProgress[];
  comments_count?: number;
  attachments_count?: number;
}

export interface CardMember {
  id: number;
  card_id: number;
  user_id: number;
  assigned_at: Date;
}

export interface CardMemberWithUser extends CardMember {
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface CardMemberResponse {
  id: number;
  user_id: number;
  role: string;
  assigned_at: Date;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface CardCreateInput {
  name: string;
  description?: string;
  due_date?: Date | string;
  position?: number;
}

export interface CardUpdateInput {
  name?: string;
  description?: string;
  due_date?: Date | string | null;
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
