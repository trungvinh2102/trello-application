import { apiClient } from '@/utils/apiClient';
import type {
  Card,
  CardCreateInput,
  CardUpdateInput,
  CardMoveInput,
  CardDuplicateInput,
  CardArchiveInput,
  CardMemberWithUser,
} from '@/types';

export const cardService = {
  getCards: async (columnId: string): Promise<Card[]> => {
    return apiClient.get(`/columns/${columnId}/cards`);
  },

  getCard: async (id: string): Promise<Card> => {
    return apiClient.get(`/cards/${id}`);
  },

  createCard: async (columnId: string, data: CardCreateInput) => {
    return apiClient.post(`/columns/${columnId}/cards`, data);
  },

  updateCard: async (id: string, data: CardUpdateInput) => {
    return apiClient.put(`/cards/${id}`, data);
  },

  deleteCard: async (id: string) => {
    return apiClient.delete(`/cards/${id}`);
  },

  moveCard: async (id: string, data: CardMoveInput) => {
    return apiClient.put(`/cards/${id}/move`, data);
  },

  duplicateCard: async (id: string, data?: CardDuplicateInput) => {
    return apiClient.post(`/cards/${id}/duplicate`, data || {});
  },

  archiveCard: async (id: string, data: CardArchiveInput) => {
    return apiClient.put(`/cards/${id}/archive`, data);
  },

  getMembers: async (id: string): Promise<CardMemberWithUser[]> => {
    return apiClient.get(`/cards/${id}/members`);
  },

  addMember: async (id: string, data: { user_id?: number; email?: string }) => {
    return apiClient.post(`/cards/${id}/members`, data);
  },

  removeMember: async (id: string, userId: string) => {
    return apiClient.delete(`/cards/${id}/members/${userId}`);
  },

  batchAddMembers: async (id: string, data: { userIds?: number[]; emails?: string[] }) => {
    return apiClient.post(`/cards/${id}/members/batch`, data);
  },
};
