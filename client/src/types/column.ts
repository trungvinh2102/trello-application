import type { Card } from './card';

export interface Column {
  id: number;
  name: string;
  board_id: number;
  position: number;
  ordered_columns_id: string | null;
  created_at: string;
  updated_at: string;
  cards?: Card[];
}

export interface ColumnCreateInput {
  name: string;
  position?: number;
}

export interface ColumnUpdateInput {
  name?: string;
  position?: number;
}
