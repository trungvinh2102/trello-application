import { DOMAIN_CONFIG } from './domain.config';

export const API = {
  AUTH: '/auth',
  USERS: '/users',
  BOARDS: '/boards',
  COLUMNS: '/columns',
  CARDS: '/cards',
  TASKS: '/tasks',
};

export const API_CONFIG = {
  BASE_URL: DOMAIN_CONFIG.API_URL.endsWith('/api')
    ? DOMAIN_CONFIG.API_URL
    : `${DOMAIN_CONFIG.API_URL}/api`,
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  LOGIN: `${API.AUTH}/login`,
  REGISTER: `${API.AUTH}/register`,
  LOGOUT: `${API.AUTH}/logout`,
  REFRESH: `${API.AUTH}/refresh`,

  GET_CURRENT_USER: `${API.USERS}/me`,

  GET_BOARDS: API.BOARDS,
  GET_BOARD: (id: string) => `${API.BOARDS}/${id}`,
  CREATE_BOARD: API.BOARDS,
  UPDATE_BOARD: (id: string) => `${API.BOARDS}/${id}`,
  DELETE_BOARD: (id: string) => `${API.BOARDS}/${id}`,

  GET_COLUMNS: (boardId: string) => `${API.BOARDS}/${boardId}${API.COLUMNS}`,
  CREATE_COLUMN: (boardId: string) => `${API.BOARDS}/${boardId}${API.COLUMNS}`,
  UPDATE_COLUMN: (boardId: string, columnId: string) =>
    `${API.BOARDS}/${boardId}${API.COLUMNS}/${columnId}`,
  DELETE_COLUMN: (boardId: string, columnId: string) =>
    `${API.BOARDS}/${boardId}${API.COLUMNS}/${columnId}`,

  GET_CARDS: (boardId: string, columnId: string) =>
    `${API.BOARDS}/${boardId}${API.COLUMNS}/${columnId}${API.CARDS}`,
  CREATE_CARD: (boardId: string, columnId: string) =>
    `${API.BOARDS}/${boardId}${API.COLUMNS}/${columnId}${API.CARDS}`,
  UPDATE_CARD: (boardId: string, columnId: string, cardId: string) =>
    `${API.BOARDS}/${boardId}${API.COLUMNS}/${columnId}${API.CARDS}/${cardId}`,
  DELETE_CARD: (boardId: string, columnId: string, cardId: string) =>
    `${API.BOARDS}/${boardId}${API.COLUMNS}/${columnId}${API.CARDS}/${cardId}`,
};
