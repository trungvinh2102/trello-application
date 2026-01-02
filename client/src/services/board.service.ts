import { apiClient } from '@/utils/apiClient';
import type { Board, BoardCreateInput, BoardUpdateInput, BoardMemberResponse } from '@/types';

export const boardService = {
  getBoard: async (id: string, includeCards = true) => {
    return apiClient.get(`/boards/${id}?includeCards=${includeCards}`);
  },

  getAllBoards: async (): Promise<Board[]> => {
    return apiClient.get('/boards');
  },

  createBoard: async (data: BoardCreateInput) => {
    return apiClient.post('/boards', data);
  },

  updateBoard: async (id: string, data: BoardUpdateInput) => {
    return apiClient.put(`/boards/${id}`, data);
  },

  deleteBoard: async (id: string) => {
    return apiClient.delete(`/boards/${id}`);
  },

  getMembers: async (boardId: string): Promise<BoardMemberResponse[]> => {
    return apiClient.get(`/boards/${boardId}/members`);
  },

  addMember: async (
    boardId: string,
    data: { user_id?: number; email?: string; role: 'admin' | 'member' | 'observer' }
  ) => {
    return apiClient.post(`/boards/${boardId}/members`, data);
  },

  updateMemberRole: async (
    boardId: string,
    userId: string,
    role: 'admin' | 'member' | 'observer'
  ) => {
    return apiClient.put(`/boards/${boardId}/members/${userId}`, { role });
  },

  removeMember: async (boardId: string, userId: string) => {
    return apiClient.delete(`/boards/${boardId}/members/${userId}`);
  },

  leaveBoard: async (boardId: string) => {
    return apiClient.delete(`/boards/${boardId}/members/leave`);
  },
};
