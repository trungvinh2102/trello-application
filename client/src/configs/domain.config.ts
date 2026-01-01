export const DOMAIN = {
  LOCAL: 'http://localhost:5000',
  PRODUCTION: '',
};

export const DOMAIN_CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || DOMAIN.LOCAL,
  BASE_URL: import.meta.env.VITE_BASE_URL || '/',
};
