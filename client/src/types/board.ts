import type { Column } from './column';

export interface Board {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  visibility: 'private' | 'workspace' | 'public';
  background_color: string | null;
  ordered_columns_id: string | null;
  created_at: string;
  updated_at: string;
  columns?: Column[];
  members?: BoardMemberResponse[];
}

export interface BoardCreateInput {
  name: string;
  description?: string;
  visibility?: 'private' | 'workspace' | 'public';
  background_color?: string;
}

export interface BoardUpdateInput {
  name?: string;
  description?: string;
  visibility?: 'private' | 'workspace' | 'public';
  background_color?: string;
}

export interface BoardMemberResponse {
  id: number;
  user_id: number;
  role: 'admin' | 'member' | 'observer';
  joined_at: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}
