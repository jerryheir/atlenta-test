export type ApiStatusType = 'success' | 'error';

export interface ApiResponse {
  status: ApiStatusType;
  displayMessage?: string;
  message?: string;
  data?: unknown;
  error?: unknown;
}
