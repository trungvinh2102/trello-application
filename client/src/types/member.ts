export interface BoardMember {
  id: number;
  board_id: number;
  user_id: number;
  role: 'admin' | 'member' | 'observer';
  joined_at: string;
}

export interface BoardMemberCreateInput {
  board_id: number;
  user_id?: number;
  email?: string;
  role: 'admin' | 'member' | 'observer';
}

export interface BoardMemberUpdateInput {
  role: 'admin' | 'member' | 'observer';
}
