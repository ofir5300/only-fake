// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: "/health",
  ARTICLES: "/articles",
  ARTICLES_STREAM: "/articles/stream",
} as const;

// API Base URL
export const API_BASE_URL = "http://localhost:3002";

export const SOURCES = {
  CNN: "cnn",
} as const;
