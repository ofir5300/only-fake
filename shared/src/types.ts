// API Response Types
export interface HealthCheckResponse {
  status: string;
  message: string;
}

export interface Article {
  title: string;
  url: string;
  date: string;
  description: string;
}

export interface FakeArticle extends Article {
  fake_title?: string;
  fake_description?: string;
  category?: string;
}
