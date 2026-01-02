export interface CardMember {
  id: number;
  card_id: number;
  user_id: number;
  assigned_at: string;
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
  assigned_at: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}
