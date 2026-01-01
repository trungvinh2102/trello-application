export interface Card {
  id: number;
  column_id: number;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: number;
  board_id: number;
  title: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  cards?: Card[];
}

export interface Board {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  columns?: Column[];
}
