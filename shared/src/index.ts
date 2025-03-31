// API Response Types
export interface DummyData {
  message: string;
  timestamp: string;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
}

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: "/api/health",
  DUMMY_DATA: "/api/dummy-data",
} as const;

// API Base URL
export const API_BASE_URL = "http://localhost:3002";
