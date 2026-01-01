export interface Label {
  id: number;
  name: string;
  color: string;
  board_id: number;
  created_at: Date;
}

export interface LabelCreateInput {
  name: string;
  color: string;
}

export interface LabelUpdateInput {
  name?: string;
  color?: string;
}

export interface PredefinedColor {
  name: string;
  hex: string;
}

export const PREDEFINED_COLORS: PredefinedColor[] = [
  { name: 'red', hex: '#ef4444' },
  { name: 'orange', hex: '#f97316' },
  { name: 'yellow', hex: '#eab308' },
  { name: 'green', hex: '#22c55e' },
  { name: 'teal', hex: '#14b8a6' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'indigo', hex: '#6366f1' },
  { name: 'purple', hex: '#a855f7' },
  { name: 'pink', hex: '#ec4899' },
  { name: 'gray', hex: '#6b7280' },
];
