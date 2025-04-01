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
  GEEKTIME: "geektime",
} as const;

export enum CATEGORIES {
  World = "World",
  USPolitics = "US Politics",
  Business = "Business",
  Markets = "Markets",
  Health = "Health",
  Entertainment = "Entertainment",
  Tech = "Tech",
  Style = "Style",
  Travel = "Travel",
  Sports = "Sports",
  Science = "Science",
  Climate = "Climate",
  War = "War",
}