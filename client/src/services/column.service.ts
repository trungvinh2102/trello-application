import { apiClient } from '@/utils/apiClient';
import type { ColumnCreateInput, ColumnUpdateInput } from '@/types';

export const columnService = {
  getColumns: async (boardId: string, includeCards = false) => {
    return apiClient.get(`/boards/${boardId}/columns?includeCards=${includeCards}`);
  },

  getColumn: async (id: string, includeCards = false) => {
    return apiClient.get(`/columns/${id}?includeCards=${includeCards}`);
  },

  createColumn: async (boardId: string, data: ColumnCreateInput) => {
    return apiClient.post(`/boards/${boardId}/columns`, data);
  },

  updateColumn: async (id: string, data: ColumnUpdateInput) => {
    return apiClient.put(`/columns/${id}`, data);
  },

  deleteColumn: async (id: string) => {
    return apiClient.delete(`/columns/${id}`);
  },

  reorderColumns: async (boardId: string, columnIds: number[]) => {
    return apiClient.put(`/boards/${boardId}/columns/reorder`, { columnIds });
  },

  duplicateColumn: async (id: string, newName?: string) => {
    return apiClient.post(`/columns/${id}/duplicate`, { newName });
  },

  moveColumn: async (id: string, targetBoardId: number, position?: number) => {
    return apiClient.put(`/columns/${id}/move`, { targetBoardId, position });
  },
};
