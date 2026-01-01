export interface Comment {
  id: number;
  card_id: number;
  user_id: number;
  content: string;
  created_at: Date;
}

export interface CommentWithUser extends Comment {
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface CommentCreateInput {
  content: string;
}

export interface CommentUpdateInput {
  content: string;
}
