export interface Column {
  id: number;
  name: string;
  board_id: number;
  position: number;
  ordered_columns_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ColumnWithCards extends Column {
  cards_count?: number;
}

export interface ColumnWithCardsFull extends Column {
  cards: Card[];
}

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
}

export interface ColumnCreateInput {
  name: string;
  position?: number;
}

export interface ColumnUpdateInput {
  name?: string;
  position?: number;
}

export interface ColumnReorderInput {
  columnIds: number[];
}

export interface ColumnArchiveInput {
  archived: boolean;
}

export interface ColumnMoveInput {
  targetBoardId: number;
  position?: number;
}

export interface ColumnDuplicateInput {
  newName?: string;
}
