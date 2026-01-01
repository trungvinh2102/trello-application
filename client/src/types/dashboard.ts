export interface DashboardStats {
  totalBoards: number;
  totalColumns: number;
  totalCards: number;
  activeCards: number;
  completedCards: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface Activity {
  id: string;
  type: 'board' | 'column' | 'card';
  action: string;
  timestamp: string;
}

export interface DashboardData {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
}
