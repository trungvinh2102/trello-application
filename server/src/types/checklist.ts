export interface Checklist {
  id: number;
  name: string;
  card_id: number;
  position: number;
  created_at: Date;
}

export interface ChecklistWithProgress extends Checklist {
  total_items: number;
  completed_items: number;
  progress: number;
  items?: ChecklistItem[];
}

export interface ChecklistItem {
  id: number;
  checklist_id: number;
  name: string;
  completed: boolean;
  position: number;
  completed_at: Date | null;
}

export interface ChecklistCreateInput {
  name: string;
  position?: number;
}

export interface ChecklistUpdateInput {
  name?: string;
  position?: number;
}

export interface ChecklistItemCreateInput {
  name: string;
  position?: number;
}

export interface ChecklistItemUpdateInput {
  name?: string;
  completed?: boolean;
  position?: number;
}

export interface ReorderItemsInput {
  itemIds: number[];
}

export interface BatchCreateItemsInput {
  items: ChecklistItemCreateInput[];
}
