import { toast } from 'sonner';

export interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
  code?: string;
}

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized. Please login.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

export class ErrorHandler {
  static handle(error: unknown): never {
    console.error('Error:', error);

    if (this.isApiError(error)) {
      this.handleApiError(error);
      throw error;
    }

    if (this.isNetworkError(error)) {
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      throw error;
    }

    toast.error(ERROR_MESSAGES.UNKNOWN_ERROR);
    throw error;
  }

  static handleApiError(error: ApiError): void {
    const { response } = error;
    const { data, status } = response || {};

    if (status === 401) {
      toast.error(ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    if (status === 403) {
      toast.error(ERROR_MESSAGES.FORBIDDEN);
      return;
    }

    if (status === 404) {
      toast.error(ERROR_MESSAGES.NOT_FOUND);
      return;
    }

    if (status === 422) {
      toast.error(ERROR_MESSAGES.VALIDATION_ERROR);
      return;
    }

    if (status && status >= 500) {
      toast.error(ERROR_MESSAGES.SERVER_ERROR);
      return;
    }

    const errorMessage = data?.error || data?.message || error.message;
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }

  static isApiError(error: unknown): error is ApiError {
    return typeof error === 'object' && error !== null && 'response' in error;
  }

  static isNetworkError(error: unknown): error is Error {
    return (
      error instanceof Error &&
      (error.message.includes('Network Error') ||
        error.message.includes('timeout') ||
        error.message.includes('ERR_NETWORK'))
    );
  }

  static withErrorHandler<T extends (...args: unknown[]) => Promise<unknown>>(fn: T): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handle(error);
        throw error;
      }
    }) as T;
  }
}

export const handleError = (error: unknown) => ErrorHandler.handle(error);
