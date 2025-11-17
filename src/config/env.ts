export const ENV = {
  MODE: import.meta.env.MODE,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL,
} as const;
