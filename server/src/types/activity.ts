export interface Activity {
  id: number;
  board_id: number;
  card_id: number | null;
  user_id: number;
  action: string;
  details: Record<string, any>;
  created_at: Date;
}

export interface ActivityWithUser extends Activity {
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export type ActivityAction =
  | 'card_created'
  | 'card_updated'
  | 'card_deleted'
  | 'card_moved'
  | 'card_archived'
  | 'card_restored'
  | 'card_assigned'
  | 'card_unassigned'
  | 'card_labeled'
  | 'card_unlabeled'
  | 'column_created'
  | 'column_updated'
  | 'column_deleted'
  | 'column_moved'
  | 'checklist_created'
  | 'checklist_deleted'
  | 'checklist_item_created'
  | 'checklist_item_completed'
  | 'checklist_item_uncompleted'
  | 'comment_created'
  | 'comment_updated'
  | 'comment_deleted'
  | 'attachment_added'
  | 'attachment_removed'
  | 'member_added'
  | 'member_removed'
  | 'member_role_updated'
  | 'label_created'
  | 'label_updated'
  | 'label_deleted';

export interface ActivityFilter {
  action?: ActivityAction;
  cardId?: number;
  userId?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}
