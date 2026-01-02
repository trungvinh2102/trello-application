import type { Column } from './column';

export type BoardVisibility = 'private' | 'workspace' | 'public';
export type BoardMemberRole = 'admin' | 'member' | 'observer';

export interface Board {
  id: number;
  name: string;
  description: string | null;
  owner_id: number;
  visibility: BoardVisibility;
  background_color: string | null;
  ordered_columns_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface BoardCreateInput {
  name: string;
  description?: string;
  visibility?: BoardVisibility;
  background_color?: string;
}

export interface BoardUpdateInput {
  name?: string;
  description?: string;
  visibility?: BoardVisibility;
  background_color?: string;
}

export interface BoardMember {
  id: number;
  board_id: number;
  user_id: number;
  role: BoardMemberRole;
  joined_at: Date;
}

export interface BoardMemberWithUser extends BoardMember {
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface BoardMemberCreateInput {
  board_id: number;
  user_id?: number;
  email?: string;
  role: BoardMemberRole;
}

export interface BoardMemberUpdateInput {
  role: BoardMemberRole;
}

export interface BoardMemberResponse {
  id: number;
  user_id: number;
  role: BoardMemberRole;
  joined_at: Date;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface BoardWithMembers extends Board {
  members: BoardMemberResponse[];
  columns?: (Column & { cards?: any[] })[];
}

export interface BoardUser {
  board_id: number;
  board_name: string;
  role: BoardMemberRole;
}
